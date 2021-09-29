//core
import {useEffect} from 'react'

//functions
import workWithServer from '../workWithServer'
import {orderList, orderTree} from "../localWorkWithList";
import {prepUserMainInfo, prepUserSubInfo} from "../localWorkWithUser";


export function useInitUser(user, initUser, initGroup, initRank, initHolidays, initStatus, initPost, initPerson) {
    useEffect(() => {
        workWithServer.initUser()
            .then(data => {
                let new_user = prepUserMainInfo(data);
                let new_group = orderTree(orderList(data.group, ['parent_id', 'position', 'name', 'id']));
                initGroup(new_group);
                initUser({...new_user, is_initial: true, ...prepUserSubInfo(new_user, new_group)});
            })
            .catch(() => initUser({...user, is_initial: true}));

        workWithServer.initMainInfo()
            .then(data => {
                const ranks = data.ranks.map(el => {
                    el.type = data.typeRanks.find(type => type.id === el.type_id);
                    return el
                });
                initRank(orderList(ranks, ['position', 'name', 'id']));
                initPost(orderList(data.posts, ['position', 'name', 'id']));
                initHolidays(data.holidays);
                initStatus(orderList(data.status, ['name', 'id']));
            });

        workWithServer.getListOfPerson()
            .then(data => initPerson(orderList(data, ['~is_military', 'name', 'id'])))
    }, []);
}
