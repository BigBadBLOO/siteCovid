import {getElemFromObj} from "./localWorkWithList";
import {getGroupList, getNameToGroup} from "./localWorkWithGroup";

export function prepUserMainInfo(user) {
    let result = {};
    if (!!user && typeof user === 'object') {
        let user_main = user.user[0];
        let user_profile = user.user_profile[0];
        let profile_type = user.profile_type;
        let profile_type_list = user.profile_type.map(el => {
            return el.page
        });
        let delegation_user = user.delegation_user;
        let delegations_user = user.delegations_user;
        let delegated_users = user.delegated_users;

        result = {
             ...user_profile, ...user_main,
            profile: profile_type,
            pages: profile_type_list,
            delegation_user,
            delegations_user,
            delegated_users
        };
        // result = {...user_main,...user_profile}
        // console.log(result);
    }
    return result;
}

export function prepUserSubInfo(user, group) {

    let user_group_sub = getGroupList(user, group);

    return {
        user_group: !!user_group_sub ? user_group_sub.find(el => el.id === user.group_id) : null,
        user_group_sub: user_group_sub,
        user_group_sub_id: getElemFromObj(user_group_sub)
    }
}

export function getNameToBoss(is_boss, is_boss_post, group) {
    let result = '';
    result += is_boss_post.name_boss;
    result += ' ';
    result += getNameToGroup(is_boss.group_id, group, true);
    return result;
}