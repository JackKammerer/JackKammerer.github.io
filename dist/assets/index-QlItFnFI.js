(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const n of o.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&s(n)}).observe(document,{childList:!0,subtree:!0});function l(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(a){if(a.ep)return;a.ep=!0;const o=l(a);fetch(a.href,o)}})();var c=[];for(var f=0;f<256;++f)c.push((f+256).toString(16).slice(1));function U(t,e=0){return(c[t[e+0]]+c[t[e+1]]+c[t[e+2]]+c[t[e+3]]+"-"+c[t[e+4]]+c[t[e+5]]+"-"+c[t[e+6]]+c[t[e+7]]+"-"+c[t[e+8]]+c[t[e+9]]+"-"+c[t[e+10]]+c[t[e+11]]+c[t[e+12]]+c[t[e+13]]+c[t[e+14]]+c[t[e+15]]).toLowerCase()}var b,j=new Uint8Array(16);function C(){if(!b&&(b=typeof crypto<"u"&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!b))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return b(j)}var B=typeof crypto<"u"&&crypto.randomUUID&&crypto.randomUUID.bind(crypto);const k={randomUUID:B};function O(t,e,l){if(k.randomUUID&&!e&&!t)return k.randomUUID();t=t||{};var s=t.random||(t.rng||C)();return s[6]=s[6]&15|64,s[8]=s[8]&63|128,U(s)}function y(){return{id:"",change_type:0,school_name:null,school_dates:null,degree:null,awards:null}}function D(){return{id:"",items:null}}function x(){return{id:"",change_type:0,position:null,company:null,dates:null,details:null}}function h(){return{id:"",change_type:0,project_name:null,tools_used:null,project_description:null,github_repo:null,image_link:null}}function w(){return{id:"",change_type:0,contact_name:null,link_name:null,image_name:null}}const p=new Map,S=(t,e)=>{t.set(e.id,e)},m=(t,e,l,s,a)=>{const o=t.get(e);if(o!=null)s in o&&(o[s]=a);else{let n;switch(l){case"school":n=y();break;case"achievements":n=D();break;case"work":n=x();break;case"projects":n=h();break;case"tools":n=D();break;case"contacts":n=w();break;default:return}s in n&&(n[s]=a,n.id=e,"change_type"in n&&(n.change_type=1)),t.set(e,n)}},I=(t,e,l)=>{const s=t.get(e);if(s!=null&&"change_type"in s&&s.change_type===0){t.delete(e);return}let a;switch(l){case"school":a=y();break;case"work":a=x();break;case"projects":a=h();break;case"contacts":a=w();break;default:return}a.id=e,"change_type"in a&&(a.change_type=2),t.set(e,a)},g=t=>{let e=t;for(;e;){const l=e.parentElement;if(l!=null&&l.tagName==="SECTION")return l.id;e=l}},T=t=>{var s,a;const e=t.currentTarget;let l=g(e);I(p,((s=e==null?void 0:e.parentElement)==null?void 0:s.id)||"",l||""),(a=e==null?void 0:e.parentElement)==null||a.remove()};Array.from(document.getElementsByClassName("deleteObject")).forEach(t=>{t.addEventListener("click",T)});const N=t=>{var s,a,o,n,r;const e=t.currentTarget;let l=g(e);m(p,((a=(s=e==null?void 0:e.parentElement)==null?void 0:s.parentElement)==null?void 0:a.id)||((r=(n=(o=e==null?void 0:e.parentElement)==null?void 0:o.parentElement)==null?void 0:n.parentElement)==null?void 0:r.id)||"",l||"",e.classList[1],e.value||"")};Array.from(document.getElementsByClassName("textUpdate")).forEach(t=>{t.addEventListener("change",N)});const E=t=>{var n,r,i;const e=t.currentTarget,l=(n=e.parentElement)==null?void 0:n.parentElement,s=g(e);let a=l==null?void 0:l.classList[0];if(s===void 0||a===void 0)return;(a=="achievements"||a=="tools")&&(a="items"),(r=e.parentElement)==null||r.remove();let o=[];l!=null&&(Array.from(l==null?void 0:l.getElementsByTagName("li")).forEach(u=>{const d=u.getElementsByTagName("input")[0];o.push(d.value)}),m(p,((i=l.parentElement)==null?void 0:i.id)||"",s,a,o))};Array.from(document.getElementsByClassName("updateListDelete")).forEach(t=>{t.addEventListener("click",E)});const v=t=>{var n,r,i;const e=t.currentTarget,l=(r=(n=e.parentElement)==null?void 0:n.parentElement)==null?void 0:r.parentElement,s=g(e);let a=l==null?void 0:l.classList[0];if(s===void 0||a===void 0)return;(a=="achievements"||a=="tools")&&(a="items");let o=[];l!=null&&(Array.from(l==null?void 0:l.getElementsByTagName("li")).forEach(u=>{const d=u.getElementsByTagName("input")[0];o.push(d.value)}),m(p,((i=l.parentElement)==null?void 0:i.id)||"",s,a,o))};Array.from(document.getElementsByClassName("updateListText")).forEach(t=>{t.addEventListener("change",v)});const A=t=>{var i,u;const e=t.currentTarget,l=(i=e.parentElement)==null?void 0:i.getElementsByTagName("ul")[0],s=g(e);let a=l==null?void 0:l.classList[0];if(s===void 0||a===void 0)return;let o;switch(a){case"awards":o=`
      <li class="flex items-center space-x-2"> 
        <label class="flex w-full">
          <p class="text-l mr-5">Award:</p>
          <input type="text" class="updateListText block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-gray-500 p-1">
        </label>
        <button class="updateListDelete bg-red-800 hover:bg-red-500 text-white font-bold py-1 px-2 rounded">Delete</button>
      </li>
      `;break;case"achievements":o=`
      <li class="flex items-center space-x-2"> 
        <label class="flex w-full">
          <p class="text-l mr-5">Achievement:</p>
          <input type="text" class="updateListText block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-gray-500 p-1">
        </label>
        <button class="updateListDelete bg-red-800 hover:bg-red-500 text-white font-bold py-1 px-2 rounded">Delete</button>
      </li>
      `;break;case"details":o=`
      <li class="flex items-center space-x-2"> 
        <label class="flex w-full">
          <p class="text-l mr-5">Detail:</p>
          <input type="text" class="updateListText block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-gray-500 p-1">
        </label>
        <button class="updateListDelete bg-red-800 hover:bg-red-500 text-white font-bold py-1 px-2 rounded">Delete</button>
      </li>
      `;break;case"tools_used":o=`
      <li class="flex items-center space-x-2"> 
        <label class="flex w-full">
          <p class="text-l mr-5">Tool:</p>
          <input type="text" class="updateListText block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-gray-500 p-1">
        </label>
        <button class="updateListDelete bg-red-800 hover:bg-red-500 text-white font-bold py-1 px-2 rounded">Delete</button>
      </li>
      `;break;case"tools":o=`
      <li class="flex items-center space-x-2"> 
        <label class="flex w-full">
          <p class="text-l mr-5">Tool:</p>
          <input type="text" class="updateListText block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-gray-500 p-1">
        </label>
        <button class="updateListDelete bg-red-800 hover:bg-red-500 text-white font-bold py-1 px-2 rounded">Delete</button>
      </li>
      `;break;default:o=""}(a=="achievements"||a=="tools")&&(a="items"),l==null||l.insertAdjacentHTML("beforeend",o);const n=l==null?void 0:l.getElementsByTagName("li");if(n){const d=n[n.length-1];d.getElementsByClassName("updateListDelete")[0].addEventListener("click",E),d.getElementsByClassName("updateListText")[0].addEventListener("change",v)}let r=[];l!=null&&(Array.from(l==null?void 0:l.getElementsByTagName("li")).forEach(d=>{const _=d.getElementsByTagName("input")[0];r.push(_.value)}),m(p,((u=l.parentElement)==null?void 0:u.id)||"",s,a,r))};Array.from(document.getElementsByClassName("updateListAdd")).forEach(t=>{t.addEventListener("click",A)});Array.from(document.getElementsByClassName("createObject")).forEach(t=>{t.addEventListener("click",e=>{var u;const l=e.currentTarget;let s=O(),a=g(l),o=(u=l.parentElement)==null?void 0:u.getElementsByTagName("ul")[0],n,r;switch(a){case"school":n=`
        <li id="`+s+`" class="border-b pb-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
            <label class="block">
              <p class="text-l underline">School Name:</p>
              <input type="text" class="textUpdate school_name mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-gray-500 p-1">
            </label>
            <label class="block">
              <p class="text-l underline">Date Range:</p>
              <input type="text" class="textUpdate school_dates mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-gray-500 p-1">
            </label>
          </div>
          <label class="block mb-2">
            <p class="text-l underline">Degree:</p>
            <input type="text" class="textUpdate degree mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-gray-500 p-1">
          </label>
          <p class="mb-2 underline">Accomplishments:</p>
          <ul class="awards space-y-2 mb-2">
            <li class="flex items-center space-x-2"> 
              <label class="flex w-full">
                <p class="text-l mr-5">Award:</p>
                <input type="text" class="updateListText block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-gray-500 p-1">
              </label>
              <button class="updateListDelete bg-red-800 hover:bg-red-500 text-white font-bold py-1 px-2 rounded">Delete</button>
            </li>
          </ul>
          <button class="updateListAdd bg-blue-600 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded mr-2">Add Award</button>
          <button class="deleteObject bg-red-800 hover:bg-red-500 text-white font-bold py-2 px-4 rounded">Delete School</button>
        </li>
        `,r=y();break;case"work":n=`
        <li id="`+s+`" class="border-b pb-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
            <label class="block">
              <p class="text-l underline">Position:</p>
              <input type="text" class="textUpdate position mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-gray-500 p-1">
            </label>
            <label class="block">
              <p class="text-l underline">Company:</p>
              <input type="text" class="textUpdate company mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-gray-500 p-1">
            </label>
          </div>
          <label class="block mb-2">
            <p class="text-l underline">Date Range:</p>
            <input type="text" class="textUpdate dates mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-gray-500 p-1">
          </label>
          <p class="text-l underline">Description:</p>
          <ul class="details space-y-2 mb-2">
            <li class="flex items-center space-x-2"> 
              <label class="flex w-full">
                <p class="text-l mr-5">Detail:</p>
                <input type="text" class="updateListText block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-gray-500 p-1">
              </label>
              <button class="updateListDelete bg-red-800 hover:bg-red-500 text-white font-bold py-1 px-2 rounded">Delete</button>
            </li>
          </ul>
          <button class="updateListAdd bg-blue-600 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded mr-2">Add Detail</button>
          <button class="deleteObject bg-red-800 hover:bg-red-500 text-white font-bold py-2 px-4 rounded">Delete Past Job</button>
        </li>
        `,r=x();break;case"projects":n=`
        <div id="`+s+`" class="border-b pb-4"> 
          <label class="block mb-2">
            <p class="text-l underline">Project Name:</p>
            <input type="text" class="textUpdate project_name mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-gray-500 p-1">
          </label>
          <p class="text-l underline mb-2">Project Tools:</p>
          <ul class="tools_used space-y-2 mb-2">
            <li class="flex items-center space-x-2"> 
              <label class="flex w-full">
                <p class="text-l mr-5">Tool:</p>
                <input type="text" class="updateListText block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-gray-500 p-1">
              </label>
              <button class="updateListDelete bg-red-800 hover:bg-red-500 text-white font-bold py-1 px-2 rounded">Delete</button>
            </li>
          </ul>
          <button class="updateListAdd bg-blue-600 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded mb-2">Add New Tool</button>
          <div class="mb-2">
            <p class="text-l underline">Description:</p>
            <textarea class="textUpdate project_description mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-gray-500 p-1" rows="5"></textarea>
          </div>
          <label class="block mb-2">
            <p class="text-l underline">Repo Link:</p>
            <input type="text" class="textUpdate github_repo mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-gray-500 p-1">
          </label>
          <label class="block mb-2">
            <p class="text-l underline">Image Link:</p>
            <input type="text" class="textUpdate image_link mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-gray-500 p-1">
          </label>
          <button class="deleteObject bg-red-800 hover:bg-red-500 text-white font-bold py-2 px-4 rounded">Delete Project</button>
        </div>
        `,r=h();break;case"contacts":n=`
        <div id="`+s+`">
          <label class="block mb-2">
            <p class="text-l underline">Contact Name:</p>
            <input type="text" class="textUpdate contact_name mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-gray-500 p-1">
          </label>
          <label class="block mb-2">
            <p class="text-l underline">Link:</p>
            <input type="text" class="textUpdate link_name mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-gray-500 p-1">
          </label>
          <label class="block mb-2">
            <p class="text-l underline">Image Path:</p>
            <input type="text" class="textUpdate image_name mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-gray-500 p-1" alt="">
          </label>
          <button class="deleteObject bg-red-800 hover:bg-red-500 text-white font-bold py-2 px-4 rounded">Delete</button>
        </div>
        `,r=w();break;default:return}o==null||o.insertAdjacentHTML("beforeend",n);const i=document.getElementById(s);i!==null&&(i.getElementsByClassName("deleteObject")[0].addEventListener("click",T),a!="contacts"&&(i.getElementsByClassName("updateListAdd")[0].addEventListener("click",A),i.getElementsByClassName("updateListDelete")[0].addEventListener("click",E),i.getElementsByClassName("updateListText")[0].addEventListener("change",v)),Array.from(i.getElementsByClassName("textUpdate")).forEach(d=>{d.addEventListener("change",N)}),r.id=s,S(p,r))})});var L;(L=document.getElementById("UpdateButton"))==null||L.addEventListener("click",()=>{let t=Array.from(p.values()),e="/private/admin";fetch("https://jackkammerer.com/private/update-content",{method:"POST",headers:{"Content-Type":"application/json","X-XSRF-TOKEN":localStorage.getItem("X-XSRF-TOKEN")},body:JSON.stringify(t)}).then(l=>{l.status===500?alert("Internal Database Error!"):l.status===400?alert("Bad request body! Try again!"):l.redirected&&(e=l.url)}).then(()=>{window.location.href=e})});
