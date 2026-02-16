from django.contrib import admin
from .models import ActivityLog

@admin.register(ActivityLog)
class ActivityLogAdmin(admin.ModelAdmin):
    """
    Read-only admin interface for System Audit Trails.
    Ensures that logs cannot be tampered with via the admin panel.
    """
    
    # Display configuration
    list_display = (
        'created_at', 
        'user_full_name', 
        'department_name', 
        'action_summary', 
        'project_link'
    )
    
    # Filtering and Search
    list_filter = (
        'department', 
        'created_at', 
        ('user', admin.RelatedOnlyFieldListFilter),
    )
    search_fields = (
        'action', 
        'user__email', 
        'user__first_name', 
        'user__last_name', 
        'project__name'
    )
    
    # Navigation
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)
    
    # Performance Optimization
    # Use select_related to prevent N+1 queries when displaying user and project info
    list_select_related = ('user', 'project', 'department')

    # Security: Make logs immutable in the UI
    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        # Optional: Only allow SuperAdmins to delete logs, or return False for everyone
        return request.user.is_superuser

    # Custom Display Methods
    @admin.display(description='User')
    def user_full_name(self, obj):
        return f"{obj.user.get_full_name()} ({obj.user.email})" if obj.user else "System"

    @admin.display(description='Department')
    def department_name(self, obj):
        return obj.department.name if obj.department else "-"

    @admin.display(description='Action')
    def action_summary(self, obj):
        # Truncate long action strings for table view
        if len(obj.action) > 75:
            return f"{obj.action[:72]}..."
        return obj.action

    @admin.display(description='Related Project')
    def project_link(self, obj):
        return obj.project.name if obj.project else "-"

    # To ensure fields are readable in the detail view since we disabled change permission
    readonly_fields = ('user', 'project', 'task', 'department', 'action', 'created_at')
