import logging
from django.db import transaction
from django.utils import timezone
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError

from apps.crm.models import Lead, Client
from apps.pms.models import Project, ProjectMember
from apps.activity_logs.utils import create_activity_log

User = get_user_model()
logger = logging.getLogger(__name__)

class LeadConversionService:
    """
    Handles the transition of a Lead into a Client and a PMS Project.
    Encapsulates all business rules, validations, and cross-module creation.
    """

    @staticmethod
    @transaction.atomic
    def convert_to_project(lead_id: int, project_manager_id: int, performed_by: User) -> Project:
        """
        Executes the conversion process.
        
        1. Validates Lead status and department.
        2. Creates or fetches the Client record.
        3. Creates the PMS Project.
        4. Assigns the Project Manager.
        5. Logs the audit trail.
        """
        
        # 1. Fetch Lead with row-level locking (select_for_update)
        # Prevents race conditions where two users click 'Convert' simultaneously
        try:
            lead = Lead.objects.select_for_update().get(id=lead_id)
        except Lead.DoesNotExist:
            raise ValidationError({"error": "Lead not found."})

        # 2. Business Rule Validation
        if lead.status == Lead.Status.CONVERTED:
            raise ValidationError({"error": "This lead has already been converted into a project."})
        
        if lead.status != Lead.Status.QUALIFIED:
            raise ValidationError({"error": f"Lead must be in '{Lead.Status.QUALIFIED}' status before conversion."})

        # 3. Departmental Security Check
        # Ensure the user converting the lead belongs to the same department or is an Admin
        if performed_by.role.slug != 'SUPER_ADMIN' and lead.department != performed_by.department:
            raise ValidationError({"error": "You do not have permission to convert leads for this department."})

        # 4. Fetch/Validate Project Manager
        try:
            pm = User.objects.get(id=project_manager_id, is_deleted=False)
            if pm.role.slug not in ['PROJECT_MANAGER', 'SUPER_ADMIN']:
                raise ValidationError({"error": "Selected user does not have Project Manager privileges."})
        except User.DoesNotExist:
            raise ValidationError({"error": "Selected Project Manager not found."})

        # 5. Client Handling (Idempotency)
        # Search for existing client by email or company name to avoid duplicates
        client, created = Client.objects.get_or_create(
            email=lead.email,
            defaults={
                'name': lead.name,
                'company_name': lead.company_name or lead.name,
                'phone': lead.phone,
                'department': lead.department,
                'created_by': performed_by
            }
        )

        # 6. Create the Project
        project = Project.objects.create(
            name=f"{lead.company_name or lead.name} Implementation",
            client=client,
            department=lead.department,
            project_manager=pm,
            start_date=timezone.now().date(),
            status='not_started',
            created_by=performed_by
        )

        # 7. Setup Project Membership
        # PM is automatically added to the project members
        ProjectMember.objects.create(
            project=project,
            user=pm,
            role_in_project='PM'
        )

        # 8. Update Lead Status
        lead.status = Lead.Status.CONVERTED
        lead.converted_project = project
        lead.updated_by = performed_by
        lead.save()

        # 9. Audit Logging
        create_activity_log(
            user=performed_by,
            action=f"Converted Lead '{lead.name}' to Project: '{project.name}'. Assigned PM: {pm.get_full_name()}.",
            department=lead.department,
            project=project
        )

        logger.info(f"LEAD_CONVERSION_SUCCESS: Lead {lead.id} -> Project {project.id} by User {performed_by.id}")
        
        return project