"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PhoneNumber = /** @class */ (function () {
    function PhoneNumber() {
    }
    return PhoneNumber;
}());
exports.PhoneNumber = PhoneNumber;
var DocumentType = /** @class */ (function () {
    function DocumentType() {
        this.DocType = "";
        this.DocTypeText = "";
        this.DocLevel = "";
    }
    return DocumentType;
}());
exports.DocumentType = DocumentType;
var ADCByPass = /** @class */ (function () {
    function ADCByPass() {
        this.Text = "";
        this.Value = "";
    }
    return ADCByPass;
}());
exports.ADCByPass = ADCByPass;
var EmergencyPhone = /** @class */ (function () {
    function EmergencyPhone() {
    }
    return EmergencyPhone;
}());
exports.EmergencyPhone = EmergencyPhone;
var APISDocument = /** @class */ (function () {
    function APISDocument() {
        this.DocLevelInd = "1";
        this.DocType = "2";
        this.DocTypeText = "Passport";
        this.isPrimary = true;
        this.Operation = "ADD";
    }
    return APISDocument;
}());
exports.APISDocument = APISDocument;
var EmergencyDetail = /** @class */ (function () {
    function EmergencyDetail() {
        this.EmergencyContactName = "";
        this.EmergencyPhone = new EmergencyPhone();
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
        this.DocTypeText = "Passport";
        this.DocLevel = "";
        this.isPrimary = true;
        this.IsRefValue = false;
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
var ADCResponse = /** @class */ (function () {
    function ADCResponse() {
    }
    return ADCResponse;
}());
exports.ADCResponse = ADCResponse;
var ApisUpdateRequest = /** @class */ (function () {
    function ApisUpdateRequest() {
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
        this.DocumentType = [];
        this.DocTypeIndex = [];
        this.DocIssueCountryIndex = [];
        this.ResidenceCodeIndex = [];
        this.NationalityIndex = [];
        this.DocumentTypeIndexList = [];
        this.ADCByPassNameList = [];
        this.ApisDocoStatus = "";
        this.ADCStatus = "";
    }
    return SecurityModel;
}());
exports.SecurityModel = SecurityModel;
var APISValidation = /** @class */ (function () {
    function APISValidation() {
        this.CountryOfIssue = [];
        this.ExpireDate = [];
        this.DocID = [];
        this.FirstName = [];
        this.LastName = [];
    }
    return APISValidation;
}());
exports.APISValidation = APISValidation;
var Validation = /** @class */ (function () {
    function Validation() {
        this.CountryOfIssue = [];
        this.ExpireDate = [];
        this.DocID = [];
        this.FirstName = [];
        this.LastName = [];
        this.isKnownTraveler = false;
    }
    return Validation;
}());
exports.Validation = Validation;
var APISEnabled = /** @class */ (function () {
    function APISEnabled() {
        this.Nationality = true;
        this.CountryOfIssue = true;
        this.CountryOfResidence = true;
        this.DateOfBirth = true;
        this.ExpireDate = true;
        this.DocID = true;
        this.DocType = true;
        this.FirstName = true;
        this.LastName = true;
        this.Gender = true;
    }
    return APISEnabled;
}());
exports.APISEnabled = APISEnabled;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpcy5tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwaXMubW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTtJQUFBO0lBNEJBLENBQUM7SUFBRCxrQkFBQztBQUFELENBQUMsQUE1QkQsSUE0QkM7QUE1Qlksa0NBQVc7QUFnQ3hCO0lBQUE7UUFJVyxZQUFPLEdBQVcsRUFBRSxDQUFDO1FBRXJCLGdCQUFXLEdBQVcsRUFBRSxDQUFDO1FBRXpCLGFBQVEsR0FBVSxFQUFFLENBQUM7SUFFaEMsQ0FBQztJQUFELG1CQUFDO0FBQUQsQ0FBQyxBQVZELElBVUM7QUFWWSxvQ0FBWTtBQWN6QjtJQUFBO1FBRVcsU0FBSSxHQUFXLEVBQUUsQ0FBQztRQUVsQixVQUFLLEdBQVcsRUFBRSxDQUFDO0lBRTlCLENBQUM7SUFBRCxnQkFBQztBQUFELENBQUMsQUFORCxJQU1DO0FBTlksOEJBQVM7QUFVdEI7SUFBQTtJQTRCQSxDQUFDO0lBQUQscUJBQUM7QUFBRCxDQUFDLEFBNUJELElBNEJDO0FBNUJZLHdDQUFjO0FBOEIzQjtJQUFBO1FBTUksZ0JBQVcsR0FBVyxHQUFHLENBQUM7UUFFMUIsWUFBTyxHQUFXLEdBQUcsQ0FBQztRQUV0QixnQkFBVyxHQUFXLFVBQVUsQ0FBQztRQU1qQyxjQUFTLEdBQVksSUFBSSxDQUFDO1FBcUIxQixjQUFTLEdBQVcsS0FBSyxDQUFDO0lBRTlCLENBQUM7SUFBRCxtQkFBQztBQUFELENBQUMsQUF2Q0QsSUF1Q0M7QUF2Q1ksb0NBQVk7QUEyQ3pCO0lBQUE7UUFFSSx5QkFBb0IsR0FBVyxFQUFFLENBQUM7UUFFbEMsbUJBQWMsR0FBbUIsSUFBSSxjQUFjLEVBQUUsQ0FBQztRQUV0RCwwQkFBcUIsR0FBVyxFQUFFLENBQUM7SUFFdkMsQ0FBQztJQUFELHNCQUFDO0FBQUQsQ0FBQyxBQVJELElBUUM7QUFSWSwwQ0FBZTtBQVk1QjtJQUFBO0lBUUEsQ0FBQztJQUFELHlCQUFDO0FBQUQsQ0FBQyxBQVJE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QztBQUFELENBQUMsQUFyQkQsSUFxQkM7QUFyQlksZ0NBQVU7QUF1QnZCO0lBQUE7UUFDSSxnQkFBVyxHQUFZLElBQUksQ0FBQztRQUM1QixtQkFBYyxHQUFZLElBQUksQ0FBQztRQUMvQix1QkFBa0IsR0FBWSxJQUFJLENBQUM7UUFDbkMsZ0JBQVcsR0FBWSxJQUFJLENBQUM7UUFDNUIsZUFBVSxHQUFZLElBQUksQ0FBQztRQUMzQixVQUFLLEdBQVksSUFBSSxDQUFDO1FBQ3RCLFlBQU8sR0FBWSxJQUFJLENBQUM7UUFDeEIsY0FBUyxHQUFZLElBQUksQ0FBQztRQUMxQixhQUFRLEdBQVksSUFBSSxDQUFDO1FBQ3pCLFdBQU0sR0FBVyxJQUFJLENBQUM7SUFDMUIsQ0FBQztJQUFELGtCQUFDO0FBQUQsQ0FBQyxBQVhELElBV0M7QUFYWSxrQ0FBVyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjbGFzcyBQaG9uZU51bWJlciB7XG5cbiAgICBJc1JlZlZhbHVlOiBib29sZWFuO1xuXG4gICAgVHlwZTogc3RyaW5nO1xuXG4gICAgVHlwZVRleHQ6IHN0cmluZztcblxuICAgIE9wZXJhdGlvbj86IGFueTtcblxuICAgIFRlY2hUeXBlOiBzdHJpbmc7XG5cbiAgICBUZWNoVHlwZVRleHQ6IHN0cmluZztcblxuICAgIFZhbHVlOiBzdHJpbmc7XG5cbiAgICBPU0lUZXh0PzogYW55O1xuXG4gICAgQ2FycmllckNvZGU/OiBhbnk7XG5cbiAgICBSZW1hcms6IHN0cmluZztcblxuICAgIEFyZWFDaXR5Q29kZTogc3RyaW5nO1xuXG4gICAgQ291bnRyeT86IGFueTtcblxuICAgIENvdW50cnlBY2Nlc3NDb2RlPzogYW55O1xuXG59XG5cblxuXG5leHBvcnQgY2xhc3MgRG9jdW1lbnRUeXBlIHtcblxuXG5cbiAgICBwdWJsaWMgRG9jVHlwZTogc3RyaW5nID0gXCJcIjtcblxuICAgIHB1YmxpYyBEb2NUeXBlVGV4dDogc3RyaW5nID0gXCJcIjtcblxuICAgIHB1YmxpYyBEb2NMZXZlbDpzdHJpbmcgPSBcIlwiO1xuXG59XG5cblxuXG5leHBvcnQgY2xhc3MgQURDQnlQYXNzIHtcblxuICAgIHB1YmxpYyBUZXh0OiBzdHJpbmcgPSBcIlwiO1xuXG4gICAgcHVibGljIFZhbHVlOiBzdHJpbmcgPSBcIlwiO1xuXG59XG5cblxuXG5leHBvcnQgY2xhc3MgRW1lcmdlbmN5UGhvbmUge1xuXG4gICAgSXNSZWZWYWx1ZTogYm9vbGVhbjtcblxuICAgIFR5cGU6IHN0cmluZztcblxuICAgIFR5cGVUZXh0PzogYW55O1xuXG4gICAgT3BlcmF0aW9uPzogYW55O1xuXG4gICAgVGVjaFR5cGU/OiBhbnk7XG5cbiAgICBUZWNoVHlwZVRleHQ/OiBhbnk7XG5cbiAgICBWYWx1ZTogc3RyaW5nO1xuXG4gICAgT1NJVGV4dD86IGFueTtcblxuICAgIENhcnJpZXJDb2RlPzogYW55O1xuXG4gICAgUmVtYXJrPzogYW55O1xuXG4gICAgQXJlYUNpdHlDb2RlOiBzdHJpbmc7XG5cbiAgICBDb3VudHJ5OiBzdHJpbmc7XG5cbiAgICBDb3VudHJ5QWNjZXNzQ29kZTogc3RyaW5nO1xuXG59XG5cbmV4cG9ydCBjbGFzcyBBUElTRG9jdW1lbnQge1xuXG4gICAgRmlyc3RuYW1lOiBzdHJpbmc7XG5cbiAgICBTdXJuYW1lOiBzdHJpbmc7XG5cbiAgICBEb2NMZXZlbEluZDogc3RyaW5nID0gXCIxXCI7XG5cbiAgICBEb2NUeXBlOiBzdHJpbmcgPSBcIjJcIjtcblxuICAgIERvY1R5cGVUZXh0OiBzdHJpbmcgPSBcIlBhc3Nwb3J0XCI7XG5cbiAgICBEb2NIb2xkZXJHZW5kZXI6IHN0cmluZztcblxuICAgIGlucHV0VHlwZTogc3RyaW5nO1xuXG4gICAgaXNQcmltYXJ5OiBib29sZWFuID0gdHJ1ZTtcblxuICAgIC8vIGlzc3VpbmdDb3VudHJ5OiBJc3N1aW5nQ291bnRyeTtcbiAgICAvLyBuYXRpb25hbGl0eTogTmF0aW9uYWxpdHk7XG4gICAgLy8gcmVzaWRlbmNlQ291bnRyeTogUmVzaWRlbmNlQ291bnRyeTtcbiAgICBCaXJ0aERhdGU6IHN0cmluZztcblxuICAgIERvY0lEOiBzdHJpbmc7XG5cbiAgICBFeHBpcmVEYXRlOiBzdHJpbmc7XG5cbiAgICBJc1RydXN0ZWREYXRhOiBib29sZWFuO1xuXG4gICAgQ291bnRyeU9mUmVzaWRlbmNlOiBzdHJpbmc7XG5cbiAgICBPQ1JTdHJpbmc6IHN0cmluZztcblxuICAgIERvY0hvbGRlck5hdGlvbmFsaXR5OiBzdHJpbmc7XG5cbiAgICBEb2NJc3N1ZUNvdW50cnk6IHN0cmluZztcblxuICAgIE9wZXJhdGlvbjogc3RyaW5nID0gXCJBRERcIjtcblxufVxuXG5cblxuZXhwb3J0IGNsYXNzIEVtZXJnZW5jeURldGFpbCB7XG5cbiAgICBFbWVyZ2VuY3lDb250YWN0TmFtZTogc3RyaW5nID0gXCJcIjtcblxuICAgIEVtZXJnZW5jeVBob25lOiBFbWVyZ2VuY3lQaG9uZSA9IG5ldyBFbWVyZ2VuY3lQaG9uZSgpO1xuXG4gICAgRW1lcmdlbmN5UmVsYXRpb25zaGlwOiBzdHJpbmcgPSBcIlwiO1xuXG59XG5cblxuXG5leHBvcnQgY2xhc3MgT2xkRW1lcmdlbmN5RGV0YWlsIHtcblxuICAgIEVtZXJnZW5jeVBob25lOiBFbWVyZ2VuY3lQaG9uZTtcblxuICAgIEVtZXJnZW5jeVJlbGF0aW9uc2hpcDogc3RyaW5nO1xuXG4gICAgRW1lcmdlbmN5Q29udGFjdE5hbWU6IHN0cmluZztcblxufVxuXG5cblxuZXhwb3J0IGNsYXNzIENvdW50cnkge1xuXG4gICAgQ291bnRyeU5hbWU6IHN0cmluZztcblxuICAgIENvdW50cnlDb2RlOiBzdHJpbmc7XG5cbiAgICBQaG9uZUFjY2Vzc0NvZGU6IHN0cmluZztcblxufVxuXG5cblxuZXhwb3J0IGNsYXNzIElzc3VpbmdDb3VudHJ5IHtcblxuICAgIGl0ZW06IHN0cmluZyA9IFwiQ291bnRyeUNvZGVcIjtcblxuICAgIGl0ZW1zOiBhbnlbXSA9IFtcIkNvdW50cnlDb2RlXCIsIFwiQ291bnRyeU5hbWVcIl07XG5cbiAgICBsZW5ndGg6IG51bWJlciA9IDI7XG5cbiAgICBpc0FscGhhT25seTogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBjb3VudHJ5OiBDb3VudHJ5ID0gbmV3IENvdW50cnk7XG5cbn1cblxuZXhwb3J0IGNsYXNzIE5hdGlvbmFsaXR5IHtcblxuICAgIGl0ZW06IHN0cmluZyA9IFwiQ291bnRyeUNvZGVcIjtcblxuICAgIGl0ZW1zOiBhbnlbXSA9IFtcIkNvdW50cnlDb2RlXCIsIFwiQ291bnRyeU5hbWVcIl07XG5cbiAgICBsZW5ndGg6IG51bWJlciA9IDI7XG5cbiAgICBpc0FscGhhT25seTogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBjb3VudHJ5OiBDb3VudHJ5ID0gbmV3IENvdW50cnk7XG5cbn1cblxuZXhwb3J0IGNsYXNzIFJlc2lkZW5jZUNvdW50cnkge1xuXG4gICAgaXRlbTogc3RyaW5nID0gXCJDb3VudHJ5Q29kZVwiO1xuXG4gICAgaXRlbXM6IGFueVtdID0gW1wiQ291bnRyeUNvZGVcIiwgXCJDb3VudHJ5TmFtZVwiXTtcblxuICAgIGxlbmd0aDogbnVtYmVyID0gMjtcblxuICAgIGlzQWxwaGFPbmx5OiBib29sZWFuID0gdHJ1ZTtcblxuICAgIGNvdW50cnk6IENvdW50cnkgPSBuZXcgQ291bnRyeTtcblxufVxuXG5cblxuZXhwb3J0IGNsYXNzIERvY3VtZW50IHtcblxuICAgIEZpcnN0bmFtZTogc3RyaW5nO1xuXG4gICAgU3VybmFtZTogc3RyaW5nO1xuXG4gICAgRG9jTGV2ZWxJbmQ6IHN0cmluZyA9IFwiMVwiO1xuXG4gICAgRG9jVHlwZTogc3RyaW5nID0gXCIyXCI7XG5cbiAgICBEb2NUeXBlVGV4dDogc3RyaW5nID0gXCJQYXNzcG9ydFwiO1xuICAgIERvY0xldmVsIDogc3RyaW5nID0gXCJcIjtcbiAgICBEb2NIb2xkZXJHZW5kZXI6IHN0cmluZztcbiAgICBFZmZlY3RpdmVEYXRlICA6IGFueTtcbiAgICBpbnB1dFR5cGU6IHN0cmluZztcblxuICAgIGlzUHJpbWFyeTogYm9vbGVhbiA9IHRydWU7XG5cbiAgICAvLyBpc3N1aW5nQ291bnRyeTogSXNzdWluZ0NvdW50cnk7XG4gICAgLy8gbmF0aW9uYWxpdHk6IE5hdGlvbmFsaXR5O1xuICAgIC8vIHJlc2lkZW5jZUNvdW50cnk6IFJlc2lkZW5jZUNvdW50cnk7XG4gICAgQmlydGhEYXRlOiBzdHJpbmc7XG5cbiAgICBEb2NJRDogc3RyaW5nO1xuXG4gICAgRXhwaXJlRGF0ZTogc3RyaW5nO1xuICAgIElzUmVmVmFsdWUgOiBib29sZWFuID0gZmFsc2U7XG4gICAgSXNUcnVzdGVkRGF0YTogYm9vbGVhbiA9IHRydWU7XG4gICAgSXNWZXJpZmllZERhdGEgOiBib29sZWFuID0gZmFsc2U7XG4gICAgQ291bnRyeU9mUmVzaWRlbmNlOiBzdHJpbmc7XG5cbiAgICBEb2NIb2xkZXJOYXRpb25hbGl0eTogc3RyaW5nO1xuXG4gICAgRG9jSXNzdWVDb3VudHJ5OiBzdHJpbmc7XG5cbiAgICBPcGVyYXRpb246IHN0cmluZyA9IFwiQUREXCI7XG4gICAgXG4gICAgT0NSU3RyaW5nOnN0cmluZztcbn1cblxuXG5cbmV4cG9ydCBjbGFzcyBBcGlzUmVxdWlyZW1lbnQge1xuXG4gICAgRG9jTGV2ZWxJbmQ6IHN0cmluZztcblxuICAgIEFnZW5jeU5hbWU6IHN0cmluZztcblxuICAgIFJlcXVpcmVkQ29kZUxpc3Q6IFtcIjBcIiwgXCIxXCIsIFwiM1wiLCBcIjRcIiwgXCI2XCIsIFwiN1wiLCBcIjlcIiwgXCIxMFwiLCBcIjExXCJdO1xuXG4gICAgRG9jVHlwZTogc3RyaW5nO1xuXG4gICAgRG9jVHlwZVRleHQ6IHN0cmluZztcblxufVxuXG5leHBvcnQgY2xhc3MgQXBpc0FkZHJlc3NSZXF1aXJlbWVudHMge1xuICAgIEFnZW5jeU5hbWU6c3RyaW5nO1xuICAgIFR5cGU6c3RyaW5nO1xufVxuXG5leHBvcnQgY2xhc3MgQURDUmVzcG9uc2V7XG4gICAgQURDUmVzcG9uc2U6c3RyaW5nO1xufVxuXG5leHBvcnQgY2xhc3MgQXBpc1VwZGF0ZVJlcXVlc3Qge1xuXG4gICAgRmlyc3RuYW1lOiBzdHJpbmc7XG5cbiAgICBMYXN0bmFtZTogc3RyaW5nO1xuXG4gICAgU3VybmFtZVJlZk51bWJlcjogc3RyaW5nO1xuXG4gICAgUHJlZml4PzogYW55O1xuXG4gICAgUlBIOiBzdHJpbmc7XG5cbiAgICBFbWFpbHM6IGFueVtdO1xuXG4gICAgR2VuZGVyOiBzdHJpbmc7XG5cbiAgICBQYXNzZW5nZXJUeXBlQ29kZTogc3RyaW5nO1xuXG4gICAgUGhvbmVOdW1iZXJzOiBQaG9uZU51bWJlcltdO1xuXG4gICAgRGF0ZU9mQmlydGg6IHN0cmluZztcblxuICAgIEFnZT86IGFueTtcblxuICAgIEFzc29jaWF0ZWRJbmZhbnRSUEg/OiBhbnk7XG5cbiAgICBBc3NvY2lhdGVkQWR1bHRSUEg/OiBhbnk7XG5cbiAgICBGcXRUcmF2ZWxlcnM6IGFueVtdO1xuXG4gICAgTmF0aW9uYWxpdHk6IHN0cmluZztcblxuICAgIEVtZXJnZW5jeURldGFpbHM6IEVtZXJnZW5jeURldGFpbFtdO1xuXG4gICAgS25vd25UcmF2ZWxlck51bWJlcj86IGFueTtcblxuICAgIFJlZHJlc3NOdW1iZXI/OiBhbnk7XG5cbiAgICBPbGRLbm93blRyYXZlbGVyTnVtYmVyPzogYW55O1xuICAgIFxuICAgIE9sZFJlZHJlc3NOdW1iZXI/OiBhbnk7XG5cbiAgICBGT0lEPzogYW55O1xuXG4gICAgT2xkTmF0aW9uYWxpdHk/OiBhbnk7XG5cbiAgICBPbGREYXRlT2ZCaXJ0aD86IGFueTtcblxuICAgIE9sZEdlbmRlcj86IGFueTtcblxuICAgIE9sZEZPSUQ/OiBhbnk7XG5cbiAgICBPbGRFbWVyZ2VuY3lEZXRhaWxzOiBhbnlbXTtcblxuICAgIEFzc29jaWF0ZWRQYXNzZW5nZXI6IEFzc29jaWF0ZWRQYXNzZW5nZXI7XG5cbiAgICBEb2N1bWVudHM6IERvY3VtZW50W107XG5cbiAgICBBcGlzUmVxdWlyZW1lbnRzOiBBcGlzUmVxdWlyZW1lbnRbXTtcbiAgICBcbiAgICBBcGlzQWRkcmVzc1JlcXVpcmVtZW50czpBcGlzQWRkcmVzc1JlcXVpcmVtZW50c1tdO1xuXG4gICAgQWRkcmVzc2VzOiBhbnlbXTtcblxuICAgIFBTU19HaXZlbk5hbWU6IHN0cmluZztcblxuICAgIEdpdmVuTmFtZVJlZmVyZW5jZU51bWJlcjogc3RyaW5nO1xuXG4gICAgRXhpdERhdGU6IHN0cmluZztcblxuICAgIEV4aXREYXRlSnVzdGlmaWNhdGlvbjogc3RyaW5nO1xuXG4gICAgUHVycG9zZU9mVmlzaXQ6IHN0cmluZztcblxuICAgIEdpdmVuTmFtZTpzdHJpbmc7XG5cbiAgICBTdXJuYW1lOnN0cmluZztcblxufVxuXG5cblxuZXhwb3J0IGNsYXNzIEFzc29jaWF0ZWRQYXNzZW5nZXIge1xuXG4gICAgU3VybmFtZVJlZk51bWJlcjogc3RyaW5nID0gXCJcIjtcblxuICAgIEZpcnN0bmFtZTogc3RyaW5nID0gXCJcIjtcblxuICAgIExhc3RuYW1lOiBzdHJpbmcgPSBcIlwiO1xuXG4gICAgUlBIOiBzdHJpbmcgPSBcIlwiXG5cbn1cblxuXG5cbmV4cG9ydCBjbGFzcyBBZGRyZXNzIHtcblxuICAgIHB1YmxpYyBJc1JlZlZhbHVlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBwdWJsaWMgVHlwZTogc3RyaW5nID0gXCI0XCI7XG5cbiAgICBwdWJsaWMgVHlwZVRleHQ6IHN0cmluZyA9IFwiRGVzdGluYXRpb25cIjtcblxuICAgIHB1YmxpYyBBZGRyZXNzPzogYW55ID0gbnVsbDtcblxuICAgIHB1YmxpYyBQb3N0YWxDb2RlPzogYW55ID0gbnVsbDtcblxuICAgIHB1YmxpYyBDaXR5PzogYW55ID0gbnVsbDtcblxuICAgIHB1YmxpYyBTdGF0ZT86IGFueSA9IG51bGw7XG5cbiAgICBwdWJsaWMgT3BlcmF0aW9uOiBzdHJpbmcgPSBcIkFERFwiO1xuXG4gICAgcHVibGljIEFnZW5jeU5hbWU6IHN0cmluZyA9IFwiXCI7XG5cbiAgICBwdWJsaWMgRG9jTGV2ZWxJbmQ6IHN0cmluZyA9IFwiMVwiO1xuXG4gICAgcHVibGljIEFkZHJlc3NMaW5lUmVxdWlyZWQ6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgcHVibGljIEFkZHJlc3NDaXR5UmVxdWlyZWQ/OiBhbnkgPSBmYWxzZTtcblxuICAgIHB1YmxpYyBBZGRyZXNzUG9zdGFsQ29kZVJlcXVpcmVkPzogYW55ID0gbnVsbDtcblxuICAgIHB1YmxpYyBBZGRyZXNzQ291bnRyeUNvZGVSZXF1aXJlZD86IGFueSA9IGZhbHNlO1xuXG4gICAgcHVibGljIEFkZHJlc3NSZXF1aXJlZD86IGFueSA9IHRydWU7XG5cbiAgICBwdWJsaWMgQ291bnRyeUNvZGU6IHN0cmluZyA9IFwiXCI7XG5cbiAgICBwdWJsaWMgQ291bnRyeTogc3RyaW5nID0gXCJcIjtcblxufVxuXG5cblxuZXhwb3J0IGNsYXNzIFNlY3VyaXR5TW9kZWwge1xuXG4gICAgRmxpZ2h0TnVtYmVyOiBzdHJpbmc7XG5cbiAgICBEZXBhcnR1cmVEYXRlOiBzdHJpbmc7XG5cbiAgICBEZXBhcnR1cmVBaXJwb3J0OiBzdHJpbmc7XG5cbiAgICBCeXBhc3NBREM6IHN0cmluZztcblxuICAgIEFwaXNVcGRhdGVSZXF1ZXN0czogQXBpc1VwZGF0ZVJlcXVlc3RbXTtcblxuICAgIE9yZGVyVXBkYXRlUmVxdWVzdHM/OiBhbnk7XG5cbiAgICBtZXNzYWdlTG9nczogYm9vbGVhbjtcblxuICAgIERvY3VtZW50VHlwZUxpc3Q6IERvY3VtZW50VHlwZVtdO1xuXG4gICAgRG9jdW1lbnRUeXBlOiBhbnlbXSA9IFtdO1xuXG4gICAgRG9jVHlwZUluZGV4OiBhbnkgPSBbXTtcblxuICAgIERvY0lzc3VlQ291bnRyeUluZGV4OiBhbnkgPSBbXTtcblxuICAgIFJlc2lkZW5jZUNvZGVJbmRleDogYW55ID0gW107XG5cbiAgICBOYXRpb25hbGl0eUluZGV4OiBhbnkgPSBbXTtcblxuICAgIFRlbXBEb2N1bWVudFR5cGVMaXN0OiBEb2N1bWVudFR5cGVbXTtcblxuICAgIERvY3VtZW50VHlwZUluZGV4TGlzdDogYW55W10gPSBbXTtcblxuICAgIEFEQ0J5UGFzc0xpc3Q6IEFEQ0J5UGFzc1tdO1xuXG4gICAgQURDQnlQYXNzTmFtZUxpc3Q6IGFueVtdID0gW107XG5cbiAgICBBcGlzRG9jb1N0YXR1czogc3RyaW5nID0gXCJcIjtcblxuICAgIEFEQ1N0YXR1czpzdHJpbmcgPSBcIlwiO1xuXG59XG5leHBvcnQgY2xhc3MgQVBJU1ZhbGlkYXRpb257XG4gICAgTmF0aW9uYWxpdHk6c3RyaW5nO1xuICAgIENvdW50cnlPZklzc3VlOkFycmF5PHN0cmluZz49W107XG4gICAgQ291bnRyeU9mUmVzaWRlbmNlOnN0cmluZztcbiAgICBEYXRlT2ZCaXJ0aDpib29sZWFuO1xuICAgIEV4cGlyZURhdGU6QXJyYXk8Ym9vbGVhbj49W10gO1xuICAgIEV4aXREYXRlOnN0cmluZztcbiAgICBEb2NJRDpBcnJheTxib29sZWFuPj1bXTtcbiAgICBEb2NUeXBlOnN0cmluZztcbiAgICBHZW5kZXI6c3RyaW5nO1xuICAgIEZpcnN0TmFtZTpBcnJheTxib29sZWFuPj1bXTtcbiAgICBMYXN0TmFtZTpBcnJheTxib29sZWFuPj1bXTtcbiAgICBDb3VudHJ5QWRkcmVzczpzdHJpbmc7XG4gICAgaXNBZGRyZXNzOmJvb2xlYW47XG4gICAgaXNDaXR5OmJvb2xlYW47XG4gICAgaXNTdGF0ZTpib29sZWFuO1xuICAgIGlzUG9zdGFsIDogYm9vbGVhbjtcbiAgICBFbWVyZ2VuY3lOYW1lOnN0cmluZztcbiAgICBFbWVyZ2VuY3lDb250YWN0OnN0cmluZztcbiAgICBpc0tub3duVHJhdmVsZXI6Ym9vbGVhbjtcbiAgICBLbm93blRyYXZlbGVyOnN0cmluZztcbiAgICBSZURyZXNzOnN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIFZhbGlkYXRpb257XG4gICAgQ291bnRyeU9mSXNzdWU6QXJyYXk8c3RyaW5nPj1bXTtcbiAgICBDb3VudHJ5T2ZSZXNpZGVuY2U6c3RyaW5nO1xuICAgIERhdGVPZkJpcnRoOmJvb2xlYW47XG4gICAgRXhwaXJlRGF0ZTpBcnJheTxib29sZWFuPj1bXSA7XG4gICAgRXhpdERhdGU6c3RyaW5nO1xuICAgIERvY0lEOkFycmF5PGJvb2xlYW4+PVtdO1xuICAgIERvY1R5cGU6c3RyaW5nO1xuICAgIEdlbmRlcjpzdHJpbmc7XG4gICAgRmlyc3ROYW1lOkFycmF5PGJvb2xlYW4+PVtdO1xuICAgIExhc3ROYW1lOkFycmF5PGJvb2xlYW4+PVtdO1xuICAgIENvdW50cnlBZGRyZXNzOnN0cmluZztcbiAgICBpc0FkZHJlc3M6Ym9vbGVhbjtcbiAgICBpc0NpdHk6Ym9vbGVhbjtcbiAgICBpc1N0YXRlOmJvb2xlYW47XG4gICAgaXNQb3N0YWw6Ym9vbGVhbjtcbiAgICBFbWVyZ2VuY3lOYW1lOnN0cmluZztcbiAgICBFbWVyZ2VuY3lDb250YWN0OnN0cmluZztcbiAgICBpc0tub3duVHJhdmVsZXI6Ym9vbGVhbj1mYWxzZTtcbiAgICBLbm93blRyYXZlbGVyOnN0cmluZztcbiAgICBSZURyZXNzOnN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIEFQSVNFbmFibGVkIHtcbiAgICBOYXRpb25hbGl0eTogYm9vbGVhbiA9IHRydWU7XG4gICAgQ291bnRyeU9mSXNzdWU6IGJvb2xlYW4gPSB0cnVlO1xuICAgIENvdW50cnlPZlJlc2lkZW5jZTogYm9vbGVhbiA9IHRydWU7XG4gICAgRGF0ZU9mQmlydGg6IGJvb2xlYW4gPSB0cnVlO1xuICAgIEV4cGlyZURhdGU6IGJvb2xlYW4gPSB0cnVlO1xuICAgIERvY0lEOiBib29sZWFuID0gdHJ1ZTtcbiAgICBEb2NUeXBlOiBib29sZWFuID0gdHJ1ZTtcbiAgICBGaXJzdE5hbWU6IGJvb2xlYW4gPSB0cnVlO1xuICAgIExhc3ROYW1lOiBib29sZWFuID0gdHJ1ZTtcbiAgICBHZW5kZXI6Ym9vbGVhbiA9IHRydWU7XG59Il19