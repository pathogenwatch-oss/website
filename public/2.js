webpackJsonp([2],{170:function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.UPLOAD="UPLOAD",t.COLLECTION="COLLECTION"},442:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var s,l,u,c=n(15),p=r(c),f=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},d=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),h=n(1),y=r(h),m=n(145),g=r(m),v=n(6),b=r(v),T=n(14),w=r(T),P=n(32),x=r(P),O=n(12),_=n(256),k=r(_),E=n(443),A=r(E),C=n(444),S=r(C),j=(0,S.default)(s=(0,w.default)((u=l=function(e){function t(){var e,n,r,a;i(this,t);for(var s=arguments.length,l=Array(s),u=0;u<s;u++)l[u]=arguments[u];return n=r=o(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(l))),r.state={activeIndex:-1},a=n,o(r,a)}return a(t,e),d(t,[{key:"renderSymbolItem",value:function(e,t){var n=void 0;return n=y.default.isValidElement(e)?y.default.cloneElement(e,t):(0,p.default)(e)?e(t):y.default.createElement(A.default,f({},t,{type:e}))}},{key:"renderSymbols",value:function(){var e=this,t=this.props,n=t.points,r=t.shape,i=t.activeShape,o=t.activeIndex,a=t.animationBegin,s=t.animationDuration,l=t.isAnimationActive,u=t.animationEasing,c=t.animationId,p=(0,O.getPresentationAttributes)(this.props);return n.map(function(t,n){var d=f({key:"symbol-"+n},p,t);return y.default.createElement(x.default,f({className:"recharts-scatter-symbol"},(0,O.filterEventsOfChild)(e.props,t,n),{key:"symbol-"+n}),y.default.createElement(g.default,{from:{size:0},to:{size:d.size},duration:s,begin:a,isActive:l,key:c,easing:u},function(t){var a=t.size,s=f({},d,{size:a});return e.renderSymbolItem(o===n?i:r,s)}))})}},{key:"renderLine",value:function(){var e=this.props,t=e.points,n=e.line,r=e.lineType,i=e.lineJointType,o=(0,O.getPresentationAttributes)(this.props),a=(0,O.getPresentationAttributes)(n),s=void 0,l=void 0;"joint"===r&&(s=t.map(function(e){return{x:e.cx,y:e.cy}}));var u=f({},o,{fill:"none",stroke:o&&o.fill},a,{points:s});return l=y.default.isValidElement(n)?y.default.cloneElement(n,u):(0,p.default)(n)?n(u):y.default.createElement(k.default,f({},u,{type:i})),y.default.createElement(x.default,{className:"recharts-scatter-line",key:"recharts-scatter-line"},l)}},{key:"render",value:function(){var e=this.props,t=e.points,n=e.line,r=e.className;if(!t||!t.length)return null;var i=(0,b.default)("recharts-scatter",r);return y.default.createElement(x.default,{className:i},n&&this.renderLine(),y.default.createElement(x.default,{key:"recharts-scatter-symbols"},this.renderSymbols()))}}]),t}(h.Component),l.displayName="Scatter",l.propTypes=f({},O.PRESENTATION_ATTRIBUTES,{xAxisId:h.PropTypes.oneOfType([h.PropTypes.string,h.PropTypes.number]),yAxisId:h.PropTypes.oneOfType([h.PropTypes.string,h.PropTypes.number]),zAxisId:h.PropTypes.oneOfType([h.PropTypes.string,h.PropTypes.number]),line:h.PropTypes.oneOfType([h.PropTypes.bool,h.PropTypes.object,h.PropTypes.func,h.PropTypes.element]),lineType:h.PropTypes.oneOf(["fitting","joint"]),lineJointType:h.PropTypes.oneOfType([h.PropTypes.oneOf(["basis","basisClosed","basisOpen","linear","linearClosed","natural","monotoneX","monotoneY","monotone","step","stepBefore","stepAfter"]),h.PropTypes.func]),legendType:h.PropTypes.oneOf(["line","square","rect","circle","cross","diamond","square","star","triangle","wye"]),className:h.PropTypes.string,activeIndex:h.PropTypes.number,activeShape:h.PropTypes.oneOfType([h.PropTypes.object,h.PropTypes.func,h.PropTypes.element]),shape:h.PropTypes.oneOfType([h.PropTypes.oneOf(["circle","cross","diamond","square","star","triangle","wye"]),h.PropTypes.element,h.PropTypes.func]),points:h.PropTypes.arrayOf(h.PropTypes.shape({cx:h.PropTypes.number,cy:h.PropTypes.number,size:h.PropTypes.number,payload:h.PropTypes.shape({x:h.PropTypes.number,y:h.PropTypes.number,z:h.PropTypes.oneOfType([h.PropTypes.number,h.PropTypes.string])})})),onMouseEnter:h.PropTypes.func,onMouseLeave:h.PropTypes.func,onClick:h.PropTypes.func,isAnimationActive:h.PropTypes.bool,animationId:h.PropTypes.number,animationBegin:h.PropTypes.number,animationDuration:h.PropTypes.number,animationEasing:h.PropTypes.oneOf(["ease","ease-in","ease-out","ease-in-out","linear"])}),l.defaultProps={xAxisId:0,yAxisId:0,zAxisId:0,legendType:"circle",lineType:"joint",lineJointType:"linear",data:[],shape:"circle",isAnimationActive:!(0,O.isSsr)(),animationBegin:0,animationDuration:400,animationEasing:"linear"},s=u))||s)||s;t.default=j},508:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var i=n(1),o=r(i);t.default=function(e){var t=e.heading,n=e.description,r=e.value;return o.default.createElement("div",{className:"wgsa-chart-tooltip"},o.default.createElement("h3",{className:"wgsa-chart-tooltip__heading"},t),o.default.createElement("dl",null,o.default.createElement("dt",null,n),o.default.createElement("dd",null,r)))}},509:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,n(1268);var i=n(508),o=r(i);t.default=o.default},583:function(e,t,n){"use strict";function r(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}function i(e){return e&&e.__esModule?e:{default:e}}function o(e,t){return{onClick:function(){return e(j.default.showMetric(t.metric))}}}function a(e){return{average:A.getMetricAverage(e),range:A.getMetricRange(e),chartData:A.getSelectedChartData(e)}}function s(e){return{onPointClick:function(t){var n=t.name;return e((0,C.showAssemblyDetails)(n))}}}Object.defineProperty(t,"__esModule",{value:!0}),t.StatsView=void 0;var l=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},u=function(){function e(e,t){var n=[],r=!0,i=!1,o=void 0;try{for(var a,s=e[Symbol.iterator]();!(r=(a=s.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(e){i=!0,o=e}finally{try{!r&&s.return&&s.return()}finally{if(i)throw o}}return n}return function(t,n){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}();n(1296);var c=n(1),p=i(c),f=n(159),d=i(f),h=n(158),y=i(h),m=n(157),g=i(m),v=n(442),b=i(v),T=n(1144),w=i(T),P=n(1149),x=i(P),O=n(3),_=n(509),k=i(_),E=n(592),A=r(E),C=n(91),S=n(41),j=i(S),M=function(e){var t=u(e.payload,2),n=t[0],r=t[1],i=e.data;return p.default.createElement(k.default,{heading:i[n.value].name,description:"Assembly Length",value:r.value})},N=[{title:"Assembly Length",metric:"totalNumberOfNucleotidesInDnaStrings"},{title:"N50",metric:"contigN50"},{title:"No. Contigs",metric:"totalNumberOfContigs"},{title:"Non-ATCG",metric:"totalNumberOfNsInDnaStrings"},{title:"GC Content",metric:"gcContent"}],z=function(e,t){var n=A.getSelectedMetric(e);return{className:n===t.metric?"active":""}},I=(0,O.connect)(z,o)(function(e){var t=e.title,n=e.className,r=e.onClick;return p.default.createElement("button",{className:n,onClick:r},t)}),D=t.StatsView=function(e){var t=e.average,n=e.range,r=void 0===n?{}:n,i=e.chartData,o=e.onPointClick;return p.default.createElement("div",{className:"wgsa-hub-stats-view wgsa-content-margin-left"},p.default.createElement("div",{className:"wgsa-hub-stats-section"},p.default.createElement("h2",{className:"wgsa-hub-stats-heading wgsa-hub-stats-heading--large"},N.map(function(e){return p.default.createElement(I,l({key:e.metric},e))})),p.default.createElement(x.default,{height:320},p.default.createElement(w.default,{margin:{top:16,bottom:16,left:0,right:0},className:"wgsa-selectable-chart"},p.default.createElement(g.default,{dataKey:"key",name:"name",tickFormatter:function(){return null},domain:[-1,"dataMax + 1"]}),p.default.createElement(y.default,{dataKey:"value",name:"Assembly Length",tickLine:!1,domain:[0,Math.ceil(1.25*r.max)]}),p.default.createElement(b.default,{data:i,fill:"#a386bd",isAnimationActive:!1,className:"wgsa-clickable-point",onClick:o}),p.default.createElement(d.default,{cursor:{stroke:"none"},offset:8,content:p.default.createElement(M,{data:i})})))),p.default.createElement("dl",{className:"wgsa-hub-stats-section wgsa-hub-stats-section--small"},p.default.createElement("dt",{className:"wgsa-hub-stats-heading"},"Average"),p.default.createElement("dd",{className:"wgsa-hub-stats-value wgsa-hub-stats-value--large"},t)),p.default.createElement("dl",{className:"wgsa-hub-stats-section wgsa-hub-stats-section--small"},p.default.createElement("dt",{className:"wgsa-hub-stats-heading"},"Range"),p.default.createElement("dd",{className:"wgsa-hub-stats-value wgsa-hub-stats-value--large"},r.min+" - "+r.max)))};t.default=(0,O.connect)(a,s)(D)},586:function(e,t,n){"use strict";function r(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}function i(e){return e&&e.__esModule?e:{default:e}}function o(e){return{markers:(0,y.getMarkers)(e),lassoPath:(0,y.getLassoPath)(e)}}function a(e){return{onLassoPathChange:function(t){return e(d.update(m.UPLOAD,{key:"area"},t))},onMarkerClick:function(t){var n=t.id;return e((0,h.showAssemblyDetails)(n))}}}Object.defineProperty(t,"__esModule",{value:!0});var s=n(1),l=i(s),u=n(3),c=n(119),p=i(c),f=n(67),d=r(f),h=n(91),y=n(588),m=n(170),g=function(e){var t=e.lassoPath,n=e.markers,r=e.onLassoPathChange,i=e.onMarkerClick;return l.default.createElement(p.default,{className:"wgsa-collection-viewer-map",cluster:!0,lassoPath:t,markers:n,onLassoPathChange:r,onMarkerClick:i,stateKey:m.UPLOAD})};t.default=(0,u.connect)(o,a)(g)},587:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,n(1298);var i=n(586),o=r(i);t.default=o.default},588:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getMarkers=t.getLassoPath=void 0;var r=n(20),i=n(40);t.getLassoPath=(0,r.createSelector)(i.getFilter,function(e){var t=e.area;return t}),t.getMarkers=(0,r.createSelector)(i.getVisibleFastas,function(e){return e.reduce(function(e,t){var n=t.name,r=t.metadata,i=void 0===r?{}:r;return i.latitude&&i.longitude&&e.push({position:[i.latitude,i.longitude],title:n,id:n}),e},[])})},592:function(e,t,n){"use strict";function r(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}Object.defineProperty(t,"__esModule",{value:!0}),t.getSelectedChartData=t.getMetricRange=t.getMetricAverage=t.getAssemblyMetrics=t.getSelectedMetric=void 0;var i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},o=n(20),a=n(40),s=t.getSelectedMetric=function(e){var t=e.hub;return t.selectedMetric},l=t.getAssemblyMetrics=(0,o.createSelector)(a.getVisibleFastas,function(e){return e.reduce(function(e,t){var n=t.name,o=t.metrics;return o?[].concat(r(e),[i({name:n},o)]):e},[])});t.getMetricAverage=(0,o.createSelector)(l,s,function(e,t){return(e.reduce(function(e,n){return e+Number(n[t])},0)/(e.length||1)).toFixed(0)}),t.getMetricRange=(0,o.createSelector)(l,s,function(e,t){return e.reduce(function(e,n){var r=e.min,i=e.max;return{min:r?Math.min(r,n[t]):n[t],max:i?Math.max(i,n[t]):n[t]}},{min:0,max:0})}),t.getSelectedChartData=(0,o.createSelector)(l,s,function(e,t){return e.map(function(e,n){return{key:n,name:e.name,value:Number(e[t])}})})},626:function(e,t,n){t=e.exports=n(2)(),t.push([e.id,".wgsa-chart-tooltip{background:hsla(0,0%,100%,.87);padding:8px}.wgsa-chart-tooltip__heading{font-size:16px;font-size:1rem;line-height:1;font-weight:500;margin:0 0 4px;color:#673c90}.wgsa-chart-tooltip dl{margin:0;font-size:16px;font-size:1rem}.wgsa-chart-tooltip dt{display:none}.wgsa-chart-tooltip dd{margin:0}",""])},656:function(e,t,n){t=e.exports=n(2)(),t.push([e.id,".wgsa-hub-stats-view{-webkit-box-flex:1;-ms-flex-positive:1;flex-grow:1;padding-right:56px;padding-right:3.5rem;overflow-x:hidden;overflow-y:auto}.wgsa-hub-stats-section{float:left;margin:0;width:100%;box-sizing:border-box;padding-right:24px}.wgsa-hub-stats-section--small{width:50%}.wgsa-hub-stats-heading{font-family:Roboto Condensed,Helvetica,Arial,sans-serif;font-size:14px;line-height:1.5;margin:0 0 16px;padding-top:6px;color:#673c90;font-weight:400;border-top:1px solid #673c90}.wgsa-hub-stats-heading--large{padding-top:8px;font-size:20px;font-size:1.25rem;line-height:1.5}.wgsa-hub-stats-heading>button{background:none;border:none;color:rgba(0,0,0,.54);font-family:Roboto Condensed,Helvetica,Arial,sans-serif;font-size:inherit;line-height:inherit;margin-right:24px;outline:none;padding:0}.wgsa-hub-stats-heading>button.active,.wgsa-hub-stats-heading>button:active,.wgsa-hub-stats-heading>button:focus,.wgsa-hub-stats-heading>button:hover{color:#673c90}.wgsa-hub-stats-value{color:rgba(0,0,0,.87);line-height:1.1;margin:0;text-align:center}.wgsa-hub-stats-value--large{color:rgba(0,0,0,.54);font-size:64px;font-size:4rem;font-weight:100}.is-small-screen .wgsa-hub-stats-value--large{font-size:32px;font-size:2rem;color:rgba(0,0,0,.87)}.wgsa-clickable-point{cursor:pointer}",""])},658:function(e,t,n){t=e.exports=n(2)(),t.push([e.id,".wgsa-hub-map-view .leaflet-marker-icon{color:#673c90;font-size:40px}",""])},976:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var s=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},l=function(){function e(e,t){var n=[],r=!0,i=!1,o=void 0;try{for(var a,s=e[Symbol.iterator]();!(r=(a=s.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(e){i=!0,o=e}finally{try{!r&&s.return&&s.return()}finally{if(i)throw o}}return n}return function(t,n){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),c=n(1),p=r(c),f=n(977),d=function(e){function t(){i(this,t);var e=o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return e.state={expandChildHeight:0,expandChildWidth:0,expandScrollLeft:0,expandScrollTop:0,shrinkScrollTop:0,shrinkScrollLeft:0,lastWidth:0,lastHeight:0},e.reset=e.reset.bind(e),e.handleScroll=e.handleScroll.bind(e),e}return a(t,e),u(t,[{key:"componentWillMount",value:function(){this.forceUpdate()}},{key:"componentDidMount",value:function(){var e=this.containerSize(),t=l(e,2),n=t[0],r=t[1];this.reset(n,r)}},{key:"shouldComponentUpdate",value:function(e){return this.props!==e}},{key:"componentDidUpdate",value:function(){this.expand.scrollLeft=this.expand.scrollWidth,this.expand.scrollTop=this.expand.scrollHeight,this.shrink.scrollLeft=this.shrink.scrollWidth,this.shrink.scrollTop=this.shrink.scrollHeight}},{key:"containerSize",value:function(){return[this.props.handleWidth&&this.container.parentElement.offsetWidth,this.props.handleHeight&&this.container.parentElement.offsetHeight]}},{key:"reset",value:function(e,t){if("undefined"!=typeof window){var n=this.container.parentElement,r="static";n.currentStyle?r=n.currentStyle.position:window.getComputedStyle&&(r=window.getComputedStyle(n).position),"static"===r&&(n.style.position="relative"),this.setState({expandChildHeight:this.expand.offsetHeight+10,expandChildWidth:this.expand.offsetWidth+10,lastWidth:e,lastHeight:t})}}},{key:"handleScroll",value:function(){if("undefined"!=typeof window){var e=this.state,t=this.containerSize(),n=l(t,2),r=n[0],i=n[1];r===e.lastWidth&&i===e.lastHeight||this.props.onResize(r,i),this.reset(r,i)}}},{key:"render",value:function(){var e=this,t=this.state,n=s({},f.expandChildStyle,{width:t.expandChildWidth,height:t.expandChildHeight});return p.default.createElement("div",{style:f.parentStyle,ref:function(t){e.container=t}},p.default.createElement("div",{style:f.parentStyle,onScroll:this.handleScroll,ref:function(t){e.expand=t}},p.default.createElement("div",{style:n})),p.default.createElement("div",{style:f.parentStyle,onScroll:this.handleScroll,ref:function(t){e.shrink=t}},p.default.createElement("div",{style:f.shrinkChildStyle})))}}]),t}(c.Component);t.default=d,d.propTypes={handleWidth:c.PropTypes.bool,handleHeight:c.PropTypes.bool,onResize:c.PropTypes.func},d.defaultProps={handleWidth:!1,handleHeight:!1,onResize:function(e){return e}}},977:function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.parentStyle={position:"absolute",left:0,top:0,right:0,bottom:0,overflow:"scroll",zIndex:-1,visibility:"hidden"},t.shrinkChildStyle={position:"absolute",left:0,top:0,width:"200%",height:"200%"},t.expandChildStyle={position:"absolute",left:0,top:0,width:"100%",height:"100%"}},978:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var i=n(976),o=r(i);t.default=o.default},1142:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var s,l,u,c=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),p=n(1),f=n(14),d=r(f),h=(0,d.default)((u=l=function(e){function t(){return i(this,t),o(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return a(t,e),c(t,[{key:"render",value:function(){return null}}]),t}(p.Component),l.displayName="ZAxis",l.propTypes={name:p.PropTypes.oneOfType([p.PropTypes.string,p.PropTypes.number]),unit:p.PropTypes.oneOfType([p.PropTypes.string,p.PropTypes.number]),zAxisId:p.PropTypes.oneOfType([p.PropTypes.string,p.PropTypes.number]),dataKey:p.PropTypes.oneOfType([p.PropTypes.string,p.PropTypes.number]),range:p.PropTypes.arrayOf(p.PropTypes.number),scale:p.PropTypes.oneOfType([p.PropTypes.oneOf(["auto","linear","pow","sqrt","log","identity","time","band","point","ordinal","quantile","quantize","utcTime","sequential","threshold"]),p.PropTypes.func])},l.defaultProps={zAxisId:0,range:[64,64],scale:"auto"},s=u))||s;t.default=h},1144:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function i(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var l,u,c,p=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},f=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),d=n(1),h=r(d),y=n(6),m=r(y),g=n(255),v=r(g),b=n(32),T=r(b),w=n(1146),P=r(w),x=n(254),O=r(x),_=n(159),k=r(_),E=n(1150),A=r(E),C=n(439),S=r(C),j=n(440),M=r(j),N=n(442),z=r(N),I=n(157),D=r(I),R=n(158),W=r(R),L=n(1142),H=r(L),B=n(156),K=r(B),F=n(253),U=r(F),q=n(252),G=r(q),V=n(12),J=n(14),Z=r(J),X=n(19),Y=n(259),Q=n(258),$=(0,Z.default)((c=u=function(e){function t(){var e,n,r,i;o(this,t);for(var s=arguments.length,l=Array(s),u=0;u<s;u++)l[u]=arguments[u];return n=r=a(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(l))),r.state={activeTooltipCoord:{x:0,y:0},isTooltipActive:!1,activeItem:null},r.handleScatterMouseEnter=function(e){r.setState({isTooltipActive:!0,activeItem:e,activeTooltipCoord:{x:e.cx,y:e.cy}})},r.handleScatterMouseLeave=function(){r.setState({isTooltipActive:!1})},i=n,a(r,i)}return s(t,e),f(t,[{key:"getComposedData",value:function(e,t,n,r,i){var o=e.props.children,a=n.dataKey,s=r.dataKey,l=i.dataKey,u=(0,V.findAllByType)(o,P.default);return t.map(function(e,t){return p({},e,{cx:(0,X.isNumber)(e[a])?n.scale(e[a]):null,cy:(0,X.isNumber)(e[s])?r.scale(e[s]):null,size:void 0!==l&&(0,X.isNumber)(e[l])?i.scale(e[l]):i.range[0],payload:{x:e[a],y:e[s],z:void 0!==l&&e[l]||"-"}},u&&u[t]&&u[t].props)})}},{key:"getDomain",value:function(e,t,n,r){var i=e.reduce(function(e,n){return e.concat(n.props.data.map(function(e){return e[t]}))},[]);return"xAxis"!==r&&"yAxis"!==r||(i=(0,Q.detectReferenceElementsDomain)(this.props.children,i,n,r)),[Math.min.apply(null,i),Math.max.apply(null,i)]}},{key:"getAxis",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"xAxis",t=arguments[1],n=this.props.children,r="xAxis"===e?D.default:W.default,i=(0,V.findChildByType)(n,r);if((0,Y.warn)(i,"recharts: ScatterChart must has %s",r.displayName),i){var o=(0,X.parseSpecifiedDomain)(i.props.domain,this.getDomain(t,i.props.dataKey,i.props[e+"Id"],e),i.props.allowDataOverflow);return p({},i.props,{axisType:e,domain:o,type:"number",originalDomain:i.props.domain})}return null}},{key:"getZAxis",value:function(e){var t=this.props.children,n=(0,V.findChildByType)(t,H.default),r=n&&n.props||H.default.defaultProps,i=r.dataKey?this.getDomain(e,r.dataKey):[-1,1];return p({},r,{domain:i,scale:(0,X.parseScale)(r).domain(i).range(r.range)})}},{key:"getOffset",value:function(e,t,n){var r=this.props,i=r.width,o=r.height,a=r.margin,s={left:a.left||0,right:a.right||0,top:a.top||0,bottom:a.bottom||0};return s[t.orientation]+=t.height,s[n.orientation]+=n.width,s=(0,Q.appendOffsetOfLegend)(s,e,this.props),p({},s,{width:i-s.left-s.right,height:o-s.top-s.bottom})}},{key:"getFormatAxis",value:function(e,t,n){var r=e.orientation,i=e.domain,o=e.tickFormat,a=e.padding,s=void 0===a?{}:a,l="xAxis"===n?[t.left+(s.left||0),t.left+t.width-(s.right||0)]:[t.top+t.height-(s.bottom||0),t.top+(s.top||0)],u=(0,X.parseScale)(e).domain(i).range(l),c=(0,Q.getTicksOfScale)(u,e);o&&u.tickFormat(o);var f=void 0,d=void 0;return"xAxis"===n?(f=t.left,d="top"===r?t.top-e.height:t.top+t.height):(f="left"===r?t.left-e.width:t.right,d=t.top),p({},e,c,{scale:u,width:"xAxis"===n?t.width:e.width,height:"yAxis"===n?t.height:e.height,x:f,y:d})}},{key:"getTooltipContent",value:function(e,t,n,r){if(!e)return null;var i=[{name:t.name||t.dataKey,unit:t.unit||"",value:e.x},{name:n.name||n.dataKey,unit:n.unit||"",value:e.y}];return e.z&&"-"!==e.z&&i.push({name:r.name||r.dataKey,unit:r.unit||"",value:e.z}),i}},{key:"renderTooltip",value:function(e,t,n,r,i){var o=this.props.children,a=(0,V.findChildByType)(o,k.default);if(!a||!a.props.cursor||!this.state.isTooltipActive)return null;var s=this.state,l=s.isTooltipActive,u=s.activeItem,c=s.activeTooltipCoord,p={x:i.left,y:i.top,width:i.width,height:i.height};return h.default.cloneElement(a,{viewBox:p,active:l,label:"",payload:this.getTooltipContent(u&&u.payload,t,n,r),coordinate:c})}},{key:"renderGrid",value:function(e,t,n){var r=this.props,i=r.children,o=r.width,a=r.height,s=(0,V.findChildByType)(i,M.default);if(!s)return null;var l=(0,Q.getCoordinatesOfGrid)(S.default.getTicks(p({},S.default.defaultProps,e,{ticks:(0,Q.getTicksOfAxis)(e,!0),viewBox:{x:0,y:0,width:o,height:a}})),n.left,n.left+n.width),u=(0,Q.getCoordinatesOfGrid)(S.default.getTicks(p({},S.default.defaultProps,t,{ticks:(0,Q.getTicksOfAxis)(t,!0),viewBox:{x:0,y:0,width:o,height:a}})),n.top,n.top+n.height);return h.default.cloneElement(s,{key:"grid",x:n.left,y:n.top,width:n.width,height:n.height,verticalPoints:l,horizontalPoints:u})}},{key:"renderLegend",value:function(e){var t=this.props,n=t.children,r=t.width,i=t.height,o=t.margin,a=r-(o.left||0)-(o.right||0),s=i-(o.top||0)-(o.bottom||0),l=(0,Q.getLegendProps)(n,e,a,s);return l?h.default.createElement(O.default,p({},l,{chartWidth:r,chartHeight:i,margin:o})):null}},{key:"renderAxis",value:function(e,t){var n=this.props,r=n.width,i=n.height;return e&&!e.hide?h.default.createElement(T.default,{key:t,className:t},h.default.createElement(S.default,p({},e,{viewBox:{x:0,y:0,width:r,height:i},ticks:(0,Q.getTicksOfAxis)(e,!0)}))):null}},{key:"renderCursor",value:function(e,t,n){var r=this.props.children,i=(0,V.findChildByType)(r,k.default);if(!i||!this.state.isTooltipActive)return null;var o=this.state.activeItem,a=p({stroke:"#ccc",strokeDasharray:"5 5"},(0,V.getPresentationAttributes)(i.props.cursor),n,{x:o.cx,y:o.cy,payload:o});return h.default.isValidElement(i.props.cursor)?h.default.cloneElement(i.props.cursor,a):h.default.createElement(A.default,a)}},{key:"renderItems",value:function(e,t,n,r){var i=this,o=this.state.activeGroupId;return e.map(function(e,a){var s=e.props,l=s.strokeWidth,u=s.data,c=l===+l?l:1;return c=o==="scatter-"+a?c+2:c,h.default.cloneElement(e,{key:"scatter-"+a,groupId:"scatter-"+a,strokeWidth:c,onMouseLeave:i.handleScatterMouseLeave,onMouseEnter:i.handleScatterMouseEnter,points:i.getComposedData(e,u,t,n,r)})},this)}},{key:"renderReferenceElements",value:function(e,t,n,r,i){var o=this.props.children,a=(0,V.findAllByType)(o,i);if(!a||!a.length)return null;var s=(0,V.getDisplayName)(i)+"-"+(r?"front":"back");return a.filter(function(e){return r===e.props.isFront}).map(function(r,i){return h.default.cloneElement(r,{key:s+"-"+i,xAxis:e,yAxis:t,viewBox:{x:n.left,y:n.top,width:n.width,height:n.height}})})}},{key:"render",value:function(){if(!(0,V.validateWidthHeight)(this))return null;var e=this.props,t=(e.style,e.children),n=e.className,r=e.width,o=e.height,a=i(e,["style","children","className","width","height"]),s=(0,V.findAllByType)(t,z.default),l=this.getZAxis(s),u=this.getAxis("xAxis",s),c=this.getAxis("yAxis",s),f=this.getOffset(s,u,c);u=this.getFormatAxis(u,f,"xAxis"),c=this.getFormatAxis(c,f,"yAxis");var d=(0,V.filterEventAttributes)(this.props),y=(0,V.getPresentationAttributes)(a);return h.default.createElement("div",p({className:(0,m.default)("recharts-wrapper",n),style:{position:"relative",cursor:"default",width:r,height:o}},d),h.default.createElement(v.default,p({},y,{width:r,height:o}),this.renderGrid(u,c,f),this.renderReferenceElements(u,c,f,!1,G.default),this.renderReferenceElements(u,c,f,!1,K.default),this.renderReferenceElements(u,c,f,!1,U.default),this.renderAxis(u,"recharts-x-axis"),this.renderAxis(c,"recharts-y-axis"),this.renderCursor(u,c,f),this.renderItems(s,u,c,l,f),this.renderReferenceElements(u,c,f,!0,G.default),this.renderReferenceElements(u,c,f,!0,K.default),this.renderReferenceElements(u,c,f,!0,U.default),(0,V.filterSvgElements)(t)),this.renderLegend(s),this.renderTooltip(s,u,c,l,f))}}]),t}(d.Component),u.displayName="ScatterChart",u.propTypes={width:d.PropTypes.number,height:d.PropTypes.number,margin:d.PropTypes.shape({top:d.PropTypes.number,right:d.PropTypes.number,bottom:d.PropTypes.number,left:d.PropTypes.number}),title:d.PropTypes.string,style:d.PropTypes.object,children:d.PropTypes.oneOfType([d.PropTypes.arrayOf(d.PropTypes.node),d.PropTypes.node]),className:d.PropTypes.string},u.defaultProps={style:{},margin:{top:5,right:5,bottom:5,left:5}},l=c))||l;t.default=$},1146:function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function o(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a,s,l=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(1),c=(s=a=function(e){function t(){return r(this,t),i(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return o(t,e),l(t,[{key:"render",value:function(){return null}}]),t}(u.Component),a.displayName="Cell",s);t.default=c},1149:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var s,l,u=n(1241),c=r(u),p=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),f=n(1),d=r(f),h=n(978),y=r(h),m=n(19),g=n(259),v=(l=s=function(e){
function t(e){i(this,t);var n=o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.updateDimensionsImmediate=function(){if(n.mounted){var e=n.getContainerSize();if(e){var t=n.state,r=t.containerWidth,i=t.containerHeight,o=e.containerWidth,a=e.containerHeight;o===r&&a===i||n.setState({containerWidth:o,containerHeight:a})}}},n.state={containerWidth:-1,containerHeight:-1},n.handleResize=e.debounce>0?(0,c.default)(n.updateDimensionsImmediate,e.debounce):n.updateDimensionsImmediate,n}return a(t,e),p(t,[{key:"componentDidMount",value:function(){this.mounted=!0;var e=this.getContainerSize();e&&this.setState(e)}},{key:"componentWillUnmount",value:function(){this.mounted=!1}},{key:"getContainerSize",value:function(){return this.container?{containerWidth:this.container.clientWidth,containerHeight:this.container.clientHeight}:null}},{key:"renderChart",value:function(){var e=this.state,t=e.containerWidth,n=e.containerHeight;if(t<0||n<0)return null;var r=this.props,i=r.aspect,o=r.width,a=r.height,s=r.minWidth,l=r.minHeight,u=r.children;(0,g.warn)((0,m.isPercent)(o)||(0,m.isPercent)(a),"The width(%s) and height(%s) are both fixed numbers,\n       maybe you don't need to use a ResponsiveContainer.",o,a),(0,g.warn)(!i||i>0,"The aspect(%s) must be greater than zero.",i);var c=(0,m.isPercent)(o)?t:o,p=(0,m.isPercent)(a)?n:a;return i&&i>0&&(p=c/i),(0,g.warn)(c>0&&p>0,"The width(%s) and height(%s) of chart should be greater than 0,\n       please check the style of container, or the props width(%s) and height(%s),\n       or add a minWidth(%s) or minHeight(%s) or use aspect(%s) to control the\n       height and width.",c,p,o,a,s,l,i),d.default.cloneElement(u,{width:c,height:p})}},{key:"render",value:function(){var e=this,t=this.props,n=t.minWidth,r=t.minHeight,i=t.width,o=t.height,a={width:i,height:o,minWidth:n,minHeight:r};return d.default.createElement("div",{className:"recharts-responsive-container",style:a,ref:function(t){e.container=t}},this.renderChart(),d.default.createElement(y.default,{handleWidth:!0,handleHeight:!0,onResize:this.handleResize}))}}]),t}(f.Component),s.displayName="ResponsiveContainer",s.propTypes={aspect:f.PropTypes.number,width:f.PropTypes.oneOfType([f.PropTypes.string,f.PropTypes.number]),height:f.PropTypes.oneOfType([f.PropTypes.string,f.PropTypes.number]),minHeight:f.PropTypes.number,minWidth:f.PropTypes.number,children:f.PropTypes.node.isRequired,debounce:f.PropTypes.number},s.defaultProps={width:"100%",height:"100%",debounce:0},l);t.default=v},1150:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var s,l,u,c=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},p=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),f=n(1),d=r(f),h=n(6),y=r(h),m=n(14),g=r(m),v=n(19),b=n(12),T=(0,g.default)((u=l=function(e){function t(){return i(this,t),o(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return a(t,e),p(t,[{key:"getPath",value:function(e,t,n,r,i,o){return"M"+e+","+i+"v"+r+"M"+o+","+t+"h"+n}},{key:"render",value:function(){var e=this.props,t=e.x,n=e.y,r=e.width,i=e.height,o=e.top,a=e.left,s=e.className;return(0,v.isNumber)(t)&&(0,v.isNumber)(n)&&(0,v.isNumber)(r)&&(0,v.isNumber)(i)&&(0,v.isNumber)(o)&&(0,v.isNumber)(a)?d.default.createElement("path",c({},(0,b.getPresentationAttributes)(this.props),{className:(0,y.default)("recharts-cross",s),d:this.getPath(t,n,r,i,o,a)})):null}}]),t}(f.Component),l.displayName="Cross",l.propTypes=c({},b.PRESENTATION_ATTRIBUTES,{x:f.PropTypes.number,y:f.PropTypes.number,width:f.PropTypes.number,height:f.PropTypes.number,top:f.PropTypes.number,left:f.PropTypes.number,className:f.PropTypes.string}),l.defaultProps={x:0,y:0,top:0,left:0,width:0,height:0},s=u))||s;t.default=T},1241:function(e,t,n){function r(e,t,n){function r(t){var n=v,r=b;return v=b=void 0,O=t,w=e.apply(r,n)}function c(e){return O=e,P=setTimeout(d,t),_?r(e):w}function p(e){var n=e-x,r=e-O,i=t-n;return k?u(i,T-r):i}function f(e){var n=e-x,r=e-O;return void 0===x||n>=t||n<0||k&&r>=T}function d(){var e=o();return f(e)?h(e):void(P=setTimeout(d,p(e)))}function h(e){return P=void 0,E&&v?r(e):(v=b=void 0,w)}function y(){void 0!==P&&clearTimeout(P),O=0,v=x=b=P=void 0}function m(){return void 0===P?w:h(o())}function g(){var e=o(),n=f(e);if(v=arguments,b=this,x=e,n){if(void 0===P)return c(x);if(k)return P=setTimeout(d,t),r(x)}return void 0===P&&(P=setTimeout(d,t)),w}var v,b,T,w,P,x,O=0,_=!1,k=!1,E=!0;if("function"!=typeof e)throw new TypeError(s);return t=a(t)||0,i(n)&&(_=!!n.leading,k="maxWait"in n,T=k?l(a(n.maxWait)||0,t):T,E="trailing"in n?!!n.trailing:E),g.cancel=y,g.flush=m,g}var i=n(47),o=n(1246),a=n(467),s="Expected a function",l=Math.max,u=Math.min;e.exports=r},1246:function(e,t,n){var r=n(33),i=function(){return r.Date.now()};e.exports=i},1268:[1372,626],1296:function(e,t,n){var r=n(656);"string"==typeof r&&(r=[[e.id,r,""]]);n(4)(r,{});r.locals&&(e.exports=r.locals)},1298:[1373,658]});