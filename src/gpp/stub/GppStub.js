export function loadStub() {
	window.__gpp_addFrame=function(e){if(!window.frames[e]){if(document.body){var t=document.createElement("iframe");t.style.cssText="display:none",t.name=e,document.body.appendChild(t)}else window.setTimeout(window.__gpp_addFrame,10,e)}},window.__gpp_stub=function(){var e=arguments;if(__gpp.queue=__gpp.queue||[],__gpp.events=__gpp.events||[],!e.length||1==e.length&&"queue"==e[0])return __gpp.queue;if(1==e.length&&"events"==e[0])return __gpp.events;var t=e[0],s=e.length>1?e[1]:null,a=e.length>2?e[2]:null;if("ping"===t)s({gppVersion:"1.1",cmpStatus:"stub",cmpDisplayStatus:"hidden",signalStatus:"not ready",supportedAPIs:["8:uscav1","9:usvav1","10:uscov1","11:usutv1","12:usctv1",],cmpId:0,sectionList:[],applicableSections:[],gppString:"",parsedSections:{}},!0);else if("addEventListener"===t){"lastId"in __gpp||(__gpp.lastId=0),__gpp.lastId++;var n=__gpp.lastId;__gpp.events.push({id:n,callback:s,parameter:a}),s({eventName:"listenerRegistered",listenerId:n,data:!0,pingData:{gppVersion:"1.1",cmpStatus:"stub",cmpDisplayStatus:"hidden",signalStatus:"not ready",supportedAPIs:["8:uscav1","9:usvav1","10:uscov1","11:usutv1","12:usctv1",],cmpId:0,sectionList:[],applicableSections:[],gppString:"",parsedSections:{}}},!0)}else if("removeEventListener"===t){for(var p=!1,i=0;i<__gpp.events.length;i++)if(__gpp.events[i].id==a){__gpp.events.splice(i,1),p=!0;break}s({eventName:"listenerRemoved",listenerId:a,data:p,pingData:{gppVersion:"1.1",cmpStatus:"stub",cmpDisplayStatus:"hidden",signalStatus:"not ready",supportedAPIs:["8:uscav1","9:usvav1","10:uscov1","11:usutv1","12:usctv1",],cmpId:0,sectionList:[],applicableSections:[],gppString:"",parsedSections:{}}},!0)}else"hasSection"===t?s(!1,!0):"getSection"===t||"getField"===t?s(null,!0):__gpp.queue.push([].slice.apply(e))},window.__gpp_msghandler=function(e){var t="string"==typeof e.data;try{var s=t?JSON.parse(e.data):e.data}catch(a){var s=null}if("object"==typeof s&&null!==s&&"__gppCall"in s){var n=s.__gppCall;window.__gpp(n.command,function(s,a){var p={__gppReturn:{returnValue:s,success:a,callId:n.callId}};e.source.postMessage(t?JSON.stringify(p):p,"*")},"parameter"in n?n.parameter:null,"version"in n?n.version:"1.1")}},"__gpp"in window&&"function"==typeof window.__gpp||(window.__gpp=window.__gpp_stub,window.addEventListener("message",window.__gpp_msghandler,!1),window.__gpp_addFrame("__gppLocator"));
}
