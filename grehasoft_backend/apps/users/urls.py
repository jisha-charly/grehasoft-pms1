from django.urls import path, include
from rest_framework.routers import SimpleRouter
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView
from .views import (
    UserViewSet, 
    RoleViewSet, 
    DepartmentViewSet, 
    MyTokenObtainPairView
)

# Namespace for reverse lookups (e.g., 'users:user-me')
app_name = 'users'

# Using SimpleRouter for modular ViewSet routing
router = SimpleRouter()

# Role & Department Lookups (Read-only for most, CRUD for Admin)
router.register(r'roles', RoleViewSet, basename='role')
router.register(r'departments', DepartmentViewSet, basename='department')

# User Management (CRUD + /me action)
# Note: This is registered last to avoid catching 'roles' or 'departments' as IDs
router.register(r'', UserViewSet, basename='user')

urlpatterns = [
    # Authentication Endpoints
    # We include these in the app for modularity, mapping back to core v1 API
    path('login/', MyTokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),

    # ViewSet Routes (Users, Roles, Departments)
    path('', include(router.urls)),
]