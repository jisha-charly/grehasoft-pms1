from django.urls import path, include
from rest_framework.routers import SimpleRouter
from .views import (
    ProjectViewSet, 
    TaskViewSet, 
    TaskFileViewSet, 
    TaskCommentViewSet, 
    TaskTypeViewSet
)

# Define the app name for reverse URL lookups (e.g., 'pms:project-list')
app_name = 'pms'

# SimpleRouter is used to maintain a clean API structure 
# and avoid the default DRF browsable API root in production.
router = SimpleRouter()

# Project Management Endpoints
# GET/POST /api/v1/pms/projects/
# GET/PUT/PATCH/DELETE /api/v1/pms/projects/{id}/
router.register(r'projects', ProjectViewSet, basename='project')

# Kanban & Task Endpoints
# GET/POST /api/v1/pms/tasks/
# Supports filtering by ?project={id} or ?status={status}
router.register(r'tasks', TaskViewSet, basename='task')

# Document & Versioning Endpoints
# POST /api/v1/pms/task-files/ (Handles multipart file uploads)
router.register(r'task-files', TaskFileViewSet, basename='task-file')

# Communication Endpoints
# GET/POST /api/v1/pms/task-comments/
router.register(r'task-comments', TaskCommentViewSet, basename='task-comment')

# System Classification Endpoints (Read-Only)
# GET /api/v1/pms/task-types/
router.register(r'task-types', TaskTypeViewSet, basename='task-type')

urlpatterns = [
    path('', include(router.urls)),
]