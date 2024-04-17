function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = ["../nodes/0.DH0QNdMD.js","../chunks/scheduler.C2F96xcg.js","../chunks/index.KwxAMvBS.js","../chunks/stores.wqOMWTAa.js","../chunks/entry.Da5bWbWT.js","../chunks/index.PYyg6Vbu.js","../assets/0.C0Wi6-LX.css","../nodes/1.SnZQJ6b8.js","../nodes/2.CUI7d1a5.js","../chunks/each.BrdkGwLC.js","../nodes/3.BBcqtMDT.js","../chunks/index.R8ovVqwX.js","../nodes/4.Buk2CwVn.js","../assets/4.DOkkq0IA.css","../nodes/5.Cy-zhEr_.js","../assets/5.CU6psp88.css"]
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}
import{s as q,a as B,u as h,g as U,i as b,f as p,v as j,w as z,e as M,c as W,b as F,q as A,x as d,t as G,d as H,j as J,y as D,z as k,A as K}from"../chunks/scheduler.C2F96xcg.js";import{S as Q,i as X,a as w,c as P,t as g,g as L,b as E,d as I,m as y,e as R}from"../chunks/index.KwxAMvBS.js";const Y="modulepreload",Z=function(a,e){return new URL(a,e).href},O={},v=function(e,n,i){let s=Promise.resolve();if(n&&n.length>0){const c=document.getElementsByTagName("link");s=Promise.all(n.map(t=>{if(t=Z(t,i),t in O)return;O[t]=!0;const r=t.endsWith(".css"),l=r?'[rel="stylesheet"]':"";if(!!i)for(let u=c.length-1;u>=0;u--){const m=c[u];if(m.href===t&&(!r||m.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${t}"]${l}`))return;const o=document.createElement("link");if(o.rel=r?"stylesheet":Y,r||(o.as="script",o.crossOrigin=""),o.href=t,document.head.appendChild(o),r)return new Promise((u,m)=>{o.addEventListener("load",u),o.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${t}`)))})}))}return s.then(()=>e()).catch(c=>{const t=new Event("vite:preloadError",{cancelable:!0});if(t.payload=c,window.dispatchEvent(t),!t.defaultPrevented)throw c})},re={};function $(a){let e,n,i;var s=a[1][0];function c(t,r){return{props:{data:t[3],form:t[2]}}}return s&&(e=k(s,c(a)),a[12](e)),{c(){e&&E(e.$$.fragment),n=h()},l(t){e&&I(e.$$.fragment,t),n=h()},m(t,r){e&&y(e,t,r),b(t,n,r),i=!0},p(t,r){if(r&2&&s!==(s=t[1][0])){if(e){L();const l=e;w(l.$$.fragment,1,0,()=>{R(l,1)}),P()}s?(e=k(s,c(t)),t[12](e),E(e.$$.fragment),g(e.$$.fragment,1),y(e,n.parentNode,n)):e=null}else if(s){const l={};r&8&&(l.data=t[3]),r&4&&(l.form=t[2]),e.$set(l)}},i(t){i||(e&&g(e.$$.fragment,t),i=!0)},o(t){e&&w(e.$$.fragment,t),i=!1},d(t){t&&p(n),a[12](null),e&&R(e,t)}}}function x(a){let e,n,i;var s=a[1][0];function c(t,r){return{props:{data:t[3],$$slots:{default:[ee]},$$scope:{ctx:t}}}}return s&&(e=k(s,c(a)),a[11](e)),{c(){e&&E(e.$$.fragment),n=h()},l(t){e&&I(e.$$.fragment,t),n=h()},m(t,r){e&&y(e,t,r),b(t,n,r),i=!0},p(t,r){if(r&2&&s!==(s=t[1][0])){if(e){L();const l=e;w(l.$$.fragment,1,0,()=>{R(l,1)}),P()}s?(e=k(s,c(t)),t[11](e),E(e.$$.fragment),g(e.$$.fragment,1),y(e,n.parentNode,n)):e=null}else if(s){const l={};r&8&&(l.data=t[3]),r&8215&&(l.$$scope={dirty:r,ctx:t}),e.$set(l)}},i(t){i||(e&&g(e.$$.fragment,t),i=!0)},o(t){e&&w(e.$$.fragment,t),i=!1},d(t){t&&p(n),a[11](null),e&&R(e,t)}}}function ee(a){let e,n,i;var s=a[1][1];function c(t,r){return{props:{data:t[4],form:t[2]}}}return s&&(e=k(s,c(a)),a[10](e)),{c(){e&&E(e.$$.fragment),n=h()},l(t){e&&I(e.$$.fragment,t),n=h()},m(t,r){e&&y(e,t,r),b(t,n,r),i=!0},p(t,r){if(r&2&&s!==(s=t[1][1])){if(e){L();const l=e;w(l.$$.fragment,1,0,()=>{R(l,1)}),P()}s?(e=k(s,c(t)),t[10](e),E(e.$$.fragment),g(e.$$.fragment,1),y(e,n.parentNode,n)):e=null}else if(s){const l={};r&16&&(l.data=t[4]),r&4&&(l.form=t[2]),e.$set(l)}},i(t){i||(e&&g(e.$$.fragment,t),i=!0)},o(t){e&&w(e.$$.fragment,t),i=!1},d(t){t&&p(n),a[10](null),e&&R(e,t)}}}function T(a){let e,n=a[6]&&V(a);return{c(){e=M("div"),n&&n.c(),this.h()},l(i){e=W(i,"DIV",{id:!0,"aria-live":!0,"aria-atomic":!0,style:!0});var s=F(e);n&&n.l(s),s.forEach(p),this.h()},h(){A(e,"id","svelte-announcer"),A(e,"aria-live","assertive"),A(e,"aria-atomic","true"),d(e,"position","absolute"),d(e,"left","0"),d(e,"top","0"),d(e,"clip","rect(0 0 0 0)"),d(e,"clip-path","inset(50%)"),d(e,"overflow","hidden"),d(e,"white-space","nowrap"),d(e,"width","1px"),d(e,"height","1px")},m(i,s){b(i,e,s),n&&n.m(e,null)},p(i,s){i[6]?n?n.p(i,s):(n=V(i),n.c(),n.m(e,null)):n&&(n.d(1),n=null)},d(i){i&&p(e),n&&n.d()}}}function V(a){let e;return{c(){e=G(a[7])},l(n){e=H(n,a[7])},m(n,i){b(n,e,i)},p(n,i){i&128&&J(e,n[7])},d(n){n&&p(e)}}}function te(a){let e,n,i,s,c;const t=[x,$],r=[];function l(o,u){return o[1][1]?0:1}e=l(a),n=r[e]=t[e](a);let _=a[5]&&T(a);return{c(){n.c(),i=B(),_&&_.c(),s=h()},l(o){n.l(o),i=U(o),_&&_.l(o),s=h()},m(o,u){r[e].m(o,u),b(o,i,u),_&&_.m(o,u),b(o,s,u),c=!0},p(o,[u]){let m=e;e=l(o),e===m?r[e].p(o,u):(L(),w(r[m],1,1,()=>{r[m]=null}),P(),n=r[e],n?n.p(o,u):(n=r[e]=t[e](o),n.c()),g(n,1),n.m(i.parentNode,i)),o[5]?_?_.p(o,u):(_=T(o),_.c(),_.m(s.parentNode,s)):_&&(_.d(1),_=null)},i(o){c||(g(n),c=!0)},o(o){w(n),c=!1},d(o){o&&(p(i),p(s)),r[e].d(o),_&&_.d(o)}}}function ne(a,e,n){let{stores:i}=e,{page:s}=e,{constructors:c}=e,{components:t=[]}=e,{form:r}=e,{data_0:l=null}=e,{data_1:_=null}=e;j(i.page.notify);let o=!1,u=!1,m=null;z(()=>{const f=i.page.subscribe(()=>{o&&(n(6,u=!0),K().then(()=>{n(7,m=document.title||"untitled page")}))});return n(5,o=!0),f});function N(f){D[f?"unshift":"push"](()=>{t[1]=f,n(0,t)})}function S(f){D[f?"unshift":"push"](()=>{t[0]=f,n(0,t)})}function C(f){D[f?"unshift":"push"](()=>{t[0]=f,n(0,t)})}return a.$$set=f=>{"stores"in f&&n(8,i=f.stores),"page"in f&&n(9,s=f.page),"constructors"in f&&n(1,c=f.constructors),"components"in f&&n(0,t=f.components),"form"in f&&n(2,r=f.form),"data_0"in f&&n(3,l=f.data_0),"data_1"in f&&n(4,_=f.data_1)},a.$$.update=()=>{a.$$.dirty&768&&i.page.set(s)},[t,c,r,l,_,o,u,m,i,s,N,S,C]}class oe extends Q{constructor(e){super(),X(this,e,ne,te,q,{stores:8,page:9,constructors:1,components:0,form:2,data_0:3,data_1:4})}}const ae=[()=>v(()=>import("../nodes/0.DH0QNdMD.js"),__vite__mapDeps([0,1,2,3,4,5,6]),import.meta.url),()=>v(()=>import("../nodes/1.SnZQJ6b8.js"),__vite__mapDeps([7,1,2,3,4,5]),import.meta.url),()=>v(()=>import("../nodes/2.CUI7d1a5.js"),__vite__mapDeps([8,1,2,9,5]),import.meta.url),()=>v(()=>import("../nodes/3.BBcqtMDT.js"),__vite__mapDeps([10,11,1,2]),import.meta.url),()=>v(()=>import("../nodes/4.Buk2CwVn.js"),__vite__mapDeps([12,1,9,2,4,5,13]),import.meta.url),()=>v(()=>import("../nodes/5.Cy-zhEr_.js"),__vite__mapDeps([14,11,1,2,15]),import.meta.url)],le=[],fe={"/":[2],"/about":[3],"/sverdle":[-5],"/sverdle/how-to-play":[5]},ce={handleError:({error:a})=>{console.error(a)},reroute:()=>{}};export{fe as dictionary,ce as hooks,re as matchers,ae as nodes,oe as root,le as server_loads};
