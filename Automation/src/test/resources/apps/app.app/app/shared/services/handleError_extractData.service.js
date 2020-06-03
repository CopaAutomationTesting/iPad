"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Rx_1 = require("rxjs/Rx");
var HandleErrorExtractData = /** @class */ (function () {
    function HandleErrorExtractData() {
    }
    HandleErrorExtractData.handleErrors = function (error) {
        console.log("Handler Ready" + JSON.stringify(error));
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
    };
    HandleErrorExtractData.extractData = function (res) {
        console.log(res);
        if (res.text().indexOf('Siteminder - Login') > -1) {
            throw "SessionTimeout";
        }
        if (res.text().indexOf('Siteminder - Logout') > -1) {
            throw "Unable to connect to server. Network Error.";
        }
        if (res.text().indexOf('document.AUTOSUBMIT.submit()') > -1) {
            throw "SessionTimeout";
        }
        var body = res.json();
        if (body.BadRequest != undefined) {
            if (body.ErrorMessage != undefined) {
                throw (body.ErrorMessage);
            }
            else if (body.errMessage != undefined) {
                throw (body.errMessage);
            }
            else {
                throw (body.genericMessage);
            }
        }
        return body;
    };
    return HandleErrorExtractData;
}());
exports.HandleErrorExtractData = HandleErrorExtractData;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFuZGxlRXJyb3JfZXh0cmFjdERhdGEuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImhhbmRsZUVycm9yX2V4dHJhY3REYXRhLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSw4QkFBc0M7QUFHdEM7SUFBQTtJQThDQSxDQUFDO0lBNUNpQixtQ0FBWSxHQUExQixVQUEyQixLQUFxQjtRQUM1QyxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFFckQsSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUNwQixPQUFPLGVBQVUsQ0FBQyxLQUFLLENBQUMsb0NBQW9DLENBQUMsQ0FBQztTQUNqRTthQUFNLElBQUksS0FBSyxDQUFDLE1BQU0sSUFBSSxHQUFHLEVBQUU7WUFDNUIsT0FBTyxlQUFVLENBQUMsS0FBSyxDQUFDLDZDQUE2QyxDQUFDLENBQUM7U0FDMUU7YUFBTSxJQUFJLEtBQUssQ0FBQyxNQUFNLElBQUksR0FBRyxFQUFFO1lBQzVCLE9BQU8sZUFBVSxDQUFDLEtBQUssQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDO1NBQ3pFO2FBQU0sSUFBSSxLQUFLLENBQUMsTUFBTSxJQUFJLEdBQUcsRUFBRTtZQUM1QixPQUFPLGVBQVUsQ0FBQyxLQUFLLENBQUMsbURBQW1ELENBQUMsQ0FBQztTQUNoRjthQUFNLElBQUksS0FBSyxDQUFDLE1BQU0sSUFBSSxHQUFHLEVBQUU7WUFDNUIsT0FBTyxlQUFVLENBQUMsS0FBSyxDQUFDLDhCQUE4QixDQUFDLENBQUM7U0FDM0Q7YUFBTSxJQUFJLEtBQUssQ0FBQyxNQUFNLElBQUksR0FBRyxFQUFFO1lBQzVCLE9BQU8sZUFBVSxDQUFDLEtBQUssQ0FBQyx1REFBdUQsQ0FBQyxDQUFDO1NBQ3BGO2FBQU07WUFDSCxPQUFPLGVBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDbEM7SUFDTCxDQUFDO0lBRWEsa0NBQVcsR0FBekIsVUFBMEIsR0FBYTtRQUNuQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLElBQUksR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO1lBQy9DLE1BQU0sZ0JBQWdCLENBQUE7U0FDekI7UUFDRCxJQUFJLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUMscUJBQXFCLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtZQUNoRCxNQUFNLDZDQUE2QyxDQUFBO1NBQ3REO1FBQ0QsSUFBSSxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDLDhCQUE4QixDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUU7WUFDekQsTUFBTSxnQkFBZ0IsQ0FBQTtTQUN6QjtRQUNELElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN0QixJQUFJLElBQUksQ0FBQyxVQUFVLElBQUksU0FBUyxFQUFFO1lBQzlCLElBQUksSUFBSSxDQUFDLFlBQVksSUFBSSxTQUFTLEVBQUU7Z0JBQ2hDLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7YUFDN0I7aUJBQU0sSUFBSSxJQUFJLENBQUMsVUFBVSxJQUFJLFNBQVMsRUFBRTtnQkFDckMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQzthQUMzQjtpQkFBTTtnQkFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO2FBQy9CO1NBQ0o7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUwsNkJBQUM7QUFBRCxDQUFDLEFBOUNELElBOENDO0FBOUNZLHdEQUFzQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCB9IGZyb20gJ3J4anMvUngnO1xuaW1wb3J0IHsgUmVzcG9uc2UgfSBmcm9tICdAYW5ndWxhci9odHRwJ1xuXG5leHBvcnQgY2xhc3MgSGFuZGxlRXJyb3JFeHRyYWN0RGF0YSB7XG5cbiAgICBwdWJsaWMgc3RhdGljIGhhbmRsZUVycm9ycyhlcnJvcjogUmVzcG9uc2UgfCBhbnkpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJIYW5kbGVyIFJlYWR5XCIgKyBKU09OLnN0cmluZ2lmeShlcnJvcikpO1xuXG4gICAgICAgIGlmIChlcnJvci5zdGF0dXMgPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBPYnNlcnZhYmxlLnRocm93KCdVbmFibGUgdG8gQ29ubmVjdC4gVmVyaWZ5IE5ldHdvcmsuJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXJyb3Iuc3RhdHVzID09IDIwMCkge1xuICAgICAgICAgICAgcmV0dXJuIE9ic2VydmFibGUudGhyb3coJ1VuYWJsZSB0byBjb25uZWN0IHRvIHNlcnZlci4gTmV0d29yayBFcnJvci4nKTtcbiAgICAgICAgfSBlbHNlIGlmIChlcnJvci5zdGF0dXMgPT0gNDAwKSB7XG4gICAgICAgICAgICByZXR1cm4gT2JzZXJ2YWJsZS50aHJvdygnVW5hYmxlIHRvIGdldCByZXNwb25zZS4gQmFkIFJlcXVlc3QuIFs0MDBdJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXJyb3Iuc3RhdHVzID09IDQwNCkge1xuICAgICAgICAgICAgcmV0dXJuIE9ic2VydmFibGUudGhyb3coJ1VuYWJsZSB0byBjb25uZWN0IHRvIHNlcnZlci4gTmV0d29yayBFcnJvci4gWzQwNF0nKTtcbiAgICAgICAgfSBlbHNlIGlmIChlcnJvci5zdGF0dXMgPT0gNTAwKSB7XG4gICAgICAgICAgICByZXR1cm4gT2JzZXJ2YWJsZS50aHJvdygnSW50ZXJuYWwgU2VydmVyIEVycm9yIFs1MDBdLicpO1xuICAgICAgICB9IGVsc2UgaWYgKGVycm9yLnN0YXR1cyA9PSA1MDIpIHtcbiAgICAgICAgICAgIHJldHVybiBPYnNlcnZhYmxlLnRocm93KCd1bmFibGUgdG8gcmVjZWl2ZWQgYSB2YWxpZCByZXNwb25zZS5CYWQgR2F0ZVdheSBbNTAyXScpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIE9ic2VydmFibGUudGhyb3coZXJyb3IpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBleHRyYWN0RGF0YShyZXM6IFJlc3BvbnNlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgIGlmIChyZXMudGV4dCgpLmluZGV4T2YoJ1NpdGVtaW5kZXIgLSBMb2dpbicpID4gLTEpIHtcbiAgICAgICAgICAgIHRocm93IFwiU2Vzc2lvblRpbWVvdXRcIlxuICAgICAgICB9XG4gICAgICAgIGlmIChyZXMudGV4dCgpLmluZGV4T2YoJ1NpdGVtaW5kZXIgLSBMb2dvdXQnKSA+IC0xKSB7XG4gICAgICAgICAgICB0aHJvdyBcIlVuYWJsZSB0byBjb25uZWN0IHRvIHNlcnZlci4gTmV0d29yayBFcnJvci5cIlxuICAgICAgICB9ICAgICAgICBcbiAgICAgICAgaWYgKHJlcy50ZXh0KCkuaW5kZXhPZignZG9jdW1lbnQuQVVUT1NVQk1JVC5zdWJtaXQoKScpID4gLTEpIHtcbiAgICAgICAgICAgIHRocm93IFwiU2Vzc2lvblRpbWVvdXRcIlxuICAgICAgICB9XG4gICAgICAgIGxldCBib2R5ID0gcmVzLmpzb24oKTtcbiAgICAgICAgaWYgKGJvZHkuQmFkUmVxdWVzdCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGlmIChib2R5LkVycm9yTWVzc2FnZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAoYm9keS5FcnJvck1lc3NhZ2UpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChib2R5LmVyck1lc3NhZ2UgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgKGJvZHkuZXJyTWVzc2FnZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IChib2R5LmdlbmVyaWNNZXNzYWdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYm9keTtcbiAgICB9XG5cbn1cbiJdfQ==