"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//angular & nativescript references
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
require("rxjs/add/operator/map");
require("rxjs/add/operator/do");
var MessageService = /** @class */ (function () {
    function MessageService(_http) {
        this._http = _http;
        this.apiHost = './../message.json';
    }
    MessageService.prototype.getMessage = function () {
        return this._http.get(this.apiHost)
            .toPromise()
            .then(function (response) {
            return response.json();
        }).catch(function (err) {
            console.log(err);
        });
    };
    MessageService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http])
    ], MessageService);
    return MessageService;
}());
exports.MessageService = MessageService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibWVzc2FnZS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQW1DO0FBQ25DLHNDQUEyQztBQUUzQyxzQ0FBK0M7QUFDL0MsaUNBQStCO0FBQy9CLGdDQUE4QjtBQUc5QjtJQUtJLHdCQUFvQixLQUFXO1FBQVgsVUFBSyxHQUFMLEtBQUssQ0FBTTtRQUR4QixZQUFPLEdBQVUsbUJBQW1CLENBQUM7SUFFNUMsQ0FBQztJQUNELG1DQUFVLEdBQVY7UUFDSSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7YUFDbEMsU0FBUyxFQUFFO2FBQ1gsSUFBSSxDQUFDLFVBQUMsUUFBUTtZQUVYLE9BQU8sUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzNCLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFDLEdBQUc7WUFFVCxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3JCLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQWpCUSxjQUFjO1FBRDFCLGlCQUFVLEVBQUU7eUNBTWtCLFdBQUk7T0FMdEIsY0FBYyxDQW1CMUI7SUFBRCxxQkFBQztDQUFBLEFBbkJELElBbUJDO0FBbkJZLHdDQUFjIiwic291cmNlc0NvbnRlbnQiOlsiLy9hbmd1bGFyICYgbmF0aXZlc2NyaXB0IHJlZmVyZW5jZXNcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSBhcyBSeE9ic2VydmFibGUgfSBmcm9tIFwicnhqcy9PYnNlcnZhYmxlXCI7XG5pbXBvcnQgeyBIdHRwLCBSZXNwb25zZSB9IGZyb20gXCJAYW5ndWxhci9odHRwXCI7XG5pbXBvcnQgXCJyeGpzL2FkZC9vcGVyYXRvci9tYXBcIjtcbmltcG9ydCBcInJ4anMvYWRkL29wZXJhdG9yL2RvXCI7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBNZXNzYWdlU2VydmljZSB7XG5cbiAgICBwcml2YXRlIGhlYWRlcnM6IEhlYWRlcnM7XG4gICAgcHVibGljIE1lc3NhZ2VEZXRhaWw6YW55O1xuICAgIHB1YmxpYyBhcGlIb3N0OnN0cmluZyA9ICcuLy4uL21lc3NhZ2UuanNvbic7XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBfaHR0cDogSHR0cCkge1xuICAgIH1cbiAgICBnZXRNZXNzYWdlKCk6YW55IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2h0dHAuZ2V0KHRoaXMuYXBpSG9zdClcbiAgICAgICAgLnRvUHJvbWlzZSgpXG4gICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4gXG4gICAgICAgIHsgXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpOyBcbiAgICAgICAgfSkuY2F0Y2goKGVycikgPT4gXG4gICAgICAgIHsgXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpOyBcbiAgICAgICAgfSk7XG4gICAgfVxuXG59Il19