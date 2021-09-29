from django.contrib import admin
from Site.models import *
from django.contrib.auth.admin import UserAdmin


# Register your models here.
class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = 'Profile'


class MyUserAdmin(UserAdmin):
    inlines = (ProfileInline,)


admin.site.unregister(User)
admin.site.register(User, MyUserAdmin)


class MyProfileType(admin.ModelAdmin):
    list_display = [field.name for field in ProfileType._meta.fields]


admin.site.register(ProfileType, MyProfileType)


class ProfileTypeSelectInline(admin.StackedInline):
    model = ProfileTypeSelect
    extra = 0


class ProfileAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Profile._meta.fields]
    inlines = [ProfileTypeSelectInline]
    search_fields = ['user', 'group', 'phone', 'is_control']
    ordering = ['user__username']


admin.site.register(Profile, ProfileAdmin)


class UserForControlAdmin(admin.ModelAdmin):
    list_display = ('id', 'group', 'post', 'name', 'rank', 'city', 'is_military', 'is_woman_with_children')
    search_fields = ['group__name', 'post__name', 'name', 'rank__name', 'city__name', 'is_military', 'is_woman_with_children']
    ordering = ['name']


admin.site.register(UserForControl, UserForControlAdmin)


class MyUserGroup(admin.ModelAdmin):
    list_display = [field.name for field in UserGroup._meta.fields]


admin.site.register(UserGroup, MyUserGroup)


class MyUserPost(admin.ModelAdmin):
    list_display = [field.name for field in UserPost._meta.fields]


admin.site.register(UserPost, MyUserPost)


class MyCity(admin.ModelAdmin):
    list_display = [field.name for field in City._meta.fields]


admin.site.register(City, MyCity)


class MyStatus(admin.ModelAdmin):
    list_display = [field.name for field in Status._meta.fields]


admin.site.register(Status, MyStatus)


class MyDayData(admin.ModelAdmin):
    list_display = [field.name for field in DayData._meta.fields]


admin.site.register(DayData, MyDayData)


class MyRank(admin.ModelAdmin):
    list_display = [field.name for field in Rank._meta.fields]


admin.site.register(Rank, MyRank)


class MyVaccine(admin.ModelAdmin):
    list_display = [field.name for field in Vaccine._meta.fields]


admin.site.register(Vaccine, MyVaccine)


class MyHolidays(admin.ModelAdmin):
    list_display = [field.name for field in Holidays._meta.fields]


admin.site.register(Holidays, MyHolidays)

admin.site.register(DutyByMonth)
admin.site.register(TypeRank)
admin.site.register(CountDutyInHolidays)
admin.site.register(Overtime)
admin.site.register(ExtraDataForDayData)




