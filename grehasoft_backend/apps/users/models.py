from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from utils.models import GrehasoftBaseModel  # Shared soft-delete & tracking logic

class Department(GrehasoftBaseModel):
    """
    Business units for domain isolation (e.g., Software, Digital Marketing).
    Projects and Leads are scoped to these departments.
    """
    name = models.CharField(_('Department Name'), max_length=100, unique=True)
    description = models.TextField(blank=True)

    class Meta:
        verbose_name = _('Department')
        verbose_name_plural = _('Departments')

    def __str__(self):
        return self.name


class Role(models.Model):
    """
    RBAC Roles. Capabilities are defined by roles, while scope is defined by departments.
    """
    SUPER_ADMIN = 'SUPER_ADMIN'
    PROJECT_MANAGER = 'PROJECT_MANAGER'
    TEAM_MEMBER = 'TEAM_MEMBER'
    SALES_EXECUTIVE = 'SALES_EXECUTIVE'

    ROLE_CHOICES = [
        (SUPER_ADMIN, _('Super Admin')),
        (PROJECT_MANAGER, _('Project Manager')),
        (TEAM_MEMBER, _('Team Member')),
        (SALES_EXECUTIVE, _('Sales Executive')),
    ]

    slug = models.CharField(max_length=50, choices=ROLE_CHOICES, unique=True)
    permissions = models.ManyToManyField('auth.Permission', blank=True)

    def __str__(self):
        return self.get_slug_display()


class UserManager(BaseUserManager):
    """
    Custom manager for User model to handle email as unique identifier
    and filter out soft-deleted accounts by default.
    """
    def get_queryset(self):
        return super().get_queryset().filter(deleted_at__isnull=True)

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError(_('The Email field must be set'))
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        
        # SuperAdmins must have the SUPER_ADMIN role assigned
        role, _ = Role.objects.get_or_create(slug=Role.SUPER_ADMIN)
        extra_fields.setdefault('role', role)

        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin, GrehasoftBaseModel):
    """
    Enterprise Custom User Model.
    Email-based authentication with Role and Department context.
    """
    class Status(models.TextChoices):
        ACTIVE = 'active', _('Active')
        INACTIVE = 'inactive', _('Inactive')
        SUSPENDED = 'suspended', _('Suspended')

    email = models.EmailField(_('Email Address'), unique=True, db_index=True)
    first_name = models.CharField(_('First Name'), max_length=150)
    last_name = models.CharField(_('Last Name'), max_length=150)
    
    # RBAC & Scoping
    role = models.ForeignKey(
        Role, 
        on_delete=models.PROTECT, 
        related_name='users'
    )
    department = models.ForeignKey(
        Department, 
        on_delete=models.PROTECT, 
        null=True, 
        blank=True, 
        related_name='users'
    )
    
    status = models.CharField(
        max_length=20, 
        choices=Status.choices, 
        default=Status.ACTIVE,
        db_index=True
    )
    
    # Django Auth Flags
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)

    objects = UserManager()
    all_objects = BaseUserManager() # Direct access for Admin purposes

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    class Meta:
        verbose_name = _('User')
        verbose_name_plural = _('Users')
        ordering = ['email']
        indexes = [
            models.Index(fields=['email', 'status', 'deleted_at']),
        ]

    def __str__(self):
        return self.email

    @property
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"

    @property
    def is_super_admin(self):
        return self.role.slug == Role.SUPER_ADMIN

    def delete(self, **kwargs):
        """Soft delete user account."""
        self.deleted_at = timezone.now()
        self.is_active = False
        self.save()