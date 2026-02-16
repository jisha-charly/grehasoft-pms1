import logging
from django.db import transaction
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

from .models import Role, Department
from apps.activity_logs.utils import create_activity_log

User = get_user_model()
logger = logging.getLogger(__name__)

class UserService:
    """
    Service layer for managing Grehasoft user accounts.
    Encapsulates business logic for onboarding, role management, and status updates.
    """

    @staticmethod
    @transaction.atomic
    def create_user_account(
        email: str, 
        first_name: str, 
        last_name: str, 
        role_slug: str, 
        department_id: int = None, 
        performed_by: User = None,
        password: str = None
    ) -> User:
        """
        Creates a new internal user account.
        Ensures the role exists and department context is provided for non-admins.
        """
        if User.all_objects.filter(email=email).exists():
            raise ValidationError(_("A user with this email already exists (possibly soft-deleted)."))

        try:
            role = Role.objects.get(slug=role_slug)
        except Role.DoesNotExist:
            raise ValidationError(_("Invalid role selected."))

        # Department is mandatory for all roles except Super Admin
        if role.slug != Role.SUPER_ADMIN and not department_id:
            raise ValidationError(_("Department is required for this role."))

        department = None
        if department_id:
            try:
                department = Department.objects.get(id=department_id)
            except Department.DoesNotExist:
                raise ValidationError(_("Selected department does not exist."))

        # Create user instance
        user = User.objects.create_user(
            email=email,
            first_name=first_name,
            last_name=last_name,
            role=role,
            department=department,
            created_by=performed_by
        )

        if password:
            user.set_password(password)
            user.save()

        # Audit the creation
        create_activity_log(
            user=performed_by,
            action=f"Created user account: {user.email} as {role.get_slug_display()}",
            department=department
        )

        logger.info(f"USER_CREATED: {user.email} by {performed_by.email if performed_by else 'System'}")
        return user

    @staticmethod
    @transaction.atomic
    def update_user_status(user_id: int, new_status: str, performed_by: User) -> User:
        """
        Updates account status (Active, Inactive, Suspended).
        Handles soft-deletion if status is set to 'inactive' or 'suspended'.
        """
        try:
            user = User.all_objects.get(id=user_id)
        except User.DoesNotExist:
            raise ValidationError(_("User not found."))

        old_status = user.status
        user.status = new_status
        
        # If suspended or inactive, we disable Django's internal is_active flag
        if new_status in [User.Status.SUSPENDED, User.Status.INACTIVE]:
            user.is_active = False
        else:
            user.is_active = True

        user.updated_by = performed_by
        user.save()

        create_activity_log(
            user=performed_by,
            action=f"Changed status for {user.email} from {old_status} to {new_status}",
            department=user.department
        )

        return user

    @staticmethod
    @transaction.atomic
    def assign_role(user_id: int, role_slug: str, performed_by: User) -> User:
        """
        Updates a user's role. This is a sensitive operation logged for audit.
        """
        try:
            user = User.objects.get(id=user_id)
            role = Role.objects.get(slug=role_slug)
        except (User.DoesNotExist, Role.DoesNotExist):
            raise ValidationError(_("User or Role not found."))

        old_role = user.role.slug
        user.role = role
        user.updated_by = performed_by
        user.save()

        create_activity_log(
            user=performed_by,
            action=f"Escalated/Changed role for {user.email} from {old_role} to {role_slug}",
            department=user.department
        )

        return user