"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Rx_1 = require("rxjs/Rx");
var AppExecutiontime = /** @class */ (function () {
    function AppExecutiontime() {
    }
    AppExecutiontime.ExecutionTime = function (sTime, eTime) {
        var eventStartTime = new Date(sTime);
        var eventEndTime = new Date(eTime);
        return eventEndTime.valueOf() - eventStartTime.valueOf();
    };
    // public static  handleErrors (error: Response | any) {    
    //     console.log("HandleErrors");
    //     let errMsg: string;
    //     errMsg = error.message ? error.message : error.toString();
    //     console.error(errMsg);
    //     return Observable.throw(errMsg);
    // }
    AppExecutiontime.handleErrors = function (error) {
        console.log("Handler Ready");
        var cookies = NSHTTPCookieStorage.sharedHTTPCookieStorage.cookies;
        if (typeof cookies !== 'undefined') {
            //     this.Output = "No Cookie(s) Available";
            for (var i = 0; i < cookies.count; i++) {
                var cookie = cookies.objectAtIndex(i);
                if (cookie.name == "SMSESSION")
                    console.log(cookie);
            }
            console.error("Error from Service " + error);
            // var errorMessage = error.toString();
            // if (errorMessage.indexOf("Unrecognized token '<'") == -1) {
            //     console.log("hi");
            //     return Observable.throw(error.json().data || 'Server error');
            // }
            // else {
            //     console.log("else");
            //     return Observable.throw(error);
            // }
            if (error.status === 0) {
                return Rx_1.Observable.throw('Unable to Connect. Verify Network.');
            }
            else if (error.status == 200) {
                return Rx_1.Observable.throw('Unable to connect to server. Network Error.');
            }
            else if (error.status == 400) {
                return Rx_1.Observable.throw('Unable to get response. Bad Request. [400]');
            }
            else if (error.status == 404) {
                return Rx_1.Observable.throw('Unable to connect to server. Network Error. [404]');
            }
            else if (error.status == 500) {
                return Rx_1.Observable.throw('Internal Server Error [500].');
            }
            else if (error.status == 502) {
                return Rx_1.Observable.throw('unable to received a valid response.Bad GateWay [502]');
            }
            else {
                return Rx_1.Observable.throw(error);
            }
        }
        else {
            console.error("Error " + error);
            console.log("Handler Ready");
            console.log("hi");
            // this.displayStandardproductsDialog();                        
            return Rx_1.Observable.throw(cookies || 'Server error');
        }
    };
    return AppExecutiontime;
}());
exports.AppExecutiontime = AppExecutiontime;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmV4ZWN1dGlvbnRpbWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhcHAuZXhlY3V0aW9udGltZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLDhCQUFzQztBQUd0QztJQUFBO0lBK0RBLENBQUM7SUE1RGlCLDhCQUFhLEdBQTNCLFVBQTRCLEtBQVUsRUFBRSxLQUFVO1FBQzlDLElBQUksY0FBYyxHQUFHLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3JDLElBQUksWUFBWSxHQUFHLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ25DLE9BQU8sWUFBWSxDQUFDLE9BQU8sRUFBRSxHQUFHLGNBQWMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUM3RCxDQUFDO0lBQ0QsNERBQTREO0lBQzVELG1DQUFtQztJQUNuQywwQkFBMEI7SUFDMUIsaUVBQWlFO0lBQ2pFLDZCQUE2QjtJQUM3Qix1Q0FBdUM7SUFDdkMsSUFBSTtJQUVVLDZCQUFZLEdBQTFCLFVBQTJCLEtBQW1CO1FBQzFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDN0IsSUFBTSxPQUFPLEdBQVEsbUJBQW1CLENBQUMsdUJBQXVCLENBQUMsT0FBTyxDQUFDO1FBQ3pFLElBQUksT0FBTyxPQUFPLEtBQUssV0FBVyxFQUFFO1lBQ2hDLDhDQUE4QztZQUM5QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDcEMsSUFBTSxNQUFNLEdBQVEsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDN0MsSUFBSSxNQUFNLENBQUMsSUFBSSxJQUFJLFdBQVc7b0JBQzFCLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDM0I7WUFDRCxPQUFPLENBQUMsS0FBSyxDQUFDLHFCQUFxQixHQUFHLEtBQUssQ0FBQyxDQUFDO1lBQzdDLHVDQUF1QztZQUN2Qyw4REFBOEQ7WUFDOUQseUJBQXlCO1lBQ3pCLG9FQUFvRTtZQUNwRSxJQUFJO1lBQ0osU0FBUztZQUNULDJCQUEyQjtZQUMzQixzQ0FBc0M7WUFDdEMsSUFBSTtZQUNKLElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7Z0JBQ3BCLE9BQU8sZUFBVSxDQUFDLEtBQUssQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO2FBQ2pFO2lCQUFNLElBQUksS0FBSyxDQUFDLE1BQU0sSUFBSSxHQUFHLEVBQUM7Z0JBQzNCLE9BQU8sZUFBVSxDQUFDLEtBQUssQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDO2FBQzFFO2lCQUFNLElBQUksS0FBSyxDQUFDLE1BQU0sSUFBSSxHQUFHLEVBQUM7Z0JBQzNCLE9BQU8sZUFBVSxDQUFDLEtBQUssQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDO2FBQ3pFO2lCQUFNLElBQUksS0FBSyxDQUFDLE1BQU0sSUFBSSxHQUFHLEVBQUU7Z0JBQzVCLE9BQU8sZUFBVSxDQUFDLEtBQUssQ0FBQyxtREFBbUQsQ0FBQyxDQUFDO2FBQ2hGO2lCQUFNLElBQUksS0FBSyxDQUFDLE1BQU0sSUFBSSxHQUFHLEVBQUU7Z0JBQzVCLE9BQU8sZUFBVSxDQUFDLEtBQUssQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO2FBQzNEO2lCQUFLLElBQUksS0FBSyxDQUFDLE1BQU0sSUFBSSxHQUFHLEVBQUU7Z0JBQzNCLE9BQU8sZUFBVSxDQUFDLEtBQUssQ0FBQyx1REFBdUQsQ0FBQyxDQUFDO2FBQ3BGO2lCQUFNO2dCQUNILE9BQU8sZUFBVSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUNsQztTQUNKO2FBQU07WUFDSCxPQUFPLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsQ0FBQztZQUNoQyxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQzdCLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEIsZ0VBQWdFO1lBQ2hFLE9BQU8sZUFBVSxDQUFDLEtBQUssQ0FBQyxPQUFPLElBQUksY0FBYyxDQUFDLENBQUM7U0FFdEQ7SUFFTCxDQUFDO0lBR0wsdUJBQUM7QUFBRCxDQUFDLEFBL0RELElBK0RDO0FBL0RZLDRDQUFnQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcbmltcG9ydCB7IE9ic2VydmFibGUsIH0gZnJvbSAncnhqcy9SeCc7XHJcbmltcG9ydCB7IFJlc3BvbnNlfSBmcm9tICdAYW5ndWxhci9odHRwJ1xyXG5cclxuZXhwb3J0IGNsYXNzIEFwcEV4ZWN1dGlvbnRpbWUge1xyXG5cclxuICAgIFxyXG4gICAgcHVibGljIHN0YXRpYyBFeGVjdXRpb25UaW1lKHNUaW1lOiBhbnksIGVUaW1lOiBhbnkpOiBhbnkge1xyXG4gICAgICAgIHZhciBldmVudFN0YXJ0VGltZSA9IG5ldyBEYXRlKHNUaW1lKTtcclxuICAgICAgICB2YXIgZXZlbnRFbmRUaW1lID0gbmV3IERhdGUoZVRpbWUpO1xyXG4gICAgICAgIHJldHVybiBldmVudEVuZFRpbWUudmFsdWVPZigpIC0gZXZlbnRTdGFydFRpbWUudmFsdWVPZigpO1xyXG4gICAgfVxyXG4gICAgLy8gcHVibGljIHN0YXRpYyAgaGFuZGxlRXJyb3JzIChlcnJvcjogUmVzcG9uc2UgfCBhbnkpIHsgICAgXHJcbiAgICAvLyAgICAgY29uc29sZS5sb2coXCJIYW5kbGVFcnJvcnNcIik7XHJcbiAgICAvLyAgICAgbGV0IGVyck1zZzogc3RyaW5nO1xyXG4gICAgLy8gICAgIGVyck1zZyA9IGVycm9yLm1lc3NhZ2UgPyBlcnJvci5tZXNzYWdlIDogZXJyb3IudG9TdHJpbmcoKTtcclxuICAgIC8vICAgICBjb25zb2xlLmVycm9yKGVyck1zZyk7XHJcbiAgICAvLyAgICAgcmV0dXJuIE9ic2VydmFibGUudGhyb3coZXJyTXNnKTtcclxuICAgIC8vIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGhhbmRsZUVycm9ycyhlcnJvcjogUmVzcG9uc2V8YW55KSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJIYW5kbGVyIFJlYWR5XCIpO1xyXG4gICAgICAgIGNvbnN0IGNvb2tpZXM6IGFueSA9IE5TSFRUUENvb2tpZVN0b3JhZ2Uuc2hhcmVkSFRUUENvb2tpZVN0b3JhZ2UuY29va2llcztcclxuICAgICAgICBpZiAodHlwZW9mIGNvb2tpZXMgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgIC8vICAgICB0aGlzLk91dHB1dCA9IFwiTm8gQ29va2llKHMpIEF2YWlsYWJsZVwiO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvb2tpZXMuY291bnQ7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY29va2llOiBhbnkgPSBjb29raWVzLm9iamVjdEF0SW5kZXgoaSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoY29va2llLm5hbWUgPT0gXCJTTVNFU1NJT05cIilcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjb29raWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBmcm9tIFNlcnZpY2UgXCIgKyBlcnJvcik7XHJcbiAgICAgICAgICAgIC8vIHZhciBlcnJvck1lc3NhZ2UgPSBlcnJvci50b1N0cmluZygpO1xyXG4gICAgICAgICAgICAvLyBpZiAoZXJyb3JNZXNzYWdlLmluZGV4T2YoXCJVbnJlY29nbml6ZWQgdG9rZW4gJzwnXCIpID09IC0xKSB7XHJcbiAgICAgICAgICAgIC8vICAgICBjb25zb2xlLmxvZyhcImhpXCIpO1xyXG4gICAgICAgICAgICAvLyAgICAgcmV0dXJuIE9ic2VydmFibGUudGhyb3coZXJyb3IuanNvbigpLmRhdGEgfHwgJ1NlcnZlciBlcnJvcicpO1xyXG4gICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgIC8vIGVsc2Uge1xyXG4gICAgICAgICAgICAvLyAgICAgY29uc29sZS5sb2coXCJlbHNlXCIpO1xyXG4gICAgICAgICAgICAvLyAgICAgcmV0dXJuIE9ic2VydmFibGUudGhyb3coZXJyb3IpO1xyXG4gICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgIGlmIChlcnJvci5zdGF0dXMgPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBPYnNlcnZhYmxlLnRocm93KCdVbmFibGUgdG8gQ29ubmVjdC4gVmVyaWZ5IE5ldHdvcmsuJyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXJyb3Iuc3RhdHVzID09IDIwMCl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JzZXJ2YWJsZS50aHJvdygnVW5hYmxlIHRvIGNvbm5lY3QgdG8gc2VydmVyLiBOZXR3b3JrIEVycm9yLicpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGVycm9yLnN0YXR1cyA9PSA0MDApe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE9ic2VydmFibGUudGhyb3coJ1VuYWJsZSB0byBnZXQgcmVzcG9uc2UuIEJhZCBSZXF1ZXN0LiBbNDAwXScpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGVycm9yLnN0YXR1cyA9PSA0MDQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBPYnNlcnZhYmxlLnRocm93KCdVbmFibGUgdG8gY29ubmVjdCB0byBzZXJ2ZXIuIE5ldHdvcmsgRXJyb3IuIFs0MDRdJyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXJyb3Iuc3RhdHVzID09IDUwMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE9ic2VydmFibGUudGhyb3coJ0ludGVybmFsIFNlcnZlciBFcnJvciBbNTAwXS4nKTtcclxuICAgICAgICAgICAgfWVsc2UgaWYgKGVycm9yLnN0YXR1cyA9PSA1MDIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBPYnNlcnZhYmxlLnRocm93KCd1bmFibGUgdG8gcmVjZWl2ZWQgYSB2YWxpZCByZXNwb25zZS5CYWQgR2F0ZVdheSBbNTAyXScpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE9ic2VydmFibGUudGhyb3coZXJyb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIFwiICsgZXJyb3IpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkhhbmRsZXIgUmVhZHlcIik7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaGlcIik7XHJcbiAgICAgICAgICAgIC8vIHRoaXMuZGlzcGxheVN0YW5kYXJkcHJvZHVjdHNEaWFsb2coKTsgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIE9ic2VydmFibGUudGhyb3coY29va2llcyB8fCAnU2VydmVyIGVycm9yJyk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbiAgIFxyXG5cclxufSJdfQ==