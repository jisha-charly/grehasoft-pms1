from django.contrib import admin
from django.utils.html import format_html
from .models import (
    Project, ProjectMember, Milestone, 
    Task, TaskAssignment, TaskFile, 
    TaskComment, TaskType
)

# --- Inlines ---

class ProjectMemberInline(admin.TabularInline):
    model = ProjectMember
    extra = 1
    autocomplete_fields = ['user']

class MilestoneInline(admin.TabularInline):
    model = Milestone
    extra = 1

class TaskFileInline(admin.TabularInline):
    model = TaskFile
    extra = 0
    readonly_fields = ['revision_no', 'is_current_version']
    fields = ['file_path', 'file_type', 'revision_no', 'is_current_version']

class TaskAssignmentInline(admin.TabularInline):
    model = TaskAssignment
    extra = 1
    autocomplete_fields = ['employee']

# --- ModelAdmins ---

@admin.register(TaskType)
class TaskTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'client', 'department', 'project_manager', 
        'status_badge', 'progress_bar', 'created_at'
    )
    list_filter = ('status', 'department', 'created_at')
    search_fields = ('name', 'client__company_name', 'project_manager__email')
    list_select_related = ('client', 'department', 'project_manager')
    inlines = [ProjectMemberInline, MilestoneInline]
    readonly_fields = ('progress_percentage', 'created_at', 'updated_at', 'deleted_at')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description', 'client', 'department', 'project_manager')
        }),
        ('Timeline & Status', {
            'fields': ('status', 'progress_percentage', 'start_date', 'end_date')
        }),
        ('Audit Metadata', {
            'classes': ('collapse',),
            'fields': ('created_by', 'created_at', 'updated_at', 'deleted_at'),
        }),
    )

    @admin.display(description='Status')
    def status_badge(self, obj):
        colors = {
            'not_started': '#6c757d',
            'in_progress': '#0d6efd',
            'on_hold': '#ffc107',
            'completed': '#198754',
            'cancelled': '#dc3545',
        }
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 12px; font-size: 11px;">{}</span>',
            colors.get(obj.status, '#000'),
            obj.get_status_display()
        )

    @admin.display(description='Progress')
    def progress_bar(self, obj):
        return format_html(
            '''
            <div style="width: 100px; background-color: #f3f3f3; border-radius: 5px;">
                <div style="width: {}px; background-color: #198754; height: 10px; border-radius: 5px;"></div>
            </div>
            <small>{}%</small>
            ''',
            obj.progress_percentage,
            obj.progress_percentage
        )

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'project', 'task_type', 'priority', 'status', 'board_order', 'due_date')
    list_filter = ('status', 'priority', 'task_type', 'project__department')
    search_fields = ('title', 'description', 'project__name')
    list_select_related = ('project', 'task_type')
    inlines = [TaskAssignmentInline, TaskFileInline]
    ordering = ('project', 'board_order')
    readonly_fields = ('created_at', 'updated_at', 'deleted_at')

    fieldsets = (
        ('Task Details', {
            'fields': ('project', 'milestone', 'task_type', 'title', 'description')
        }),
        ('Kanban Logic', {
            'fields': ('status', 'priority', 'board_order', 'due_date')
        }),
    )

@admin.register(TaskFile)
class TaskFileAdmin(admin.ModelAdmin):
    list_display = ('task', 'file_path', 'revision_no', 'is_current_version', 'created_at')
    list_filter = ('is_current_version', 'file_type')
    list_select_related = ('task',)
    readonly_fields = ('revision_no', 'is_current_version', 'created_at')

@admin.register(TaskComment)
class TaskCommentAdmin(admin.ModelAdmin):
    list_display = ('task', 'user', 'comment_excerpt', 'created_at')
    list_select_related = ('task', 'user')
    readonly_fields = ('created_at',)

    def comment_excerpt(self, obj):
        return obj.comment[:50] + "..." if len(obj.comment) > 50 else obj.comment

# Standard registration for simple models
admin.site.register(Milestone)
admin.site.register(ProjectMember)