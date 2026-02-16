"""
Activity Logs Module
Handles system-wide audit trails and departmental activity tracking.
"""

# This ensures that Django uses the ActivityLogsConfig defined in apps.py.
# This is crucial if we implement signals for automated logging.
default_app_config = 'apps.activity_logs.apps.ActivityLogsConfig'