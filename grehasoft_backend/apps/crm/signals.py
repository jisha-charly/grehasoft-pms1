import logging
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Lead, Client, LeadFollowUp
from apps.activity_logs.utils import create_activity_log

logger = logging.getLogger(__name__)

@receiver(post_save, sender=Lead)
def track_lead_activity(sender, instance, created, **kwargs):
    """
    Automatically audits Lead creation and status updates.
    """
    try:
        # Determine the user who performed the action from TrackingModel fields
        user = instance.updated_by if instance.updated_by else instance.created_by
        
        if created:
            action = f"Created new Lead: {instance.name} ({instance.company_name or 'No Company'})"
        else:
            # We track status transitions for the sales pipeline audit
            action = f"Updated Lead '{instance.name}' status to: {instance.get_status_display()}"
            if instance.status == Lead.LeadStatus.CONVERTED:
                action = f"Lead '{instance.name}' successfully CONVERTED to Project."

        create_activity_log(
            user=user,
            action=action,
            department=instance.department,
            # Link to project if lead was just converted
            project=instance.converted_project if hasattr(instance, 'converted_project') else None
        )
    except Exception as e:
        logger.error(f"Signal Error (Lead Audit): {str(e)}")


@receiver(post_save, sender=Client)
def track_client_activity(sender, instance, created, **kwargs):
    """
    Audits the creation or modification of Client entities.
    """
    try:
        user = instance.updated_by if instance.updated_by else instance.created_by
        
        if created:
            action = f"System registered new Client: {instance.company_name}"
        else:
            action = f"Updated Client profile for: {instance.company_name}"

        create_activity_log(
            user=user,
            action=action,
            department=instance.department
        )
    except Exception as e:
        logger.error(f"Signal Error (Client Audit): {str(e)}")


@receiver(post_save, sender=LeadFollowUp)
def track_followup_activity(sender, instance, created, **kwargs):
    """
    Audits every sales interaction (Calls, Meetings, etc.).
    """
    if created:
        try:
            user = instance.created_by
            action = f"Logged {instance.get_method_display()} follow-up for Lead: {instance.lead.name}"
            
            create_activity_log(
                user=user,
                action=action,
                department=instance.lead.department
            )
        except Exception as e:
            logger.error(f"Signal Error (FollowUp Audit): {str(e)}")