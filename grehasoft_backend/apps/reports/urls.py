from django.urls import path
from .views import DashboardStatsAPIView

app_name = "reports"

urlpatterns = [
    path('dashboard-stats/', DashboardStatsAPIView.as_view(), name='dashboard-stats'),
]
