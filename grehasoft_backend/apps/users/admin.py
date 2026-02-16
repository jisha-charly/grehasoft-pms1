from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _
from .models import User, Role, Department

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'created_at')
    search_fields = ('name',)
    readonly_fields = ('created_at', 'updated_at', 'deleted_at')

@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ('slug', 'get_slug_display')
    filter_horizontal = ('permissions',) # Easier permission management
    search_fields = ('slug',)

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    """
    Refined Admin interface for the Custom User model.
    Handles password hashing via UserAdmin inheritance.
    """
    model = User
    
    # List view configuration
    list_display = (
        'email', 'first_name', 'last_name', 'role', 
        'department_label', 'status_badge', 'is_staff'
    )
    list_filter = ('status', 'role', 'department', 'is_staff', 'is_active')
    list_select_related = ('role', 'department')
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)

    # Form fieldsets (Organized for Enterprise HR/Admin use)
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal Info'), {'fields': ('first_name', 'last_name', 'department')}),
        (_('RBAC & Permissions'), {
            'fields': ('role', 'status', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        (_('Important Dates'), {'fields': ('last_login', 'date_joined')}),
        (_('Audit Tracking'), {
            'classes': ('collapse',),
            'fields': ('created_at', 'updated_at', 'deleted_at'),
        }),
    )

    readonly_fields = ('date_joined', 'last_login', 'created_at', 'updated_at', 'deleted_at')

    # Custom Display Methods
    @admin.display(description='Dept')
    def department_label(self, obj):
        return obj.department.name if obj.department else format_html('<span style="color: gray;">-</span>')

    @admin.display(description='Status')
    def status_badge(self, obj):
        colors = {
            'active': '#198754',    # Success Green
            'inactive': '#6c757d',  # Muted Gray
            'suspended': '#dc3545', # Danger Red
        }
        return format_html(
            '<span style="background-color: {}; color: white; padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: bold;">{}</span>',
            colors.get(obj.status, '#000'),
            obj.status.upper()
        )

    def get_queryset(self, request):
        """
        Ensure the admin can see soft-deleted users if needed.
        """
        return User.all_objects.all()

    def delete_model(self, request, obj):
        """Override delete to perform soft-delete from Admin UI."""
        obj.delete()

# Set Admin Site branding
admin.site.site_header = "Grehasoft PMS & CRM Administration"
admin.site.site_title = "Grehasoft Admin Portal"
admin.site.index_title = "Welcome to the Grehasoft Management System"
