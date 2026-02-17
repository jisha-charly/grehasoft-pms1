from django.contrib import admin
from .models import Client, Lead, LeadFollowUp


# ===============================
# Client Admin
# ===============================
@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = (
        "company_name",
        "contact_person",
        "email",
        "department",
        "created_at",
    )
    search_fields = ("company_name", "contact_person", "email")
    list_filter = ("department",)
    ordering = ("company_name",)


# ===============================
# Lead Admin
# ===============================
@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "company_name",
        "email",
        "status",
        "department",
        "assigned_to",
        "created_at",
    )
    search_fields = ("name", "company_name", "email")
    list_filter = ("status", "department", "source")
    ordering = ("-created_at",)


# ===============================
# Lead Follow-Up Admin
# ===============================
@admin.register(LeadFollowUp)
class LeadFollowUpAdmin(admin.ModelAdmin):
    list_display = (
        "lead",
        "method",
        "next_followup_date",
        "created_at",
    )
    search_fields = ("lead__name",)
    list_filter = ("method",)
    ordering = ("-created_at",)
