from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Count
from apps.crm.models import Lead
from apps.pms.models import Project, Task


class DashboardStatsAPIView(APIView):
    def get(self, request):
        total_leads = Lead.objects.count()
        converted_leads = Lead.objects.filter(status='converted').count()
        conversion_rate = (
            (converted_leads / total_leads) * 100
            if total_leads > 0 else 0
        )

        return Response({
            "kpis": {
                "total_leads": total_leads,
                "conversion_rate": round(conversion_rate, 2),
                "active_projects": Project.objects.filter(status='active').count(),
                "pending_tasks": Task.objects.exclude(status='done').count(),
            },
            "charts": {
                "leads": dict(
                    Lead.objects.values('status')
                    .annotate(count=Count('id'))
                    .values_list('status', 'count')
                ),
                "projects": dict(
                    Project.objects.values('status')
                    .annotate(count=Count('id'))
                    .values_list('status', 'count')
                ),
                "tasks": dict(
                    Task.objects.values('status')
                    .annotate(count=Count('id'))
                    .values_list('status', 'count')
                ),
            }
        })
