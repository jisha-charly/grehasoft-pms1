"""
Users Module
Core Identity Provider (IdP) for Grehasoft PMS & CRM.
Handles Custom User logic, RBAC (Roles), and Departmental scoping.
"""

# Explicitly defining the default app config.
# This ensures Django loads 'apps.users.apps.UsersConfig', which 
# is responsible for bootstrapping signals and system-wide RBAC logic.
default_app_config = 'apps.users.apps.UsersConfig'