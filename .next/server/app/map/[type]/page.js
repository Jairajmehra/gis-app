(()=>{var e={};e.id=96,e.ids=[96],e.modules={846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},9121:e=>{"use strict";e.exports=require("next/dist/server/app-render/action-async-storage.external.js")},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},9294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},3033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},3873:e=>{"use strict";e.exports=require("path")},9551:e=>{"use strict";e.exports=require("url")},7506:(e,t,r)=>{"use strict";r.r(t),r.d(t,{GlobalError:()=>i.a,__next_app__:()=>c,pages:()=>p,routeModule:()=>m,tree:()=>d});var s=r(260),n=r(8203),a=r(5155),i=r.n(a),o=r(7292),l={};for(let e in o)0>["default","tree","pages","GlobalError","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>o[e]);r.d(t,l);let d=["",{children:["map",{children:["[type]",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(r.bind(r,2823)),"/Users/jairajmehra/Desktop/Redlitchee/web_qgis/src/app/map/[type]/page.tsx"]}]},{}]},{metadata:{icon:[async e=>(await Promise.resolve().then(r.bind(r,440))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}]},{layout:[()=>Promise.resolve().then(r.bind(r,1354)),"/Users/jairajmehra/Desktop/Redlitchee/web_qgis/src/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(r.t.bind(r,9937,23)),"next/dist/client/components/not-found-error"],forbidden:[()=>Promise.resolve().then(r.t.bind(r,9116,23)),"next/dist/client/components/forbidden-error"],unauthorized:[()=>Promise.resolve().then(r.t.bind(r,1485,23)),"next/dist/client/components/unauthorized-error"],metadata:{icon:[async e=>(await Promise.resolve().then(r.bind(r,440))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}],p=["/Users/jairajmehra/Desktop/Redlitchee/web_qgis/src/app/map/[type]/page.tsx"],c={require:r,loadChunk:()=>Promise.resolve()},m=new s.AppPageRouteModule({definition:{kind:n.RouteKind.APP_PAGE,page:"/map/[type]/page",pathname:"/map/[type]",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:d}})},7780:(e,t,r)=>{Promise.resolve().then(r.t.bind(r,3219,23)),Promise.resolve().then(r.t.bind(r,4863,23)),Promise.resolve().then(r.t.bind(r,5155,23)),Promise.resolve().then(r.t.bind(r,802,23)),Promise.resolve().then(r.t.bind(r,9350,23)),Promise.resolve().then(r.t.bind(r,8530,23)),Promise.resolve().then(r.t.bind(r,8921,23))},3812:(e,t,r)=>{Promise.resolve().then(r.t.bind(r,6959,23)),Promise.resolve().then(r.t.bind(r,3875,23)),Promise.resolve().then(r.t.bind(r,8903,23)),Promise.resolve().then(r.t.bind(r,7174,23)),Promise.resolve().then(r.t.bind(r,4178,23)),Promise.resolve().then(r.t.bind(r,7190,23)),Promise.resolve().then(r.t.bind(r,1365,23))},3352:()=>{},3080:()=>{},7959:(e,t,r)=>{Promise.resolve().then(r.bind(r,2823))},4751:(e,t,r)=>{Promise.resolve().then(r.bind(r,2759))},2759:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>o});var s=r(5512),n=r(8009),a=r(5429),i=r(8686);function o(){let e=(0,i.useParams)(),t=(0,i.useRouter)(),r=e.type,[o,l]=(0,n.useState)(null),{isLoaded:d}=(0,a.RH)({googleMapsApiKey:"AIzaSyC6TRmdiA0WTKEI8dUjW96GpRq5oXp9VnM"}),p=()=>new google.maps.ImageMapType({getTileUrl:function(e,t){let s=`http://35.207.193.193:80/tiles/${r}/tiles/${t}/${e.x}/${e.y}.png`;return console.log("Requesting tile:",s),new Image().onerror=()=>(console.log("Tile not found:",s),""),s},tileSize:new google.maps.Size(256,256),maxZoom:19,minZoom:0,name:"Custom",opacity:.75});return null===o?(0,s.jsx)("div",{className:"h-screen w-screen flex items-center justify-center",children:(0,s.jsx)("p",{className:"text-xl",children:"Loading..."})}):o?d?(0,s.jsx)("div",{className:"h-screen w-screen",children:(0,s.jsx)(a.u6,{zoom:10,center:{lat:23.0225,lng:72.5714},mapContainerClassName:"w-full h-full",options:{mapTypeId:"satellite",disableDefaultUI:!1},onLoad:e=>{console.log("Map loaded, adding tile layer for folder:",r);let t=p();e.overlayMapTypes.push(t)}})}):(0,s.jsx)("div",{children:"Loading map..."}):(0,s.jsxs)("div",{className:"h-screen w-screen flex flex-col items-center justify-center bg-gray-50",children:[(0,s.jsx)("h1",{className:"text-4xl font-bold text-gray-800 mb-4",children:"404"}),(0,s.jsx)("p",{className:"text-xl text-gray-600 mb-8",children:"Map not found"}),(0,s.jsx)("button",{onClick:()=>t.push("/"),className:"px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors",children:"Go Home"})]})}},1354:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>d,metadata:()=>l});var s=r(2740),n=r(2202),a=r.n(n),i=r(4988),o=r.n(i);r(1135);let l={title:"Create Next App",description:"Generated by create next app"};function d({children:e}){return(0,s.jsx)("html",{lang:"en",children:(0,s.jsx)("body",{className:`${a().variable} ${o().variable} antialiased`,children:e})})}},2823:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>s});let s=(0,r(6760).registerClientReference)(function(){throw Error("Attempted to call the default export of \"/Users/jairajmehra/Desktop/Redlitchee/web_qgis/src/app/map/[type]/page.tsx\" from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/Users/jairajmehra/Desktop/Redlitchee/web_qgis/src/app/map/[type]/page.tsx","default")},440:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>n});var s=r(8077);let n=async e=>[{type:"image/x-icon",sizes:"16x16",url:(0,s.fillMetadataSegment)(".",await e.params,"favicon.ico")+""}]},1135:()=>{}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[638,619,953],()=>r(7506));module.exports=s})();