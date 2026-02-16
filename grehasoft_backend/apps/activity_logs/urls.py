from django.urls import path, include
from rest_framework.routers import SimpleRouter
from .views import ActivityLogViewSet

# Define the app name for reverse URL lookups (e.g., 'audit:activitylog-list')
app_name = 'activity_logs'

# We use SimpleRouter as it provides a clean set of routes without the 
# default API root view provided by DefaultRouter.
router = SimpleRouter()

# Maps to:
# GET /api/v1/audit/logs/        -> ActivityLogViewSet.list
# GET /api/v1/audit/logs/{id}/   -> ActivityLogViewSet.retrieve
router.register(r'logs', ActivityLogViewSet, basename='activitylog')

urlpatterns = [
    path('', include(router.urls)),
]