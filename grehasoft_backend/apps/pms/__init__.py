"""
PMS Module (Project Management System)
Handles Projects, Kanban Tasks, Milestones, and File Versioning.
Includes automated signals for progress calculation and audit trails.
"""

# Explicitly setting the default app config. 
# This ensures that apps.pms.apps.PmsConfig is used, 
# which triggers the ready() method for signal registration.
default_app_config = 'apps.pms.apps.PmsConfig'