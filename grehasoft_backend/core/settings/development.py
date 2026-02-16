from .base import *

# --- Debug Settings ---
DEBUG = True

# Permissive for local development
ALLOWED_HOSTS = ['*']

# --- Tooling & Inspection ---
INSTALLED_APPS += [
    'debug_toolbar',
    'django_extensions',
]

MIDDLEWARE = [
    'debug_toolbar.middleware.DebugToolbarMiddleware',
] + MIDDLEWARE

# Debug Toolbar requires INTERNAL_IPS to be set
INTERNAL_IPS = [
    '127.0.0.1',
    'localhost',
]

# --- Database Override (Optional) ---
# If developers use a local sqlite for quick testing, otherwise it uses 
# the MySQL DATABASE_URL defined in base.py/env
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': BASE_DIR / 'db.sqlite3',
#     }
# }

# --- Development Email ---
# Don't send real emails; print them to the console instead.
# Useful for testing lead conversion notifications.
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# --- CORS & Security Overrides ---
# Allow all origins in dev to prevent Vite/React blocking
CORS_ALLOW_ALL_ORIGINS = True

# Disable secure cookies for local HTTP development
SESSION_COOKIE_SECURE = False
CSRF_COOKIE_SECURE = False

# --- Debug Toolbar Configuration ---
DEBUG_TOOLBAR_CONFIG = {
    'SHOW_TOOLBAR_CALLBACK': lambda request: DEBUG,
    'INSERT_BEFORE': '</body>',
    'RENDER_PANELS': True,
}

# --- Logging ---
# Detailed logging to console for easier debugging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'django.db.backends': {
            'level': 'INFO',  # Set to DEBUG to see all SQL queries in console
            'handlers': ['console'],
            'propagate': False,
        },
    },
}