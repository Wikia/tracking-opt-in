/**
 * This is simple and lightweight implementation of TCF API.
 * It is only being used in US.
 * In GDPR countries we use full TCF API from @iabtcf/cmpapi package.
 * @see: ./src/gdpr/ConsentManagementProvider.js
 */
class TcfApi {
    static addLocatorFrame() {
        const name = '____tcfapiLocator';

        if (window.frames[name]) {
            return;
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => TcfApi.addLocatorFrame());
            return;
        }

        let body = document.body, iframe = document.createElement('iframe');
        iframe.name = name;
        iframe.style.display = 'none';
        body.appendChild(iframe);
    }

    static install() {
        let iabConsentData = null
        let gdprApplies = false;
        let responseCode = true;

        function cmpMsgHandler(event) {
            try {
                let json = event.data;
                let msgIsString = typeof json === "string";
                if (msgIsString) {
                    try {
                        json = JSON.parse(json);
                    } catch (error) {
                    }
                }
                let call = json.__tcfapiCall;
                if (call) {
                    window.__tcfapi(call.command, call.parameter, function (retValue, success) {
                        let returnMsg = {
                            __tcfapiReturn: {
                                returnValue: retValue, success: success, callId: call.callId
                            }
                        };
                        event.source.postMessage(msgIsString ? JSON.stringify(returnMsg) : returnMsg, '*');
                    });
                }
            } catch (e) {
            }  // do nothing
        }

        function cmpFunc(command, version, callback) {
            if (command === 'addEventListener') {
                callback({eventStatus: 'tcloaded', tcString: iabConsentData, gdprApplies}, responseCode)
            } else {
                callback(undefined, false);
            }
        }

        if (window.__tcfapi) {
            window.__tcfapi('ping', 2, (pingReturn) => {
                if (pingReturn.cmpStatus === 'stub') {
                    window.__tcfapi = cmpFunc;
                    window.__tcfapi.msgHandler = cmpMsgHandler;
                    window.addEventListener('message', cmpMsgHandler, false);
                }
            });
        } else {
            window.__tcfapi = cmpFunc;
            window.__tcfapi.msgHandler = cmpMsgHandler;
            window.addEventListener('message', cmpMsgHandler, false);
        }
    }
}

export default TcfApi;
