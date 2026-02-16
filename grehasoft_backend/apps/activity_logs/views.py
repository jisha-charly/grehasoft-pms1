from rest_framework import viewsets, mixins, filters
from django_filters.rest_framework import DjangoFilterBackend
from django_filters import rest_framework as django_filters
from .models import ActivityLog
from .serializers import ActivityLogSerializer

class ActivityLogFilter(django_filters.FilterSet):
    """
    Advanced filtering for Audit Logs.
    Allows range filtering on dates and exact filtering on users/projects.
    """
    date_from = django_filters.DateTimeFilter(field_name="created_at", lookup_expr='gte')
    date_to = django_filters.DateTimeFilter(field_name="created_at", lookup_expr='lte')

    class Meta:
        model = ActivityLog
        fields = ['user', 'department', 'project', 'date_from', 'date_to']

class ActivityLogViewSet(mixins.ListModelMixin, 
                         mixins.RetrieveModelMixin, 
                         viewsets.GenericViewSet):
    """
    Read-only ViewSet for System Audit Trails.
    Implements strict departmental scoping.
    """
    serializer_class = ActivityLogSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ActivityLogFilter
    search_fields = ['action', 'user__first_name', 'user__last_name', 'project__name']
    ordering_fields = ['created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        user = self.request.user
        
        # Optimize performance by joining related tables (N+1 prevention)
        queryset = ActivityLog.objects.select_related(
            'user', 
            'department', 
            'project'
        ).only(
            'id', 'action', 'created_at', 
            'user__id', 'user__first_name', 'user__last_name', 'user__email',
            'department__id', 'department__name',
            'project__id', 'project__name'
        )

        # RBAC: Departmental Scoping
        if user.role.slug == 'SUPER_ADMIN':
            return queryset
        
        # Non-admins only see logs for their specific department
        return queryset.filter(department=user.department)

    def list(self, request, *args, **kwargs):
        """
        Overridden to allow future injection of 'Total Count' or 'Last Updated' 
        metadata if required for the React Dashboard.
        """
        return super().list(request, *args, **kwargs)