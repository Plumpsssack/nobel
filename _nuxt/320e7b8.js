(window.webpackJsonp=window.webpackJsonp||[]).push([[7,8],{193:function(t,e,n){var content=n(200);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(46).default)("0e787836",content,!0,{sourceMap:!1})},199:function(t,e,n){"use strict";n(193)},200:function(t,e,n){var r=n(45)((function(i){return i[1]}));r.push([t.i,"/*purgecss start ignore*/\n.btn[data-v-513beefc]{\n  margin-left:0.25rem;\n  margin-right:0.25rem;\n  border-radius:0.25rem;\n  padding-left:1rem;\n  padding-right:1rem;\n  padding-top:0.5rem;\n  padding-bottom:0.5rem;\n  font-weight:700\n}\n.btn-success[data-v-513beefc]{\n  background-color:#fffcf7ff;\n  color:#fffcf7ff\n}\n.btn-primary[data-v-513beefc]{\n  --tw-bg-opacity:1;\n  background-color:rgba(237, 131, 47, var(--tw-bg-opacity));\n  color:#fffcf7ff\n}\n\n/*purgecss end ignore*/",""]),r.locals={},t.exports=r},204:function(t,e,n){"use strict";n.r(e);n(30),n(22),n(18),n(31);var r=n(2);n(39),n(196),n(195),n(28),n(11),n(29),n(23);function o(t,e){var n="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!n){if(Array.isArray(t)||(n=function(t,e){if(!t)return;if("string"==typeof t)return c(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return c(t,e)}(t))||e&&t&&"number"==typeof t.length){n&&(t=n);var i=0,r=function(){};return{s:r,n:function(){return i>=t.length?{done:!0}:{done:!1,value:t[i++]}},e:function(t){throw t},f:r}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,f=!0,l=!1;return{s:function(){n=n.call(t)},n:function(){var t=n.next();return f=t.done,t},e:function(t){l=!0,o=t},f:function(){try{f||null==n.return||n.return()}finally{if(l)throw o}}}}function c(t,e){(null==e||e>t.length)&&(e=t.length);for(var i=0,n=new Array(e);i<e;i++)n[i]=t[i];return n}var f={props:{steps:{type:Array,default:function(){return[]}},patternLength:Number},data:function(){return{audioContext:null,tempo:21.5,sampleDir:"samples",sampleBufferMap:new Map,lookahead:25,scheduleAheadTime:.1,nextNoteTime:0,currentNote:0,notesCount:8,notesInQueue:[],isPlaying:!1,timerId:null}},created:function(){this.audioContext=new(window.AudioContext||window.webkitAudioContext)},methods:{playSample:function(t){var e=this.sampleBufferMap.get(t);if(e){var source=this.audioContext.createBufferSource();source.buffer=e,source.connect(this.audioContext.destination),source.start(this.nextNoteTime)}return e},nextNote:function(){var t=60/this.tempo;this.nextNoteTime+=t,this.$emit("nextNote",this.currentNote),this.currentNote++,this.currentNote==this.notesCount&&(this.currentNote=0)},scheduleNote:function(){var t,e=this,n=[],r=o(this.steps);try{for(r.s();!(t=r.n()).done;){var c=t.value.tracks.filter((function(t){return t.start<=e.currentNote&&t.start+t.length>e.currentNote}))[0];c&&n.push(c)}}catch(t){r.e(t)}finally{r.f()}for(var f=0,l=n;f<l.length;f++){var track=l[f];this.playSample(track.src)}},scheduler:function(){for(;this.nextNoteTime<this.audioContext.currentTime+this.scheduleAheadTime;)this.scheduleNote(),this.nextNote();this.timerId=setTimeout(this.scheduler,this.lookahead)},onTogglePlayClick:function(){this.isPlaying=!this.isPlaying,this.isPlaying?("suspended"===this.audioContext.state&&this.audioContext.resume(),this.currentNote=0,this.nextNoteTime=this.audioContext.currentTime,this.scheduler()):(this.$emit("nextNote",0),clearTimeout(this.timerId))},getBuffer:function(t){var e=this;return Object(r.a)(regeneratorRuntime.mark((function n(){return regeneratorRuntime.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,new Promise((function(n){fetch(e.sampleDir+"/"+t).then((function(t){return t.arrayBuffer()})).then((function(t){return n(e.audioContext.decodeAudioData(t))}))}));case 2:return n.abrupt("return",n.sent);case 3:case"end":return n.stop()}}),n)})))()}},watch:{steps:{handler:function(t){var e=this;return Object(r.a)(regeneratorRuntime.mark((function n(){var r,c,f,l,d,track,h;return regeneratorRuntime.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:r=o(t),n.prev=1,r.s();case 3:if((c=r.n()).done){n.next=27;break}f=c.value,l=o(f.tracks),n.prev=6,l.s();case 8:if((d=l.n()).done){n.next=17;break}if(track=d.value,e.sampleBufferMap.has(track.src)){n.next=15;break}return n.next=13,e.getBuffer(track.src);case 13:h=n.sent,e.sampleBufferMap.set(track.src,h);case 15:n.next=8;break;case 17:n.next=22;break;case 19:n.prev=19,n.t0=n.catch(6),l.e(n.t0);case 22:return n.prev=22,l.f(),n.finish(22);case 25:n.next=3;break;case 27:n.next=32;break;case 29:n.prev=29,n.t1=n.catch(1),r.e(n.t1);case 32:return n.prev=32,r.f(),n.finish(32);case 35:case"end":return n.stop()}}),n,null,[[1,29,32,35],[6,19,22,25]])})))()},deep:!0,immediate:!0},patternLength:function(t){this.notesCount=t}}},l=(n(199),n(6)),component=Object(l.a)(f,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"flex mb-3"},[n("button",{staticClass:"btn btn-primary",on:{click:t.onTogglePlayClick}},[t._v("\n    "+t._s(t.isPlaying?"Stop":"Play")+"\n  ")]),t._v(" "),n("div",{staticClass:"items-center"},[n("label",{staticClass:"font-bold"},[t._v("Pattern Anzahl:")]),t._v(" "),n("input",{directives:[{name:"model",rawName:"v-model",value:t.notesCount,expression:"notesCount"}],staticClass:"border rounded",attrs:{min:"1",type:"number"},domProps:{value:t.notesCount},on:{input:[function(e){e.target.composing||(t.notesCount=e.target.value)},function(e){t.$emit("patternLengthChange",parseInt(t.notesCount))}]}})])])}),[],!1,null,"513beefc",null);e.default=component.exports},208:function(t,e,n){"use strict";n.r(e);var r={components:{PatternMatrix:n(209).default}},o=n(6),component=Object(o.a)(r,(function(){var t=this.$createElement,e=this._self._c||t;return e("div",[e("pattern-matrix")],1)}),[],!1,null,null,null);e.default=component.exports},209:function(t,e,n){"use strict";n.r(e);var r=n(24),o=(n(23),n(194),n(38),n(40),n(18),n(56),n(57),n(217)),c=n(204),f=n(191);function l(object,t){var e=Object.keys(object);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(object);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(object,t).enumerable}))),e.push.apply(e,n)}return e}function d(t){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?l(Object(source),!0).forEach((function(e){Object(r.a)(t,e,source[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(source)):l(Object(source)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(source,e))}))}return t}var h={components:{patternLane:o.default,WebaudioApiController:c.default},mixins:[f.a],data:function(){return{patternLength:8,currentNote:0,steps:[]}},methods:{onTracksChange:function(t,e){this.steps.filter((function(t){return t.id==e}))[0].tracks=t},onTrackAdded:function(t,e){this.steps.find((function(t){return t.id==e})).tracks.push(t)},onPatternLengthChange:function(t){this.patternLength=t},onNextNote:function(t){this.currentNote=t}},mounted:function(){this.steps=this.instruments.map((function(t){return d(d({},t),{},{tracks:[]})}))}},m=n(6),component=Object(m.a)(h,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("webaudio-api-controller",{attrs:{steps:t.steps,patternLength:t.patternLength},on:{patternLengthChange:t.onPatternLengthChange,nextNote:t.onNextNote}}),t._v(" "),n("div",{staticClass:"flex mb-3"},[n("div",{staticStyle:{"margin-left":"200px"}},[n("div",{staticClass:"rounded-full w-2 h-2 bg-primary transition-all transition-1",style:{transform:"translateX("+(98*t.currentNote+49)+"px)"}})])]),t._v(" "),t._l(t.steps,(function(e,r){return n("pattern-lane",{key:"step_"+r,attrs:{title:e.title,tracks:e.tracks,instrument:e,patternLength:t.patternLength},on:{tracksChange:function(n){return t.onTracksChange(n,e.id)},onTrackAdded:function(n){return t.onTrackAdded(n,e.id)}}})}))],2)}),[],!1,null,null,null);e.default=component.exports}}]);