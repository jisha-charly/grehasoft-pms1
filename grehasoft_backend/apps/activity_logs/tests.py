import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from model_bakery import baker
from apps.users.models import Role, Department
from .models import ActivityLog
from .utils import create_activity_log

class ActivityLogTests(APITestCase):
    """
    Test suite for Activity Logs and Audit Trail logic.
    Focuses on Security, Scoping, and Immutability.
    """

    def setUp(self):
        # Setup Roles
        self.admin_role = baker.make('users.Role', slug='SUPER_ADMIN')
        self.pm_role = baker.make('users.Role', slug='PROJECT_MANAGER')

        # Setup Departments
        self.dept_software = baker.make('users.Department', name='Software')
        self.dept_marketing = baker.make('users.Department', name='Marketing')

        # Setup Users
        self.admin_user = baker.make(
            'users.User', 
            role=self.admin_role, 
            department=self.dept_software,
            is_staff=True
        )
        self.software_pm = baker.make(
            'users.User', 
            role=self.pm_role, 
            department=self.dept_software
        )
        self.marketing_pm = baker.make(
            'users.User', 
            role=self.pm_role, 
            department=self.dept_marketing
        )

        # Create Logs
        baker.make('activity_logs.ActivityLog', department=self.dept_software, action="Software Action", _quantity=3)
        baker.make('activity_logs.ActivityLog', department=self.dept_marketing, action="Marketing Action", _quantity=2)

        self.list_url = reverse('api_v1:activity_logs:activitylog-list')

    # --- 1. Model & Utility Tests ---

    def test_log_immutability(self):
        """Verify that logs cannot be updated or deleted via the app layer."""
        log = ActivityLog.objects.first()
        original_action = log.action
        
        # Try to update
        log.action = "Tampered Action"
        log.save()
        log.refresh_from_db()
        self.assertEqual(log.action, original_action)

        # Try to delete
        with self.assertRaises(PermissionError):
            log.delete()

    def test_utility_helper(self):
        """Verify the create_activity_log utility handles context correctly."""
        log = create_activity_log(
            user=self.software_pm,
            action="Test Manual Log",
            department=self.dept_software
        )
        self.assertEqual(log.user, self.software_pm)
        self.assertEqual(log.department, self.dept_software)

    # --- 2. Security & Scoping Tests ---

    def test_unauthenticated_access(self):
        """Ensure unauthenticated users cannot access logs."""
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_software_pm_scoping(self):
        """Verify Software PM only sees Software logs."""
        self.client.force_authenticate(user=self.software_pm)
        response = self.client.get(self.list_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should see 3 software logs, 0 marketing logs
        self.assertEqual(response.data['count'], 3)
        for item in response.data['results']:
            self.assertEqual(item['department_name'], 'Software')

    def test_super_admin_global_access(self):
        """Verify Super Admin sees all logs across departments."""
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(self.list_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Total = 3 software + 2 marketing
        self.assertEqual(response.data['count'], 5)

    # --- 3. API Functionality Tests ---

    def test_search_filtering(self):
        """Verify search filters by action text."""
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(self.list_url, {'search': 'Software'})
        self.assertEqual(response.data['count'], 3)

    def test_read_only_enforcement(self):
        """Verify that POST/PUT/DELETE methods are disabled on the API."""
        self.client.force_authenticate(user=self.admin_user)
        
        # Try POST
        response = self.client.post(self.list_url, {'action': 'Hack'})
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        
        # Try DELETE on a specific log
        log = ActivityLog.objects.first()
        detail_url = reverse('api_v1:activity_logs:activitylog-detail', args=[log.id])
        response = self.client.delete(detail_url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)