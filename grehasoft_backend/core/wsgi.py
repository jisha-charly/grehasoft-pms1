"""
WSGI config for Grehasoft PMS & CRM.

It exposes the WSGI callable as a module-level variable named ``application``.
For more information on this file, see
https://docs.djangoproject.com/en/stable/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

# Default to development settings. 
# In your production environment (Docker/Gunicorn), 
# override this by setting DJANGO_SETTINGS_MODULE=core.settings.production
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings.development')

# This application object is what Gunicorn uses to serve the app.
# Example Gunicorn command: gunicorn core.wsgi:application
application = get_wsgi_application()