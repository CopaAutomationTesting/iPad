"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ArraysPipe = /** @class */ (function () {
    function ArraysPipe() {
    }
    ArraysPipe.prototype.transform = function (value) {
        var keys = [];
        for (var key in value) {
            keys.push({ key: key, value: value[key] });
        }
        return keys;
    };
    ArraysPipe = __decorate([
        core_1.Pipe({
            name: 'objtoarray'
        })
    ], ArraysPipe);
    return ArraysPipe;
}());
exports.ArraysPipe = ArraysPipe;
var ValuesPipe = /** @class */ (function () {
    function ValuesPipe() {
    }
    ValuesPipe.prototype.transform = function (value, args) {
        // create instance vars to store keys and final output
        console.log("sdsds" + value);
        var keyArr = Object.keys(value), dataArr = [];
        // loop through the object,
        // pushing values to the return array
        keyArr.forEach(function (key) {
            dataArr.push(value[key]);
        });
        // return the resulting array
        return dataArr;
    };
    ValuesPipe = __decorate([
        core_1.Pipe({ name: 'values' })
    ], ValuesPipe);
    return ValuesPipe;
}());
exports.ValuesPipe = ValuesPipe;
var ArrayFilterPipe = /** @class */ (function () {
    function ArrayFilterPipe() {
    }
    ArrayFilterPipe.prototype.transform = function (items, conditions) {
        return items.filter(function (item) {
            for (var field in conditions) {
                if (item[field] !== conditions[field]) {
                    return false;
                }
            }
            return true;
        });
    };
    ArrayFilterPipe = __decorate([
        core_1.Pipe({
            name: "datafilter",
            pure: false
        })
    ], ArrayFilterPipe);
    return ArrayFilterPipe;
}());
exports.ArrayFilterPipe = ArrayFilterPipe;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJyYXlwaXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXJyYXlwaXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWlEO0FBTWpEO0lBQUE7SUFRQSxDQUFDO0lBUEMsOEJBQVMsR0FBVCxVQUFVLEtBQUs7UUFDYixJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7UUFDZCxLQUFLLElBQUksR0FBRyxJQUFJLEtBQUssRUFBRTtZQUNyQixJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFDLENBQUMsQ0FBQztTQUMxQztRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQVBVLFVBQVU7UUFKdEIsV0FBSSxDQUFDO1lBQ0YsSUFBSSxFQUFFLFlBQVk7U0FDckIsQ0FBQztPQUVXLFVBQVUsQ0FRdEI7SUFBRCxpQkFBQztDQUFBLEFBUkQsSUFRQztBQVJZLGdDQUFVO0FBY3ZCO0lBQUE7SUFnQkEsQ0FBQztJQWZHLDhCQUFTLEdBQVQsVUFBVSxLQUFVLEVBQUUsSUFBWTtRQUM5QixzREFBc0Q7UUFDdEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEdBQUUsS0FBSyxDQUFDLENBQUM7UUFDNUIsSUFBSSxNQUFNLEdBQVUsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFDbEMsT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUVqQiwyQkFBMkI7UUFDM0IscUNBQXFDO1FBQ3JDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBQyxHQUFRO1lBQ3BCLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDN0IsQ0FBQyxDQUFDLENBQUM7UUFFSCw2QkFBNkI7UUFDN0IsT0FBTyxPQUFPLENBQUM7SUFDbkIsQ0FBQztJQWZRLFVBQVU7UUFGdEIsV0FBSSxDQUFDLEVBQUMsSUFBSSxFQUFFLFFBQVEsRUFBQyxDQUFDO09BRVYsVUFBVSxDQWdCdEI7SUFBRCxpQkFBQztDQUFBLEFBaEJELElBZ0JDO0FBaEJZLGdDQUFVO0FBc0J2QjtJQUFBO0lBWUEsQ0FBQztJQVZHLG1DQUFTLEdBQVQsVUFBVSxLQUFpQixFQUFFLFVBQWtDO1FBQzNELE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFBLElBQUk7WUFDcEIsS0FBSyxJQUFJLEtBQUssSUFBSSxVQUFVLEVBQUU7Z0JBQzFCLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLFVBQVUsQ0FBQyxLQUFLLENBQUMsRUFBRTtvQkFDbkMsT0FBTyxLQUFLLENBQUM7aUJBQ2hCO2FBQ0o7WUFDRCxPQUFPLElBQUksQ0FBQztRQUNoQixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFYUSxlQUFlO1FBSjNCLFdBQUksQ0FBQztZQUNGLElBQUksRUFBRSxZQUFZO1lBQ2xCLElBQUksRUFBRSxLQUFLO1NBQ2QsQ0FBQztPQUNXLGVBQWUsQ0FZM0I7SUFBRCxzQkFBQztDQUFBLEFBWkQsSUFZQztBQVpZLDBDQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtQaXBlLCBQaXBlVHJhbnNmb3JtfSBmcm9tICdAYW5ndWxhci9jb3JlJ1xuXG5AUGlwZSh7XG4gICAgbmFtZTogJ29ianRvYXJyYXknXG59KVxuXG5leHBvcnQgY2xhc3MgQXJyYXlzUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuICB0cmFuc2Zvcm0odmFsdWUpIDogYW55IHtcbiAgICBsZXQga2V5cyA9IFtdO1xuICAgIGZvciAobGV0IGtleSBpbiB2YWx1ZSkge1xuICAgICAga2V5cy5wdXNoKHtrZXk6IGtleSwgdmFsdWU6IHZhbHVlW2tleV19KTtcbiAgICB9XG4gICAgcmV0dXJuIGtleXM7XG4gIH1cbn1cblxuXG5cbkBQaXBlKHtuYW1lOiAndmFsdWVzJ30pXG5cbmV4cG9ydCBjbGFzcyBWYWx1ZXNQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG4gICAgdHJhbnNmb3JtKHZhbHVlOiBhbnksIGFyZ3M/OiBhbnlbXSk6IGFueVtdIHtcbiAgICAgICAgLy8gY3JlYXRlIGluc3RhbmNlIHZhcnMgdG8gc3RvcmUga2V5cyBhbmQgZmluYWwgb3V0cHV0XG4gICAgICAgIGNvbnNvbGUubG9nKFwic2RzZHNcIisgdmFsdWUpO1xuICAgICAgICBsZXQga2V5QXJyOiBhbnlbXSA9IE9iamVjdC5rZXlzKHZhbHVlKSxcbiAgICAgICAgICAgIGRhdGFBcnIgPSBbXTtcblxuICAgICAgICAvLyBsb29wIHRocm91Z2ggdGhlIG9iamVjdCxcbiAgICAgICAgLy8gcHVzaGluZyB2YWx1ZXMgdG8gdGhlIHJldHVybiBhcnJheVxuICAgICAgICBrZXlBcnIuZm9yRWFjaCgoa2V5OiBhbnkpID0+IHtcbiAgICAgICAgICAgIGRhdGFBcnIucHVzaCh2YWx1ZVtrZXldKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gcmV0dXJuIHRoZSByZXN1bHRpbmcgYXJyYXlcbiAgICAgICAgcmV0dXJuIGRhdGFBcnI7XG4gICAgfVxufVxuXG5AUGlwZSh7XG4gICAgbmFtZTogXCJkYXRhZmlsdGVyXCIsXG4gICAgcHVyZTogZmFsc2Vcbn0pXG5leHBvcnQgY2xhc3MgQXJyYXlGaWx0ZXJQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG4gXG4gICAgdHJhbnNmb3JtKGl0ZW1zOiBBcnJheTxhbnk+LCBjb25kaXRpb25zOiB7W2ZpZWxkOiBzdHJpbmddOiBhbnl9KTogQXJyYXk8YW55PiB7XG4gICAgICAgIHJldHVybiBpdGVtcy5maWx0ZXIoaXRlbSA9PiB7XG4gICAgICAgICAgICBmb3IgKGxldCBmaWVsZCBpbiBjb25kaXRpb25zKSB7XG4gICAgICAgICAgICAgICAgaWYgKGl0ZW1bZmllbGRdICE9PSBjb25kaXRpb25zW2ZpZWxkXSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuXG4iXX0=