from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _

class ActivityLogsConfig(AppConfig):
    """
    Configuration class for the Activity Logs module.
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.activity_logs'
    verbose_name = _('Activity Logs & Audit Trail')

    def ready(self):
        """
        Method called when Django starts. Used for signal registration.
        """
        try:
            # Import signals here to ensure they are registered when the app loads.
            # This allows the system to automatically log events such as 
            # Project creation, Task completion, or Lead conversion.
            import apps.activity_logs.signals  # noqa
        except ImportError:
            pass
