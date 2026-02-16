"""
CRM Module
Handles the Lead lifecycle, Client profiles, and conversion into PMS Projects.
"""

# Explicitly setting the default app config. 
# This ensures that apps.crm.apps.CrmConfig is used, 
# which triggers the ready() method for signal registration.
default_app_config = 'apps.crm.apps.CrmConfig'