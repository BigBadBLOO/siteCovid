import {getNameToBoss} from "./localWorkWithUser";
import {orderList} from "./localWorkWithList";

export function get_bos_info(post, person, rank, group, listOfReport, status) {
    post = orderList(post.filter(el => el.is_boss), ['position']);
    group = orderList(group, ['position', 'name']);

    let is_boss = null;

    post.forEach(p => {
        if (!is_boss) {
            let is_boss_list = person.filter(el => p.id === el.post_id);

            if (is_boss_list.length === 1 && person_on_work(is_boss_list[0], listOfReport, status)) {
                is_boss = is_boss_list[0];
            } else {
                if (is_boss_list.length > 1) {
                    group.forEach(g => {
                        let is_boss_list_by_g = is_boss_list.find(el => g.id === el.real_group_id);
                        if (!is_boss) {
                            if (!!is_boss_list_by_g && person_on_work(is_boss_list_by_g, listOfReport, status)) {
                                is_boss = is_boss_list_by_g;
                            }
                        }
                    })
                }
            }
        }
    });

    let is_boss_rank = rank.find(el => el.id === (!!is_boss ? is_boss.rank_id : null));
    let is_boss_post = post.find(el => el.id === (!!is_boss ? is_boss.post_id : null));

    return {
        'post_id__name': (!!is_boss_post ?
            (getNameToBoss(is_boss, is_boss_post, group))
            : ''),
        'rank_id__name': (!!is_boss_rank ? is_boss_rank.name : ''),
        'name': (!!is_boss ? is_boss.name : '')
    }

}

export function person_on_work(boss, listOfReport, status) {
    const el_report = listOfReport.find(obj => obj.userForControl_id === boss.id);
    const el_status = status.find(obj => obj.id === (!!el_report ? el_report.status_id : null));

    return !!el_status && el_status.with_work;
}