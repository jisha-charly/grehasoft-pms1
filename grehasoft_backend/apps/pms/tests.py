import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from model_bakery import baker
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile

from apps.pms.models import Project, Task, TaskFile, ProjectMember

User = get_user_model()

class PMSModuleTests(APITestCase):
    """
    Production-grade tests for the PMS Module.
    Verifies Kanban logic, file revisions, and cross-departmental membership.
    """

    def setUp(self):
        # Setup Roles & Departments
        self.dept_software = baker.make('users.Department', name='Software')
        self.dept_marketing = baker.make('users.Department', name='Marketing')
        
        self.role_admin = baker.make('users.Role', slug='SUPER_ADMIN')
        self.role_pm = baker.make('users.Role', slug='PROJECT_MANAGER')
        self.role_member = baker.make('users.Role', slug='TEAM_MEMBER')

        # Setup Users
        self.admin_user = baker.make('users.User', role=self.role_admin, department=self.dept_software)
        self.software_pm = baker.make('users.User', role=self.role_pm, department=self.dept_software)
        self.marketing_pm = baker.make('users.User', role=self.role_pm, department=self.dept_marketing)
        self.software_dev = baker.make('users.User', role=self.role_member, department=self.dept_software)

        # Setup Projects
        self.soft_project = baker.make('pms.Project', name="Software App", department=self.dept_software)
        self.mark_project = baker.make('pms.Project', name="Ad Campaign", department=self.dept_marketing)

        self.project_url = reverse('api_v1:pms:project-list')
        self.task_url = reverse('api_v1:pms:task-list')

    # --- 1. Scoping & Visibility Tests ---

    def test_departmental_isolation(self):
        """Security: Software PM should NOT see Marketing projects by default."""
        self.client.force_authenticate(user=self.software_pm)
        response = self.client.get(self.project_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should only see Software project
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['name'], "Software App")

    def test_explicit_membership_access(self):
        """RBAC: Software Dev can see Marketing project IF they are a member."""
        # Add software dev to marketing project
        baker.make('pms.ProjectMember', project=self.mark_project, user=self.software_dev, role_in_project='MEMBER')
        
        self.client.force_authenticate(user=self.software_dev)
        response = self.client.get(self.project_url)
        
        # Now software dev should see BOTH projects (Dept match + Membership)
        self.assertEqual(response.data['count'], 2)

    # --- 2. Kanban Logic Tests ---

    def test_task_reordering_and_status_update(self):
        """UX: Verify task can move status and board_order via PATCH."""
        task = baker.make('pms.Task', project=self.soft_project, status='todo', board_order=1)
        
        self.client.force_authenticate(user=self.software_pm)
        detail_url = reverse('api_v1:pms:task-detail', args=[task.id])
        
        payload = {
            "status": "in_progress",
            "board_order": 5
        }
        
        response = self.client.patch(detail_url, payload)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        task.refresh_from_db()
        self.assertEqual(task.status, 'in_progress')
        self.assertEqual(task.board_order, 5)

    # --- 3. File Versioning Logic Tests ---

    def test_task_file_revision_logic(self):
        """Document Management: Ensure new uploads increment version and toggle current flag."""
        task = baker.make('pms.Task', project=self.soft_project)
        self.client.force_authenticate(user=self.software_pm)
        file_url = reverse('api_v1:pms:task-file-list')

        # Upload Version 1
        file1 = SimpleUploadedFile("v1.pdf", b"content", content_type="application/pdf")
        self.client.post(file_url, {"task": task.id, "file_path": file1, "file_type": "pdf"})

        # Upload Version 2
        file2 = SimpleUploadedFile("v2.pdf", b"updated content", content_type="application/pdf")
        self.client.post(file_url, {"task": task.id, "file_path": file2, "file_type": "pdf"})

        files = TaskFile.objects.filter(task=task).order_by('revision_no')
        
        self.assertEqual(files.count(), 2)
        # Version 1 check
        self.assertEqual(files[0].revision_no, 1)
        self.assertFalse(files[0].is_current_version)
        # Version 2 check
        self.assertEqual(files[1].revision_no, 2)
        self.assertTrue(files[1].is_current_version)

    # --- 4. Deletion Logic (Soft Delete) ---

    def test_project_soft_delete(self):
        """Safety: Deleted projects should not appear in list view."""
        self.client.force_authenticate(user=self.admin_user)
        detail_url = reverse('api_v1:pms:project-detail', args=[self.soft_project.id])
        
        # DELETE call
        self.client.delete(detail_url)
        
        # Verify it still exists in DB (soft delete)
        self.assertTrue(Project.all_objects.filter(id=self.soft_project.id).exists())
        
        # Verify it doesn't appear in list
        response = self.client.get(self.project_url)
        # Only Ad Campaign (marketing) should remain for Admin
        self.assertEqual(response.data['count'], 1)

    def test_task_type_read_only(self):
        """Security: Task types are system-defined and read-only via API."""
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('api_v1:pms:task-type-list')
        
        response = self.client.post(url, {"name": "Hack"})
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)