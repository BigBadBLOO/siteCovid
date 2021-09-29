//core
import {createRef} from 'react'

export default function useCreateRefs() {

    let refGroup_id = createRef();
    let refReal_group_id = createRef();
    let refPost_id = createRef();
    let refRank_id = createRef();
    let refName = createRef();
    let refEmail = createRef();
    // let refPhone = createRef();
    let refCity_id = createRef();
    let refIs_woman_with_children = createRef();
    let refIs_gender = createRef();

    return {
        refGroup_id,
        refReal_group_id,
        refPost_id, refRank_id,
        refName, refEmail, refCity_id,
        refIs_woman_with_children,
        refIs_gender
    };
}
