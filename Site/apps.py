from django.apps import AppConfig
from datetime import datetime, date


class SiteConfig(AppConfig):
    name = 'Site'


def my_convert_date(o):
    if isinstance(o, date):
        return for_date(o)


def for_date(self):
    if self is not None:
        return self.strftime("%Y-%m-%d").__str__()
    else:
        return ''


def ldap_parser(user_info_list):
    full_info = []
    for user_info in user_info_list:
        result = {}
        user_info = user_info.split(',')

        for info in user_info:
            info = info.strip().split('=')
            if len(info) == 2:
                info_0 = info[0].lower().strip()
                info_1 = info[1].strip()
                if info_0 in result:
                    result[info_0].append(info_1)
                else:
                    result[info_0] = [info_1]

        if 'ou' in result:
            result['ou'] = list(reversed(result['ou']))

        full_info.append(result)

    return full_info


def from_list_by_key(arr, key):
    result = []

    key = key.lower()

    for d in arr:
        if key in d:
            result = result + d[key]

    return result


def from_list_by_val_key(arr, key, val):
    result = []

    key = key.lower()

    for d in arr:
        if key in d:
            if d[key].__contains__(val):
                result.append(d)

    return result
