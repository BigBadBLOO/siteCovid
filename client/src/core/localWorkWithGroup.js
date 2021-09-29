import {getMainParent, getSubList} from "./localWorkWithList";

export function getGroupList(user, groupList) {
    if (user.profile.find(el => el.action === 'get_all_user')) {
        return groupList;
    } else {
        return getSubList(user.group_id, groupList)
    }
}

export function getNameToGroupList(group, groupList, boss = false) {
    let result = [];

    if (!!group) {
        group = typeof group === 'object' ? group : groupList.find(el => el.id === group);
        result.push(boss ? (!!group.name_boss ? group.name_boss : group.name) : group.name);
        const parent = getMainParent(group, groupList);
        if (!!parent) {
            result.push(...getNameToGroupList(parent, groupList, boss));
        }
    }
    return result;
}


export function getNameToGroup(group, groupList, boss = false) {
    return getNameToGroupList(group, groupList, boss).join(' ');
}

export function getNameToGroupSelect(group, groupList) {
    const nameList = getNameToGroupList(group, groupList);
    const levelList = '-'.repeat(nameList.length - 1);
    return (!!levelList ? levelList + ' ' : '') + nameList.join(' ');
}