"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//angular & nativescript references
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
require("rxjs/add/operator/map");
require("rxjs/add/operator/catch");
var Rx_1 = require("rxjs/Rx");
var router_1 = require("nativescript-angular/router");
//app references
var app_constants_1 = require("../../app.constants");
var PaymentService = /** @class */ (function () {
    function PaymentService(_http, _configuration, routerExtensions) {
        this._http = _http;
        this._configuration = _configuration;
        this.routerExtensions = routerExtensions;
        var config = _configuration;
        this.actionUrl = config.ServerWithApiUrlOrders;
        this.headers = new http_1.Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');
    }
    PaymentService.prototype.PostPayment = function (request, id) {
        var headers = new http_1.Headers();
        headers.append("ApiUser", "osOk7lupocQBiED/uZtYPYWkaqlL06bvmKtSWJoUlPY=");
        console.log(JSON.stringify(request));
        var actionLink = "http://usclssoat258.airservices.eds.com:12499/api/purchase";
        return this._http.post(actionLink, JSON.parse(JSON.stringify(request)), { headers: headers })
            .map(function (response) { return response.json(); })
            .catch(this.handleError);
    };
    PaymentService.prototype.extractData = function (res) {
        console.log(res);
        if (res.text().indexOf('Siteminder - Login') > -1) {
            throw "SessionTimeout";
        }
        var body = res.json();
        if (body.BadRequest != undefined) {
            if (body.ErrorMessage != undefined) {
                throw (body.ErrorMessage);
            }
            else {
                throw (body.genericMessage);
            }
        }
        return body;
    };
    PaymentService.prototype.handleError = function (error) {
        var cookies = NSHTTPCookieStorage.sharedHTTPCookieStorage.cookies;
        if (typeof cookies !== 'undefined') {
            //     this.Output = "No Cookie(s) Available";
            for (var i = 0; i < cookies.count; i++) {
                var cookie = cookies.objectAtIndex(i);
                if (cookie.name == "SMSESSION")
                    console.log(cookie);
            }
            console.error("Error from Service " + error);
            //  var errorMessage = error.toString();
            // if (errorMessage.indexOf("Unrecognized token '<'") == -1) {
            //         console.log("hi");
            //         return Observable.throw(error.json().data || 'Server error');
            // }
            // else {
            //         console.log("else");                                
            //         return Observable.throw(error);
            // }
            // return Observable.throw(error.json().data || 'Server error');
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
            console.error("Error from Service " + error);
            return Rx_1.Observable.throw(cookies || 'Server error');
        }
    };
    PaymentService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http, app_constants_1.Configuration, router_1.RouterExtensions])
    ], PaymentService);
    return PaymentService;
}());
exports.PaymentService = PaymentService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF5bWVudC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGF5bWVudC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQW1DO0FBQ25DLHNDQUEyQztBQUMzQyxzQ0FBd0Q7QUFDeEQsaUNBQThCO0FBQzlCLG1DQUFnQztBQUNoQyw4QkFBcUM7QUFDckMsc0RBQStEO0FBRy9ELGdCQUFnQjtBQUNoQixxREFBb0Q7QUFNcEQ7SUFLSSx3QkFBb0IsS0FBVyxFQUFVLGNBQTZCLEVBQVUsZ0JBQWtDO1FBQTlGLFVBQUssR0FBTCxLQUFLLENBQU07UUFBVSxtQkFBYyxHQUFkLGNBQWMsQ0FBZTtRQUFVLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFFOUcsSUFBSSxNQUFNLEdBQUcsY0FBYyxDQUFDO1FBQzVCLElBQUksQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLHNCQUFzQixDQUFDO1FBQy9DLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxjQUFPLEVBQUUsQ0FBQztRQUM3QixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztRQUN4RCxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBRU0sb0NBQVcsR0FBbEIsVUFBbUIsT0FBWSxFQUFFLEVBQVU7UUFDdkMsSUFBSSxPQUFPLEdBQUcsSUFBSSxjQUFPLEVBQUUsQ0FBQztRQUM1QixPQUFPLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSw4Q0FBOEMsQ0FBQyxDQUFDO1FBQzFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLElBQUksVUFBVSxHQUFRLDREQUE0RCxDQUFBO1FBQ2xGLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxF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SyxDQUFDLENBQUM7YUFDbEM7U0FDSjthQUFNO1lBQ0gsT0FBTyxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsR0FBRyxLQUFLLENBQUMsQ0FBQztZQUU3QyxPQUFPLGVBQVUsQ0FBQyxLQUFLLENBQUMsT0FBTyxJQUFJLGNBQWMsQ0FBQyxDQUFDO1NBRXREO0lBQ0wsQ0FBQztJQW5GUSxjQUFjO1FBRDFCLGlCQUFVLEVBQUU7eUNBTWtCLFdBQUksRUFBMEIsNkJBQWEsRUFBNEIseUJBQWdCO09BTHpHLGNBQWMsQ0FxRjFCO0lBQUQscUJBQUM7Q0FBQSxBQXJGRCxJQXFGQztBQXJGWSx3Q0FBYyIsInNvdXJjZXNDb250ZW50IjpbIi8vYW5ndWxhciAmIG5hdGl2ZXNjcmlwdCByZWZlcmVuY2VzXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBIdHRwLCBSZXNwb25zZSwgSGVhZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2h0dHAnO1xuaW1wb3J0ICdyeGpzL2FkZC9vcGVyYXRvci9tYXAnXG5pbXBvcnQgJ3J4anMvYWRkL29wZXJhdG9yL2NhdGNoJ1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMvUngnO1xuaW1wb3J0IHsgUm91dGVyRXh0ZW5zaW9ucyB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9yb3V0ZXJcIjtcbmltcG9ydCAqIGFzIGRpYWxvZ3MgZnJvbSBcInVpL2RpYWxvZ3NcIjtcblxuLy9hcHAgcmVmZXJlbmNlc1xuaW1wb3J0IHsgQ29uZmlndXJhdGlvbiB9IGZyb20gJy4uLy4uL2FwcC5jb25zdGFudHMnO1xuXG5kZWNsYXJlIHZhciBOU0hUVFBDb29raWVTdG9yYWdlLCBOU0hUVFBDb29raWU7XG5cblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFBheW1lbnRTZXJ2aWNlIHtcblxuICAgIHByaXZhdGUgYWN0aW9uVXJsOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBoZWFkZXJzOiBIZWFkZXJzO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBfaHR0cDogSHR0cCwgcHJpdmF0ZSBfY29uZmlndXJhdGlvbjogQ29uZmlndXJhdGlvbiwgcHJpdmF0ZSByb3V0ZXJFeHRlbnNpb25zOiBSb3V0ZXJFeHRlbnNpb25zKSB7XG5cbiAgICAgICAgdmFyIGNvbmZpZyA9IF9jb25maWd1cmF0aW9uO1xuICAgICAgICB0aGlzLmFjdGlvblVybCA9IGNvbmZpZy5TZXJ2ZXJXaXRoQXBpVXJsT3JkZXJzO1xuICAgICAgICB0aGlzLmhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xuICAgICAgICB0aGlzLmhlYWRlcnMuYXBwZW5kKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgICB0aGlzLmhlYWRlcnMuYXBwZW5kKCdBY2NlcHQnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgIH1cblxuICAgIHB1YmxpYyBQb3N0UGF5bWVudChyZXF1ZXN0OiBhbnksIGlkOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgICAgICBsZXQgaGVhZGVycyA9IG5ldyBIZWFkZXJzKCk7XG4gICAgICAgIGhlYWRlcnMuYXBwZW5kKFwiQXBpVXNlclwiLCBcIm9zT2s3bHVwb2NRQmlFRC91WnRZUFlXa2FxbEwwNmJ2bUt0U1dKb1VsUFk9XCIpO1xuICAgICAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShyZXF1ZXN0KSk7XG4gICAgICAgIHZhciBhY3Rpb25MaW5rOiBhbnkgPSBcImh0dHA6Ly91c2Nsc3NvYXQyNTguYWlyc2VydmljZXMuZWRzLmNvbToxMjQ5OS9hcGkvcHVyY2hhc2VcIlxuICAgICAgICByZXR1cm4gdGhpcy5faHR0cC5wb3N0KGFjdGlvbkxpbmssIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkocmVxdWVzdCkpLCB7IGhlYWRlcnM6IGhlYWRlcnMgfSlcbiAgICAgICAgICAgIC5tYXAocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKVxuICAgICAgICAgICAgLmNhdGNoKHRoaXMuaGFuZGxlRXJyb3IpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZXh0cmFjdERhdGEocmVzOiBSZXNwb25zZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1x0XG5cdFx0aWYgKHJlcy50ZXh0KCkuaW5kZXhPZignU2l0ZW1pbmRlciAtIExvZ2luJykgPiAtMSkge1xuXHRcdFx0dGhyb3cgXCJTZXNzaW9uVGltZW91dFwiXG5cdFx0fVxuICAgICAgICBsZXQgYm9keSA9IHJlcy5qc29uKCk7XG4gICAgICAgIGlmKGJvZHkuQmFkUmVxdWVzdCAhPSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgaWYoYm9keS5FcnJvck1lc3NhZ2UgIT11bmRlZmluZWQpe1xuICAgICAgICAgICAgICAgIHRocm93KGJvZHkuRXJyb3JNZXNzYWdlKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHRocm93KGJvZHkuZ2VuZXJpY01lc3NhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cdFx0cmV0dXJuIGJvZHk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBoYW5kbGVFcnJvcihlcnJvcjogUmVzcG9uc2UpIHtcbiAgICAgICAgY29uc3QgY29va2llczogYW55ID0gTlNIVFRQQ29va2llU3RvcmFnZS5zaGFyZWRIVFRQQ29va2llU3RvcmFnZS5jb29raWVzO1xuICAgICAgICBpZiAodHlwZW9mIGNvb2tpZXMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAvLyAgICAgdGhpcy5PdXRwdXQgPSBcIk5vIENvb2tpZShzKSBBdmFpbGFibGVcIjtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29va2llcy5jb3VudDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY29va2llOiBhbnkgPSBjb29raWVzLm9iamVjdEF0SW5kZXgoaSk7XG4gICAgICAgICAgICAgICAgaWYgKGNvb2tpZS5uYW1lID09IFwiU01TRVNTSU9OXCIpXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNvb2tpZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgZnJvbSBTZXJ2aWNlIFwiICsgZXJyb3IpO1xuICAgICAgICAgICAgLy8gIHZhciBlcnJvck1lc3NhZ2UgPSBlcnJvci50b1N0cmluZygpO1xuICAgICAgICAgICAgLy8gaWYgKGVycm9yTWVzc2FnZS5pbmRleE9mKFwiVW5yZWNvZ25pemVkIHRva2VuICc8J1wiKSA9PSAtMSkge1xuICAgICAgICAgICAgLy8gICAgICAgICBjb25zb2xlLmxvZyhcImhpXCIpO1xuICAgICAgICAgICAgLy8gICAgICAgICByZXR1cm4gT2JzZXJ2YWJsZS50aHJvdyhlcnJvci5qc29uKCkuZGF0YSB8fCAnU2VydmVyIGVycm9yJyk7XG4gICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAvLyBlbHNlIHtcbiAgICAgICAgICAgIC8vICAgICAgICAgY29uc29sZS5sb2coXCJlbHNlXCIpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyAgICAgICAgIHJldHVybiBPYnNlcnZhYmxlLnRocm93KGVycm9yKTtcblxuXG4gICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAvLyByZXR1cm4gT2JzZXJ2YWJsZS50aHJvdyhlcnJvci5qc29uKCkuZGF0YSB8fCAnU2VydmVyIGVycm9yJyk7XG4gICAgICAgICAgICBpZiAoZXJyb3Iuc3RhdHVzID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE9ic2VydmFibGUudGhyb3coJ1VuYWJsZSB0byBDb25uZWN0LiBWZXJpZnkgTmV0d29yay4nKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXJyb3Iuc3RhdHVzID09IDIwMCl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE9ic2VydmFibGUudGhyb3coJ1VuYWJsZSB0byBjb25uZWN0IHRvIHNlcnZlci4gTmV0d29yayBFcnJvci4nKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXJyb3Iuc3RhdHVzID09IDQwMCl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE9ic2VydmFibGUudGhyb3coJ1VuYWJsZSB0byBnZXQgcmVzcG9uc2UuIEJhZCBSZXF1ZXN0LiBbNDAwXScpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChlcnJvci5zdGF0dXMgPT0gNDA0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE9ic2VydmFibGUudGhyb3coJ1VuYWJsZSB0byBjb25uZWN0IHRvIHNlcnZlci4gTmV0d29yayBFcnJvci4gWzQwNF0nKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXJyb3Iuc3RhdHVzID09IDUwMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBPYnNlcnZhYmxlLnRocm93KCdJbnRlcm5hbCBTZXJ2ZXIgRXJyb3IgWzUwMF0uJyk7XG4gICAgICAgICAgICB9ZWxzZSBpZiAoZXJyb3Iuc3RhdHVzID09IDUwMikge1xuICAgICAgICAgICAgICAgIHJldHVybiBPYnNlcnZhYmxlLnRocm93KCd1bmFibGUgdG8gcmVjZWl2ZWQgYSB2YWxpZCByZXNwb25zZS5CYWQgR2F0ZVdheSBbNTAyXScpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JzZXJ2YWJsZS50aHJvdyhlcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgZnJvbSBTZXJ2aWNlIFwiICsgZXJyb3IpO1xuXG4gICAgICAgICAgICByZXR1cm4gT2JzZXJ2YWJsZS50aHJvdyhjb29raWVzIHx8ICdTZXJ2ZXIgZXJyb3InKTtcblxuICAgICAgICB9XG4gICAgfVxuXG59Il19