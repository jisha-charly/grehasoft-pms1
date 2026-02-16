import logging
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from .models import Lead, Client, LeadFollowUp
from .serializers import (
    LeadSerializer, 
    ClientSerializer, 
    LeadFollowUpSerializer, 
    LeadConvertSerializer
)
from .services import LeadConversionService
from apps.pms.serializers import ProjectSerializer

logger = logging.getLogger(__name__)

class LeadViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing Leads.
    Implements department-based scoping and the conversion action.
    """
    serializer_class = LeadSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'department', 'source']
    search_fields = ['name', 'email', 'company_name']
    ordering_fields = ['created_at', 'name']
    ordering = ['-created_at']

    def get_queryset(self):
        user = self.request.user
        # Optimize with select_related for department
        queryset = Lead.objects.select_related('department', 'converted_project')
        
        if user.role.slug == 'SUPER_ADMIN':
            return queryset
        
        # Enforce departmental isolation
        return queryset.filter(department=user.department)

    def perform_create(self, serializer):
        # Automatically assign the user's department to the lead if not provided
        # and record who created the lead.
        user = self.request.user
        dept = serializer.validated_data.get('department', user.department)
        serializer.save(created_by=user, department=dept)

    @action(detail=True, methods=['post'], url_path='convert', serializer_class=LeadConvertSerializer)
    def convert(self, request, pk=None):
        """
        Custom action to convert a qualified lead into a Project.
        POST /api/v1/crm/leads/{id}/convert/
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        pm_id = serializer.validated_data['project_manager_id']
        
        try:
            # Delegate business logic to the Service Layer
            project = LeadConversionService.convert_to_project(
                lead_id=pk,
                project_manager_id=pm_id,
                performed_by=request.user
            )
            
            # Return the newly created project data
            project_data = ProjectSerializer(project).data
            return Response({
                "message": "Lead converted successfully.",
                "project": project_data
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            logger.error(f"Lead Conversion Error: {str(e)}")
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )


class ClientViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing converted or direct Clients.
    """
    serializer_class = ClientSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['department']
    search_fields = ['name', 'company_name', 'email']
    ordering = ['company_name']

    def get_queryset(self):
        user = self.request.user
        queryset = Client.objects.select_related('department')

        if user.role.slug == 'SUPER_ADMIN':
            return queryset
        
        return queryset.filter(department=user.department)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class LeadFollowUpViewSet(viewsets.ModelViewSet):
    """
    ViewSet for tracking interactions with a specific Lead.
    """
    serializer_class = LeadFollowUpSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['lead', 'method', 'is_completed']

    def get_queryset(self):
        user = self.request.user
        # Filter follow-ups by the user's department leads
        queryset = LeadFollowUp.objects.select_related('lead', 'lead__department')
        
        if user.role.slug == 'SUPER_ADMIN':
            return queryset
        
        return queryset.filter(lead__department=user.department)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)