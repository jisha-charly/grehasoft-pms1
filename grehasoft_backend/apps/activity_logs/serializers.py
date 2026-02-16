from rest_framework import serializers
from .models import ActivityLog
from django.contrib.auth import get_user_model

User = get_user_model()

class ActivityUserSerializer(serializers.ModelSerializer):
    """Minimal user data for the audit trail."""
    full_name = serializers.CharField(source='get_full_name', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'full_name', 'email']

class ActivityLogSerializer(serializers.ModelSerializer):
    """
    Serializer for System Activity Logs.
    Provides descriptive context for the frontend timeline UI.
    """
    user_details = ActivityUserSerializer(source='user', read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)
    project_name = serializers.CharField(source='project.name', read_only=True)
    task_title = serializers.CharField(source='task.title', read_only=True)
    
    # Human-readable timestamps for the UI
    timestamp = serializers.DateTimeField(source='created_at', format="%Y-%m-%d %H:%M:%S", read_only=True)

    class Meta:
        model = ActivityLog
        fields = [
            'id', 
            'action', 
            'timestamp', 
            'user_details', 
            'department_name', 
            'project', 
            'project_name', 
            'task', 
            'task_title',
            'ip_address',
            'user_agent'
        ]
        read_only_fields = fields

    def to_representation(self, instance):
        """
        Optimization: Remove project/task IDs if they are null to keep 
        the JSON response clean for the frontend.
        """
        ret = super().to_representation(instance)
        if ret['project'] is None:
            ret.pop('project')
            ret.pop('project_name')
        if ret['task'] is None:
            ret.pop('task')
            ret.pop('task_title')
        return ret