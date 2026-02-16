from django.urls import path, include
from rest_framework.routers import SimpleRouter
from .views import LeadViewSet, ClientViewSet, LeadFollowUpViewSet

# Define the app name for reverse URL lookups (e.g., 'crm:lead-list')
app_name = 'crm'

# Using SimpleRouter to generate standardized RESTful endpoints
router = SimpleRouter()

# Maps to:
# GET /api/v1/crm/leads/                -> LeadViewSet.list
# POST /api/v1/crm/leads/               -> LeadViewSet.create
# POST /api/v1/crm/leads/{id}/convert/  -> LeadViewSet.convert (Custom Action)
router.register(r'leads', LeadViewSet, basename='lead')

# Maps to:
# GET /api/v1/crm/clients/              -> ClientViewSet.list
# GET /api/v1/crm/clients/{id}/         -> ClientViewSet.retrieve
router.register(r'clients', ClientViewSet, basename='client')

# Maps to:
# GET /api/v1/crm/followups/            -> LeadFollowUpViewSet.list
# POST /api/v1/crm/followups/           -> LeadFollowUpViewSet.create
router.register(r'followups', LeadFollowUpViewSet, basename='followup')

urlpatterns = [
    path('', include(router.urls)),
]