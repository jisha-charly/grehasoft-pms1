from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Project, ProjectMember, Milestone, Task, TaskAssignment, TaskFile, TaskComment, TaskType
from apps.users.serializers import UserMinimalSerializer # Assuming this exists from Users module

User = get_user_model()

class TaskTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskType
        fields = ['id', 'name', 'description']


class ProjectMemberSerializer(serializers.ModelSerializer):
    user_details = UserMinimalSerializer(source='user', read_only=True)
    
    class Meta:
        model = ProjectMember
        fields = ['id', 'user', 'user_details', 'role_in_project', 'added_at']


class MilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Milestone
        fields = ['id', 'project', 'title', 'due_date', 'is_completed']


class TaskFileSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.ReadOnlyField(source='created_by.get_full_name')
    
    class Meta:
        model = TaskFile
        fields = [
            'id', 'task', 'file_path', 'file_type', 
            'revision_no', 'is_current_version', 
            'uploaded_by_name', 'created_at'
        ]
        read_only_fields = ['revision_no', 'is_current_version', 'created_at']


class TaskCommentSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source='user.get_full_name')

    class Meta:
        model = TaskComment
        fields = ['id', 'task', 'user', 'user_name', 'comment', 'created_at']
        read_only_fields = ['created_at']


class TaskSerializer(serializers.ModelSerializer):
    """
    Core serializer for Kanban Board. Optimized for frequent status/order updates.
    """
    assigned_users = UserMinimalSerializer(source='assignments.employee', many=True, read_only=True)
    task_type_name = serializers.ReadOnlyField(source='task_type.name')
    project_name = serializers.ReadOnlyField(source='project.name')

    class Meta:
        model = Task
        fields = [
            'id', 'project', 'project_name', 'milestone', 'task_type', 
            'task_type_name', 'title', 'description', 'priority', 
            'status', 'board_order', 'due_date', 'assigned_users', 'created_at'
        ]
        read_only_fields = ['created_at']

    def validate_board_order(self, value):
        if value < 0:
            raise serializers.ValidationError("Board order must be a positive integer.")
        return value


class ProjectSerializer(serializers.ModelSerializer):
    """
    Standard project view including manager details and progress metrics.
    """
    manager_name = serializers.ReadOnlyField(source='project_manager.get_full_name')
    client_name = serializers.ReadOnlyField(source='client.company_name')
    department_name = serializers.ReadOnlyField(source='department.name')
    task_count = serializers.IntegerField(source='tasks.count', read_only=True)

    class Meta:
        model = Project
        fields = [
            'id', 'name', 'description', 'client', 'client_name', 
            'department', 'department_name', 'project_manager', 'manager_name',
            'start_date', 'end_date', 'status', 'progress_percentage', 
            'task_count', 'created_at'
        ]
        read_only_fields = ['progress_percentage', 'created_at']

    def validate(self, data):
        """Cross-field validation for dates."""
        if data.get('start_date') and data.get('end_date'):
            if data['start_date'] > data['end_date']:
                raise serializers.ValidationError({"end_date": "End date cannot be before start date."})
        return data


class ProjectDetailSerializer(ProjectSerializer):
    """
    Expanded view for the Project Workspace, including members and milestones.
    """
    members = ProjectMemberSerializer(many=True, read_only=True)
    milestones = MilestoneSerializer(many=True, read_only=True)

    class Meta(ProjectSerializer.Meta):
        fields = ProjectSerializer.Meta.fields + ['members', 'milestones']