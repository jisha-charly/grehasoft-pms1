from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from utils.models import GrehasoftBaseModel  # Established in previous steps

class TaskType(GrehasoftBaseModel):
    """
    Classifies tasks for departmental specialization (e.g., 'Frontend', 'SEO', 'UI Design').
    Allows Dashboards to report on task distribution.
    """
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Project(GrehasoftBaseModel):
    """
    The central entity for all work. Linked to a Client and a Department.
    """
    class Status(models.TextChoices):
        NOT_STARTED = 'not_started', _('Not Started')
        IN_PROGRESS = 'in_progress', _('In Progress')
        ON_HOLD = 'on_hold', _('On Hold')
        COMPLETED = 'completed', _('Completed')
        CANCELLED = 'cancelled', _('Cancelled')

    name = models.CharField(_('Project Name'), max_length=200, db_index=True)
    description = models.TextField(blank=True)
    client = models.ForeignKey(
        'crm.Client', 
        on_delete=models.PROTECT, 
        related_name='projects'
    )
    department = models.ForeignKey(
        'users.Department', 
        on_delete=models.PROTECT, 
        related_name='projects'
    )
    project_manager = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.PROTECT, 
        related_name='managed_projects'
    )
    
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    status = models.CharField(
        max_length=20, 
        choices=Status.choices, 
        default=Status.NOT_STARTED, 
        db_index=True
    )
    progress_percentage = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = _('Project')
        verbose_name_plural = _('Projects')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['department', 'status', 'deleted_at']),
        ]

    def __str__(self):
        return self.name


class ProjectMember(models.Model):
    """
    Junction table for RBAC project-level access.
    Determines who can see a project outside of their department.
    """
    class ProjectRole(models.TextChoices):
        PM = 'PM', _('Project Manager')
        MEMBER = 'MEMBER', _('Team Member')
        QA = 'QA', _('Quality Assurance')
        VIEWER = 'VIEWER', _('Viewer')

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='members')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='project_memberships')
    role_in_project = models.CharField(max_length=10, choices=ProjectRole.choices, default=ProjectRole.MEMBER)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('project', 'user')

    def __str__(self):
        return f"{self.user.get_full_name()} in {self.project.name}"


class Milestone(GrehasoftBaseModel):
    """
    High-level project targets used for roadmap visualization.
    """
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='milestones')
    title = models.CharField(max_length=200)
    due_date = models.DateField()
    is_completed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.project.name} - {self.title}"


class Task(GrehasoftBaseModel):
    """
    The granular unit of work. Designed for Kanban efficiency.
    """
    class Priority(models.TextChoices):
        LOW = 'low', _('Low')
        MEDIUM = 'medium', _('Medium')
        HIGH = 'high', _('High')
        CRITICAL = 'critical', _('Critical')

    class Status(models.TextChoices):
        TODO = 'todo', _('To Do')
        IN_PROGRESS = 'in_progress', _('In Progress')
        REVIEW = 'review', _('Review')
        DONE = 'done', _('Done')
        BLOCKED = 'blocked', _('Blocked')

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='tasks')
    milestone = models.ForeignKey(Milestone, on_delete=models.SET_NULL, null=True, blank=True, related_name='tasks')
    task_type = models.ForeignKey(TaskType, on_delete=models.PROTECT, related_name='tasks')
    
    title = models.CharField(max_length=255, db_index=True)
    description = models.TextField(blank=True)
    priority = models.CharField(max_length=10, choices=Priority.choices, default=Priority.MEDIUM)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.TODO, db_index=True)
    
    board_order = models.PositiveIntegerField(default=0)  # For Drag-and-Drop persistency
    due_date = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = _('Task')
        verbose_name_plural = _('Tasks')
        ordering = ['board_order', 'created_at']
        indexes = [
            models.Index(fields=['project', 'status', 'board_order', 'deleted_at']),
        ]

    def __str__(self):
        return self.title


class TaskAssignment(GrehasoftBaseModel):
    """
    Links multiple users to a single task.
    """
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='assignments')
    employee = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='assigned_tasks')
    assigned_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='given_assignments')

    class Meta:
        unique_together = ('task', 'employee')


class TaskFile(GrehasoftBaseModel):
    """
    Document management with revision tracking logic.
    """
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='files')
    file_path = models.FileField(upload_to='pms/tasks/%Y/%m/')
    file_type = models.CharField(max_length=100)
    revision_no = models.PositiveIntegerField(default=1)
    is_current_version = models.BooleanField(default=True, db_index=True)

    class Meta:
        verbose_name = _('Task File')
        verbose_name_plural = _('Task Files')


class TaskComment(GrehasoftBaseModel):
    """
    Communication log for specific tasks.
    """
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    comment = models.TextField()

    class Meta:
        ordering = ['created_at']
