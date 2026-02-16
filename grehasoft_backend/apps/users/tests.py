import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from model_bakery import baker
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import AccessToken

from apps.users.models import Role, Department

User = get_user_model()

class UserModuleTests(APITestCase):
    """
    Final security and identity tests for Grehasoft PMS.
    Verifies JWT claims, RBAC permissions, and soft-delete integrity.
    """

    def setUp(self):
        # Setup Roles
        self.role_admin = baker.make('users.Role', slug='SUPER_ADMIN')
        self.role_pm = baker.make('users.Role', slug='PROJECT_MANAGER')
        self.role_member = baker.make('users.Role', slug='TEAM_MEMBER')

        # Setup Departments
        self.dept_software = baker.make('users.Department', name='Software')
        self.dept_marketing = baker.make('users.Department', name='Marketing')

        # Setup Admin User
        self.admin_user = User.objects.create_superuser(
            email="admin@grehasoft.com",
            password="password123",
            first_name="Admin",
            last_name="User",
            role=self.role_admin,
            department=self.dept_software
        )

        # Setup Regular User
        self.pm_user = User.objects.create_user(
            email="pm@grehasoft.com",
            password="password123",
            first_name="Manager",
            last_name="One",
            role=self.role_pm,
            department=self.dept_software
        )

        self.login_url = reverse('api_v1:users:login')
        self.user_list_url = reverse('api_v1:users:user-list')
        self.me_url = reverse('api_v1:users:user-me')

    # --- 1. Authentication & JWT Tests ---

    def test_jwt_custom_claims(self):
        """Verify that JWT contains department and role for frontend routing."""
        response = self.client.post(self.login_url, {
            'email': 'pm@grehasoft.com',
            'password': 'password123'
        })
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        access_token = response.data['access']
        
        # Decode token to verify claims
        token = AccessToken(access_token)
        self.assertEqual(token['role'], 'PROJECT_MANAGER')
        self.assertEqual(token['department'], 'software')
        self.assertEqual(token['email'], 'pm@grehasoft.com')

    def test_suspended_user_login(self):
        """Security: Suspended users should not be able to obtain a token."""
        self.pm_user.status = 'suspended'
        self.pm_user.save()

        response = self.client.post(self.login_url, {
            'email': 'pm@grehasoft.com',
            'password': 'password123'
        })
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("suspended", response.data[0])

    # --- 2. User Manager & Soft Delete Tests ---

    def test_user_manager_soft_delete(self):
        """Verify that 'deleted' users are excluded from standard queries."""
        initial_count = User.objects.count()
        
        # Perform soft delete
        self.pm_user.delete()
        
        # UserManager.get_queryset should filter them out
        self.assertEqual(User.objects.count(), initial_count - 1)
        
        # But they should still exist in the database for audit integrity
        self.assertTrue(User.all_objects.filter(email='pm@grehasoft.com').exists())

    # --- 3. RBAC & Scoping Tests ---

    def test_admin_can_list_all_users(self):
        """RBAC: Admin should see users from all departments."""
        # Create a marketing user
        baker.make('users.User', department=self.dept_marketing, role=self.role_member)
        
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(self.user_list_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # 1 Admin + 1 PM + 1 New Marketing User = 3
        self.assertEqual(response.data['count'], 3)

    def test_pm_limited_user_visibility(self):
        """Scoping: PM should only see users in their own department."""
        # Create a marketing user
        baker.make('users.User', department=self.dept_marketing, role=self.role_member)
        
        self.client.force_authenticate(user=self.pm_user)
        response = self.client.get(self.user_list_url)
        
        # Should only see 2 (self and admin, who is in same Software dept)
        self.assertEqual(response.data['count'], 2)
        for user_data in response.data['results']:
            self.assertEqual(user_data['department_details']['name'], 'Software')

    # --- 4. Profile (/me) Endpoint Tests ---

    def test_user_can_retrieve_own_profile(self):
        """UX: Users must be able to access their own profile info."""
        self.client.force_authenticate(user=self.pm_user)
        response = self.client.get(self.me_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'pm@grehasoft.com')
        self.assertEqual(response.data['role_details']['slug'], 'PROJECT_MANAGER')

    def test_user_can_update_own_profile(self):
        """UX: Users can update their names but not their roles/departments."""
        self.client.force_authenticate(user=self.pm_user)
        
        payload = {
            "first_name": "UpdatedName",
            "role": 1 # Attempting to change role to Admin (ID 1)
        }
        
        response = self.client.patch(self.me_url, payload)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        self.pm_user.refresh_from_db()
        self.assertEqual(self.pm_user.first_name, "UpdatedName")
        # Role should NOT have changed (read-only/extra_kwargs in serializer)
        self.assertEqual(self.pm_user.role.slug, 'PROJECT_MANAGER')

    def test_admin_only_create_user(self):
        """Security: Regular users cannot create new accounts via API."""
        self.client.force_authenticate(user=self.pm_user)
        response = self.client.post(self.user_list_url, {'email': 'hacker@grehasoft.com'})
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
