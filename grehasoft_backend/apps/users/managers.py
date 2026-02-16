from django.contrib.auth.base_user import BaseUserManager
from django.db import models
from django.utils import timezone

class UserQuerySet(models.QuerySet):
    """
    Custom QuerySet to allow chaining of filters.
    Usage: User.objects.active().filter(department=dept)
    """
    def active(self):
        return self.filter(status='active', deleted_at__isnull=True)

    def deleted(self):
        return self.filter(deleted_at__isnull=False)

class UserManager(BaseUserManager):
    """
    Custom manager for Grehasoft User model.
    1. Email-based authentication.
    2. Automatic soft-delete filtering.
    3. Mandatory Role assignment for Superusers.
    """

    def get_queryset(self):
        # By default, hide users who have been soft-deleted
        return UserQuerySet(self.model, using=self._db).filter(deleted_at__isnull=True)

    def create_user(self, email, password=None, **extra_fields):
        """
        Base method for creating users.
        """
        if not email:
            raise ValueError('The Email field must be set')
        
        email = self.normalize_email(email)
        
        # Ensure role is provided (unless it's a superuser being created)
        if 'role' not in extra_fields and not extra_fields.get('is_superuser'):
            raise ValueError('Users must have a role assigned.')

        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """
        Creates a Superuser and automatically assigns the SUPER_ADMIN role.
        """
        from apps.users.models import Role  # Inline import to prevent circular dependency

        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('status', 'active')

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        # Ensure the SUPER_ADMIN role exists or create it
        role, _ = Role.objects.get_or_create(
            slug='SUPER_ADMIN', 
            defaults={'slug': 'SUPER_ADMIN'}
        )
        extra_fields['role'] = role

        return self.create_user(email, password, **extra_fields)

    def get_by_natural_key(self, username):
        """
        Allows authentication using the email field.
        """
        return self.get(email__iexact=username)