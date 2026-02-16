from __future__ import absolute_import, unicode_literals

# This will make sure the app is always imported when
# Django starts so that shared_task will use this app.
# Useful for background tasks like PDF report generation 
# and automated email notifications for PMS tasks.

# If you implement Celery later for "Grehasoft PMS", 
# uncomment the following lines:
# from .celery import app as celery_app
# __all__ = ('celery_app',)

__version__ = "1.0.0"
__author__ = "Grehasoft Architecture Team"