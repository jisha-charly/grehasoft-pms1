from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

# API V1 URL Patterns
api_v1_patterns = [
    # Authentication (SimpleJWT)
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    # Module Routes
    path('users/', include('apps.users.urls', namespace='users')),
    path('crm/', include('apps.crm.urls', namespace='crm')),
    path('pms/', include('apps.pms.urls', namespace='pms')),
    path('reports/', include('apps.reports.urls', namespace='reports')),
    path('audit/', include('apps.activity_logs.urls', namespace='audit')),

    # API Schema & Documentation
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]

urlpatterns = [
    # Django Admin Panel
    path('admin/', admin.py.site.urls),
    
    # API V1 Root
    path('api/v1/', include(api_v1_patterns)),
]

# Serving Media & Static files during development
# In Production, Nginx handles this directly.
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

    # Django Debug Toolbar (Optional but recommended in base structure)
    if "debug_toolbar" in settings.INSTALLED_APPS:
        import debug_toolbar
        urlpatterns += [path('__debug__/', include(debug_toolbar.urls))]

# Custom Admin Site Titles for Enterprise
admin.site.site_header = "Grehasoft PMS Admin"
admin.site.site_title = "Grehasoft CRM & PMS Portal"
admin.site.index_title = "Welcome to Grehasoft Enterprise Management"