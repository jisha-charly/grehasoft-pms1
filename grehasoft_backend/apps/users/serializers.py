from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from .models import Role, Department

User = get_user_model()

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['id', 'slug', 'get_slug_display']


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name', 'description']


class UserMinimalSerializer(serializers.ModelSerializer):
    """
    Lightweight user representation for nesting in PMS/CRM models.
    Prevents leaking internal metadata and reduces payload size.
    """
    full_name = serializers.CharField(source='get_full_name', read_only=True)
    role_name = serializers.CharField(source='role.get_slug_display', read_only=True)
    role_slug = serializers.CharField(source='role.slug', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'full_name', 'email', 'role_slug', 'role_name']


class UserSerializer(serializers.ModelSerializer):
    """
    Detailed User representation for Profile and Management views.
    """
    full_name = serializers.CharField(source='get_full_name', read_only=True)
    role_details = RoleSerializer(source='role', read_only=True)
    department_details = DepartmentSerializer(source='department', read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'full_name', 
            'role', 'role_details', 'department', 'department_details', 
            'status', 'is_staff', 'date_joined'
        ]
        read_only_fields = ['is_staff', 'date_joined']
        extra_kwargs = {
            'role': {'write_only': True},
            'department': {'write_only': True},
        }


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom JWT Token Serializer.
    Injects Role and Department into the JWT payload so the React frontend
    can handle redirection and UI permissions immediately without an extra API call.
    """
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Custom claims for Frontend Logic
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        token['email'] = user.email
        token['role'] = user.role.slug
        token['department'] = user.department.name.lower().replace(" ", "_") if user.department else None
        
        # Add internal staff flag
        token['is_staff'] = user.is_staff

        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Check if user is active/not suspended
        if self.user.status != 'active':
            raise serializers.ValidationError(
                "Your account is currently suspended or inactive. Please contact HR/Admin."
            )
            
        return data