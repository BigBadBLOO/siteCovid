(this.webpackJsonpuntitled=this.webpackJsonpuntitled||[]).push([[0],{156:function(e,t,n){},158:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),l=n(21),c=n.n(l),i=(n(85),n(6)),s=n(14),o=n(35),u=n.n(o),m=n(57),d=n(36),f={initUser:function(){return h("/initUser/")},login:function(e){return h("/login/",e)},logOut:function(){return h("/logout/")},changePassword:function(e){return h("/changePassword/",e)},getListOfCity:function(){return h("/getListOfCity/")},getListOfPerson:function(){return h("/getListOfPerson/")},setListOfPerson:function(e){return h("/setListOfPerson/",e)},getListOfStatus:function(){return h("/getListOfStatus/")},setListOfReport:function(e){return h("/setListOfReport/",e)},getListOfReport:function(e){return h("/getListOfReport/",e)},getListOfRank:function(e){return h("/getListOfRank/",e)},getListOfGroup:function(e){return h("/getListOfGroup/",e)}};function b(e){return e.status>=200&&e.status<300?Promise.resolve(e.json()):Promise.reject(new Error(e.statusText))}function p(e,t){return E.apply(this,arguments)}function E(){return(E=Object(m.a)(u.a.mark((function e(t,n){return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(d.trackPromise)(fetch(t,n).then(b));case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function h(e,t){return g.apply(this,arguments)}function g(){return(g=Object(m.a)(u.a.mark((function e(t,n){var a,r;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a={Accept:"application/json, text/plain, */*","Content-type":"application/x-www-form-urlencoded; charset=UTF-8","X-Requested-With":"XMLHttpRequest"},(r=w("csrftoken"))&&(a["X-CSRFToken"]=r),e.next=5,p(t,{credentials:"include",method:"POST",mode:"same-origin",headers:a,body:JSON.stringify(n)});case 5:return e.abrupt("return",e.sent);case 6:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function w(e){var t=document.cookie.match(new RegExp("(?:^|; )"+e.replace(/([.$?*|{}()[]\/+^])/g,"\\$1")+"=([^;]*)"));return t?decodeURIComponent(t[1]):void 0}var _=n(4);function N(e){var t=e.icon,n=e.type,a=e.text,l=e.onClick,c=e.className,i=e.disabled,s=e.classNameText,o=["rounded-md px-2 py-1 m-2 place-content-center focus:outline-none "];return o.push(c),"primary"===n?o.push("text-white bg-blue-500 bg-opacity-75 hover:bg-opacity-100"):"success"===n?o.push("text-white bg-green-600"):"secondary"===n?o.push("text-white bg-gray-600"):"danger"===n?o.push("text-white bg-red-600"):"warning"===n&&o.push("text-white bg-yellow-600"),r.a.createElement("button",{className:o.join(" "),onClick:l,disabled:i},t?r.a.createElement("i",{className:"material-icons mx-1 float-left"},t):"",r.a.createElement("span",{className:"my-auto "+s},a))}var O=function(e){return r.a.createElement("input",{className:"rounded border border-blue-700 p-1",onClick:e.onClick,value:e.value,type:"text",readOnly:!0})};function y(e){return{type:"InitUser",user:e}}var v=Object(s.b)(null,(function(e){return{initUser:function(t){return e(y(t))}}}))((function(e){var t=e.initUser,n=Object(a.useState)(""),l=Object(_.a)(n,2),c=l[0],s=l[1],o=Object(a.useState)(!0),u=Object(_.a)(o,2),m=u[0],d=u[1],b=Object(a.useState)(""),p=Object(_.a)(b,2),E=p[0],h=p[1],g=Object(a.useState)(!0),w=Object(_.a)(g,2),O=w[0],y=w[1];return r.a.createElement("div",{className:"mt-40"},r.a.createElement("p",{className:"text-3xl mx-auto text-center"}," \u041f\u0440\u043e\u0439\u0434\u0438\u0442\u0435 \u0430\u0432\u0442\u043e\u0440\u0438\u0437\u0430\u0446\u0438\u044e \u0432 \u0441\u0438\u0441\u0442\u0435\u043c\u0435"),r.a.createElement("form",{className:"pt-4 w-1/2 mx-auto",onSubmit:function(e){e.preventDefault();var n=c.length>0,a=E.length>0;d(n),y(a),d&&a&&f.login({username:c,password:E}).then((function(e){e.error?d(!1):t(Object(i.a)(Object(i.a)({},e),{},{is_initial:!0}))})).catch((function(){d(!1)}))}},r.a.createElement("div",{className:"mb-2"},r.a.createElement("label",{className:"block mb-1",htmlFor:"name"},"\u0418\u043c\u044f"),r.a.createElement("input",{className:"appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-600",id:"email",type:"text",placeholder:"\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0438\u043c\u044f",value:c,onChange:function(e){s(e.target.value),d(!0)}}),!m&&r.a.createElement("label",{className:"text-xs text-red-400 pl-2"},"\u041f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044f \u043d\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442")),r.a.createElement("div",{className:"mb-2"},r.a.createElement("label",{className:"block mb-1",htmlFor:"password"},"\u041f\u0430\u0440\u043e\u043b\u044c"),r.a.createElement("input",{className:"appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-600",id:"password",type:"password",placeholder:"\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043f\u0430\u0440\u043e\u043b\u044c",onChange:function(e){h(e.target.value),y(!0)}}),!O&&r.a.createElement("label",{className:"text-xs text-red-400 pl-2"},"\u041d\u0435\u043a\u043e\u0440\u0440\u0435\u043a\u0442\u043d\u044b\u0439 \u043f\u0430\u0440\u043e\u043b\u044c")),r.a.createElement("div",{className:"mb-2 text-center"},r.a.createElement(N,{text:"\u0412\u043e\u0439\u0442\u0438 \u0432 \u0430\u043a\u043a\u0430\u0443\u043d\u0442",type:"primary"}))))}));var x=Object(s.b)((function(e){return{user:e.user}}),(function(e){return{initUser:function(t){return e(y(t))}}}))((function(e){var t=e.user,n=e.initUser,l=e.headerRef,c=Object(a.useState)(!1),s=Object(_.a)(c,2),o=s[0],u=s[1],m=Object(a.useState)(""),d=Object(_.a)(m,2),b=d[0],p=d[1];return r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{ref:l,className:"p-3 border-b flex justify-between"},r.a.createElement("span",{className:"my-auto p-2 border rounded border-blue-600"},t.username," - ",t.group),r.a.createElement("div",null,!t.is_control&&(o?r.a.createElement(r.a.Fragment,null,r.a.createElement("input",{type:"text",className:"rounded border border-blue-700 p-1",value:b,onChange:function(e){p(e.target.value)},placeholder:"\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043d\u043e\u0432\u044b\u0439 \u043f\u0430\u0440\u043e\u043b\u044c..."}),r.a.createElement(N,{type:"warning",onClick:function(){u(!1),f.changePassword({password:b}).then((function(){n(Object(i.a)(Object(i.a)({},t),{},{username:""}))}))},text:"\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u043f\u0430\u0440\u043e\u043b\u044c"})):r.a.createElement(N,{className:"",type:"warning",onClick:function(){u(!0)},text:"\u0421\u043c\u0435\u043d\u0438\u0442\u044c \u043f\u0430\u0440\u043e\u043b\u044c"})),r.a.createElement(N,{className:"",type:"primary",onClick:function(){f.logOut().then((function(){return n(Object(i.a)(Object(i.a)({},t),{},{username:""}))}))},text:"\u0412\u044b\u0439\u0442\u0438"}))))})),k=n(10),j=n(38),S=n.n(j);function C(e){var t=e.setShowBody,n=Object(a.useState)(!1),l=Object(_.a)(n,2),c=l[0],i=l[1],s=Object(a.useState)(-1),o=Object(_.a)(s,2),u=o[0],m=o[1],d=Object(a.useState)([]),b=Object(_.a)(d,2),p=b[0],E=b[1],h=Object(a.useState)([]),g=Object(_.a)(h,2),w=g[0],O=g[1],y=Object(a.useState)([]),v=Object(_.a)(y,2),x=v[0],j=v[1],C=[],R=Object(a.createRef)(),L=Object(a.createRef)(),P=Object(a.createRef)(),F=Object(a.createRef)(),T=Object(a.createRef)();Object(a.useEffect)((function(){f.getListOfCity().then(E),f.getListOfPerson().then(j),f.getListOfRank().then(O)}),[]),Object(a.useEffect)((function(){x.filter((function(e){return e.is_editable})).map((function(e){R.current.value=e.is_military.toString(),L.current.value=Number(e.rank_id),P.current.value=e.name,F.current.value=Number(e.city_id),T.current.value=e.is_woman_with_children.toString()}))}),[x]);var U=[{name:"\u2116",selector:"id",sortable:!0,cell:function(e,t){return r.a.createElement("div",null,t+1)}},{name:"\u0412\u043e\u0435\u043d\u043d\u043e\u0441\u043b\u0443\u0436\u0430\u0449\u0438\u0439 \u0438\u043b\u0438 \u0433\u0440. \u043f\u0435\u0440\u0441\u043e\u043d\u0430\u043b",selector:"is_military",sortable:!0,cell:function(e){return e.is_editable?r.a.createElement("select",{ref:R,className:"w-full h-full border-b border-blue-700 bg-white"},r.a.createElement("option",{value:!0},"\u0412\u043e\u0435\u043d\u043d\u043e\u0441\u043b\u0443\u0436\u0430\u0449\u0438\u0439"),r.a.createElement("option",{value:!1},"\u0413\u0440. \u043f\u0435\u0440\u0441\u043e\u043d\u0430\u043b")):r.a.createElement("div",null,e.is_military?"\u0412\u043e\u0435\u043d\u043d\u043e\u0441\u043b\u0443\u0436\u0430\u0449\u0438\u0439":"\u0413\u0440. \u043f\u0435\u0440\u0441\u043e\u043d\u0430\u043b")}},{name:"\u0412\u043e\u0438\u043d\u0441\u043a\u043e\u0435 \u0437\u0432\u0430\u043d\u0438\u0435",selector:"rank_id",sortable:!0,cell:function(e){return e.is_editable?r.a.createElement("select",{ref:L,className:"w-full h-full border-b border-blue-700 bg-white"},r.a.createElement("option",{value:""},"\u0421\u0431\u0440\u043e\u0441\u0438\u0442\u044c \u0432\u043e\u0438\u043d\u0441\u043a\u043e\u0435 \u0437\u0432\u0430\u043d\u0438\u0435"),w.map((function(e){return r.a.createElement("option",{key:e.id,value:e.id},e.name)}))):r.a.createElement("div",null,w.filter((function(t){return t.id===Number(e.rank_id)})).map((function(e){return e.name})))}},{name:"\u0424\u0418\u041e",selector:"name",sortable:!0,cell:function(e){return e.is_editable?r.a.createElement("input",{ref:P,className:"w-full h-full border-b border-blue-700 bg-white"}):r.a.createElement("div",null,e.name)}},{name:"\u0413\u043e\u0440\u043e\u0434",selector:"city_id",sortable:!0,cell:function(e){return e.is_editable?r.a.createElement("select",{ref:F,className:"w-full h-full border-b border-blue-700 bg-white"},p.map((function(e){return r.a.createElement("option",{key:e.id,value:e.id},e.name)}))):r.a.createElement("div",null,p.filter((function(t){return t.id===Number(e.city_id)})).map((function(e){return e.name})))}},{name:"\u042f\u0432\u043b\u044f\u0435\u0442\u0441\u044f \u043b\u0438 \u0436\u0435\u043d\u0449\u0438\u043d\u043e\u0439 \u0441 \u0434\u0435\u0442\u044c\u043c\u0438 \u0434\u043e 14 \u043b\u0435\u0442?",selector:"is_woman_with_children",sortable:!0,cell:function(e){return e.is_editable?r.a.createElement("select",{ref:T,className:"w-full h-full border-b border-blue-700 bg-white"},r.a.createElement("option",{value:!0},"\u0414\u0430"),r.a.createElement("option",{value:!1},"\u041d\u0435\u0442")):r.a.createElement("div",null,e.is_woman_with_children?"\u0414\u0430":"\u041d\u0435\u0442")}},{name:"\u0418\u0437\u043c\u0435\u043d\u0438\u0442\u044c",selector:"edit",sortable:!0,cell:function(e){return e.is_editable?r.a.createElement(N,{type:"warning",text:"\u041f\u0440\u0438\u043c\u0435\u043d\u0438\u0442\u044c",onClick:function(){j((function(t){return t.map((function(t){return t.id===e.id&&(t.is_editable=!1,t.is_military="true"===R.current.value,t.rank_id=L.current.value,t.name=P.current.value,t.city_id=F.current.value,t.is_woman_with_children="true"===T.current.value),t}))}))}}):r.a.createElement(N,{type:"warning",text:"\u0418\u0437\u043c\u0435\u043d\u0438\u0442\u044c",onClick:function(){j((function(t){return t.map((function(t){return t.is_editable=t.id===e.id,t}))}))}})}}],I=r.a.createElement(N,{className:"text-base",type:"primary",text:"\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c",onClick:function(){j([{id:u,is_military:!0,name:"",is_woman_with_children:!1,is_editable:!0}].concat(Object(k.a)(x.map((function(e){return e.is_editable=!1,e}))))),m((function(e){return e-1}))}}),B=r.a.createElement(N,{className:"text-base",type:"danger",text:"\u0423\u0434\u0430\u043b\u0438\u0442\u044c",onClick:function(){var e=C.map((function(e){return e.id}));j(x.filter((function(t){return-1===e.indexOf(t.id)}))),i(!c)}});return r.a.createElement("div",null,r.a.createElement("div",null,r.a.createElement(N,{className:"",type:"primary",text:"\u041d\u0430\u0437\u0430\u0434",onClick:function(){t("nothing")}}),r.a.createElement(N,{className:"",type:"success",text:"\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c",onClick:function(){f.setListOfPerson({data:x}).then((function(){return t("nothing")}))}})),r.a.createElement(S.a,{title:"\u0423\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u043b\u0438\u0447\u043d\u044b\u043c \u0441\u043e\u0441\u0442\u0430\u0432\u043e\u043c \u0446\u0435\u043d\u0442\u0440\u0430",columns:U,selectableRows:!0,data:x,pagination:!0,onSelectedRowsChange:function(e){C=e.selectedRows},contextMessage:{singular:"\u0441\u0442\u0440\u043e\u043a\u0430",plural:"\u0441\u0442\u0440\u043e\u043a",message:""},contextActions:B,actions:I,clearSelectedRows:c,paginationComponentOptions:{rowsPerPageText:"\u0421\u0442\u0440\u043e\u043a \u043d\u0430 \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0435:",rangeSeparatorText:"\u0438\u0437",noRowsPerPage:!1,selectAllRowsItem:!1,selectAllRowsItemText:"\u0412\u0441\u0435"}}))}var R=n(26),L=n.n(R);n(66);var P=function(e){var t=e.setShowBody,n=Object(a.useState)(new Date),l=Object(_.a)(n,2),c=l[0],s=l[1],o=Object(a.createRef)(),u=Object(a.createRef)(),m=Object(a.useState)([]),d=Object(_.a)(m,2),b=d[0],p=d[1],E=Object(a.useState)([]),h=Object(_.a)(E,2),g=h[0],w=h[1],y=function(){f.getListOfReport({date:c}).then((function(e){w((function(t){return Object(k.a)(t.map((function(t){var n=e.filter((function(e){return e.userForControl_id===t.id}));return n.length>0?Object(i.a)(Object(i.a)({},t),n[0]):(delete t.comment,delete t.status_id,t)})))}))}))};Object(a.useEffect)((function(){f.getListOfPerson().then((function(e){w(e),y()})),f.getListOfStatus().then(p)}),[]);var v=[{name:"\u2116",selector:"id",sortable:!0,cell:function(e,t){return r.a.createElement("div",null,t+1)}},{name:"\u0412\u043e\u0438\u043d\u0441\u043a\u043e\u0435 \u0437\u0432\u0430\u043d\u0438\u0435",selector:"rank_id__name",sortable:!0},{name:"\u0424\u0418\u041e",selector:"name",sortable:!0},{name:"\u0421\u0442\u0430\u0442\u0443\u0441",selector:" status_id",sortable:!0,cell:function(e){var t=e.is_editable?r.a.createElement("select",{ref:o,className:"w-full h-full border-b border-blue-700 bg-white"},r.a.createElement("option",{key:-1,value:"-1"},"\u0421\u0431\u0440\u043e\u0441\u0438\u0442\u044c \u0441\u0442\u0430\u0442\u0443\u0441"),b.map((function(e){return r.a.createElement("option",{key:e.id,value:e.id},e.name)}))):r.a.createElement("div",null,b.filter((function(t){return t.id===Number(e.status_id)})).map((function(e){return e.name})));return e.is_editable&&e.status_id&&setTimeout((function(){return o.current.value=e.status_id}),200),t}},{name:"\u041a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0439",selector:"comment",sortable:!0,cell:function(e){var t=e.is_editable?r.a.createElement("input",{ref:u,className:"w-full h-full border-b border-blue-700 bg-white"}):r.a.createElement("div",null,e.comment);return e.is_editable&&setTimeout((function(){return u.current.value=e.comment?e.comment:""}),200),t}},{name:"\u0418\u0437\u043c\u0435\u043d\u0438\u0442\u044c",selector:"edit",sortable:!0,cell:function(e){return e.is_editable?r.a.createElement(N,{type:"warning",text:"\u041f\u0440\u0438\u043c\u0435\u043d\u0438\u0442\u044c",onClick:function(){w((function(t){return t.map((function(t){return t.id===e.id&&(t.is_editable=!1,t.comment=u.current.value,t.status_id=o.current.value),t}))}))}}):r.a.createElement(N,{type:"warning",text:"\u0418\u0437\u043c\u0435\u043d\u0438\u0442\u044c",onClick:function(){w((function(t){return t.map((function(t){return t.is_editable=t.id===e.id,t}))}))}})}}];return r.a.createElement("div",null,r.a.createElement("div",null,r.a.createElement(N,{className:"",type:"primary",text:"\u041d\u0430\u0437\u0430\u0434",onClick:function(){t("nothing")}}),r.a.createElement(N,{className:"text-base",type:"success",text:"\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c",onClick:function(){f.setListOfReport({data:g,date:c}).then((function(){return t("nothing")}))}}),r.a.createElement(N,{className:"",type:"primary",text:"\u0418\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u044c \u0434\u0430\u043d\u043d\u044b\u0435 \u0437\u0430:",onClick:function(){y()}}),r.a.createElement(L.a,{className:"rounded border border-blue-700 p-1",selected:c,onChange:function(e){return s(e)},dateFormat:"dd.MM.yyyy",customInput:r.a.createElement(O,null)})),r.a.createElement(S.a,{title:"\u0421\u0444\u043e\u0440\u043c\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u043e\u0442\u0447\u0435\u0442 \u043d\u0430 "+c.toLocaleString("ru"),columns:v,data:g,pagination:!0,contextMessage:{singular:"\u0441\u0442\u0440\u043e\u043a\u0430",plural:"\u0441\u0442\u0440\u043e\u043a",message:"\u0432\u044b\u0431\u0440\u0430\u043d\u043e"},paginationComponentOptions:{rowsPerPageText:"\u0421\u0442\u0440\u043e\u043a \u043d\u0430 \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0435:",rangeSeparatorText:"\u0438\u0437",noRowsPerPage:!1,selectAllRowsItem:!1,selectAllRowsItemText:"\u0412\u0441\u0435"}}))};function F(e){return e.length>0?e.map((function(e,t){return r.a.createElement("div",{className:"flex"},r.a.createElement("p",{className:"border p-1 inline-block w-1/5"},t+1),r.a.createElement("p",{className:"border p-1 inline-block w-1/5"},e.group_id__name),r.a.createElement("p",{className:"border p-1 inline-block w-1/5"},e.rank_id__name),r.a.createElement("p",{className:"border p-1 inline-block w-1/5"},e.name),r.a.createElement("p",{className:"border p-1 inline-block w-1/5"}," ",e.comment))})):r.a.createElement("p",{className:"text-center border p-1"}," \u041e\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u044e\u0442")}var T=function(e){var t=e.setShowBody,n=e.headerRef,l=Object(a.useState)(new Date),c=Object(_.a)(l,2),s=c[0],o=c[1],u=Object(a.createRef)(),m=Object(a.useState)([]),d=Object(_.a)(m,2),b=d[0],p=d[1],E=Object(a.useState)([]),h=Object(_.a)(E,2),g=h[0],w=h[1],y=function(){f.getListOfReport({date:s}).then((function(e){p((function(t){return t.map((function(t){var n=e.filter((function(e){return e.userForControl_id===t.id}));return n.length>0?Object(i.a)(Object(i.a)({},t),n[0]):(delete t.comment,delete t.status_id,t)}))}))}))};Object(a.useEffect)((function(){f.getListOfPerson().then((function(e){p(e),y()})),f.getListOfCity().then(w)}),[]),Object(a.useEffect)((function(){y()}),[s]);var v=b.filter((function(e){return!e.status_id})),x=v.filter((function(e){return e.is_military})),j=v.filter((function(e){return!1===e.is_military})),S=x.filter((function(e){return e.is_woman_with_children})),C=j.filter((function(e){return e.is_woman_with_children})),R=b.filter((function(e){return!!e.status_id})),P=R.filter((function(e){return"\u041d\u0435\u0438\u043d\u0444\u0435\u043a\u0446\u0438\u043e\u043d\u043d\u043e\u0435 \u0437\u0430\u0431\u043e\u043b\u0435\u0432\u0430\u043d\u0438\u0435, \u0430\u043c\u0431\u0443\u043b\u0430\u0442\u043e\u0440\u043d\u043e"===e.status_id__name})),T=R.filter((function(e){return"\u041d\u0435\u0438\u043d\u0444\u0435\u043a\u0446\u0438\u043e\u043d\u043d\u043e\u0435 \u0437\u0430\u0431\u043e\u043b\u0435\u0432\u0430\u043d\u0438\u0435, \u0441\u0442\u0430\u0446\u0438\u043e\u043d\u0430\u0440\u043d\u043e"===e.status_id__name})),U=R.filter((function(e){return"\u041f\u043d\u0435\u0432\u043c\u043e\u043d\u0438\u044f, \u0430\u043c\u0431\u0443\u043b\u0430\u0442\u043e\u0440\u043d\u043e"===e.status_id__name})),I=R.filter((function(e){return"\u041f\u043d\u0435\u0432\u043c\u043e\u043d\u0438\u044f, \u0441\u0442\u0430\u0446\u0438\u043e\u043d\u0430\u0440\u043d\u043e"===e.status_id__name})),B=R.filter((function(e){return"\u0420\u0435\u0441\u043f\u0438\u0440\u0430\u0442\u043e\u0440\u043d\u043e\u0435 \u0437\u0430\u0431\u043e\u043b\u0435\u0432\u0430\u043d\u0438\u0435, \u0430\u043c\u0431\u0443\u043b\u0430\u0442\u043e\u0440\u043d\u043e"===e.status_id__name})),M=R.filter((function(e){return"\u0420\u0435\u0441\u043f\u0438\u0440\u0430\u0442\u043e\u0440\u043d\u043e\u0435 \u0437\u0430\u0431\u043e\u043b\u0435\u0432\u0430\u043d\u0438\u0435, \u0441\u0442\u0430\u0446\u0438\u043e\u043d\u0430\u0440\u043d\u043e"===e.status_id__name})),A=b.filter((function(e){return"\u041a\u0430\u0440\u0430\u043d\u0442\u0438\u043d"===e.status_id__name})),D=R.filter((function(e){return"\u041a\u043e\u0440\u043e\u043d\u0430\u0432\u0438\u0440\u0443\u0441, \u0430\u043c\u0431\u0443\u043b\u0430\u0442\u043e\u0440\u043d\u043e"===e.status_id__name})),G=R.filter((function(e){return"\u041a\u043e\u0440\u043e\u043d\u0430\u0432\u0438\u0440\u0443\u0441, \u0441\u0442\u0430\u0446\u0438\u043e\u043d\u0430\u0440\u043d\u043e"===e.status_id__name}));return R=[].concat(Object(k.a)(P),Object(k.a)(T),Object(k.a)(U),Object(k.a)(I),Object(k.a)(B),Object(k.a)(M),Object(k.a)(A),Object(k.a)(D),Object(k.a)(G)),r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{ref:u},r.a.createElement(N,{className:"",type:"primary",text:"\u041d\u0430\u0437\u0430\u0434",onClick:function(){t("nothing")}}),r.a.createElement(N,{className:"",type:"success",text:"\u0420\u0430\u0441\u043f\u0435\u0447\u0430\u0442\u0430\u0442\u044c",onClick:function(){u.current.classList.add("hidden"),n.current.classList.add("hidden"),window.print(),u.current.classList.remove("hidden"),n.current.classList.remove("hidden")}}),r.a.createElement(L.a,{className:"rounded border border-blue-700 p-1",selected:s,onChange:o,dateFormat:"dd.MM.yyyy",customInput:r.a.createElement(O,null)})),r.a.createElement("div",{className:"m-4"},r.a.createElement("p",{className:"text-center"},"\u0421\u041f\u0420\u0410\u0412\u041a\u0410-\u0414\u041e\u041a\u041b\u0410\u0414 ",r.a.createElement("br",null),'\u043e \u0441\u043e\u0441\u0442\u043e\u044f\u043d\u0438\u0438 \u0434\u0435\u043b \u0432 \u0424\u0413\u041a\u0423 "12 \u0426\u041d\u0418\u0418" \u041c\u0438\u043d\u043e\u0431\u043e\u0440\u043e\u043d\u044b \u0420\u043e\u0441\u0441\u0438\u0438 ',r.a.createElement("br",null),"\u043d\u0430 ",s.toLocaleString("ru")),r.a.createElement("p",{className:"font-bold"},"1. \u041d\u0430\u0445\u043e\u0434\u044f\u0442\u0441\u044f \u043d\u0430 \u0441\u043b\u0443\u0436\u0431\u0435:"),r.a.createElement("p",null,"\u0412\u0441\u0435\u0433\u043e ",r.a.createElement("b",null,v.length),", \u0432 \u0442\u043e\u043c \u0447\u0438\u0441\u043b\u0435: ",r.a.createElement("br",null),"\u0432\u043e\u0435\u043d\u043d\u043e\u0441\u043b\u0443\u0436\u0430\u0449\u0438\u0435 - ",r.a.createElement("b",null,x.length)," \u0447\u0435\u043b., \u0438\u0437 \u043d\u0438\u0445 \u0436\u0435\u043d\u0449\u0438\u043d \u0441 \u0434\u0435\u0442\u044c\u043c\u0438 \u0434\u043e 14 \u043b\u0435\u0442 - ",S.length," \u0447\u0435\u043b. ",r.a.createElement("br",null),"\u0433\u0440\u0430\u0436\u0434\u0430\u043d\u0441\u043a\u0438\u0435 - ",r.a.createElement("b",null,j.length)," \u0447\u0435\u043b., \u0438\u0437 \u043d\u0438\u0445 \u0436\u0435\u043d\u0449\u0438\u043d \u0441 \u0434\u0435\u0442\u044c\u043c\u0438 \u0434\u043e 14 \u043b\u0435\u0442 - ",C.length," \u0447\u0435\u043b."),r.a.createElement("div",{className:"mt-1 text-center"},r.a.createElement("div",{className:"flex"},r.a.createElement("p",{className:"border p-1 inline-block w-1/3"}," \u041f\u041f\u0414"),r.a.createElement("p",{className:"border p-1 inline-block w-1/3"}," \u0412\u043e\u0435\u043d\u043d\u043e\u0441\u043b\u0443\u0436\u0430\u0449\u0438\u0445"),r.a.createElement("p",{className:"border p-1 inline-block w-1/3"}," \u0413\u0440. \u043f\u0435\u0440\u0441\u043e\u043d\u0430\u043b\u0430")),g.map((function(e){return r.a.createElement("div",{className:"flex"},r.a.createElement("span",{className:"border p-1 inline-block w-1/3"},e.name),r.a.createElement("span",{className:"border p-1 inline-block w-1/3"}," ",x.filter((function(t){return t.city_id===e.id})).length),r.a.createElement("span",{className:"border p-1 inline-block w-1/3"},j.filter((function(t){return t.city_id===e.id})).length))}))),r.a.createElement("p",null,r.a.createElement("b",null,"2. \u0427\u0438\u0441\u043b\u043e \u0437\u0430\u0431\u043e\u043b\u0435\u0432\u0448\u0438\u0445:"),r.a.createElement("br",null),"\u0412\u0441\u0435\u0433\u043e - ",r.a.createElement("b",null,R.length)," ",r.a.createElement("br",null),"\u0432 \u0442\u043e\u043c \u0447\u0438\u0441\u043b\u0435:"),r.a.createElement("p",{className:"font-bold text-center "},"\u041d\u0435 \u041e\u0420\u0412\u0418 ",P.length+T.length," - \u0447\u0435\u043b. (",P.filter((function(e){return e.is_military})).length+P.filter((function(e){return e.is_military})).length," \u0432/\u0441\u043b,",P.filter((function(e){return!e.is_military})).length+P.filter((function(e){return!e.is_military})).length," \u0433\u043f)"),r.a.createElement("div",{className:"mt-1 text-center"},r.a.createElement("div",{className:"flex"},r.a.createElement("p",{className:"border p-1 inline-block w-1/5"}," \u2116"),r.a.createElement("p",{className:"border p-1 inline-block w-1/5"}," \u041f\u043e\u0434\u0440\u0430\u0437\u0434\u0435\u043b\u0435\u043d\u0438\u0435"),r.a.createElement("p",{className:"border p-1 inline-block w-1/5"}," \u0412\u043e\u0438\u0441\u043a\u043e\u0435 \u0437\u0432\u0430\u043d\u0438\u0435"),r.a.createElement("p",{className:"border p-1 inline-block w-1/5"}," \u0424\u0430\u043c\u0438\u043b\u0438\u044f, \u0438\u043d\u0438\u0446\u0430\u043b\u044b"),r.a.createElement("p",{className:"border p-1 inline-block w-1/5"}," \u041a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0439")),r.a.createElement("p",{className:"font-bold text-center border p-1"},"\u0421\u0442\u0430\u0446\u0438\u043e\u043d\u0430\u0440"),F(T),r.a.createElement("p",{className:"font-bold text-center border p-1"},"\u0410\u043c\u0431\u0443\u043b\u0430\u0442\u043e\u0440\u043d\u043e"),F(P)),r.a.createElement("p",{className:"font-bold text-center mt-8"},"\u041f\u043d\u0435\u0432\u043c\u043e\u043d\u0438\u044f ",U.length+I.length," - \u0447\u0435\u043b. (",U.filter((function(e){return e.is_military})).length+I.filter((function(e){return e.is_military})).length," \u0432/\u0441\u043b,",U.filter((function(e){return!e.is_military})).length+I.filter((function(e){return!e.is_military})).length," \u0433\u043f)"),r.a.createElement("div",{className:" mt-1 text-center"},r.a.createElement("div",{className:"flex"},r.a.createElement("p",{className:"border p-1 inline-block w-1/5"}," \u2116"),r.a.createElement("p",{className:"border p-1 inline-block w-1/5"}," \u041f\u043e\u0434\u0440\u0430\u0437\u0434\u0435\u043b\u0435\u043d\u0438\u0435"),r.a.createElement("p",{className:"border p-1 inline-block w-1/5"}," \u0412\u043e\u0438\u0441\u043a\u043e\u0435 \u0437\u0432\u0430\u043d\u0438\u0435"),r.a.createElement("p",{className:"border p-1 inline-block w-1/5"}," \u0424\u0430\u043c\u0438\u043b\u0438\u044f, \u0438\u043d\u0438\u0446\u0430\u043b\u044b"),r.a.createElement("p",{className:"border p-1 inline-block w-1/5"}," \u041a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0439")),r.a.createElement("p",{className:"font-bold text-center border p-1"},"\u0421\u0442\u0430\u0446\u0438\u043e\u043d\u0430\u0440"),F(I),r.a.createElement("p",{className:"font-bold text-center border p-1"},"\u0410\u043c\u0431\u0443\u043b\u0430\u0442\u043e\u0440\u043d\u043e"),F(U)),r.a.createElement("p",{className:"font-bold text-center mt-8"},"\u041e\u0441\u0442\u0440\u044b\u0435 \u0440\u0435\u0441\u043f\u0438\u0440\u0430\u0442\u043e\u0440\u043d\u044b\u0435 \u0432\u0438\u0440\u0443\u0441\u043d\u044b\u0435 \u0438\u043d\u0444\u0435\u043a\u0446\u0438\u0438 (\u043d\u0435 \u043a\u043e\u0440\u043e\u043d\u0430\u0432\u0438\u0440\u0443\u0441\u043d\u0430\u044f \u0438\u043d\u0444\u0435\u043a\u0446\u0438\u044f) ",M.length+B.length," - \u0447\u0435\u043b. (",M.filter((function(e){return e.is_military})).length+B.filter((function(e){return e.is_military})).length," \u0432/\u0441\u043b,",M.filter((function(e){return!e.is_military})).length+B.filter((function(e){return!e.is_military})).length," \u0433\u043f)"),r.a.createElement("div",{className:"mt-1 text-center"},r.a.createElement("div",{className:"flex"},r.a.createElement("p",{className:"border p-1 inline-block w-1/5"}," \u2116"),r.a.createElement("p",{className:"border p-1 inline-block w-1/5"}," \u041f\u043e\u0434\u0440\u0430\u0437\u0434\u0435\u043b\u0435\u043d\u0438\u0435"),r.a.createElement("p",{className:"border p-1 inline-block w-1/5"}," \u0412\u043e\u0438\u0441\u043a\u043e\u0435 \u0437\u0432\u0430\u043d\u0438\u0435"),r.a.createElement("p",{className:"border p-1 inline-block w-1/5"}," \u0424\u0430\u043c\u0438\u043b\u0438\u044f, \u0438\u043d\u0438\u0446\u0430\u043b\u044b"),r.a.createElement("p",{className:"border p-1 inline-block w-1/5"}," \u041a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0439")),r.a.createElement("p",{className:"font-bold text-center border p-1"},"\u0421\u0442\u0430\u0446\u0438\u043e\u043d\u0430\u0440"),F(M),r.a.createElement("p",{className:"font-bold text-center border p-1"},"\u0410\u043c\u0431\u0443\u043b\u0430\u0442\u043e\u0440\u043d\u043e"),F(B)),r.a.createElement("p",{className:"font-bold text-center mt-8"},"\u0427\u0438\u0441\u043b\u043e \u043d\u0430\u0445\u043e\u0434\u044f\u0449\u0438\u0445\u0441\u044f \u043d\u0430 \u043a\u0430\u0440\u0430\u043d\u0442\u0438\u043d\u0435 (\u0438\u0437\u043e\u043b\u044f\u0446\u0438\u044f) ",A.length," - \u0447\u0435\u043b. (",A.filter((function(e){return e.is_military})).length," \u0432/\u0441\u043b,",A.filter((function(e){return!e.is_military})).length," \u0433\u043f)"),r.a.createElement("div",{className:"mt-1 text-center"},r.a.createElement("div",{className:"flex"},r.a.createElement("p",{className:"border p-1 inline-block w-1/5"}," \u2116"),r.a.createElement("p",{className:"border p-1 inline-block w-1/5"}," \u041f\u043e\u0434\u0440\u0430\u0437\u0434\u0435\u043b\u0435\u043d\u0438\u0435"),r.a.createElement("p",{className:"border p-1 inline-block w-1/5"}," \u0412\u043e\u0438\u0441\u043a\u043e\u0435 \u0437\u0432\u0430\u043d\u0438\u0435"),r.a.createElement("p",{className:"border p-1 inline-block w-1/5"}," \u0424\u0430\u043c\u0438\u043b\u0438\u044f, \u0438\u043d\u0438\u0446\u0430\u043b\u044b"),r.a.createElement("p",{className:"border p-1 inline-block w-1/5"}," \u041a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0439")),F(A)),r.a.createElement("p",{className:"font-bold text-center mt-8"},"\u041a\u043e\u0440\u043e\u043d\u0430\u0432\u0438\u0440\u0443\u0441\u043d\u0430\u044f \u0438\u043d\u0444\u0435\u043a\u0446\u0438\u044f - ",D.length+G.length," \u0447\u0435\u043b. (",D.filter((function(e){return e.is_military})).length+G.filter((function(e){return e.is_military})).length," \u0432/\u0441\u043b,",D.filter((function(e){return!e.is_military})).length+G.filter((function(e){return!e.is_military})).length," \u0433\u043f)"),r.a.createElement("div",{className:"mt-1 text-center"},r.a.createElement("div",{className:"flex"},r.a.createElement("p",{className:"border p-1 inline-block w-1/5"}," \u2116"),r.a.createElement("p",{className:"border p-1 inline-block w-1/5"}," \u041f\u043e\u0434\u0440\u0430\u0437\u0434\u0435\u043b\u0435\u043d\u0438\u0435"),r.a.createElement("p",{className:"border p-1 inline-block w-1/5"}," \u0412\u043e\u0438\u0441\u043a\u043e\u0435 \u0437\u0432\u0430\u043d\u0438\u0435"),r.a.createElement("p",{className:"border p-1 inline-block w-1/5"}," \u0424\u0430\u043c\u0438\u043b\u0438\u044f, \u0438\u043d\u0438\u0446\u0430\u043b\u044b"),r.a.createElement("p",{className:"border p-1 inline-block w-1/5"}," \u041a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0439")),r.a.createElement("p",{className:"font-bold text-center border p-1"},"\u0421\u0442\u0430\u0446\u0438\u043e\u043d\u0430\u0440"),F(G),r.a.createElement("p",{className:"font-bold text-center border p-1"},"\u0410\u043c\u0431\u0443\u043b\u0430\u0442\u043e\u0440\u043d\u043e"),F(D))))};var U=function(e){var t=e.headerRef,n=e.setShowBody,l=Object(a.useState)(new Date),c=Object(_.a)(l,2),s=c[0],o=c[1],u=Object(a.createRef)(),m=Object(a.useState)([]),d=Object(_.a)(m,2),b=d[0],p=d[1],E=Object(a.useState)([]),h=Object(_.a)(E,2),g=h[0],w=h[1],y=function(){f.getListOfReport({date:s}).then((function(e){p((function(t){return t.map((function(t){var n=e.filter((function(e){return e.userForControl_id===t.id}));return n.length>0?Object(i.a)(Object(i.a)({},t),n[0]):(delete t.comment,delete t.status_id,t)}))}))}))};Object(a.useEffect)((function(){f.getListOfGroup().then(w),f.getListOfPerson().then((function(e){p(e),y()}))}),[]),Object(a.useEffect)((function(){y()}),[s]);var v=b.filter((function(e){return!e.status_id}));return r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{ref:u},r.a.createElement(N,{className:"",type:"primary",text:"\u041d\u0430\u0437\u0430\u0434",onClick:function(){n("nothing")}}),r.a.createElement(N,{className:"",type:"success",text:"\u0420\u0430\u0441\u043f\u0435\u0447\u0430\u0442\u0430\u0442\u044c",onClick:function(){u.current.classList.add("hidden"),t.current.classList.add("hidden"),window.print(),u.current.classList.remove("hidden"),t.current.classList.remove("hidden")}}),r.a.createElement(L.a,{className:"rounded border border-blue-700 p-1",selected:s,onChange:function(e){return o(e)},dateFormat:"dd.MM.yyyy",customInput:r.a.createElement(O,null)})),r.a.createElement("p",{className:"font-bold m-2 text-center text-2xl"},"\u0421\u043f\u0438\u0441\u043a\u0438 \u043d\u0430 \u043f\u0440\u043e\u0445\u043e\u0434 \u043d\u0430 ",s.toLocaleDateString("ru")),g.map((function(e){var t=v.filter((function(t){return t.group_id===e.id})),n=t.filter((function(e,t){return t%2===1})),a=t.filter((function(e,t){return t%2===0}));return r.a.createElement(r.a.Fragment,null,t.length>0?r.a.createElement("div",{style:{pageBreakAfter:"always"}},r.a.createElement("p",{className:"mt-2 text-center font-semibold text-2xl border p-1"},e.name),r.a.createElement("div",{className:"text-center text-xs"},r.a.createElement("div",{className:"flex"},r.a.createElement("p",{className:"border p-1 inline-block w-1/12"},"\u2116"),r.a.createElement("p",{className:"border p-1 inline-block w-2/12"},"\u0417\u0432\u0430\u043d\u0438\u0435 \u0438 \u0424\u0418\u041e"),r.a.createElement("p",{className:"border p-1 inline-block w-3/12"},"\u041f\u0440\u0438\u043c\u0435\u0447\u0430\u043d\u0438\u0435 (\u0432\u0440\u0435\u043c\u044f \u043f\u0440\u043e\u0445\u043e\u0434\u0430)"),r.a.createElement("p",{className:"border p-1 inline-block w-1/12"},"\u2116"),r.a.createElement("p",{className:"border p-1 inline-block w-2/12"},"\u0417\u0432\u0430\u043d\u0438\u0435 \u0438 \u0424\u0418\u041e"),r.a.createElement("p",{className:"border p-1 inline-block w-3/12"},"\u041f\u0440\u0438\u043c\u0435\u0447\u0430\u043d\u0438\u0435 (\u0432\u0440\u0435\u043c\u044f \u043f\u0440\u043e\u0445\u043e\u0434\u0430)")),a.map((function(e,t){var l=n[t];return r.a.createElement("div",{className:"flex"},r.a.createElement("p",{className:"border p-1 inline-block w-1/12"},t+1),r.a.createElement("p",{className:"border p-1 inline-block w-2/12 text-left"},e.rank_id__name?e.rank_id__name:"\u0433\u043f"," ",e.name),r.a.createElement("p",{className:"border p-1 inline-block w-3/12 text-left"}," ",e.comment),l&&r.a.createElement(r.a.Fragment,null,r.a.createElement("p",{className:"border p-1 inline-block w-1/12"},a.length+t+1),r.a.createElement("p",{className:"border p-1 inline-block w-2/12 text-left"},l.rank_id__name?l.rank_id__name:"\u0433\u043f"," ",l.name),r.a.createElement("p",{className:"border p-1 inline-block w-3/12 text-left"}," ",l.comment)))})))):r.a.createElement(r.a.Fragment,null))})))};function I(){return Object(d.usePromiseTracker)().promiseInProgress&&r.a.createElement("div",{id:"loader",className:"absolute h-screen w-screen bg-gray-400 bg-opacity-25 text-center flex top-0"},r.a.createElement("p",{className:"m-auto bg-blue-600 text-white border rounded animate-pulse p-4"},"\u0418\u0434\u0435\u0442 \u0437\u0430\u0433\u0440\u0443\u0437\u043a\u0430 \u0434\u0430\u043d\u043d\u044b\u0445..."))}var B=Object(s.b)((function(e){return{user:e.user}}))((function(e){var t=e.user,n=Object(a.useState)("nothing"),l=Object(_.a)(n,2),c=l[0],i=l[1],s=Object(a.createRef)(),o=r.a.createElement("div",null,r.a.createElement(N,{className:"",type:"primary",text:"\u0423\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u043b/\u0441",onClick:function(){i("listOfPerson")}}),r.a.createElement(N,{className:"",type:"primary",text:"\u0421\u0444\u043e\u0440\u043c\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u043e\u0442\u0447\u0435\u0442",onClick:function(){i("makeReport")}})),u=r.a.createElement("div",null,r.a.createElement(N,{className:"",type:"primary",text:"\u0421\u043f\u0438\u0441\u043a\u0438 \u043d\u0430 \u043f\u0440\u043e\u0445\u043e\u0434",onClick:function(){i("listForEntering")}}),r.a.createElement(N,{className:"",type:"primary",text:"\u0421\u043f\u0440\u0430\u0432\u043a\u0430 \u0434\u043e\u043a\u043b\u0430\u0434",onClick:function(){i("report")}}));return r.a.createElement(r.a.Fragment,null,r.a.createElement(x,{headerRef:s}),r.a.createElement("div",{className:"px-2"},t.is_control?function(){switch(c){case"listForEntering":return r.a.createElement(U,{headerRef:s,setShowBody:i});case"report":return r.a.createElement(T,{headerRef:s,setShowBody:i});default:return u}}():function(){switch(c){case"listOfPerson":return r.a.createElement(C,{setShowBody:i});case"makeReport":return r.a.createElement(P,{setShowBody:i});default:return o}}()),r.a.createElement(I,null))}));var M=Object(s.b)((function(e){return{user:e.user}}),(function(e){return{initUser:function(t){return e(y(t))}}}))((function(e){var t=e.user,n=e.initUser;return Object(a.useEffect)((function(){f.initUser().then((function(e){n(Object(i.a)(Object(i.a)({},e),{},{is_initial:!0}))})).catch((function(){n(Object(i.a)(Object(i.a)({},t),{},{is_initial:!0}))}))}),[]),t.is_initial?t.username?r.a.createElement(B,null):r.a.createElement(v,null):r.a.createElement("span",null,"Loading")})),A=(n(156),n(79)),D=n(25),G={username:"",is_initial:!1};var J=Object(D.b)({user:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:G,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case"InitUser":return Object(i.a)(Object(i.a)({},e),t.user);default:return e}}}),X=Object(D.c)(J);c.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(s.a,{store:X},r.a.createElement(A.a,null,r.a.createElement(M,null)))),document.getElementById("root"))},80:function(e,t,n){e.exports=n(158)},85:function(e,t,n){}},[[80,1,2]]]);
//# sourceMappingURL=main.20024117.chunk.js.map