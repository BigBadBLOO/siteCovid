from django.contrib import admin
from Site.models import *

# Register your models here.
class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = 'Profile'

admin.site.register(UserGroup)
admin.site.register(City)
admin.site.register(Profile)
admin.site.register(UserForControl)
admin.site.register(Status)
admin.site.register(DayData)
admin.site.register(Rank)

