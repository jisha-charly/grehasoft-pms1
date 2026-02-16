from rest_framework.views import exception_handler
from rest_framework.exceptions import APIException
from rest_framework import status
from django.utils.translation import gettext_lazy as _

class BusinessLogicError(APIException):
    """
    Standard exception for Service Layer failures.
    Example: Lead is not qualified for conversion.
    """
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = _('A business logic error occurred.')
    default_code = 'business_logic_error'

class ConflictError(APIException):
    """
    Used for race conditions or state conflicts.
    Example: Trying to edit a task that was just deleted.
    """
    status_code = status.HTTP_409_CONFLICT
    default_detail = _('The resource state has changed. Please refresh.')
    default_code = 'conflict_error'

class InsufficientPermissionsError(APIException):
    """
    Specific error for RBAC violations.
    """
    status_code = status.HTTP_403_FORBIDDEN
    default_detail = _('You do not have the required role to perform this action.')
    default_code = 'insufficient_role_permissions'

def custom_exception_handler(exc, context):
    """
    Custom DRF exception handler to ensure a consistent JSON structure.
    Output format: { "status": "error", "message": "...", "code": "...", "errors": {} }
    """
    # Call DRF's default exception handler first to get the standard error response.
    response = exception_handler(exc, context)

    if response is not None:
        custom_data = {
            'status': 'error',
            'code': getattr(exc, 'default_code', 'api_error'),
            'message': '',
            'errors': response.data
        }

        # Attempt to extract a clean message
        if isinstance(response.data, dict):
            if 'detail' in response.data:
                custom_data['message'] = response.data['detail']
            else:
                custom_data['message'] = _('Validation failed.')
        elif isinstance(response.data, list):
            custom_data['message'] = response.data[0]

        response.data = custom_data

    return response