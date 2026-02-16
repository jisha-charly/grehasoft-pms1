"""
Settings package for Grehasoft PMS & CRM.
This directory is split into:
- base.py: Shared configuration
- development.py: Local dev tools and permissive security
- production.py: Strict security, MySQL optimization, and performance tuning
"""

from __future__ import absolute_import, unicode_literals

# This file is intentionally left empty to allow for explicit settings loading 
# via environment variables (DJANGO_SETTINGS_MODULE).
#
# Usage:
# Dev: export DJANGO_SETTINGS_MODULE=core.settings.development
# Prod: export DJANGO_SETTINGS_MODULE=core.settings.production
