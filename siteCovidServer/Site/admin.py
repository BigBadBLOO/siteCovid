from django.contrib import admin
from Site.models import *
from django.contrib.auth.admin import UserAdmin


# Register your models here.
class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = 'Profile'


class UserAdmin(UserAdmin):
    inlines = (ProfileInline,)


class ProfileAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'group', 'phone', 'is_control')
    search_fields = ['user', 'group', 'phone', 'is_control']
    ordering = ['user__username']


class UserForControlAdmin(admin.ModelAdmin):
    list_display = ('id', 'group', 'post', 'name', 'rank', 'city', 'is_military', 'is_woman_with_children')
    search_fields = ['group__name', 'post__name', 'name', 'rank__name', 'city__name', 'is_military', 'is_woman_with_children']
    ordering = ['name']


admin.site.unregister(User)
admin.site.register(User, UserAdmin)
admin.site.register(UserGroup)
admin.site.register(UserPost)
admin.site.register(City)
admin.site.register(Profile, ProfileAdmin)
admin.site.register(UserForControl, UserForControlAdmin)
admin.site.register(Status)
admin.site.register(DayData)
admin.site.register(Rank)

