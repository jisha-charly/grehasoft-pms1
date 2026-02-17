from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

# ================================
# API v1 URL Patterns
# ================================
api_v1_patterns = [

    # ----------------------------
    # Authentication (JWT)
    # ----------------------------
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/verify/', TokenVerifyView.as_view(), name='token_verify'),

    # ----------------------------
    # App Modules
    # ----------------------------
    path('users/', include(('apps.users.urls', 'users'), namespace='users')),
    path('crm/', include(('apps.crm.urls', 'crm'), namespace='crm')),
    path('pms/', include(('apps.pms.urls', 'pms'), namespace='pms')),
    path('reports/', include(('apps.reports.urls', 'reports'), namespace='reports')),
    path('audit/', include(('apps.activity_logs.urls', 'audit'), namespace='audit')),

    # ----------------------------
    # API Documentation
    # ----------------------------
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path(
        'schema/swagger-ui/',
        SpectacularSwaggerView.as_view(url_name='schema'),
        name='swagger-ui',
    ),
    path(
        'schema/redoc/',
        SpectacularRedocView.as_view(url_name='schema'),
        name='redoc',
    ),
]

# ================================
# Root URL Patterns
# ================================
urlpatterns = [

    # Django Admin
    path('admin/', admin.site.urls),

    # API Root
    path('api/v1/', include(api_v1_patterns)),
]

# ================================
# Development Only Settings
# ================================
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

    # Optional Debug Toolbar
    if "debug_toolbar" in settings.INSTALLED_APPS:
        import debug_toolbar
        urlpatterns += [
            path('__debug__/', include(debug_toolbar.urls)),
        ]

# ================================
# Admin Branding
# ================================
admin.site.site_header = "Grehasoft PMS Admin"
admin.site.site_title = "Grehasoft CRM & PMS Portal"
admin.site.index_title = "Welcome to Grehasoft Enterprise Management"
