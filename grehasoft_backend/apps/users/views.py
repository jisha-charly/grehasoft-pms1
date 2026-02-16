import logging
from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django_filters.rest_framework import DjangoFilterBackend

from .models import User, Role, Department
from .serializers import (
    UserSerializer, 
    UserMinimalSerializer, 
    MyTokenObtainPairSerializer,
    RoleSerializer,
    DepartmentSerializer
)
from utils.permissions import HasRole # Custom permission helper

logger = logging.getLogger(__name__)

class MyTokenObtainPairView(TokenObtainPairView):
    """
    Login endpoint. Returns JWT Access and Refresh tokens 
    with custom claims (role, department).
    """
    serializer_class = MyTokenObtainPairSerializer


class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing System Users.
    SUPER_ADMIN: Full CRUD.
    OTHERS: Can only view themselves (/me/) or list minimal info.
    """
    serializer_class = UserSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['role', 'department', 'status']
    search_fields = ['email', 'first_name', 'last_name']
    ordering_fields = ['date_joined', 'email']

    def get_queryset(self):
        user = self.request.user
        # Standard queryset excludes soft-deleted users via UserManager
        queryset = User.objects.select_related('role', 'department')
        
        if user.role.slug == Role.SUPER_ADMIN:
            return queryset
        
        # Non-admins only see themselves or active users in their department
        return queryset.filter(department=user.department, status='active')

    def get_permissions(self):
        """
        Refined RBAC for User endpoints.
        Only Admins can create/delete users.
        """
        if self.action in ['create', 'destroy', 'update', 'partial_update']:
            return [HasRole.requires([Role.SUPER_ADMIN])()]
        return [permissions.IsAuthenticated()]

    @action(detail=False, methods=['get', 'patch'], url_path='me')
    def me(self, request):
        """
        Endpoint: /api/v1/users/me/
        Allows the logged-in user to retrieve or update their own profile.
        """
        user = request.user
        if request.method == 'GET':
            serializer = self.get_serializer(user)
            return Response(serializer.data)
        
        # Allow partial updates for profile (e.g., changing name)
        serializer = self.get_serializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def perform_destroy(self, instance):
        """Override to perform soft-delete."""
        instance.delete()


class RoleViewSet(viewsets.ReadOnlyModelViewSet):
    """
    List of roles for dropdowns and assignment.
    Read-only to prevent unauthorized logic changes.
    """
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [permissions.IsAuthenticated]


class DepartmentViewSet(viewsets.ModelViewSet):
    """
    Manage business departments (Software, Marketing).
    """
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [HasRole.requires([Role.SUPER_ADMIN])()]
        return [permissions.IsAuthenticated()]