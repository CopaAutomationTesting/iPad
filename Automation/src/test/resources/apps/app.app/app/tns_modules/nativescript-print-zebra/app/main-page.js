"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var main_view_model_1 = require("./main-view-model");
function pageLoaded(args) {
    var page = args.object;
    page.bindingContext = new main_view_model_1.HelloWorldModel();
}
exports.pageLoaded = pageLoaded;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi1wYWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibWFpbi1wYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEscURBQWtEO0FBR2xELG9CQUEyQixJQUEwQjtJQUVqRCxJQUFJLElBQUksR0FBZSxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ25DLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxpQ0FBZSxFQUFFLENBQUM7QUFDaEQsQ0FBQztBQUpELGdDQUlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgb2JzZXJ2YWJsZSBmcm9tICdkYXRhL29ic2VydmFibGUnO1xuaW1wb3J0ICogYXMgcGFnZXMgZnJvbSAndWkvcGFnZSc7XG5pbXBvcnQge0hlbGxvV29ybGRNb2RlbH0gZnJvbSAnLi9tYWluLXZpZXctbW9kZWwnO1xuXG4vLyBFdmVudCBoYW5kbGVyIGZvciBQYWdlICdsb2FkZWQnIGV2ZW50IGF0dGFjaGVkIGluIG1haW4tcGFnZS54bWxcbmV4cG9ydCBmdW5jdGlvbiBwYWdlTG9hZGVkKGFyZ3M6IG9ic2VydmFibGUuRXZlbnREYXRhKSB7XG4gICAgLy8gR2V0IHRoZSBldmVudCBzZW5kZXJcbiAgICBsZXQgcGFnZSA9IDxwYWdlcy5QYWdlPmFyZ3Mub2JqZWN0O1xuICAgIHBhZ2UuYmluZGluZ0NvbnRleHQgPSBuZXcgSGVsbG9Xb3JsZE1vZGVsKCk7XG59Il19