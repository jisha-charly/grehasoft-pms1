from rest_framework import permissions
from .models import Role

class IsSuperAdmin(permissions.BasePermission):
    """
    Global permission to allow only Super Admins.
    """
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role.slug == Role.SUPER_ADMIN
        )

class HasRole(permissions.BasePermission):
    """
    Flexible permission class to check for multiple roles.
    
    Usage in ViewSet:
    permission_classes = [HasRole.requires([Role.SUPER_ADMIN, Role.PROJECT_MANAGER])]
    """
    @classmethod
    def requires(cls, allowed_roles):
        class RolePermission(cls):
            def has_permission(self, self_request, view):
                if not self_request.user or not self_request.user.is_authenticated:
                    return False
                return self_request.user.role.slug in allowed_roles
        return RolePermission

class IsDepartmentManager(permissions.BasePermission):
    """
    Allows access if the user is a Project Manager within their own department.
    """
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role.slug in [Role.PROJECT_MANAGER, Role.SUPER_ADMIN]
        )

    def has_object_permission(self, request, view, obj):
        # Super Admin bypasses all checks
        if request.user.role.slug == Role.SUPER_ADMIN:
            return True
            
        # Check if the object belongs to the user's department
        # Supports objects with 'department' or 'project.department'
        target_dept = getattr(obj, 'department', None)
        if not target_dept and hasattr(obj, 'project'):
            target_dept = obj.project.department
            
        return request.user.department == target_dept

class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Custom permission to allow only owners of an object or admins to edit/delete.
    Used for profile updates or task modifications.
    """
    def has_object_permission(self, request, view, obj):
        if request.user.role.slug == Role.SUPER_ADMIN:
            return True
        
        # Check if the object is the user itself (for /users/me/)
        if obj == request.user:
            return True
            
        # Check for created_by attribute (standard in GrehasoftBaseModel)
        return getattr(obj, 'created_by', None) == request.user