import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from model_bakery import baker
from django.contrib.auth import get_user_model

from apps.crm.models import Lead, Client
from apps.pms.models import Project
from apps.crm.services import LeadConversionService
from apps.activity_logs.models import ActivityLog

User = get_user_model()

class CRMModuleTests(APITestCase):
    """
    Production-grade tests for Lead management and Conversion logic.
    Verifies RBAC, Departmental scoping, and Atomicity.
    """

    def setUp(self):
        # Setup Infrastructure
        self.software_dept = baker.make('users.Department', name='Software')
        self.marketing_dept = baker.make('users.Department', name='Marketing')
        
        self.admin_role = baker.make('users.Role', slug='SUPER_ADMIN')
        self.sales_role = baker.make('users.Role', slug='SALES_EXECUTIVE')
        self.pm_role = baker.make('users.Role', slug='PROJECT_MANAGER')

        # Setup Users
        self.software_sales = baker.make(
            'users.User', 
            role=self.sales_role, 
            department=self.software_dept,
            email="soft_sales@grehasoft.com"
        )
        self.marketing_sales = baker.make(
            'users.User', 
            role=self.sales_role, 
            department=self.marketing_dept,
            email="mark_sales@grehasoft.com"
        )
        self.software_pm = baker.make(
            'users.User', 
            role=self.pm_role, 
            department=self.software_dept
        )

        # Setup Leads
        self.soft_lead = baker.make(
            'crm.Lead', 
            name="Alpha Corp", 
            status='qualified', 
            department=self.software_dept
        )
        self.mark_lead = baker.make(
            'crm.Lead', 
            name="Beta Marketing", 
            status='new', 
            department=self.marketing_dept
        )

    # --- 1. Service Layer Tests (Business Logic) ---

    def test_successful_lead_conversion_service(self):
        """Verify that the service correctly creates a Client, Project, and Logs."""
        project = LeadConversionService.convert_to_project(
            lead_id=self.soft_lead.id,
            project_manager_id=self.software_pm.id,
            performed_by=self.software_sales
        )

        self.soft_lead.refresh_from_db()
        
        # Assert Lead State
        self.assertEqual(self.soft_lead.status, 'converted')
        self.assertIsNotNone(self.soft_lead.converted_project)
        
        # Assert Client Creation
        client = Client.objects.get(email=self.soft_lead.email)
        self.assertEqual(client.company_name, self.soft_lead.company_name or self.soft_lead.name)
        
        # Assert Project Details
        self.assertEqual(project.client, client)
        self.assertEqual(project.project_manager, self.software_pm)
        
        # Assert Audit Log
        self.assertTrue(ActivityLog.objects.filter(project=project).exists())

    def test_conversion_fails_for_unqualified_lead(self):
        """Business Rule: Only 'qualified' leads can be converted."""
        with self.assertRaises(Exception):
            LeadConversionService.convert_to_project(
                lead_id=self.mark_lead.id, # Status is 'new'
                project_manager_id=self.software_pm.id,
                performed_by=self.marketing_sales
            )

    # --- 2. API & Security Tests (Departmental Scoping) ---

    def test_lead_list_department_isolation(self):
        """Security: Software sales should NOT see Marketing leads."""
        self.client.force_authenticate(user=self.software_sales)
        url = reverse('api_v1:crm:lead-list')
        
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should only see 1 lead (Software), not 2
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['name'], "Alpha Corp")

    def test_unauthorized_conversion_attempt(self):
        """Security: Software user cannot convert a Marketing lead."""
        self.client.force_authenticate(user=self.software_sales)
        url = reverse('api_v1:crm:lead-convert', args=[self.mark_lead.id])
        
        response = self.client.post(url, {'project_manager_id': self.software_pm.id})
        
        # Handled by Service Layer validation called via ViewSet
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("permission", response.data['error'].lower())

    # --- 3. CRUD Verification ---

    def test_create_lead_auto_assigns_department(self):
        """UX: Creating a lead should auto-assign the user's department."""
        self.client.force_authenticate(user=self.marketing_sales)
        url = reverse('api_v1:crm:lead-list')
        
        data = {
            "name": "New Campaign Lead",
            "email": "campaign@client.com",
            "phone": "123456789"
        }
        
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        lead = Lead.objects.get(email="campaign@client.com")
        self.assertEqual(lead.department, self.marketing_dept)

    def test_client_access_restricted(self):
        """Verify Client data follows same departmental isolation."""
        # Create a marketing client
        baker.make('crm.Client', department=self.marketing_dept, company_name="MarkClient")
        
        self.client.force_authenticate(user=self.software_sales)
        url = reverse('api_v1:crm:client-list')
        
        response = self.client.get(url)
        # Software user has no clients yet
        self.assertEqual(response.data['count'], 0)