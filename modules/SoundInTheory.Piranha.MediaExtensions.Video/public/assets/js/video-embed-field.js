const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/js/_chunks/video-embed-field-BuUhgLlj.js","assets/css/video-embed-field.css?v=BANVzK5d"])))=>i.map(i=>d[i]);
const v="modulepreload",E=function(t){return"/"+t},u={},y=function(c,s,b){let l=Promise.resolve();if(s&&s.length>0){document.getElementsByTagName("link");const e=document.querySelector("meta[property=csp-nonce]"),n=(e==null?void 0:e.nonce)||(e==null?void 0:e.getAttribute("nonce"));l=Promise.allSettled(s.map(r=>{if(r=E(r),r in u)return;u[r]=!0;const i=r.endsWith(".css"),f=i?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${r}"]${f}`))return;const o=document.createElement("link");if(o.rel=i?"stylesheet":v,i||(o.as="script"),o.crossOrigin="",o.href=r,n&&o.setAttribute("nonce",n),document.head.appendChild(o),i)return new Promise((p,h)=>{o.addEventListener("load",p),o.addEventListener("error",()=>h(new Error(`Unable to preload CSS for ${r}`)))})}))}function a(e){const n=new Event("vite:preloadError",{cancelable:!0});if(n.payload=e,window.dispatchEvent(n),!n.defaultPrevented)throw e}return l.then(e=>{for(const n of e||[])n.status==="rejected"&&a(n.reason);return c().catch(a)})},d=Object.assign({"./video-embed-field.vue":()=>y(()=>import("./_chunks/video-embed-field-BuUhgLlj.js"),__vite__mapDeps([0,1])).then(t=>t.default)}),m=Object.keys(d).reduce((t,c)=>{var s=c.split("\\").pop().split("/").pop().replace(/\.[^/.]+$/,"");return t[s]=d[c],t},{});for(const t of Object.keys(m))Vue.component(t,m[t]);
