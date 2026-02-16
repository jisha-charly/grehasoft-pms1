from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Lead, Client, LeadFollowUp
from apps.users.serializers import DepartmentSerializer, UserMinimalSerializer

User = get_user_model()

class LeadFollowUpSerializer(serializers.ModelSerializer):
    """
    Serializer for tracking interaction history with a lead.
    """
    created_by_name = serializers.ReadOnlyField(source='created_by.get_full_name')

    class Meta:
        model = LeadFollowUp
        fields = [
            'id', 'lead', 'method', 'notes', 'next_followup_date', 
            'is_completed', 'created_at', 'created_by_name'
        ]
        read_only_fields = ['created_at', 'created_by']


class ClientSerializer(serializers.ModelSerializer):
    """
    Serializer for verified business entities (Clients).
    """
    department_name = serializers.ReadOnlyField(source='department.name')

    class Meta:
        model = Client
        fields = [
            'id', 'name', 'company_name', 'email', 'phone', 
            'tax_id', 'address', 'website', 'department', 
            'department_name', 'created_at'
        ]
        read_only_fields = ['created_at', 'created_by']


class LeadSerializer(serializers.ModelSerializer):
    """
    Main serializer for Leads with nested follow-up count and department details.
    """
    department_name = serializers.ReadOnlyField(source='department.name')
    followup_count = serializers.IntegerField(source='followups.count', read_only=True)
    is_converted = serializers.SerializerMethodField()

    class Meta:
        model = Lead
        fields = [
            'id', 'name', 'email', 'phone', 'company_name', 
            'source', 'status', 'department', 'department_name', 
            'converted_project', 'is_converted', 'followup_count', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ['converted_project', 'created_at', 'updated_at', 'created_by']

    def get_is_converted(self, obj):
        return obj.status == Lead.Status.CONVERTED

    def validate_email(self, value):
        """
        Check for duplicate leads in the same department to prevent spam.
        """
        request = self.context.get('request')
        department = self.initial_data.get('department')
        
        qs = Lead.objects.filter(email__iexact=value, department_id=department)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        
        if qs.exists():
            raise serializers.ValidationError("A lead with this email already exists in this department.")
        return value


class LeadConvertSerializer(serializers.Serializer):
    """
    Non-model action serializer used specifically for the conversion endpoint.
    Ensures the selected Project Manager is valid before the service layer is called.
    """
    project_manager_id = serializers.IntegerField(required=True)

    def validate_project_manager_id(self, value):
        try:
            pm = User.objects.get(id=value, is_deleted=False)
            if pm.role.slug not in ['PROJECT_MANAGER', 'SUPER_ADMIN']:
                raise serializers.ValidationError("User does not have the required role to manage projects.")
        except User.DoesNotExist:
            raise serializers.ValidationError("Project Manager not found.")
        return value