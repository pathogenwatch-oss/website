webpackJsonp([5],{717:function(e,a,i){"use strict";function t(e){return e&&e.__esModule?e:{default:e}}function n(e){return e.replace(/\[\[([^\]]+)\]\]/g,function(e,a){return"["+a+"](/documentation/"+a.replace(/ /g,"-")+")"})}Object.defineProperty(a,"__esModule",{value:!0}),i(1422);var s=i(1),o=t(s),r=i(338),g=t(r),w=i(70),p=i(38),c="https://wgsa.net/api",l={Link:function(e){var a=e.href,i=e.title,t=void 0===i?"":i,n=e.children;return 0===a.indexOf("/")?o.default.createElement(w.Link,{to:a},n):o.default.createElement("a",{href:a.replace(c,p.API_ROOT),title:t},n)}};a.default=function(e){var a=e.page,i=e.markdown;return o.default.createElement("div",{className:"wgsa-wiki-page"},a?o.default.createElement("div",{className:"wgsa-wiki-breadcrumb wgsa-content-margin"},o.default.createElement(w.Link,{to:"/documentation"},"Documentation Home")," » ",a):null,o.default.createElement(g.default,{className:"wgsa-content-margin",source:n(i),renderers:l}))}},806:function(e,a,i){a=e.exports=i(2)(),a.push([e.id,".wgsa-wiki-page{max-width:1000px;margin:auto}.wgsa-wiki-breadcrumb{font-size:13px;margin-top:16px}.wgsa-wiki-page a{color:#673c90}.wgsa-wiki-page h1,.wgsa-wiki-page h2,.wgsa-wiki-page h3,.wgsa-wiki-page h4,.wgsa-wiki-page h5,.wgsa-wiki-page h6{color:#673c90;font-family:Roboto Condensed,Helvetica,Arial,sans-serif;font-weight:400}.wgsa-wiki-page h1{font-size:32px}.wgsa-wiki-page h2{font-size:28px}.wgsa-wiki-page h3{font-size:24px}.wgsa-wiki-page h4{font-size:20px}.wgsa-wiki-page h5{font-size:18px}.wgsa-wiki-page h6{font-size:16px}.wgsa-wiki-page blockquote p{display:inline-block}",""])},1422:[1612,806]});