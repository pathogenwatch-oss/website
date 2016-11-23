webpackJsonp([3],{173:function(e,t,a){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var n=a(1),l=r(n);t.default=l.default.createClass({displayName:"Progress Bar",propTypes:{className:l.default.PropTypes.string,progress:l.default.PropTypes.number,indeterminate:l.default.PropTypes.bool,label:l.default.PropTypes.string},componentDidMount:function(){var e=this,t=this.refs.progressBar;t.addEventListener("mdl-componentupgraded",function(t){e.progressBar=t.target.MaterialProgress,e.setProgress()}),componentHandler.upgradeElement(t)},componentDidUpdate:function(){this.setProgress()},setProgress:function(){"progress"in this.props&&this.progressBar.setProgress(this.props.progress)},render:function(){var e=this.props,t=e.className,a=e.indeterminate,r=e.label,n=(t+" mdl-progress mdl-js-progress "+(a?"mdl-progress__indeterminate":"")).trim();return l.default.createElement("div",{className:"wgsa-progress-bar"},r?l.default.createElement("label",{className:"wgsa-progress-bar__label"},r):null,l.default.createElement("div",{ref:"progressBar",className:n}))}})},174:function(e,t,a){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,a(267);var n=a(173),l=r(n);t.default=l.default},188:function(e,t,a){t=e.exports=a(2)(),t.push([e.id,".wgsa-progress-bar{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center}.wgsa-progress-bar__label{padding-right:1em}.mdl-progress{width:100%;background-color:rgba(0,0,0,.14)}.mdl-progress>.progressbar{background:#673c90!important}.mdl-progress>.bufferbar,.mdl-progress__indeterminate>.auxbar{background:transparent!important}",""])},267:[1373,188],551:function(e,t,a){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0}),a(1281);var n=a(1),l=r(n),i=a(21),o={position:"fixed",zIndex:-1,opacity:0};t.default=l.default.createClass({displayName:"DragAndDrop",propTypes:{onFiles:l.default.PropTypes.func.isRequired,noAddButton:l.default.PropTypes.bool},getInitialState:function(){return{indicatorVisible:!1}},componentWillMount:function(){this.props.noAddButton&&(this.style.cursor="pointer")},style:{},handleFiles:function(e){this.props.onFiles(Array.from(e))},handleDrop:function(e){e.stopPropagation(),e.preventDefault(),this.setState({indicatorVisible:!1}),e.dataTransfer&&e.dataTransfer.files.length>0&&this.handleFiles(e.dataTransfer.files)},showDropIndicator:function(e){e.stopPropagation(),e.preventDefault(),this.setState({indicatorVisible:!0})},hideDropIndicator:function(e){e.stopPropagation(),e.preventDefault(),this.setState({indicatorVisible:!1})},handleClick:function(){this.refs.fileInput.click()},handleFileInputChange:function(e){var t=e.target.files;t&&t.length>0&&(this.handleFiles(t),e.target.value=null)},render:function(){return l.default.createElement("div",{className:"wgsa-drag-and-drop "+(this.state.indicatorVisible?"is-dragover":""),onDragOver:this.showDropIndicator,onDrop:this.handleDrop,style:this.style,onClick:this.props.noAddButton?this.handleClick:function(){}},l.default.createElement("div",{className:"wgsa-drop-indicator wgsa-overlay "+(this.state.indicatorVisible?"wgsa-overlay--is-visible":""),onDragLeave:this.hideDropIndicator},l.default.createElement("div",{className:"wgsa-drop-indicator__message"},l.default.createElement("div",{className:"wgsa-drop-indicator__icons"},l.default.createElement("span",{className:"wgsa-file-icon"},l.default.createElement("i",{className:"material-icons",style:{color:i.CGPS.COLOURS.PURPLE}},"insert_drive_file"),l.default.createElement("span",{className:"wgsa-file-icon__label"},".fasta")),l.default.createElement("span",{className:"wgsa-file-icon"},l.default.createElement("i",{className:"material-icons",style:{color:i.CGPS.COLOURS.GREEN}},"insert_drive_file"),l.default.createElement("span",{className:"wgsa-file-icon__label"},".csv"))),l.default.createElement("h3",{className:"wgsa-drop-indicator__title"},"Drop to add to WGSA"))),this.props.children,this.props.noAddButton?null:l.default.createElement("button",{className:"mdl-button mdl-js-button mdl-button--fab wgsa-drag-and-drop__button mdl-shadow--3dp",title:"Add files",onClick:this.handleClick},l.default.createElement("i",{className:"material-icons"},"add")),l.default.createElement("input",{type:"file",multiple:"multiple",accept:i.DEFAULT.SUPPORTED_FILE_EXTENSIONS,ref:"fileInput",style:o,onChange:this.handleFileInputChange}))}})},556:function(e,t,a){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var n=a(1),l=r(n),i=a(557),o=r(i),s=a(185);t.default=function(e){var t=e.min,a=e.max,r=e.years,n=e.onChangeMin,i=e.onChangeMax;return r&&0!==r.length?l.default.createElement("section",{className:"wgsa-filter__section"},l.default.createElement("h3",null,"Min Date"),l.default.createElement("div",{className:"wgsa-date-filter"},l.default.createElement(o.default,{id:"minYear",label:"Year",options:r,className:"wgsa-date-filter__dropdown",selected:t.year,fullWidth:!0,onChange:function(e){return n({year:e,month:t.month})}}),l.default.createElement(o.default,{id:"minMonth",label:"Month",options:s.months,className:"wgsa-date-filter__dropdown",selected:t.month?s.months[t.month].text:"",fullWidth:!0,onChange:function(e){return n({year:t.year,month:e})}})),l.default.createElement("h3",null,"Max Date"),l.default.createElement("div",{className:"wgsa-date-filter"},l.default.createElement(o.default,{id:"maxYear",label:"Year",options:r,className:"wgsa-date-filter__dropdown",selected:a.year,fullWidth:!0,onChange:function(e){return i({year:e,month:a.month})}}),l.default.createElement(o.default,{id:"maxMonth",label:"Month",options:s.months,className:"wgsa-date-filter__dropdown",selected:a.month?s.months[a.month].text:"",fullWidth:!0,onChange:function(e){return i({year:a.year,month:e})}}))):null}},557:function(e,t,a){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},l=a(1),i=r(l),o=a(6),s=r(o);t.default=i.default.createClass({displayName:"Dropdown",propTypes:{id:i.default.PropTypes.string,label:i.default.PropTypes.string,className:i.default.PropTypes.string,placeholder:i.default.PropTypes.string,options:i.default.PropTypes.array,selected:i.default.PropTypes.oneOfType([i.default.PropTypes.string,i.default.PropTypes.number]),floatingLabel:i.default.PropTypes.bool,fullWidth:i.default.PropTypes.bool,fixHeight:i.default.PropTypes.bool,onChange:i.default.PropTypes.func},getDefaultProps:function(){return{className:"",placeholder:"",floatingLabel:!1,fullWidth:!1,fixHeight:!1}},componentDidUpdate:function(e){var t=this.props.selected;t!==e.selected&&this.upgradeElement()},onChange:function e(t){var e=this.props.onChange;e&&e(t)},upgradeElement:function(){var e=this.refs.textfield;e.attributes["data-upgraded"]&&(e.attributes.removeNamedItem("data-upgraded"),componentHandler.upgradeElement(e))},render:function(){var e=this,t=this.props,a=t.id,r=t.label,l=t.floatingLabel,o=t.fullWidth,d=t.fixHeight,u=(0,s.default)(this.props.className,"mdl-textfield","mdl-js-textfield","getmdl-select",{"mdl-textfield--floating-label":l,"getmdl-select__fullwidth":o,"getmdl-select__fix-height":d});return i.default.createElement("div",{ref:"textfield",className:u},i.default.createElement("input",{className:"mdl-textfield__input",value:this.props.selected,type:"text",id:a,readOnly:!0,tabIndex:"-1",placeholder:this.props.placeholder}),r?i.default.createElement("label",{className:"mdl-textfield__label",htmlFor:a},r):null,i.default.createElement("ul",{ref:"list",htmlFor:a,className:"mdl-menu mdl-menu--bottom-left mdl-js-menu"},this.props.options.map(function(t,a){var r="object"===("undefined"==typeof t?"undefined":n(t))?t:{},l=r.text,o=void 0===l?t:l,s=r.value,d=void 0===s?t:s;return i.default.createElement("li",{key:a,className:"mdl-menu__item",onClick:function(){return e.onChange(d.toString())}},o)})))}});var d=MaterialMenu.prototype.show;MaterialMenu.prototype.show=function(e){var t=this.forElement_.parentElement.getBoundingClientRect(),a=document.documentElement.clientHeight-t.bottom,r=Math.min(320,this.element_.offsetHeight);r>a?(this.container_.style.maxHeight="320px",this.container_.style.marginTop="-"+(r-a)+"px"):(this.container_.style.maxHeight=a+"px",this.container_.style.marginTop=""),this.container_.style.overflowY="auto",d.call(this,e)}},558:function(e,t,a){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,a(1287);var n=a(556),l=r(n);t.default=l.default},579:function(e,t,a){"use strict";function r(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a]);return t.default=e,t}function n(e){return e&&e.__esModule?e:{default:e}}function l(e){return{isActive:y.isActive(e,{stateKey:v.stateKey}),filterSummary:(0,_.getFilterSummary)(e,{stateKey:v.stateKey}),textValue:(0,_.getSearchText)(e)}}function i(e){return{clearFilter:function(){return e(y.clear(v.stateKey,v.filters))},updateFilter:function(t,a){return e(y.update(v.stateKey,t,a))}}}Object.defineProperty(t,"__esModule",{value:!0});var o=function(){function e(e,t){var a=[],r=!0,n=!1,l=void 0;try{for(var i,o=e[Symbol.iterator]();!(r=(i=o.next()).done)&&(a.push(i.value),!t||a.length!==t);r=!0);}catch(e){n=!0,l=e}finally{try{!r&&o.return&&o.return()}finally{if(n)throw l}}return a}return function(t,a){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,a);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),s=a(1),d=n(s),u=a(3),c=a(287),p=n(c),f=a(558),m=n(f),g=a(295),h=n(g),b=a(67),y=r(b),_=a(40),v=a(179),w=y.LocationListener,x=o(v.filters,5),E=x[0],N=x[1],P=x[2],M=x[3],T=x[4];t.default=(0,u.connect)(l,i)(function(e){var t=e.isActive,a=e.filterSummary,r=e.textValue,n=e.updateFilter,l=e.clearFilter;return d.default.createElement(p.default,{active:t,clear:l,textValue:r,textOnChange:function(e){return n(E,e.target.value?new RegExp(e.target.value,"i"):null)}},d.default.createElement(h.default,{title:"WGSA Species",summary:a.wgsaSpecies,onClick:function(e){return n(N,e)}}),d.default.createElement(h.default,{title:"Other Species",summary:a.otherSpecies,onClick:function(e){return n(N,e)}}),d.default.createElement(h.default,{title:"Country",summary:a.country,onClick:function(e){return n(P,e)}}),d.default.createElement(m.default,{min:a.date.min,max:a.date.max,years:a.date.years,onChangeMin:function(e){return n(M,e)},onChangeMax:function(e){return n(T,e)}}),d.default.createElement(w,{stateKey:v.stateKey,filters:v.filters}))})},580:function(e,t,a){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=a(179);Object.keys(n).forEach(function(e){"default"!==e&&"__esModule"!==e&&Object.defineProperty(t,e,{enumerable:!0,get:function(){return n[e]}})});var l=a(579),i=r(l);t.default=i.default},582:function(e,t,a){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var n=a(1),l=r(n),i=a(551),o=r(i),s=a(580),d=r(s),u=a(584),c=r(u),p=a(177),f=r(p),m=a(180),g=a(95),h=a(11);t.default=l.default.createClass({displayName:"Hub.react",propTypes:{hasFastas:l.default.PropTypes.bool,uploads:l.default.PropTypes.object,filterActive:l.default.PropTypes.bool,dispatch:l.default.PropTypes.func.isRequired},contextTypes:{router:l.default.PropTypes.object},componentWillMount:function(){this.toggleAside(this.props.hasFastas),document.title="WGSA | Upload"},componentDidUpdate:function(){var e=this.props,t=e.loading,a=e.collection;if(t&&componentHandler.upgradeElement(this.refs.loadingBar),a.id){var r=a.speciesId,n=a.id,l=h.taxIdMap.get(r),i="/"+l.nickname+"/collection/"+n,o=this.context.router;o.push(i)}},componentWillUnmount:function(){this.toggleAside(!1)},toggleAside:function(e){this.props.dispatch((0,g.toggleAside)(e))},upload:function(e){var t=this.props.dispatch;t((0,m.addFiles)(e)),this.toggleAside(!0)},render:function(){var e=this.props,t=e.hasFastas,a=e.hasVisibleFastas,r=e.loading;return l.default.createElement(o.default,{onFiles:this.upload},r&&l.default.createElement("div",{ref:"loadingBar",className:"mdl-progress mdl-js-progress mdl-progress__indeterminate"}),l.default.createElement("div",{className:"wgsa-hipster-style wgsa-filterable-view"},l.default.createElement(c.default,null),a?this.props.children:l.default.createElement("p",{className:"wgsa-filterable-content wgsa-hub-big-message"},t?"No matches.":"Drag and drop files to begin.")),l.default.createElement(d.default,null),l.default.createElement(f.default,null))}})},584:function(e,t,a){"use strict";function r(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a]);return t.default=e,t}function n(e){return e&&e.__esModule?e:{default:e}}function l(e){return{batchSize:m.getBatchSize(e),completedUploads:m.getNumCompletedUploads(e),visibleFastas:(0,g.getNumberOfVisibleFastas)(e),totalFastas:m.getTotalFastas(e)}}Object.defineProperty(t,"__esModule",{value:!0}),a(1297);var i=a(1),o=n(i),s=a(3),d=a(59),u=a(288),c=a(174),p=n(c),f=a(96),m=r(f),g=a(40),h=function(e){var t=e.location;return{location:t}},b=(0,s.connect)(h)(function(e){var t=e.icon,a=e.title,r=e.to;return o.default.createElement(d.Link,{to:r,className:"mdl-button mdl-button--icon wgsa-hub-view-switcher",activeClassName:"wgsa-hub-view-switcher--active",onlyActiveOnIndex:!0,title:a},o.default.createElement("i",{className:"material-icons"},t))}),y=o.default.createClass({displayName:"Summary",componentDidUpdate:function(){var e=this.props,t=e.completedUploads,a=e.batchSize;document.title=["WGSA","|",a?"("+t+"/"+a+")":"","Upload"].join(" ")},render:function(){var e=this.props,t=e.completedUploads,a=e.batchSize,r=e.visibleFastas,n=e.totalFastas;return o.default.createElement(u.Summary,{className:"wgsa-hub-summary"},a?o.default.createElement(p.default,{className:"wgsa-hub-upload-progress",progress:t/a*100,label:t+"/"+a}):o.default.createElement(u.Totals,{visible:r,total:n,itemType:"assemblies"}),o.default.createElement(b,{to:"/upload",title:"Grid view",icon:"view_module"}),o.default.createElement(b,{to:"/upload/map",title:"Map view",icon:"map"}),o.default.createElement(b,{to:"/upload/stats",title:"Stats view",icon:"multiline_chart"}))}});t.default=(0,s.connect)(l)(y)},640:function(e,t,a){t=e.exports=a(2)(),t.push([e.id,".wgsa-drag-and-drop{position:absolute;top:0;bottom:0;left:0;right:0}.wgsa-drop-indicator__message{position:relative;background:#673c90;background:#fff;color:#673c90;padding:32px 64px;border-radius:16px;box-shadow:0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12)}.wgsa-drop-indicator__icons{position:absolute;text-align:center;top:-48px;left:0;right:0}.wgsa-drag-and-drop__button{position:fixed;bottom:48px;bottom:3rem;right:48px;right:3rem;background:#673c90;color:#fff}.wgsa-drag-and-drop__button:hover{background:#a386bd}",""])},646:function(e,t,a){t=e.exports=a(2)(),t.push([e.id,".wgsa-date-filter{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between;margin-top:-20px}.wgsa-date-filter__dropdown:first-child{width:calc(40% - 8px)}.wgsa-date-filter__dropdown:last-child{width:calc(60% - 8px)}.wgsa-date-filter__dropdown>.mdl-menu__container:not(.is-visible){height:0!important}.wgsa-date-filter__dropdown>.mdl-menu__container.is-visible{box-shadow:0 1px 5px 0 rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.12);-webkit-transition-property:box-shadow;transition-property:box-shadow;-webkit-transition-delay:.15s;transition-delay:.15s;-webkit-transition-duration:.15s;transition-duration:.15s}.wgsa-date-filter__dropdown>input{cursor:pointer;padding-left:16px;box-sizing:border-box}",""])},657:function(e,t,a){t=e.exports=a(2)(),t.push([e.id,".wgsa-hub-summary>.wgsa-progress-bar{width:200px;width:12.5rem}.wgsa-hub-view-switcher{margin:0 2px;margin:0 .125rem;width:28px;height:28px;min-width:28px}.wgsa-hub-view-switcher:first-of-type{margin-left:18px;margin-left:1.125rem}.wgsa-hub-view-switcher--active{color:#a386bd;cursor:default}.wgsa-hub-view-switcher--active:active,.wgsa-hub-view-switcher--active:focus,.wgsa-hub-view-switcher--active:hover{background:none!important}.wgsa-hub-view-switcher>i{font-size:20px}",""])},1281:function(e,t,a){var r=a(640);"string"==typeof r&&(r=[[e.id,r,""]]);a(4)(r,{});r.locals&&(e.exports=r.locals)},1287:[1372,646],1297:function(e,t,a){var r=a(657);"string"==typeof r&&(r=[[e.id,r,""]]);a(4)(r,{});r.locals&&(e.exports=r.locals)}});