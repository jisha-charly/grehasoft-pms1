import logging
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db.models import Avg, Count, Q

from .models import Project, Task, ProjectMember, TaskFile
from apps.activity_logs.utils import create_activity_log

logger = logging.getLogger(__name__)

@receiver(post_save, sender=Project)
def ensure_pm_is_member(sender, instance, created, **kwargs):
    """
    Business Rule: Every Project Manager assigned to a project must 
    automatically be added to the ProjectMember table for access control.
    """
    if created or instance.tracker.has_changed('project_manager_id'):
        ProjectMember.objects.get_or_create(
            project=instance,
            user=instance.project_manager,
            defaults={'role_in_project': ProjectMember.ProjectRole.PM}
        )

@receiver(post_save, sender=Task)
def update_project_progress(sender, instance, **kwargs):
    """
    Performance: Automatically recalculates parent project progress 
    whenever a task is updated or created.
    """
    project = instance.project
    total_tasks = project.tasks.count()
    
    if total_tasks > 0:
        done_tasks = project.tasks.filter(status=Task.Status.DONE).count()
        progress = int((done_tasks / total_tasks) * 100)
    else:
        progress = 0

    # We use .update() instead of .save() to avoid re-triggering Project signals
    Project.objects.filter(id=project.id).update(progress_percentage=progress)


@receiver(post_save, sender=Task)
def audit_task_activity(sender, instance, created, **kwargs):
    """
    Audit Trail: Logs task creation and Kanban status movements.
    """
    user = instance.updated_by if instance.updated_by else instance.created_by
    
    if created:
        action = f"Task Created: '{instance.title}' in Project '{instance.project.name}'"
    else:
        action = f"Task '{instance.title}' moved to status: {instance.get_status_display()}"

    create_activity_log(
        user=user,
        action=action,
        department=instance.project.department,
        project=instance.project,
        task=instance
    )


@receiver(post_save, sender=TaskFile)
def audit_file_versioning(sender, instance, created, **kwargs):
    """
    Audit Trail: Tracks when new document versions are uploaded to a task.
    """
    if created:
        user = instance.created_by
        action = f"Uploaded v{instance.revision_no} for file: {instance.file_path.name.split('/')[-1]}"
        
        create_activity_log(
            user=user,
            action=action,
            department=instance.task.project.department,
            project=instance.task.project,
            task=instance.task
        )


@receiver(post_delete, sender=Task)
def update_progress_on_task_delete(sender, instance, **kwargs):
    """
    Ensures project progress is recalculated even if a task is deleted.
    """
    # Triggering the same logic as post_save
    update_project_progress(sender, instance)