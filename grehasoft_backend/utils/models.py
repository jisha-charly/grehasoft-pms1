from django.db import models
from django.conf import settings
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

class SoftDeleteQuerySet(models.QuerySet):
    """
    Custom QuerySet that prevents deleted records from appearing in standard queries.
    """
    def active(self):
        return self.filter(deleted_at__isnull=True)

    def deleted(self):
        return self.filter(deleted_at__isnull=False)

class SoftDeleteManager(models.Manager):
    """
    Custom Manager to enforce soft-deletion at the database level.
    """
    def get_queryset(self):
        return SoftDeleteQuerySet(self.model, using=self._db).filter(deleted_at__isnull=True)

class GrehasoftBaseModel(models.Model):
    """
    An abstract base class for all Grehasoft models.
    Provides:
    1. Soft Delete (deleted_at)
    2. Audit Timestamps (created_at, updated_at)
    3. User Attribution (created_by, updated_by)
    """
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True, db_index=True)

    # User Attribution
    # related_name uses %(class)s to ensure unique reverse lookups for each model
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="%(class)s_created"
    )
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="%(class)s_updated"
    )

    # Managers
    objects = SoftDeleteManager()
    all_objects = models.Manager() # Use this to find/restore deleted records

    class Meta:
        abstract = True

    def delete(self, using=None, keep_parents=False):
        """
        Soft delete: Mark as deleted instead of purging from DB.
        """
        self.deleted_at = timezone.now()
        self.save(update_fields=['deleted_at'])

    def restore(self):
        """
        Restore a soft-deleted record.
        """
        self.deleted_at = None
        self.save(update_fields=['deleted_at'])

    def hard_delete(self, *args, **kwargs):
        """
        Actually remove the record from the database.
        Use with caution (e.g., clearing test data).
        """
        super(GrehasoftBaseModel, self).delete(*args, **kwargs)