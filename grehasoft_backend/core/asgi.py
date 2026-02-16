"""
ASGI config for Grehasoft PMS & CRM.

It exposes the ASGI callable as a module-level variable named ``application``.
For more information on this file, see
https://docs.djangoproject.com/en/stable/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

# Defaulting to development settings, but usually overridden by 
# environment variables in production (e.g., core.settings.production)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings.development')

# Initialize the Django ASGI application early to ensure the app registry
# is populated before importing code that may import ORM models.
django_asgi_app = get_asgi_application()

# In a future phase, you would wrap this with a ProtocolTypeRouter 
# to handle 'http' and 'websocket' protocols for real-time Kanban updates.
application = django_asgi_app