import logging
from django.db.models import Q
from rest_framework import viewsets, permissions, status, filters
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from .models import Project, Task, TaskFile, TaskComment, TaskType, Milestone
from .serializers import (
    ProjectSerializer, ProjectDetailSerializer, TaskSerializer,
    TaskFileSerializer, TaskCommentSerializer, TaskTypeSerializer,
    MilestoneSerializer
)
from utils.permissions import HasRole # Custom permission class defined earlier

logger = logging.getLogger(__name__)

class ProjectViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Projects. 
    Visibility: Super Admin (All), Others (Own Department OR Explicit Membership).
    """
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'department', 'project_manager']
    search_fields = ['name', 'client__company_name']
    ordering_fields = ['created_at', 'start_date', 'progress_percentage']

    def get_queryset(self):
        user = self.request.user
        
        # Optimization: Joining related tables to prevent N+1 issues
        queryset = Project.objects.select_related(
            'client', 'department', 'project_manager'
        ).prefetch_related('members__user')

        if user.role.slug == 'SUPER_ADMIN':
            return queryset

        # Scoping: Department Match OR User is an explicit member of the project
        return queryset.filter(
            Q(department=user.department) | Q(members__user=user)
        ).distinct()

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProjectDetailSerializer
        return ProjectSerializer

    def perform_create(self, serializer):
        # Enforce that non-admins can only create projects in their own department
        user = self.request.user
        dept = user.department if user.role.slug != 'SUPER_ADMIN' else serializer.validated_data.get('department')
        
        serializer.save(
            created_by=user,
            department=dept
        )


class TaskViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Tasks.
    Supports Kanban operations and filtered by Project.
    """
    serializer_class = TaskSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['project', 'status', 'priority', 'task_type']
    search_fields = ['title', 'description']

    def get_queryset(self):
        user = self.request.user
        queryset = Task.objects.select_related('project', 'task_type').prefetch_related('assignments__employee')

        if user.role.slug == 'SUPER_ADMIN':
            return queryset

        # Tasks are visible if the user can see the parent project
        return queryset.filter(
            Q(project__department=user.department) | Q(project__members__user=user)
        ).distinct()

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class TaskFileViewSet(viewsets.ModelViewSet):
    """
    Handles file uploads for tasks with automated versioning logic.
    """
    serializer_class = TaskFileSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = TaskFile.objects.select_related('task', 'created_by')
        
        if user.role.slug == 'SUPER_ADMIN':
            return queryset

        return queryset.filter(
            Q(task__project__department=user.department) | Q(task__project__members__user=user)
        ).distinct()

    def perform_create(self, serializer):
        task = serializer.validated_data['task']
        
        # Versioning Logic: 
        # 1. Mark existing files for this task as not current
        TaskFile.objects.filter(task=task, is_current_version=True).update(is_current_version=False)
        
        # 2. Calculate next revision number
        last_rev = TaskFile.objects.filter(task=task).count()
        
        # 3. Save with incremented version
        serializer.save(
            created_by=self.request.user,
            revision_no=last_rev + 1,
            is_current_version=True
        )


class TaskCommentViewSet(viewsets.ModelViewSet):
    """
    API for task discussions.
    """
    serializer_class = TaskCommentSerializer

    def get_queryset(self):
        user = self.request.user
        return TaskComment.objects.filter(
            Q(task__project__department=user.department) | Q(task__project__members__user=user)
        ).select_related('user')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, created_by=self.request.user)


class TaskTypeViewSet(viewsets.ReadOnlyModelViewSet):
    """
    System-wide classification of tasks.
    """
    queryset = TaskType.objects.all()
    serializer_class = TaskTypeSerializer
    permission_classes = [permissions.IsAuthenticated]