from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class UsersConfig(AppConfig):
    """
    Configuration for the Users module.
    This app manages Identity, RBAC, and Departmental structures.
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.users'
    verbose_name = _('User Identity & RBAC')

    def ready(self):
        """
        Initialization logic called when the app registry is fully loaded.
        Used to register signals for automated user auditing and profile management.
        """
        try:
            # Importing signals here ensures they are connected to the dispatchers.
            # This is essential for capturing login/logout events and role changes.
            import apps.users.signals  # noqa
        except ImportError:
            # Handles cases where signals may not be present in early development phases
            pass