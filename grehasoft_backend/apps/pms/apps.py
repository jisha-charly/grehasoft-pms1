from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class PmsConfig(AppConfig):
    """
    Configuration for the Project Management System (PMS) module.
    Manages the lifecycle of Projects, Tasks, and related collaboration tools.
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.pms'
    verbose_name = _('Project Management')

    def ready(self):
        """
        Initialization hook called when Django starts.
        Registers signals for automated project progress calculation,
        RBAC membership syncing, and Kanban activity auditing.
        """
        try:
            # Importing signals ensures the @receiver decorators are registered.
            # Without this, automated progress updates and audit logs won't fire.
            import apps.pms.signals  # noqa
        except ImportError:
            # Prevents failures during early-stage migrations or headless setups
            pass