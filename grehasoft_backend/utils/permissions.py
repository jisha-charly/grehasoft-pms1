from rest_framework import permissions

class IsSuperAdmin(permissions.BasePermission):
    """
    Grants access only to users with the SUPER_ADMIN role.
    """
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            getattr(request.user.role, 'slug', None) == 'SUPER_ADMIN'
        )


class HasRole(permissions.BasePermission):
    """
    A dynamic permission factory to check for specific roles.
    
    Usage in ViewSets:
    permission_classes = [HasRole.requires(['PROJECT_MANAGER', 'SUPER_ADMIN'])]
    """
    @classmethod
    def requires(cls, allowed_roles):
        class RolePermission(cls):
            def has_permission(self, request, view):
                if not request.user or not request.user.is_authenticated:
                    return False
                return request.user.role.slug in allowed_roles
        return RolePermission


class IsSameDepartment(permissions.BasePermission):
    """
    Ensures the user belongs to the same department as the object.
    Used to enforce the Software vs. Digital Marketing isolation.
    """
    def has_object_permission(self, request, view, obj):
        # Super Admins bypass departmental checks
        if request.user.role.slug == 'SUPER_ADMIN':
            return True
            
        # Determine the target department of the object
        # Handles models with direct 'department' or related 'project.department'
        target_dept = getattr(obj, 'department', None)
        if not target_dept and hasattr(obj, 'project'):
            target_dept = obj.project.department
            
        return request.user.department == target_dept


class IsProjectManagerOrAdmin(permissions.BasePermission):
    """
    Combination permission: User must be an Admin or a Project Manager 
    within their own department.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.role.slug in ['SUPER_ADMIN', 'PROJECT_MANAGER']

    def has_object_permission(self, request, view, obj):
        if request.user.role.slug == 'SUPER_ADMIN':
            return True
        
        # Check department alignment
        target_dept = getattr(obj, 'department', None)
        if not target_dept and hasattr(obj, 'project'):
            target_dept = obj.project.department
            
        return request.user.department == target_dept


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model uses GrehasoftBaseModel (created_by field).
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any authenticated user
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions only allowed to the creator or Super Admin
        return (
            obj.created_by == request.user or 
            request.user.role.slug == 'SUPER_ADMIN'
        )