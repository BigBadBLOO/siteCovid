(this.webpackJsonpuntitled=this.webpackJsonpuntitled||[]).push([[0],{149:function(e,t,a){},151:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),c=a(21),l=a.n(c),s=(a(81),a(5)),i=a(14),o=a(35),m=a.n(o),u=a(55),d={initUser:function(){return E("/initUser/")},login:function(e){return E("/login/",e)},logOut:function(){return E("/logout/")},getListOfCity:function(){return E("/getListOfCity/")},getListOfPerson:function(){return E("/getListOfPerson/")},setListOfPerson:function(e){return E("/setListOfPerson/",e)},getListOfStatus:function(){return E("/getListOfStatus/")},setListOfReport:function(e){return E("/setListOfReport/",e)},getListOfReport:function(e){return E("/getListOfReport/",e)}};function p(e){return e.status>=200&&e.status<300?Promise.resolve(e.json()):Promise.reject(new Error(e.statusText))}function b(e,t){return f.apply(this,arguments)}function f(){return(f=Object(u.a)(m.a.mark((function e(t,a){return m.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch(t,a).then(p);case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function E(e,t){return N.apply(this,arguments)}function N(){return(N=Object(u.a)(m.a.mark((function e(t,a){var n,r;return m.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n={Accept:"application/json, text/plain, */*","Content-type":"application/x-www-form-urlencoded; charset=UTF-8","X-Requested-With":"XMLHttpRequest"},(r=g("csrftoken"))&&(n["X-CSRFToken"]=r),e.next=5,b(t,{credentials:"include",method:"POST",mode:"same-origin",headers:n,body:JSON.stringify(a)});case 5:return e.abrupt("return",e.sent);case 6:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function g(e){var t=document.cookie.match(new RegExp("(?:^|; )"+e.replace(/([.$?*|{}()[]\/+^])/g,"\\$1")+"=([^;]*)"));return t?decodeURIComponent(t[1]):void 0}var h=a(6);function _(e){var t=e.icon,a=e.type,n=e.text,c=e.onClick,l=e.className,s=e.disabled,i=e.classNameText,o=["rounded-md px-2 py-1 m-2 place-content-center focus:outline-none "];return o.push(l),"primary"===a?o.push("text-white bg-blue-500 bg-opacity-75 hover:bg-opacity-100"):"success"===a?o.push("text-white bg-green-600"):"secondary"===a?o.push("text-white bg-gray-600"):"danger"===a?o.push("text-white bg-red-600"):"warning"===a&&o.push("text-white bg-yellow-600"),r.a.createElement("button",{className:o.join(" "),onClick:c,disabled:s},t?r.a.createElement("i",{className:"material-icons mx-1 float-left"},t):"",r.a.createElement("span",{className:"my-auto "+i},n))}function O(e){return{type:"InitUser",user:e}}var y=Object(i.b)(null,(function(e){return{initUser:function(t){return e(O(t))}}}))((function(e){var t=e.initUser,a=Object(n.useState)(""),c=Object(h.a)(a,2),l=c[0],i=c[1],o=Object(n.useState)(!0),m=Object(h.a)(o,2),u=m[0],p=m[1],b=Object(n.useState)(""),f=Object(h.a)(b,2),E=f[0],N=f[1],g=Object(n.useState)(!0),O=Object(h.a)(g,2),y=O[0],v=O[1];return r.a.createElement("div",{className:"mt-40"},r.a.createElement("p",{className:"text-3xl mx-auto text-center"}," \u041f\u0440\u043e\u0439\u0434\u0438\u0442\u0435 \u0430\u0432\u0442\u043e\u0440\u0438\u0437\u0430\u0446\u0438\u044e \u0432 \u0441\u0438\u0441\u0442\u0435\u043c\u0435"),r.a.createElement("form",{className:"pt-4 w-1/2 mx-auto",onSubmit:function(e){e.preventDefault();var a=l.length>0,n=E.length>0;p(a),v(n),p&&n&&d.login({username:l,password:E}).then((function(e){e.error?p(!1):t(Object(s.a)(Object(s.a)({},e),{},{is_initial:!0}))})).catch((function(){p(!1)}))}},r.a.createElement("div",{className:"mb-2"},r.a.createElement("label",{className:"block mb-1",htmlFor:"name"},"\u0418\u043c\u044f"),r.a.createElement("input",{className:"appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-600",id:"email",type:"text",placeholder:"\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0438\u043c\u044f",value:l,onChange:function(e){i(e.target.value),p(!0)}}),!u&&r.a.createElement("label",{className:"text-xs text-red-400 pl-2"},"\u041f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044f \u043d\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442")),r.a.createElement("div",{className:"mb-2"},r.a.createElement("label",{className:"block mb-1",htmlFor:"password"},"\u041f\u0430\u0440\u043e\u043b\u044c"),r.a.createElement("input",{className:"appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-600",id:"password",type:"password",placeholder:"\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043f\u0430\u0440\u043e\u043b\u044c",onChange:function(e){N(e.target.value),v(!0)}}),!y&&r.a.createElement("label",{className:"text-xs text-red-400 pl-2"},"\u041d\u0435\u043a\u043e\u0440\u0440\u0435\u043a\u0442\u043d\u044b\u0439 \u043f\u0430\u0440\u043e\u043b\u044c")),r.a.createElement("div",{className:"mb-2 text-center"},r.a.createElement(_,{text:"\u0412\u043e\u0439\u0442\u0438 \u0432 \u0430\u043a\u043a\u0430\u0443\u043d\u0442",type:"primary"}))))}));var v=Object(i.b)((function(e){return{user:e.user}}),(function(e){return{initUser:function(t){return e(O(t))}}}))((function(e){var t=e.user,a=e.initUser,n=e.headerRef;return r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{ref:n,className:"p-3 border-b flex justify-between"},r.a.createElement("span",{className:"my-auto p-2 border rounded border-blue-600"},t.username," - ",t.group),r.a.createElement(_,{className:"",type:"primary",onClick:function(){d.logOut().then((function(){return a(Object(s.a)(Object(s.a)({},t),{},{username:""}))}))},text:"\u0412\u044b\u0439\u0442\u0438"})))})),j=a(10),x=a(37),w=a.n(x);function k(e){var t=e.setShowBody,a=Object(n.useState)(!1),c=Object(h.a)(a,2),l=c[0],s=c[1],i=Object(n.useState)(-1),o=Object(h.a)(i,2),m=o[0],u=o[1],p=Object(n.useState)([]),b=Object(h.a)(p,2),f=b[0],E=b[1],N=Object(n.useState)([]),g=Object(h.a)(N,2),O=g[0],y=g[1],v=[],x=Object(n.createRef)(),k=Object(n.createRef)(),S=Object(n.createRef)(),C=Object(n.createRef)(),L=Object(n.createRef)();Object(n.useEffect)((function(){d.getListOfCity().then(E),d.getListOfPerson().then(y)}),[]),Object(n.useEffect)((function(){O.filter((function(e){return e.is_editable})).map((function(e){x.current.value=e.is_military.toString(),k.current.value=e.rank,S.current.value=e.name,C.current.value=Number(e.city_id),L.current.value=e.is_woman_with_children.toString()}))}),[O]);var R=[{name:"\u0412\u043e\u0435\u043d\u043d\u043e\u0441\u043b\u0443\u0436\u0430\u0449\u0438\u0439 \u0438\u043b\u0438 \u0433\u0440. \u043f\u0435\u0440\u0441\u043e\u043d\u0430\u043b",selector:"is_military",sortable:!0,cell:function(e){return e.is_editable?r.a.createElement("select",{ref:x,className:"w-full h-full border-b border-blue-700 bg-white"},r.a.createElement("option",{value:!0},"\u0412\u043e\u0435\u043d\u043d\u043e\u0441\u043b\u0443\u0436\u0430\u0449\u0438\u0439"),r.a.createElement("option",{value:!1},"\u0413\u0440. \u043f\u0435\u0440\u0441\u043e\u043d\u0430\u043b")):r.a.createElement("div",null,e.is_military?"\u0412\u043e\u0435\u043d\u043d\u043e\u0441\u043b\u0443\u0436\u0430\u0449\u0438\u0439":"\u0413\u0440. \u043f\u0435\u0440\u0441\u043e\u043d\u0430\u043b")}},{name:"\u0412\u043e\u0438\u043d\u0441\u043a\u043e\u0435 \u0437\u0432\u0430\u043d\u0438\u0435",selector:"rank",sortable:!0,cell:function(e){return e.is_editable?r.a.createElement("input",{ref:k,className:"w-full h-full border-b border-blue-700 bg-white"}):r.a.createElement("div",null,e.rank)}},{name:"\u0424\u0418\u041e",selector:"name",sortable:!0,cell:function(e){return e.is_editable?r.a.createElement("input",{ref:S,className:"w-full h-full border-b border-blue-700 bg-white"}):r.a.createElement("div",null,e.name)}},{name:"\u0413\u043e\u0440\u043e\u0434",selector:"city_id",sortable:!0,cell:function(e){return e.is_editable?r.a.createElement("select",{ref:C,className:"w-full h-full border-b border-blue-700 bg-white"},f.map((function(e){return r.a.createElement("option",{key:e.id,value:e.id},e.name)}))):r.a.createElement("div",null,f.filter((function(t){return t.id===Number(e.city_id)})).map((function(e){return e.name})))}},{name:"\u042f\u0432\u043b\u044f\u0435\u0442\u0441\u044f \u043b\u0438 \u0436\u0435\u043d\u0449\u0438\u043d\u043e\u0439 \u0441 \u0434\u0435\u0442\u044c\u043c\u0438 \u0434\u043e 14 \u043b\u0435\u0442?",selector:"is_woman_with_children",sortable:!0,cell:function(e){return e.is_editable?r.a.createElement("select",{ref:L,className:"w-full h-full border-b border-blue-700 bg-white"},r.a.createElement("option",{value:!0},"\u0414\u0430"),r.a.createElement("option",{value:!1},"\u041d\u0435\u0442")):r.a.createElement("div",null,e.is_woman_with_children?"\u0414\u0430":"\u041d\u0435\u0442")}},{name:"\u0418\u0437\u043c\u0435\u043d\u0438\u0442\u044c",selector:"edit",sortable:!0,cell:function(e){return e.is_editable?r.a.createElement(_,{type:"warning",text:"\u041f\u0440\u0438\u043c\u0435\u043d\u0438\u0442\u044c",onClick:function(){y((function(t){return t.map((function(t){return t.id===e.id&&(t.is_editable=!1,t.is_military="true"===x.current.value,t.rank=k.current.value,t.name=S.current.value,t.city_id=C.current.value,t.is_woman_with_children="true"===L.current.value),t}))}))}}):r.a.createElement(_,{type:"warning",text:"\u0418\u0437\u043c\u0435\u043d\u0438\u0442\u044c",onClick:function(){y((function(t){return t.map((function(t){return t.is_editable=t.id===e.id,t}))}))}})}}],F=r.a.createElement(_,{className:"text-base",type:"primary",text:"\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c",onClick:function(){y([{id:m,is_military:!0,name:"",rank:"",city:1,is_woman_with_children:!1,is_editable:!0}].concat(Object(j.a)(O.map((function(e){return e.is_editable=!1,e}))))),u((function(e){return e-1}))}}),P=r.a.createElement(_,{className:"text-base",type:"danger",text:"\u0423\u0434\u0430\u043b\u0438\u0442\u044c",onClick:function(){var e=v.map((function(e){return e.id}));y(O.filter((function(t){return-1===e.indexOf(t.id)}))),s(!l)}});return r.a.createElement("div",null,r.a.createElement("div",null,r.a.createElement(_,{className:"",type:"primary",text:"\u041d\u0430\u0437\u0430\u0434",onClick:function(){t("nothing")}}),r.a.createElement(_,{className:"",type:"success",text:"\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c",onClick:function(){d.setListOfPerson({data:O}).then((function(){return t("nothing")}))}})),r.a.createElement(w.a,{title:"\u0423\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u043b\u0438\u0447\u043d\u044b\u043c \u0441\u043e\u0441\u0442\u0430\u0432\u043e\u043c \u0446\u0435\u043d\u0442\u0440\u0430",columns:R,selectableRows:!0,data:O,pagination:!0,onSelectedRowsChange:function(e){v=e.selectedRows},contextMessage:{singular:"\u0441\u0442\u0440\u043e\u043a\u0430",plural:"\u0441\u0442\u0440\u043e\u043a",message:""},contextActions:P,actions:F,clearSelectedRows:l}))}var S=a(26),C=a.n(S);a(62);var L=function(e){var t=e.setShowBody,a=Object(n.useState)(new Date),c=Object(h.a)(a,2),l=c[0],i=c[1],o=Object(n.createRef)(),m=Object(n.createRef)(),u=Object(n.useState)([]),p=Object(h.a)(u,2),b=p[0],f=p[1],E=Object(n.useState)([]),N=Object(h.a)(E,2),g=N[0],O=N[1];Object(n.useEffect)((function(){d.getListOfPerson().then(O),d.getListOfStatus().then(f)}),[]);var y=[{name:"\u0412\u043e\u0438\u043d\u0441\u043a\u043e\u0435 \u0437\u0432\u0430\u043d\u0438\u0435",selector:"rank",sortable:!0},{name:"\u0424\u0418\u041e",selector:"name",sortable:!0},{name:"\u0421\u0442\u0430\u0442\u0443\u0441",selector:" status_id",sortable:!0,cell:function(e){var t=e.is_editable?r.a.createElement("select",{ref:o,className:"w-full h-full border-b border-blue-700 bg-white"},r.a.createElement("option",{key:-1,value:"-1"},"\u0421\u0431\u0440\u043e\u0441\u0438\u0442\u044c \u0441\u0442\u0430\u0442\u0443\u0441"),b.map((function(e){return r.a.createElement("option",{key:e.id,value:e.id},e.name)}))):r.a.createElement("div",null,b.filter((function(t){return t.id===Number(e.status_id)})).map((function(e){return e.name})));return e.is_editable&&e.status_id&&setTimeout((function(){return o.current.value=e.status_id}),200),t}},{name:"\u041a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0439",selector:"comment",sortable:!0,cell:function(e){var t=e.is_editable?r.a.createElement("input",{ref:m,className:"w-full h-full border-b border-blue-700 bg-white"}):r.a.createElement("div",null,e.comment);return e.is_editable&&setTimeout((function(){return m.current.value=e.comment?e.comment:""}),200),t}},{name:"\u0418\u0437\u043c\u0435\u043d\u0438\u0442\u044c",selector:"edit",sortable:!0,cell:function(e){return e.is_editable?r.a.createElement(_,{type:"warning",text:"\u041f\u0440\u0438\u043c\u0435\u043d\u0438\u0442\u044c",onClick:function(){O((function(t){return t.map((function(t){return t.id===e.id&&(t.is_editable=!1,t.comment=m.current.value,t.status_id=o.current.value),t}))}))}}):r.a.createElement(_,{type:"warning",text:"\u0418\u0437\u043c\u0435\u043d\u0438\u0442\u044c",onClick:function(){O((function(t){return t.map((function(t){return t.is_editable=t.id===e.id,t}))}))}})}}],v=r.a.createElement(_,{className:"text-base",type:"warning",text:"\u0421\u043e\u0437\u0434\u0430\u0442\u044c",onClick:function(){d.setListOfReport({data:g,date:l}).then((function(){return t("nothing")}))}});return r.a.createElement("div",null,r.a.createElement("div",null,r.a.createElement(_,{className:"",type:"primary",text:"\u041d\u0430\u0437\u0430\u0434",onClick:function(){t("nothing")}}),r.a.createElement(_,{className:"",type:"primary",text:"\u0418\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u044c \u0434\u0430\u043d\u043d\u044b\u0435 \u0437\u0430:",onClick:function(){d.getListOfReport({date:l}).then((function(e){O((function(t){return Object(j.a)(t.map((function(t){var a=e.filter((function(e){return e.userForControl_id===t.id}));return a.length>0?Object(s.a)(Object(s.a)({},t),a[0]):(delete t.comment,delete t.status_id,t)})))}))}))}}),r.a.createElement(C.a,{className:"rounded border border-blue-700 p-1",selected:l,onChange:function(e){return i(e)},dateFormat:"dd-MM-yyyy"})),r.a.createElement(w.a,{title:"\u0421\u0444\u043e\u0440\u043c\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u043e\u0442\u0447\u0435\u0442 \u043d\u0430 "+l.toLocaleString("ru"),columns:y,data:g,pagination:!0,contextMessage:{singular:"\u0441\u0442\u0440\u043e\u043a\u0430",plural:"\u0441\u0442\u0440\u043e\u043a",message:"\u0432\u044b\u0431\u0440\u0430\u043d\u043e"},actions:v}))};var R=function(e){var t=e.setShowBody,a=e.headerRef,c=Object(n.useState)(new Date),l=Object(h.a)(c,2),i=l[0],o=l[1],m=Object(n.createRef)(),u=Object(n.useState)([]),p=Object(h.a)(u,2),b=p[0],f=p[1],E=Object(n.useState)([]),N=Object(h.a)(E,2),g=N[0],O=N[1],y=function(){d.getListOfReport({date:i}).then((function(e){f((function(t){return t.map((function(t){var a=e.filter((function(e){return e.userForControl_id===t.id}));return a.length>0?Object(s.a)(Object(s.a)({},t),a[0]):(delete t.comment,delete t.status_id,t)}))}))}))};Object(n.useEffect)((function(){d.getListOfPerson().then((function(e){f(e),y()})),d.getListOfCity().then(O)}),[]),Object(n.useEffect)((function(){y()}),[i]);var v=b.filter((function(e){return!e.status_id})),x=v.filter((function(e){return e.is_military})),w=v.filter((function(e){return!e.is_military})),k=x.filter((function(e){return e.is_woman_with_children})),S=w.filter((function(e){return e.is_woman_with_children})),L=b.filter((function(e){return!!e.status_id})),R=L.filter((function(e){return"\u041d\u0435\u0438\u043d\u0444\u0435\u043a\u0446\u0438\u043e\u043d\u043d\u043e\u0435 \u0437\u0430\u0431\u043e\u043b\u0435\u0432\u0430\u043d\u0438\u0435, \u0430\u043c\u0431\u0443\u043b\u0430\u0442\u043e\u0440\u043d\u043e"===e.status_id__name})),F=L.filter((function(e){return"\u041d\u0435\u0438\u043d\u0444\u0435\u043a\u0446\u0438\u043e\u043d\u043d\u043e\u0435 \u0437\u0430\u0431\u043e\u043b\u0435\u0432\u0430\u043d\u0438\u0435, \u0441\u0442\u0430\u0446\u0438\u043e\u043d\u0430\u0440\u043d\u043e"===e.status_id__name})),P=L.filter((function(e){return"\u041f\u043d\u0435\u0432\u043c\u043e\u043d\u0438\u044f, \u0430\u043c\u0431\u0443\u043b\u0430\u0442\u043e\u0440\u043d\u043e"===e.status_id__name})),U=L.filter((function(e){return"\u041f\u043d\u0435\u0432\u043c\u043e\u043d\u0438\u044f, \u0441\u0442\u0430\u0446\u0438\u043e\u043d\u0430\u0440\u043d\u043e"===e.status_id__name})),M=L.filter((function(e){return"\u0420\u0435\u0441\u043f\u0438\u0440\u0430\u0442\u043e\u0440\u043d\u043e\u0435 \u0437\u0430\u0431\u043e\u043b\u0435\u0432\u0430\u043d\u0438\u0435, \u0430\u043c\u0431\u0443\u043b\u0430\u0442\u043e\u0440\u043d\u043e"===e.status_id__name})),B=L.filter((function(e){return"\u0420\u0435\u0441\u043f\u0438\u0440\u0430\u0442\u043e\u0440\u043d\u043e\u0435 \u0437\u0430\u0431\u043e\u043b\u0435\u0432\u0430\u043d\u0438\u0435, \u0441\u0442\u0430\u0446\u0438\u043e\u043d\u0430\u0440\u043d\u043e"===e.status_id__name})),T=b.filter((function(e){return"\u041a\u0430\u0440\u0430\u043d\u0442\u0438\u043d"===e.status_id__name})),D=L.filter((function(e){return"\u041a\u043e\u0440\u043e\u043d\u0430\u0432\u0438\u0440\u0443\u0441, \u0430\u043c\u0431\u0443\u043b\u0430\u0442\u043e\u0440\u043d\u043e"===e.status_id__name})),I=L.filter((function(e){return"\u041a\u043e\u0440\u043e\u043d\u0430\u0432\u0438\u0440\u0443\u0441, \u0441\u0442\u0430\u0446\u0438\u043e\u043d\u0430\u0440\u043d\u043e"===e.status_id__name}));return L=[].concat(Object(j.a)(R),Object(j.a)(F),Object(j.a)(P),Object(j.a)(U),Object(j.a)(M),Object(j.a)(B),Object(j.a)(T),Object(j.a)(D),Object(j.a)(I)),r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{ref:m},r.a.createElement(_,{className:"",type:"primary",text:"\u041d\u0430\u0437\u0430\u0434",onClick:function(){t("nothing")}}),r.a.createElement(_,{className:"",type:"success",text:"\u0420\u0430\u0441\u043f\u0435\u0447\u0430\u0442\u0430\u0442\u044c",onClick:function(){m.current.classList.add("hidden"),a.current.classList.add("hidden"),window.print(),m.current.classList.remove("hidden"),a.current.classList.remove("hidden")}}),r.a.createElement(C.a,{className:"rounded border border-blue-700 p-1",selected:i,onChange:o,dateFormat:"dd-MM-yyyy"})),r.a.createElement("div",{className:"m-4"},r.a.createElement("p",{className:"text-center"},"\u0421\u041f\u0420\u0410\u0412\u041a\u0410-\u0414\u041e\u041a\u041b\u0410\u0414 ",r.a.createElement("br",null),'\u043e \u0441\u043e\u0441\u0442\u043e\u044f\u043d\u0438\u0438 \u0434\u0435\u043b \u0432 \u0424\u0413\u041a\u0423 "12 \u0426\u041d\u0418\u0418" \u041c\u0438\u043d\u043e\u0431\u043e\u0440\u043e\u043d\u044b \u0420\u043e\u0441\u0441\u0438\u0438 ',r.a.createElement("br",null),"\u043d\u0430 ",i.toLocaleString("ru")),r.a.createElement("p",{className:"font-bold"},"1. \u041d\u0430\u0445\u043e\u0434\u044f\u0442\u0441\u044f \u043d\u0430 \u0441\u043b\u0443\u0436\u0431\u0435:"),r.a.createElement("p",null,"\u0412\u0441\u0435\u0433\u043e ",r.a.createElement("b",null,v.length),", \u0432 \u0442\u043e\u043c \u0447\u0438\u0441\u043b\u0435: ",r.a.createElement("br",null),"\u0432\u043e\u0435\u043d\u043d\u043e\u0441\u043b\u0443\u0436\u0430\u0449\u0438\u0435 - ",r.a.createElement("b",null,x.length)," \u0447\u0435\u043b., \u0438\u0437 \u043d\u0438\u0445 \u0436\u0435\u043d\u0449\u0438\u043d \u0441 \u0434\u0435\u0442\u044c\u043c\u0438 \u0434\u043e 14 \u043b\u0435\u0442 - ",k.length," \u0447\u0435\u043b. ",r.a.createElement("br",null),"\u0433\u0440\u0430\u0436\u0434\u0430\u043d\u0441\u043a\u0438\u0435 - ",r.a.createElement("b",null,w.length)," \u0447\u0435\u043b., \u0438\u0437 \u043d\u0438\u0445 \u0436\u0435\u043d\u0449\u0438\u043d \u0441 \u0434\u0435\u0442\u044c\u043c\u0438 \u0434\u043e 14 \u043b\u0435\u0442 - ",S.length," \u0447\u0435\u043b."),r.a.createElement("div",{className:"grid grid-cols-3 mt-1 text-center"},r.a.createElement("span",{className:"border p-1"}," \u041f\u041f\u0414"),r.a.createElement("span",{className:"border p-1"}," \u0412\u043e\u0435\u043d\u043d\u043e\u0441\u043b\u0443\u0436\u0430\u0449\u0438\u0445"),r.a.createElement("span",{className:"border p-1"}," \u0413\u0440. \u043f\u0435\u0440\u0441\u043e\u043d\u0430\u043b\u0430"),g.map((function(e){return r.a.createElement(r.a.Fragment,null,r.a.createElement("span",{className:"border p-1"},e.name),r.a.createElement("span",{className:"border p-1"}," ",x.filter((function(t){return t.city_id===e.id})).length),r.a.createElement("span",{className:"border p-1"},w.filter((function(t){return t.city_id===e.id})).length))}))),r.a.createElement("p",null,r.a.createElement("b",null,"2. \u0427\u0438\u0441\u043b\u043e \u0437\u0430\u0431\u043e\u043b\u0435\u0432\u0448\u0438\u0445:"),r.a.createElement("br",null),"\u0412\u0441\u0435\u0433\u043e - ",r.a.createElement("b",null,L.length)," ",r.a.createElement("br",null),"\u0432 \u0442\u043e\u043c \u0447\u0438\u0441\u043b\u0435:"),r.a.createElement("p",{className:"font-bold text-center "},"\u041d\u0435 \u041e\u0420\u0412\u0418 ",R.length+F.length," - \u0447\u0435\u043b . (",R.filter((function(e){return e.is_military})).length+R.filter((function(e){return e.is_military})).length," \u0432/\u0441\u043b,",R.filter((function(e){return!e.is_military})).length+R.filter((function(e){return!e.is_military})).length,")"),r.a.createElement("div",{className:"grid grid-cols-5 mt-1 text-center"},r.a.createElement("span",{className:"border p-1"}," \u2116"),r.a.createElement("span",{className:"border p-1"}," \u041f\u043e\u0434\u0440\u0430\u0437\u0434\u0435\u043b\u0435\u043d\u0438\u0435"),r.a.createElement("span",{className:"border p-1"}," \u0412\u043e\u0438\u0441\u043a\u043e\u0435 \u0437\u0432\u0430\u043d\u0438\u0435"),r.a.createElement("span",{className:"border p-1"}," \u0424\u0430\u043c\u0438\u043b\u0438\u044f, \u0438\u043d\u0438\u0446\u0430\u043b\u044b"),r.a.createElement("span",{className:"border p-1"}," \u0414\u0438\u0430\u0433\u043d\u043e\u0437"),r.a.createElement("p",{className:"col-span-5 font-bold text-center border p-1"},"\u0421\u0442\u0430\u0446\u0438\u043e\u043d\u0430\u0440"),F.map((function(e,t){return r.a.createElement(r.a.Fragment,null,r.a.createElement("span",{className:"border p-1"},t+1),r.a.createElement("span",{className:"border p-1"},e.group_id__name),r.a.createElement("span",{className:"border p-1"},e.rank),r.a.createElement("span",{className:"border p-1"},e.name),r.a.createElement("span",{className:"border p-1"}," ",e.comment))})),r.a.createElement("p",{className:"col-span-5 font-bold text-center border p-1"},"\u0410\u043c\u0431\u0443\u043b\u0430\u0442\u043e\u0440\u043d\u043e"),R.map((function(e,t){return r.a.createElement(r.a.Fragment,null,r.a.createElement("span",{className:"border p-1"},t+1),r.a.createElement("span",{className:"border p-1"},e.group_id__name),r.a.createElement("span",{className:"border p-1"},e.rank),r.a.createElement("span",{className:"border p-1"},e.name),r.a.createElement("span",{className:"border p-1"}," ",e.comment))}))),r.a.createElement("p",{className:"font-bold text-center mt-8"},"\u041f\u043d\u0435\u0432\u043c\u043e\u043d\u0438\u044f ",P.length+U.length," -  \u0447\u0435\u043b."),r.a.createElement("div",{className:"grid grid-cols-5 mt-1 text-center"},r.a.createElement("span",{className:"border p-1"}," \u2116"),r.a.createElement("span",{className:"border p-1"}," \u041f\u043e\u0434\u0440\u0430\u0437\u0434\u0435\u043b\u0435\u043d\u0438\u0435"),r.a.createElement("span",{className:"border p-1"}," \u0412\u043e\u0438\u0441\u043a\u043e\u0435 \u0437\u0432\u0430\u043d\u0438\u0435"),r.a.createElement("span",{className:"border p-1"}," \u0424\u0430\u043c\u0438\u043b\u0438\u044f, \u0438\u043d\u0438\u0446\u0430\u043b\u044b"),r.a.createElement("span",{className:"border p-1"}," \u0414\u0438\u0430\u0433\u043d\u043e\u0437"),r.a.createElement("p",{className:"col-span-5 font-bold text-center border p-1"},"\u0421\u0442\u0430\u0446\u0438\u043e\u043d\u0430\u0440"),P.map((function(e,t){return r.a.createElement(r.a.Fragment,null,r.a.createElement("span",{className:"border p-1"},t+1),r.a.createElement("span",{className:"border p-1"},e.group_id__name),r.a.createElement("span",{className:"border p-1"},e.rank),r.a.createElement("span",{className:"border p-1"},e.name),r.a.createElement("span",{className:"border p-1"}," ",e.comment))})),r.a.createElement("p",{className:"col-span-5 font-bold text-center border p-1"},"\u0410\u043c\u0431\u0443\u043b\u0430\u0442\u043e\u0440\u043d\u043e"),U.map((function(e,t){return r.a.createElement(r.a.Fragment,null,r.a.createElement("span",{className:"border p-1"},t+1),r.a.createElement("span",{className:"border p-1"},e.group_id__name),r.a.createElement("span",{className:"border p-1"},e.rank),r.a.createElement("span",{className:"border p-1"},e.name),r.a.createElement("span",{className:"border p-1"}," ",e.comment))}))),r.a.createElement("p",{className:"font-bold text-center mt-8"},"\u041e\u0441\u0442\u0440\u044b\u0435 \u0440\u0435\u0441\u043f\u0438\u0440\u0430\u0442\u043e\u0440\u043d\u044b\u0435 \u0432\u0438\u0440\u0443\u0441\u043d\u044b\u0435 \u0438\u043d\u0444\u0435\u043a\u0446\u0438\u0438 (\u043d\u0435 \u043a\u043e\u0440\u043e\u043d\u0430\u0432\u0438\u0440\u0443\u0441\u043d\u0430\u044f \u0438\u043d\u0444\u0435\u043a\u0446\u0438\u044f) ",B.length+M.length," -  \u0447\u0435\u043b."),r.a.createElement("div",{className:"grid grid-cols-5 mt-1 text-center"},r.a.createElement("span",{className:"border p-1"}," \u2116"),r.a.createElement("span",{className:"border p-1"}," \u041f\u043e\u0434\u0440\u0430\u0437\u0434\u0435\u043b\u0435\u043d\u0438\u0435"),r.a.createElement("span",{className:"border p-1"}," \u0412\u043e\u0438\u0441\u043a\u043e\u0435 \u0437\u0432\u0430\u043d\u0438\u0435"),r.a.createElement("span",{className:"border p-1"}," \u0424\u0430\u043c\u0438\u043b\u0438\u044f, \u0438\u043d\u0438\u0446\u0430\u043b\u044b"),r.a.createElement("span",{className:"border p-1"}," \u0414\u0438\u0430\u0433\u043d\u043e\u0437"),r.a.createElement("p",{className:"col-span-5 font-bold text-center border p-1"},"\u0421\u0442\u0430\u0446\u0438\u043e\u043d\u0430\u0440"),B.map((function(e,t){return r.a.createElement(r.a.Fragment,null,r.a.createElement("span",{className:"border p-1"},t+1),r.a.createElement("span",{className:"border p-1"},e.group_id__name),r.a.createElement("span",{className:"border p-1"},e.rank),r.a.createElement("span",{className:"border p-1"},e.name),r.a.createElement("span",{className:"border p-1"}," ",e.comment))})),r.a.createElement("p",{className:"col-span-5 font-bold text-center border p-1"},"\u0410\u043c\u0431\u0443\u043b\u0430\u0442\u043e\u0440\u043d\u043e"),M.map((function(e,t){return r.a.createElement(r.a.Fragment,null,r.a.createElement("span",{className:"border p-1"},t+1),r.a.createElement("span",{className:"border p-1"},e.group_id__name),r.a.createElement("span",{className:"border p-1"},e.rank),r.a.createElement("span",{className:"border p-1"},e.name),r.a.createElement("span",{className:"border p-1"}," ",e.comment))}))),r.a.createElement("p",{className:"text-center mt-8"},r.a.createElement("b",null,"\u0427\u0438\u0441\u043b\u043e \u043d\u0430\u0445\u043e\u0434\u044f\u0449\u0438\u0445\u0441\u044f \u043d\u0430 \u043a\u0430\u0440\u0430\u043d\u0442\u0438\u043d\u0435 (\u0438\u0437\u043e\u043b\u044f\u0446\u0438\u044f):"),r.a.createElement("br",null),"\u0412\u0441\u0435\u0433\u043e - ",r.a.createElement("b",null,T.length),", \u0432 \u0442\u043e\u043c \u0447\u0438\u0441\u043b\u0435:",r.a.createElement("br",null),"\u0432\u043e\u0435\u043d\u043d\u043e\u0441\u043b\u0443\u0436\u0430\u0449\u0438\u0435 - ",r.a.createElement("b",null,T.filter((function(e){return e.is_military})).length)," \u0447\u0435\u043b.; \u0433\u0440. \u043f\u0435\u0440\u0441\u043e\u043d\u0430\u043b  - ",r.a.createElement("b",null,T.filter((function(e){return!e.is_military})).length)," \u0447\u0435\u043b."),r.a.createElement("div",{className:"grid grid-cols-5 mt-1 text-center"},r.a.createElement("span",{className:"border p-1"}," \u2116"),r.a.createElement("span",{className:"border p-1"}," \u041f\u043e\u0434\u0440\u0430\u0437\u0434\u0435\u043b\u0435\u043d\u0438\u0435"),r.a.createElement("span",{className:"border p-1"}," \u0412\u043e\u0438\u0441\u043a\u043e\u0435 \u0437\u0432\u0430\u043d\u0438\u0435"),r.a.createElement("span",{className:"border p-1"}," \u0424\u0430\u043c\u0438\u043b\u0438\u044f \u0438 \u0438\u043d\u0438\u0446\u0430\u043b\u044b"),r.a.createElement("span",{className:"border p-1"}," \u041f\u0440\u0438\u0447\u0438\u043d\u0430"),T.map((function(e,t){return r.a.createElement(r.a.Fragment,null,r.a.createElement("span",{className:"border p-1"},t+1),r.a.createElement("span",{className:"border p-1"},e.group_id__name),r.a.createElement("span",{className:"border p-1"},e.rank),r.a.createElement("span",{className:"border p-1"},e.name),r.a.createElement("span",{className:"border p-1"}," ",e.comment))}))),r.a.createElement("p",{className:"font-bold text-center mt-8"},"\u041a\u043e\u0440\u043e\u043d\u0430\u0432\u0438\u0440\u0443\u0441\u043d\u0430\u044f \u0438\u043d\u0444\u0435\u043a\u0446\u0438\u044f - ",D.length+I.length," \u0447\u0435\u043b."),r.a.createElement("div",{className:"grid grid-cols-5 mt-1 text-center"},r.a.createElement("span",{className:"border p-1"}," \u2116"),r.a.createElement("span",{className:"border p-1"}," \u041f\u043e\u0434\u0440\u0430\u0437\u0434\u0435\u043b\u0435\u043d\u0438\u0435"),r.a.createElement("span",{className:"border p-1"}," \u0412\u043e\u0438\u0441\u043a\u043e\u0435 \u0437\u0432\u0430\u043d\u0438\u0435"),r.a.createElement("span",{className:"border p-1"}," \u0424\u0430\u043c\u0438\u043b\u0438\u044f \u0438 \u0438\u043d\u0438\u0446\u0430\u043b\u044b"),r.a.createElement("span",{className:"border p-1"}," \u041f\u0440\u0438\u0447\u0438\u043d\u0430"),r.a.createElement("p",{className:"col-span-5 font-bold text-center border p-1"},"\u0421\u0442\u0430\u0446\u0438\u043e\u043d\u0430\u0440"),I.map((function(e,t){return r.a.createElement(r.a.Fragment,null,r.a.createElement("span",{className:"border p-1"},t+1),r.a.createElement("span",{className:"border p-1"},e.group_id__name),r.a.createElement("span",{className:"border p-1"},e.rank),r.a.createElement("span",{className:"border p-1"},e.name),r.a.createElement("span",{className:"border p-1"}," ",e.comment))})),r.a.createElement("p",{className:"col-span-5 font-bold text-center border p-1"},"\u0410\u043c\u0431\u0443\u043b\u0430\u0442\u043e\u0440\u043d\u043e"),D.map((function(e,t){return r.a.createElement(r.a.Fragment,null,r.a.createElement("span",{className:"border p-1"},t+1),r.a.createElement("span",{className:"border p-1"},e.group_id__name),r.a.createElement("span",{className:"border p-1"},e.rank),r.a.createElement("span",{className:"border p-1"},e.name),r.a.createElement("span",{className:"border p-1"}," ",e.comment))})))))};var F=function(e){var t=e.headerRef,a=e.setShowBody,c=Object(n.useState)(new Date),l=Object(h.a)(c,2),i=l[0],o=l[1],m=Object(n.createRef)(),u=Object(n.useState)([]),p=Object(h.a)(u,2),b=p[0],f=p[1],E=function(){d.getListOfReport({date:i}).then((function(e){f((function(t){return t.map((function(t){var a=e.filter((function(e){return e.userForControl_id===t.id}));return a.length>0?Object(s.a)(Object(s.a)({},t),a[0]):(delete t.comment,delete t.status_id,t)}))}))}))};Object(n.useEffect)((function(){d.getListOfPerson().then((function(e){f(e),E()}))}),[]),Object(n.useEffect)((function(){E()}),[i]),console.log(b);var N=b.filter((function(e){return!e.status_id}));return r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{ref:m},r.a.createElement(_,{className:"",type:"primary",text:"\u041d\u0430\u0437\u0430\u0434",onClick:function(){a("nothing")}}),r.a.createElement(_,{className:"",type:"success",text:"\u0420\u0430\u0441\u043f\u0435\u0447\u0430\u0442\u0430\u0442\u044c",onClick:function(){m.current.classList.add("hidden"),t.current.classList.add("hidden"),window.print(),m.current.classList.remove("hidden"),t.current.classList.remove("hidden")}}),r.a.createElement(C.a,{className:"rounded border border-blue-700 p-1",selected:i,onChange:function(e){return o(e)},dateFormat:"dd-MM-yyyy"})),r.a.createElement("p",{className:"font-bold m-2 text-center text-2xl"},"\u0421\u043f\u0438\u0441\u043a\u0438 \u043d\u0430 \u043f\u0440\u043e\u0445\u043e\u0434 \u043d\u0430 ",i.toLocaleDateString("ru")),r.a.createElement("div",{className:"grid grid-cols-5  mt-1 text-center"},r.a.createElement("span",{className:"border p-1"},"\u2116"),r.a.createElement("span",{className:"border p-1"},"\u041f\u043e\u0434\u0440\u0430\u0437\u0434\u0435\u043b\u0435\u043d\u0438\u0435"),r.a.createElement("span",{className:"border p-1"},"\u0412\u043e\u0438\u0441\u043a\u043e\u0435 \u0437\u0432\u0430\u043d\u0438\u0435"),r.a.createElement("span",{className:"border p-1"},"\u0424\u0430\u043c\u0438\u043b\u0438\u044f, \u0438\u043d\u0438\u0446\u0430\u043b\u044b"),r.a.createElement("span",{className:"border p-1"},"\u041f\u0440\u0438\u043c\u0435\u0447\u0430\u043d\u0438\u0435"),N.map((function(e,t){return r.a.createElement(r.a.Fragment,null,r.a.createElement("span",{className:"border p-1"},t+1),r.a.createElement("span",{className:"border p-1"},e.group_id__name),r.a.createElement("span",{className:"border p-1"},e.rank),r.a.createElement("span",{className:"border p-1"},e.name),r.a.createElement("span",{className:"border p-1"}," ",e.comment))}))))};var P=Object(i.b)((function(e){return{user:e.user}}))((function(e){var t=e.user,a=Object(n.useState)("nothing"),c=Object(h.a)(a,2),l=c[0],s=c[1],i=Object(n.createRef)(),o=r.a.createElement("div",null,r.a.createElement(_,{className:"",type:"primary",text:"\u0423\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u043b/\u0441",onClick:function(){s("listOfPerson")}}),r.a.createElement(_,{className:"",type:"primary",text:"\u0421\u0444\u043e\u0440\u043c\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u043e\u0442\u0447\u0435\u0442",onClick:function(){s("makeReport")}})),m=r.a.createElement("div",null,r.a.createElement(_,{className:"",type:"primary",text:"\u0421\u043f\u0438\u0441\u043a\u0438 \u043d\u0430 \u043f\u0440\u043e\u0445\u043e\u0434",onClick:function(){s("listForEntering")}}),r.a.createElement(_,{className:"",type:"primary",text:"\u0421\u043f\u0440\u0430\u0432\u043a\u0430 \u0434\u043e\u043a\u043b\u0430\u0434",onClick:function(){s("report")}}));return r.a.createElement(r.a.Fragment,null,r.a.createElement(v,{headerRef:i}),r.a.createElement("div",{className:"px-2"},t.is_control?function(){switch(l){case"listForEntering":return r.a.createElement(F,{headerRef:i,setShowBody:s});case"report":return r.a.createElement(R,{headerRef:i,setShowBody:s});default:return m}}():function(){switch(l){case"listOfPerson":return r.a.createElement(k,{setShowBody:s});case"makeReport":return r.a.createElement(L,{setShowBody:s});default:return o}}()))}));var U=Object(i.b)((function(e){return{user:e.user}}),(function(e){return{initUser:function(t){return e(O(t))}}}))((function(e){var t=e.user,a=e.initUser;return Object(n.useEffect)((function(){d.initUser().then((function(e){a(Object(s.a)(Object(s.a)({},e),{},{is_initial:!0}))})).catch((function(){a(Object(s.a)(Object(s.a)({},t),{},{is_initial:!0}))}))}),[]),t.is_initial?t.username?r.a.createElement(P,null):r.a.createElement(y,null):r.a.createElement("span",null,"Loading")})),M=(a(149),a(75)),B=a(25),T={username:"",is_initial:!1};var D=Object(B.b)({user:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:T,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case"InitUser":return Object(s.a)(Object(s.a)({},e),t.user);default:return e}}}),I=Object(B.c)(D);l.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(i.a,{store:I},r.a.createElement(M.a,null,r.a.createElement(U,null)))),document.getElementById("root"))},76:function(e,t,a){e.exports=a(151)},81:function(e,t,a){}},[[76,1,2]]]);
//# sourceMappingURL=main.6946e095.chunk.js.map