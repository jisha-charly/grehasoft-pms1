from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from utils.models import GrehasoftBaseModel # Inherits soft-delete & tracking

class Client(GrehasoftBaseModel):
    """
    Converted Leads or direct business entities. 
    Owned by a specific department (Software or Marketing).
    """
    name = models.CharField(_('Contact Name'), max_length=150)
    company_name = models.CharField(_('Company Name'), max_length=200, db_index=True)
    email = models.EmailField(_('Email'), unique=True)
    phone = models.CharField(_('Phone'), max_length=20, blank=True)
    
    # Tax/Enterprise info
    tax_id = models.CharField(_('GST/Tax ID'), max_length=50, blank=True, null=True)
    address = models.TextField(_('Address'), blank=True)
    website = models.URLField(_('Website'), blank=True)
    
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
        return f"{self.company_name} ({self.name})"


class Lead(GrehasoftBaseModel):
    """
    Initial prospects that can be qualified and converted.
    """
    class Status(models.TextChoices):
        NEW = 'new', _('New')
        CONTACTED = 'contacted', _('Contacted')
        QUALIFIED = 'qualified', _('Qualified')
        CONVERTED = 'converted', _('Converted')
        LOST = 'lost', _('Lost')

    name = models.CharField(_('Lead Name'), max_length=150)
    email = models.EmailField(_('Email Address'), db_index=True)
    phone = models.CharField(_('Phone Number'), max_length=20)
    company_name = models.CharField(_('Company Name'), max_length=200, blank=True)
    source = models.CharField(_('Lead Source'), max_length=100, blank=True) # LinkedIn, Website, Referral
    
    status = models.CharField(
        max_length=20, 
        choices=Status.choices, 
        default=Status.NEW,
        db_index=True
    )
    
    department = models.ForeignKey(
        'users.Department', 
        on_delete=models.PROTECT, 
        related_name='leads'
    )
    
    # Optional link to the project created upon conversion
    converted_project = models.OneToOneField(
        'pms.Project', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='source_lead'
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
        return f"{self.name} - {self.company_name or 'Individual'}"


class LeadFollowUp(GrehasoftBaseModel):
    """
    History of interactions for a specific Lead.
    """
    class Method(models.TextChoices):
        CALL = 'call', _('Phone Call')
        EMAIL = 'email', _('Email')
        WHATSAPP = 'whatsapp', _('WhatsApp')
        MEETING = 'meeting', _('Meeting')

    lead = models.ForeignKey(
        Lead, 
        on_delete=models.CASCADE, 
        related_name='followups'
    )
    method = models.CharField(
        max_length=20, 
        choices=Method.choices, 
        default=Method.CALL
    )
    notes = models.TextField(_('Discussion Notes'))
    next_followup_date = models.DateField(null=True, blank=True)
    is_completed = models.BooleanField(default=False)

    class Meta:
        verbose_name = _('Lead Follow-up')
        verbose_name_plural = _('Lead Follow-ups')
        ordering = ['-created_at']

    def __str__(self):
        return f"Follow-up for {self.lead.name} on {self.created_at.date()}"