"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EmergencyPhone = /** @class */ (function () {
    function EmergencyPhone() {
    }
    return EmergencyPhone;
}());
exports.EmergencyPhone = EmergencyPhone;
var EmergencyDetail = /** @class */ (function () {
    function EmergencyDetail() {
        this.EmergencyRelationship = "";
    }
    return EmergencyDetail;
}());
exports.EmergencyDetail = EmergencyDetail;
var OldEmergencyDetail = /** @class */ (function () {
    function OldEmergencyDetail() {
    }
    return OldEmergencyDetail;
}());
exports.OldEmergencyDetail = OldEmergencyDetail;
var Country = /** @class */ (function () {
    function Country() {
    }
    return Country;
}());
exports.Country = Country;
var IssuingCountry = /** @class */ (function () {
    function IssuingCountry() {
        this.item = "CountryCode";
        this.items = ["CountryCode", "CountryName"];
        this.length = 2;
        this.isAlphaOnly = true;
        this.country = new Country;
    }
    return IssuingCountry;
}());
exports.IssuingCountry = IssuingCountry;
var Nationality = /** @class */ (function () {
    function Nationality() {
        this.item = "CountryCode";
        this.items = ["CountryCode", "CountryName"];
        this.length = 2;
        this.isAlphaOnly = true;
        this.country = new Country;
    }
    return Nationality;
}());
exports.Nationality = Nationality;
var ResidenceCountry = /** @class */ (function () {
    function ResidenceCountry() {
        this.item = "CountryCode";
        this.items = ["CountryCode", "CountryName"];
        this.length = 2;
        this.isAlphaOnly = true;
        this.country = new Country;
    }
    return ResidenceCountry;
}());
exports.ResidenceCountry = ResidenceCountry;
var Document = /** @class */ (function () {
    function Document() {
        this.DocLevelInd = "1";
        this.DocType = "2";
        this.DocLevel = "";
        this.isCountryOfResEntered = false;
        this.IsDisabled = false;
        this.isPrimaryDoc = false;
        this.IsRefValue = false;
        this.isSecondaryDoc = false;
        this.DocTypeText = "Passport";
        this.isPrimary = true;
        this.IsTrustedData = true;
        this.IsVerifiedData = false;
        this.Operation = "ADD";
    }
    return Document;
}());
exports.Document = Document;
var ApisRequirement = /** @class */ (function () {
    function ApisRequirement() {
    }
    return ApisRequirement;
}());
exports.ApisRequirement = ApisRequirement;
var ApisAddressRequirements = /** @class */ (function () {
    function ApisAddressRequirements() {
    }
    return ApisAddressRequirements;
}());
exports.ApisAddressRequirements = ApisAddressRequirements;
var ApisUpdateRequest = /** @class */ (function () {
    function ApisUpdateRequest() {
        this.ExitDate = "";
        this.ExitDateJustification = "";
    }
    return ApisUpdateRequest;
}());
exports.ApisUpdateRequest = ApisUpdateRequest;
var AssociatedPassenger = /** @class */ (function () {
    function AssociatedPassenger() {
        this.SurnameRefNumber = "";
        this.Firstname = "";
        this.Lastname = "";
        this.RPH = "";
    }
    return AssociatedPassenger;
}());
exports.AssociatedPassenger = AssociatedPassenger;
var Address = /** @class */ (function () {
    function Address() {
        this.IsRefValue = false;
        this.Type = "4";
        this.TypeText = "Destination";
        this.Address = null;
        this.PostalCode = null;
        this.City = null;
        this.State = null;
        this.Operation = "ADD";
        this.AgencyName = "";
        this.DocLevelInd = "1";
        this.AddressLineRequired = true;
        this.AddressCityRequired = false;
        this.AddressPostalCodeRequired = null;
        this.AddressCountryCodeRequired = false;
        this.AddressRequired = true;
        this.CountryCode = "";
        this.Country = "";
    }
    return Address;
}());
exports.Address = Address;
var SecurityModel = /** @class */ (function () {
    function SecurityModel() {
        this.ApisUpdateRequests = [];
        this.messageLogs = true;
    }
    return SecurityModel;
}());
exports.SecurityModel = SecurityModel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpcy5pbnRlcmZhY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhcGlzLmludGVyZmFjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBO0lBQUE7SUE0QkEsQ0FBQztJQUFELHFCQUFDO0FBQUQsQ0FBQyxBQTVCRCxJQTRCQztBQTVCWSx3Q0FBYztBQWdDM0I7SUFBQTtRQU1JLDBCQUFxQixHQUFXLEVBQUUsQ0FBQztJQUV2QyxDQUFDO0lBQUQsc0JBQUM7QUFBRCxDQUFDLEFBUkQsSUFRQztBQVJZLDBDQUFlO0FBWTVCO0lBQUE7SUFRQSxDQUFDO0lBQUQseUJBQUM7QUFBRCxDQUFDLEFBUkQsSUFRQztBQVJZLGdEQUFrQjtBQVkvQjtJQUFBO0lBUUEsQ0FBQztJQUFELGNBQUM7QUFBRCxDQUFDLEFBUkQsSUFRQztBQVJZLDBCQUFPO0FBWXBCO0lBQUE7UUFFSSxTQUFJLEdBQVcsYUFBYSxDQUFDO1FBRTdCLFVBQUssR0FBVSxDQUFDLGFBQWEsRUFBRSxhQUFhLENBQUMsQ0FBQztRQUU5QyxXQUFNLEdBQVcsQ0FBQyxDQUFDO1FBRW5CLGdCQUFXLEdBQVksSUFBSSxDQUFDO1FBRTVCLFlBQU8sR0FBWSxJQUFJLE9BQU8sQ0FBQztJQUVuQyxDQUFDO0lBQUQscUJBQUM7QUFBRCxDQUFDLEFBWkQsSUFZQztBQVpZLHdDQUFjO0FBYzNCO0lBQUE7UUFFSSxTQUFJLEdBQVcsYUFBYSxDQUFDO1FBRTdCLFVBQUssR0FBVSxDQUFDLGFBQWEsRUFBRSxhQUFhLENBQUMsQ0FBQztRQUU5QyxXQUFNLEdBQVcsQ0FBQyxDQUFDO1FBRW5CLGdCQUFXLEdBQVksSUFBSSxDQUFDO1FBRTVCLFlBQU8sR0FBWSxJQUFJLE9BQU8sQ0FBQztJQUVuQyxDQUFDO0lBQUQsa0JBQUM7QUFBRCxDQUFDLEFBWkQsSUFZQztBQVpZLGtDQUFXO0FBY3hCO0lBQUE7UUFFSSxTQUFJLEdBQVcsYUFBYSxDQUFDO1FBRTdCLFVBQUssR0FBVSxDQUFDLGFBQWEsRUFBRSxhQUFhLENBQUMsQ0FBQztRQUU5QyxXQUFNLEdBQVcsQ0FBQyxDQUFDO1FBRW5CLGdCQUFXLEdBQVksSUFBSSxDQUFDO1FBRTVCLFlBQU8sR0FBWSxJQUFJLE9BQU8sQ0FBQztJQUVuQyxDQUFDO0lBQUQsdUJBQUM7QUFBRCxDQUFDLEFBWkQsSUFZQztBQVpZLDRDQUFnQjtBQWdCN0I7SUFBQTtRQU1JLGdCQUFXLEdBQVcsR0FBRyxDQUFDO1FBRTFCLFlBQU8sR0FBVyxHQUFHLENBQUM7UUFDdEIsYUFBUSxHQUFhLEVBQUUsQ0FBQztRQUV4QiwwQkFBcUIsR0FBYSxLQUFLLENBQUM7UUFDeEMsZUFBVSxHQUFhLEtBQUssQ0FBQztRQUM3QixpQkFBWSxHQUFhLEtBQUssQ0FBQztRQUMvQixlQUFVLEdBQWEsS0FBSyxDQUFDO1FBQzdCLG1CQUFjLEdBQWEsS0FBSyxDQUFDO1FBQ2pDLGdCQUFXLEdBQVcsVUFBVSxDQUFDO1FBTWpDLGNBQVMsR0FBWSxJQUFJLENBQUM7UUFXMUIsa0JBQWEsR0FBWSxJQUFJLENBQUM7UUFDOUIsbUJBQWMsR0FBVyxLQUFLLENBQUM7UUFRL0IsY0FBUyxHQUFXLEtBQUssQ0FBQztJQUk5QixDQUFDO0lBQUQsZUFBQztBQUFELENBQUMsQUE5Q0QsSUE4Q0M7QUE5Q1ksNEJBQVE7QUFrRHJCO0lBQUE7SUFZQSxDQUFDO0lBQUQsc0JBQUM7QUFBRCxDQUFDLEFBWkQsSUFZQztBQVpZLDBDQUFlO0FBYzVCO0lBQUE7SUFHQSxDQUFDO0lBQUQsOEJBQUM7QUFBRCxDQUFDLEFBSEQsSUFHQztBQUhZLDBEQUF1QjtBQU9wQztJQUFBO1FBdUVJLGFBQVEsR0FBVyxFQUFFLENBQUM7UUFFdEIsMEJBQXFCLEdBQVcsRUFBRSxDQUFDO0lBT3ZDLENBQUM7SUFBRCx3QkFBQztBQUFELENBQUMsQUFoRkQsSUFnRkM7QUFoRlksOENBQWlCO0FBb0Y5QjtJQUFBO1FBRUkscUJBQWdCLEdBQVcsRUFBRSxDQUFDO1FBRTlCLGNBQVMsR0FBVyxFQUFFLENBQUM7UUFFdkIsYUFBUSxHQUFXLEVBQUUsQ0FBQztRQUV0QixRQUFHLEdBQVcsRUFBRSxDQUFBO0lBRXBCLENBQUM7SUFBRCwwQkFBQztBQUFELENBQUMsQUFWRCxJQVVDO0FBVlksa0RBQW1CO0FBY2hDO0lBQUE7UUFFVyxlQUFVLEdBQVksS0FBSyxDQUFDO1FBRTVCLFNBQUksR0FBVyxHQUFHLENBQUM7UUFFbkIsYUFBUSxHQUFXLGFBQWEsQ0FBQztRQUVqQyxZQUFPLEdBQVMsSUFBSSxDQUFDO1FBRXJCLGVBQVUsR0FBUyxJQUFJLENBQUM7UUFFeEIsU0FBSSxHQUFTLElBQUksQ0FBQztRQUVsQixVQUFLLEdBQVMsSUFBSSxDQUFDO1FBRW5CLGNBQVMsR0FBVyxLQUFLLENBQUM7UUFFMUIsZUFBVSxHQUFXLEVBQUUsQ0FBQztRQUV4QixnQkFBVyxHQUFXLEdBQUcsQ0FBQztRQUUxQix3QkFBbUIsR0FBWSxJQUFJLENBQUM7UUFFcEMsd0JBQW1CLEdBQVMsS0FBSyxDQUFDO1FBRWxDLDhCQUF5QixHQUFTLElBQUksQ0FBQztRQUV2QywrQkFBMEIsR0FBUyxLQUFLLENBQUM7UUFFekMsb0JBQWUsR0FBUyxJQUFJLENBQUM7UUFFN0IsZ0JBQVcsR0FBVyxFQUFFLENBQUM7UUFFekIsWUFBTyxHQUFXLEVBQUUsQ0FBQztJQUVoQyxDQUFDO0lBQUQsY0FBQztBQUFELENBQUMsQUFwQ0QsSUFvQ0M7QUFwQ1ksMEJBQU87QUF3Q3BCO0lBQUE7UUFVSSx1QkFBa0IsR0FBd0IsRUFBRSxDQUFDO1FBSTdDLGdCQUFXLEdBQVksSUFBSSxDQUFDO0lBRWhDLENBQUM7SUFBRCxvQkFBQztBQUFELENBQUMsQUFoQkQsSUFnQkM7QUFoQlksc0NBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgRW1lcmdlbmN5UGhvbmUge1xuXG4gICAgSXNSZWZWYWx1ZTogYm9vbGVhbjtcblxuICAgIFR5cGU6IHN0cmluZztcblxuICAgIFR5cGVUZXh0PzogYW55O1xuXG4gICAgT3BlcmF0aW9uPzogYW55O1xuXG4gICAgVGVjaFR5cGU/OiBhbnk7XG5cbiAgICBUZWNoVHlwZVRleHQ/OiBhbnk7XG5cbiAgICBWYWx1ZTogc3RyaW5nO1xuXG4gICAgT1NJVGV4dD86IGFueTtcblxuICAgIENhcnJpZXJDb2RlPzogYW55O1xuXG4gICAgUmVtYXJrPzogYW55O1xuXG4gICAgQXJlYUNpdHlDb2RlOiBzdHJpbmc7XG5cbiAgICBDb3VudHJ5OiBzdHJpbmc7XG5cbiAgICBDb3VudHJ5QWNjZXNzQ29kZTogc3RyaW5nO1xuXG59XG5cblxuXG5leHBvcnQgY2xhc3MgRW1lcmdlbmN5RGV0YWlsIHtcblxuICAgIEVtZXJnZW5jeUNvbnRhY3ROYW1lOiBzdHJpbmc7XG5cbiAgICBFbWVyZ2VuY3lQaG9uZTogRW1lcmdlbmN5UGhvbmU7XG5cbiAgICBFbWVyZ2VuY3lSZWxhdGlvbnNoaXA6IHN0cmluZyA9IFwiXCI7XG5cbn1cblxuXG5cbmV4cG9ydCBjbGFzcyBPbGRFbWVyZ2VuY3lEZXRhaWwge1xuXG4gICAgRW1lcmdlbmN5UGhvbmU6IEVtZXJnZW5jeVBob25lO1xuXG4gICAgRW1lcmdlbmN5UmVsYXRpb25zaGlwOiBzdHJpbmc7XG5cbiAgICBFbWVyZ2VuY3lDb250YWN0TmFtZTogc3RyaW5nO1xuXG59XG5cblxuXG5leHBvcnQgY2xhc3MgQ291bnRyeSB7XG5cbiAgICBDb3VudHJ5TmFtZTogc3RyaW5nO1xuXG4gICAgQ291bnRyeUNvZGU6IHN0cmluZztcblxuICAgIFBob25lQWNjZXNzQ29kZTogc3RyaW5nO1xuXG59XG5cblxuXG5leHBvcnQgY2xhc3MgSXNzdWluZ0NvdW50cnkge1xuXG4gICAgaXRlbTogc3RyaW5nID0gXCJDb3VudHJ5Q29kZVwiO1xuXG4gICAgaXRlbXM6IGFueVtdID0gW1wiQ291bnRyeUNvZGVcIiwgXCJDb3VudHJ5TmFtZVwiXTtcblxuICAgIGxlbmd0aDogbnVtYmVyID0gMjtcblxuICAgIGlzQWxwaGFPbmx5OiBib29sZWFuID0gdHJ1ZTtcblxuICAgIGNvdW50cnk6IENvdW50cnkgPSBuZXcgQ291bnRyeTtcblxufVxuXG5leHBvcnQgY2xhc3MgTmF0aW9uYWxpdHkge1xuXG4gICAgaXRlbTogc3RyaW5nID0gXCJDb3VudHJ5Q29kZVwiO1xuXG4gICAgaXRlbXM6IGFueVtdID0gW1wiQ291bnRyeUNvZGVcIiwgXCJDb3VudHJ5TmFtZVwiXTtcblxuICAgIGxlbmd0aDogbnVtYmVyID0gMjtcblxuICAgIGlzQWxwaGFPbmx5OiBib29sZWFuID0gdHJ1ZTtcblxuICAgIGNvdW50cnk6IENvdW50cnkgPSBuZXcgQ291bnRyeTtcblxufVxuXG5leHBvcnQgY2xhc3MgUmVzaWRlbmNlQ291bnRyeSB7XG5cbiAgICBpdGVtOiBzdHJpbmcgPSBcIkNvdW50cnlDb2RlXCI7XG5cbiAgICBpdGVtczogYW55W10gPSBbXCJDb3VudHJ5Q29kZVwiLCBcIkNvdW50cnlOYW1lXCJdO1xuXG4gICAgbGVuZ3RoOiBudW1iZXIgPSAyO1xuXG4gICAgaXNBbHBoYU9ubHk6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgY291bnRyeTogQ291bnRyeSA9IG5ldyBDb3VudHJ5O1xuXG59XG5cblxuXG5leHBvcnQgY2xhc3MgRG9jdW1lbnQge1xuXG4gICAgRmlyc3RuYW1lOiBzdHJpbmc7XG5cbiAgICBTdXJuYW1lOiBzdHJpbmc7XG5cbiAgICBEb2NMZXZlbEluZDogc3RyaW5nID0gXCIxXCI7XG5cbiAgICBEb2NUeXBlOiBzdHJpbmcgPSBcIjJcIjtcbiAgICBEb2NMZXZlbCA6ICBzdHJpbmcgPSBcIlwiO1xuICAgIEVmZmVjdGl2ZURhdGUgOiBEYXRlO1xuICAgIGlzQ291bnRyeU9mUmVzRW50ZXJlZCA6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBJc0Rpc2FibGVkIDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIGlzUHJpbWFyeURvYyA6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBJc1JlZlZhbHVlIDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIGlzU2Vjb25kYXJ5RG9jIDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIERvY1R5cGVUZXh0OiBzdHJpbmcgPSBcIlBhc3Nwb3J0XCI7XG5cbiAgICBEb2NIb2xkZXJHZW5kZXI6IHN0cmluZztcblxuICAgIGlucHV0VHlwZTogc3RyaW5nO1xuXG4gICAgaXNQcmltYXJ5OiBib29sZWFuID0gdHJ1ZTtcblxuICAgIC8vIGlzc3VpbmdDb3VudHJ5OiBJc3N1aW5nQ291bnRyeTtcbiAgICAvLyBuYXRpb25hbGl0eTogTmF0aW9uYWxpdHk7XG4gICAgLy8gcmVzaWRlbmNlQ291bnRyeTogUmVzaWRlbmNlQ291bnRyeTtcbiAgICBCaXJ0aERhdGU6IHN0cmluZztcblxuICAgIERvY0lEOiBzdHJpbmc7XG5cbiAgICBFeHBpcmVEYXRlOiBzdHJpbmc7XG5cbiAgICBJc1RydXN0ZWREYXRhOiBib29sZWFuID0gdHJ1ZTtcbiAgICBJc1ZlcmlmaWVkRGF0YSA6Ym9vbGVhbj0gZmFsc2U7XG5cbiAgICBDb3VudHJ5T2ZSZXNpZGVuY2U6IHN0cmluZztcblxuICAgIERvY0hvbGRlck5hdGlvbmFsaXR5OiBzdHJpbmc7XG5cbiAgICBEb2NJc3N1ZUNvdW50cnk6IHN0cmluZztcblxuICAgIE9wZXJhdGlvbjogc3RyaW5nID0gXCJBRERcIjsgXG4gICAgXG4gICAgT0NSU3RyaW5nOiBzdHJpbmc7XG5cbn1cblxuXG5cbmV4cG9ydCBjbGFzcyBBcGlzUmVxdWlyZW1lbnQge1xuXG4gICAgRG9jTGV2ZWxJbmQ6IHN0cmluZztcblxuICAgIEFnZW5jeU5hbWU6IHN0cmluZztcblxuICAgIFJlcXVpcmVkQ29kZUxpc3Q6IFtcIjBcIiwgXCIxXCIsIFwiM1wiLCBcIjRcIiwgXCI2XCIsIFwiN1wiLCBcIjlcIiwgXCIxMFwiLCBcIjExXCJdO1xuXG4gICAgRG9jVHlwZTogc3RyaW5nO1xuXG4gICAgRG9jVHlwZVRleHQ6IHN0cmluZztcblxufVxuXG5leHBvcnQgY2xhc3MgQXBpc0FkZHJlc3NSZXF1aXJlbWVudHMge1xuICAgIEFnZW5jeU5hbWU6c3RyaW5nO1xuICAgIFR5cGU6c3RyaW5nO1xufVxuXG5cblxuZXhwb3J0IGNsYXNzIEFwaXNVcGRhdGVSZXF1ZXN0IHtcblxuICAgIEZpcnN0bmFtZTogc3RyaW5nO1xuXG4gICAgTGFzdG5hbWU6IHN0cmluZztcblxuICAgIFN1cm5hbWVSZWZOdW1iZXI6IHN0cmluZztcblxuICAgIFByZWZpeD86IGFueTtcblxuICAgIFJQSDogc3RyaW5nO1xuXG4gICAgRW1haWxzOiBhbnlbXTtcblxuICAgIEdlbmRlcjogc3RyaW5nO1xuXG4gICAgR2l2ZW5OYW1lOnN0cmluZztcblxuICAgIFN1cm5hbWU6c3RyaW5nO1xuXG4gICAgR2l2ZW5OYW1lUmVmZXJlbmNlTnVtYmVyOnN0cmluZztcblxuICAgIFBhc3NlbmdlclR5cGVDb2RlOiBzdHJpbmc7XG5cbiAgICBQaG9uZU51bWJlcnM6IGFueVtdO1xuXG4gICAgRGF0ZU9mQmlydGg6IHN0cmluZztcblxuICAgIEFnZT86IGFueTtcblxuICAgIEFzc29jaWF0ZWRJbmZhbnRSUEg/OiBhbnk7XG5cbiAgICBBc3NvY2lhdGVkQWR1bHRSUEg/OiBhbnk7XG5cbiAgICBGcXRUcmF2ZWxlcnM6IGFueVtdO1xuXG4gICAgTmF0aW9uYWxpdHk6IHN0cmluZztcblxuICAgIEVtZXJnZW5jeURldGFpbHM6IEVtZXJnZW5jeURldGFpbFtdO1xuXG4gICAgS25vd25UcmF2ZWxlck51bWJlcj86IGFueTtcblxuICAgIFJlZHJlc3NOdW1iZXI/OiBhbnk7XG5cbiAgICBPbGRLbm93blRyYXZlbGVyTnVtYmVyPzogYW55O1xuICAgIFxuICAgIE9sZFJlZHJlc3NOdW1iZXI/OiBhbnk7XG5cbiAgICBGT0lEPzogYW55O1xuXG4gICAgT2xkTmF0aW9uYWxpdHk/OiBhbnk7XG5cbiAgICBPbGREYXRlT2ZCaXJ0aD86IGFueTtcblxuICAgIE9sZEdlbmRlcj86IGFueTtcblxuICAgIE9sZEZPSUQ/OiBhbnk7XG5cbiAgICBPbGRFbWVyZ2VuY3lEZXRhaWxzOiBhbnlbXTtcblxuICAgIC8vIEFzc29jaWF0ZWRQYXNzZW5nZXI6IEFzc29jaWF0ZWRQYXNzZW5nZXI7XG4gICAgRG9jdW1lbnRzOiBEb2N1bWVudFtdO1xuXG4gICAgQXBpc1JlcXVpcmVtZW50czogQXBpc1JlcXVpcmVtZW50W107XG5cbiAgICBBcGlzQWRkcmVzc1JlcXVpcmVtZW50czpBcGlzQWRkcmVzc1JlcXVpcmVtZW50c1tdO1xuXG4gICAgQWRkcmVzc2VzOiBhbnlbXTtcblxuICAgIFBTU19HaXZlbk5hbWU6IHN0cmluZztcblxuICAgIEV4aXREYXRlOiBzdHJpbmcgPSBcIlwiO1xuXG4gICAgRXhpdERhdGVKdXN0aWZpY2F0aW9uOiBzdHJpbmcgPSBcIlwiO1xuXG4gICAgUHVycG9zZU9mVmlzaXQ6IHN0cmluZztcblxuICAgIElzQWRkZWRJbmZhbnQ/OmJvb2xlYW47XG4gICBcblxufVxuXG5cblxuZXhwb3J0IGNsYXNzIEFzc29jaWF0ZWRQYXNzZW5nZXIge1xuXG4gICAgU3VybmFtZVJlZk51bWJlcjogc3RyaW5nID0gXCJcIjtcblxuICAgIEZpcnN0bmFtZTogc3RyaW5nID0gXCJcIjtcblxuICAgIExhc3RuYW1lOiBzdHJpbmcgPSBcIlwiO1xuXG4gICAgUlBIOiBzdHJpbmcgPSBcIlwiXG5cbn1cblxuXG5cbmV4cG9ydCBjbGFzcyBBZGRyZXNzIHtcblxuICAgIHB1YmxpYyBJc1JlZlZhbHVlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBwdWJsaWMgVHlwZTogc3RyaW5nID0gXCI0XCI7XG5cbiAgICBwdWJsaWMgVHlwZVRleHQ6IHN0cmluZyA9IFwiRGVzdGluYXRpb25cIjtcblxuICAgIHB1YmxpYyBBZGRyZXNzPzogYW55ID0gbnVsbDtcblxuICAgIHB1YmxpYyBQb3N0YWxDb2RlPzogYW55ID0gbnVsbDtcblxuICAgIHB1YmxpYyBDaXR5PzogYW55ID0gbnVsbDtcblxuICAgIHB1YmxpYyBTdGF0ZT86IGFueSA9IG51bGw7XG5cbiAgICBwdWJsaWMgT3BlcmF0aW9uOiBzdHJpbmcgPSBcIkFERFwiO1xuXG4gICAgcHVibGljIEFnZW5jeU5hbWU6IHN0cmluZyA9IFwiXCI7XG5cbiAgICBwdWJsaWMgRG9jTGV2ZWxJbmQ6IHN0cmluZyA9IFwiMVwiO1xuXG4gICAgcHVibGljIEFkZHJlc3NMaW5lUmVxdWlyZWQ6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgcHVibGljIEFkZHJlc3NDaXR5UmVxdWlyZWQ/OiBhbnkgPSBmYWxzZTtcblxuICAgIHB1YmxpYyBBZGRyZXNzUG9zdGFsQ29kZVJlcXVpcmVkPzogYW55ID0gbnVsbDtcblxuICAgIHB1YmxpYyBBZGRyZXNzQ291bnRyeUNvZGVSZXF1aXJlZD86IGFueSA9IGZhbHNlO1xuXG4gICAgcHVibGljIEFkZHJlc3NSZXF1aXJlZD86IGFueSA9IHRydWU7XG5cbiAgICBwdWJsaWMgQ291bnRyeUNvZGU6IHN0cmluZyA9IFwiXCI7XG5cbiAgICBwdWJsaWMgQ291bnRyeTogc3RyaW5nID0gXCJcIjtcblxufVxuXG5cblxuZXhwb3J0IGNsYXNzIFNlY3VyaXR5TW9kZWwge1xuXG4gICAgRmxpZ2h0TnVtYmVyOiBzdHJpbmc7XG5cbiAgICBEZXBhcnR1cmVEYXRlOiBzdHJpbmc7XG5cbiAgICBEZXBhcnR1cmVBaXJwb3J0OiBzdHJpbmc7XG5cbiAgICBCeXBhc3NBREM6IHN0cmluZztcblxuICAgIEFwaXNVcGRhdGVSZXF1ZXN0czogQXBpc1VwZGF0ZVJlcXVlc3RbXSA9IFtdO1xuXG4gICAgT3JkZXJVcGRhdGVSZXF1ZXN0cz86IGFueTtcblxuICAgIG1lc3NhZ2VMb2dzOiBib29sZWFuID0gdHJ1ZTtcblxufSJdfQ==