from django.contrib.contenttypes.models import ContentType
from .models import ActivityLog

def get_client_ip(request):
    """
    Extracts the client's IP address from the request, 
    accounting for Nginx/Reverse Proxy headers.
    """
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

def create_activity_log(user, action, department=None, project=None, task=None, request=None):
    """
    Centralized utility to create an audit log.
    
    :param user: User instance performing the action
    :param action: String description of the event
    :param department: Department instance (defaults to user's dept if not provided)
    :param project: Optional Project instance
    :param task: Optional Task instance
    :param request: Optional HttpRequest object to capture IP and User Agent
    """
    
    # Logic to determine department if not explicitly provided
    if not department and user:
        department = getattr(user, 'department', None)
    
    # Fallback for department from project if still missing
    if not department and project:
        department = getattr(project, 'department', None)

    # Technical metadata extraction
    ip_address = None
    user_agent = None
    if request:
        ip_address = get_client_ip(request)
        user_agent = request.META.get('HTTP_USER_AGENT', '')[:255]

    # Atomic creation of the log
    return ActivityLog.objects.create(
        user=user,
        department=department,
        project=project,
        task=task,
        action=action,
        ip_address=ip_address,
        user_agent=user_agent
    )

def log_api_exception(request, exception, context=""):
    """
    Utility to log system errors or security-related exceptions 
    into the audit trail for admin review.
    """
    action_text = f"System Error: {str(exception)}. Context: {context}"
    return create_activity_log(
        user=request.user if request and request.user.is_authenticated else None,
        action=action_text,
        request=request
    )