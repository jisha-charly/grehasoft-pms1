from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class CrmConfig(AppConfig):
    """
    Configuration for the CRM (Customer Relationship Management) module.
    This module manages the transition from initial Leads to converted Clients.
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.crm'
    verbose_name = _('CRM & Sales')

    def ready(self):
        """
        Initialization logic when the app is loaded.
        Registers signals for automated CRM actions and audit logging.
        """
        try:
            # Importing signals ensures they are registered with the dispatcher.
            # This captures events like Lead creation, assignment, and status updates.
            import apps.crm.signals  # noqa
        except ImportError:
            # Fallback for initial migrations or environment setup
            pass