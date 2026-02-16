from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _

class ActivityLog(models.Model):
    """
    Enterprise Audit Log to track all significant system events.
    Records are designed to be immutable (read-only) once created.
    """
    
    # Who performed the action
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='activity_logs',
        verbose_name=_('User')
    )
    
    # Department context (Software vs. Marketing)
    # Allows department-specific dashboards to filter activity streams
    department = models.ForeignKey(
        'users.Department',
        on_delete=models.CASCADE,
        related_name='activity_logs',
        verbose_name=_('Department')
    )
    
    # Contextual links (Optional depending on the action)
    project = models.ForeignKey(
        'pms.Project',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='activity_logs'
    )
    
    task = models.ForeignKey(
        'pms.Task',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='activity_logs'
    )
    
    # The Action Description
    # Example: "Converted Lead #402 to Project: 'Grehasoft Web App'"
    action = models.TextField(_('Action Description'))
    
    # Meta Data
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    
    # Technical Metadata for security audits
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        verbose_name = _('Activity Log')
        verbose_name_plural = _('Activity Logs')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['department', '-created_at']),
            models.Index(fields=['user', '-created_at']),
        ]

    def __str__(self):
        user_email = self.user.email if self.user else "System"
        return f"{user_email} - {self.action[:50]} ({self.created_at})"

    def save(self, *args, **kwargs):
        # Enforce immutability: Only allow creation, never updates.
        if self.pk:
            return # Ignore updates to existing logs
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        # Audit logs should generally not be deleted.
        # This is a soft-safety measure; hard deletion via SQL is still possible.
        raise PermissionError("Audit logs are immutable and cannot be deleted via the application.")