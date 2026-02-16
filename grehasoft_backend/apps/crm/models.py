from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from utils.models import TrackingModel  # Abstract base with soft-delete & audit fields

class Client(TrackingModel):
    """
    Verified business entities. A Client is either created manually 
    or generated upon Lead conversion.
    """
    company_name = models.CharField(_('Company Name'), max_length=255, db_index=True)
    contact_person = models.CharField(_('Contact Person'), max_length=255)
    email = models.EmailField(_('Email Address'), unique=True)
    phone = models.CharField(_('Phone Number'), max_length=20, blank=True)
    address = models.TextField(_('Office Address'), blank=True)
    tax_id = models.CharField(_('GST/Tax ID'), max_length=50, blank=True, help_text="Enterprise Tax Identification")
    
    # Domain Separation
    department = models.ForeignKey(
        'users.Department', 
        on_delete=models.PROTECT, 
        related_name='clients'
    )

    class Meta:
        verbose_name = _('Client')
        verbose_name_plural = _('Clients')
        ordering = ['company_name']
        indexes = [
            models.Index(fields=['company_name', 'department']),
        ]

    def __str__(self):
        return self.company_name


class Lead(TrackingModel):
    """
    Prospects captured by Sales Executives. 
    Isolated by department (Software/Marketing).
    """
    class LeadStatus(models.TextChoices):
        NEW = 'new', _('New')
        CONTACTED = 'contacted', _('Contacted')
        QUALIFIED = 'qualified', _('Qualified')
        CONVERTED = 'converted', _('Converted')
        LOST = 'lost', _('Lost')

    class LeadSource(models.TextChoices):
        WEBSITE = 'website', _('Website')
        LINKEDIN = 'linkedin', _('LinkedIn')
        REFERRAL = 'referral', _('Referral')
        COLD_CALL = 'cold_call', _('Cold Call')
        OTHER = 'other', _('Other')

    name = models.CharField(_('Lead Name'), max_length=255)
    email = models.EmailField(_('Email Address'), db_index=True)
    phone = models.CharField(_('Phone Number'), max_length=20)
    company_name = models.CharField(_('Company Name'), max_length=255, blank=True)
    
    source = models.CharField(
        max_length=50, 
        choices=LeadSource.choices, 
        default=LeadSource.WEBSITE
    )
    status = models.CharField(
        max_length=20, 
        choices=LeadStatus.choices, 
        default=LeadStatus.NEW,
        db_index=True
    )
    
    # Domain Separation
    department = models.ForeignKey(
        'users.Department', 
        on_delete=models.PROTECT, 
        related_name='leads'
    )
    
    # Ownership
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_leads'
    )

    # Conversion Tracking
    converted_at = models.DateTimeField(null=True, blank=True)
    converted_project = models.OneToOneField(
        'pms.Project', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='origin_lead'
    )

    class Meta:
        verbose_name = _('Lead')
        verbose_name_plural = _('Leads')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', 'department']),
            models.Index(fields=['email', 'department']),
        ]

    def __str__(self):
        return f"{self.name} ({self.company_name or 'No Company'})"


class LeadFollowUp(TrackingModel):
    """
    Detailed history of interactions with a specific lead.
    Essential for CRM accountability.
    """
    class FollowUpMethod(models.TextChoices):
        CALL = 'call', _('Phone Call')
        EMAIL = 'email', _('Email')
        WHATSAPP = 'whatsapp', _('WhatsApp')
        MEETING = 'meeting', _('In-Person Meeting')

    lead = models.ForeignKey(
        Lead, 
        on_delete=models.CASCADE, 
        related_name='followups'
    )
    method = models.CharField(
        max_length=20, 
        choices=FollowUpMethod.choices, 
        default=FollowUpMethod.CALL
    )
    notes = models.TextField(_('Discussion Notes'))
    next_followup_date = models.DateField(null=True, blank=True)

    class Meta:
        verbose_name = _('Lead Follow-up')
        verbose_name_plural = _('Lead Follow-ups')
        ordering = ['-created_at']

    def __str__(self):
        return f"Follow-up for {self.lead.name} on {self.created_at.date()}"