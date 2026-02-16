# Signal handlers for Activity Logs
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from apps.crm.models import Lead
from apps.pms.models import Project, Task
from .models import ActivityLog

def log_event(instance, action_text, project=None, task=None):
    """
    Helper to create an ActivityLog entry.
    Uses the instance's department and updated_by/created_by fields.
    """
    # Attempt to find the department
    dept = None
    if hasattr(instance, 'department'):
        dept = instance.department
    elif hasattr(instance, 'project') and hasattr(instance.project, 'department'):
        dept = instance.project.department

    # Identify the user who performed the action
    user = getattr(instance, 'updated_by', getattr(instance, 'created_by', None))

    if dept:
        ActivityLog.objects.create(
            user=user,
            department=dept,
            project=project,
            task=task,
            action=action_text
        )

# --- CRM Signals ---

@receiver(post_save, sender=Lead)
def track_lead_changes(sender, instance, created, **kwargs):
    if created:
        log_event(instance, f"New Lead created: {instance.name} ({instance.company_name})")
    else:
        # Check for status changes specifically
        log_event(instance, f"Lead '{instance.name}' updated to status: {instance.get_status_display()}")

# --- Project Signals ---

@receiver(post_save, sender=Project)
def track_project_changes(sender, instance, created, **kwargs):
    if created:
        log_event(instance, f"Project '{instance.name}' initiated for Client: {instance.client.name}", project=instance)
    else:
        log_event(instance, f"Project '{instance.name}' status changed to: {instance.get_status_display()}", project=instance)

# --- Task Signals (Kanban Movements) ---

@receiver(post_save, sender=Task)
def track_task_updates(sender, instance, created, **kwargs):
    if created:
        log_event(
            instance, 
            f"Task created: '{instance.title}'", 
            project=instance.project, 
            task=instance
        )
    else:
        # This captures Kanban board movements
        log_event(
            instance, 
            f"Task '{instance.title}' moved to: {instance.get_status_display()} (Priority: {instance.priority})", 
            project=instance.project, 
            task=instance
        )

@receiver(post_delete, sender=Task)
def track_task_deletion(sender, instance, **kwargs):
    log_event(
        instance, 
        f"Task deleted: '{instance.title}' from Project: {instance.project.name}", 
        project=instance.project
    )