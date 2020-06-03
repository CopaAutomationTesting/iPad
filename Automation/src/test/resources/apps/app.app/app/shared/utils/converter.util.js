"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var appinterface = require("../../shared/interface/index");
var appmodel = require("../../shared/model/index");
var moment = require("moment");
var app_executiontime_1 = require("../../app.executiontime");
var Toast = require("nativescript-toast");
var ApplicationSettings = require("application-settings");
var index_1 = require("../../shared/model/index");
// import { CompensationPassengerList} from "../../shared/model/index";
var Converters = /** @class */ (function () {
    function Converters(_shared) {
        this._shared = _shared;
        this.PassengerList = [];
        // public static CompensationPassengerDetail: appmodel.CompensationOrderList;
    }
    //Accountrofile
    Converters.ConvertToAccountProfileTemplate = function (response) {
        try {
            var sDate = new Date();
            console.log('Convert Account Profile  --------------- Start Date Time : ' + sDate);
            console.log('Inside convert function For Account Profile');
            var obj_1 = new appinterface.AccontProfileModel.AccountProfileTemplate();
            obj_1.LastName = response.LastName;
            obj_1.FirstName = response.FirstName;
            obj_1.Username = response.Username;
            response.PointOfSales.forEach(function (data, Index) {
                var obj2 = new appinterface.AccontProfileModel.PointOfSales();
                obj2.AirportCode = data.AgentLocationCode;
                obj2.Name = data.Name;
                obj2.ID = data.ID;
                obj2.currencies = data.Currencies;
                obj2.AgentCode = data.AgentCode;
                obj_1.PointOfSales.push(obj2);
            });
            obj_1.AirportCode = response.AirportCode;
            obj_1.ISOCurrencyCode = response.ISOCurrencyCode;
            obj_1.Currencies = response.Currencies;
            obj_1.PhysicalLocation = response.PhysicalLocation;
            obj_1.Requestor_ID = response.Requestor_ID;
            Converters.AccountProfileArray = obj_1;
            console.log(this.AccountProfileArray);
            var eDate = new Date();
            console.log('Convert Account Profile --------------- End Date Time : ' + eDate);
            console.log('Convert Account Profile Execution Time : ' + app_executiontime_1.AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
            return Converters.AccountProfileArray;
        }
        catch (error) {
            console.log(error.message);
        }
    };
    //MultiSegmentPassnger 
    Converters.ConvertToFlightWithPaxTemplate = function (response, allStatus, scTable, etktNumber) {
        try {
            var obj_2 = new appinterface.MultiSegmentTemplate.RootObject();
            console.log("inside Convertor");
            var POSLocation = ApplicationSettings.getString("userdetails", "").substr(0, 3);
            var OriginPosMatch = false;
            var isAnyFlightNotOpen = true;
            var ValidETKTStatus = true;
            var isFirstSegment = true;
            var inboundCheck = true;
            if ((response.Segments != null) && (response.Segments.length > 0)) {
                var objFlightWithPax1_1 = new appinterface.MultiSegmentTemplate.FlightWithPax();
                var isBoardingLoc_1 = true;
                response.Segments.forEach(function (SegElement, SegIndex) {
                    if (SegElement.Origin.AirportCode == POSLocation && inboundCheck && SegElement.Status.StatusCode != "FLOWN" && SegIndex > 0) {
                        inboundCheck = false;
                        var date = "";
                        var origin = "";
                        var flightnum = "";
                        if (response.Segments[SegIndex - 1].MarketingFlight.substr(0, 2) != "CM" && response.Segments[SegIndex - 1].OperatingFlight != null && response.Segments[SegIndex - 1].OperatingFlight.substr(0, 2) == "CM") {
                            flightnum = response.Segments[SegIndex - 1].OperatingFlight;
                        }
                        else {
                            flightnum = response.Segments[SegIndex - 1].MarketingFlight;
                        }
                        date = response.Segments[SegIndex - 1].DepartureDateTime.toString().substr(0, 10);
                        origin = response.Segments[SegIndex - 1].Origin.AirportCode;
                        if (response.Segments[SegIndex - 1].Status.StatusCode != "FLOWN") {
                            objFlightWithPax1_1.InboundDetail = (flightnum + "/" + date + "/" + origin).toString();
                            console.log(objFlightWithPax1_1.InboundDetail);
                        }
                    }
                    //checking Point of sale matches with Origin.
                    if ((SegElement.Origin.AirportCode == POSLocation || OriginPosMatch) && isAnyFlightNotOpen && ValidETKTStatus) {
                        //checking for interline flight 
                        if ((SegElement.MarketingFlight.substr(0, 2) == "CM" && SegElement.OperatingFlight == null) || (SegElement.MarketingFlight.substr(0, 2) != "CM" && SegElement.OperatingFlight != null && SegElement.OperatingFlight.substr(0, 2) == "CM") || OriginPosMatch) {
                            OriginPosMatch = true;
                            ValidETKTStatus = true;
                            if (SegElement.Status != null) {
                                if (SegElement.Status.StatusCode != "FLOWN" && SegElement.Status.StatusCode != "WK") {
                                    if (((SegElement.MarketingFlight.substr(0, 2) != "CM" || SegElement.OperatingFlight != null) && (SegElement.IsWithinCheckInWindow)) || (SegElement.FlightCheckIn.CheckInStatus != "NotApplicable" && SegElement.FlightCheckIn.CheckInStatus != "NotOpen" && SegElement.FlightCheckIn.CheckInStatus != "CancelledThisCity" && SegElement.FlightCheckIn.CheckInStatus != "ReaccommodationInProcess" && SegElement.FlightCheckIn.CheckInStatus != "FinalFCBIssued" && SegElement.FlightCheckIn.CheckInStatus != "DepartedBypassPD" && SegElement.FlightCheckIn.CheckInStatus != "Closed")) {
                                        var objFlightWithPax_1 = new appinterface.MultiSegmentTemplate.FlightWithPax();
                                        objFlightWithPax_1.MarketingFlight = response.Segments[SegIndex].MarketingFlight;
                                        objFlightWithPax_1.OriginCity = SegElement.Origin.City;
                                        objFlightWithPax_1.DestinationCity = SegElement.Destination.City;
                                        objFlightWithPax_1.InboundDetail = objFlightWithPax1_1.InboundDetail;
                                        objFlightWithPax_1.Origin = SegElement.Origin.AirportCode;
                                        objFlightWithPax_1.Destination = SegElement.Destination.AirportCode;
                                        objFlightWithPax_1.FlightStatus = SegElement.Status.StatusDescription;
                                        // objFlightWithPax.STD = SegElement.DepartureDateTime.toString().substr(11, 5);
                                        // objFlightWithPax.ETD = SegElement.DepartureDateTime.toString().substr(11, 5);
                                        // objFlightWithPax.ETA = SegElement.ArrivalDateTime.toString().substr(11, 5);
                                        objFlightWithPax_1.FlightDate = SegElement.DepartureDateTime.toString().substr(0, 10);
                                        objFlightWithPax_1.RPH = SegElement.RPH;
                                        objFlightWithPax_1.DepartureDateTime = SegElement.DepartureDateTime;
                                        objFlightWithPax_1.ArrivalDateTime = SegElement.ArrivalDateTime;
                                        objFlightWithPax_1.MarketingFlight = SegElement.MarketingFlight;
                                        objFlightWithPax_1.DepartureCity = SegElement.Origin.AirportCode;
                                        objFlightWithPax_1.PassengerRPHs = SegElement.PassengerRPHs;
                                        objFlightWithPax_1.RBD = SegElement.RBD;
                                        objFlightWithPax_1.FlightCheckIn = SegElement.FlightCheckIn.CheckInStatus;
                                        objFlightWithPax_1.SegmentRPH = SegElement.RPH;
                                        objFlightWithPax1_1.SegmentRPH = SegElement.RPH;
                                        objFlightWithPax_1.FlightInfo = SegElement.FlightInfo;
                                        objFlightWithPax_1.IsThroughOrChangeOfGaugeFlight = SegElement.IsThroughOrChangeOfGaugeFlight;
                                        objFlightWithPax_1.Selected = SegElement.Selected;
                                        objFlightWithPax_1.Connection = SegElement.Connection;
                                        objFlightWithPax_1.Stopover = SegElement.Stopover;
                                        objFlightWithPax_1.Turnaround = SegElement.Turnaround;
                                        objFlightWithPax_1.StatusNumber = SegElement.Status.StatusNumber;
                                        objFlightWithPax_1.OperatingFlight = SegElement.OperatingFlight;
                                        objFlightWithPax_1.IsInternational = SegElement.IsInternational;
                                        if (SegElement.Origin.AirportCode == POSLocation) {
                                            if (isBoardingLoc_1) {
                                                objFlightWithPax_1.isAPISSeatBagDisabled = false;
                                                isBoardingLoc_1 = false;
                                            }
                                        }
                                        // if(SegElement.IsInternational==false && response.Segments.splice(SegIndex).filter(m=>m.IsInternational==true && m.IsWithinCheckInWindow ==true).length>0){
                                        //     objFlightWithPax.APISRequired = true;
                                        // }else{
                                        //     objFlightWithPax.APISRequired = false;
                                        // }
                                        objFlightWithPax_1.IsFlightRestricted = SegElement.IsFlightRestricted;
                                        response.Passengers.forEach(function (element, index) {
                                            var objPaxTemplate = new appinterface.MultiSegmentTemplate.Passenger();
                                            var count;
                                            count = true;
                                            objPaxTemplate.OrderID = response.ID;
                                            objPaxTemplate.FirstName = element.Firstname;
                                            objPaxTemplate.LastName = element.Lastname;
                                            objPaxTemplate.FullName = element.Fullname;
                                            objPaxTemplate.GivenNameRefNumber = element.GivenNameRefNumber;
                                            if (element.Documents.length == 0) {
                                                console.log("APIS 1");
                                                objFlightWithPax_1.APISRequired = false;
                                            }
                                            else {
                                                console.log("APIS 2");
                                                objFlightWithPax_1.APISRequired = true;
                                            }
                                            // objPaxTemplate.PassengerType = element.PassengerTypeCodeDesc;
                                            if (element.PassengerTypeCodeDesc != "Infant without seat" && response.SegmentTravelerInfos && response.SegmentTravelerInfos.filter(function (m) { return m.PassengerRPH == element.RPH && m.SegmentRPH == SegElement.RPH; })[0].CheckinPassengerTypeCodeDesc) {
                                                console.log("Segment Traveller Info" + response.SegmentTravelerInfos.filter(function (m) { return m.PassengerRPH == element.RPH && m.SegmentRPH == SegElement.RPH; })[0].CheckinPassengerTypeCodeDesc);
                                                objPaxTemplate.PassengerType = response.SegmentTravelerInfos.filter(function (m) { return m.PassengerRPH == element.RPH && m.SegmentRPH == SegElement.RPH; })[0].CheckinPassengerTypeCodeDesc;
                                            }
                                            else if (element.PassengerTypeCodeDesc == "Infant with seat") {
                                                objPaxTemplate.PassengerType = "Child";
                                            }
                                            else {
                                                console.log("Passenger  Info");
                                                objPaxTemplate.PassengerType = element.PassengerTypeCodeDesc;
                                            }
                                            objPaxTemplate.StandbyPassengerType = element.PassengerTypeCode;
                                            objPaxTemplate.Documents = response.Passengers[index].Documents;
                                            objPaxTemplate.CheckinPassengerType = element.CheckinPassengerType;
                                            if (element.PassengerTypeCodeDesc != null && element.PassengerTypeCodeDesc != "") {
                                                objPaxTemplate.INFwithoutSeat = (element.PassengerTypeCodeDesc == "Infant without seat" || element.PassengerTypeCode == "INF") ? true : false;
                                            }
                                            if ((element.EMDs != null) && (element.EMDs.length > 0)) {
                                                console.log('inside emd');
                                                objPaxTemplate.EMD = element.EMDs.length;
                                                //     element.EMDs.forEach((EMDElement, EMDIndex) => {
                                                //         objPaxTemplate.EMD = EMDElement.Code;
                                                //     });
                                            }
                                            objPaxTemplate.ShortCheckinArrivalCodesByFlights = element.ShortCheckinArrivalCodesByFlights;
                                            if (element.ApisDocoStatus != null) {
                                                objPaxTemplate.IsSecurityDocsComplete = (element.ApisDocoStatus.toString().toUpperCase() == "COMPLETE");
                                            }
                                            objPaxTemplate.ApisDocoStatus = element.ApisDocoStatus;
                                            objPaxTemplate.AdcDecisionStatus = element.AdcDecisionStatus;
                                            objPaxTemplate.TierLevel = "HON"; // not mapped
                                            objPaxTemplate.RPH = element.RPH;
                                            // objPaxTemplate.SurnameRefNumber = element.SurnameRefNumber;
                                            objPaxTemplate.PassengerTypeCode = element.PassengerTypeCode;
                                            objPaxTemplate.Selected = element.Selected;
                                            objPaxTemplate.BagCount = element.CheckInBagCountTotal;
                                            objPaxTemplate.AssociatedInfantRPH = element.AssociatedInfantRPH;
                                            objPaxTemplate.AssociatedAdultRPH = element.AssociatedAdultRPH;
                                            objPaxTemplate.FqtTravelers = element.FqtTravelers;
                                            if ((element.FqtTravelers != null) && (element.FqtTravelers.length > 0)) {
                                                element.FqtTravelers.forEach(function (FQTV, FQTVIndex) {
                                                    objPaxTemplate.FQTVNumber = FQTV.MembershipID.split('.')[0];
                                                    objPaxTemplate.ProgramIDxx = FQTV.ProgramID;
                                                    if (FQTV.AllianceTierLevel != null && FQTV.AllianceTierLevel.Name != null) {
                                                        objPaxTemplate.StarLevel = FQTV.AllianceTierLevel.Name;
                                                        objPaxTemplate.LoyalLevel = FQTV.TierLevel.Name;
                                                    }
                                                    else {
                                                        objPaxTemplate.LoyalLevel = FQTV.TierLevel.Name;
                                                    }
                                                });
                                            }
                                            objPaxTemplate.DateOfBirth = element.DateOfBirth;
                                            element.PhoneNumbers.forEach(function (PhoneInfo, PhoneIndex) {
                                                var phoneNumbers = new appinterface.MultiSegmentTemplate.PhoneNumber();
                                                phoneNumbers.IsRefValue = PhoneInfo.IsRefValue;
                                                phoneNumbers.Type = PhoneInfo.Type;
                                                phoneNumbers.TypeText = PhoneInfo.TypeText;
                                                phoneNumbers.TechType = PhoneInfo.TechType;
                                                phoneNumbers.TechTypeText = PhoneInfo.TechTypeText;
                                                phoneNumbers.Value = PhoneInfo.Value;
                                                phoneNumbers.Operation = PhoneInfo.Operation;
                                                phoneNumbers.OSIText = PhoneInfo.OSIText;
                                                phoneNumbers.CarrierCode = PhoneInfo.CarrierCode;
                                                phoneNumbers.Remark = PhoneInfo.Remark;
                                                phoneNumbers.LocationCode = PhoneInfo.LocationCode;
                                                phoneNumbers.AreaCityCode = PhoneInfo.AreaCityCode;
                                                objPaxTemplate.PhoneNumbers.push(phoneNumbers);
                                            });
                                            //
                                            element.Emails.forEach(function (emailInfo, emailIndex) {
                                                if (emailInfo.Value != null) {
                                                    objPaxTemplate.Emails = emailInfo.Value;
                                                }
                                            });
                                            objPaxTemplate.CheckinStatus = false;
                                            objPaxTemplate.SeatNumber = "Auto";
                                            objPaxTemplate.BagCount = 0;
                                            objPaxTemplate.Age = element.Age;
                                            objPaxTemplate.EmergencyDetails = element.EmergencyDetails;
                                            if ((response.SegmentTravelerInfos != null) && (response.SegmentTravelerInfos.length > 0)) {
                                                response.SegmentTravelerInfos.forEach(function (TravelerInfos, SegIndex) {
                                                    if (TravelerInfos.Services != null) {
                                                        if ((objPaxTemplate.RPH == TravelerInfos.Services[0].PassengerRPH && TravelerInfos.SegmentRPH == objFlightWithPax_1.SegmentRPH)) {
                                                            objPaxTemplate.serviceText = TravelerInfos.Services[0].Text;
                                                            if (TravelerInfos.ShortPassDesc == "Infant with seat") {
                                                                objPaxTemplate.SeatNumber = ((TravelerInfos.Seats != null) && (TravelerInfos.Seats[0].SeatNumber != null)) ? TravelerInfos.Seats[0].SeatNumber : "Auto";
                                                            }
                                                            else if (TravelerInfos.ShortPassDesc == "Infant without seat") {
                                                                objPaxTemplate.SeatNumber = "";
                                                            }
                                                        }
                                                    }
                                                    if ((objPaxTemplate.RPH == TravelerInfos.PassengerRPH && TravelerInfos.SegmentRPH == objFlightWithPax_1.SegmentRPH)) {
                                                        //objPaxTemplate.CheckinStatus = (TravelerInfos.CheckinInfos != null && TravelerInfos.CheckinInfos[0].Status.trim() == "Checkedin") ? true : false;
                                                        if (TravelerInfos.CheckinInfos != [] && TravelerInfos.CheckinInfos != null) {
                                                            if (TravelerInfos.CheckinInfos[0].Status == "Checkedin" || TravelerInfos.CheckinInfos[0].Status == "CheckedinStandby" || TravelerInfos.CheckinInfos[0].Status == "CheckedinNonRevSpaceAvailable") {
                                                                objPaxTemplate.CheckinStatus = true;
                                                            }
                                                            if (TravelerInfos.CheckinInfos[0].Status == "CheckedinStandby" || TravelerInfos.CheckinInfos[0].Status == "CheckedinNonRevSpaceAvailable") {
                                                                objPaxTemplate.OnStandby = true;
                                                                objPaxTemplate.BoardingPriority = TravelerInfos.CheckinInfos[0].BoardingPriority;
                                                            }
                                                        }
                                                        if (TravelerInfos.ShortPassDesc == "Child") {
                                                            objPaxTemplate.SeatNumber = ((TravelerInfos.Seats != null) && (TravelerInfos.Seats[0].SeatNumber != null)) ? TravelerInfos.Seats[0].SeatNumber : "Auto";
                                                        }
                                                        objPaxTemplate.PassengerRefNumber = TravelerInfos.PassengerRefNumber;
                                                    }
                                                    if ((objPaxTemplate.RPH == TravelerInfos.PassengerRPH && TravelerInfos.SegmentRPH == objFlightWithPax_1.SegmentRPH)) {
                                                        objPaxTemplate.SeatNumber = ((TravelerInfos.Seats != null) && (TravelerInfos.Seats[0].SeatNumber != null)) ? TravelerInfos.Seats[0].SeatNumber : "Auto";
                                                        objPaxTemplate.Seats = TravelerInfos.Seats;
                                                        if (TravelerInfos.TicketNumbers != null && TravelerInfos.TicketNumbers.length > 0) {
                                                            objPaxTemplate.TicketNumbers = TravelerInfos.TicketNumbers[0];
                                                        }
                                                        if (TravelerInfos.BaggageInfo != null) {
                                                            objPaxTemplate.BagCount = TravelerInfos.BaggageInfo.CheckedBagCountTotal != null ? TravelerInfos.BaggageInfo.CheckedBagCountTotal : 0;
                                                            objPaxTemplate.UnitOfMeasureQuantity = TravelerInfos.BaggageInfo.UnitOfMeasureQuantity != null ? TravelerInfos.BaggageInfo.UnitOfMeasureQuantity : 0;
                                                            objPaxTemplate.UnitOfMeasureCode = TravelerInfos.BaggageInfo.UnitOfMeasureCode != null ? TravelerInfos.BaggageInfo.UnitOfMeasureCode : "";
                                                            objPaxTemplate.BaggageInfo = TravelerInfos.BaggageInfo;
                                                            console.log("inside con" + TravelerInfos.BaggageInfo.CheckedBagCountTotal);
                                                        }
                                                        else {
                                                            objPaxTemplate.BagCount = 0;
                                                            objPaxTemplate.UnitOfMeasureQuantity = 0;
                                                        }
                                                        if (TravelerInfos.Services != null) {
                                                            TravelerInfos.Services.forEach(function (Service, index) {
                                                                if (objPaxTemplate.SSR.filter(function (m) { return m.toString() == Service.Code; }).length == 0) {
                                                                    objPaxTemplate.SSR.push(Service.Code);
                                                                }
                                                                //obj.SSR = Service.Code;
                                                                // if (objPaxTemplate.SSR != "") {
                                                                //     objPaxTemplate.SSR = objPaxTemplate.SSR + "," + Service.Code;
                                                                // }
                                                                // else {
                                                                //     objPaxTemplate.SSR = Service.Code;
                                                                // }
                                                            });
                                                        }
                                                    }
                                                    if (TravelerInfos.CheckinInfos != [] && TravelerInfos.CheckinInfos != null) {
                                                        if (TravelerInfos.CheckinInfos[0].Status == "CheckedinStandby" || TravelerInfos.CheckinInfos[0].Status == "CheckedinNonRevSpaceAvailable") {
                                                            if (objPaxTemplate.SeatNumber == "Auto" && (TravelerInfos.CheckinInfos[0].PassengerAdditionalInfo.IsCabinJumpSeatIndicator || TravelerInfos.CheckinInfos[0].PassengerAdditionalInfo.IsFlightDeckJumpSeatIndicator)) {
                                                                if (TravelerInfos.CheckinInfos[0].PassengerAdditionalInfo.IsCabinJumpSeatIndicator) {
                                                                    objPaxTemplate.SeatNumber = "CBJ";
                                                                }
                                                                else if (TravelerInfos.CheckinInfos[0].PassengerAdditionalInfo.IsFlightDeckJumpSeatIndicator) {
                                                                    objPaxTemplate.SeatNumber = "FDJ";
                                                                }
                                                            }
                                                            else if (objPaxTemplate.SeatNumber == "Auto") {
                                                                objPaxTemplate.SeatNumber = "SBY";
                                                            }
                                                            objPaxTemplate.Seats.forEach(function (seat, index) {
                                                                if ((seat.SeatNumber == null || seat.SeatNumber == "Auto") && (TravelerInfos.CheckinInfos[0].PassengerAdditionalInfo.IsCabinJumpSeatIndicator || TravelerInfos.CheckinInfos[0].PassengerAdditionalInfo.IsFlightDeckJumpSeatIndicator)) {
                                                                    if (TravelerInfos.CheckinInfos[0].PassengerAdditionalInfo.IsCabinJumpSeatIndicator) {
                                                                        seat.SeatNumber = "CBJ";
                                                                    }
                                                                    else if (TravelerInfos.CheckinInfos[0].PassengerAdditionalInfo.IsFlightDeckJumpSeatIndicator) {
                                                                        seat.SeatNumber = "FDJ";
                                                                    }
                                                                }
                                                                else if (seat.SeatNumber == null || seat.SeatNumber == "Auto") {
                                                                    seat.SeatNumber = "SBY";
                                                                }
                                                            });
                                                        }
                                                    }
                                                    objPaxTemplate.SecurityCode = TravelerInfos.SecurityCode;
                                                    objPaxTemplate.SecurityCodeDesc = TravelerInfos.SecurityCodeDesc;
                                                    objPaxTemplate.PrevSeat = objPaxTemplate.SeatNumber;
                                                    objPaxTemplate.SurnameRefNumber = element.SurnameRefNumber;
                                                    console.log("Security: " + TravelerInfos.SecurityCode);
                                                });
                                            }
                                            console.log('Inside covert to flight with pax');
                                            //ETKT Status
                                            if (element.PrimaryTickets != null && element.PrimaryTickets.length > 0) {
                                                if (etktNumber != "" && element.PrimaryTickets.filter(function (m) { return m.PrimaryTicketNumber == etktNumber; }).length > 0) {
                                                    if (element.PrimaryTickets.filter(function (m) { return m.PrimaryTicketNumber == etktNumber; })[0].Tickets != null && element.PrimaryTickets.filter(function (m) { return m.PrimaryTicketNumber == etktNumber; })[0].Tickets.length > 0) {
                                                        if (element.PrimaryTickets.filter(function (m) { return m.PrimaryTicketNumber == etktNumber; })[0].Tickets[0].TicketCoupons != null && element.PrimaryTickets.filter(function (m) { return m.PrimaryTicketNumber == etktNumber; })[0].Tickets[0].TicketCoupons.length > 0) {
                                                            if (element.PrimaryTickets.filter(function (m) { return m.PrimaryTicketNumber == etktNumber; })[0].Tickets[0].TicketCoupons.filter(function (m) { return m.SegmentNumber == SegElement.RPH; }).length > 0) {
                                                                var TicketCoupon = element.PrimaryTickets.filter(function (m) { return m.PrimaryTicketNumber == etktNumber; })[0].Tickets[0].TicketCoupons.filter(function (m) { return m.SegmentNumber == SegElement.RPH && m.Origin == SegElement.Origin.AirportCode; })[0];
                                                                if (TicketCoupon) {
                                                                    if ((SegElement.MarketingFlight.substr(0, 2) != "CM" || (SegElement.OperatingFlight != null && SegElement.OperatingFlight.substr(0, 2) != "CM")) || TicketCoupon.CouponStatusText == "Open" || TicketCoupon.CouponStatusText == "ADJUSTED" || TicketCoupon.CouponStatusText == "CHECKED-IN" || TicketCoupon.CouponStatusText == "LIFTED" || TicketCoupon.CouponStatusText == "BOARDED") {
                                                                    }
                                                                    else {
                                                                        ValidETKTStatus = false;
                                                                        Toast.makeText("Etkt status of the segment are not allowed to checkin").show();
                                                                    }
                                                                }
                                                                else {
                                                                    ValidETKTStatus = false;
                                                                    Toast.makeText("Etkt status of the segment are not allowed to checkin").show();
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                                else {
                                                    if (element.PrimaryTickets[0].Tickets != null && element.PrimaryTickets[0].Tickets.length > 0) {
                                                        if (element.PrimaryTickets[0].Tickets[0].TicketCoupons != null && element.PrimaryTickets[0].Tickets[0].TicketCoupons.length > 0) {
                                                            if (element.PrimaryTickets[0].Tickets[0].TicketCoupons.filter(function (m) { return m.SegmentNumber == SegElement.RPH; }).length > 0) {
                                                                var TicketCoupon = element.PrimaryTickets[0].Tickets[0].TicketCoupons.filter(function (m) { return m.SegmentNumber == SegElement.RPH && m.Origin == SegElement.Origin.AirportCode; })[0];
                                                                if (TicketCoupon) {
                                                                    if ((SegElement.MarketingFlight.substr(0, 2) != "CM" || (SegElement.OperatingFlight != null && SegElement.OperatingFlight.substr(0, 2) != "CM")) || TicketCoupon.CouponStatusText == "Open" || TicketCoupon.CouponStatusText == "ADJUSTED" || TicketCoupon.CouponStatusText == "CHECKED-IN" || TicketCoupon.CouponStatusText == "LIFTED" || TicketCoupon.CouponStatusText == "BOARDED") {
                                                                    }
                                                                    else {
                                                                        ValidETKTStatus = false;
                                                                        Toast.makeText("Etkt status of the segment are not allowed to checkin").show();
                                                                    }
                                                                }
                                                                else {
                                                                    ValidETKTStatus = false;
                                                                    Toast.makeText("Etkt status of the segment are not allowed to checkin").show();
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                            objFlightWithPax_1.Passenger.push(objPaxTemplate);
                                            console.dir(objFlightWithPax_1.Passenger);
                                            console.log('objFlightWithPax.Passenger');
                                        });
                                        //  obj.Segment.push(Obj1);
                                        if (ValidETKTStatus) {
                                            obj_2.Segment.push(objFlightWithPax_1);
                                        }
                                        // console.dir(obj);
                                        console.log('Inside covert to flight with pax');
                                        // console.log(objFlightWithPax.MarketingFlight);
                                    }
                                    else {
                                        isAnyFlightNotOpen = false;
                                    }
                                }
                                else {
                                    OriginPosMatch = false;
                                }
                            }
                        }
                    }
                });
                obj_2.Segment.forEach(function (item, index) {
                    var passengerIndex = 0;
                    response.SegmentTravelerInfos.forEach(function (TravelerInfos, SegIndex) {
                        if (item.RPH == TravelerInfos.SegmentRPH) {
                            obj_2.Segment[index].Passenger[passengerIndex].SecurityCode = TravelerInfos.SecurityCode;
                            obj_2.Segment[index].Passenger[passengerIndex].SecurityCodeDesc = TravelerInfos.SecurityCodeDesc;
                            scTable.forEach(function (element) {
                                if (element.Key == TravelerInfos.SecurityCode) {
                                    obj_2.Segment[index].Passenger[passengerIndex].SecurityValue = element.Value;
                                }
                            });
                            passengerIndex++;
                        }
                    });
                });
                // Passenger Details
                var AssociatedInfantRPH_1 = null;
                obj_2.Segment.forEach(function (segment, segIndex) {
                    segment.Passenger.forEach(function (passenger, index) {
                        if (passenger.CheckinStatus && passenger.AssociatedInfantRPH != null) {
                            AssociatedInfantRPH_1 = passenger.AssociatedInfantRPH;
                        }
                        else if (!passenger.CheckinStatus && passenger.AssociatedInfantRPH != null) {
                            AssociatedInfantRPH_1 = passenger.AssociatedInfantRPH;
                            AssociatedInfantRPH_1 = "false";
                        }
                        if (AssociatedInfantRPH_1 == passenger.RPH) {
                            if (segment.IsInternational) {
                                if (passenger.ApisDocoStatus == "Complete") {
                                    obj_2.Segment[segIndex].Passenger[index].CheckinStatus = true;
                                }
                                else {
                                    obj_2.Segment[segIndex].Passenger[index].CheckinStatus = false;
                                }
                            }
                            else {
                                obj_2.Segment[segIndex].Passenger[index].CheckinStatus = true;
                            }
                            AssociatedInfantRPH_1 = null;
                        }
                        else if (AssociatedInfantRPH_1 == "false") {
                            obj_2.Segment[segIndex].Passenger[index].CheckinStatus = false;
                            AssociatedInfantRPH_1 = null;
                        }
                    });
                });
            }
            // }
            obj_2.Warning = response.Warnings;
            console.dir(obj_2);
            return obj_2;
        }
        catch (error) {
            console.log(error.message);
            // alert(error.message);
            return null;
        }
    };
    Converters.ConvertToPassengerTemplate = function (response, allStatus) {
        try {
            var sDate = new Date();
            console.log('Convert Passenger Template --------------- Start Date Time : ' + sDate);
            Converters.PassengerArray = [new appinterface.PaxTemplate];
            Converters.PassengerArray.length = 0;
            var temp = null;
            if (response.Passengers != null) {
                response.Passengers.forEach(function (element, index) {
                    if (response.ID != null) {
                        // console.dir(element);
                        var obj_3 = new appinterface.PaxTemplate();
                        var count = void 0;
                        count = true;
                        obj_3.OrderID = response.ID;
                        obj_3.FirstName = element.Firstname;
                        obj_3.LastName = element.Lastname;
                        obj_3.FullName = element.Fullname;
                        obj_3.PassengerType = element.PassengerTypeCodeDesc;
                        if (element.PassengerTypeCodeDesc != null && element.PassengerTypeCodeDesc != "") {
                            obj_3.INFwithoutSeat = element.PassengerTypeCodeDesc == "Infant without seat" ? true : false;
                        }
                        if ((element.SSRs != null) && (element.SSRs.length > 0)) {
                            element.SSRs.forEach(function (SSRElement, SSRIndex) {
                                //   obj.SSR = obj.SSR + SSRElement.Code + " "; 
                                obj_3.SSR = SSRElement.Code;
                            });
                        }
                        if ((element.EMDs != null) && (element.EMDs.length > 0)) {
                            element.EMDs.forEach(function (EMDElement, EMDIndex) {
                                //  obj.EMD = obj.EMD + EMDElement.DocumentNumber + " ";
                                obj_3.EMD = EMDElement.Code;
                            });
                        }
                        obj_3.IsSecurityDocsComplete = (element.ApisDocoStatus.toString().toUpperCase() == "COMPLETE");
                        obj_3.ApisDocoStatus = element.ApisDocoStatus;
                        obj_3.TierLevel = ""; // not mapped
                        obj_3.RPH = element.RPH;
                        obj_3.SurnameRefNumber = element.SurnameRefNumber;
                        obj_3.PassengerTypeCode = element.PassengerTypeCode;
                        obj_3.Selected = element.Selected;
                        //obj.BagCount = 0;
                        obj_3.BagCount = element.CheckInBagCountTotal != 0 ? element.CheckInBagCountTotal : 0;
                        if ((element.FqtTravelers != null) && (element.FqtTravelers.length > 0)) {
                            element.FqtTravelers.forEach(function (FQTV, FQTVIndex) {
                                obj_3.FQTVNumber = FQTV.MembershipID;
                                obj_3.ProgramIDxx = FQTV.ProgramID;
                            });
                        }
                        obj_3.DateOfBirth = element.DateOfBirth;
                        element.PhoneNumbers.forEach(function (PhoneInfo, PhoneIndex) {
                            var phoneNumbers = new appinterface.PhoneNumber();
                            phoneNumbers.IsRefValue = PhoneInfo.IsRefValue;
                            phoneNumbers.Type = PhoneInfo.Type;
                            phoneNumbers.TypeText = PhoneInfo.TypeText;
                            phoneNumbers.TechType = PhoneInfo.TechType;
                            phoneNumbers.TechTypeText = PhoneInfo.TechTypeText;
                            phoneNumbers.Value = PhoneInfo.Value;
                            phoneNumbers.Operation = PhoneInfo.Operation;
                            phoneNumbers.OSIText = PhoneInfo.OSIText;
                            phoneNumbers.CarrierCode = PhoneInfo.CarrierCode;
                            phoneNumbers.Remark = PhoneInfo.Remark;
                            phoneNumbers.LocationCode = PhoneInfo.LocationCode;
                            phoneNumbers.AreaCityCode = PhoneInfo.AreaCityCode;
                            obj_3.PhoneNumbers.push(phoneNumbers);
                        });
                        if ((response.Segments != null) && (response.Segments.length > 0)) {
                            response.Segments.forEach(function (SegElement, SegIndex) {
                                if (SegElement.Status.StatusCode != "FLOWN") {
                                    temp = new appinterface.FlightInfo();
                                    temp.MarketingFlight = SegElement.MarketingFlight;
                                    temp.OriginCity = SegElement.Origin.City;
                                    temp.DestinationCity = SegElement.Destination.City;
                                    temp.Origin = SegElement.Origin.AirportCode;
                                    temp.Destination = SegElement.Destination.AirportCode;
                                    temp.FlightStatus = SegElement.Status.StatusDescription;
                                    temp.status = allStatus != null ? allStatus.Flights[0].Legs[0].Status : "";
                                    temp.STD = SegElement.DepartureDateTime.toString().substr(11, 5);
                                    temp.ETD = SegElement.DepartureDateTime.toString().substr(11, 5);
                                    temp.ETA = SegElement.ArrivalDateTime.toString().substr(11, 5);
                                    temp.FlightDate = SegElement.DepartureDateTime.toString().substr(0, 10);
                                    temp.RPH = SegElement.RPH;
                                    temp.DepartureDateTime = SegElement.DepartureDateTime;
                                    temp.ArrivalDateTime = SegElement.ArrivalDateTime;
                                    temp.MarketingFlight = SegElement.MarketingFlight;
                                    temp.DepartureCity = SegElement.Origin.AirportCode;
                                    //have to do sheets
                                    temp.RBD = SegElement.RBD;
                                    temp.FlightCheckIn = SegElement.FlightCheckIn.CheckInStatus;
                                    // have to do PassengerRPHs
                                    temp.SegmentRPH = SegElement.RPH;
                                    temp.IsThroughOrChangeOfGaugeFlight = SegElement.IsThroughOrChangeOfGaugeFlight;
                                    temp.Selected = SegElement.Selected;
                                    temp.Connection = SegElement.Connection;
                                    temp.Stopover = SegElement.Stopover;
                                    temp.Turnaround = SegElement.Turnaround;
                                    temp.StatusNumber = SegElement.Status.StatusNumber;
                                    temp.OperatingFlight = SegElement.OperatingFlight;
                                    obj_3.CheckinStatus = false;
                                    obj_3.SeatNumber = "Auto";
                                    obj_3.BagCount = 0;
                                    if ((response.SegmentTravelerInfos != null) && (response.SegmentTravelerInfos.length > 0)) {
                                        response.SegmentTravelerInfos.forEach(function (TravelerInfos, SegIndex) {
                                            if (TravelerInfos.Services != null) {
                                                if ((obj_3.RPH == TravelerInfos.Services[0].PassengerRPH && TravelerInfos.SegmentRPH == temp.SegmentRPH)) {
                                                    obj_3.serviceText = TravelerInfos.Services[0].Text;
                                                    if (TravelerInfos.ShortPassDesc == "Infant with seat") {
                                                        obj_3.SeatNumber = ((TravelerInfos.Seats != null) && (TravelerInfos.Seats[0].SeatNumber != null)) ? TravelerInfos.Seats[0].SeatNumber : "Auto";
                                                    }
                                                    else if (TravelerInfos.ShortPassDesc == "Infant without seat") {
                                                        obj_3.SeatNumber = "";
                                                    }
                                                }
                                            }
                                            if ((obj_3.RPH == TravelerInfos.PassengerRPH && TravelerInfos.SegmentRPH == temp.SegmentRPH)) {
                                                obj_3.CheckinStatus = (TravelerInfos.CheckinInfos != null && TravelerInfos.CheckinInfos[0].Status.trim() == "Checkedin") ? true : false;
                                                if (TravelerInfos.ShortPassDesc == "Child") {
                                                    obj_3.SeatNumber = ((TravelerInfos.Seats != null) && (TravelerInfos.Seats[0].SeatNumber != null)) ? TravelerInfos.Seats[0].SeatNumber : "Auto";
                                                }
                                            }
                                            if ((obj_3.RPH == TravelerInfos.PassengerRPH && TravelerInfos.SegmentRPH == temp.SegmentRPH)) {
                                                if (TravelerInfos.ShortPassDesc == "") {
                                                    obj_3.SeatNumber = ((TravelerInfos.Seats != null) && (TravelerInfos.Seats[0].SeatNumber != null)) ? TravelerInfos.Seats[0].SeatNumber : "Auto";
                                                }
                                                if (TravelerInfos.BaggageInfo != null) {
                                                    obj_3.BagCount = TravelerInfos.BaggageInfo.CheckedBagCountTotal != null ? TravelerInfos.BaggageInfo.CheckedBagCountTotal : 0;
                                                    obj_3.BaggageInfo = TravelerInfos.BaggageInfo;
                                                    console.log("inside con" + TravelerInfos.BaggageInfo.CheckedBagCountTotal);
                                                }
                                                else {
                                                    obj_3.BagCount = 0;
                                                }
                                                if (TravelerInfos.Services != null) {
                                                    TravelerInfos.Services.forEach(function (Service, index) {
                                                        //obj.SSR = Service.Code;
                                                        obj_3.SSR.push(Service.Code);
                                                        // if (obj.SSR != "") {
                                                        //     obj.SSR = obj.SSR + "," + Service.Code;
                                                        // }
                                                        // else {
                                                        //     obj.SSR = Service.Code;
                                                        // }
                                                    });
                                                }
                                            }
                                        });
                                    }
                                    obj_3.FlightDetails.push(temp);
                                }
                            });
                        }
                        Converters.PassengerArray.push(obj_3);
                    }
                });
            }
            // console.log(this.PassengerArray[0].FirstName);
            // console.log(this.PassengerArray[0].FullName);
            var eDate = new Date();
            console.log('Convert Passenger Template --------------- End Date Time : ' + eDate);
            console.log('Convert Passenger Template Execution Time : ' + app_executiontime_1.AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
            console.dir(Converters.PassengerArray);
            return Converters.PassengerArray;
        }
        catch (error) {
            console.log(error.message);
        }
    };
    Converters.ConvertToDepartureTemplate = function (response, destination, gatenumber, args) {
        try {
            var sDate = new Date();
            console.log('Convert Departure Template --------------- Start Date Time : ' + sDate);
            console.log("Inside convert function For Departures" + JSON.stringify(response));
            Converters.CompleteDepartureArray.length = 0;
            if (response.AirportDepartures != null) {
                response.AirportDepartures.forEach(function (element, index) {
                    var obj = new appinterface.DepartureInfo1.Departure();
                    obj.FlightStatus = response.AirportDepartures[index].FlightStatus;
                    obj.CheckinStatus = response.AirportDepartures[index].CheckInStatus;
                    obj.Destination = response.AirportDepartures[index].Destination;
                    obj.Gate = response.AirportDepartures[index].Gate;
                    obj.FlightNumber = "CM" + response.AirportDepartures[index].FlightNumber;
                    obj.DestinationAirport = response.AirportDepartures[index].DestinationAirport;
                    switch (obj.FlightStatus) {
                        case "ONTIME":
                            obj.Color = "#00A973";
                            break;
                        case "BOARDING":
                            obj.Color = "#00A973";
                            break;
                        case "CLOSED":
                            obj.Color = "#666666";
                            break;
                        case "DIVERTED":
                            obj.Color = "#666666";
                            break;
                        case "CANCELLED":
                            obj.Color = "#D7410B";
                            break;
                        case "DELAYED":
                            obj.Color = "#D7410B";
                            break;
                        default: obj.Color = "#00008B";
                    }
                    obj.STD = response.AirportDepartures[index].ScheduledDepartureDate.toString().substr(11, 5);
                    obj.ETD = response.AirportDepartures[index].ExpectedDepartureDate.toString().substr(11, 5);
                    obj.Date = moment(response.AirportDepartures[index].ExpectedDepartureDate).format("YYYY-MM-DD");
                    console.log("Date" + obj.Date);
                    obj.STA = response.AirportDepartures[index].ScheduledArrivalDate.toString().substr(11, 5);
                    element.configurations.forEach(function (configelement, configindex) {
                        var config = new appinterface.DepartureInfo1.Configuration();
                        config.BoardingTime = configelement.BoardingTime;
                        config.Booked = configelement.Booked;
                        config.Capacity = configelement.Capacity;
                        config.CodeLetter = configelement.CodeLetter;
                        obj.configuration.push(config);
                    });
                    Converters.CompleteDepartureArray.push(obj);
                });
            }
            if (args == "des") {
                if (destination.trim() == "") {
                    this.DepartureArray = this.CompleteDepartureArray;
                }
                else {
                    console.log(this.CompleteDepartureArray);
                    this.DepartureArray = this.CompleteDepartureArray.filter(function (r) { return r.Destination.toLowerCase() == destination.toLowerCase() || r.DestinationAirport.toLowerCase() == destination.toLowerCase(); });
                    console.log(this.DepartureArray);
                }
            }
            else {
                if (gatenumber.trim() == "") {
                    this.DepartureArray = this.DepartureArray;
                }
                else {
                    this.DepartureArray = this.DepartureArray.filter(function (r) { return r.Gate.toLowerCase() == gatenumber.toLowerCase(); });
                }
            }
            // if (this.DepartureArray.length > 12) {
            //     this.DepartureArray = this.DepartureArray.slice(0, 12);
            // }
            var eDate = new Date();
            console.log('Convert Departure Template --------------- End Date Time : ' + eDate);
            console.log('Convert Departure Template Execution Time : ' + app_executiontime_1.AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
            return Converters.DepartureArray;
        }
        catch (error) {
            console.log(error.message);
        }
    };
    Converters.ConvertToDepartureTemplateforStatus = function (response) {
        try {
            var sDate = new Date();
            console.log('Convert Departure Template Status --------------- Start Date Time : ' + sDate);
            console.log('Inside convert function For Departures');
            Converters.DepartureArrayforFQTV.length = 0;
            response.AirportDepartures.forEach(function (element, index) {
                var obj = new appinterface.DepartureInfo();
                obj.FlightStatus = response.AirportDepartures[index].FlightStatus;
                obj.CheckinStatus = response.AirportDepartures[index].CheckInStatus;
                Converters.DepartureArrayforFQTV.push(obj);
            });
            var eDate = new Date();
            console.log('Convert Departure Template Status --------------- End Date Time : ' + eDate);
            console.log('Convert Departure Template Status Execution Time : ' + app_executiontime_1.AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
            return Converters.DepartureArrayforFQTV;
        }
        catch (error) {
            console.log(error.message);
        }
    };
    Converters.ConvertToPassengerListTemplate = function (response) {
        try {
            var sDate = new Date();
            console.log('ConvertToPassengerListTemplate --------------- Start Date Time : ' + sDate);
            console.log('Inside convert function');
            Converters.PassengerList.length = 0;
            if (response.Passengers != null) {
                response.Passengers.forEach(function (element, index) {
                    var obj = new appinterface.PassengerListTemplate();
                    obj.OrderID = response.ID;
                    obj.FullName = element.Fullname;
                    obj.SSR = element.SSRs.toString();
                    response.Segments.forEach(function (SegElement, SegIndex) {
                        if (SegElement.RPH == element.RPH) {
                            obj.From = SegElement.Origin.AirportCode;
                            obj.To = SegElement.Destination.AirportCode;
                        }
                    });
                    Converters.PassengerList.push(obj);
                });
                console.log(this.PassengerList[0].FirstName);
                console.log(this.PassengerList[0].FullName);
            }
            var eDate = new Date();
            console.log('ConvertToPassengerListTemplate --------------- End Date Time : ' + eDate);
            console.log('ConvertToPassengerListTemplate Execution Time : ' + app_executiontime_1.AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
            return Converters.PassengerList;
        }
        catch (error) {
            console.log(error.message);
        }
    };
    Converters.ConvertToPassList = function (response) {
        try {
            var sDate = new Date();
            console.log('ConvertToPassList --------------- Start Date Time : ' + sDate);
            console.log('Inside convert function');
            Converters.PassengerNewList.length = 0;
            response.Passengers.forEach(function (element, index) {
                var obj = new appinterface.PassengerList();
                obj.OrderID = response.ID;
                obj.FullName = element.Fullname;
                obj.SSR = element.SSRs.toString();
                response.Segments.forEach(function (SegElement, SegIndex) {
                    if (SegElement.RPH == element.RPH) {
                        obj.From = SegElement.Origin.AirportCode;
                        obj.To = SegElement.Destination.AirportCode;
                    }
                });
                Converters.PassengerNewList.push(obj);
            });
            console.log(this.PassengerNewList[0].FirstName);
            console.log(this.PassengerNewList[0].FullName);
            var eDate = new Date();
            console.log('ConvertToPassList --------------- End Date Time : ' + eDate);
            console.log('ConvertToPassList Execution Time : ' + app_executiontime_1.AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
            return Converters.PassengerNewList;
        }
        catch (error) {
            console.log(error.message);
        }
    };
    Converters.ConvertToPaxByFlightTemplate = function (response) {
        try {
            var sDate = new Date();
            console.log('ConvertToPaxByFlightTemplate --------------- Start Date Time : ' + sDate);
            console.log('Inside convert function');
            Converters.PassengerList.length = 0;
            response.PassengerList.forEach(function (element, index) {
                console.log('Inside convert function');
                var obj = new appinterface.PassengerListTemplate();
                obj.OrderID = element.OrderId;
                obj.FullName = element.GivenName + " / " + element.Surname;
                obj.From = response.FlightInfo.DepartureAirport;
                obj.To = response.FlightInfo.DestinationAirport;
                obj.IsSecurityDocsComplete = element.SecurityCode == "Y" ? true : false;
                obj.BagCount = element.CheckedBagCount;
                obj.SeatNumber = element.SeatNumber;
                Converters.PassengerList.push(obj);
            });
            console.log(this.PassengerList[0].OrderID);
            console.log(this.PassengerList[0].FullName);
            var eDate = new Date();
            console.log('ConvertToPaxByFlightTemplate --------------- End Date Time : ' + eDate);
            console.log('ConvertToPaxByFlightTemplate Execution Time : ' + app_executiontime_1.AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
            return Converters.PassengerList;
        }
        catch (error) {
            console.log(error.message);
        }
    };
    Converters.ConvertToPaxByFlightTemplateNew = function (response) {
        try {
            var sDate = new Date();
            console.log('ConvertToPaxByFlightTemplateNew --------------- Start Date Time : ' + sDate);
            console.log('Inside convert function');
            Converters.PassengerNewList.length = 0;
            //obj.OrderID = response.ID;
            console.log(response.PassengerList.length);
            if (response != null) {
                response.PassengerList.forEach(function (element, index) {
                    var obj = new appinterface.PassengerList();
                    obj.OrderID = element.OrderId;
                    if (element.GivenName != null) {
                        obj.FullName = element.Surname + " / " + element.GivenName;
                    }
                    else {
                        obj.FullName = element.Surname;
                    }
                    obj.FirstName = element.GivenName;
                    obj.LastName = element.Surname;
                    obj.InfantIndicator = element.InfantIndicator;
                    obj.PassengerType = element.PassengerType;
                    if (element.PassengerCharacteristics != null) {
                        element.PassengerCharacteristics.forEach(function (element, index) {
                            if (element == "Oversold") {
                                obj.Oversold = true;
                            }
                        });
                    }
                    //  if (element.PassengerCharacteristics != null) {
                    //     element.PassengerCharacteristics.forEach((element, index) => {
                    //     if (element == "TicketOutOfSync") {
                    //         obj.SyncTicket = true;
                    //     }
                    // });
                    //  }
                    if (element.PassengerCharacteristics != null) {
                        element.PassengerCharacteristics.forEach(function (element, index) {
                            if (element == "TicketOutOfSync") {
                                obj.SyncTicket = true;
                            }
                        });
                    }
                    if (element.PassengerCharacteristics != null) {
                        element.PassengerCharacteristics.forEach(function (element, index) {
                            if (element == "OnStandby") {
                                obj.OnStandby = true;
                            }
                        });
                    }
                    if (element.FqtTravelers != null) {
                        if (element.FqtTravelers[0].TierLevel != null && element.FqtTravelers[0].TierLevel.Name != "") {
                            obj.TierLevel = element.FqtTravelers[0].TierLevel.Name;
                        }
                        else {
                            obj.TierLevel = element.FqtTravelers[0].AllianceTierLevel.Name;
                        }
                    }
                    if (element.BoardingPriority != null) {
                        obj.BoardPriority = element.BoardingPriority;
                    }
                    //obj.AssociatedAdultRPH=element.
                    if ((element.SSRs != null) && (element.SSRs.length > 0)) {
                        element.SSRs.forEach(function (SSRElement, SSRIndex) {
                            if (SSRElement == "INFT") {
                                if ((element.SpecialServiceRequest != null) && (element.SpecialServiceRequest.length > 0)) {
                                    element.SpecialServiceRequest.forEach(function (ServiceRequest, SSRIndex) {
                                        if (ServiceRequest.SSRCode == "INFT") {
                                            if (ServiceRequest.Text != null && ServiceRequest.Text.split('.').length > 0)
                                                obj.InfantName = ServiceRequest.Text.split('.')[1];
                                        }
                                    });
                                }
                            }
                            obj.SSRCount = obj.SSRCount + 1;
                            obj.SSR = SSRElement;
                        });
                    }
                    obj.From = response.FlightInfo.DepartureAirport;
                    obj.To = response.FlightInfo.DestinationAirport;
                    obj.IsSecurityDocsComplete = false;
                    if (element.PassengerCharacteristics != null) {
                        element.PassengerCharacteristics.forEach(function (element, index) {
                            if (element == "APISCompleted") {
                                obj.IsSecurityDocsComplete = true;
                            }
                        });
                    }
                    if (element.Status != null) {
                        if (element.Status == "Checkedin" || element.Status == "CheckedinStandby" || element.Status == "CheckedinNonRevSpaceAvailable") {
                            obj.CheckinStatus = true;
                        }
                    }
                    //obj.CheckinStatus = element.Status == "Checkedin" ? true : false
                    obj.BagCount = element.CheckedBagCount;
                    // obj.SeatNumber = element.SeatNumber;
                    if (element.SeatList != null) {
                        if (element.SeatList[0].SeatNumber != null) {
                            obj.SeatNumber = element.SeatList[0].SeatNumber + "  " + element.SeatList[0].Cabin;
                        }
                    }
                    else {
                        obj.SeatNumber = null;
                    }
                    if (element.Status != null) {
                        if (element.Status == "CheckedinStandby" || element.Status == "CheckedinNonRevSpaceAvailable") {
                            if (obj.SeatNumber == null) {
                                obj.SeatNumber = "SBY";
                            }
                        }
                    }
                    Converters.PassengerNewList.push(obj);
                    console.log("+++++++++++++++" + obj.SeatNumber);
                });
            }
            var eDate = new Date();
            console.log('ConvertToPaxByFlightTemplateNew --------------- End Date Time : ' + eDate);
            console.log('ConvertToPaxByFlightTemplateNew Execution Time : ' + app_executiontime_1.AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
            return Converters.PassengerNewList;
        }
        catch (error) {
            console.log(error.message);
        }
    };
    Converters.ConvertToPaxByFlightforDepartureTemplate = function (response, checkind, location) {
        try {
            var sDate = new Date();
            console.log('ConvertToPaxByFlightforDepartureTemplate --------------- Start Date Time : ' + sDate);
            console.log('Inside convert function');
            Converters.PaxListDepartures.length = 0;
            Converters.PaxListDeparturesNC.length = 0;
            if (response != null) {
                response.PassengerList.forEach(function (element, index) {
                    var obj = new appinterface.DeparturePaxList();
                    obj.OrderId = element.OrderId;
                    console.log(element.OrderId);
                    // obj.FullName = element.Surname + " / " + element.GivenName;
                    if (element.GivenName != null) {
                        obj.FullName = element.Surname + " / " + element.GivenName;
                        obj.GivenName = element.GivenName;
                    }
                    else {
                        obj.FullName = element.Surname;
                    }
                    obj.PassengerType = element.PassengerType;
                    obj.Surname = element.Surname;
                    obj.DepartureCode = location;
                    obj.Dest = element.Dest;
                    obj.IsChecked = false;
                    obj.CheckedBagCount = element.CheckedBagCount;
                    obj.InfantIndicator = element.InfantIndicator;
                    if (element.FqtTravelers != null) {
                        // if(element.FqtTravelers[0].AllianceTierLevel != null && element.FqtTravelers[0].AllianceTierLevel.Code != null){
                        //   switch(element.FqtTravelers[0].AllianceTierLevel.Code){
                        //     case "0": obj.TierLevel="";
                        //             break;
                        //     case "1": obj.TierLevel= "GOLD";
                        //             break;
                        //     case "2": obj.TierLevel="SILVER";
                        //             break;
                        //     case "3": obj.TierLevel="PLATINUM";
                        //             break;
                        //     case "4": obj.TierLevel="PRESIDENTIAL PLATINUM";
                        //             break;
                        //     default: obj.TierLevel="";
                        // }
                        // }
                        if (element.FqtTravelers[0].TierLevel != null && element.FqtTravelers[0].TierLevel.Name != "") {
                            obj.TierLevel = element.FqtTravelers[0].TierLevel.Name;
                        }
                        else {
                            obj.TierLevel = element.FqtTravelers[0].AllianceTierLevel.Name;
                        }
                    }
                    if (element.PassengerCharacteristics != null) {
                        element.PassengerCharacteristics.forEach(function (element, index) {
                            if (element == "OnStandby") {
                                obj.OnStandby = true;
                            }
                        });
                    }
                    if (element.PassengerCharacteristics != null) {
                        element.PassengerCharacteristics.forEach(function (element, index) {
                            if (element == "Oversold") {
                                obj.Oversold = true;
                            }
                        });
                    }
                    if (element.PassengerCharacteristics != null) {
                        element.PassengerCharacteristics.forEach(function (element, index) {
                            if (element == "TicketOutOfSync") {
                                obj.SyncTicket = true;
                            }
                        });
                    }
                    if (element.BoardingPriority != null) {
                        obj.BoardPriority = element.BoardingPriority;
                    }
                    if (element.SeatList != null) {
                        if (element.SeatList[0].SeatNumber != null && element.SeatList[0].Cabin) {
                            obj.SeatNumber = element.SeatList[0].SeatNumber + "  " + element.SeatList[0].Cabin;
                        }
                        else if (element.SeatList[0].SeatNumber != null) {
                            obj.SeatNumber = element.SeatList[0].SeatNumber;
                        }
                    }
                    else {
                        obj.SeatNumber = null;
                    }
                    if ((element.SSRs != null) && (element.SSRs.length > 0)) {
                        element.SSRs.forEach(function (SSRElement, SSRIndex) {
                            if (SSRElement == "INFT") {
                                obj.SSRcount = SSRElement;
                                if ((element.SpecialServiceRequest != null) && (element.SpecialServiceRequest.length > 0)) {
                                    element.SpecialServiceRequest.forEach(function (ServiceRequest, SSRIndex) {
                                        if (ServiceRequest.SSRCode == "INFT") {
                                            if (ServiceRequest.Text != null && ServiceRequest.Text.split('.').length > 0)
                                                obj.InfantName = ServiceRequest.Text.split('.')[1];
                                        }
                                    });
                                }
                            }
                            obj.ssrcount = obj.ssrcount + 1;
                            obj.SSRcount = SSRElement;
                        });
                    }
                    if (element.Status != null) {
                        if (element.Status == "CheckedinStandby" || element.Status == "CheckedinNonRevSpaceAvailable") {
                            if (obj.SeatNumber == null) {
                                obj.SeatNumber = "SBY";
                            }
                        }
                    }
                    if (element.Status != null) {
                        if (element.Status == "Checkedin" || element.Status == "CheckedinStandby" || element.Status == "CheckedinNonRevSpaceAvailable") {
                            obj.CheckinStatus = true;
                        }
                    }
                    //obj.CheckinStatus = element.Status == "Checkedin" ? true : false
                    if (element.PassengerCharacteristics != null) {
                        element.PassengerCharacteristics.forEach(function (element, index) {
                            if (element == "APISCompleted") {
                                obj.IsSecurityDocsComplete = true;
                            }
                        });
                    }
                    Converters.PaxListDepartures.push(obj);
                });
            }
            // if (checkind == 1) {
            //     console.log("Inside checkin");
            // this.PaxListDeparturesNC = this.PaxListDepartures.filter(r => r.CheckinStatus);
            this.PaxListDeparturesNC = this.PaxListDepartures;
            // }
            // else {
            //     this.PaxListDeparturesNC = this.PaxListDepartures.filter(r => r.CheckinStatus == false);;
            // }
            var eDate = new Date();
            console.log('ConvertToPaxByFlightforDepartureTemplate --------------- End Date Time : ' + eDate);
            console.log('ConvertToPaxByFlightforDepartureTemplate Execution Time : ' + app_executiontime_1.AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
            return Converters.PaxListDeparturesNC;
        }
        catch (error) {
            console.log(error.message);
        }
    };
    Converters.ConvertToFQTVTemplate = function (response) {
        try {
            var sDate = new Date();
            console.log('ConvertToFQTVTemplate --------------- Start Date Time : ' + sDate);
            Converters.FQTVList.length = 0;
            var temp = null;
            var POSLocation = ApplicationSettings.getString("userdetails", "").substr(0, 3);
            if (response != null) {
                response.OrderFQTVStatus.forEach(function (element, index) {
                    if (element.Origin != null && element.Origin == POSLocation) {
                        var obj = new appinterface.FQTVInfo();
                        obj.OrderID = element.OrderID;
                        obj.FlightNumber = element.FlightNumber;
                        obj.PassengerName = element.PassengerName;
                        obj.Status = element.Status;
                        Converters.FQTVList.push(obj);
                    }
                });
            }
            console.log("TEST FQTV");
            // console.log(this.FQTVList[0].OrderID);
            // console.log(this.FQTVList[0].PassengerName);
            // console.log(this.FQTVList[0].FlightNumber);
            var eDate = new Date();
            console.log('ConvertToFQTVTemplate --------------- End Date Time : ' + eDate);
            console.log('ConvertToFQTVTemplate Execution Time : ' + app_executiontime_1.AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
            return Converters.FQTVList;
        }
        catch (error) {
            console.log(error.message);
        }
    };
    Converters.ConvertToInventory = function (response) {
        try {
            //console.log("inside ConvertToInventory");
            // var obj = new MultiSegmentTemplate.inven();
            var obj = new Array();
            if (response.DisplayBookinCount[0] != null) {
                response.DisplayBookinCount.forEach(function (invEle, invIndex) {
                    var obj1 = new appinterface.MultiSegmentTemplate.inven();
                    obj1.CodeLetter = invEle.BookingCompartment;
                    obj1.Booking = invEle.TotalBooked;
                    obj1.Capacity = invEle.Capacity;
                    //console.log("before push");
                    obj.push(obj1);
                    // console.log(obj.inven.length);
                    //console.log("inside converter");
                });
            }
            // obj.CodeLetter = response.Collection[0].FlightLegInventory[0].BookingCompartmentInventory[0].BookingCompartment;
            //  console.log("W"+ obj);
            //console.log("end of converter");
            return obj;
        }
        catch (ex) {
            console.log(ex.message);
        }
    };
    Converters.ConvertToInBound = function (response) {
        try {
            console.log("inside ConvertToInventory");
            var obj = new appinterface.InBound.Inbou();
            var inboundCount = 0;
            if (response != null) {
                if (response.InboundFlights != null) {
                    response.InboundFlights.forEach(function (element, Index) {
                        inboundCount = inboundCount + element.PassengerCount;
                        // console.log("inside InBound " + inboundCount)
                    });
                }
            }
            obj.PassengerCount = inboundCount;
            return inboundCount;
        }
        catch (ex) {
            console.log(ex.message);
        }
    };
    Converters.ConvertToFQTV = function (response) {
        try {
            var obj_4 = new appinterface.MultiSegmentTemplate.Passenger();
            obj_4.FqtvPrograms = new Array();
            if (response != null) {
                if (response.ReferenceInfo != null) {
                    response.ReferenceInfo[0].FqtvPrograms.forEach(function (element, index) {
                        var obj1 = new appinterface.MultiSegmentTemplate.FqtvClassPrograms();
                        obj1.ProgramID = element.Value.ProgramID;
                        obj1.ProgramName = element.Value.ProgramID + "/" + element.Value.Carrier;
                        // console.log("before push fqtv");
                        obj_4.FqtvPrograms.push(obj1);
                        //console.log(obj1.ProgramID);
                        //console.log(obj1.ProgramName);
                    });
                }
            }
            else {
                var obj1 = new appinterface.MultiSegmentTemplate.FqtvClassPrograms();
                obj1.ProgramID = "";
                obj1.ProgramName = "";
                obj_4.FqtvPrograms.push(obj1);
            }
            return obj_4.FqtvPrograms;
        }
        catch (ex) {
            console.log(ex.message);
        }
    };
    Converters.ConvertToCheckInPostTemplate = function (response, id, SelectedPassenger, segmentList, checkintype, ShortCheckAirportCode, CheckedBags) {
        try {
            var sDate = new Date();
            console.log('ConvertToCheckInPostTemplate --------------- Start Date Time : ' + sDate);
            var postTemp = new appinterface.MultiSegmentTemplate.RootObject();
            console.log("Inside convert to checkin template");
            console.log(response.length);
            var temprph = "0";
            var obj_5 = new appinterface.CheckInPostTemplate.RootObject();
            if (id == "CheckIn") {
                if (checkintype == "Waitlist") {
                    //  obj.CheckInType = "CheckIn";
                    obj_5.CheckInType = "Waitlist";
                }
                else if (checkintype == "UpdatePassengerInfo") {
                    obj_5.CheckInType = "UpdatePassengerInfo";
                    obj_5.IsFQTVUpdate = true;
                }
                else {
                    obj_5.CheckInType = "CheckIn";
                }
            }
            else {
                obj_5.CheckInType = "ChangeSeat";
            }
            obj_5.PassengerList = new Array();
            obj_5.SegmentList = Array();
            obj_5.IsInterlineCheckin = false;
            if (SelectedPassenger.length > 0) {
                SelectedPassenger.forEach(function (elements, index) {
                    var responseData = segmentList.Passenger.filter(function (m) { return m.FirstName == elements.FirstName && m.LastName == elements.LastName; })[0];
                    var tempPassengerList = new appinterface.CheckInPostTemplate.PassengerList();
                    if (responseData.PassengerTypeCode != "INF") {
                        tempPassengerList.GivenName = responseData.FirstName;
                        tempPassengerList.Surname = responseData.LastName;
                        tempPassengerList.SurnameRefNumber = responseData.SurnameRefNumber;
                        tempPassengerList.SurnameRefNumberCount = responseData.SurnameRefNumberCount;
                        if (responseData.PassengerTypeCode != "INS") {
                            tempPassengerList.PassengerTypeCode = responseData.PassengerTypeCode;
                        }
                        else {
                            tempPassengerList.PassengerTypeCode = "ADT";
                        }
                        if (responseData.ShortCheckAirportCode != "") {
                            tempPassengerList.ShortCheckAirportCode = responseData.ShortCheckAirportCode;
                        }
                        tempPassengerList.PassengerRefNumber = responseData.PassengerRefNumber;
                        tempPassengerList.PhoneNumbers = [];
                        tempPassengerList.OrderId = responseData.OrderID;
                        tempPassengerList.RPH = responseData.RPH;
                        tempPassengerList.AssociatedInfantRPH = responseData.AssociatedInfantRPH;
                        tempPassengerList.AssociatedAdultRPH = responseData.AssociatedAdultRPH;
                        tempPassengerList.Age = responseData.Age;
                        tempPassengerList.EmergencyDetails = responseData.EmergencyDetails;
                        tempPassengerList.Firstname = responseData.FirstName;
                        tempPassengerList.Lastname = responseData.LastName;
                        tempPassengerList.Selected = true;
                        tempPassengerList.FreeBaggageCount = 2;
                        tempPassengerList.ApisStatus = responseData.ApisDocoStatus;
                        tempPassengerList.Status = "CheckedinNonRevSpaceAvailable";
                        if (responseData.BagCount == null || responseData.BagCount == 0) {
                            tempPassengerList.CheckedBagCount = 0;
                            // tempPassengerList.IsBaggageChecked = false;
                        }
                        else {
                            tempPassengerList.CheckedBagCount = responseData.BagCount;
                            // tempPassengerList.IsBaggageChecked = true;
                        }
                        console.log(CheckedBags);
                        if (CheckedBags != null && CheckedBags.length > 0 && CheckedBags.filter(function (m) { return m.RPH == responseData.RPH; }).length > 0) {
                            tempPassengerList.CheckedBags = CheckedBags.filter(function (m) { return m.RPH == responseData.RPH; })[0].CheckedBags;
                            obj_5.Source = "TAB";
                            var baggage = CheckedBags.filter(function (m) { return m.RPH == responseData.RPH; })[0].CheckedBags;
                            baggage[0].BaggageInfo.BagTagDetails.forEach(function (element, index) {
                                element.ShortCheckAirportCode = responseData.ShortCheckAirportCode;
                            });
                            if (CheckedBags.filter(function (m) { return m.RPH == responseData.RPH; })[0].isManualBag) {
                                obj_5.isManualBag = true;
                            }
                            else {
                                obj_5.isManualBag = false;
                            }
                            if (ApplicationSettings.getBoolean("isHostBagtag")) {
                                obj_5.BoardingPassDeliveryDetail = [];
                                var BoardingPrint = new appinterface.BagTagPrint.BoardingPassDeliveryDetail();
                                var office = ApplicationSettings.getString("hostBagtagOffice", "");
                                var Worksatation = ApplicationSettings.getString("hostBagtagWS", "");
                                var DeviceName = ApplicationSettings.getString("bagtagDeviceName", "");
                                var DeviceType = ApplicationSettings.getString("BTdeviceType", "");
                                var PectabVersion = ApplicationSettings.getString("bagtagpectabVersion", "");
                                obj_5.BluetoothBagTag = false;
                                BoardingPrint.Email = null;
                                BoardingPrint.Gateway = "WS";
                                BoardingPrint.PrinterAddress = "MyPrinter123";
                                BoardingPrint.Printer = new appinterface.BoardingPass.Printer();
                                BoardingPrint.Printer.DeviceName = DeviceName;
                                BoardingPrint.Printer.ClientCode = "CM";
                                BoardingPrint.Printer.OfficeName = office;
                                BoardingPrint.Printer.PectabVersion = PectabVersion;
                                BoardingPrint.Printer.WorkstationName = Worksatation;
                                BoardingPrint.Printer.DeviceType = DeviceType;
                                // bagTagDetail.DeliveryDetail = BoardingPrint;
                                obj_5.BoardingPassDeliveryDetail.push(BoardingPrint);
                            }
                            else {
                                obj_5.BoardingPassDeliveryDetail = [];
                                var BoardingPrint = new appinterface.BagTagPrint.BoardingPassDeliveryDetail();
                                BoardingPrint.Printer = new appinterface.BoardingPass.Printer();
                                obj_5.BluetoothBagTag = true;
                                obj_5.BoardingPassDeliveryDetail.push(BoardingPrint);
                            }
                            console.log(CheckedBags);
                        }
                        if (CheckedBags != null && CheckedBags.length > 0 && CheckedBags.filter(function (m) { return m.RPH == responseData.RPH; }).length > 0) {
                            tempPassengerList.CheckinRePrint = false;
                            tempPassengerList.CheckInBagWeightTotal = CheckedBags.filter(function (m) { return m.RPH == responseData.RPH; })[0].CheckedBags[0].BaggageInfo.CheckedBagWeightTotal;
                            tempPassengerList.CheckInBagCountTotal = CheckedBags.filter(function (m) { return m.RPH == responseData.RPH; })[0].CheckedBags[0].BaggageInfo.CheckedBagCountTotal;
                        }
                        // tempPassengerList.CheckedBags
                        // tempPassengerList.Status  = ""
                        var tempFFPgm = new appinterface.CheckInPostTemplate.FqtTraveler();
                        tempFFPgm.MembershipID = responseData.FQTVNumber == "" ? null : responseData.FQTVNumber;
                        tempFFPgm.ProgramID = responseData.ProgramIDxx == "" ? null : responseData.ProgramIDxx;
                        if (responseData.FQTVNumber != null) {
                            tempPassengerList.FqtTravelers.push(tempFFPgm);
                        }
                        obj_5.PassengerList.push(tempPassengerList);
                        if (obj_5.SegmentList.length == 0) {
                            var tempSegmentList = new appinterface.CheckInPostTemplate.SegmentList();
                            tempSegmentList.RPH = segmentList.SegmentRPH;
                            tempSegmentList.OrderId = segmentList.Passenger[0].OrderID;
                            tempSegmentList.DepartureDateTime = segmentList.DepartureDateTime;
                            if (segmentList.MarketingFlight.substr(0, 2) == "CM") {
                                tempSegmentList.MarketingFlight = segmentList.MarketingFlight;
                            }
                            else if (segmentList.OperatingFlight != null && segmentList.OperatingFlight.substr(0, 2) == "CM") {
                                tempSegmentList.MarketingFlight = segmentList.MarketingFlight;
                                tempSegmentList.OperatingFlight = segmentList.OperatingFlight;
                            }
                            else {
                                tempSegmentList.MarketingFlight = segmentList.MarketingFlight;
                            }
                            tempSegmentList.Selected = true;
                            tempSegmentList.DepartureCity = segmentList.DepartureCity;
                            tempSegmentList.ArrivalCity = segmentList.Destination;
                            // obj.PassengerList.push(tempPassengerList);
                            obj_5.SegmentList.push(tempSegmentList);
                            tempSegmentList = null;
                        }
                    }
                    tempPassengerList = null;
                });
            }
            else {
                Toast.makeText("Please select the passenger").show();
            }
            console.log("after checkintype original");
            // console.log(obj);
            console.log(JSON.stringify(obj_5));
            var eDate = new Date();
            console.log('ConvertToCheckInPostTemplate --------------- End Date Time : ' + eDate);
            console.log('ConvertToCheckInPostTemplate Execution Time : ' + app_executiontime_1.AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
            return obj_5;
        }
        catch (error) {
            console.log(error.message);
        }
    };
    Converters.ConvertToWaitlistCheckInPostTemplate = function (response, id, SelectedPassenger, segmentList, checkintype, ShortCheckAirportCode, CheckedBags) {
        try {
            var sDate = new Date();
            console.log('ConvertToCheckInPostTemplate --------------- Start Date Time : ' + sDate);
            var postTemp = new appinterface.MultiSegmentTemplate.RootObject();
            console.log("Inside convert to checkin template");
            console.log(response.length);
            var temprph = "0";
            var obj_6 = new appinterface.CheckInPostTemplate.WaitlistRootObject();
            obj_6.CheckInType = "Waitlist";
            obj_6.PassengerList = new Array();
            obj_6.SegmentList = Array();
            obj_6.BoardingPassDeliveryDetail = null;
            if (SelectedPassenger.length > 0) {
                SelectedPassenger.forEach(function (elements, index) {
                    var responseData = segmentList.Passenger.filter(function (m) { return m.FirstName == elements.FirstName && m.LastName == elements.LastName; })[0];
                    var tempPassengerList = new appinterface.CheckInPostTemplate.WaitListPassenger();
                    if (responseData.PassengerTypeCode != "INF") {
                        tempPassengerList.GivenName = responseData.FirstName;
                        tempPassengerList.Surname = responseData.LastName;
                        tempPassengerList.SurnameRefNumber = responseData.SurnameRefNumber;
                        tempPassengerList.SurnameRefNumberCount = responseData.SurnameRefNumberCount;
                        tempPassengerList.RPH = responseData.RPH;
                        tempPassengerList.Emails = [];
                        tempPassengerList.PassengerTypeCode = "ADT";
                        tempPassengerList.PassengerRefNumber = responseData.PassengerRefNumber;
                        tempPassengerList.PhoneNumbers = [];
                        tempPassengerList.AssociatedInfantRPH = null;
                        tempPassengerList.AssociatedAdultRPH = null;
                        tempPassengerList.FqtTravelers = [];
                        tempPassengerList.EmergencyDetails = responseData.EmergencyDetails;
                        tempPassengerList.Status = null;
                        tempPassengerList.OldEmergencyDetails = null;
                        tempPassengerList.OrderId = responseData.OrderID;
                        tempPassengerList.CheckedBagCount = 0;
                        tempPassengerList.addPartialMember = null;
                        tempPassengerList.UnitOfMeasureCode = null;
                        tempPassengerList.UnitOfMeasureQuantity = null;
                        tempPassengerList.OldKnownTravelerNumber = null;
                        tempPassengerList.OldRedressNumber = null;
                        tempPassengerList.FOID = null;
                        tempPassengerList.Firstname = responseData.FirstName;
                        tempPassengerList.Lastname = responseData.LastName;
                        tempPassengerList.Selected = true;
                        tempPassengerList.FreeBaggageCount = 2;
                        tempPassengerList.ApisStatus = responseData.ApisDocoStatus;
                        obj_6.PassengerList.push(tempPassengerList);
                        if (obj_6.SegmentList.length == 0) {
                            var tempSegmentList = new appinterface.CheckInPostTemplate.SegmentList();
                            tempSegmentList.RPH = segmentList.SegmentRPH;
                            tempSegmentList.OrderId = segmentList.Passenger[0].OrderID;
                            tempSegmentList.DepartureDateTime = segmentList.DepartureDateTime;
                            if (segmentList.MarketingFlight.substr(0, 2) == "CM") {
                                tempSegmentList.MarketingFlight = segmentList.MarketingFlight;
                            }
                            else if (segmentList.OperatingFlight != null && segmentList.OperatingFlight.substr(0, 2) == "CM") {
                                tempSegmentList.MarketingFlight = segmentList.MarketingFlight;
                                tempSegmentList.OperatingFlight = segmentList.OperatingFlight;
                            }
                            else {
                                tempSegmentList.MarketingFlight = segmentList.MarketingFlight;
                            }
                            tempSegmentList.Selected = true;
                            tempSegmentList.DepartureCity = segmentList.DepartureCity;
                            tempSegmentList.ArrivalCity = segmentList.Destination;
                            obj_6.SegmentList.push(tempSegmentList);
                        }
                    }
                });
            }
            else {
                Toast.makeText("Please select the passenger").show();
            }
            console.log("after checkintype original");
            console.log(JSON.stringify(obj_6));
            var eDate = new Date();
            console.log('ConvertToCheckInPostTemplate --------------- End Date Time : ' + eDate);
            console.log('ConvertToCheckInPostTemplate Execution Time : ' + app_executiontime_1.AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
            return obj_6;
        }
        catch (error) {
            console.log(error.message);
        }
    };
    Converters.UpgradeOrDowngradeChangesConvertor = function (response, SelectedPassenger, segmentList, UpgrdaeResponse) {
        try {
            var UpgradeObj_1 = new appinterface.UpgradeInfo.RootObject();
            UpgradeObj_1.CheckInType = "RequestUpgrade";
            var SegObj = new appinterface.UpgradeInfo.SegmentList();
            SegObj.DepartureCity = segmentList.DepartureCity;
            SegObj.DepartureDateTime = segmentList.DepartureDateTime;
            SegObj.MarketingFlight = segmentList.MarketingFlight;
            SegObj.RPH = segmentList.SegmentRPH;
            SegObj.Selected = true;
            UpgradeObj_1.SegmentList.push(SegObj);
            SelectedPassenger.forEach(function (PaxData, PaxIndex) {
                var responseData = segmentList.Passenger.filter(function (m) { return m.FirstName == PaxData.FirstName && m.LastName == PaxData.LastName; })[0];
                var PaxObj = new appinterface.UpgradeInfo.PassengerList();
                PaxObj.GivenName = responseData.FirstName;
                PaxObj.Surname = responseData.LastName;
                PaxObj.Emails = responseData.Emails;
                PaxObj.PassengerTypeCode = responseData.PassengerTypeCode;
                PaxObj.PassengerRefNumber = responseData.PassengerRefNumber;
                PaxObj.PhoneNumbers = responseData.PhoneNumbers;
                PaxObj.FqtTravelers = [];
                PaxObj.EmergencyDetails = [];
                PaxObj.Status = "Held";
                PaxObj.IsHeldSeat = true;
                PaxObj.OrderId = responseData.OrderID;
                PaxObj.CheckedBagCount = 0;
                PaxObj.RPH = responseData.RPH;
                PaxObj.Firstname = responseData.FirstName;
                PaxObj.Lastname = responseData.LastName;
                PaxObj.Selected = true;
                PaxObj.AssociatedInfantRPH = null;
                UpgradeObj_1.PassengerList.push(PaxObj);
            });
            var UpdowngradeObj = new appinterface.UpgradeInfo.UpgradeDowngradeInfo();
            UpdowngradeObj.IsVoluntary = UpgrdaeResponse.IsVoluntary;
            UpdowngradeObj.BookingClass = UpgrdaeResponse.BookingClass;
            UpdowngradeObj.ReasonCode = UpgrdaeResponse.ReasonCode;
            UpgradeObj_1.UpgradeDowngradeInfo = UpdowngradeObj;
            response.forEach(function (SegData, SegIndex) {
                SelectedPassenger.forEach(function (PaxData, PaxIndex) {
                    if (segmentList.SegmentRPH == SegData.SegmentRPH) {
                        var SegTravelObj = new appinterface.UpgradeInfo.SegmentTravelerInfo();
                        var responseData = SegData.Passenger.filter(function (m) { return m.FirstName == PaxData.FirstName && m.LastName == PaxData.LastName; })[0];
                        SegTravelObj.PassengerRPH = responseData.RPH;
                        SegTravelObj.SegmentRPH = SegData.SegmentRPH;
                        var SeatObj = new appinterface.UpgradeInfo.Seat();
                        SeatObj.SeatAvailability = null;
                        SeatObj.SeatNumber = responseData.SeatNumber;
                        SeatObj.SeatCharacteristics = null;
                        SeatObj.DepartureCode = SegData.DepartureCity;
                        SeatObj.ArrivalCode = SegData.Destination;
                        SeatObj.Cabin = responseData.Cabin;
                        SeatObj.IsThruSeatNeeded = false;
                        SeatObj.NewSeatNumber = "";
                        SegTravelObj.Seats.push(SeatObj);
                        SegTravelObj.PassengerFullName = responseData.FullName;
                        var ChechinInfoObj = new appinterface.UpgradeInfo.CheckinInfo();
                        ChechinInfoObj.OriginalBookingClass = SegData.RBD;
                        SegTravelObj.CheckinInfos.push(ChechinInfoObj);
                        SegTravelObj.Selected = true;
                        UpgradeObj_1.SegmentTravelerInfo.push(SegTravelObj);
                    }
                });
            });
            console.dir(UpgradeObj_1);
            return UpgradeObj_1;
        }
        catch (error) {
            console.log(error.message);
        }
    };
    Converters.ConvertToPassengersDetail = function (response, PassedPassengerDetail, CountryList, CountryItems, ADCbyPass) {
        try {
            var sDate = new Date();
            console.log('Convert Passenger Details --------------- Start Date Time : ' + sDate);
            Converters.SecurityDocs = new appmodel.SecurityModel();
            Converters.SecurityDocs = null;
            console.dir(response);
            //obj.OrderID = response.ID;
            var obj_7 = new appmodel.SecurityModel();
            obj_7.ApisUpdateRequests = [new appmodel.ApisUpdateRequest];
            obj_7.ApisUpdateRequests[0].Addresses = [new appmodel.Address()];
            obj_7.ApisUpdateRequests[0].Addresses.length = 0;
            obj_7.ApisUpdateRequests[0].Documents = [new appmodel.Document()];
            obj_7.ApisUpdateRequests[0].Documents.length = 0;
            obj_7.DocumentTypeIndexList = [];
            obj_7.ApisUpdateRequests[0].ApisRequirements = [new appmodel.ApisRequirement()];
            obj_7.ApisUpdateRequests[0].ApisAddressRequirements = [];
            var sortTypeOrder_1;
            var typeOrder_1;
            obj_7.DocumentTypeList = [new appmodel.DocumentType()];
            obj_7.DocumentType = [];
            obj_7.DocumentTypeList.length = 0;
            obj_7.ADCByPassNameList = [];
            obj_7.ADCByPassList = [new appmodel.ADCByPass()];
            obj_7.ADCByPassList.length = 0;
            // obj.ADCByPassList.push({"Type":"0","TypeText":"DOUBLE NATIONALITY"});
            // obj.ADCByPassList.push({"Type":"1","TypeText":"PROCESSING RESIDENCY"});
            // obj.ADCByPassList.push({"Type":"2","TypeText":"VISA AT ARRIVAL"});
            // obj.ADCByPassList.push({"Type":"3","TypeText":"OTHER TRANSPORTATIONS"});
            // obj.ADCByPassList.push({"Type":"4","TypeText":"ADC DOWN"});
            // obj.ADCByPassList.push({"Type":"5","TypeText":"SPECIAL VISA"});
            // obj.ADCByPassList.push({"Type":"6","TypeText":"INMIGRATION PROBLEMS"});
            // obj.ADCByPassList.push({"Type":"7","TypeText":"TIMATIC UPDATE"});
            obj_7.ADCByPassList = ADCbyPass;
            obj_7.ADCByPassList.forEach(function (item, index) {
                var byPassText;
                byPassText = item.Text;
                obj_7.ADCByPassNameList.push(byPassText);
            });
            // obj.ADCByPassNameList.push("DOUBLE NATIONALITY");
            // obj.ADCByPassNameList.push("PROCESSING RESIDENCY");
            // obj.ADCByPassNameList.push("VISA AT ARRIVAL");
            // obj.ADCByPassNameList.push("OTHER TRANSPORTATIONS");
            // obj.ADCByPassNameList.push("ADC DOWN");
            // obj.ADCByPassNameList.push("SPECIAL VISA");
            // obj.ADCByPassNameList.push("INMIGRATION PROBLEMS");
            // obj.ADCByPassNameList.push("TIMATIC UPDATE");
            /*
                DocType: "1", DocTypeText: "Visa"
                DocType: "2", DocTypeText: "Passport"
                DocType: "3", DocTypeText: "Military Identification"
                DocType: "5", DocTypeText: "National Identity Document"
                DocType: "7", DocTypeText: "Alien Registration Number"
                DocType: "11", DocTypeText: "Border Crossing Card"
                DocType: "12", DocTypeText: "Refugee Travel Document"
                DocType: "13", DocTypeText: "Pilot License"
                DocType: "14", DocTypeText: "Permanent Resident Card"
                DocType: "15", DocTypeText: "Redress number"
                DocType: "16", DocTypeText: "Known Traveler Number"
                DocType: "17", DocTypeText: "Other"
                DocType: "22", DocTypeText: "Naturalization Certificate"
            */
            obj_7.ApisUpdateRequests[0].Addresses.length = 0;
            if (response.Passengers != null) {
                response.Passengers.forEach(function (element, index) {
                    console.dir(PassedPassengerDetail);
                    console.dir(response.Passengers[index]);
                    //if (response.Passengers[0].Documents.length > 0) {
                    if (PassedPassengerDetail.FirstName == element.Firstname && PassedPassengerDetail.LastName == element.Lastname && PassedPassengerDetail.RPH == element.RPH) {
                        var objDoc = new appmodel.Document();
                        var objAddr_1 = new appmodel.Address();
                        obj_7.ApisDocoStatus = response.Passengers[0].ApisDocoStatus;
                        obj_7.ADCStatus = response.Passengers[0].AdcDecisionStatus;
                        if (PassedPassengerDetail.FirstName == element.Firstname && PassedPassengerDetail.LastName == element.Lastname) {
                            obj_7.ApisUpdateRequests[0].Firstname = element.Firstname;
                            obj_7.ApisUpdateRequests[0].Lastname = element.Lastname;
                            obj_7.ApisUpdateRequests[0].SurnameRefNumber = PassedPassengerDetail.SurnameRefNumber;
                            obj_7.ApisUpdateRequests[0].Prefix = element.Prefix;
                            obj_7.ApisUpdateRequests[0].RPH = PassedPassengerDetail.RPH;
                            obj_7.ApisUpdateRequests[0].Emails = element.Emails;
                            obj_7.ApisUpdateRequests[0].Gender = "0";
                            obj_7.ApisUpdateRequests[0].DateOfBirth = PassedPassengerDetail.DateOfBirth;
                            obj_7.ApisUpdateRequests[0].PassengerTypeCode = PassedPassengerDetail.PassengerTypeCode;
                            obj_7.ApisUpdateRequests[0].PhoneNumbers = element.PhoneNumbers;
                            obj_7.ApisUpdateRequests[0].Age = element.Age;
                            obj_7.ApisUpdateRequests[0].AssociatedAdultRPH = element.AssociatedAdultRPH;
                            obj_7.ApisUpdateRequests[0].AssociatedInfantRPH = element.AssociatedInfantRPH;
                            obj_7.ApisUpdateRequests[0].FqtTravelers = element.FqtTravelers;
                            obj_7.ApisUpdateRequests[0].Nationality = element.Nationality;
                            obj_7.ApisUpdateRequests[0].GivenName = element.Firstname;
                            obj_7.ApisUpdateRequests[0].Surname = element.Lastname;
                            if (response.Passengers[index].EmergencyDetails.length > 0) {
                                console.log(response.Passengers[index].EmergencyDetails[0].EmergencyContactName);
                                obj_7.ApisUpdateRequests[0].EmergencyDetails = [new appmodel.EmergencyDetail()];
                                obj_7.ApisUpdateRequests[0].OldEmergencyDetails = [new appmodel.OldEmergencyDetail()];
                                obj_7.ApisUpdateRequests[0].EmergencyDetails.length = 0;
                                obj_7.ApisUpdateRequests[0].OldEmergencyDetails.length = 0;
                                response.Passengers.forEach(function (passenger, index) {
                                    if (PassedPassengerDetail.FirstName == passenger.Firstname && PassedPassengerDetail.LastName == passenger.Lastname) {
                                        passenger.EmergencyDetails.forEach(function (item, index) {
                                            var emergency = new index_1.EmergencyDetail();
                                            emergency.EmergencyContactName = item.EmergencyContactName;
                                            emergency.EmergencyPhone.Value = item.EmergencyPhone.Value;
                                            emergency.EmergencyRelationship = item.EmergencyRelationship;
                                            obj_7.ApisUpdateRequests[0].EmergencyDetails.push(emergency);
                                            obj_7.ApisUpdateRequests[0].OldEmergencyDetails.push(emergency);
                                            // obj.ApisUpdateRequests[0].EmergencyDetails[0].EmergencyPhone.Value = item.EmergencyPhone.Value;
                                            // obj.ApisUpdateRequests[0].EmergencyDetails[0].EmergencyRelationship = item.EmergencyRelationship;
                                        });
                                    }
                                });
                            }
                            else {
                                obj_7.ApisUpdateRequests[0].EmergencyDetails = [new appmodel.EmergencyDetail()];
                                obj_7.ApisUpdateRequests[0].EmergencyDetails[0].EmergencyContactName = "";
                                obj_7.ApisUpdateRequests[0].EmergencyDetails[0].EmergencyPhone.Value = "";
                                obj_7.ApisUpdateRequests[0].EmergencyDetails[0].EmergencyRelationship = "Tourist";
                            }
                            obj_7.ApisUpdateRequests[0].KnownTravelerNumber = element.KnownTravelerNumber;
                            obj_7.ApisUpdateRequests[0].RedressNumber = element.RedressNumber;
                            obj_7.ApisUpdateRequests[0].OldKnownTravelerNumber = element.KnownTravelerNumber;
                            obj_7.ApisUpdateRequests[0].OldRedressNumber = element.OldRedressNumber;
                            obj_7.ApisUpdateRequests[0].FOID = null;
                            obj_7.ApisUpdateRequests[0].OldNationality = null;
                            obj_7.ApisUpdateRequests[0].OldDateOfBirth = null;
                            obj_7.ApisUpdateRequests[0].OldGender = null;
                            obj_7.ApisUpdateRequests[0].OldFOID = null;
                            // obj.ApisUpdateRequests[0].OldEmergencyDetails = response.Passengers[0].;
                        }
                        // if (response.Passengers.length > 0) {
                        //     if (response.Passengers[0].EmergencyDetails.length == 0) {
                        //         let emergency = [new appmodel.EmergencyDetail()];
                        //         emergency[0].EmergencyPhone = new appmodel.EmergencyPhone();
                        //         emergency[0].EmergencyContactName = new appmodel.EmergencyDetail().EmergencyContactName;
                        //         emergency[0].EmergencyPhone.Value = new appmodel.EmergencyPhone().Value;
                        //         obj.ApisUpdateRequests[0].EmergencyDetails = emergency;
                        //     }
                        // }
                        // if (response.Passengers[index].Documents.length != 0) {
                        //     response.Passengers[index].Documents.forEach((doc,index)=>{
                        //         response.Passengers[index].Documents[index].Surname = doc.Surname;
                        //         response.Passengers[index].Documents[index].Firstname = doc.Firstname;
                        //     });
                        // }
                        if (element.Documents != null && element.Documents.length > 0) {
                            //  if (response.Passengers[index].Documents[0].Firstname != null) {
                            element.Documents.forEach(function (docElement, docindex) {
                                console.dir(element);
                                console.dir(docElement);
                                console.dir(PassedPassengerDetail);
                                // if (docElement.Firstname != null) {
                                if (PassedPassengerDetail.FirstName == element.Firstname && PassedPassengerDetail.LastName == element.Lastname && PassedPassengerDetail.RPH == element.RPH) {
                                    var objDoc_1 = new appmodel.Document();
                                    if (obj_7.ApisUpdateRequests[0].AssociatedAdultRPH != null) {
                                        var associatedDetails = response.Passengers.filter(function (m) { return m.RPH == obj_7.ApisUpdateRequests[0].AssociatedAdultRPH; })[0];
                                        var objAssociated = new appmodel.AssociatedPassenger();
                                        objAssociated.Firstname = associatedDetails.Firstname;
                                        objAssociated.Lastname = associatedDetails.Lastname;
                                        ;
                                        objAssociated.RPH = obj_7.ApisUpdateRequests[0].AssociatedAdultRPH;
                                        objAssociated.SurnameRefNumber = obj_7.ApisUpdateRequests[0].SurnameRefNumber;
                                        obj_7.ApisUpdateRequests[0].AssociatedPassenger = objAssociated;
                                    }
                                    else {
                                        obj_7.ApisUpdateRequests[0].AssociatedPassenger = null;
                                    }
                                    objDoc_1.Surname = docElement.Surname;
                                    console.log(objDoc_1.Surname);
                                    objDoc_1.Firstname = docElement.Firstname;
                                    objDoc_1.DocID = docElement.DocID;
                                    objDoc_1.DocLevelInd = "1";
                                    objDoc_1.BirthDate = docElement.BirthDate != null ? moment(docElement.BirthDate).format("MM/DD/YYYY") : "";
                                    objDoc_1.ExpireDate = moment(docElement.ExpireDate).format("MM/DD/YYYY") != "01/01/0001" ? moment(docElement.ExpireDate).format("MM/DD/YYYY") : "";
                                    objDoc_1.DocIssueCountry = docElement.DocIssueCountry;
                                    objDoc_1.DocHolderNationality = docElement.DocHolderNationality;
                                    objDoc_1.DocHolderGender = docElement.DocHolderGender;
                                    if (docElement.inputType != "Manual" && docElement.inputType != undefined) {
                                        objDoc_1.inputType = "Machine Readable";
                                        objDoc_1.OCRString = PassedPassengerDetail.OCRString;
                                    }
                                    else {
                                        objDoc_1.inputType = "Manual";
                                    }
                                    objDoc_1.EffectiveDate = docElement.EffectiveDate;
                                    objDoc_1.DocLevel = docElement.DocLevel;
                                    objDoc_1.CountryOfResidence = docElement.CountryOfResidence;
                                    objDoc_1.IsTrustedData = docElement.IsTrustedData; //docElement.IsTrustedData;
                                    objDoc_1.IsVerifiedData = docElement.IsVerifiedData;
                                    objDoc_1.IsRefValue = docElement.IsRefValue;
                                    objDoc_1.DocType = docElement.DocType == "0" ? "2" : docElement.DocType;
                                    objDoc_1.DocTypeText = docElement.DocTypeText != "Undefined" ? docElement.DocTypeText : "Passport";
                                    //objDoc.DocLevelInd = docElement.DocLevelInd;;
                                    console.log(objDoc_1);
                                    console.log(docElement.DocID);
                                    obj_7.ApisUpdateRequests[0].Documents.push(objDoc_1);
                                    console.log(obj_7.ApisUpdateRequests[0].Documents);
                                }
                                //}
                            });
                            if (element.Documents.length < 2) {
                                var objDoc_2 = new appmodel.Document();
                                objDoc_2.Surname = '';
                                objDoc_2.Firstname = '';
                                objDoc_2.DocID = null;
                                objDoc_2.ExpireDate = null;
                                objDoc_2.DocIssueCountry = null;
                                objDoc_2.DocType = "14";
                                objDoc_2.DocTypeText = "Permanent Resident Card";
                                obj_7.ApisUpdateRequests[0].Documents.push(objDoc_2);
                            }
                            // }
                        }
                        else {
                            if (PassedPassengerDetail.FirstName == element.Firstname && PassedPassengerDetail.LastName == element.Lastname) {
                                var objDoc_3 = new appmodel.Document();
                                objDoc_3.Surname = element.Lastname;
                                console.log(objDoc_3.Surname);
                                objDoc_3.Firstname = element.Firstname;
                                objDoc_3.DocID = "";
                                objDoc_3.DocLevelInd = "1";
                                objDoc_3.BirthDate = "";
                                objDoc_3.ExpireDate = "";
                                objDoc_3.DocIssueCountry = "";
                                objDoc_3.DocHolderNationality = "";
                                objDoc_3.DocHolderGender = "0";
                                objDoc_3.inputType = "Manual";
                                objDoc_3.CountryOfResidence = null;
                                objDoc_3.IsTrustedData = false;
                                objDoc_3.DocType = "2";
                                objDoc_3.DocTypeText = "Passport";
                                obj_7.ApisUpdateRequests[0].Documents.push(objDoc_3);
                                console.log(obj_7.ApisUpdateRequests[0].Documents);
                            }
                        }
                        obj_7.DocumentTypeIndexList.length = 0;
                        //let documentTypeIndexList:any[] = [];
                        //documentTypeIndexList.length = 0;
                        obj_7.ApisUpdateRequests[0].ApisRequirements.length = 0;
                        obj_7.ApisUpdateRequests[0].ApisRequirements = response.Passengers[index].ApisRequirements;
                        console.dir(response.Passengers[index].ApisAddressRequirements);
                        obj_7.ApisUpdateRequests[0].ApisAddressRequirements.length = 0;
                        obj_7.ApisUpdateRequests[0].ApisAddressRequirements = response.Passengers[index].ApisAddressRequirements;
                        if (response.Passengers[index].ApisRequirements != null && response.Passengers[index].ApisRequirements.length > 0) {
                            response.Passengers[index].ApisRequirements.forEach(function (apisItems, apisIndex) {
                                var iCheck = true;
                                if (obj_7.DocumentTypeIndexList.length == 0) {
                                    obj_7.DocumentTypeIndexList.push({ "Type": apisItems.DocType, "Text": apisItems.DocTypeText, "DocLevel": apisItems.DocLevel });
                                    //documentTypeIndexList.push(apisItems.DocType);
                                }
                                else {
                                    obj_7.DocumentTypeIndexList.forEach(function (dType, dIndex) {
                                        if (obj_7.DocumentTypeIndexList[dIndex].Type == apisItems.DocType) {
                                            iCheck = false;
                                        }
                                    });
                                    if (iCheck) {
                                        obj_7.DocumentTypeIndexList.push({ "Type": apisItems.DocType, "Text": apisItems.DocTypeText, "DocLevel": apisItems.DocLevel });
                                        //documentTypeIndexList.push(apisItems.DocType);
                                    }
                                }
                            });
                        }
                        typeOrder_1 = obj_7.DocumentTypeIndexList;
                        sortTypeOrder_1 = typeOrder_1.sort(function (n1, n2) { return n1 - n2; });
                        element.Addresses.forEach(function (docElement, docindex) {
                            objAddr_1.IsRefValue = false;
                            objAddr_1.Type = docElement.Type;
                            objAddr_1.TypeText = docElement.TypeText;
                            //objAddr.CityCode = docElement.CityCode;
                            objAddr_1.Address = docElement.Address;
                            objAddr_1.PostalCode = docElement.PostalCode;
                            objAddr_1.City = docElement.City;
                            objAddr_1.State = docElement.State;
                            //objAddr.CarrierCode = docElement.CarrierCode;
                            objAddr_1.Operation = docElement.Operation;
                            //objAddr.OSIText = docElement.OSIText;
                            objAddr_1.AgencyName = docElement.AgencyName;
                            objAddr_1.DocLevelInd = docElement.DocLevelInd;
                            objAddr_1.AddressLineRequired = docElement.AddressLineRequired;
                            objAddr_1.AddressCityRequired = false;
                            //objAddr.AddressStateProvRequired = null;
                            objAddr_1.AddressPostalCodeRequired = null;
                            //objAddr.AddressCountryNameRequired = null;
                            objAddr_1.AddressCountryCodeRequired = false;
                            objAddr_1.AddressRequired = null;
                            objAddr_1.CountryCode = docElement.CountryCode;
                            objAddr_1.Country = docElement.Country;
                            obj_7.ApisUpdateRequests[0].Addresses.push(objAddr_1);
                        });
                    }
                    //}
                });
            }
            if (sortTypeOrder_1.length > 0) {
                sortTypeOrder_1.forEach(function (docType, index) {
                    // if (obj.DocumentTypeIndexList[index].Type == "14") {
                    //     obj.DocumentTypeList.push({ DocType: "14", DocTypeText: obj.DocumentTypeIndexList[index].Text, DocLevel:obj.DocumentTypeIndexList[index].DocLevel });
                    //     obj.DocumentType.push(obj.DocumentTypeIndexList[index].Text);
                    // }
                    // else if (obj.DocumentTypeIndexList[index].Type == "7") {
                    //     obj.DocumentTypeList.push({ DocType: "7", DocTypeText: obj.DocumentTypeIndexList[index].Text , DocLevel:obj.DocumentTypeIndexList[index].DocLevel});
                    //     obj.DocumentType.push(obj.DocumentTypeIndexList[index].Text);
                    // }
                    // else if (obj.DocumentTypeIndexList[index].Type == "2") {
                    //     obj.DocumentTypeList.push({ DocType: "2", DocTypeText: obj.DocumentTypeIndexList[index].Text , DocLevel:obj.DocumentTypeIndexList[index].DocLevel});
                    //     obj.DocumentType.push(obj.DocumentTypeIndexList[index].Text);
                    // }
                    // else if (obj.DocumentTypeIndexList[index].Type == "11") {
                    //     obj.DocumentTypeList.push({ DocType: "11", DocTypeText: obj.DocumentTypeIndexList[index].Text , DocLevel:obj.DocumentTypeIndexList[index].DocLevel});
                    //     obj.DocumentType.push(obj.DocumentTypeIndexList[index].Text);
                    // }
                    // else if (obj.DocumentTypeIndexList[index].Type == "22") {
                    //     obj.DocumentTypeList.push({ DocType: "22", DocTypeText: obj.DocumentTypeIndexList[index].Text , DocLevel:obj.DocumentTypeIndexList[index].DocLevel});
                    //     obj.DocumentType.push(obj.DocumentTypeIndexList[index].Text);
                    // }
                    // else if (obj.DocumentTypeIndexList[index].Type == "3") {
                    //     obj.DocumentTypeList.push({ DocType: "3", DocTypeText: obj.DocumentTypeIndexList[index].Text , DocLevel:obj.DocumentTypeIndexList[index].DocLevel});
                    //     obj.DocumentType.push(obj.DocumentTypeIndexList[index].Text);
                    // }
                    // else if (obj.DocumentTypeIndexList[index].Type == "12") {
                    //     obj.DocumentTypeList.push({ DocType: "12", DocTypeText: obj.DocumentTypeIndexList[index].Text, DocLevel:obj.DocumentTypeIndexList[index].DocLevel });
                    //     obj.DocumentType.push(obj.DocumentTypeIndexList[index].Text);
                    // }
                    // else if (obj.DocumentTypeIndexList[index].Type == "13") {
                    //     obj.DocumentTypeList.push({ DocType: "13", DocTypeText: obj.DocumentTypeIndexList[index].Text , DocLevel:obj.DocumentTypeIndexList[index].DocLevel});
                    //     obj.DocumentType.push(obj.DocumentTypeIndexList[index].Text);
                    // }
                    // else if (obj.DocumentTypeIndexList[index].Type == "1") {
                    //     obj.DocumentTypeList.push({ DocType: "1", DocTypeText: obj.DocumentTypeIndexList[index].Text , DocLevel:obj.DocumentTypeIndexList[index].DocLevel});
                    //     obj.DocumentType.push(obj.DocumentTypeIndexList[index].Text);
                    // }
                    // else if (obj.DocumentTypeIndexList[index].Type == "5") {
                    //     obj.DocumentTypeList.push({ DocType: "5", DocTypeText: obj.DocumentTypeIndexList[index].Text , DocLevel:obj.DocumentTypeIndexList[index].DocLevel});
                    //     obj.DocumentType.push(obj.DocumentTypeIndexList[index].Text);
                    // }
                    if (obj_7.DocumentTypeList.filter(function (m) { return m.DocType == obj_7.DocumentTypeIndexList[index].Type; }).length == 0) {
                        obj_7.DocumentTypeList.push({ DocType: obj_7.DocumentTypeIndexList[index].Type, DocTypeText: obj_7.DocumentTypeIndexList[index].Text, DocLevel: obj_7.DocumentTypeIndexList[index].DocLevel });
                        obj_7.DocumentType.push(obj_7.DocumentTypeIndexList[index].Text);
                    }
                });
                console.dir(obj_7.DocumentTypeList);
            }
            var eDate = new Date();
            console.log('Convert Passenger Details --------------- End Date Time : ' + eDate);
            console.log('Convert Passenger Details Execution Time : ' + app_executiontime_1.AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
            return obj_7;
        }
        catch (error) {
            console.log(error.message);
        }
    };
    Converters.ConvertToAssignSeat = function (response, flightInfo, Order, multiPaxArray) {
        try {
            var newSeatList = new appinterface.AssignSeat.seat();
            console.log("before seat assignment");
            console.dir(response);
            // 
            var isValid_1;
            if (flightInfo.MarketingFlight.substr(0, 2) == "CM" || (flightInfo.OperatingFlight != null && flightInfo.OperatingFlight.substr(0, 2) == "CM")) {
                isValid_1 = true;
            }
            if (isValid_1) {
                response.forEach(function (passengerList, index) {
                    // multiPaxArray.Segment.forEach((SegData, SegIndex) => {
                    // SegData.Passenger.forEach((passengerList, index) => {
                    var newSeat = new appinterface.AssignSeat.seats();
                    newSeat.OrderId = passengerList.OrderID;
                    newSeat.SeatNo = passengerList.SeatNumber;
                    if (newSeat.SeatNo == "") {
                        newSeat.NoSeat = true;
                    }
                    else {
                        newSeat.NoSeat = false;
                    }
                    newSeat.SeatCheckInStatus = "Unknown";
                    // if (passengerList.PassengerType == "Adult" && passengerList.AssociatedInfantRPH == null) {
                    newSeat.SeatPreference = passengerList.seatPreference;
                    // }
                    newSeat.PreviousSeatNo = null;
                    if (passengerList.SeatNumber != null && passengerList.PrevSeat != "Auto") {
                        newSeat.PreviousSeatNo = passengerList.PrevSeat;
                    }
                    newSeat.FlightNo = flightInfo.MarketingFlight;
                    newSeat.ArrivalAirportCode = flightInfo.Destination;
                    newSeat.DepartureAirportCode = flightInfo.Origin;
                    newSeat.DepartureDateTime = flightInfo.DepartureDateTime;
                    newSeat.PassengerFirstName = passengerList.FirstName;
                    newSeat.PassengerLastName = passengerList.LastName;
                    newSeat.ResBookDesigCode = flightInfo.RBD;
                    newSeat.HasPrice = false;
                    newSeat.INFGivenName = null;
                    newSeat.INFSurname = null;
                    newSeat.PassengerRefNumber = passengerList.PassengerRefNumber;
                    newSeat.PassengerRPH = passengerList.RPH;
                    newSeat.PassengerTypeCode = passengerList.PassengerTypeCode;
                    newSeat.SurnameRefNumber = passengerList.SurnameRefNumber;
                    newSeat.GivenNameRefNumber = passengerList.GivenNameRefNumber;
                    if (Order.SegmentTravelerInfos != null && Order.SegmentTravelerInfos.filter(function (m) { return m.PassengerRPH == passengerList.RPH && m.SegmentRPH == flightInfo.RPH; })[0].CheckinInfos != null) {
                        newSeat.IsCheckedIn = Order.SegmentTravelerInfos.filter(function (m) { return m.PassengerRPH == passengerList.RPH && m.SegmentRPH == flightInfo.RPH; })[0].CheckinInfos[0].Status;
                    }
                    else {
                        newSeat.IsCheckedIn = "UNKNOWN";
                    }
                    if (passengerList.FlightLegDepartureAirportCode != "") {
                        newSeat.FlightLegDepartureAirportCode = passengerList.FlightLegDepartureAirportCode;
                    }
                    //newSeat.DepartureDateTime = "2017-02-01T07:41:00" as Date ;    
                    newSeatList.SeatList.push(newSeat);
                });
            }
            else {
                newSeatList.IsInterlineSeatMap = true;
                multiPaxArray.Segment.forEach(function (SegData, SegIndex) {
                    SegData.Passenger.forEach(function (passengerList, index) {
                        var newSeat = new appinterface.AssignSeat.seats();
                        newSeat.OrderId = passengerList.OrderID;
                        newSeat.SeatNo = passengerList.SeatNumber;
                        if (newSeat.SeatNo == "") {
                            newSeat.NoSeat = true;
                        }
                        else {
                            newSeat.NoSeat = false;
                        }
                        newSeat.SeatCheckInStatus = "Unknown";
                        // if (passengerList.PassengerType == "Adult" && passengerList.AssociatedInfantRPH == null) {
                        newSeat.SeatPreference = passengerList.seatPreference;
                        // }
                        newSeat.PreviousSeatNo = null;
                        if (passengerList.SeatNumber != null && passengerList.PrevSeat != "Auto") {
                            newSeat.PreviousSeatNo = passengerList.PrevSeat;
                        }
                        newSeat.FlightNo = SegData.MarketingFlight;
                        newSeat.ArrivalAirportCode = SegData.Destination;
                        newSeat.DepartureAirportCode = SegData.Origin;
                        newSeat.DepartureDateTime = SegData.DepartureDateTime;
                        newSeat.PassengerFirstName = passengerList.FirstName;
                        newSeat.PassengerLastName = passengerList.LastName;
                        newSeat.ResBookDesigCode = SegData.RBD;
                        newSeat.HasPrice = false;
                        newSeat.INFGivenName = null;
                        newSeat.INFSurname = null;
                        newSeat.PassengerRefNumber = multiPaxArray.Segment[0].Passenger[index].PassengerRefNumber;
                        newSeat.PassengerRPH = passengerList.RPH;
                        newSeat.PassengerTypeCode = passengerList.PassengerTypeCode;
                        newSeat.SurnameRefNumber = passengerList.SurnameRefNumber;
                        newSeat.GivenNameRefNumber = passengerList.GivenNameRefNumber;
                        if (Order.SegmentTravelerInfos != null && Order.SegmentTravelerInfos.filter(function (m) { return m.PassengerRPH == passengerList.RPH && m.SegmentRPH == SegData.RPH; })[0].CheckinInfos != null) {
                            newSeat.IsCheckedIn = Order.SegmentTravelerInfos.filter(function (m) { return m.PassengerRPH == passengerList.RPH && m.SegmentRPH == SegData.RPH; })[0].CheckinInfos[0].Status;
                        }
                        else {
                            newSeat.IsCheckedIn = "UNKNOWN";
                        }
                        if (passengerList.FlightLegDepartureAirportCode != "") {
                            newSeat.FlightLegDepartureAirportCode = passengerList.FlightLegDepartureAirportCode;
                        }
                        if (!isValid_1) {
                            newSeat.FlightLegDepartureAirportCode = SegData.Origin;
                        }
                        //newSeat.DepartureDateTime = "2017-02-01T07:41:00" as Date ;    
                        newSeatList.SeatList.push(newSeat);
                    });
                });
            }
            // })
            console.log(newSeatList);
            return newSeatList;
        }
        catch (error) {
            console.log("Seat assignment conversion error");
        }
    };
    Converters.ConvertToSeatMap = function (response, Paxresponse, flightnumber, Legs, origin, destination) {
        try {
            var sDate = new Date();
            console.log('Convert Seat Map --------------- Start Date Time : ' + sDate);
            var itemList = new appinterface.SeatMap.RootObject();
            console.log("before conversion");
            if (response != null && response.Items != null) {
                itemList.Items = [new appinterface.SeatMap.Item];
                itemList.Items.length = 0;
                console.log("v1" + origin);
                console.log("r1" + destination);
                var flightSeatList = response.Items.filter(function (m) { return m.FlightSegment.Flight == flightnumber || m.FlightSegment.Origin.LocationCode == origin && m.FlightSegment.Destination.LocationCode == destination; });
                console.log("leg lenght:" + flightSeatList.length);
                if (Legs != null && Legs != undefined) {
                    Legs.forEach(function (legs, Index) {
                        var seatMapList = flightSeatList.filter(function (m) { return m.FlightSegment.Origin.LocationCode == legs.DepartureAirport.LocationCode && m.FlightSegment.Destination.LocationCode == legs.ArrivalAirport.LocationCode; });
                        if (seatMapList.length > 0) {
                            var itemObj_1 = new appinterface.SeatMap.Item();
                            itemObj_1.FlightSegment = seatMapList[0].FlightSegment;
                            itemObj_1.SeatProductInformation = seatMapList[0].SeatProductInformation;
                            itemObj_1.CabinList = [new appinterface.SeatMap.CabinList()];
                            itemObj_1.CabinList.length = 0;
                            seatMapList[0].CabinList.forEach(function (cabinElement, cabinIndex) {
                                var cabinList = new appinterface.SeatMap.CabinList();
                                ;
                                cabinList.CabinType = cabinElement.CabinType;
                                cabinList.CabinName = cabinElement.Name;
                                cabinList.AirRowList = [];
                                var colNames = new appinterface.SeatMap.AirSeatList();
                                var colNamesRow = new appinterface.SeatMap.AirRowList();
                                var headerRow = new appinterface.SeatMap.AirRowList();
                                cabinElement.AirRowList.forEach(function (airRowElement, rowIndex) {
                                    var rowList = new appinterface.SeatMap.AirRowList;
                                    rowList.RowNumber = airRowElement.RowNumber;
                                    rowList.AirSeatList = [];
                                    var aisleFnd = false;
                                    var isLeftExit = true;
                                    airRowElement.AirSeatList.forEach(function (airSeatElement, seatIndex) {
                                        var seat = new appinterface.SeatMap.AirSeatList();
                                        seat.SeatNumber = airSeatElement.SeatNumber;
                                        seat.SeatAvailability = airSeatElement.SeatAvailability;
                                        seat.ReconciledStatus = airSeatElement.ReconciledStatus;
                                        seat.SeatPriceList = airSeatElement.SeatPriceList;
                                        seat.SeatCharacteristics = airSeatElement.SeatCharacteristics;
                                        seat.SeatNum = airRowElement.RowNumber + airSeatElement.SeatNumber;
                                        rowList.AirSeatList.push(seat);
                                        if (airSeatElement.SeatCharacteristics.indexOf("3") > -1) {
                                            if (!aisleFnd) {
                                                var midSeat = new appinterface.SeatMap.AirSeatList();
                                                midSeat.SeatNumber = airRowElement.RowNumber;
                                                midSeat.MidCol = true;
                                                rowList.AirSeatList.push(midSeat);
                                                aisleFnd = true;
                                            }
                                            else {
                                                aisleFnd = false;
                                            }
                                        }
                                        var seatstyle = [
                                            { value: "2", characteristic: 'seatAssigned' },
                                            { value: "14", characteristic: 'seatOccupied' },
                                            { value: "16", characteristic: 'noSeat' },
                                            { value: "3", characteristic: 'unavailable' },
                                            { value: "25", characteristic: 'seatBlocked' },
                                            { value: "24", characteristic: 'seatBlockedForOtherReason' },
                                            { value: "18", characteristic: 'seatProtectedForCodeSharing' },
                                            { value: "15", characteristic: 'availableSeat' },
                                            { value: "1", characteristic: 'availableSeat' },
                                            { value: "26", characteristic: 'seatBlockedForLocalPassengerBoarded' },
                                            { value: "27", characteristic: 'seatBlockedForThroughPassengerBoarded' },
                                            { value: "3", characteristic: 'noSeat' },
                                            { value: "28", characteristic: 'seatOccupied' }
                                        ];
                                        if (seatstyle.filter(function (myObj) { return myObj.value == airSeatElement.SeatAvailability; }).length > 0) {
                                            seat.StyleClass = seatstyle.filter(function (myObj) { return myObj.value == airSeatElement.SeatAvailability; })[0].characteristic;
                                            if (seat.StyleClass == 'availableSeat') {
                                                itemObj_1.SeatProductInformation.forEach(function (seatInfo, Index) {
                                                    if (airSeatElement.SeatCharacteristics.filter(function (m) { return m === seatInfo.OTACode; }).length > 0) {
                                                        seat.SeatCode = seatInfo.SHARESCode;
                                                        // seat.isSpecialSeat = true;
                                                    }
                                                });
                                            }
                                        }
                                        else {
                                            seat.StyleClass = 'unavailable';
                                        }
                                        itemObj_1.SeatProductInformation.forEach(function (seatInfo, Index) {
                                            if (airSeatElement.SeatCharacteristics.filter(function (m) { return m === seatInfo.OTACode; }).length > 0) {
                                                seat.isSpecialSeat = true;
                                            }
                                        });
                                        Paxresponse.forEach(function (pax, index) {
                                            pax.Seats.forEach(function (seats, seatindex) {
                                                if (seats.SeatNumber == seat.SeatNum && seats.DepartureCode == legs.DepartureAirport.LocationCode && seats.ArrivalCode == legs.ArrivalAirport.LocationCode) {
                                                    console.log("inside new condition");
                                                    seat.StyleClass = 'selectedseat';
                                                    seat.IsPaxSelected = true;
                                                    seat.PaxRPH = pax.RPH;
                                                }
                                            });
                                        });
                                    });
                                    if (rowIndex == 0) {
                                        headerRow.HeaderRow = true;
                                        rowList.AirSeatList.forEach(function (headerItem, hIndex) {
                                            var newhItem = new appinterface.SeatMap.AirSeatList();
                                            if (!headerItem.MidCol)
                                                newhItem.SeatNumber = headerItem.SeatNumber;
                                            headerRow.AirSeatList.push(newhItem);
                                        });
                                        cabinList.AirRowList.push(headerRow);
                                    }
                                    if (rowList.AirSeatList.filter(function (myObj) { return myObj.SeatAvailability === '16'; }).length == rowList.AirSeatList.length - 1) {
                                        rowList.StyleClass = "hiderow";
                                    }
                                    if (airRowElement.RowCharacteristics.indexOf("4") > -1) {
                                        rowList.StyleClass += " exitrow";
                                    }
                                    cabinList.AirRowList.push(rowList);
                                });
                                itemObj_1.CabinList.push(cabinList);
                            });
                            itemList.Items.push(itemObj_1);
                        }
                    });
                }
                if (flightSeatList.length > 1) {
                    var n = Legs.length;
                    console.log("len:" + n);
                    var previousIndex = n - 1;
                    var seatMapList = flightSeatList.filter(function (m) { return m.FlightSegment.Origin.LocationCode == origin && m.FlightSegment.Destination.LocationCode == destination; });
                    if (seatMapList.length > 0) {
                        var itemObj_2 = new appinterface.SeatMap.Item();
                        console.log("V1" + JSON.stringify(seatMapList[0].FlightSegment.Origin.LocationCode));
                        console.log("R1" + JSON.stringify(seatMapList[0].FlightSegment.Destination.LocationCode));
                        itemObj_2.FlightSegment = seatMapList[0].FlightSegment;
                        itemObj_2.SeatProductInformation = seatMapList[0].SeatProductInformation;
                        itemObj_2.CabinList = [new appinterface.SeatMap.CabinList()];
                        itemObj_2.CabinList.length = 0;
                        seatMapList[0].CabinList.forEach(function (cabinElement, cabinIndex) {
                            var cabinList = new appinterface.SeatMap.CabinList();
                            ;
                            cabinList.CabinType = cabinElement.CabinType;
                            cabinList.CabinName = cabinElement.Name;
                            cabinList.AirRowList = [];
                            var colNames = new appinterface.SeatMap.AirSeatList();
                            var colNamesRow = new appinterface.SeatMap.AirRowList();
                            var headerRow = new appinterface.SeatMap.AirRowList();
                            cabinElement.AirRowList.forEach(function (airRowElement, rowIndex) {
                                //console.log("each row number " + objSeatMap.seatRowNumber);
                                var rowList = new appinterface.SeatMap.AirRowList;
                                rowList.RowNumber = airRowElement.RowNumber;
                                rowList.AirSeatList = [];
                                var aisleFnd = false;
                                var isLeftExit = true;
                                airRowElement.AirSeatList.forEach(function (airSeatElement, seatIndex) {
                                    var seat = new appinterface.SeatMap.AirSeatList();
                                    seat.SeatNumber = airSeatElement.SeatNumber;
                                    seat.SeatAvailability = airSeatElement.SeatAvailability;
                                    seat.ReconciledStatus = airSeatElement.ReconciledStatus;
                                    seat.SeatPriceList = airSeatElement.SeatPriceList;
                                    seat.SeatCharacteristics = airSeatElement.SeatCharacteristics;
                                    seat.SeatNum = airRowElement.RowNumber + airSeatElement.SeatNumber;
                                    rowList.AirSeatList.push(seat);
                                    if (airSeatElement.SeatCharacteristics.indexOf("3") > -1) {
                                        if (!aisleFnd) {
                                            var midSeat = new appinterface.SeatMap.AirSeatList();
                                            midSeat.SeatNumber = airRowElement.RowNumber;
                                            midSeat.MidCol = true;
                                            rowList.AirSeatList.push(midSeat);
                                            aisleFnd = true;
                                        }
                                        else {
                                            aisleFnd = false;
                                        }
                                    }
                                    var seatstyle = [
                                        { value: "2", characteristic: 'seatAssigned' },
                                        { value: "14", characteristic: 'seatOccupied' },
                                        { value: "16", characteristic: 'noSeat' },
                                        { value: "3", characteristic: 'unavailable' },
                                        { value: "25", characteristic: 'seatBlocked' },
                                        { value: "24", characteristic: 'seatBlockedForOtherReason' },
                                        { value: "18", characteristic: 'seatProtectedForCodeSharing' },
                                        { value: "15", characteristic: 'availableSeat' },
                                        { value: "1", characteristic: 'availableSeat' },
                                        { value: "26", characteristic: 'seatBlockedForLocalPassengerBoarded' },
                                        { value: "27", characteristic: 'seatBlockedForThroughPassengerBoarded' },
                                        { value: "3", characteristic: 'noSeat' },
                                        { value: "28", characteristic: 'seatOccupied' }
                                    ];
                                    if (seatstyle.filter(function (myObj) { return myObj.value == airSeatElement.SeatAvailability; }).length > 0) {
                                        seat.StyleClass = seatstyle.filter(function (myObj) { return myObj.value == airSeatElement.SeatAvailability; })[0].characteristic;
                                        if (seat.StyleClass == 'availableSeat') {
                                            itemObj_2.SeatProductInformation.forEach(function (seatInfo, Index) {
                                                if (airSeatElement.SeatCharacteristics.filter(function (m) { return m === seatInfo.OTACode; }).length > 0) {
                                                    seat.SeatCode = seatInfo.SHARESCode;
                                                    seat.StyleClass = 'specialseat';
                                                }
                                            });
                                        }
                                    }
                                    else {
                                        seat.StyleClass = 'unavailable';
                                    }
                                    itemObj_2.SeatProductInformation.forEach(function (seatInfo, Index) {
                                        if (airSeatElement.SeatCharacteristics.filter(function (m) { return m === seatInfo.OTACode; }).length > 0) {
                                            seat.isSpecialSeat = true;
                                        }
                                    });
                                    Paxresponse.forEach(function (pax, index) {
                                        if (pax.SeatNumber == seat.SeatNum) {
                                            console.log("inside new condition");
                                            seat.StyleClass = 'selectedseat';
                                            seat.IsPaxSelected = true;
                                            seat.PaxRPH = pax.RPH;
                                        }
                                    });
                                });
                                if (rowIndex == 0) {
                                    headerRow.HeaderRow = true;
                                    rowList.AirSeatList.forEach(function (headerItem, hIndex) {
                                        var newhItem = new appinterface.SeatMap.AirSeatList();
                                        if (!headerItem.MidCol)
                                            newhItem.SeatNumber = headerItem.SeatNumber;
                                        headerRow.AirSeatList.push(newhItem);
                                    });
                                    cabinList.AirRowList.push(headerRow);
                                }
                                if (rowList.AirSeatList.filter(function (myObj) { return myObj.SeatAvailability === '16'; }).length == rowList.AirSeatList.length - 1) {
                                    rowList.StyleClass = "hiderow";
                                }
                                if (airRowElement.RowCharacteristics.indexOf("4") > -1) {
                                    rowList.StyleClass += " exitrow";
                                }
                                cabinList.AirRowList.push(rowList);
                            });
                            itemObj_2.CabinList.push(cabinList);
                        });
                        itemList.Items.push(itemObj_2);
                    }
                }
            }
            else {
                console.log("null response for seatmap");
            }
            var eDate = new Date();
            console.log('Convert Seat Map --------------- End Date Time : ' + eDate);
            console.log('Convert Seat Map Execution Time : ' + app_executiontime_1.AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
        }
        catch (error) {
            console.log(error.message);
        }
        return itemList;
    };
    Converters.OAseatmap = function (response, Paxresponse, flightnumber, Legs, origin, destination) {
        try {
            var sDate = new Date();
            console.log('Convert Seat Map --------------- Start Date Time : ' + sDate);
            var itemList = new appinterface.SeatMap.RootObject();
            console.log("before conversion");
            if (response != null && response.Items != null) {
                itemList.Items = [new appinterface.SeatMap.Item];
                itemList.Items.length = 0;
                var flightSeatList = response.Items.filter(function (m) { return m.FlightSegment.Flight == flightnumber || m.FlightSegment.Origin.LocationCode == origin && m.FlightSegment.Destination.LocationCode == destination; });
                var seatMapList = flightSeatList;
                if (seatMapList.length > 0) {
                    var itemObj_3 = new appinterface.SeatMap.Item();
                    itemObj_3.FlightSegment = seatMapList[0].FlightSegment;
                    itemObj_3.SeatProductInformation = seatMapList[0].SeatProductInformation;
                    itemObj_3.CabinList = [new appinterface.SeatMap.CabinList()];
                    itemObj_3.CabinList.length = 0;
                    seatMapList[0].CabinList.forEach(function (cabinElement, cabinIndex) {
                        var cabinList = new appinterface.SeatMap.CabinList();
                        ;
                        cabinList.CabinType = cabinElement.CabinType;
                        cabinList.CabinName = cabinElement.Name;
                        cabinList.AirRowList = [];
                        var colNames = new appinterface.SeatMap.AirSeatList();
                        var colNamesRow = new appinterface.SeatMap.AirRowList();
                        var headerRow = new appinterface.SeatMap.AirRowList();
                        cabinElement.AirRowList.forEach(function (airRowElement, rowIndex) {
                            var rowList = new appinterface.SeatMap.AirRowList;
                            rowList.RowNumber = airRowElement.RowNumber;
                            rowList.AirSeatList = [];
                            var aisleFnd = false;
                            var isLeftExit = true;
                            airRowElement.AirSeatList.forEach(function (airSeatElement, seatIndex) {
                                var seat = new appinterface.SeatMap.AirSeatList();
                                seat.SeatNumber = airSeatElement.SeatNumber;
                                seat.SeatAvailability = airSeatElement.SeatAvailability;
                                seat.ReconciledStatus = airSeatElement.ReconciledStatus;
                                seat.SeatPriceList = airSeatElement.SeatPriceList;
                                seat.SeatCharacteristics = airSeatElement.SeatCharacteristics;
                                seat.SeatNum = airRowElement.RowNumber + airSeatElement.SeatNumber;
                                rowList.AirSeatList.push(seat);
                                if (airSeatElement.SeatCharacteristics.indexOf("3") > -1) {
                                    if (!aisleFnd) {
                                        var midSeat = new appinterface.SeatMap.AirSeatList();
                                        midSeat.SeatNumber = airRowElement.RowNumber;
                                        midSeat.MidCol = true;
                                        rowList.AirSeatList.push(midSeat);
                                        aisleFnd = true;
                                    }
                                    else {
                                        aisleFnd = false;
                                    }
                                }
                                var seatstyle = [
                                    { value: "2", characteristic: 'seatAssigned' },
                                    { value: "14", characteristic: 'seatOccupied' },
                                    { value: "16", characteristic: 'noSeat' },
                                    { value: "3", characteristic: 'unavailable' },
                                    { value: "25", characteristic: 'seatBlocked' },
                                    { value: "24", characteristic: 'seatBlockedForOtherReason' },
                                    { value: "18", characteristic: 'seatProtectedForCodeSharing' },
                                    { value: "15", characteristic: 'availableSeat' },
                                    { value: "1", characteristic: 'availableSeat' },
                                    { value: "26", characteristic: 'seatBlockedForLocalPassengerBoarded' },
                                    { value: "27", characteristic: 'seatBlockedForThroughPassengerBoarded' },
                                    { value: "3", characteristic: 'noSeat' },
                                    { value: "28", characteristic: 'seatOccupied' }
                                ];
                                if (seatstyle.filter(function (myObj) { return myObj.value == airSeatElement.SeatAvailability; }).length > 0) {
                                    seat.StyleClass = seatstyle.filter(function (myObj) { return myObj.value == airSeatElement.SeatAvailability; })[0].characteristic;
                                    if (seat.StyleClass == 'availableSeat') {
                                        itemObj_3.SeatProductInformation.forEach(function (seatInfo, Index) {
                                            if (airSeatElement.SeatCharacteristics.filter(function (m) { return m === seatInfo.OTACode; }).length > 0) {
                                                seat.SeatCode = seatInfo.SHARESCode;
                                            }
                                        });
                                    }
                                }
                                else {
                                    seat.StyleClass = 'unavailable';
                                }
                                itemObj_3.SeatProductInformation.forEach(function (seatInfo, Index) {
                                    if (airSeatElement.SeatCharacteristics.filter(function (m) { return m === seatInfo.OTACode; }).length > 0) {
                                        seat.isSpecialSeat = true;
                                    }
                                });
                                Paxresponse.forEach(function (pax, index) {
                                    pax.Seats.forEach(function (seats, seatindex) {
                                        if (seats.SeatNumber == seat.SeatNum) {
                                            console.log("inside new condition");
                                            seat.StyleClass = 'selectedseat';
                                            seat.IsPaxSelected = true;
                                            seat.PaxRPH = pax.RPH;
                                        }
                                    });
                                });
                            });
                            if (rowIndex == 0) {
                                headerRow.HeaderRow = true;
                                rowList.AirSeatList.forEach(function (headerItem, hIndex) {
                                    var newhItem = new appinterface.SeatMap.AirSeatList();
                                    if (!headerItem.MidCol)
                                        newhItem.SeatNumber = headerItem.SeatNumber;
                                    headerRow.AirSeatList.push(newhItem);
                                });
                                cabinList.AirRowList.push(headerRow);
                            }
                            if (rowList.AirSeatList.filter(function (myObj) { return myObj.SeatAvailability === '16'; }).length == rowList.AirSeatList.length - 1) {
                                rowList.StyleClass = "hiderow";
                            }
                            if (airRowElement.RowCharacteristics.indexOf("4") > -1) {
                                rowList.StyleClass += " exitrow";
                            }
                            cabinList.AirRowList.push(rowList);
                        });
                        itemObj_3.CabinList.push(cabinList);
                    });
                    itemList.Items.push(itemObj_3);
                }
            }
            else {
                console.log("null response for seatmap");
            }
            var eDate = new Date();
            console.log('Convert Seat Map --------------- End Date Time : ' + eDate);
            console.log('Convert Seat Map Execution Time : ' + app_executiontime_1.AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
        }
        catch (error) {
            console.log(error.message);
        }
        return itemList;
    };
    Converters.GetBagTag = function (response, flightInfo, BaggegeDetails, SelectedPassenger, shortCheckin) {
        try {
            var tag = new appinterface.Bagtag.RootObject();
            tag.ID = response.OrderID;
            tag.CheckInType = "AddPassengerInfo";
            tag.CheckInMessageFunctionType = "AddPassengerInfo";
            var ClientViewModel = new appinterface.Bagtag.ClientViewModel();
            ClientViewModel.BaggageInfo = null;
            ClientViewModel.MessageFunction = 30;
            tag.ClientViewModel = ClientViewModel;
            if (ApplicationSettings.getBoolean("isHostBagtag")) {
                tag.Source = "";
            }
            else {
                tag.Source = "TAB";
            }
            var PassengerList = new appinterface.Bagtag.PassengerList();
            PassengerList.isManualBag = false;
            PassengerList.Firstname = response.FirstName;
            PassengerList.Lastname = response.LastName;
            PassengerList.SurnameRefNumber = response.SurnameRefNumber;
            PassengerList.Prefix = null;
            PassengerList.RPH = response.RPH;
            PassengerList.OrderId = response.OrderID;
            PassengerList.Emails = [];
            PassengerList.PassengerTypeCode = response.PassengerTypeCode;
            response.PhoneNumbers.forEach(function (phoneElement, phoneIndex) {
                var phoneNumbers = new appinterface.Bagtag.PhoneNumber();
                phoneNumbers.IsRefValue = phoneElement.IsRefValue;
                phoneNumbers.Type = phoneElement.Type;
                phoneNumbers.TypeText = phoneElement.TypeText;
                phoneNumbers.TechTypeText = phoneElement.TechTypeText;
                phoneNumbers.Value = phoneElement.Value;
                phoneNumbers.Operation = phoneElement.Operation;
                phoneNumbers.OSIText = phoneElement.OSIText;
                phoneNumbers.CarrierCode = phoneElement.CarrierCode;
                phoneNumbers.Remark = phoneElement.Remark;
                phoneNumbers.LocationCode = phoneElement.LocationCode;
                phoneNumbers.AreaCityCode = phoneElement.AreaCityCode;
                PassengerList.PhoneNumbers.push(phoneNumbers);
            });
            PassengerList.DateOfBirth = response.DateOfBirth;
            PassengerList.Age = null;
            PassengerList.AssociatedAdultRPH = null;
            PassengerList.AssociatedInfantRPH = null;
            PassengerList.PassengerRefNumber = response.PassengerRefNumber;
            var selectedpax = SelectedPassenger.Passenger.filter(function (m) { return m.RPH == response.RPH; });
            PassengerList.FqtTravelers = selectedpax[0].FqtTravelers;
            PassengerList.Nationality = null;
            PassengerList.EmergencyDetails = [];
            var CheckedBags = new appinterface.Bagtag.CheckedBag();
            var BaggageInfo = new appinterface.Bagtag.BaggageInfo();
            var Totalweight_1 = 0;
            BaggegeDetails.forEach(function (Detail, Index) {
                if (!Detail.AlreadyExisting) {
                    var BagTagDetails = new appinterface.Bagtag.BagTagDetail();
                    BagTagDetails.BagTagType = "0";
                    if (Detail.tagNumber != null && Detail.tagNumber.length == 6) {
                        BagTagDetails.SerialNumber = Detail.tagNumber;
                        BagTagDetails.CarrierCode = "CM";
                    }
                    else {
                        BagTagDetails.SerialNumber = Detail.tagNumber;
                        BagTagDetails.CarrierCode = "CM";
                    }
                    BagTagDetails.BagTagCount = "1";
                    BagTagDetails.IssuerCode = "CM";
                    BagTagDetails.WeightToDelete = "0";
                    Totalweight_1 += Number(Detail.weight);
                    BagTagDetails.WeightToDelete_Editable = false;
                    BagTagDetails.SegmentRPH = flightInfo.RPH;
                    BagTagDetails.ShortCheckAirportCode = Detail.ShortCheckAirportCode;
                    BagTagDetails.Weight = Detail.weight;
                    BagTagDetails.IsAutoBag = Detail.auto;
                    BagTagDetails.RFISC_SubCode = Detail.Code;
                    BagTagDetails.Amount = 0;
                    BagTagDetails.CheckedInIndicator = "F";
                    // BagTagDetails.BaggageRPH = "1";
                    // BagTagDetails.isStandard = Detail.standard;
                    // BagTagDetails.fess = Detail.fees;
                    // BagTagDetails.productDescription = BagTagDetails.isStandard ? Detail.StdProduct : Detail.CtlgProduct
                    BaggageInfo.BagTagDetails.push(BagTagDetails);
                    if (!BagTagDetails.IsAutoBag) {
                        PassengerList.isManualBag = true;
                    }
                }
            });
            BaggageInfo.CheckedBagWeightTotal = Totalweight_1.toString();
            console.log(BaggageInfo.CheckedBagWeightTotal);
            BaggageInfo.UnitOfMeasureCode = "16";
            BaggageInfo.PassengerRPH = response.RPH;
            BaggageInfo.CheckedBagCountTotal = BaggegeDetails != null ? BaggegeDetails.filter(function (m) { return m.AlreadyExisting != true; }).length.toString() : "0";
            CheckedBags.BaggageInfo = BaggageInfo;
            CheckedBags.CancelOperation = false;
            CheckedBags.MessageFunction = 30;
            PassengerList.CheckedBags.push(CheckedBags);
            PassengerList.CheckInBagCountTotal = BaggegeDetails != null ? BaggegeDetails.filter(function (m) { return m.AlreadyExisting != true; }).length.toString() : "0";
            PassengerList.CheckInBagWeightTotal = Totalweight_1.toString();
            PassengerList.Selected = true;
            PassengerList.GivenNameRefNumber = 1;
            tag.PassengerList.push(PassengerList);
            var SegmentList = new appinterface.Bagtag.SegmentList();
            SegmentList.RPH = flightInfo.SegmentRPH;
            SegmentList.DepartureDateTime = flightInfo.DepartureDateTime;
            SegmentList.ArrivalDateTime = flightInfo.ArrivalDateTime;
            SegmentList.MarketingFlight = flightInfo.MarketingFlight;
            SegmentList.DepartureCity = flightInfo.DepartureCity;
            SegmentList.OperatingFlight = flightInfo.OperatingFlight;
            SegmentList.StatusCategory = flightInfo.StatusCategory;
            SegmentList.RBD = flightInfo.RBD;
            SegmentList.OriginRBD = null;
            SegmentList.UpgradeRBD = null;
            SegmentList.UpgradeType = 0;
            SegmentList.Cabin = null;
            SegmentList.PassengerRPHs = response.RPH;
            SegmentList.SegmentRPH = flightInfo.SegmentRPH;
            var FlightCheckIn = new appinterface.Bagtag.FlightCheckIn();
            FlightCheckIn.CheckInStatus = flightInfo.FlightCheckIn;
            SegmentList.FlightCheckIn = FlightCheckIn;
            SegmentList.FlightInfo = flightInfo.FlightInfo;
            SegmentList.Selected = true;
            SegmentList.IsThroughOrChangeOfGaugeFlight = flightInfo.IsThroughOrChangeOfGaugeFlight;
            tag.SegmentList.push(SegmentList);
            var SegmentTravelerInfo = new appinterface.Bagtag.SegmentTravelerInfo();
            SegmentTravelerInfo.PassengerRPH = response.RPH;
            SegmentTravelerInfo.SegmentRPH = flightInfo.SegmentRPH;
            SegmentTravelerInfo.Seats = flightInfo.Seats;
            SegmentTravelerInfo.PassengerFullName = response.FullName;
            SegmentTravelerInfo.Selected = true;
            SegmentTravelerInfo.PassengerRefNumber = response.PassengerRefNumber;
            tag.SegmentTravelerInfo.push(SegmentTravelerInfo);
            if (ApplicationSettings.getBoolean("isHostBagtag")) {
                tag.DeliveryDetail = new appinterface.BagTagPrint.BoardingPassDeliveryDetail();
                var BoardingPrint = new appinterface.BagTagPrint.BoardingPassDeliveryDetail();
                var Worksatation = ApplicationSettings.getString("hostBagtagWS", "");
                var DeviceName = ApplicationSettings.getString("bagtagDeviceName", "");
                var DeviceType = ApplicationSettings.getString("BTdeviceType", "");
                var PectabVersion = ApplicationSettings.getString("bagtagpectabVersion", "");
                var OfficeName = ApplicationSettings.getString("hostBagtagOffice", "");
                BoardingPrint.Email = null;
                BoardingPrint.Gateway = "WS";
                BoardingPrint.PrinterAddress = "MyPrinter123";
                BoardingPrint.Printer = new appinterface.BoardingPass.Printer();
                BoardingPrint.Printer.DeviceName = DeviceName;
                BoardingPrint.Printer.ClientCode = "CM";
                BoardingPrint.Printer.OfficeName = OfficeName;
                BoardingPrint.Printer.PectabVersion = PectabVersion;
                BoardingPrint.Printer.WorkstationName = Worksatation;
                BoardingPrint.Printer.DeviceType = DeviceType;
                // bagTagDetail.DeliveryDetail = BoardingPrint;
                tag.DeliveryDetail = BoardingPrint;
            }
            else {
                tag.DeliveryDetail = new appinterface.BagTagPrint.BoardingPassDeliveryDetail();
                var BoardingPrint = new appinterface.BagTagPrint.BoardingPassDeliveryDetail();
                BoardingPrint.Printer = new appinterface.BoardingPass.Printer();
                tag.DeliveryDetail = BoardingPrint;
            }
            return tag;
        }
        catch (error) {
            console.log(error.message);
        }
    };
    Converters.GetBagCatalog = function (response) {
        var PassengerArray = [];
        PassengerArray = response.Passengers;
        var SegmentArray = [];
        SegmentArray = response.Segments;
        var baggagecatalog = {
            "PassengerList": PassengerArray, "SegmentList": SegmentArray
        };
        console.log(baggagecatalog);
        return baggagecatalog;
    };
    Converters.DeleteBagTag = function (response, flightInfo, BaggegeDetails) {
        try {
            var tag = new appinterface.Bagtag.DeleteObject();
            tag.ID = response.OrderID;
            tag.CheckInType = "DeletePassengerInfo";
            tag.CheckInMessageFunctionType = "DeletePassengerInfo";
            var ClientViewModel = new appinterface.Bagtag.ClientViewModelDelete();
            ClientViewModel.MessageFunction = 31;
            tag.ClientViewModel = ClientViewModel;
            var PassengerList = new appinterface.Bagtag.PassengerListDelete();
            PassengerList.OrderId = response.OrderID;
            PassengerList.Firstname = response.FirstName;
            PassengerList.Lastname = response.LastName;
            PassengerList.SurnameRefNumber = response.SurnameRefNumber;
            PassengerList.Prefix = null;
            PassengerList.RPH = response.RPH;
            PassengerList.Emails = [];
            PassengerList.PassengerTypeCode = response.PassengerTypeCode;
            response.PhoneNumbers.forEach(function (phoneElement, phoneIndex) {
                var phoneNumbers = new appinterface.Bagtag.PhoneNumber();
                phoneNumbers.IsRefValue = phoneElement.IsRefValue;
                phoneNumbers.Type = phoneElement.Type;
                phoneNumbers.TypeText = phoneElement.TypeText;
                phoneNumbers.TechTypeText = phoneElement.TechTypeText;
                phoneNumbers.Value = phoneElement.Value;
                phoneNumbers.Operation = phoneElement.Operation;
                phoneNumbers.OSIText = phoneElement.OSIText;
                phoneNumbers.CarrierCode = phoneElement.CarrierCode;
                phoneNumbers.Remark = phoneElement.Remark;
                phoneNumbers.LocationCode = phoneElement.LocationCode;
                phoneNumbers.AreaCityCode = phoneElement.AreaCityCode;
                PassengerList.PhoneNumbers.push(phoneNumbers);
            });
            PassengerList.DateOfBirth = response.DateOfBirth;
            PassengerList.Age = null;
            PassengerList.AssociatedAdultRPH = null;
            PassengerList.AssociatedInfantRPH = null;
            // var FqtTravelers = new Bagtag.FqtTravelers();
            // FqtTravelers.IsRefValue = false;
            // FqtTravelers.LoyalLevel = null;
            // FqtTravelers.LoyaltyLevelName = null;
            // FqtTravelers.MembershipID = 232532147;
            // FqtTravelers.ProgramID = "CM";
            // FqtTravelers.AwardInformation = null;
            // FqtTravelers.VendorCodes = "CM";
            // FqtTravelers.Operation = null;
            PassengerList.FqtTravelers = [];
            PassengerList.Nationality = null;
            PassengerList.EmergencyDetails = [];
            var BaggageInfoToDelete = new appinterface.Bagtag.BaggageInfoToDelete();
            // var BaggageInfo = new Bagtag.BaggageInfo();
            BaggegeDetails.forEach(function (Detail, Index) {
                if (Detail.status == "Pending Delete") {
                    var BagTagDetails = new appinterface.Bagtag.BagTagDetailDelete();
                    BagTagDetails.BagTagType = Detail.BagTagDetails.BagTagType;
                    BagTagDetails.SerialNumber = Detail.BagTagDetails.SerialNumber;
                    BagTagDetails.BagTagCount = "1";
                    BagTagDetails.CarrierCode = Detail.BagTagDetails.CarrierCode;
                    BagTagDetails.IssuerCode = Detail.BagTagDetails.IssuerCode;
                    BagTagDetails.WeightToDelete = Detail.weight;
                    BagTagDetails.WeightToDelete_Editable = true;
                    BagTagDetails.SegmentRPH = Detail.BagTagDetails.SegmentRPH;
                    BagTagDetails.RFISC_SubCode = null;
                    BagTagDetails.Weight = null;
                    BagTagDetails.Amount = null;
                    BagTagDetails.IsAutoBag = true;
                    BaggageInfoToDelete.BagTagDetails.push(BagTagDetails);
                }
            });
            if (response.BaggageInfo != null && response.BaggageInfo != "" && response.BaggageInfo.UnitOfMeasureQuantity != null) {
                BaggageInfoToDelete.CheckedBagWeightTotal = response.BaggageInfo.UnitOfMeasureQuantity.toString();
            }
            else {
                BaggageInfoToDelete.CheckedBagWeightTotal = response.UnitOfMeasureQuantity.toString();
            }
            BaggageInfoToDelete.UnitOfMeasureCode = "16";
            // BaggageInfoToDelete.CheckedBagCountTotal = BaggegeDetails != null ? BaggegeDetails.filter(m => m.status == "Pending Delete").length.toString() : "0";
            BaggageInfoToDelete.CheckedBagCountTotal = response.BagCount;
            BaggageInfoToDelete.PassengerRPH = response.RPH;
            PassengerList.BaggageInfoToDelete = BaggageInfoToDelete;
            PassengerList.CheckInBagCountTotal = response.BagCount;
            PassengerList.CheckInBagWeightTotal = response.UnitOfMeasureQuantity.toString();
            PassengerList.CheckinRePrint = false;
            PassengerList.CancelOperation = false;
            PassengerList.Selected = true;
            PassengerList.GivenNameRefNumber = "1";
            PassengerList.FOID = null;
            PassengerList.GivenName = response.FirstName;
            PassengerList.Surname = response.LastName;
            PassengerList.PassengerRefNumber = response.PassengerRefNumber;
            tag.PassengerList.push(PassengerList);
            var SegmentList = new appinterface.Bagtag.SegmentList();
            SegmentList.RPH = flightInfo.SegmentRPH;
            SegmentList.DepartureDateTime = flightInfo.DepartureDateTime;
            SegmentList.ArrivalDateTime = flightInfo.ArrivalDateTime;
            SegmentList.MarketingFlight = flightInfo.MarketingFlight;
            SegmentList.DepartureCity = flightInfo.DepartureCity;
            SegmentList.OperatingFlight = flightInfo.OperatingFlight;
            SegmentList.StatusCategory = flightInfo.StatusCategory;
            SegmentList.RBD = flightInfo.RBD;
            SegmentList.OriginRBD = null;
            SegmentList.UpgradeRBD = null;
            SegmentList.UpgradeType = 0;
            SegmentList.Cabin = null;
            SegmentList.PassengerRPHs = response.RPH;
            SegmentList.SegmentRPH = flightInfo.SegmentRPH;
            var FlightCheckIn = new appinterface.Bagtag.FlightCheckIn();
            FlightCheckIn.CheckInStatus = flightInfo.FlightCheckIn;
            SegmentList.FlightCheckIn = FlightCheckIn;
            SegmentList.FlightInfo = flightInfo.FlightInfo;
            SegmentList.Selected = true;
            SegmentList.IsThroughOrChangeOfGaugeFlight = false;
            tag.SegmentList.push(SegmentList);
            var SegmentTravelerInfo = new appinterface.Bagtag.SegmentTravelerInfo();
            SegmentTravelerInfo.PassengerRPH = response.RPH;
            SegmentTravelerInfo.SegmentRPH = flightInfo.SegmentRPH;
            SegmentTravelerInfo.Seats = flightInfo.Seats;
            SegmentTravelerInfo.PassengerFullName = response.FullName;
            SegmentTravelerInfo.Selected = true;
            SegmentTravelerInfo.PassengerRefNumber = response.PassengerRefNumber;
            tag.SegmentTravelerInfo.push(SegmentTravelerInfo);
            var Worksatation = ApplicationSettings.getString("hostPrinter", "");
            var DeviceName = ApplicationSettings.getString("bagtagDeviceName", "");
            var PectabVersion = ApplicationSettings.getString("bagtagpectabVersion", "");
            tag.DeliveryDetail = new appinterface.BoardingPass.BoardingPassDeliveryDetail();
            var BoardingPrint = new appinterface.BoardingPass.BoardingPassDeliveryDetail();
            BoardingPrint.Email = null;
            BoardingPrint.Gateway = "WS";
            BoardingPrint.PrinterAddress = DeviceName;
            BoardingPrint.Printer = new appinterface.BoardingPass.Printer();
            BoardingPrint.Printer.DeviceName = DeviceName;
            BoardingPrint.Printer.ClientCode = "CM";
            BoardingPrint.Printer.OfficeName = "";
            BoardingPrint.Printer.PectabVersion = PectabVersion;
            BoardingPrint.Printer.WorkstationName = Worksatation;
            tag.DeliveryDetail = BoardingPrint;
            return tag;
        }
        catch (error) {
            console.log(error.message);
        }
    };
    Converters.ConvertToOutBound = function (response) {
        try {
            console.log("inside ConvertToOutBound");
            var obj1 = new appinterface.OutBound.Outbou();
            var outboundCount = 0;
            obj1.PassengerCount = 0;
            if (response != null) {
                if (response.OutboundFlights != null) {
                    response.OutboundFlights.forEach(function (element, Index) {
                        outboundCount = outboundCount + element.PassengerCount;
                        console.log("inside OutBound " + outboundCount);
                    });
                    obj1.PassengerCount = outboundCount;
                }
            }
            return outboundCount;
        }
        catch (ex) {
            console.log(ex.message);
        }
    };
    Converters.ConvertToPrintBoardingPass = function (responseData, segmentList, passengerDetails, type, response, RPHValue) {
        try {
            var boardingPass = new appinterface.BoardingPass.RootObject();
            // boardingPass.PassengerList = [new appinterface.BoardingPass.PassengerList()];
            // boardingPass.SegmentList = [new appinterface.BoardingPass.SegmentList()];
            var checkedInData_1 = false;
            responseData.forEach(function (elements, index) {
                var selectedPassenger = segmentList.Passenger.filter(function (m) { return m.FirstName == elements.FirstName && m.LastName == elements.LastName; })[0];
                if (selectedPassenger != null) {
                    if (selectedPassenger.CheckinStatus == true) {
                        checkedInData_1 = true;
                    }
                }
            });
            if (checkedInData_1) {
                var flightdetails = passengerDetails.Segments.filter(function (m) { return m.RPH == segmentList.RPH; })[0];
                if (responseData != null && flightdetails != null) {
                    // boardingPass.CheckInType = "CheckIn"
                    if (type == 'hosted') {
                        var Worksatation = ApplicationSettings.getString("hostBoardingWS", "");
                        var DeviceName = ApplicationSettings.getString("boardingPassDeviceName", "");
                        var PectabVersion = ApplicationSettings.getString("pectabVersion", "");
                        var DeviceType = ApplicationSettings.getString("deviceType", "");
                        var Office = ApplicationSettings.getString("hostBoardingOffice", "");
                        boardingPass.DeliveryDetail = new appinterface.BoardingPass.BoardingPassDeliveryDetail();
                        var BoardingPrint = new appinterface.BoardingPass.BoardingPassDeliveryDetail();
                        BoardingPrint.Email = null;
                        BoardingPrint.Gateway = "WS";
                        BoardingPrint.PrinterAddress = DeviceName;
                        BoardingPrint.Printer = new appinterface.BoardingPass.Printer();
                        BoardingPrint.Printer.DeviceName = DeviceName;
                        BoardingPrint.Printer.ClientCode = "CM";
                        BoardingPrint.Printer.OfficeName = Office;
                        BoardingPrint.Printer.PectabVersion = PectabVersion;
                        BoardingPrint.Printer.DeviceType = DeviceType;
                        BoardingPrint.Printer.WorkstationName = Worksatation;
                        boardingPass.DeliveryDetail = BoardingPrint;
                    }
                    responseData.forEach(function (elements, index) {
                        var selectedPassenger = segmentList.Passenger.filter(function (m) { return m.FirstName == elements.FirstName && m.LastName == elements.LastName; })[0];
                        if (selectedPassenger != null) {
                            if (selectedPassenger.CheckinStatus == true && selectedPassenger.CheckinPassengerType != "INF") {
                                var passengerDetail = new appinterface.BoardingPass.PassengerList();
                                passengerDetail.OrderId = selectedPassenger.OrderID;
                                passengerDetail.SurnameRefNumber = selectedPassenger.SurnameRefNumber;
                                //passengerDetail.SequenceNumber = null;
                                passengerDetail.AssociatedInfantRPH = selectedPassenger.AssociatedInfantRPH;
                                passengerDetail.AssociatedAdultRPH = selectedPassenger.AssociatedAdultRPH;
                                // passengerDetail.CheckedBagCount = selectedPassenger.BagCount;
                                passengerDetail.Firstname = selectedPassenger.FirstName;
                                passengerDetail.Lastname = selectedPassenger.LastName;
                                // passengerDetail.PassengerRefNumber = selectedPassenger.PassengerRefNumber;
                                // passengerDetail.PassengerTypeCode = selectedPassenger.PassengerTypeCode;
                                // passengerDetail.RPH = selectedPassenger.RPH;
                                passengerDetail.ApisStatus = selectedPassenger.ApisDocoStatus;
                                passengerDetail.GivenName = selectedPassenger.FirstName;
                                // passengerDetail.Selected = true;
                                // passengerDetail.EmergencyDetails = [];
                                passengerDetail.FqtTravelers = selectedPassenger.FqtTravelers;
                                if (selectedPassenger.AssociatedInfantRPH != null) {
                                    passengerDetail.INFGivenName = segmentList.Passenger.filter(function (m) { return m.RPH == selectedPassenger.AssociatedInfantRPH; })[0].FirstName;
                                    passengerDetail.INFSurname = segmentList.Passenger.filter(function (m) { return m.RPH == selectedPassenger.AssociatedInfantRPH; })[0].LastName;
                                }
                                else if (selectedPassenger.CheckinPassengerType == "INF") {
                                    passengerDetail.INFGivenName = selectedPassenger.FirstName;
                                    passengerDetail.INFSurname = selectedPassenger.LastName;
                                    passengerDetail.AssociatedInfantRPH = selectedPassenger.RPH;
                                }
                                boardingPass.Passengers.push(passengerDetail);
                            }
                        }
                    });
                    var segmentDetail = new appinterface.BoardingPass.SegmentList();
                    if (response.Segment.filter(function (m) { return m.MarketingFlight.substr(0, 2) == "CM" || (m.OperatingFlight != null && m.OperatingFlight.substr(0, 2) == "CM"); }).length > 0) {
                        var flightlist = response.Segment.filter(function (m) { return m.MarketingFlight.substr(0, 2) == "CM" || (m.OperatingFlight != null && m.OperatingFlight.substr(0, 2) == "CM"); })[0];
                        if (flightlist.FlightInfo.length > 0) {
                            if (flightlist.RPH <= segmentList.RPH) {
                                segmentDetail.DepartureCity = flightlist.DepartureCity;
                                segmentDetail.ArrivalCity = flightlist.Destination;
                                segmentDetail.DepartureDateTime = flightlist.DepartureDateTime;
                                if (flightlist.MarketingFlight.substr(0, 2) != "CM" && flightlist.OperatingFlight != null && flightlist.OperatingFlight.substr(0, 2) == "CM") {
                                    segmentDetail.MarketingFlight = flightlist.OperatingFlight;
                                }
                                else {
                                    segmentDetail.MarketingFlight = flightlist.MarketingFlight;
                                }
                                segmentDetail.RPH = (RPHValue + 1).toString();
                                console.log(flightlist);
                                // segmentDetail.Gate = flightlist.FlightInfo[0].DepartureTerminalGate;
                                boardingPass.Segments.push(segmentDetail);
                            }
                            else {
                                Toast.makeText("Cannot Print BoardingPass for OA flights").show();
                                boardingPass = null;
                            }
                        }
                        else {
                            segmentDetail.DepartureCity = segmentList.DepartureCity;
                            segmentDetail.DepartureDateTime = segmentList.DepartureDateTime;
                            // segmentDetail.Gate = segmentList.FlightInfo[0].DepartureTerminalGate;
                            segmentDetail.MarketingFlight = segmentList.MarketingFlight;
                            segmentDetail.RPH = "1";
                            segmentDetail.OrderId = segmentList.Passenger[0].OrderID;
                            boardingPass.Segments.push(segmentDetail);
                        }
                    }
                    else {
                        Toast.makeText("Cannot Print BoardingPass for OA flights").show();
                        boardingPass = null;
                    }
                }
                else {
                }
            }
            else {
                boardingPass = null;
            }
            console.log(JSON.stringify(boardingPass));
            return boardingPass;
        }
        catch (error) {
            console.log(error.message);
        }
    };
    Converters.ConvertToPrintBagTag = function (responseData, segmentList, passengerDetails, type, segmentDetails) {
        try {
            var bagTagDetail = new appinterface.BagTagPrint.RootObject();
            var checkedInData_2 = false;
            responseData.forEach(function (elements, index) {
                var selectedPassenger = segmentList.Passenger.filter(function (m) { return m.FirstName == elements.FirstName && m.LastName == elements.LastName; })[0];
                if (selectedPassenger != null) {
                    if (selectedPassenger.CheckinStatus == true) {
                        checkedInData_2 = true;
                    }
                }
            });
            var requestData = null;
            if (checkedInData_2) {
                //  if (responseData.BaggageInfo.BagTagDetails != null) {
                var flightdetails = passengerDetails.Segments.filter(function (m) { return m.RPH == segmentList.RPH; })[0];
                if (responseData != null && flightdetails != null) {
                    // boardingPass.CheckInType = "CheckIn"
                    if (type == 'hosted') {
                        bagTagDetail.DeliveryDetail = new appinterface.BagTagPrint.BoardingPassDeliveryDetail();
                        var BoardingPrint = new appinterface.BagTagPrint.BoardingPassDeliveryDetail();
                        var Worksatation = ApplicationSettings.getString("hostBagtagWS", "");
                        var DeviceName = ApplicationSettings.getString("bagtagDeviceName", "");
                        var DeviceType = ApplicationSettings.getString("BTdeviceType", "");
                        var PectabVersion = ApplicationSettings.getString("bagtagpectabVersion", "");
                        BoardingPrint.Email = null;
                        BoardingPrint.Gateway = "WS";
                        BoardingPrint.PrinterAddress = "MyPrinter123";
                        BoardingPrint.Printer = new appinterface.BoardingPass.Printer();
                        BoardingPrint.Printer.DeviceName = DeviceName;
                        BoardingPrint.Printer.ClientCode = "CM";
                        BoardingPrint.Printer.OfficeName = "MARKS_OFFICE";
                        BoardingPrint.Printer.PectabVersion = PectabVersion;
                        BoardingPrint.Printer.WorkstationName = Worksatation;
                        BoardingPrint.Printer.DeviceType = DeviceType;
                        bagTagDetail.DeliveryDetail = BoardingPrint;
                    }
                    responseData.forEach(function (elements, index) {
                        var selectedPassenger = segmentList.Passenger.filter(function (m) { return m.FirstName == elements.FirstName && m.LastName == elements.LastName; })[0];
                        console.dir(selectedPassenger);
                        if (selectedPassenger != null) {
                            if (selectedPassenger.CheckinStatus == true) {
                                var passengerDetail = new appinterface.BagTagPrint.PassengerList();
                                passengerDetail.OrderId = selectedPassenger.OrderID;
                                passengerDetail.PassengerRefNumber = selectedPassenger.PassengerRefNumber;
                                passengerDetail.CheckinAirportCode = segmentList.Origin;
                                passengerDetail.AssociatedInfantRPH = selectedPassenger.AssociatedInfantRPH;
                                passengerDetail.CheckedBagCount = selectedPassenger.BagCount;
                                passengerDetail.Firstname = selectedPassenger.FirstName;
                                passengerDetail.Lastname = selectedPassenger.LastName;
                                passengerDetail.PassengerTypeCode = selectedPassenger.PassengerTypeCode;
                                passengerDetail.RPH = selectedPassenger.RPH;
                                passengerDetail.Selected = true; // responseData.Selected;
                                passengerDetail.CheckInBagCountTotal = selectedPassenger.BagCount.toString();
                                passengerDetail.CheckInBagWeightTotal = selectedPassenger.UnitOfMeasureQuantity;
                                var BagsInfo_1 = new appinterface.BagTagPrint.BaggageInfo();
                                BagsInfo_1.PassengerRPH = selectedPassenger.RPH;
                                BagsInfo_1.CheckedBagCountTotal = selectedPassenger.BaggageInfo.CheckedBagCountTotal != null ? selectedPassenger.BaggageInfo.CheckedBagCountTotal : "0";
                                BagsInfo_1.CheckedBagWeightTotal = selectedPassenger.BaggageInfo.UnitOfMeasureQuantity;
                                BagsInfo_1.UnitOfMeasureCode = selectedPassenger.BaggageInfo.UnitOfMeasureCode;
                                if (selectedPassenger.BaggageInfo.BagTagDetails != null) {
                                    selectedPassenger.BaggageInfo.BagTagDetails.forEach(function (bags, indexs) {
                                        var BagTagDetail = new appinterface.BagTagPrint.BagTagDetail();
                                        BagTagDetail.BagTagType = bags.BagTagType;
                                        BagTagDetail.SerialNumber = bags.SerialNumber;
                                        BagTagDetail.BagTagCount = bags.BagTagCount;
                                        BagTagDetail.CarrierCode = bags.CarrierCode;
                                        BagTagDetail.IssuerCode = bags.IssuerCode;
                                        BagTagDetail.WeightToDelete = bags.WeightToDelete;
                                        BagTagDetail.WeightToDelete_Editable = bags.WeightToDelete_Editable;
                                        BagTagDetail.SegmentRPH = bags.SegmentRPH;
                                        BagsInfo_1.BagTagDetails.push(BagTagDetail);
                                    });
                                }
                                var bagsInfoDetails = new appinterface.BagTagPrint.CheckedBags();
                                bagsInfoDetails.BaggageInfo = BagsInfo_1;
                                bagsInfoDetails.CancelOperation = false;
                                passengerDetail.CheckedBags.push(bagsInfoDetails);
                                var fqt = new appinterface.BagTagPrint.FqtTraveler();
                                if (elements.FQTVNumber != "" || elements.FQTVNumber == null) {
                                    fqt.MembershipID = elements.FQTVNumber;
                                    fqt.ProgramID = elements.ProgramIDxx;
                                }
                                passengerDetail.FqtTravelers.push(fqt);
                                bagTagDetail.Passengers.push(passengerDetail);
                            }
                        }
                    });
                    var segmentDetail = new appinterface.BagTagPrint.SegmentList();
                    segmentDetail.ArrivalDateTime = segmentList.ArrivalDateTime;
                    segmentDetail.DepartureCity = segmentList.DepartureCity;
                    segmentDetail.DepartureDateTime = segmentList.DepartureDateTime;
                    segmentDetail.Gate = null;
                    segmentDetail.MarketingFlight = segmentList.MarketingFlight;
                    segmentDetail.OperatingFlight = segmentList.OperatingFlight;
                    segmentDetail.RPH = segmentList.RPH;
                    segmentDetail.Selected = true; //segmentList.Selected;
                    bagTagDetail.Segments.push(segmentDetail);
                }
                requestData = bagTagDetail;
                // }
                // if (requestData == null) {
                //     bagTagDetail = requestData;
                // }
            }
            else {
                bagTagDetail = requestData;
            }
            return bagTagDetail;
        }
        catch (error) {
            console.log(error.message);
        }
    };
    Converters.ConvertToFqtvUpdateTemplate = function (PassengerResponse, fqtv, VendorCodes, id) {
        try {
            var sDate = new Date();
            console.log('Convert FQTV Update Template --------------- Start Date Time : ' + sDate);
            var Obj = new appmodel.FQTVUpdate.RootObject;
            console.log("fqtv" + JSON.stringify(PassengerResponse.OrderId));
            Obj.OrderId = PassengerResponse.OrderID;
            Obj.Changes = ["5"];
            Obj.ReturnOrder = true;
            var Obj1 = new appmodel.FQTVUpdate.Traveler;
            Obj1.Firstname = PassengerResponse.FirstName;
            Obj1.Lastname = PassengerResponse.LastName;
            Obj1.Prefix = null;
            Obj1.PrefixText = null;
            Obj1.RPH = PassengerResponse.RPH;
            Obj1.SurnameRefNumber = PassengerResponse.SurnameRefNumber;
            Obj1.PassengerTypeCode = PassengerResponse.PassengerTypeCode;
            Obj1.DateOfBirth = PassengerResponse.DateOfBirth;
            Obj1.Age = null;
            Obj1.AssociatedInfantRPH = PassengerResponse.AssociatedInfantRPH;
            var Obj2 = new appmodel.FQTVUpdate.FqtTraveler;
            Obj2.IsRefValue = false;
            Obj2.MembershipID = fqtv;
            if (id == "replace") {
                Obj2.Operation = "REPLACE";
            }
            else {
                Obj2.Operation = "DELETE";
            }
            Obj2.VendorCodes = VendorCodes.substr(0, 2);
            Obj2.ProgramID = VendorCodes.substr(0, 2);
            Obj1.FqtTravelers.push(Obj2);
            Obj.Traveler = Obj1;
            return Obj;
        }
        catch (error) {
            console.log(error.message);
        }
    };
    Converters.prototype.ConverToBluetoothPrinter = function () {
        var obj = new appmodel.PrintModel.RootObject();
        var outputRequest = new appmodel.PrintModel.OutputRequest();
        var printer = new appmodel.PrintModel.Printer();
        //printer =
        return obj;
    };
    Converters.ConvertToOAOffloadTemplate = function (response, SelectedPassenger, segmentList, index, checkintype) {
        try {
            var obj_8 = new appinterface.InterlineThroughCheckin.RootObject();
            if (checkintype == "Waitlist") {
                obj_8.CheckInType = "Waitlist";
            }
            else {
                obj_8.CheckInType = "InterlineCheckInChangeSeat";
            }
            var previousIndex = index - 1;
            if (segmentList.Segment.filter(function (m) { return m.MarketingFlight.substr(0, 2) == "CM"; }).length > 0) {
                var flightlist_1 = segmentList.Segment[previousIndex];
                if (flightlist_1.MarketingFlight.substr(0, 2) == "CM") {
                    var SegObj = new appinterface.InterlineThroughCheckin.SegmentList();
                    SegObj.RPH = "1";
                    SegObj.DepartureDateTime = flightlist_1.DepartureDateTime;
                    SegObj.DepartureCity = flightlist_1.DepartureCity;
                    SegObj.MarketingFlight = flightlist_1.MarketingFlight;
                    SegObj.Selected = true;
                    obj_8.SegmentList.push(SegObj);
                    if (SelectedPassenger.length > 0) {
                        SelectedPassenger.forEach(function (elements, Paxindex) {
                            var responseData = response[0].Passenger.filter(function (m) { return m.FirstName == elements.FirstName && m.LastName == elements.LastName; })[0];
                            var PaxObj = new appinterface.InterlineThroughCheckin.PassengerList();
                            PaxObj.GivenName = responseData.FirstName;
                            PaxObj.Surname = responseData.LastName;
                            PaxObj.Emails = [];
                            PaxObj.PassengerTypeCode = responseData.PassengerTypeCode;
                            PaxObj.PassengerRefNumber = responseData.PassengerRefNumber;
                            PaxObj.PhoneNumbers = responseData.PhoneNumbers;
                            var FQTVObj = new appinterface.InterlineThroughCheckin.FqtTraveler();
                            FQTVObj.MembershipID = null;
                            FQTVObj.ProgramID = null;
                            PaxObj.FqtTravelers.push(FQTVObj);
                            PaxObj.EmergencyDetails = [];
                            PaxObj.Status = "Unknown";
                            PaxObj.OrderId = responseData.OrderID;
                            PaxObj.CheckedBagCount = responseData.BagCount;
                            PaxObj.SurnameRefNumber = responseData.SurnameRefNumber;
                            PaxObj.SurnameRefNumberCount = responseData.SurnameRefNumberCount;
                            // let OutboundFlightsObj = new appinterface.InterlineThroughCheckin.OutBoundConnectingFlightInfo();
                            // OutboundFlightsObj.FlightRPH = "1";
                            // let obj3 = new appinterface.InterlineThroughCheckin.FlightNumber();
                            // var length = segmentList.Segment[index].MarketingFlight.length;
                            // var airlineCode =segmentList.Segment[index].MarketingFlight.substring(0, 2);
                            // var NumberLen: number =segmentList.Segment[index].MarketingFlight.length - 2;
                            // var VendorCode = segmentList.Segment[index].MarketingFlight.substring(2);
                            // obj3.AirlineCode = airlineCode;
                            // obj3.Number = VendorCode;
                            // OutboundFlightsObj.FlightNumber.push(obj3);
                            // OutboundFlightsObj.ActualDepartureDateTime = segmentList.Segment[index].DepartureDateTime;
                            // OutboundFlightsObj.DepartureCode = segmentList.Segment[index].DepartureCity;
                            // OutboundFlightsObj.ArrivalCode = segmentList.Segment[index].Destination;
                            // var NextSegPassengerDetails = segmentList.Segment[index].Passenger.filter(m => m.FirstName == elements.FirstName && m.LastName == elements.LastName)[0];
                            // let obj4 = new appinterface.InterlineThroughCheckin.SeatList();
                            // obj4.Cabin = null;
                            // if (NextSegPassengerDetails.SeatNumber != "Auto") {
                            //     obj4.SeatNumber = null;
                            // } else {
                            //     obj4.SeatNumber = null;
                            // }
                            // OutboundFlightsObj.SeatList.push(obj4);
                            // OutboundFlightsObj.ResBookDesigCode = segmentList.Segment[index].RBD;
                            // let obj5 = new appinterface.InterlineThroughCheckin.FqtTraveler2();
                            // obj5.MembershipID = null;
                            // obj5.ProgramID = null;
                            // OutboundFlightsObj.FqtTravelers.push(obj5);
                            // PaxObj.OutBoundConnectingFlightInfo.push(OutboundFlightsObj);
                            PaxObj.OutBoundConnectingFlightInfo = [];
                            console.log("RPB:" + flightlist_1.RBD);
                            PaxObj.ResBookDesigCode = flightlist_1.RBD;
                            PaxObj.RPH = responseData.RPH;
                            PaxObj.Firstname = responseData.FirstName;
                            PaxObj.Lastname = responseData.LastName;
                            PaxObj.Selected = true;
                            PaxObj.AssociatedInfantRPH = null;
                            obj_8.PassengerList.push(PaxObj);
                        });
                    }
                }
                else {
                    Toast.makeText("Cannot perform offload");
                    obj_8 = null;
                }
            }
            else {
                Toast.makeText("Cannot perform offload");
                obj_8 = null;
            }
            return obj_8;
        }
        catch (error) {
            console.log(error.message);
        }
    };
    Converters.ConvertToInterlineThroughCheckInPostTemplate = function (response, SelectedPassenger, segmentList, index, Flightdeatils, checkintype, Order, CheckedBags) {
        try {
            var obj_9 = new appinterface.InterlineThroughCheckin.RootObject();
            if (checkintype == "Waitlist") {
                obj_9.CheckInType = "Waitlist";
            }
            else {
                obj_9.CheckInType = "InterlineCheckIn";
            }
            var nextIndex = index + 1;
            var SegObj = new appinterface.InterlineThroughCheckin.SegmentList();
            SegObj.RPH = "1";
            SegObj.DepartureDateTime = segmentList.Segment[index].DepartureDateTime;
            SegObj.DepartureCity = segmentList.Segment[index].DepartureCity;
            SegObj.MarketingFlight = segmentList.Segment[index].MarketingFlight;
            SegObj.Selected = true;
            SegObj.OrderId = response[0].Passenger[0].OrderID;
            obj_9.SegmentList.push(SegObj);
            if (SelectedPassenger.length > 0) {
                SelectedPassenger.forEach(function (elements, Paxindex) {
                    var responseData = response[0].Passenger.filter(function (m) { return m.FirstName == elements.FirstName && m.LastName == elements.LastName; })[0];
                    var PaxObj = new appinterface.InterlineThroughCheckin.PassengerList();
                    PaxObj.GivenName = responseData.FirstName;
                    PaxObj.Surname = responseData.LastName;
                    PaxObj.Emails = [];
                    PaxObj.PassengerTypeCode = responseData.PassengerTypeCode;
                    PaxObj.PassengerRefNumber = responseData.PassengerRefNumber;
                    PaxObj.SurnameRefNumber = responseData.SurnameRefNumber;
                    PaxObj.SurnameRefNumberCount = responseData.SurnameRefNumberCount;
                    PaxObj.PhoneNumbers = responseData.PhoneNumbers;
                    var FQTVObj = new appinterface.InterlineThroughCheckin.FqtTraveler();
                    FQTVObj.MembershipID = null;
                    FQTVObj.ProgramID = null;
                    PaxObj.FqtTravelers.push(FQTVObj);
                    PaxObj.EmergencyDetails = [];
                    if (Order.SegmentTravelerInfos != null && Order.SegmentTravelerInfos.filter(function (m) { return m.PassengerRPH == responseData.RPH && m.SegmentRPH == segmentList.Segment[index].RPH; })[0].CheckinInfos != null) {
                        PaxObj.Status = Order.SegmentTravelerInfos.filter(function (m) { return m.PassengerRPH == responseData.RPH && m.SegmentRPH == segmentList.Segment[index].RPH; })[0].CheckinInfos[0].Status;
                    }
                    else {
                        PaxObj.Status = "UNKNOWN";
                    }
                    PaxObj.addPartialMember = false;
                    PaxObj.OrderId = responseData.OrderID;
                    if (responseData.BagCount == null || responseData.BagCount == 0) {
                        PaxObj.CheckedBagCount = 0;
                        // PaxObj.IsBaggageChecked = false;
                    }
                    else {
                        PaxObj.CheckedBagCount = responseData.BagCount;
                        // PaxObj.IsBaggageChecked = true;
                    }
                    // PaxObj.CheckedBagCount = responseData.BagCount;
                    // console.log(CheckedBags.filter(m => m.RPH == responseData.RPH).length);
                    if (CheckedBags != null && CheckedBags.length > 0 && CheckedBags.filter(function (m) { return m.RPH == responseData.RPH; }).length > 0) {
                        PaxObj.CheckedBags = CheckedBags.filter(function (m) { return m.RPH == responseData.RPH; })[0].CheckedBags;
                        obj_9.Source = "TAB";
                        if (CheckedBags.filter(function (m) { return m.RPH == responseData.RPH; })[0].isManualBag) {
                            obj_9.isManualBag = true;
                        }
                        else {
                            obj_9.isManualBag = false;
                        }
                        if (ApplicationSettings.getBoolean("isHostBagtag")) {
                            obj_9.BoardingPassDeliveryDetail = [];
                            var BoardingPrint = new appinterface.BagTagPrint.BoardingPassDeliveryDetail();
                            var Worksatation = ApplicationSettings.getString("hostBagtagWS", "");
                            var DeviceName = ApplicationSettings.getString("bagtagDeviceName", "");
                            var DeviceType = ApplicationSettings.getString("BTdeviceType", "");
                            var PectabVersion = ApplicationSettings.getString("bagtagpectabVersion", "");
                            BoardingPrint.Email = null;
                            BoardingPrint.Gateway = "WS";
                            BoardingPrint.PrinterAddress = "MyPrinter123";
                            BoardingPrint.Printer = new appinterface.BoardingPass.Printer();
                            BoardingPrint.Printer.DeviceName = DeviceName;
                            BoardingPrint.Printer.ClientCode = "CM";
                            BoardingPrint.Printer.OfficeName = "MARKS_OFFICE";
                            BoardingPrint.Printer.PectabVersion = PectabVersion;
                            BoardingPrint.Printer.WorkstationName = Worksatation;
                            BoardingPrint.Printer.DeviceType = DeviceType;
                            obj_9.BluetoothBagTag = false;
                            // bagTagDetail.DeliveryDetail = BoardingPrint;
                            obj_9.BoardingPassDeliveryDetail.push(BoardingPrint);
                        }
                        else {
                            obj_9.BoardingPassDeliveryDetail = [];
                            var BoardingPrint = new appinterface.BagTagPrint.BoardingPassDeliveryDetail();
                            BoardingPrint.Printer = new appinterface.BoardingPass.Printer();
                            obj_9.BluetoothBagTag = true;
                            obj_9.BoardingPassDeliveryDetail.push(BoardingPrint);
                        }
                    }
                    var OutboundFlightsObj = new appinterface.InterlineThroughCheckin.OutBoundConnectingFlightInfo();
                    OutboundFlightsObj.FlightRPH = "1";
                    var obj3 = new appinterface.InterlineThroughCheckin.FlightNumber();
                    var length = Flightdeatils.length;
                    var airlineCode = Flightdeatils.substring(0, 2);
                    var NumberLen = Flightdeatils.length - 2;
                    var VendorCode = Flightdeatils.substring(2);
                    obj3.AirlineCode = airlineCode;
                    obj3.Number = VendorCode;
                    OutboundFlightsObj.FlightNumber.push(obj3);
                    OutboundFlightsObj.ActualDepartureDateTime = segmentList.Segment[nextIndex].DepartureDateTime;
                    OutboundFlightsObj.DepartureCode = segmentList.Segment[nextIndex].DepartureCity;
                    OutboundFlightsObj.ArrivalCode = segmentList.Segment[nextIndex].Destination;
                    var NextSegPassengerDetails = segmentList.Segment[nextIndex].Passenger.filter(function (m) { return m.FirstName == elements.FirstName && m.LastName == elements.LastName; })[0];
                    var obj4 = new appinterface.InterlineThroughCheckin.SeatList();
                    obj4.Cabin = null;
                    if (NextSegPassengerDetails.SeatNumber != "Auto") {
                        obj4.SeatNumber = NextSegPassengerDetails.SeatNumber;
                    }
                    else {
                        obj4.SeatNumber = null;
                    }
                    OutboundFlightsObj.SeatList.push(obj4);
                    OutboundFlightsObj.ResBookDesigCode = segmentList.Segment[nextIndex].RBD;
                    var obj5 = new appinterface.InterlineThroughCheckin.FqtTraveler2();
                    obj5.MembershipID = null;
                    obj5.ProgramID = null;
                    OutboundFlightsObj.FqtTravelers.push(obj5);
                    PaxObj.OutBoundConnectingFlightInfo.push(OutboundFlightsObj);
                    console.log("RPB:" + segmentList.Segment[index].RBD);
                    PaxObj.ResBookDesigCode = segmentList.Segment[index].RBD;
                    PaxObj.RPH = responseData.RPH;
                    PaxObj.Firstname = responseData.FirstName;
                    PaxObj.Lastname = responseData.LastName;
                    PaxObj.Selected = true;
                    PaxObj.AssociatedInfantRPH = null;
                    obj_9.PassengerList.push(PaxObj);
                });
            }
            return obj_9;
        }
        catch (error) {
            console.log(error.message);
        }
    };
    Converters.BluetoothPrinterResponse = function (addManualBagTagRequest, bagtagVMDetails, BluetoothPrintStatus) {
        try {
            var bluetoothReq = new appinterface.PrintResponse.RootObject();
            bluetoothReq.addManualBagTagRequest = addManualBagTagRequest;
            bluetoothReq.bagTagVMDetails = bagtagVMDetails;
            bluetoothReq.BluetoothPrintStatus = BluetoothPrintStatus;
            if (bluetoothReq.bagTagVMDetails.BagTagPrintResponse != null && bluetoothReq.bagTagVMDetails.BagTagPrintResponse.BagTagOutput != null && bluetoothReq.bagTagVMDetails.BagTagPrintResponse.BagTagOutput.length > 0) {
                bluetoothReq.bagTagVMDetails.BagTagPrintResponse.BagTagOutput[0].PicRawData = null;
            }
            console.log(bluetoothReq);
            return bluetoothReq;
        }
        catch (error) {
            console.log(error.message);
        }
    };
    Converters.BluetoothPrinterResponseCheckin = function (CheckinRequest, CheckinResponse, BluetoothPrintStatus) {
        try {
            var bluetoothReq = new appinterface.CheckinPrintResponse.RootObject();
            bluetoothReq.CheckinRequest = CheckinRequest;
            bluetoothReq.CheckinResponse = CheckinResponse;
            bluetoothReq.BluetoothPrintStatus = BluetoothPrintStatus;
            if (bluetoothReq.CheckinResponse.BagTagOutput != null && bluetoothReq.CheckinResponse.BagTagOutput.length > 0) {
                bluetoothReq.CheckinResponse.BagTagOutput[0].PicRawData = null;
            }
            console.log(bluetoothReq);
            return bluetoothReq;
        }
        catch (error) {
            console.log(error.message);
        }
    };
    // public static ConvertToSendBoardingPassEmail(responseData: appinterface.MultiSegmentTemplate.Passenger, segmentList: appinterface.MultiSegmentTemplate.FlightWithPax, passengerDetails: appmodel.Order.RootObject): any {
    //     try {
    //         var boardingPass: appinterface.BoardingPass.RootObject = new appinterface.BoardingPass.RootObject();
    //         if (responseData != null) {
    //             var flightdetails = passengerDetails.Segments.filter(m => m.RPH == segmentList.RPH)[0];
    //             if (responseData != null && flightdetails != null) {
    //                 boardingPass.id = null;
    //                 boardingPass.self = null;
    //                 boardingPass.resolved = true;
    //                 boardingPass.Gateway = "EMAIL";
    //                 boardingPass.DocumentType = "BP";
    //                 boardingPass.Source = "Travel";
    //                 var boarding = new appinterface.BoardingPass.Boarding();
    //                 var document = new appinterface.BoardingPass.Document();
    //                 var order = new appinterface.BoardingPass.Order();
    //                 order.OrderId = responseData.OrderID;
    //                 var passenger = new appinterface.BoardingPass.Passenger();
    //                 passenger.FirstName = responseData.FirstName;
    //                 passenger.LastName = responseData.LastName;
    //                 passenger.EliteStatus = "PRESIDENTIAL PLATINUM";
    //                 passenger.LoyaltyId = responseData.FQTVNumber;
    //                 passenger.Prefix = "";
    //                 var flight = new appinterface.BoardingPass.Flight;
    //                 flight.OperatingCarrierCode = segmentList.MarketingFlight.toString().substr(0, 2);
    //                 flight.OperatingCarrierNumber = segmentList.MarketingFlight.toString().substr(2, 3);
    //                 flight.OperatingCarrierName = "";
    //                 flight.MarketingCarrierCode = "";
    //                 flight.MarketingCarrierNumber = "";
    //                 flight.MarketingCarrierName = "";
    //                 flight.BookingStatus = "Status";
    //                 flight.SeatNumber = responseData.SeatNumber;
    //                 flight.Duration = "";
    //                 flight.AircraftType = "";
    //                 flight.LayoverTime = "";
    //                 flight.Terminal = "";
    //                 flight.Gate = " ";
    //                 flight.Group = "01";
    //                 var time = new Date(segmentList.DepartureDateTime);
    //                 time.setTime(time.getTime() - (45 * 60 * 1000));
    //                 flight.GateTime = time.toISOString().substr(11, 5);
    //                 flight.PreferAccessInd = "";
    //                 flight.SeqNum = "22";
    //                 flight.TicketNumber = responseData.TicketNumbers;
    //                 var departure = new appinterface.BoardingPass.Departure;
    //                 departure.AirportCode = flightdetails.Origin.AirportCode;
    //                 //In pdf Field name  is not updated  correctly
    //                 //  departure.AirportName = flightdetails.Origin.AirportFullName;
    //                 departure.AirportName = flightdetails.Origin.City;
    //                 departure.CityCode = flightdetails.Origin.City.substring(0, 2);
    //                 departure.CityName = flightdetails.Origin.CountryCode;
    //                 departure.CountryCode = flightdetails.Origin.CountryCode;
    //                 departure.CountryName = flightdetails.Origin.Country;
    //                 departure.Date = moment(segmentList.DepartureDateTime.toString()).format("DD MMM YYYY");
    //                 departure.Time = segmentList.DepartureDateTime.toString().substr(11, 5);
    //                 departure.Terminal = "A";
    //                 flight.Departure = departure;
    //                 var arrival = new appinterface.BoardingPass.Arrival;
    //                 arrival.AirportCode = flightdetails.Destination.AirportCode;
    //                 arrival.AirportName = flightdetails.Destination.AirportFullName;
    //                 arrival.AirportName = flightdetails.Destination.City;
    //                 arrival.CityCode = flightdetails.Destination.City.substring(0, 2);
    //                 arrival.CityName = flightdetails.Destination.CountryCode;
    //                 arrival.StateName = flightdetails.Destination.City;
    //                 arrival.CountryCode = flightdetails.Destination.CountryCode;
    //                 arrival.CountryName = flightdetails.Destination.Country;
    //                 arrival.Date = moment(segmentList.ArrivalDateTime.toString()).format("DD MMM YYYY");
    //                 arrival.Time = segmentList.ArrivalDateTime.toString().substr(11, 5);
    //                 arrival.Terminal = "A";
    //                 flight.Arrival = arrival;
    //                 passenger.Flight = flight;
    //                 boarding.Passenger = passenger;
    //                 order.Boarding = [];
    //                 order.Boarding[0] = boarding;
    //                 document.Order = order;
    //                 boardingPass.Document = document;
    //                 var airlineVendor = new appinterface.BoardingPass.AirlineVendor;
    //                 airlineVendor.VendorId = "CM";
    //                 airlineVendor.VendorName = "COPA AIRLINES";
    //                 boardingPass.AirlineVendor = airlineVendor;
    //                 var email = new appinterface.BoardingPass.Email;
    //                 email.To = [responseData.Emails];
    //                 email.AlternateAddr = [responseData.Emails];
    //                 email.From = "noreply@copaair.com";
    //                 email.Subject = "Please find the attached Boarding Pass";
    //                 email.Message = "Please find the attached Document";
    //                 boardingPass.Email = email;
    //             }
    //         }
    //         console.dir(boardingPass);
    //         return boardingPass;
    //     } catch (error) {
    //         console.log(error.message);
    //     }
    // }
    // ----------------------------------------------------------Compensation Convertors from here ------------------------------------------------------------------------------------------------------//
    Converters.convertoCompensationPassengerList = function (response, FlightDetails, loc) {
        try {
            var compensationObejct_1 = new appinterface.CompensationSearchModule.CompensationRootObject;
            var flightModel_1 = new appinterface.CompensationSearchModule.FlightModel;
            // console.log("V in con" + JSON.stringify(FlightDetails));
            compensationObejct_1.FlightModel = flightModel_1;
            if (response.FlightSegments) {
                if (FlightDetails.Flights != null) {
                    flightModel_1.DepartureAirport = FlightDetails.Flights[0].Legs[0].DepartureAirport.LocationCode;
                    flightModel_1.DestinationAirport = FlightDetails.Flights[0].Legs[0].ArrivalAirport.LocationCode;
                    flightModel_1.DepartureDate = FlightDetails.Parameters.DepartureDate.toString().substr(0, 10);
                    flightModel_1.FlightNumber = FlightDetails.Parameters.FlightNumber;
                    flightModel_1.DepartureDateTime = FlightDetails.Flights[0].Legs[0].DepartureDateTime.Scheduled;
                    if (FlightDetails.Flights[0].Legs.length > 1) {
                        console.log("legs inside");
                        console.log(loc);
                        var legs = FlightDetails.Flights[0].Legs.filter(function (m) { return m.DepartureAirport.LocationCode == loc; })[0];
                        flightModel_1.STD = legs.DepartureDateTime.Scheduled.toString().substr(11, 5);
                        flightModel_1.ETD = legs.DepartureDateTime.Estimated.toString().substr(11, 5);
                        flightModel_1.STA = legs.ArrivalDateTime.Scheduled.toString().substr(11, 5);
                        flightModel_1.finalDestination = FlightDetails.Flights[0].Legs[1].ArrivalAirport.LocationCode;
                        flightModel_1.multiLegFlight = true;
                        FlightDetails.Flights[0].Legs.forEach(function (legs, legIndex) {
                            if (legIndex >= 1) {
                                flightModel_1.Legs.push(legs.ArrivalAirport.LocationCode);
                            }
                        });
                    }
                    else {
                        flightModel_1.STD = FlightDetails.Flights[0].Legs[0].DepartureDateTime.Scheduled.toString().substr(11, 5);
                        flightModel_1.ETD = FlightDetails.Flights[0].Legs[0].DepartureDateTime.Estimated.toString().substr(11, 5);
                        flightModel_1.STA = FlightDetails.Flights[0].Legs[0].ArrivalDateTime.Scheduled.toString().substr(11, 5);
                    }
                    flightModel_1.ArrivalDateTime = FlightDetails.Flights[0].Legs[0].ArrivalDateTime.Scheduled;
                    flightModel_1.Status = FlightDetails.Flights[0].Legs[0].Status;
                }
                else {
                    flightModel_1.DepartureAirport = response.FlightSegments[0].Departure;
                    flightModel_1.DestinationAirport = response.FlightSegments[0].Arrival;
                    flightModel_1.DepartureDate = moment(response.FlightSegments[0].DepartureDt.toString().substr(0, 10)).format("YYYY-MM-DD");
                    flightModel_1.FlightNumber = response.FlightSegments[0].FlightNo;
                    flightModel_1.STD = "N/A";
                    flightModel_1.ETD = "N/A";
                    flightModel_1.STA = "N/A";
                    flightModel_1.DepartureDateTime = moment(response.FlightSegments[0].DepartureDt.toString().substr(0, 10)).format("YYYY-MM-DD");
                    flightModel_1.Status = "N/A";
                }
                if (response.FlightSegments[0].Passengers) {
                    response.FlightSegments[0].Passengers.forEach(function (CompPax, CompIndex) {
                        console.log("Passenger List");
                        var CompPaxObj = new appinterface.CompensationSearchModule.CompensationPassengerList;
                        CompPaxObj.FlightSegmentId = CompPax.FlightSegmentId;
                        CompPaxObj.GivenName = CompPax.PaxFirstNm;
                        CompPaxObj.LastName = CompPax.PaxLastNm;
                        CompPaxObj.FullName = CompPax.PaxLastNm + "/" + CompPax.PaxFirstNm;
                        CompPaxObj.OrderId = CompPax.OrderId;
                        CompPaxObj.AdditionalDetails = "Edit";
                        if (CompPax.CabinClass == null) {
                            CompPaxObj.Cabin = "";
                        }
                        else {
                            CompPaxObj.Cabin = CompPax.CabinClass;
                        }
                        CompPaxObj.CheckedInIndicator = CompPax.CheckedInIndicator;
                        if (CompPax.Compensations) {
                            CompPaxObj.CompensationReasonId = CompPax.Compensations[0].CompReasonId;
                            CompPaxObj.CompensationReason = CompPax.Compensations[0].CompReasonText;
                        }
                        else {
                            CompPaxObj.CompensationReason = "";
                        }
                        if (CompPax.SSRS) {
                            CompPax.SSRS.forEach(function (SSRs, Index) {
                                CompPaxObj.SSRsCount = SSRs.SSRsCount;
                                SSRs.SpecialRequest.forEach(function (SSR, index) {
                                    CompPaxObj.SSRs.push(SSR);
                                });
                            });
                        }
                        if (CompPax.FqtvTier == "Gold") {
                            CompPaxObj.Tier = "G";
                        }
                        else if (CompPax.FqtvTier == "Silver") {
                            CompPaxObj.Tier = "S";
                        }
                        else if (CompPax.FqtvTier == "Presidential") {
                            CompPaxObj.Tier = "PP";
                        }
                        else if (CompPax.FqtvTier == "Platinum") {
                            CompPaxObj.Tier = "P";
                        }
                        else {
                            CompPaxObj.Tier = CompPax.FqtvTier;
                        }
                        CompPaxObj.IsExistingCompensation = CompPax.IsExistingCompensation;
                        CompPaxObj.SSR = CompPax.SSR;
                        CompPaxObj.PassengerSeq = CompPax.PassengerSeq;
                        CompPaxObj.OutboundIndicator = CompPax.OutboundIndicator;
                        CompPaxObj.SurnameNum = CompPax.SurnameNum;
                        CompPaxObj.FirstnameNum = CompPax.FirstnameNum;
                        CompPaxObj.FqtvCc = CompPax.FqtvCc;
                        CompPaxObj.FqtvNumber = CompPax.FqtvNumber;
                        CompPaxObj.PaxStatus = CompPax.PaxStatus;
                        CompPaxObj.PaxRPH = CompPax.PaxRPH;
                        CompPaxObj.Origin = CompPax.Origin;
                        CompPaxObj.Dest = CompPax.Dest;
                        CompPaxObj.PaxSplChar = CompPax.PaxSplChar;
                        CompPaxObj.EticketIndicator = CompPax.EticketIndicator;
                        CompPaxObj.PaxEmailAddress = CompPax.PaxEmailAddress;
                        CompPaxObj.UpdateLockNbr = CompPax.UpdateLockNbr;
                        CompPaxObj.PaxType = CompPax.PaxType;
                        CompPaxObj.BoardingIndicator = CompPax.BoardingIndicator;
                        CompPaxObj.NonRevenueIndicator = CompPax.NonRevenueIndicator;
                        CompPaxObj.EticketStatus = CompPax.EticketStatus;
                        CompPaxObj.EticketOutofSyncIndicator = CompPax.EticketOutofSyncIndicator;
                        CompPaxObj.IsCompensationIssued = CompPax.IsCompensationIssued;
                        CompPaxObj.IsCompensationNotIssued = CompPax.IsCompensationNotIssued;
                        CompPaxObj.WorldTracerNum = CompPax.WorldTracerNum;
                        CompPaxObj.CustomerCareCaseNum = CompPax.CustomerCareCaseNum;
                        CompPaxObj.Etkt = CompPax.Etkt;
                        CompPaxObj.Email = CompPax.PaxEmailAddress;
                        CompPaxObj.ReaccomDetails = CompPax.ReaccomDetails;
                        CompPaxObj.Bags = CompPax.Bags;
                        CompPaxObj.Compensations = CompPax.Compensations;
                        CompPaxObj.ExistingCompensations = CompPax.ExistingCompensations;
                        if (CompPax.ExistingCompensations != null) {
                            CompPax.ExistingCompensations.forEach(function (exiCompData, exiCompIndex) {
                                exiCompData.Emds.forEach(function (exiEMDData, exiEMDIndex) {
                                    CompPaxObj.ExistingCompensations[exiCompIndex].Emds[exiEMDIndex].IssueDt = moment(exiEMDData.IssueD).format("YYYY-MM-DD");
                                });
                            });
                        }
                        compensationObejct_1.PassengerList.push(CompPaxObj);
                        // this.NewPassengerList.push(CompPaxObj);
                    });
                }
            }
            else {
                console.log("Compensation List");
                if (response.Results[0].FlightSegments || response.Results[0].FlightSegments[0].Passengers) {
                    if (FlightDetails.Flights != null) {
                        flightModel_1.DepartureAirport = FlightDetails.Flights[0].Legs[0].DepartureAirport.LocationCode;
                        flightModel_1.DestinationAirport = FlightDetails.Flights[0].Legs[0].ArrivalAirport.LocationCode;
                        flightModel_1.DepartureDate = FlightDetails.Parameters.DepartureDate.toString().substr(0, 10);
                        flightModel_1.FlightNumber = FlightDetails.Parameters.FlightNumber;
                        flightModel_1.DepartureDateTime = FlightDetails.Flights[0].Legs[0].DepartureDateTime.Scheduled;
                        flightModel_1.ArrivalDateTime = FlightDetails.Flights[0].Legs[0].ArrivalDateTime.Scheduled;
                        if (FlightDetails.Flights[0].Legs.length > 1) {
                            console.log("legs inside");
                            console.log(loc);
                            var legs = FlightDetails.Flights[0].Legs.filter(function (m) { return m.DepartureAirport.LocationCode == loc; })[0];
                            flightModel_1.STD = legs.DepartureDateTime.Scheduled.toString().substr(11, 5);
                            flightModel_1.ETD = legs.DepartureDateTime.Estimated.toString().substr(11, 5);
                            flightModel_1.STA = legs.ArrivalDateTime.Scheduled.toString().substr(11, 5);
                            flightModel_1.finalDestination = FlightDetails.Flights[0].Legs[1].ArrivalAirport.LocationCode;
                            flightModel_1.multiLegFlight = true;
                        }
                        else {
                            flightModel_1.STD = FlightDetails.Flights[0].Legs[0].DepartureDateTime.Scheduled.toString().substr(11, 5);
                            flightModel_1.ETD = FlightDetails.Flights[0].Legs[0].DepartureDateTime.Estimated.toString().substr(11, 5);
                            flightModel_1.STA = FlightDetails.Flights[0].Legs[0].ArrivalDateTime.Scheduled.toString().substr(11, 5);
                        }
                        flightModel_1.Status = FlightDetails.Flights[0].Legs[0].Status;
                    }
                    else {
                        flightModel_1.DepartureAirport = response.Results[0].FlightSegments[0].Departure;
                        flightModel_1.DestinationAirport = response.Results[0].FlightSegments[0].Arrival;
                        flightModel_1.DepartureDate = response.Results[0].FlightSegments[0].DepartureDt;
                        flightModel_1.FlightNumber = response.Results[0].FlightSegments[0].AirlineCode + response.Results[0].FlightSegments[0].FlightNo;
                        flightModel_1.STD = "N/A";
                        flightModel_1.ETD = "N/A";
                        flightModel_1.STA = "N/A";
                        flightModel_1.Status = "N/A";
                        flightModel_1.DepartureDateTime = response.Results[0].FlightSegments[0].DepartureDt;
                    }
                    response.Results[0].FlightSegments[0].Passengers.forEach(function (CompPax, CompIndex) {
                        console.log("came here");
                        var CompPaxObj = new appinterface.CompensationSearchModule.CompensationPassengerList;
                        CompPaxObj.FlightSegmentId = CompPax.FlightSegmentId;
                        CompPaxObj.GivenName = CompPax.PaxFirstNm;
                        CompPaxObj.LastName = CompPax.PaxLastNm;
                        CompPaxObj.FullName = CompPax.PaxLastNm + "/" + CompPax.PaxFirstNm;
                        CompPaxObj.OrderId = CompPax.OrderId;
                        CompPaxObj.AdditionalDetails = "Edit";
                        if (CompPax.CabinClass == null) {
                            CompPaxObj.Cabin = "";
                        }
                        else {
                            CompPaxObj.Cabin = CompPax.CabinClass;
                        }
                        if (CompPax.Compensations) {
                            CompPaxObj.CompensationReasonId = CompPax.Compensations[0].CompReasonId;
                            CompPaxObj.CompensationReason = CompPax.Compensations[0].CompReasonText;
                        }
                        else {
                            CompPaxObj.CompensationReason = "";
                        }
                        if (CompPax.SSRS) {
                            CompPax.SSRS.forEach(function (SSRs, Index) {
                                CompPaxObj.SSRsCount = SSRs.SSRsCount;
                                SSRs.SpecialRequest.forEach(function (SSR, index) {
                                    CompPaxObj.SSRs.push(SSR);
                                });
                            });
                        }
                        if (CompPax.FqtvTier == "Gold") {
                            CompPaxObj.Tier = "G";
                        }
                        else if (CompPax.FqtvTier == "Silver") {
                            CompPaxObj.Tier = "S";
                        }
                        else if (CompPax.FqtvTier == "Presidential") {
                            CompPaxObj.Tier = "PP";
                        }
                        else if (CompPax.FqtvTier == "Platinum") {
                            CompPaxObj.Tier = "P";
                        }
                        else {
                            CompPaxObj.Tier = CompPax.FqtvTier;
                        }
                        CompPaxObj.IsExistingCompensation = CompPax.IsExistingCompensation;
                        CompPaxObj.SSR = CompPax.SSR;
                        CompPaxObj.Origin = CompPax.Origin;
                        CompPaxObj.Dest = CompPax.Dest;
                        CompPaxObj.PassengerSeq = CompPax.PassengerSeq;
                        CompPaxObj.SurnameNum = CompPax.SurnameNum;
                        CompPaxObj.OutboundIndicator = CompPax.OutboundIndicator;
                        CompPaxObj.FirstnameNum = CompPax.FirstnameNum;
                        CompPaxObj.FqtvCc = CompPax.FqtvCc;
                        CompPaxObj.Origin = CompPax.Origin;
                        CompPaxObj.Dest = CompPax.Dest;
                        CompPaxObj.FqtvNumber = CompPax.FqtvNumber;
                        CompPaxObj.PaxSplChar = CompPax.PaxSplChar;
                        CompPaxObj.CheckedInIndicator = CompPax.CheckedInIndicator;
                        CompPaxObj.EticketIndicator = CompPax.EticketIndicator;
                        CompPaxObj.BoardingIndicator = CompPax.BoardingIndicator;
                        CompPaxObj.PaxType = CompPax.PaxType;
                        CompPaxObj.NonRevenueIndicator = CompPax.NonRevenueIndicator;
                        CompPaxObj.EticketOutofSyncIndicator = CompPax.EticketOutofSyncIndicator;
                        CompPaxObj.EticketStatus = CompPax.EticketStatus;
                        CompPaxObj.PaxStatus = CompPax.PaxStatus;
                        CompPaxObj.PaxEmailAddress = CompPax.PaxEmailAddress;
                        CompPaxObj.UpdateLockNbr = CompPax.UpdateLockNbr;
                        CompPaxObj.IsCompensationIssued = CompPax.IsCompensationIssued;
                        CompPaxObj.IsCompensationNotIssued = CompPax.IsCompensationNotIssued;
                        CompPaxObj.WorldTracerNum = CompPax.WorldTracerNum;
                        CompPaxObj.CustomerCareCaseNum = CompPax.CustomerCareCaseNum;
                        CompPaxObj.Etkt = CompPax.Etkt;
                        CompPaxObj.ReaccomDetails = CompPax.ReaccomDetails;
                        CompPaxObj.Bags = CompPax.Bags;
                        CompPaxObj.Compensations = CompPax.Compensations;
                        CompPaxObj.ExistingCompensations = CompPax.ExistingCompensations;
                        if (CompPax.ExistingCompensations != null) {
                            CompPax.ExistingCompensations.forEach(function (exiCompData, exiCompIndex) {
                                if (CompPax.Compensations[0].CompReasonText === exiCompData.CompReasonText && CompPax.Compensations[0].FlightNo === exiCompData.FlightNo) {
                                    exiCompData.Emds.forEach(function (exiEMDData, exiEMDIndex) {
                                        if (exiCompData.CompTypeText == "Monetary") {
                                            CompPaxObj.monetary = CompPaxObj.monetary + Number(exiEMDData.CompAmt);
                                            if (exiCompData.Emds[0].Endorsements1Txt) {
                                                CompPaxObj.monetaryendorsementTextItems = exiCompData.Emds[0].Endorsements1Txt.split('.');
                                            }
                                            CompPaxObj.MonetaryOverrideReason = exiCompData.Emds[0].OverrideReason;
                                            if (exiCompData.Emds[0].EmailStatus != null) {
                                                if (exiCompData.Emds[0].EmailStatus == "y") {
                                                    CompPaxObj.monetaryEmailStatus = true;
                                                }
                                                else {
                                                    CompPaxObj.monetaryEmailStatus = false;
                                                }
                                            }
                                            else {
                                                CompPaxObj.monetaryEmailStatus = false;
                                            }
                                            if (exiCompData.Emds[0].PrintStatus != null) {
                                                if (exiCompData.Emds[0].PrintStatus == "y") {
                                                    CompPaxObj.monetaryPrintStatus = true;
                                                }
                                                else {
                                                    CompPaxObj.monetaryPrintStatus = false;
                                                }
                                            }
                                            else {
                                                CompPaxObj.monetaryPrintStatus = false;
                                            }
                                        }
                                        else if (exiCompData.CompTypeText == "Hotel") {
                                            CompPaxObj.hotel = CompPaxObj.hotel + Number(exiEMDData.VoucherCnt);
                                            CompPaxObj.HotelOverrideReason = exiCompData.Emds[0].OverrideReason;
                                            CompPaxObj.hotelDetails = exiCompData.Emds[0].RemarkTxt;
                                            CompPaxObj.hotelendorsementTextItems = exiCompData.Emds[0].Endorsements1Txt.split('.');
                                            if (exiCompData.Emds[0].PrintStatus != null) {
                                                if (exiCompData.Emds[0].PrintStatus == "y") {
                                                    CompPaxObj.hotelPrintStatus = true;
                                                }
                                                else {
                                                    CompPaxObj.hotelPrintStatus = false;
                                                }
                                            }
                                            else {
                                                CompPaxObj.hotelPrintStatus = false;
                                            }
                                        }
                                        else if (exiCompData.CompTypeText == "Meal") {
                                            CompPaxObj.meal = CompPaxObj.meal + Number(exiEMDData.VoucherCnt);
                                            CompPaxObj.MealOverrideReason = exiCompData.Emds[0].OverrideReason;
                                            CompPaxObj.mealDetails = exiCompData.Emds[0].RemarkTxt;
                                            CompPaxObj.mealendorsementTextItems = exiCompData.Emds[0].Endorsements1Txt.split('.');
                                            if (exiCompData.Emds[0].PrintStatus != null) {
                                                if (exiCompData.Emds[0].PrintStatus == "y") {
                                                    CompPaxObj.mealPrintStatus = true;
                                                }
                                                else {
                                                    CompPaxObj.mealPrintStatus = false;
                                                }
                                            }
                                            else {
                                                CompPaxObj.mealPrintStatus = false;
                                            }
                                        }
                                        else {
                                            CompPaxObj.transportation = CompPaxObj.transportation + Number(exiEMDData.VoucherCnt);
                                            CompPaxObj.TransportOverrideReason = exiCompData.Emds[0].OverrideReason;
                                            CompPaxObj.transportEMD = exiCompData.Emds[0].RemarkTxt;
                                            CompPaxObj.transportationendorsementTextItems = exiCompData.Emds[0].Endorsements1Txt.split('.');
                                            if (exiCompData.Emds[0].PrintStatus != null) {
                                                if (exiCompData.Emds[0].PrintStatus == "y") {
                                                    CompPaxObj.transportPrintStatus = true;
                                                }
                                                else {
                                                    CompPaxObj.transportPrintStatus = false;
                                                }
                                            }
                                            else {
                                                CompPaxObj.transportPrintStatus = false;
                                            }
                                        }
                                        CompPaxObj.ExistingCompensations[exiCompIndex].Emds[exiEMDIndex].IssueDt = moment(exiEMDData.IssueDt).format("YYYY-MM-DD");
                                    });
                                }
                            });
                        }
                        compensationObejct_1.PassengerList.push(CompPaxObj);
                        // this.NewPassengerList.push(CompPaxObj);
                    });
                }
            }
            console.dir(compensationObejct_1);
            return compensationObejct_1;
        }
        catch (error) {
            console.log(error.message);
        }
    };
    //Compensation Order List
    Converters.convertToFlightHeaderInfo = function (response, location) {
        try {
            var FlightObejct = new appinterface.CompensationSearchModule.FlightModel;
            if (response.Flights != null) {
                var flightModel = new appinterface.CompensationSearchModule.FlightModel;
                flightModel.DepartureAirport = response.Flights[0].Legs[0].DepartureAirport.LocationCode;
                flightModel.DestinationAirport = response.Flights[0].Legs[0].ArrivalAirport.LocationCode;
                flightModel.DepartureDate = response.Flights[0].Date.toString().substr(0, 10);
                console.log("flight HeaderInfo");
                flightModel.FlightNumber = response.Flights[0].Number;
                flightModel.DepartureDateTime = response.Flights[0].Legs[0].DepartureDateTime;
                flightModel.ArrivalDateTime = response.Flights[0].Legs[0].ArrivalDateTime;
                if (response.Flights[0].Legs.length > 1) {
                    var legs = response.Flights[0].Legs.filter(function (m) { return m.DepartureAirport.LocationCode == location; })[0];
                    flightModel.STD = legs.DepartureDateTime.Scheduled.toString().substr(11, 5);
                    flightModel.ETD = legs.DepartureDateTime.Estimated.toString().substr(11, 5);
                    flightModel.STA = legs.ArrivalDateTime.Scheduled.toString().substr(11, 5);
                    flightModel.finalDestination = response.Flights[0].Legs[1].ArrivalAirport.LocationCode;
                    flightModel.multiLegFlight = true;
                }
                else {
                    flightModel.STD = response.Flights[0].Legs[0].DepartureDateTime.Scheduled.toString().substr(11, 5);
                    flightModel.ETD = response.Flights[0].Legs[0].DepartureDateTime.Estimated.toString().substr(11, 5);
                    flightModel.STA = response.Flights[0].Legs[0].ArrivalDateTime.Scheduled.toString().substr(11, 5);
                }
                flightModel.Status = response.Flights[0].Legs[0].Status;
                FlightObejct = flightModel;
                return FlightObejct;
            }
        }
        catch (error) {
            console.log(error.message);
        }
    };
    //BRE Response
    Converters.convertToBREResponseForOrderId = function (response, Paxresponse) {
        try {
            var sDate = new Date();
            console.log('Convert IssueCompensation Template --------------- Start Date Time : ' + sDate);
            var SegArray_1 = [new appinterface.CompensationOrderID.FlightSegment];
            SegArray_1.length = 0;
            if (response.Results != null) {
                if (response.Results[0].FlightSegments != null && response.Results[0].FlightSegments.length > 0) {
                    response.Results[0].FlightSegments.forEach(function (Segdata, Index) {
                        var SegObj = new appinterface.CompensationOrderID.FlightSegment;
                        SegObj.FlightSegmentId = Segdata.FlightSegmentId;
                        SegObj.AirlineCode = Segdata.AirlineCode;
                        SegObj.FlightNo = Segdata.FlightNo;
                        SegObj.Arrival = Segdata.Arrival;
                        SegObj.FlightSegmentRPH = Segdata.FlightSegmentRPH;
                        SegObj.Departure = Segdata.Departure;
                        SegObj.DepartureDt = Segdata.DepartureDt;
                        SegObj.Passengers = [new appinterface.CompensationOrderID.Passenger];
                        SegObj.Passengers.length = 0;
                        Segdata.Passengers.forEach(function (element, index) {
                            Paxresponse.forEach(function (paxElement, Index) {
                                if (paxElement.GivenName == element.PaxFirstNm && paxElement.LastName == element.PaxLastNm && paxElement.OrderId == element.OrderId) {
                                    var paxEle_1 = new appinterface.CompensationOrderID.Passenger();
                                    paxEle_1.BREEmd = [new appinterface.CompensationOrderID.BREEmd()];
                                    paxEle_1.BREEmd.length = 0;
                                    if (Segdata.BREemd != null && Segdata.BREemd.length > 0) {
                                        Segdata.BREemd.forEach(function (element, index) {
                                            var objEMD = new appinterface.CompensationOrderID.BREEmd();
                                            objEMD.compensationCause = element.compensationCause;
                                            objEMD.compensationType = element.compensationType;
                                            objEMD.currency = element.currency;
                                            objEMD.emdEndorsable = element.emdEndorsable;
                                            objEMD.emdExchangeable = element.emdExchangeable;
                                            objEMD.emdRefundable = element.emdRefundable;
                                            objEMD.emdType = element.emdType;
                                            objEMD.emdUsedAtIssuance = element.emdUsedAtIssuance;
                                            objEMD.endorsementTextItems = element.endorsementTextItems;
                                            if (element.compensationType == "Monetary") {
                                                paxEle_1.monetaryendorsementTextItems = element.endorsementTextItems;
                                            }
                                            else if (element.compensationType == "Hotel") {
                                                paxEle_1.hotelendorsementTextItems = element.endorsementTextItems;
                                            }
                                            else if (element.compensationType == "Meal") {
                                                paxEle_1.mealendorsementTextItems = element.endorsementTextItems;
                                            }
                                            else {
                                                paxEle_1.transportationendorsementTextItems = element.endorsementTextItems;
                                            }
                                            objEMD.formOfPayment = element.formOfPayment;
                                            objEMD.productCode = element.productCode;
                                            objEMD.productName = element.productName;
                                            objEMD.subProductCode = element.subProductCode;
                                            paxEle_1.BREEmd.push(objEMD);
                                        });
                                    }
                                    element.BRE_Compensations.forEach(function (compensations, index) {
                                        if (compensations.compensationType == "Monetary") {
                                            paxEle_1.monetary = compensations.amount;
                                            paxEle_1.monetaryLowerLimit = compensations.lowerLimit;
                                            paxEle_1.monetaryHigherLimit = compensations.upperLimit;
                                        }
                                        else if (compensations.compensationType == "Hotel") {
                                            paxEle_1.hotel = compensations.amount;
                                            paxEle_1.hotelLowerLimit = compensations.lowerLimit;
                                            paxEle_1.hotelHigherLimit = compensations.upperLimit;
                                        }
                                        else if (compensations.compensationType == "Meal") {
                                            paxEle_1.meal = compensations.amount;
                                            paxEle_1.mealLowerLimit = compensations.lowerLimit;
                                            paxEle_1.mealHigherLimit = compensations.upperLimit;
                                        }
                                        else {
                                            paxEle_1.transportation = compensations.amount;
                                            paxEle_1.transportationLowerLimit = compensations.lowerLimit;
                                            paxEle_1.transportationHigherLimit = compensations.upperLimit;
                                        }
                                    });
                                    paxEle_1.FlightSegmentId = element.FlightSegmentId;
                                    paxEle_1.PassengerSeq = element.PassengerSeq;
                                    paxEle_1.OrderId = element.OrderId;
                                    paxEle_1.GivenName = element.PaxFirstNm;
                                    paxEle_1.LastName = element.PaxLastNm;
                                    paxEle_1.FullName = element.PaxLastNm + "/" + element.PaxFirstNm;
                                    paxEle_1.PaxType = element.PaxType;
                                    paxEle_1.FqtvCc = element.FqtvCc;
                                    paxEle_1.FqtvNumber = element.FqFqtvNumber;
                                    paxEle_1.PaxStatus = element.PaxStatus;
                                    paxEle_1.PaxEmailAddress = element.PaxEmailAddress;
                                    paxEle_1.CompensationReasonId = element.PaxCompReasonID;
                                    paxEle_1.BRECompensation = element.BRE_Compensations;
                                    paxEle_1.IsExistingCompensation = element.IsExistingCompensation;
                                    paxEle_1.UpdateLockNbr = element.UpdateLockNbr;
                                    paxEle_1.FqtvTier = element.FqtvTier;
                                    paxEle_1.Cabin = element.CabinClass;
                                    paxEle_1.PaxRPH = element.PaxRPH;
                                    paxEle_1.IsCompensationIssued = element.IsCompensationIssued;
                                    paxEle_1.SSR = element.SSR;
                                    paxEle_1.Etkt = element.Etkt;
                                    paxEle_1.ReaccomDetails = element.ReaccomDetails;
                                    paxEle_1.Bags = element.Bags;
                                    paxEle_1.Compensations = element.Compensations;
                                    paxEle_1.ExistingCompensations = element.ExistingCompensations;
                                    paxEle_1.AdditionalDetails = "Edit";
                                    SegObj.Passengers.push(paxEle_1);
                                }
                            });
                        });
                        SegArray_1.push(SegObj);
                    });
                }
            }
            var eDate = new Date();
            console.log('Convert IssueCompensation Template --------------- End Date Time : ' + eDate);
            console.log('Convert IssueCompensation Template Execution Time : ' + app_executiontime_1.AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
            return SegArray_1;
        }
        catch (error) {
            console.log(error.message);
        }
    };
    Converters.convertToBREResponse = function (response, Paxresponse) {
        try {
            var sDate = new Date();
            console.log('Convert IssueCompensation Template --------------- Start Date Time : ' + sDate);
            Paxresponse.forEach(function (paxEle, Index) {
                if (response.Results != null) {
                    if (response.Results[0].FlightSegments != null && response.Results[0].FlightSegments.length > 0) {
                        response.Results[0].FlightSegments[0].Passengers.forEach(function (element, index) {
                            if (paxEle.GivenName == element.PaxFirstNm && paxEle.LastName == element.PaxLastNm && paxEle.OrderId == element.OrderId) {
                                paxEle.BREEmd = [new appinterface.CompensationSearchModule.BREEmd()];
                                paxEle.BREEmd.length = 0;
                                if (response.Results[0].FlightSegments[0].BREemd != null && response.Results[0].FlightSegments[0].BREemd.length > 0) {
                                    response.Results[0].FlightSegments[0].BREemd.forEach(function (element, index) {
                                        var objEMD = new appinterface.CompensationSearchModule.BREEmd();
                                        objEMD.compensationCause = element.compensationCause;
                                        objEMD.compensationType = element.compensationType;
                                        objEMD.currency = element.currency;
                                        objEMD.emdEndorsable = element.emdEndorsable;
                                        objEMD.emdExchangeable = element.emdExchangeable;
                                        objEMD.emdUsedAtIssuance = element.emdUsedAtIssuance;
                                        objEMD.emdRefundable = element.emdRefundable;
                                        objEMD.emdType = element.emdType;
                                        objEMD.emdUsedAtIssuance = element.emdUsedAtIssuance;
                                        objEMD.endorsementTextItems = element.endorsementTextItems;
                                        if (element.compensationType == "Monetary") {
                                            paxEle.monetaryendorsementTextItems = element.endorsementTextItems;
                                        }
                                        else if (element.compensationType == "Hotel") {
                                            paxEle.hotelendorsementTextItems = element.endorsementTextItems;
                                        }
                                        else if (element.compensationType == "Meal") {
                                            paxEle.mealendorsementTextItems = element.endorsementTextItems;
                                        }
                                        else {
                                            paxEle.transportationendorsementTextItems = element.endorsementTextItems;
                                        }
                                        objEMD.formOfPayment = element.formOfPayment;
                                        objEMD.productCode = element.productCode;
                                        objEMD.productName = element.productName;
                                        objEMD.subProductCode = element.subProductCode;
                                        objEMD.accountCode = element.accountCode;
                                        objEMD.emdEndorsable = element.emdEndorsable;
                                        paxEle.BREEmd.push(objEMD);
                                    });
                                }
                                element.BRE_Compensations.forEach(function (compensations, index) {
                                    if (compensations.compensationType == "Monetary") {
                                        paxEle.monetary = compensations.amount;
                                        paxEle.monetaryInitialValue = compensations.amount;
                                        paxEle.monetaryTempValue = compensations.amount;
                                        paxEle.monetaryLowerLimit = compensations.lowerLimit;
                                        paxEle.monetaryHigherLimit = compensations.upperLimit;
                                    }
                                    else if (compensations.compensationType == "Hotel") {
                                        paxEle.hotel = compensations.amount;
                                        paxEle.hotelInitialValue = compensations.amount;
                                        paxEle.hotelTempValue = compensations.amount;
                                        paxEle.hotelLowerLimit = compensations.lowerLimit;
                                        paxEle.hotelHigherLimit = compensations.upperLimit;
                                    }
                                    else if (compensations.compensationType == "Meal") {
                                        paxEle.meal = compensations.amount;
                                        paxEle.mealInitialValue = compensations.amount;
                                        paxEle.mealTempValue = compensations.amount;
                                        paxEle.mealLowerLimit = compensations.lowerLimit;
                                        paxEle.mealHigherLimit = compensations.upperLimit;
                                    }
                                    else {
                                        paxEle.transportation = compensations.amount;
                                        paxEle.transportationInitialValue = compensations.amount;
                                        paxEle.transportationTempValue = compensations.amount;
                                        paxEle.transportationLowerLimit = compensations.lowerLimit;
                                        paxEle.transportationHigherLimit = compensations.upperLimit;
                                    }
                                });
                                paxEle.FlightSegmentId = element.FlightSegmentId;
                                paxEle.PassengerSeq = element.PassengerSeq;
                                paxEle.OrderId = element.OrderId;
                                paxEle.GivenName = element.PaxFirstNm;
                                paxEle.LastName = element.PaxLastNm;
                                paxEle.FullName = element.PaxLastNm + "/" + element.PaxFirstNm;
                                paxEle.PaxType = element.PaxType;
                                paxEle.FqtvCc = element.FqtvCc;
                                paxEle.FqtvNumber = element.FqFqtvNumber;
                                paxEle.PaxStatus = element.PaxStatus;
                                paxEle.PaxEmailAddress = element.PaxEmailAddress;
                                paxEle.BRECompensation = element.BRE_Compensations;
                                paxEle.IsExistingCompensation = element.IsExistingCompensation;
                                paxEle.UpdateLockNbr = element.UpdateLockNbr;
                                paxEle.FqtvTier = element.FqtvTier;
                                if (element.CabinClass == null) {
                                    paxEle.Cabin = "";
                                }
                                else {
                                    paxEle.Cabin = element.CabinClass;
                                }
                                paxEle.PaxRPH = element.PaxRPH;
                                paxEle.IsCompensationIssued = element.IsCompensationIssued;
                                paxEle.SSR = element.SSR;
                                if (element.SSRS) {
                                    element.SSRS.forEach(function (SSRs, Index) {
                                        paxEle.SSRsCount = SSRs.SSRsCount;
                                        SSRs.SpecialRequest.forEach(function (SSR, index) {
                                            paxEle.SSRs.push(SSR);
                                        });
                                    });
                                }
                                paxEle.Etkt = element.Etkt;
                                paxEle.ReaccomDetails = element.ReaccomDetails;
                                paxEle.Bags = element.Bags;
                                paxEle.Compensations = element.Compensations;
                                paxEle.ExistingCompensations = element.ExistingCompensations;
                                paxEle.AdditionalDetails = "Edit";
                            }
                        });
                    }
                }
            });
            var eDate = new Date();
            console.log('Convert IssueCompensation Template --------------- End Date Time : ' + eDate);
            console.log('Convert IssueCompensation Template Execution Time : ' + app_executiontime_1.AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
            return Paxresponse;
        }
        catch (error) {
            console.log(error.message);
        }
    };
    Converters.ConvertToCompPaxTemplateByFQTV = function (response) {
        try {
            var sDate = new Date();
            console.log('ConvertToCompensationFQTVStatus Template --------------- Start Date Time : ' + sDate);
            var CompObj_1 = [];
            if (response != null && response.length > 0) {
                response.forEach(function (element, index) {
                    var obj = new appinterface.OrderFQTVStatus();
                    obj.OrderID = element.OrderID;
                    obj.PassengerName = element.PassengerName;
                    obj.Status = element.Status;
                    obj.FlightNumber = element.FlightNumber;
                    obj.FlightDate = element.FlightDate.toString().substr(0, 10);
                    obj.RPH = element.RPH;
                    obj.Origin = element.Origin;
                    obj.Destination = element.Destination;
                    CompObj_1.push(obj);
                });
            }
            var eDate = new Date();
            console.log('ConvertToCompensationFQTVStatus Template --------------- End Date Time : ' + eDate);
            console.log('ConvertToCompensationFQTVStatus Template Execution Time : ' + app_executiontime_1.AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
            return CompObj_1;
        }
        catch (error) {
            console.log(error.message);
        }
    };
    Converters.convertToBRERequest = function (paxresponse, privilage, flightresponse) {
        try {
            var obj = new appmodel.BreRequest.RootObject();
            obj.SourceId = "PSS_TABLET";
            obj.privilege = privilage;
            obj.UserId = ApplicationSettings.getString("UserName", "");
            obj.FlightSegments = [new appmodel.BreRequest.FlightSegment()];
            obj.FlightSegments.length = 0;
            var objFlight_1 = new appmodel.BreRequest.FlightSegment();
            objFlight_1.FlightSegmentId = paxresponse[0].FlightSegmentId;
            objFlight_1.AirlineCode = flightresponse.FlightNumber.substr(0, 2);
            objFlight_1.FlightNo = flightresponse.FlightNumber.substr(2);
            objFlight_1.DepartureDt = flightresponse.DepartureDate;
            objFlight_1.Departure = flightresponse.DepartureAirport;
            objFlight_1.Arrival = flightresponse.DestinationAirport;
            objFlight_1.FlightSegmentRPH = null;
            objFlight_1.Passengers = [new appmodel.BreRequest.Passenger()];
            objFlight_1.Passengers.length = 0;
            paxresponse.forEach(function (data, Index) {
                var objPax = new appmodel.BreRequest.Passenger();
                if (data.FlightSegmentId) {
                    objPax.FlightSegmentId = data.FlightSegmentId.toString();
                    ;
                }
                else {
                    objPax.FlightSegmentId = null;
                }
                objPax.PassengerSeq = data.PassengerSeq;
                objPax.OrderId = data.OrderId;
                objPax.PaxLastNm = data.LastName;
                objPax.PaxFirstNm = data.GivenName;
                objPax.PaxType = data.PaxType;
                objPax.PaxCompReasonId = data.CompensationReasonId.toString();
                objPax.FqtvCc = data.FqtvCc;
                objPax.FqtvNumber = data.FqtvNumber;
                objPax.PaxStatus = data.PaxStatus;
                objPax.PaxEmailAddress = data.Email;
                objPax.PaxFirstNm = data.GivenName;
                objPax.Origin = data.Origin;
                objPax.Dest = data.Dest;
                objPax.UpdateLockNbr = data.UpdateLockNbr;
                if (data.TierName == "") {
                    objPax.FqtvTier = null;
                }
                else {
                    objPax.FqtvTier = data.TierName;
                }
                if (data.Cabin == "") {
                    objPax.CabinClass = null;
                }
                else {
                    objPax.CabinClass = data.Cabin;
                }
                objPax.PaxRPH = data.PaxRPH;
                objPax.CompReasonText = data.CompensationReason;
                objPax.SSR = [new appmodel.BreRequest.SSRs()];
                objPax.SSR.length = 0;
                if (data.SSRs) {
                    data.SSRs.forEach(function (SSR, Index) {
                        var ssrObj = new appmodel.BreRequest.SSRs();
                        ssrObj.FlightSegmentId = data.FlightSegmentId;
                        ssrObj.PassengerSeq = data.PassengerSeq;
                        ssrObj.SsrCode = SSR;
                    });
                }
                if (data.Etkt == null) {
                    objPax.Etkt = [];
                }
                else {
                    objPax.Etkt = data.Etkt;
                }
                console.log(JSON.stringify(data.ReaccomDetails));
                if (data.ReaccomDetails) {
                    objPax.ReaccomDetails = [new appmodel.SaveCompensationRequest.ReaccomDetail()];
                    objPax.ReaccomDetails.length = 0;
                    data.ReaccomDetails.forEach(function (ReaccData, Index) {
                        var reaccomObj = new appmodel.SaveCompensationRequest.ReaccomDetail();
                        reaccomObj.FlightSegmentId = ReaccData.FlightSegmentId;
                        reaccomObj.PassengerSeq = ReaccData.PassengerSeq;
                        reaccomObj.ReacomSeq = ReaccData.ReacomSeq;
                        reaccomObj.FromToFlag = ReaccData.FromToFlag;
                        reaccomObj.GUIDisplayFlag = ReaccData.GUIDisplayFlag;
                        reaccomObj.ReaccomAirlineCode = ReaccData.ReaccomAirlineCode.toUpperCase();
                        reaccomObj.ReaccomFlightNo = ReaccData.ReaccomFlightNo;
                        reaccomObj.ReaccomFlightDt = ReaccData.ReaccomFlightDt;
                        reaccomObj.ReaccomBoardCityCd = ReaccData.ReaccomBoardCityCd.toUpperCase();
                        reaccomObj.ReaccomOffCityCd = ReaccData.ReaccomOffCityCd.toUpperCase();
                        reaccomObj.UpdateLockNbr = ReaccData.UpdateLockNbr;
                        objPax.ReaccomDetails.push(reaccomObj);
                    });
                }
                else {
                    objPax.ReaccomDetails = [];
                }
                if (data.Bags == null) {
                    objPax.Bags = [];
                }
                else {
                    objPax.Bags = data.Bags;
                }
                objPax.Compensations = [];
                objFlight_1.Passengers.push(objPax);
            });
            obj.FlightSegments.push(objFlight_1);
            return obj;
        }
        catch (error) {
            console.log(error.message);
        }
    };
    Converters.convertToBRERequestForOrderID = function (response, paxresponse, privilage, flightresponse) {
        try {
            console.log("in 0" + JSON.stringify(paxresponse));
            var obj_10 = new appmodel.BreRequest.RootObject();
            obj_10.SourceId = "PSS_TABLET";
            obj_10.privilege = privilage;
            obj_10.UserId = ApplicationSettings.getString("UserName", "");
            obj_10.FlightSegments = [new appmodel.BreRequest.FlightSegment()];
            obj_10.FlightSegments.length = 0;
            response.FlightSegments.forEach(function (Segdata, SegIndex) {
                var objFlight = new appmodel.BreRequest.FlightSegment();
                objFlight.FlightSegmentId = Segdata.FlightSegmentId;
                objFlight.AirlineCode = Segdata.AirlineCode;
                objFlight.FlightNo = Segdata.FlightNo.substr(2);
                objFlight.DepartureDt = Segdata.DepartureDt;
                objFlight.Departure = Segdata.Departure;
                objFlight.Arrival = Segdata.Arrival;
                objFlight.FlightSegmentRPH = Segdata.FlightSegmentRPH;
                objFlight.Passengers = [new appmodel.BreRequest.Passenger()];
                objFlight.Passengers.length = 0;
                Segdata.Passengers.forEach(function (PaxData, index) {
                    console.log("in 0");
                    paxresponse.forEach(function (data, PaxIndex) {
                        console.log("in 1");
                        if (data.GivenName == PaxData.PaxFirstNm && data.LastName == PaxData.PaxLastNm) {
                            console.log("in 2");
                            var objPax_1 = new appmodel.BreRequest.Passenger();
                            if (data.FlightSegmentId) {
                                objPax_1.FlightSegmentId = data.FlightSegmentId.toString();
                                ;
                            }
                            else {
                                objPax_1.FlightSegmentId = null;
                            }
                            objPax_1.PassengerSeq = data.PassengerSeq;
                            objPax_1.OrderId = data.OrderId;
                            objPax_1.PaxLastNm = data.LastName;
                            objPax_1.PaxFirstNm = data.GivenName;
                            if (data.PaxType == "") {
                                objPax_1.PaxType = null;
                            }
                            else {
                                objPax_1.PaxType = data.PaxType;
                            }
                            objPax_1.PaxCompReasonId = data.CompensationReasonId.toString();
                            objPax_1.FqtvCc = data.FqtvCc;
                            objPax_1.FqtvNumber = data.FqtvNumber;
                            objPax_1.PaxStatus = data.PaxStatus;
                            objPax_1.PaxEmailAddress = "";
                            objPax_1.PaxFirstNm = data.GivenName;
                            objPax_1.UpdateLockNbr = data.UpdateLockNbr;
                            if (data.FqtvTier == "") {
                                objPax_1.FqtvTier = null;
                            }
                            else {
                                objPax_1.FqtvTier = data.FqtvTier;
                            }
                            objPax_1.CabinClass = data.Cabin;
                            objPax_1.PaxRPH = data.PaxRPH;
                            objPax_1.CompReasonText = data.CompensationReason;
                            if (data.SSR == null) {
                                objPax_1.SSR = [];
                            }
                            else {
                                objPax_1.SSR = data.SSR;
                            }
                            if (data.Etkt == null) {
                                objPax_1.Etkt = [];
                            }
                            else {
                                objPax_1.Etkt = data.Etkt;
                            }
                            console.log(JSON.stringify(data.ReaccomDetails));
                            if (data.ReaccomDetails) {
                                objPax_1.ReaccomDetails = [new appmodel.SaveCompensationRequest.ReaccomDetail()];
                                objPax_1.ReaccomDetails.length = 0;
                                data.ReaccomDetails.forEach(function (ReaccData, Index) {
                                    var reaccomObj = new appmodel.SaveCompensationRequest.ReaccomDetail();
                                    reaccomObj.FlightSegmentId = ReaccData.FlightSegmentId;
                                    reaccomObj.PassengerSeq = ReaccData.PassengerSeq;
                                    reaccomObj.ReacomSeq = ReaccData.ReacomSeq;
                                    reaccomObj.FromToFlag = ReaccData.FromToFlag;
                                    reaccomObj.GUIDisplayFlag = ReaccData.GUIDisplayFlag;
                                    reaccomObj.ReaccomAirlineCode = ReaccData.ReaccomAirlineCode.toUpperCase();
                                    reaccomObj.ReaccomFlightNo = ReaccData.ReaccomFlightNo;
                                    reaccomObj.ReaccomFlightDt = ReaccData.ReaccomFlightDt;
                                    reaccomObj.ReaccomBoardCityCd = ReaccData.ReaccomBoardCityCd.toUpperCase();
                                    reaccomObj.ReaccomOffCityCd = ReaccData.ReaccomOffCityCd.toUpperCase();
                                    reaccomObj.UpdateLockNbr = ReaccData.UpdateLockNbr;
                                    objPax_1.ReaccomDetails.push(reaccomObj);
                                });
                            }
                            else {
                                objPax_1.ReaccomDetails = [];
                            }
                            if (data.Bags == null) {
                                objPax_1.Bags = [];
                            }
                            else {
                                objPax_1.Bags = data.Bags;
                            }
                            objPax_1.Compensations = [];
                            objFlight.Passengers.push(objPax_1);
                        }
                    });
                });
                obj_10.FlightSegments.push(objFlight);
            });
            return obj_10;
        }
        catch (error) {
            console.log(error.message);
        }
    };
    Converters.convertToSaveCompensationTemplate = function (paxresponse, flightresponse) {
        try {
            var Obj = new appmodel.SaveCompensationRequest.RootObject();
            Obj.SourceId = "PSS_TABLET";
            Obj.UserId = ApplicationSettings.getString("UserName", "");
            var FlightObj = [new appmodel.SaveCompensationRequest.FlightSegment];
            FlightObj.length = 0;
            Obj.FlightSegments = [new appmodel.SaveCompensationRequest.FlightSegment()];
            Obj.FlightSegments.length = 0;
            var flightele_1 = new appmodel.SaveCompensationRequest.FlightSegment();
            flightele_1.Passengers = [new appmodel.SaveCompensationRequest.Passenger()];
            flightele_1.Passengers.length = 0;
            flightele_1.AirlineCode = flightresponse.FlightNumber.substr(0, 2);
            flightele_1.Arrival = flightresponse.DestinationAirport;
            flightele_1.Departure = flightresponse.DepartureAirport;
            flightele_1.DepartureDt = flightresponse.DepartureDate;
            flightele_1.FlightNo = flightresponse.FlightNumber.substr(2);
            flightele_1.FlightSegmentId = paxresponse[0].FlightSegmentId;
            paxresponse.forEach(function (PaxEle, Index) {
                var paxObj = new appmodel.SaveCompensationRequest.Passenger();
                paxObj.FlightSegmentId = PaxEle.FlightSegmentId;
                paxObj.PassengerSeq = PaxEle.PassengerSeq;
                paxObj.OrderId = PaxEle.OrderId;
                paxObj.SurnameNum = PaxEle.SurnameNum;
                paxObj.FirstnameNum = PaxEle.FirstnameNum;
                paxObj.PaxLastNm = PaxEle.LastName;
                paxObj.PaxFirstNm = PaxEle.GivenName;
                paxObj.PaxType = PaxEle.PassengerType;
                paxObj.FqtvCc = PaxEle.FqtvCc;
                paxObj.Origin = PaxEle.Origin;
                paxObj.Dest = PaxEle.Dest;
                paxObj.FqtvNumber = PaxEle.FqtvNumber;
                paxObj.PaxCompReasonID = PaxEle.CompensationReasonId.toString();
                paxObj.PaxCompReasonText = PaxEle.CompensationReason;
                paxObj.PaxStatus = PaxEle.PaxStatus;
                paxObj.PaxEmailAddress = PaxEle.PaxEmailAddress;
                paxObj.UpdateLockNbr = PaxEle.UpdateLockNbr;
                paxObj.FqtvTier = null;
                paxObj.CabinClass = PaxEle.Cabin;
                paxObj.SSR = PaxEle.SSR;
                paxObj.Etkt = null;
                paxObj.Bags = PaxEle.Bags;
                paxObj.IsExistingCompensation = PaxEle.IsExistingCompensation;
                paxObj.IsCompensationIssued = PaxEle.IsCompensationIssued;
                paxObj.IsCompensationNotIssued = PaxEle.IsCompensationNotIssued;
                paxObj.Compensations = PaxEle.Compensations;
                if (PaxEle.ReaccomDetails) {
                    paxObj.ReaccomDetails = [new appmodel.SaveCompensationRequest.ReaccomDetail()];
                    paxObj.ReaccomDetails.length = 0;
                    PaxEle.ReaccomDetails.forEach(function (ReaccData, Index) {
                        // if (ReaccData.ReaccomFlightNo != "") {
                        var reaccomObj = new appmodel.SaveCompensationRequest.ReaccomDetail();
                        reaccomObj.FlightSegmentId = ReaccData.FlightSegmentId;
                        reaccomObj.PassengerSeq = ReaccData.PassengerSeq;
                        reaccomObj.ReacomSeq = ReaccData.ReacomSeq;
                        reaccomObj.FromToFlag = ReaccData.FromToFlag;
                        reaccomObj.GUIDisplayFlag = ReaccData.GUIDisplayFlag;
                        reaccomObj.ReaccomAirlineCode = ReaccData.ReaccomAirlineCode.toUpperCase();
                        reaccomObj.ReaccomFlightNo = ReaccData.ReaccomFlightNo;
                        reaccomObj.ReaccomFlightDt = ReaccData.ReaccomFlightDt;
                        reaccomObj.ReaccomBoardCityCd = ReaccData.ReaccomBoardCityCd.toUpperCase();
                        reaccomObj.ReaccomOffCityCd = ReaccData.ReaccomOffCityCd.toUpperCase();
                        reaccomObj.UpdateLockNbr = ReaccData.UpdateLockNbr;
                        paxObj.ReaccomDetails.push(reaccomObj);
                        // }
                    });
                }
                else {
                    paxObj.ReaccomDetails = null;
                }
                flightele_1.Passengers.push(paxObj);
            });
            Obj.FlightSegments.push(flightele_1);
            return Obj;
        }
        catch (error) {
            console.log(error.message);
        }
    };
    Converters.convertToSaveCompensationTemplateForPrint = function (paxresponse, flightresponse) {
        try {
            var Obj = new appmodel.SaveCompensationRequest.RootObject();
            Obj.SourceId = "PSS_TABLET";
            Obj.UserId = ApplicationSettings.getString("UserName", "");
            var FlightObj = [new appmodel.SaveCompensationRequest.FlightSegment];
            FlightObj.length = 0;
            Obj.FlightSegments = [new appmodel.SaveCompensationRequest.FlightSegment()];
            Obj.FlightSegments.length = 0;
            var flightele_2 = new appmodel.SaveCompensationRequest.FlightSegment();
            flightele_2.Passengers = [new appmodel.SaveCompensationRequest.Passenger()];
            flightele_2.Passengers.length = 0;
            flightele_2.AirlineCode = flightresponse.FlightNumber.substr(0, 2);
            flightele_2.Arrival = flightresponse.DestinationAirport;
            flightele_2.Departure = flightresponse.DepartureAirport;
            flightele_2.DepartureDt = flightresponse.DepartureDate;
            flightele_2.FlightNo = flightresponse.FlightNumber.substr(2);
            flightele_2.FlightSegmentId = paxresponse[0].FlightSegmentId;
            paxresponse.forEach(function (PaxEle, Index) {
                var paxObj = new appmodel.SaveCompensationRequest.Passenger();
                paxObj.FlightSegmentId = PaxEle.FlightSegmentId;
                paxObj.PassengerSeq = PaxEle.PassengerSeq;
                paxObj.OrderId = PaxEle.OrderId;
                paxObj.SurnameNum = PaxEle.SurnameNum;
                paxObj.FirstnameNum = PaxEle.FirstnameNum;
                paxObj.PaxLastNm = PaxEle.LastName;
                paxObj.PaxFirstNm = PaxEle.GivenName;
                paxObj.PaxType = PaxEle.PassengerType;
                paxObj.FqtvCc = PaxEle.FqtvCc;
                paxObj.FqtvNumber = PaxEle.FqtvNumber;
                paxObj.PaxCompReasonID = PaxEle.CompensationReasonId.toString();
                paxObj.PaxCompReasonText = PaxEle.CompensationReason;
                paxObj.PaxStatus = PaxEle.PaxStatus;
                paxObj.PaxEmailAddress = PaxEle.PaxEmailAddress;
                paxObj.UpdateLockNbr = null;
                paxObj.FqtvTier = null;
                paxObj.CabinClass = PaxEle.Cabin;
                paxObj.SSR = PaxEle.SSR;
                paxObj.Etkt = null;
                paxObj.Bags = PaxEle.Bags;
                paxObj.IsExistingCompensation = PaxEle.IsExistingCompensation;
                paxObj.IsCompensationIssued = PaxEle.IsCompensationIssued;
                paxObj.IsCompensationNotIssued = PaxEle.IsCompensationNotIssued;
                paxObj.Compensations = PaxEle.Compensations;
                paxObj.Compensations.forEach(function (compData, compIndex) {
                    if (compData.Emds) {
                        compData.Emds.forEach(function (emdData, emdIndex) {
                            emdData.FirstNm = PaxEle.GivenName;
                            emdData.LastNm = PaxEle.LastName;
                            emdData.PrintStatus = "y";
                        });
                    }
                });
                if (PaxEle.ReaccomDetails) {
                    paxObj.ReaccomDetails = [new appmodel.SaveCompensationRequest.ReaccomDetail()];
                    paxObj.ReaccomDetails.length = 0;
                    PaxEle.ReaccomDetails.forEach(function (ReaccData, Index) {
                        // if (ReaccData.ReaccomFlightNo != "") {
                        var reaccomObj = new appmodel.SaveCompensationRequest.ReaccomDetail();
                        reaccomObj.FlightSegmentId = ReaccData.FlightSegmentId;
                        reaccomObj.PassengerSeq = ReaccData.PassengerSeq;
                        reaccomObj.ReacomSeq = ReaccData.ReacomSeq;
                        reaccomObj.FromToFlag = ReaccData.FromToFlag;
                        reaccomObj.GUIDisplayFlag = ReaccData.GUIDisplayFlag;
                        reaccomObj.ReaccomAirlineCode = ReaccData.ReaccomAirlineCode.toUpperCase();
                        reaccomObj.ReaccomFlightNo = ReaccData.ReaccomFlightNo;
                        reaccomObj.ReaccomFlightDt = ReaccData.ReaccomFlightDt;
                        reaccomObj.ReaccomBoardCityCd = ReaccData.ReaccomBoardCityCd.toUpperCase();
                        reaccomObj.ReaccomOffCityCd = ReaccData.ReaccomOffCityCd.toUpperCase();
                        reaccomObj.UpdateLockNbr = ReaccData.UpdateLockNbr;
                        paxObj.ReaccomDetails.push(reaccomObj);
                        // }
                    });
                }
                else {
                    paxObj.ReaccomDetails = null;
                }
                flightele_2.Passengers.push(paxObj);
            });
            Obj.FlightSegments.push(flightele_2);
            return Obj;
        }
        catch (error) {
            console.log(error.message);
        }
    };
    Converters.convertToDeleteCompensationTemplate = function (paxresponse, flightresponse) {
        try {
            var Obj = new appmodel.SaveCompensationRequest.RootObject();
            Obj.SourceId = "PSS_TABLET";
            Obj.UserId = ApplicationSettings.getString("UserName", "");
            var FlightObj = [new appmodel.SaveCompensationRequest.FlightSegment];
            FlightObj.length = 0;
            Obj.FlightSegments = [new appmodel.SaveCompensationRequest.FlightSegment()];
            Obj.FlightSegments.length = 0;
            var flightele_3 = new appmodel.SaveCompensationRequest.FlightSegment();
            flightele_3.Passengers = [new appmodel.SaveCompensationRequest.Passenger()];
            flightele_3.Passengers.length = 0;
            flightele_3.AirlineCode = flightresponse.FlightNumber.substr(0, 2);
            flightele_3.Arrival = flightresponse.DestinationAirport;
            flightele_3.Departure = flightresponse.DepartureAirport;
            flightele_3.DepartureDt = flightresponse.DepartureDate;
            flightele_3.FlightNo = flightresponse.FlightNumber.substr(2);
            flightele_3.FlightSegmentId = paxresponse[0].FlightSegmentId;
            paxresponse.forEach(function (PaxEle, Index) {
                var paxObj = new appmodel.SaveCompensationRequest.Passenger();
                paxObj.FlightSegmentId = PaxEle.FlightSegmentId;
                paxObj.PassengerSeq = PaxEle.PassengerSeq;
                paxObj.OrderId = PaxEle.OrderId;
                paxObj.SurnameNum = PaxEle.SurnameNum;
                paxObj.FirstnameNum = PaxEle.FirstnameNum;
                paxObj.PaxLastNm = PaxEle.LastName;
                paxObj.PaxFirstNm = PaxEle.GivenName;
                paxObj.PaxType = PaxEle.PassengerType;
                paxObj.FqtvCc = PaxEle.FqtvCc;
                paxObj.FqtvNumber = PaxEle.FqtvNumber;
                paxObj.PaxStatus = PaxEle.PaxStatus;
                paxObj.PaxEmailAddress = PaxEle.PaxEmailAddress;
                paxObj.UpdateLockNbr = null;
                paxObj.FqtvTier = null;
                paxObj.CabinClass = PaxEle.Cabin;
                paxObj.SSR = PaxEle.SSR;
                paxObj.Etkt = null;
                paxObj.Bags = PaxEle.Bags;
                paxObj.Compensations = PaxEle.Compensations;
                if (PaxEle.ReaccomDetails) {
                    paxObj.ReaccomDetails = [new appmodel.SaveCompensationRequest.ReaccomDetail()];
                    paxObj.ReaccomDetails.length = 0;
                    PaxEle.ReaccomDetails.forEach(function (ReaccData, Index) {
                        var reaccomObj = new appmodel.SaveCompensationRequest.ReaccomDetail();
                        reaccomObj.FlightSegmentId = ReaccData.FlightSegmentId;
                        reaccomObj.PassengerSeq = ReaccData.PassengerSeq;
                        reaccomObj.ReacomSeq = ReaccData.ReacomSeq;
                        reaccomObj.FromToFlag = ReaccData.FromToFlag;
                        reaccomObj.GUIDisplayFlag = ReaccData.GUIDisplayFlag;
                        reaccomObj.ReaccomAirlineCode = ReaccData.ReaccomAirlineCode.toUpperCase();
                        reaccomObj.ReaccomFlightNo = ReaccData.ReaccomFlightNo;
                        reaccomObj.ReaccomFlightDt = ReaccData.ReaccomFlightDt;
                        reaccomObj.ReaccomBoardCityCd = ReaccData.ReaccomBoardCityCd.toUpperCase();
                        reaccomObj.ReaccomOffCityCd = ReaccData.ReaccomOffCityCd.toUpperCase();
                        reaccomObj.UpdateLockNbr = ReaccData.UpdateLockNbr;
                        paxObj.ReaccomDetails.push(reaccomObj);
                    });
                }
                else {
                    paxObj.ReaccomDetails = null;
                }
                flightele_3.Passengers.push(paxObj);
            });
            Obj.FlightSegments.push(flightele_3);
            return Obj;
        }
        catch (error) {
            console.log(error.message);
        }
    };
    Converters.convertToIssueCompensation = function (paxresponse, flightresponse, IssueDate, AgentProfile) {
        try {
            var Obj = new appmodel.IssueCompensationRequest.RootObject();
            Obj.SourceId = "PSS_TABLET";
            Obj.UserId = ApplicationSettings.getString("UserName", "");
            Obj.AddOrderFlow = "N";
            Obj.FlightSegments = [new appmodel.IssueCompensationRequest.FlightSegment()];
            Obj.FlightSegments.length = 0;
            var flightele_4 = new appmodel.IssueCompensationRequest.FlightSegment();
            flightele_4.Passengers = [new appmodel.IssueCompensationRequest.Passenger()];
            flightele_4.Passengers.length = 0;
            flightele_4.AirlineCode = flightresponse.FlightNumber.substr(0, 2);
            flightele_4.Arrival = flightresponse.DestinationAirport;
            flightele_4.Departure = flightresponse.DepartureAirport;
            flightele_4.DepartureDt = flightresponse.DepartureDate;
            // flightele.FlightNo = flightresponse.FlightNumber.substr(2);
            flightele_4.FlightSegmentId = paxresponse[0].FlightSegmentId;
            flightele_4.HasStopover = true;
            // flightele.DepartureDateTime = flightresponse.DepartureDateTime.toString().substr(0, 10);
            // flightele.ArrivalDateTime = flightresponse.ArrivalDateTime;
            paxresponse.forEach(function (PaxEle, Index) {
                var paxObj = new appmodel.IssueCompensationRequest.Passenger();
                paxObj.FlightSegmentId = PaxEle.FlightSegmentId.toString();
                paxObj.PassengerSeq = PaxEle.PassengerSeq.toString();
                paxObj.OrderId = PaxEle.OrderId;
                paxObj.PaxLastNm = PaxEle.LastName;
                paxObj.PaxFirstNm = PaxEle.GivenName;
                if (PaxEle.PassengerType == "") {
                    paxObj.PaxType = null;
                }
                else {
                    paxObj.PaxType = PaxEle.PassengerType;
                }
                paxObj.FqtvCc = PaxEle.FqtvCc;
                if (PaxEle.FqtvNumber != undefined) {
                    paxObj.FqtvNumber = PaxEle.FqtvNumber;
                }
                else {
                    paxObj.FqtvNumber = null;
                }
                paxObj.PaxStatus = PaxEle.PaxStatus;
                paxObj.PaxCompReasonID = PaxEle.CompensationReasonId.toString();
                paxObj.IsExistingCompensation = PaxEle.IsExistingCompensation;
                paxObj.PaxEmailAddress = PaxEle.PaxEmailAddress;
                paxObj.UpdateLockNbr = PaxEle.UpdateLockNbr.toString();
                paxObj.FqtvTier = null;
                paxObj.CabinClass = PaxEle.Cabin;
                paxObj.PaxRPH = PaxEle.PaxRPH;
                paxObj.DummyCompOrderFlag = "N";
                paxObj.WorldTracerNum = PaxEle.WorldTracerNum;
                paxObj.CustomerCareCaseNum = PaxEle.CustomerCareCaseNum;
                paxObj.IsCompensationIssued = PaxEle.IsCompensationIssued;
                if (PaxEle.SSR == null) {
                    paxObj.SSR = [];
                }
                else {
                    paxObj.SSR = PaxEle.SSR;
                }
                if (PaxEle.SSRs != []) {
                    PaxEle.SSRs.forEach(function (SSR, Index) {
                        var ssrObj = new appmodel.BreRequest.SSRs();
                        ssrObj.FlightSegmentId = PaxEle.FlightSegmentId;
                        ssrObj.PassengerSeq = PaxEle.PassengerSeq;
                        ssrObj.SsrCode = SSR;
                    });
                }
                else {
                    paxObj.SSRs = [];
                }
                paxObj.Etkt = [];
                if (PaxEle.ReaccomDetails) {
                    paxObj.ReaccomDetails = [new appmodel.SaveCompensationRequest.ReaccomDetail()];
                    paxObj.ReaccomDetails.length = 0;
                    PaxEle.ReaccomDetails.forEach(function (ReaccData, Index) {
                        // if (ReaccData.ReaccomFlightNo != "") {
                        var reaccomObj = new appmodel.SaveCompensationRequest.ReaccomDetail();
                        reaccomObj.FlightSegmentId = ReaccData.FlightSegmentId;
                        reaccomObj.PassengerSeq = ReaccData.PassengerSeq;
                        reaccomObj.ReacomSeq = ReaccData.ReacomSeq;
                        reaccomObj.FromToFlag = ReaccData.FromToFlag;
                        reaccomObj.GUIDisplayFlag = ReaccData.GUIDisplayFlag;
                        reaccomObj.ReaccomAirlineCode = ReaccData.ReaccomAirlineCode.toUpperCase();
                        reaccomObj.ReaccomFlightNo = ReaccData.ReaccomFlightNo;
                        reaccomObj.ReaccomFlightDt = ReaccData.ReaccomFlightDt;
                        reaccomObj.ReaccomBoardCityCd = ReaccData.ReaccomBoardCityCd.toUpperCase();
                        reaccomObj.ReaccomOffCityCd = ReaccData.ReaccomOffCityCd.toUpperCase();
                        reaccomObj.UpdateLockNbr = ReaccData.UpdateLockNbr;
                        paxObj.ReaccomDetails.push(reaccomObj);
                        // }
                    });
                }
                else {
                    paxObj.ReaccomDetails = null;
                }
                if (PaxEle.Bags == null) {
                    paxObj.Bags = [];
                }
                else {
                    paxObj.Bags = PaxEle.Bags;
                }
                if (PaxEle.ExistingCompensations == null) {
                    paxObj.ExistingCompensations = [];
                }
                else {
                    paxObj.ExistingCompensations = PaxEle.ExistingCompensations;
                }
                paxObj.Compensations = [new appmodel.IssueCompensationRequest.Compensation()];
                paxObj.Compensations.length = 0;
                if (PaxEle.monetary > 0) {
                    var compMoneyObj = new appmodel.IssueCompensationRequest.Compensation();
                    compMoneyObj.FlightSegmentId = PaxEle.FlightSegmentId.toString();
                    compMoneyObj.PassengerSeq = PaxEle.PassengerSeq.toString();
                    compMoneyObj.CompSeq = PaxEle.Compensations.filter(function (m) { return m.CompTypeText == "Monetary"; })[0].CompSeq;
                    compMoneyObj.CompReasonId = PaxEle.CompensationReasonId.toString();
                    compMoneyObj.CompReasonText = PaxEle.CompensationReason;
                    compMoneyObj.CompTypeId = PaxEle.Compensations.filter(function (m) { return m.CompTypeText == "Monetary"; })[0].CompTypeId;
                    compMoneyObj.CompTypeText = "Monetary";
                    // compMoneyObj.OverrideReason = PaxEle.MonetaryOverrideReason;
                    compMoneyObj.UpdateLockNbr = PaxEle.Compensations.filter(function (m) { return m.CompTypeText == "Monetary"; })[0].UpdateLockNbr.toString();
                    compMoneyObj.Remarks = null;
                    compMoneyObj.Endorsement = null;
                    var serviceObj = new appmodel.IssueCompensationRequest.Services();
                    serviceObj.Taxes = null;
                    serviceObj.passengerRPH = PaxEle.PaxRPH;
                    serviceObj.segmentRPH = null;
                    serviceObj.currencyCode = "USD";
                    serviceObj.amount = PaxEle.monetary.toString();
                    serviceObj.ticketNumber = null;
                    serviceObj.Remarks = null;
                    serviceObj.Endorsement = null;
                    var selectedServiceObj = new appmodel.IssueCompensationRequest.SelectedService();
                    selectedServiceObj.RFISC_code = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Monetary"; })[0].productCode;
                    selectedServiceObj.RFISC_subCode = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Monetary"; })[0].subProductCode;
                    selectedServiceObj.SSRCode = "CHLD";
                    selectedServiceObj.commercialName = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Monetary"; })[0].productName;
                    selectedServiceObj.EmdType = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Monetary"; })[0].emdType;
                    selectedServiceObj.TypeOfService = null;
                    selectedServiceObj.emdRefundable = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Monetary"; })[0].emdRefundable;
                    selectedServiceObj.emdEndorsable = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Monetary"; })[0].emdEndorsable;
                    selectedServiceObj.emdExchangeable = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Monetary"; })[0].emdExchangeable;
                    selectedServiceObj.emdUsedAtIssuance = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Monetary"; })[0].emdUsedAtIssuance;
                    selectedServiceObj.IsRefundable = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Monetary"; })[0].IsRefundable;
                    serviceObj.selectedService = selectedServiceObj;
                    compMoneyObj.Services = serviceObj;
                    var paymentObj = new appmodel.IssueCompensationRequest.Payments();
                    paymentObj.Type = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Monetary"; })[0].formOfPayment.substr(0, 2);
                    paymentObj.TransactionType = "Authorize";
                    paymentObj.SubType = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Monetary"; })[0].formOfPayment.substr(3);
                    paymentObj.Description = "Monetary";
                    paymentObj.Amount = PaxEle.monetary.toString();
                    paymentObj.CurrencyCode = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Monetary"; })[0].currency;
                    paymentObj.AccountCode = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Monetary"; })[0].accountCode;
                    compMoneyObj.Payments = paymentObj;
                    compMoneyObj.Emds = [new appmodel.IssueCompensationRequest.Emd()];
                    compMoneyObj.Emds.length = 0;
                    var emdObj_1 = new appmodel.IssueCompensationRequest.Emd();
                    emdObj_1.FlightSegmentId = PaxEle.FlightSegmentId.toString();
                    emdObj_1.PassengerSeq = PaxEle.PassengerSeq.toString();
                    emdObj_1.CompSeq = PaxEle.Compensations.filter(function (m) { return m.CompTypeText == "Monetary"; })[0].CompSeq;
                    emdObj_1.PrimaryDocumentNbr = null;
                    emdObj_1.PrimaryAirlineCd = "CM";
                    emdObj_1.IssueDt = moment(IssueDate).format("YYYY-MM-DD");
                    emdObj_1.FirstNm = AgentProfile.FirstName;
                    emdObj_1.LastNm = AgentProfile.LastName;
                    emdObj_1.OverrideReason = PaxEle.MonetaryOverrideReason;
                    emdObj_1.UserId = ApplicationSettings.getString("UserName", "");
                    emdObj_1.ReasonForIssuanceSubCd = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Monetary"; })[0].subProductCode;
                    emdObj_1.ReasonForIssuanceCd = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Monetary"; })[0].productCode;
                    PaxEle.monetaryendorsementTextItems.forEach(function (data, Index) {
                        emdObj_1.Endorsements1Txt = emdObj_1.Endorsements1Txt + data;
                    });
                    if (PaxEle.monetaryfreeText != "" || PaxEle.monetaryfreeText != null) {
                        emdObj_1.Endorsements1Txt = emdObj_1.Endorsements1Txt + '.?.' + PaxEle.monetaryfreeText + '.';
                    }
                    emdObj_1.Endorsements1Txt = emdObj_1.Endorsements1Txt.substr(0, 255);
                    var lastIndexOfDot = emdObj_1.Endorsements1Txt.lastIndexOf('.');
                    emdObj_1.Endorsements1Txt = emdObj_1.Endorsements1Txt.substr(0, lastIndexOfDot);
                    emdObj_1.RemarkTxt = "";
                    emdObj_1.CompAmt = PaxEle.monetary.toString();
                    emdObj_1.CompCurrencyCd = "USD";
                    emdObj_1.VoucherCnt = "1";
                    emdObj_1.PointOfSale = ApplicationSettings.getString("userdetails", "").substr(0, 3);
                    compMoneyObj.Emds.push(emdObj_1);
                    paxObj.Compensations.push(compMoneyObj);
                }
                if (PaxEle.hotel > 0) {
                    var compMealObj = new appmodel.IssueCompensationRequest.Compensation();
                    compMealObj.FlightSegmentId = PaxEle.FlightSegmentId.toString();
                    compMealObj.PassengerSeq = PaxEle.PassengerSeq;
                    compMealObj.CompSeq = PaxEle.Compensations.filter(function (m) { return m.CompTypeText == "Hotel"; })[0].CompSeq;
                    compMealObj.CompReasonId = PaxEle.CompensationReasonId.toString();
                    compMealObj.CompReasonText = PaxEle.CompensationReason;
                    compMealObj.CompTypeId = PaxEle.Compensations.filter(function (m) { return m.CompTypeText == "Hotel"; })[0].CompTypeId;
                    compMealObj.CompTypeText = "Hotel";
                    // compMealObj.OverrideReason = PaxEle.HotelOverrideReason;
                    compMealObj.UpdateLockNbr = PaxEle.Compensations.filter(function (m) { return m.CompTypeText == "Hotel"; })[0].UpdateLockNbr.toString();
                    compMealObj.Remarks = null;
                    compMealObj.Endorsement = null;
                    var serviceObj = new appmodel.IssueCompensationRequest.Services();
                    serviceObj.Taxes = null;
                    serviceObj.passengerRPH = PaxEle.PaxRPH;
                    serviceObj.segmentRPH = null;
                    serviceObj.currencyCode = "USD";
                    serviceObj.amount = "0";
                    serviceObj.ticketNumber = null;
                    serviceObj.Remarks = null;
                    serviceObj.Endorsement = null;
                    var selectedServiceObj = new appmodel.IssueCompensationRequest.SelectedService();
                    selectedServiceObj.RFISC_code = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Hotel"; })[0].productCode;
                    selectedServiceObj.RFISC_subCode = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Hotel"; })[0].subProductCode;
                    // selectedServiceObj.SSRCode = null;
                    selectedServiceObj.SSRCode = "CHLD";
                    selectedServiceObj.commercialName = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Hotel"; })[0].productName;
                    selectedServiceObj.EmdType = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Hotel"; })[0].emdType;
                    selectedServiceObj.emdRefundable = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Hotel"; })[0].emdRefundable;
                    selectedServiceObj.emdEndorsable = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Hotel"; })[0].emdEndorsable;
                    selectedServiceObj.emdExchangeable = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Hotel"; })[0].emdExchangeable;
                    selectedServiceObj.emdUsedAtIssuance = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Hotel"; })[0].emdUsedAtIssuance;
                    selectedServiceObj.IsRefundable = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Hotel"; })[0].IsRefundable;
                    serviceObj.selectedService = selectedServiceObj;
                    selectedServiceObj.TypeOfService = null;
                    compMealObj.Services = serviceObj;
                    var paymentObj = new appmodel.IssueCompensationRequest.Payments();
                    paymentObj.Type = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Hotel"; })[0].formOfPayment.substr(0, 2);
                    paymentObj.TransactionType = "Authorize";
                    paymentObj.SubType = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Hotel"; })[0].formOfPayment.substr(3);
                    paymentObj.Description = "Hotel";
                    paymentObj.Amount = "0";
                    paymentObj.CurrencyCode = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Hotel"; })[0].currency;
                    paymentObj.AccountCode = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Hotel"; })[0].accountCode;
                    compMealObj.Payments = paymentObj;
                    compMealObj.Emds = [new appmodel.IssueCompensationRequest.Emd()];
                    compMealObj.Emds.length = 0;
                    var emdObj_2 = new appmodel.IssueCompensationRequest.Emd();
                    emdObj_2.FlightSegmentId = PaxEle.FlightSegmentId.toString();
                    emdObj_2.PassengerSeq = PaxEle.PassengerSeq;
                    emdObj_2.CompSeq = PaxEle.Compensations.filter(function (m) { return m.CompTypeText == "Hotel"; })[0].CompSeq;
                    emdObj_2.PrimaryDocumentNbr = null;
                    emdObj_2.PrimaryAirlineCd = "CM";
                    emdObj_2.IssueDt = moment(IssueDate).format("YYYY-MM-DD");
                    emdObj_2.FirstNm = AgentProfile.FirstName;
                    emdObj_2.LastNm = AgentProfile.LastName;
                    emdObj_2.OverrideReason = PaxEle.HotelOverrideReason;
                    emdObj_2.UserId = ApplicationSettings.getString("UserName", "");
                    emdObj_2.ReasonForIssuanceSubCd = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Hotel"; })[0].subProductCode;
                    emdObj_2.ReasonForIssuanceCd = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Hotel"; })[0].productCode;
                    PaxEle.hotelendorsementTextItems.forEach(function (data, Index) {
                        emdObj_2.Endorsements1Txt = emdObj_2.Endorsements1Txt + data;
                    });
                    if (PaxEle.hotelFreeText != "" || PaxEle.hotelFreeText != null) {
                        emdObj_2.Endorsements1Txt = emdObj_2.Endorsements1Txt + '.?.' + PaxEle.hotelFreeText + '.';
                    }
                    emdObj_2.Endorsements1Txt = emdObj_2.Endorsements1Txt.substr(0, 255);
                    var lastIndexOfDot = emdObj_2.Endorsements1Txt.lastIndexOf('.');
                    emdObj_2.Endorsements1Txt = emdObj_2.Endorsements1Txt.substr(0, lastIndexOfDot);
                    emdObj_2.RemarkTxt = PaxEle.hotelDetails;
                    emdObj_2.CompAmt = "0";
                    emdObj_2.CompCurrencyCd = "USD";
                    emdObj_2.VoucherCnt = PaxEle.hotel.toString();
                    emdObj_2.PointOfSale = ApplicationSettings.getString("userdetails", "").substr(0, 3);
                    compMealObj.Emds.push(emdObj_2);
                    paxObj.Compensations.push(compMealObj);
                }
                if (PaxEle.meal > 0) {
                    var compHotelObj = new appmodel.IssueCompensationRequest.Compensation();
                    compHotelObj.FlightSegmentId = PaxEle.FlightSegmentId.toString();
                    compHotelObj.PassengerSeq = PaxEle.PassengerSeq.toString();
                    compHotelObj.CompSeq = PaxEle.Compensations.filter(function (m) { return m.CompTypeText == "Meal"; })[0].CompSeq;
                    compHotelObj.CompReasonId = PaxEle.CompensationReasonId.toString();
                    compHotelObj.CompReasonText = PaxEle.CompensationReason;
                    compHotelObj.CompTypeId = PaxEle.Compensations.filter(function (m) { return m.CompTypeText == "Meal"; })[0].CompTypeId;
                    compHotelObj.CompTypeText = "Meal";
                    // compHotelObj.OverrideReason = PaxEle.MealOverrideReason;
                    compHotelObj.UpdateLockNbr = PaxEle.Compensations.filter(function (m) { return m.CompTypeText == "Meal"; })[0].UpdateLockNbr.toString();
                    compHotelObj.Remarks = null;
                    compHotelObj.Endorsement = null;
                    var serviceObj = new appmodel.IssueCompensationRequest.Services();
                    serviceObj.Taxes = null;
                    serviceObj.passengerRPH = PaxEle.PaxRPH;
                    serviceObj.segmentRPH = null;
                    serviceObj.currencyCode = "USD";
                    serviceObj.amount = "0";
                    serviceObj.ticketNumber = null;
                    serviceObj.Remarks = null;
                    serviceObj.Endorsement = null;
                    var selectedServiceObj = new appmodel.IssueCompensationRequest.SelectedService();
                    selectedServiceObj.RFISC_code = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Meal"; })[0].productCode;
                    selectedServiceObj.RFISC_subCode = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Meal"; })[0].subProductCode;
                    selectedServiceObj.SSRCode = "CHLD";
                    selectedServiceObj.commercialName = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Meal"; })[0].productName;
                    selectedServiceObj.EmdType = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Meal"; })[0].emdType;
                    selectedServiceObj.TypeOfService = null;
                    selectedServiceObj.emdRefundable = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Meal"; })[0].emdRefundable;
                    selectedServiceObj.emdEndorsable = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Meal"; })[0].emdEndorsable;
                    selectedServiceObj.emdExchangeable = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Meal"; })[0].emdExchangeable;
                    selectedServiceObj.emdUsedAtIssuance = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Meal"; })[0].emdUsedAtIssuance;
                    selectedServiceObj.IsRefundable = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Meal"; })[0].IsRefundable;
                    serviceObj.selectedService = selectedServiceObj;
                    compHotelObj.Services = serviceObj;
                    var paymentObj = new appmodel.IssueCompensationRequest.Payments();
                    paymentObj.Type = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Meal"; })[0].formOfPayment.substr(0, 2);
                    paymentObj.TransactionType = "Authorize";
                    paymentObj.SubType = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Meal"; })[0].formOfPayment.substr(3);
                    paymentObj.Description = "Meal";
                    paymentObj.Amount = "0";
                    paymentObj.CurrencyCode = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Meal"; })[0].currency;
                    paymentObj.AccountCode = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Meal"; })[0].accountCode;
                    compHotelObj.Payments = paymentObj;
                    compHotelObj.Emds = [new appmodel.IssueCompensationRequest.Emd()];
                    compHotelObj.Emds.length = 0;
                    var emdObj_3 = new appmodel.IssueCompensationRequest.Emd();
                    emdObj_3.FlightSegmentId = PaxEle.FlightSegmentId.toString();
                    emdObj_3.PassengerSeq = PaxEle.PassengerSeq;
                    emdObj_3.CompSeq = PaxEle.Compensations.filter(function (m) { return m.CompTypeText == "Meal"; })[0].CompSeq;
                    emdObj_3.PrimaryDocumentNbr = null;
                    emdObj_3.PrimaryAirlineCd = "CM";
                    emdObj_3.IssueDt = moment(IssueDate).format("YYYY-MM-DD");
                    emdObj_3.FirstNm = AgentProfile.FirstName;
                    emdObj_3.LastNm = AgentProfile.LastName;
                    emdObj_3.OverrideReason = PaxEle.MealOverrideReason;
                    emdObj_3.UserId = ApplicationSettings.getString("UserName", "");
                    emdObj_3.ReasonForIssuanceSubCd = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Meal"; })[0].subProductCode;
                    emdObj_3.ReasonForIssuanceCd = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Meal"; })[0].productCode;
                    PaxEle.mealendorsementTextItems.forEach(function (data, Index) {
                        emdObj_3.Endorsements1Txt = emdObj_3.Endorsements1Txt + data;
                    });
                    if (PaxEle.mealFreeText != "" || PaxEle.mealFreeText != null) {
                        emdObj_3.Endorsements1Txt = emdObj_3.Endorsements1Txt + '.?.' + PaxEle.mealFreeText + '.';
                    }
                    emdObj_3.Endorsements1Txt = emdObj_3.Endorsements1Txt.substr(0, 255);
                    var lastIndexOfDot = emdObj_3.Endorsements1Txt.lastIndexOf('.');
                    emdObj_3.Endorsements1Txt = emdObj_3.Endorsements1Txt.substr(0, lastIndexOfDot);
                    emdObj_3.RemarkTxt = PaxEle.mealDetails;
                    emdObj_3.CompAmt = "0";
                    emdObj_3.CompCurrencyCd = "USD";
                    emdObj_3.VoucherCnt = PaxEle.meal.toString();
                    emdObj_3.PointOfSale = ApplicationSettings.getString("userdetails", "").substr(0, 3);
                    compHotelObj.Emds.push(emdObj_3);
                    paxObj.Compensations.push(compHotelObj);
                }
                if (PaxEle.transportation > 0) {
                    var compTransportationObj = new appmodel.IssueCompensationRequest.Compensation();
                    compTransportationObj.FlightSegmentId = PaxEle.FlightSegmentId.toString();
                    compTransportationObj.PassengerSeq = PaxEle.PassengerSeq;
                    compTransportationObj.CompSeq = PaxEle.Compensations.filter(function (m) { return m.CompTypeText == "Transportation"; })[0].CompSeq;
                    compTransportationObj.CompReasonId = PaxEle.CompensationReasonId.toString();
                    compTransportationObj.CompReasonText = PaxEle.CompensationReason;
                    compTransportationObj.CompTypeId = PaxEle.Compensations.filter(function (m) { return m.CompTypeText == "Transportation"; })[0].CompTypeId;
                    compTransportationObj.CompTypeText = "Transportation";
                    // compTransportationObj.OverrideReason = PaxEle.TransportOverrideReason;
                    compTransportationObj.UpdateLockNbr = PaxEle.Compensations.filter(function (m) { return m.CompTypeText == "Transportation"; })[0].UpdateLockNbr.toString();
                    ;
                    compTransportationObj.Remarks = null;
                    compTransportationObj.Endorsement = null;
                    var serviceObj = new appmodel.IssueCompensationRequest.Services();
                    serviceObj.Taxes = null;
                    serviceObj.passengerRPH = PaxEle.PaxRPH;
                    serviceObj.segmentRPH = null;
                    serviceObj.currencyCode = "USD";
                    serviceObj.amount = "0";
                    serviceObj.ticketNumber = null;
                    serviceObj.Remarks = null;
                    serviceObj.Endorsement = null;
                    var selectedServiceObj = new appmodel.IssueCompensationRequest.SelectedService();
                    selectedServiceObj.RFISC_code = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Transportation"; })[0].productCode;
                    selectedServiceObj.RFISC_subCode = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Transportation"; })[0].subProductCode;
                    selectedServiceObj.SSRCode = "CHLD";
                    selectedServiceObj.commercialName = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Transportation"; })[0].productName;
                    selectedServiceObj.EmdType = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Transportation"; })[0].emdType;
                    selectedServiceObj.TypeOfService = null;
                    selectedServiceObj.emdRefundable = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Transportation"; })[0].emdRefundable;
                    selectedServiceObj.emdEndorsable = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Transportation"; })[0].emdEndorsable;
                    selectedServiceObj.emdExchangeable = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Transportation"; })[0].emdExchangeable;
                    selectedServiceObj.emdUsedAtIssuance = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Transportation"; })[0].emdUsedAtIssuance;
                    selectedServiceObj.IsRefundable = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Transportation"; })[0].IsRefundable;
                    serviceObj.selectedService = selectedServiceObj;
                    compTransportationObj.Services = serviceObj;
                    var paymentObj = new appmodel.IssueCompensationRequest.Payments();
                    paymentObj.Type = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Transportation"; })[0].formOfPayment.substr(0, 2);
                    paymentObj.TransactionType = "Authorize";
                    paymentObj.SubType = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Transportation"; })[0].formOfPayment.substr(3);
                    paymentObj.Description = "Transportation";
                    paymentObj.Amount = "0";
                    paymentObj.CurrencyCode = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Transportation"; })[0].currency;
                    paymentObj.AccountCode = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Transportation"; })[0].accountCode;
                    compTransportationObj.Payments = paymentObj;
                    compTransportationObj.Emds = [new appmodel.IssueCompensationRequest.Emd()];
                    compTransportationObj.Emds.length = 0;
                    var emdObj_4 = new appmodel.IssueCompensationRequest.Emd();
                    emdObj_4.FlightSegmentId = PaxEle.FlightSegmentId.toString();
                    emdObj_4.PassengerSeq = PaxEle.PassengerSeq;
                    emdObj_4.CompSeq = PaxEle.Compensations.filter(function (m) { return m.CompTypeText == "Transportation"; })[0].CompSeq;
                    emdObj_4.PrimaryDocumentNbr = null;
                    emdObj_4.PrimaryAirlineCd = "CM";
                    emdObj_4.IssueDt = moment(IssueDate).format("YYYY-MM-DD");
                    emdObj_4.FirstNm = AgentProfile.FirstName;
                    emdObj_4.LastNm = AgentProfile.LastName;
                    emdObj_4.OverrideReason = PaxEle.TransportOverrideReason;
                    emdObj_4.UserId = ApplicationSettings.getString("UserName", "");
                    emdObj_4.ReasonForIssuanceSubCd = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Transportation"; })[0].subProductCode;
                    emdObj_4.ReasonForIssuanceCd = PaxEle.BREEmd.filter(function (m) { return m.compensationType == "Transportation"; })[0].productCode;
                    PaxEle.transportationendorsementTextItems.forEach(function (data, Index) {
                        emdObj_4.Endorsements1Txt = emdObj_4.Endorsements1Txt + data;
                    });
                    if (PaxEle.transportFreeText != "" || PaxEle.transportFreeText != null) {
                        emdObj_4.Endorsements1Txt = emdObj_4.Endorsements1Txt + '.?.' + PaxEle.transportFreeText + '.';
                    }
                    emdObj_4.Endorsements1Txt = emdObj_4.Endorsements1Txt.substr(0, 255);
                    var lastIndexOfDot = emdObj_4.Endorsements1Txt.lastIndexOf('.');
                    emdObj_4.Endorsements1Txt = emdObj_4.Endorsements1Txt.substr(0, lastIndexOfDot);
                    emdObj_4.RemarkTxt = PaxEle.transportEMD;
                    emdObj_4.CompAmt = "0";
                    emdObj_4.CompCurrencyCd = "USD";
                    emdObj_4.VoucherCnt = PaxEle.transportation.toString();
                    emdObj_4.PointOfSale = ApplicationSettings.getString("userdetails", "").substr(0, 3);
                    compTransportationObj.Emds.push(emdObj_4);
                    paxObj.Compensations.push(compTransportationObj);
                }
                flightele_4.Passengers.push(paxObj);
            });
            Obj.FlightSegments.push(flightele_4);
            return Obj;
        }
        catch (error) {
            console.log(error.message);
        }
    };
    Converters.convertToIssueCompensationForOrderId = function (response, paxresponse, flightresponse, IssueDate) {
        try {
            var Obj_1 = new appmodel.IssueCompensationRequest.RootObject();
            Obj_1.SourceId = "PSS_TABLET";
            Obj_1.UserId = ApplicationSettings.getString("UserName", "");
            Obj_1.FlightSegments = [new appmodel.IssueCompensationRequest.FlightSegment()];
            Obj_1.FlightSegments.length = 0;
            response.forEach(function (Segdata, SegIndex) {
                var flightele = new appmodel.IssueCompensationRequest.FlightSegment();
                flightele.AirlineCode = Segdata.AirlineCode;
                flightele.Arrival = Segdata.Arrival;
                flightele.Departure = Segdata.Departure;
                flightele.DepartureDt = Segdata.DepartureDt;
                flightele.FlightNo = Segdata.FlightNo;
                flightele.FlightSegmentId = Segdata.FlightSegmentId;
                flightele.HasStopover = true;
                flightele.DepartureDateTime = Segdata.DepartureDt;
                flightele.ArrivalDateTime = null;
                flightele.Passengers = [new appmodel.IssueCompensationRequest.Passenger()];
                flightele.Passengers.length = 0;
                Segdata.Passengers.forEach(function (PaxData, PaxIndex) {
                    paxresponse.forEach(function (PaxEle, Index) {
                        if (PaxEle.GivenName == PaxData.GivenName && PaxEle.LastName == PaxData.LastName) {
                            var paxObj_1 = new appmodel.IssueCompensationRequest.Passenger();
                            paxObj_1.FlightSegmentId = PaxData.FlightSegmentId.toString();
                            paxObj_1.PassengerSeq = PaxData.PassengerSeq.toString();
                            paxObj_1.OrderId = PaxData.OrderId;
                            paxObj_1.PaxLastNm = PaxData.LastName;
                            paxObj_1.PaxFirstNm = PaxData.GivenName;
                            if (PaxData.PaxType == "") {
                                paxObj_1.PaxType = null;
                            }
                            else {
                                paxObj_1.PaxType = PaxData.PaxType;
                            }
                            paxObj_1.FqtvCc = PaxData.FqtvCc;
                            paxObj_1.FqtvNumber = PaxData.FqtvNumber;
                            paxObj_1.PaxStatus = PaxData.PaxStatus;
                            paxObj_1.PaxCompReasonID = PaxData.CompensationReasonId;
                            paxObj_1.CustomerCareCaseNum = PaxData.CustomerCareCaseNum;
                            paxObj_1.WorldTracerNum = PaxData.WorldTracerNum;
                            paxObj_1.IsExistingCompensation = PaxData.IsExistingCompensation;
                            paxObj_1.PaxEmailAddress = PaxData.PaxEmailAddress;
                            paxObj_1.UpdateLockNbr = PaxData.UpdateLockNbr.toString();
                            paxObj_1.FqtvTier = null;
                            paxObj_1.CabinClass = PaxData.Cabin;
                            paxObj_1.PaxRPH = PaxData.PaxRPH;
                            paxObj_1.IsCompensationIssued = PaxData.IsCompensationIssued;
                            if (PaxData.SSR == null) {
                                paxObj_1.SSR = [];
                            }
                            else {
                                paxObj_1.SSR = PaxData.SSR;
                            }
                            paxObj_1.Etkt = [];
                            if (PaxData.ReaccomDetails) {
                                paxObj_1.ReaccomDetails = [new appmodel.SaveCompensationRequest.ReaccomDetail()];
                                paxObj_1.ReaccomDetails.length = 0;
                                PaxData.ReaccomDetails.forEach(function (ReaccData, Index) {
                                    var reaccomObj = new appmodel.SaveCompensationRequest.ReaccomDetail();
                                    reaccomObj.FlightSegmentId = ReaccData.FlightSegmentId;
                                    reaccomObj.PassengerSeq = ReaccData.PassengerSeq;
                                    reaccomObj.ReacomSeq = ReaccData.ReacomSeq;
                                    reaccomObj.FromToFlag = ReaccData.FromToFlag;
                                    reaccomObj.GUIDisplayFlag = ReaccData.GUIDisplayFlag;
                                    reaccomObj.ReaccomAirlineCode = ReaccData.ReaccomAirlineCode.toUpperCase();
                                    reaccomObj.ReaccomFlightNo = ReaccData.ReaccomFlightNo;
                                    reaccomObj.ReaccomFlightDt = ReaccData.ReaccomFlightDt;
                                    reaccomObj.ReaccomBoardCityCd = ReaccData.ReaccomBoardCityCd.toUpperCase();
                                    reaccomObj.ReaccomOffCityCd = ReaccData.ReaccomOffCityCd.toUpperCase();
                                    reaccomObj.UpdateLockNbr = ReaccData.UpdateLockNbr;
                                    paxObj_1.ReaccomDetails.push(reaccomObj);
                                });
                            }
                            else {
                                PaxData.ReaccomDetails = null;
                            }
                            if (PaxData.Bags == null) {
                                paxObj_1.Bags = [];
                            }
                            else {
                                paxObj_1.Bags = PaxData.Bags;
                            }
                            if (PaxData.ExistingCompensations == null) {
                                paxObj_1.ExistingCompensations = [];
                            }
                            else {
                                paxObj_1.ExistingCompensations = PaxData.ExistingCompensations;
                            }
                            paxObj_1.Compensations = [new appmodel.IssueCompensationRequest.Compensation()];
                            paxObj_1.Compensations.length = 0;
                            if (PaxData.monetary > 0) {
                                var compMoneyObj = new appmodel.IssueCompensationRequest.Compensation();
                                compMoneyObj.FlightSegmentId = PaxData.FlightSegmentId.toString();
                                compMoneyObj.PassengerSeq = PaxData.PassengerSeq.toString();
                                compMoneyObj.CompSeq = PaxData.Compensations.filter(function (m) { return m.CompTypeText == "Monetary"; })[0].CompSeq;
                                compMoneyObj.CompReasonId = PaxData.CompensationReasonId.toString();
                                compMoneyObj.CompReasonText = PaxData.CompensationReason;
                                compMoneyObj.CompTypeId = PaxData.Compensations.filter(function (m) { return m.CompTypeText == "Monetary"; })[0].CompTypeId;
                                compMoneyObj.CompTypeText = "Monetary";
                                // compMoneyObj.OverrideReason = null;
                                compMoneyObj.UpdateLockNbr = PaxData.Compensations.filter(function (m) { return m.CompTypeText == "Monetary"; })[0].UpdateLockNbr.toString();
                                compMoneyObj.Remarks = null;
                                compMoneyObj.Endorsement = null;
                                var serviceObj = new appmodel.IssueCompensationRequest.Services();
                                serviceObj.Taxes = null;
                                serviceObj.passengerRPH = PaxData.PaxRPH;
                                serviceObj.segmentRPH = null;
                                serviceObj.currencyCode = "USD";
                                serviceObj.amount = PaxData.monetary.toString();
                                serviceObj.ticketNumber = null;
                                serviceObj.Remarks = null;
                                serviceObj.Endorsement = null;
                                var selectedServiceObj = new appmodel.IssueCompensationRequest.SelectedService();
                                selectedServiceObj.RFISC_code = PaxData.BREEmd.filter(function (m) { return m.compensationType == "Monetary"; })[0].productCode;
                                selectedServiceObj.RFISC_subCode = PaxData.BREEmd.filter(function (m) { return m.compensationType == "Monetary"; })[0].subProductCode;
                                selectedServiceObj.SSRCode = null;
                                selectedServiceObj.commercialName = PaxData.BREEmd.filter(function (m) { return m.compensationType == "Monetary"; })[0].productName;
                                selectedServiceObj.EmdType = PaxData.BREEmd.filter(function (m) { return m.compensationType == "Monetary"; })[0].emdType;
                                selectedServiceObj.TypeOfService = null;
                                serviceObj.selectedService = selectedServiceObj;
                                compMoneyObj.Services = serviceObj;
                                var paymentObj = new appmodel.IssueCompensationRequest.Payments();
                                paymentObj.Type = PaxData.BREEmd.filter(function (m) { return m.compensationType == "Monetary"; })[0].formOfPayment.substr(0, 2);
                                paymentObj.TransactionType = "Authorize";
                                paymentObj.SubType = PaxData.BREEmd.filter(function (m) { return m.compensationType == "Monetary"; })[0].formOfPayment.substr(3);
                                paymentObj.Description = "Monetary";
                                paymentObj.Amount = PaxData.monetary.toString();
                                paymentObj.CurrencyCode = PaxData.BREEmd.filter(function (m) { return m.compensationType == "Monetary"; })[0].currency;
                                compMoneyObj.Payments = paymentObj;
                                compMoneyObj.Emds = [new appmodel.IssueCompensationRequest.Emd()];
                                compMoneyObj.Emds.length = 0;
                                var emdObj = new appmodel.IssueCompensationRequest.Emd();
                                emdObj.FlightSegmentId = PaxData.FlightSegmentId.toString();
                                emdObj.PassengerSeq = PaxData.PassengerSeq.toString();
                                emdObj.CompSeq = PaxData.Compensations.filter(function (m) { return m.CompTypeText == "Monetary"; })[0].CompSeq;
                                emdObj.PrimaryDocumentNbr = null;
                                emdObj.PrimaryAirlineCd = "CM";
                                emdObj.IssueDt = IssueDate;
                                emdObj.FirstNm = PaxData.GivenName;
                                emdObj.LastNm = PaxData.LastName;
                                emdObj.UserId = ApplicationSettings.getString("UserName", "");
                                emdObj.ReasonForIssuanceSubCd = PaxData.BREEmd.filter(function (m) { return m.compensationType == "Monetary"; })[0].subProductCode;
                                emdObj.ReasonForIssuanceCd = PaxData.BREEmd.filter(function (m) { return m.compensationType == "Monetary"; })[0].productCode;
                                // PaxData.monetaryendorsementTextItems.forEach((data, Index) => {
                                //     emdObj.Endorsements1Txt = data + ',' + emdObj.Endorsements1Txt;
                                // })
                                if (PaxData.monetaryfreeText != "") {
                                    emdObj.Endorsements1Txt = PaxData.monetaryfreeText;
                                }
                                emdObj.RemarkTxt = "RemarkTxt";
                                emdObj.CompAmt = PaxData.monetary.toString();
                                emdObj.CompCurrencyCd = "USD";
                                emdObj.VoucherCnt = "1";
                                compMoneyObj.Emds.push(emdObj);
                                paxObj_1.Compensations.push(compMoneyObj);
                            }
                            if (PaxData.hotel > 0) {
                                var compMealObj = new appmodel.IssueCompensationRequest.Compensation();
                                compMealObj.FlightSegmentId = PaxData.FlightSegmentId.toString();
                                compMealObj.PassengerSeq = PaxData.PassengerSeq.toString();
                                compMealObj.CompSeq = PaxData.Compensations.filter(function (m) { return m.CompTypeText == "Hotel"; })[0].CompSeq;
                                compMealObj.CompReasonId = PaxData.CompensationReasonId.toString();
                                compMealObj.CompReasonText = PaxData.CompensationReason;
                                compMealObj.CompTypeId = PaxData.Compensations.filter(function (m) { return m.CompTypeText == "Hotel"; })[0].CompTypeId;
                                compMealObj.CompTypeText = "Hotel";
                                // compMealObj.OverrideReason = null;
                                compMealObj.UpdateLockNbr = PaxData.Compensations.filter(function (m) { return m.CompTypeText == "Hotel"; })[0].UpdateLockNbr.toString();
                                compMealObj.Remarks = null;
                                compMealObj.Endorsement = null;
                                var serviceObj = new appmodel.IssueCompensationRequest.Services();
                                serviceObj.Taxes = null;
                                serviceObj.passengerRPH = PaxData.PaxRPH;
                                serviceObj.segmentRPH = null;
                                serviceObj.currencyCode = "USD";
                                serviceObj.amount = "0";
                                serviceObj.ticketNumber = null;
                                serviceObj.Remarks = null;
                                serviceObj.Endorsement = null;
                                var selectedServiceObj = new appmodel.IssueCompensationRequest.SelectedService();
                                selectedServiceObj.RFISC_code = PaxData.BREEmd.filter(function (m) { return m.compensationType == "Hotel"; })[0].productCode;
                                selectedServiceObj.RFISC_subCode = PaxData.BREEmd.filter(function (m) { return m.compensationType == "Hotel"; })[0].subProductCode;
                                selectedServiceObj.SSRCode = null;
                                selectedServiceObj.commercialName = PaxData.BREEmd.filter(function (m) { return m.compensationType == "Hotel"; })[0].productName;
                                selectedServiceObj.EmdType = PaxData.BREEmd.filter(function (m) { return m.compensationType == "Hotel"; })[0].emdType;
                                serviceObj.selectedService = selectedServiceObj;
                                selectedServiceObj.TypeOfService = null;
                                compMealObj.Services = serviceObj;
                                var paymentObj = new appmodel.IssueCompensationRequest.Payments();
                                paymentObj.Type = PaxData.BREEmd.filter(function (m) { return m.compensationType == "Hotel"; })[0].formOfPayment.substr(0, 2);
                                paymentObj.TransactionType = "Authorize";
                                paymentObj.SubType = PaxData.BREEmd.filter(function (m) { return m.compensationType == "Hotel"; })[0].formOfPayment.substr(3);
                                paymentObj.Description = "Hotel";
                                paymentObj.Amount = "0";
                                paymentObj.CurrencyCode = PaxData.BREEmd.filter(function (m) { return m.compensationType == "Hotel"; })[0].currency;
                                compMealObj.Payments = paymentObj;
                                compMealObj.Emds = [new appmodel.IssueCompensationRequest.Emd()];
                                compMealObj.Emds.length = 0;
                                var emdObj = new appmodel.IssueCompensationRequest.Emd();
                                emdObj.FlightSegmentId = PaxData.FlightSegmentId.toString();
                                emdObj.PassengerSeq = PaxData.PassengerSeq.toString();
                                emdObj.CompSeq = PaxData.Compensations.filter(function (m) { return m.CompTypeText == "Hotel"; })[0].CompSeq;
                                emdObj.PrimaryDocumentNbr = null;
                                emdObj.PrimaryAirlineCd = "CM";
                                emdObj.IssueDt = IssueDate;
                                emdObj.FirstNm = PaxData.GivenName;
                                emdObj.LastNm = PaxData.LastName;
                                emdObj.UserId = ApplicationSettings.getString("UserName", "");
                                emdObj.ReasonForIssuanceSubCd = PaxData.BREEmd.filter(function (m) { return m.compensationType == "Hotel"; })[0].subProductCode;
                                emdObj.ReasonForIssuanceCd = PaxData.BREEmd.filter(function (m) { return m.compensationType == "Hotel"; })[0].productCode;
                                // PaxData.hotelendorsementTextItems.forEach((data, Index) => {
                                //     emdObj.Endorsements1Txt = data + ',' + emdObj.Endorsements1Txt;
                                // })
                                if (PaxData.hotelFreeText != "") {
                                    emdObj.Endorsements1Txt = emdObj.Endorsements1Txt + PaxData.hotelFreeText;
                                }
                                if (PaxData.hotelDetails != "") {
                                    emdObj.Endorsements1Txt = emdObj.Endorsements1Txt + PaxData.hotelDetails;
                                }
                                emdObj.RemarkTxt = "RemarkTxt";
                                emdObj.CompAmt = "0";
                                emdObj.CompCurrencyCd = "USD";
                                emdObj.VoucherCnt = PaxData.hotel.toString();
                                compMealObj.Emds.push(emdObj);
                                paxObj_1.Compensations.push(compMealObj);
                            }
                            if (PaxData.meal > 0) {
                                var compHotelObj = new appmodel.IssueCompensationRequest.Compensation();
                                compHotelObj.FlightSegmentId = PaxData.FlightSegmentId.toString();
                                compHotelObj.PassengerSeq = PaxData.PassengerSeq.toString();
                                compHotelObj.CompSeq = PaxData.Compensations.filter(function (m) { return m.CompTypeText == "Meal"; })[0].CompSeq;
                                compHotelObj.CompReasonId = PaxData.CompensationReasonId.toString();
                                compHotelObj.CompReasonText = PaxData.CompensationReason;
                                compHotelObj.CompTypeId = PaxData.Compensations.filter(function (m) { return m.CompTypeText == "Meal"; })[0].CompTypeId;
                                compHotelObj.CompTypeText = "Meal";
                                // compHotelObj.OverrideReason = null;
                                compHotelObj.UpdateLockNbr = PaxData.Compensations.filter(function (m) { return m.CompTypeText == "Meal"; })[0].UpdateLockNbr.toString();
                                compHotelObj.Remarks = null;
                                compHotelObj.Endorsement = null;
                                var serviceObj = new appmodel.IssueCompensationRequest.Services();
                                serviceObj.Taxes = null;
                                serviceObj.passengerRPH = PaxData.PaxRPH;
                                serviceObj.segmentRPH = null;
                                serviceObj.currencyCode = "USD";
                                serviceObj.amount = "0";
                                serviceObj.ticketNumber = null;
                                serviceObj.Remarks = null;
                                serviceObj.Endorsement = null;
                                var selectedServiceObj = new appmodel.IssueCompensationRequest.SelectedService();
                                selectedServiceObj.RFISC_code = PaxData.BREEmd.filter(function (m) { return m.compensationType == "Meal"; })[0].productCode;
                                selectedServiceObj.RFISC_subCode = PaxData.BREEmd.filter(function (m) { return m.compensationType == "Meal"; })[0].subProductCode;
                                selectedServiceObj.SSRCode = null;
                                selectedServiceObj.commercialName = PaxData.BREEmd.filter(function (m) { return m.compensationType == "Meal"; })[0].productName;
                                selectedServiceObj.EmdType = PaxData.BREEmd.filter(function (m) { return m.compensationType == "Meal"; })[0].emdType;
                                selectedServiceObj.TypeOfService = null;
                                serviceObj.selectedService = selectedServiceObj;
                                compHotelObj.Services = serviceObj;
                                var paymentObj = new appmodel.IssueCompensationRequest.Payments();
                                paymentObj.Type = PaxData.BREEmd.filter(function (m) { return m.compensationType == "Meal"; })[0].formOfPayment.substr(0, 2);
                                paymentObj.TransactionType = "Authorize";
                                paymentObj.SubType = PaxData.BREEmd.filter(function (m) { return m.compensationType == "Meal"; })[0].formOfPayment.substr(3);
                                paymentObj.Description = "Meal";
                                paymentObj.Amount = "0";
                                paymentObj.CurrencyCode = PaxData.BREEmd.filter(function (m) { return m.compensationType == "Meal"; })[0].currency;
                                compHotelObj.Payments = paymentObj;
                                compHotelObj.Emds = [new appmodel.IssueCompensationRequest.Emd()];
                                compHotelObj.Emds.length = 0;
                                var emdObj = new appmodel.IssueCompensationRequest.Emd();
                                emdObj.FlightSegmentId = PaxData.FlightSegmentId.toString();
                                emdObj.PassengerSeq = PaxData.PassengerSeq.toString();
                                emdObj.CompSeq = PaxData.Compensations.filter(function (m) { return m.CompTypeText == "Meal"; })[0].CompSeq;
                                emdObj.PrimaryDocumentNbr = null;
                                emdObj.PrimaryAirlineCd = "CM";
                                emdObj.IssueDt = IssueDate;
                                emdObj.FirstNm = PaxData.GivenName;
                                emdObj.LastNm = PaxData.LastName;
                                emdObj.UserId = ApplicationSettings.getString("UserName", "");
                                emdObj.ReasonForIssuanceSubCd = PaxData.BREEmd.filter(function (m) { return m.compensationType == "Meal"; })[0].subProductCode;
                                emdObj.ReasonForIssuanceCd = PaxData.BREEmd.filter(function (m) { return m.compensationType == "Meal"; })[0].productCode;
                                // PaxData.mealendorsementTextItems.forEach((data, Index) => {
                                //     emdObj.Endorsements1Txt = data + ',' + emdObj.Endorsements1Txt;
                                // })
                                if (PaxData.mealFreeText != "") {
                                    emdObj.Endorsements1Txt = emdObj.Endorsements1Txt + PaxData.mealFreeText;
                                }
                                emdObj.RemarkTxt = "RemarkTxt";
                                emdObj.CompAmt = "0";
                                emdObj.CompCurrencyCd = "USD";
                                emdObj.VoucherCnt = PaxData.meal.toString();
                                compHotelObj.Emds.push(emdObj);
                                paxObj_1.Compensations.push(compHotelObj);
                            }
                            if (PaxData.transportation > 0) {
                                var compTransportationObj = new appmodel.IssueCompensationRequest.Compensation();
                                compTransportationObj.FlightSegmentId = PaxData.FlightSegmentId.toString();
                                compTransportationObj.PassengerSeq = PaxData.PassengerSeq.toString();
                                ;
                                compTransportationObj.CompSeq = PaxData.Compensations.filter(function (m) { return m.CompTypeText == "Transportation"; })[0].CompSeq;
                                compTransportationObj.CompReasonId = PaxData.CompensationReasonId.toString();
                                compTransportationObj.CompReasonText = PaxData.CompensationReason;
                                compTransportationObj.CompTypeId = PaxData.Compensations.filter(function (m) { return m.CompTypeText == "Transportation"; })[0].CompTypeId;
                                compTransportationObj.CompTypeText = "Transportation";
                                // compTransportationObj.OverrideReason = null;
                                compTransportationObj.UpdateLockNbr = PaxData.Compensations.filter(function (m) { return m.CompTypeText == "Transportation"; })[0].UpdateLockNbr.toString();
                                ;
                                compTransportationObj.Remarks = null;
                                compTransportationObj.Endorsement = null;
                                var serviceObj = new appmodel.IssueCompensationRequest.Services();
                                serviceObj.Taxes = null;
                                serviceObj.passengerRPH = PaxData.PaxRPH;
                                serviceObj.segmentRPH = null;
                                serviceObj.currencyCode = "USD";
                                serviceObj.amount = "0";
                                serviceObj.ticketNumber = null;
                                serviceObj.Remarks = null;
                                serviceObj.Endorsement = null;
                                var selectedServiceObj = new appmodel.IssueCompensationRequest.SelectedService();
                                selectedServiceObj.RFISC_code = PaxData.BREEmd.filter(function (m) { return m.compensationType == "Transportation"; })[0].productCode;
                                selectedServiceObj.RFISC_subCode = PaxData.BREEmd.filter(function (m) { return m.compensationType == "Transportation"; })[0].subProductCode;
                                selectedServiceObj.SSRCode = null;
                                selectedServiceObj.commercialName = PaxData.BREEmd.filter(function (m) { return m.compensationType == "Transportation"; })[0].productName;
                                selectedServiceObj.EmdType = PaxData.BREEmd.filter(function (m) { return m.compensationType == "Transportation"; })[0].emdType;
                                selectedServiceObj.TypeOfService = null;
                                serviceObj.selectedService = selectedServiceObj;
                                compTransportationObj.Services = serviceObj;
                                var paymentObj = new appmodel.IssueCompensationRequest.Payments();
                                paymentObj.Type = PaxData.BREEmd.filter(function (m) { return m.compensationType == "Transportation"; })[0].formOfPayment.substr(0, 2);
                                paymentObj.TransactionType = "Authorize";
                                paymentObj.SubType = PaxData.BREEmd.filter(function (m) { return m.compensationType == "Transportation"; })[0].formOfPayment.substr(3);
                                paymentObj.Description = "Transportation";
                                paymentObj.Amount = "0";
                                paymentObj.CurrencyCode = PaxData.BREEmd.filter(function (m) { return m.compensationType == "Transportation"; })[0].currency;
                                compTransportationObj.Payments = paymentObj;
                                compTransportationObj.Emds = [new appmodel.IssueCompensationRequest.Emd()];
                                compTransportationObj.Emds.length = 0;
                                var emdObj = new appmodel.IssueCompensationRequest.Emd();
                                emdObj.FlightSegmentId = PaxData.FlightSegmentId.toString();
                                emdObj.PassengerSeq = PaxData.PassengerSeq.toString();
                                emdObj.CompSeq = PaxData.Compensations.filter(function (m) { return m.CompTypeText == "Transportation"; })[0].CompSeq;
                                emdObj.PrimaryDocumentNbr = null;
                                emdObj.PrimaryAirlineCd = "CM";
                                emdObj.IssueDt = IssueDate;
                                emdObj.FirstNm = PaxData.GivenName;
                                emdObj.LastNm = PaxData.LastName;
                                emdObj.UserId = ApplicationSettings.getString("UserName", "");
                                emdObj.ReasonForIssuanceSubCd = PaxData.BREEmd.filter(function (m) { return m.compensationType == "Transportation"; })[0].subProductCode;
                                emdObj.ReasonForIssuanceCd = PaxData.BREEmd.filter(function (m) { return m.compensationType == "Transportation"; })[0].productCode;
                                if (PaxData.transportFreeText != "") {
                                    emdObj.Endorsements1Txt = emdObj.Endorsements1Txt + PaxData.transportFreeText;
                                }
                                emdObj.RemarkTxt = "RemarkTxt";
                                emdObj.CompAmt = "0";
                                emdObj.CompCurrencyCd = "USD";
                                emdObj.VoucherCnt = PaxData.transportation.toString();
                                compTransportationObj.Emds.push(emdObj);
                                paxObj_1.Compensations.push(compTransportationObj);
                            }
                            flightele.Passengers.push(paxObj_1);
                        }
                    });
                });
                Obj_1.FlightSegments.push(flightele);
            });
            return Obj_1;
        }
        catch (error) {
            console.log(error.message);
        }
    };
    Converters.convertToIssueCompensationResponse = function (response, PaxResponse) {
        try {
            PaxResponse.forEach(function (paxEle, Index) {
                if (response.Results != null) {
                    if (response.Results[0].FlightSegments != null && response.Results[0].FlightSegments.length > 0) {
                        response.Results[0].FlightSegments[0].Passengers.forEach(function (element, index) {
                            if (paxEle.GivenName == element.PaxFirstNm && paxEle.LastName == element.PaxLastNm && paxEle.OrderId == element.OrderId) {
                                paxEle.FlightSegmentId = element.FlightSegmentId;
                                paxEle.PassengerSeq = element.PassengerSeq;
                                paxEle.OrderId = element.OrderId;
                                paxEle.GivenName = element.PaxFirstNm;
                                paxEle.LastName = element.PaxLastNm;
                                paxEle.FullName = element.PaxLastNm + "/" + element.PaxFirstNm;
                                paxEle.PaxType = element.PaxType;
                                paxEle.FqtvCc = element.FqtvCc;
                                paxEle.FqtvNumber = element.FqFqtvNumber;
                                paxEle.PaxStatus = element.PaxStatus;
                                paxEle.PaxEmailAddress = element.PaxEmailAddress;
                                paxEle.CompensationReasonId = element.PaxCompReasonID;
                                paxEle.IsExistingCompensation = element.IsExistingCompensation;
                                paxEle.CustomerCareCaseNum = element.CustomerCareCaseNum;
                                paxEle.WorldTracerNum = element.WorldTracerNum;
                                paxEle.UpdateLockNbr = element.UpdateLockNbr;
                                paxEle.FqtvTier = element.FqtvTier;
                                if (element.CabinClass == null) {
                                    paxEle.Cabin = "";
                                }
                                else {
                                    paxEle.Cabin = element.CabinClass;
                                }
                                paxEle.PaxRPH = element.PaxRPH;
                                paxEle.IsCompensationIssued = element.IsCompensationIssued;
                                paxEle.SSR = element.SSR;
                                paxEle.Etkt = element.Etkt;
                                paxEle.ReaccomDetails = element.ReaccomDetails;
                                paxEle.Bags = element.Bags;
                                if (paxEle.IsSelected) {
                                    paxEle.monetary = 0;
                                    paxEle.hotel = 0;
                                    paxEle.meal = 0;
                                    paxEle.transportation = 0;
                                }
                                paxEle.IsSelected = false;
                                paxEle.Compensations = element.Compensations;
                                paxEle.ExistingCompensations = element.ExistingCompensations;
                                if (element.Compensations != null) {
                                    element.Compensations.forEach(function (exiCompData, exiCompIndex) {
                                        if (exiCompData.Emds != null) {
                                            exiCompData.Emds.forEach(function (exiEMDData, exiEMDIndex) {
                                                if (exiCompData.CompTypeText == "Monetary") {
                                                    paxEle.monetary = exiCompData.Emds[0].CompAmt;
                                                }
                                                else if (exiCompData.CompTypeText == "Hotel") {
                                                    paxEle.hotel = exiCompData.Emds[0].VoucherCnt;
                                                }
                                                else if (exiCompData.CompTypeText == "Meal") {
                                                    paxEle.meal = exiCompData.Emds[0].VoucherCnt;
                                                }
                                                else {
                                                    paxEle.transportation = exiCompData.Emds[0].VoucherCnt;
                                                }
                                                paxEle.Compensations[exiCompIndex].Emds[exiEMDIndex].IssueDt = moment(exiEMDData.IssueDt).format("YYYY-MM-DD");
                                            });
                                        }
                                    });
                                }
                                paxEle.AdditionalDetails = "Edit";
                            }
                        });
                    }
                }
            });
            return PaxResponse;
        }
        catch (error) {
            console.log(error.message);
        }
    };
    Converters.convertToEmailCompensation = function (PaxResponse, flightResponse) {
        try {
            var emailObj_1 = new appmodel.EmailModule.RootObject();
            emailObj_1.OrderId = null;
            emailObj_1.Gateway = "EMAIL";
            emailObj_1.ListType = "emd";
            emailObj_1.DocumentType = "COMPMONT";
            emailObj_1.Source = "Travel";
            emailObj_1.Segments = [new appmodel.EmailModule.SegmentsEntity()];
            emailObj_1.Segments.length = 0;
            var segObj = new appmodel.EmailModule.SegmentsEntity();
            segObj.OperatingCarrierCode = flightResponse.FlightNumber.substr(0, 2);
            segObj.OperatingCarrierNumber = flightResponse.FlightNumber.substr(2);
            var depObj = new appmodel.EmailModule.DepartureOrArrival();
            depObj.CityName = flightResponse.DepartureAirport;
            depObj.Date = flightResponse.DepartureDate;
            segObj.Departure = depObj;
            var arrObj = new appmodel.EmailModule.DepartureOrArrival();
            arrObj.CityName = flightResponse.DestinationAirport;
            segObj.Arrival = arrObj;
            emailObj_1.Segments.push(segObj);
            emailObj_1.Passengers = [new appmodel.EmailModule.Passenger()];
            emailObj_1.Passengers.length = 0;
            PaxResponse.forEach(function (paxEle, Index) {
                paxEle.Compensations.forEach(function (exiCompData, exiIndex) {
                    if (exiCompData.Emds) {
                        if (exiCompData.CompTypeText == "Monetary") {
                            exiCompData.Emds.forEach(function (emdData, emdIndex) {
                                var paxObj = new appmodel.EmailModule.Passenger();
                                paxObj.FlightSegmentId = emdData.FlightSegmentId.toString();
                                paxObj.PassengerSeq = emdData.PassengerSeq.toString();
                                paxObj.OrderId = paxEle.OrderId;
                                paxObj.CompSeq = emdData.CompSeq;
                                paxObj.PrimaryDocumentNbr = emdData.PrimaryDocumentNbr;
                                paxObj.PrimaryAirlineCd = emdData.PrimaryAirlineCd;
                                paxObj.IssueDt = emdData.IssueDt;
                                paxObj.FirstNm = paxEle.GivenName;
                                paxObj.LastNm = paxEle.LastName;
                                paxObj.ReasonForIssuanceCd = exiCompData.CompReasonText;
                                paxObj.ReasonForIssuanceSubCd = exiCompData.CompTypeText;
                                paxObj.PrintStatus = emdData.PrintStatus;
                                paxObj.EmailStatus = emdData.EmailStatus;
                                paxObj.WorldTraceNumber = paxEle.WorldTracerNum;
                                paxObj.CustomerCareNumber = paxEle.CustomerCareCaseNum;
                                paxObj.EticketNumber = paxEle.EtktNumbr;
                                var delObj = new appmodel.EmailModule.DeliveryDetail();
                                var emailObject = new appmodel.EmailModule.Email();
                                var toObj = [new appmodel.EmailModule.ToEntity()];
                                toObj.length = 0;
                                var toAddrObj = new appmodel.EmailModule.ToEntity();
                                toAddrObj.ToAddr = paxEle.Email;
                                toObj.push(toAddrObj);
                                emailObject.To = toObj;
                                delObj.Email = emailObject;
                                paxObj.DeliveryDetail = delObj;
                                emailObj_1.Passengers.push(paxObj);
                            });
                        }
                    }
                });
            });
            console.log("Email OBJ:" + JSON.stringify(emailObj_1));
            return emailObj_1;
        }
        catch (error) {
            console.log(error.message);
        }
    };
    Converters.convertToPrintEMDCompensation = function (PaxResponse, flightResponse) {
        try {
            var printObj_1 = new appmodel.PrintModule.RootObject();
            printObj_1.OrderId = null;
            printObj_1.Gateway = "EMAIL";
            printObj_1.ListType = "PRINTEMD";
            printObj_1.DocumentType = "COMP";
            printObj_1.Source = "Travel";
            printObj_1.Segments = [new appmodel.PrintModule.Segment()];
            printObj_1.Segments.length = 0;
            var segObj = new appmodel.PrintModule.Segment();
            segObj.OperatingCarrierNumber = flightResponse.FlightNumber.substr(2);
            segObj.OperatingCarrierCode = flightResponse.FlightNumber.substr(0, 2);
            var arrcityObj = new appmodel.PrintModule.Arrival();
            arrcityObj.CityName = flightResponse.DestinationAirport;
            segObj.Arrival = arrcityObj;
            var depcityObj = new appmodel.PrintModule.Departure();
            depcityObj.CityName = flightResponse.DepartureAirport;
            segObj.Departure = depcityObj;
            printObj_1.Segments.push(segObj);
            printObj_1.Passengers = [new appmodel.PrintModule.Passenger()];
            printObj_1.Passengers.length = 0;
            PaxResponse.forEach(function (paxEle, Index) {
                paxEle.Compensations.forEach(function (exiEmdObj, exiEmdIndex) {
                    if (exiEmdObj.Emds) {
                        exiEmdObj.Emds.forEach(function (emdObj, emdIndex) {
                            if (exiEmdObj.CompTypeText == "Monetary") {
                                var paxObj = new appmodel.PrintModule.Passenger();
                                paxObj.FlightSegmentId = paxEle.FlightSegmentId.toString();
                                paxObj.PassengerSeq = paxEle.PassengerSeq;
                                paxObj.OrderId = paxEle.OrderId;
                                paxObj.CompSeq = emdObj.CompSeq;
                                paxObj.PrimaryDocumentNbr = emdObj.PrimaryDocumentNbr;
                                paxObj.PrimaryAirlineCd = emdObj.PrimaryAirlineCd;
                                paxObj.IssueDt = emdObj.IssueDt;
                                paxObj.FirstNm = paxEle.GivenName;
                                paxObj.LastNm = paxEle.LastName;
                                paxObj.ReasonForIssuanceCd = exiEmdObj.CompReasonText;
                                paxObj.ReasonForIssuanceSubCd = "Compensation Voucher";
                                paxObj.PrintStatus = emdObj.PrintStatus;
                                paxObj.EmailStatus = emdObj.EmailStatus;
                                printObj_1.Passengers.push(paxObj);
                            }
                            else {
                                if (emdObj.PrintStatus == "n") {
                                    var paxObj = new appmodel.PrintModule.Passenger();
                                    paxObj.FlightSegmentId = paxEle.FlightSegmentId.toString();
                                    paxObj.PassengerSeq = paxEle.PassengerSeq;
                                    paxObj.OrderId = paxEle.OrderId;
                                    paxObj.CompSeq = emdObj.CompSeq;
                                    paxObj.PrimaryDocumentNbr = emdObj.PrimaryDocumentNbr;
                                    paxObj.PrimaryAirlineCd = emdObj.PrimaryAirlineCd;
                                    paxObj.IssueDt = emdObj.IssueDt;
                                    paxObj.FirstNm = paxEle.GivenName;
                                    paxObj.LastNm = paxEle.LastName;
                                    paxObj.ReasonForIssuanceCd = exiEmdObj.CompReasonText;
                                    paxObj.ReasonForIssuanceSubCd = exiEmdObj.CompTypeText + " Voucher";
                                    paxObj.PrintStatus = emdObj.PrintStatus;
                                    paxObj.EmailStatus = emdObj.EmailStatus;
                                    printObj_1.Passengers.push(paxObj);
                                }
                            }
                        });
                    }
                });
            });
            var delDetailObj = new appmodel.PrintModule.DeliveryDetail();
            delDetailObj.Email = null;
            var printDelObj = new appmodel.PrintModule.Printer();
            var Worksatation = ApplicationSettings.getString("hostBoardingWS", "");
            var DeviceName = ApplicationSettings.getString("boardingPassDeviceName", "");
            var DeviceType = ApplicationSettings.getString("deviceType", "");
            var PectabVersion = ApplicationSettings.getString("pectabVersion", "");
            printDelObj.DeviceName = DeviceName;
            printDelObj.WorkstationName = Worksatation;
            // printDelObj.PectabVersion = PectabVersion;
            printDelObj.DeviceType = DeviceType;
            delDetailObj.Printer = printDelObj;
            printObj_1.DeliveryDetail = delDetailObj;
            console.log("Email OBJ:" + JSON.stringify(printObj_1));
            return printObj_1;
        }
        catch (error) {
            console.log(error.message);
        }
    };
    Converters.convertToBluetoothPrintEMDCompensation = function (PaxResponse, flightResponse) {
        try {
            var printObj_2 = new appmodel.PrintModule.RootObject();
            printObj_2.OrderId = null;
            printObj_2.Gateway = "TAB";
            printObj_2.ListType = "EMD";
            printObj_2.DocumentType = "COMPTAB";
            printObj_2.Source = "CM-TAB";
            printObj_2.Segments = [new appmodel.PrintModule.Segment()];
            printObj_2.Segments.length = 0;
            var segObj = new appmodel.PrintModule.Segment();
            segObj.OperatingCarrierNumber = flightResponse.FlightNumber.substr(2);
            segObj.OperatingCarrierCode = flightResponse.FlightNumber.substr(0, 2);
            var arrcityObj = new appmodel.PrintModule.Arrival();
            arrcityObj.CityName = flightResponse.DestinationAirport;
            segObj.Arrival = arrcityObj;
            var depcityObj = new appmodel.PrintModule.Departure();
            depcityObj.CityName = flightResponse.DepartureAirport;
            segObj.Departure = depcityObj;
            printObj_2.Segments.push(segObj);
            printObj_2.Passengers = [new appmodel.PrintModule.Passenger()];
            printObj_2.Passengers.length = 0;
            PaxResponse.forEach(function (paxEle, Index) {
                paxEle.Compensations.forEach(function (exiEmdObj, exiEmdIndex) {
                    if (exiEmdObj.Emds) {
                        exiEmdObj.Emds.forEach(function (emdObj, emdIndex) {
                            if (exiEmdObj.CompTypeText == "Monetary") {
                                var paxObj = new appmodel.PrintModule.Passenger();
                                paxObj.FlightSegmentId = paxEle.FlightSegmentId.toString();
                                paxObj.PassengerSeq = paxEle.PassengerSeq;
                                paxObj.OrderId = paxEle.OrderId;
                                paxObj.CompSeq = emdObj.CompSeq;
                                paxObj.PrimaryDocumentNbr = emdObj.PrimaryDocumentNbr;
                                paxObj.PrimaryAirlineCd = emdObj.PrimaryAirlineCd;
                                paxObj.IssueDt = emdObj.IssueDt;
                                paxObj.FirstNm = paxEle.GivenName;
                                paxObj.LastNm = paxEle.LastName;
                                paxObj.ReasonForIssuanceCd = exiEmdObj.CompReasonText;
                                paxObj.ReasonForIssuanceSubCd = "Monetary Voucher";
                                paxObj.PrintStatus = emdObj.PrintStatus;
                                paxObj.EmailStatus = emdObj.EmailStatus;
                                printObj_2.Passengers.push(paxObj);
                            }
                            else {
                                if (emdObj.PrintStatus == "n") {
                                    var paxObj = new appmodel.PrintModule.Passenger();
                                    paxObj.FlightSegmentId = paxEle.FlightSegmentId.toString();
                                    paxObj.PassengerSeq = paxEle.PassengerSeq;
                                    paxObj.OrderId = paxEle.OrderId;
                                    paxObj.CompSeq = emdObj.CompSeq;
                                    paxObj.PrimaryDocumentNbr = emdObj.PrimaryDocumentNbr;
                                    paxObj.PrimaryAirlineCd = emdObj.PrimaryAirlineCd;
                                    paxObj.IssueDt = emdObj.IssueDt;
                                    paxObj.FirstNm = paxEle.GivenName;
                                    paxObj.LastNm = paxEle.LastName;
                                    paxObj.ReasonForIssuanceCd = exiEmdObj.CompReasonText;
                                    paxObj.ReasonForIssuanceSubCd = exiEmdObj.CompTypeText + " Voucher";
                                    paxObj.PrintStatus = emdObj.PrintStatus;
                                    paxObj.EmailStatus = emdObj.EmailStatus;
                                    printObj_2.Passengers.push(paxObj);
                                }
                            }
                        });
                    }
                });
            });
            var delDetailObj = new appmodel.PrintModule.DeliveryDetail();
            delDetailObj.Printer = null;
            printObj_2.DeliveryDetail = delDetailObj;
            console.log("Email OBJ:" + JSON.stringify(printObj_2));
            return printObj_2;
        }
        catch (error) {
            console.log(error.message);
        }
    };
    Converters.convertToUpdateEmailId = function (PaxResponse, orderResponse) {
        try {
            var updateEmailObj = new appmodel.updateEmailModel.RootObject();
            updateEmailObj.ReturnOrder = false;
            updateEmailObj.ReceivedFrom = null;
            updateEmailObj.Changes = ["1", "2"];
            var paxObj_2 = new appmodel.updateEmailModel.Traveler();
            orderResponse.Passengers.forEach(function (element, index) {
                if (PaxResponse.GivenName == element.Firstname && PaxResponse.LastName == element.Lastname) {
                    paxObj_2.Firstname = element.Firstname;
                    paxObj_2.Lastname = element.Lastname;
                    paxObj_2.SurnameRefNumber = element.SurnameRefNumber;
                    paxObj_2.Prefix = element.Prefix;
                    paxObj_2.RPH = element.RPH;
                    paxObj_2.Gender = element.Gender;
                    paxObj_2.PassengerTypeCode = element.PassengerTypeCode;
                    paxObj_2.AssociatedInfantRPH = element.AssociatedInfantRPH;
                    paxObj_2.DateOfBirth = element.DateOfBirth;
                    paxObj_2.Age = element.Age;
                    paxObj_2.AssociatedAdultRPH = element.AssociatedAdultRPH;
                    paxObj_2.FOID = element.FOID;
                    paxObj_2.OldPhoneNumbers = element.OldPhoneNumbers;
                    if (element.OldFirstname == null) {
                        paxObj_2.OldFirstname = element.Firstname;
                    }
                    else {
                        paxObj_2.OldFirstname = element.OldFirstname;
                    }
                    if (element.OldLastname == null) {
                        paxObj_2.OldLastname = element.Lastname;
                    }
                    else {
                        paxObj_2.OldLastname = element.OldLastname;
                    }
                    paxObj_2.EmergencyDetails = element.EmergencyDetails;
                    paxObj_2.OldEmergencyDetails = element.OldEmergencyDetails;
                    paxObj_2.IsContactRefused = element.IsContactRefused;
                    paxObj_2.PhoneNumbers = element.PhoneNumbers;
                    paxObj_2.Emails = [new appmodel.updateEmailModel.EmailsEntity()];
                    paxObj_2.Emails.length = 0;
                    var emailObj = new appmodel.updateEmailModel.EmailsEntity();
                    emailObj.Type = "CTCE";
                    emailObj.Value = PaxResponse.Email;
                    paxObj_2.Emails.push(emailObj);
                }
            });
            updateEmailObj.Traveler = paxObj_2;
            // console.log("Email OBJ:" + JSON.stringify(emailObj));
            return updateEmailObj;
        }
        catch (error) {
            console.log(error.message);
        }
    };
    Converters.PassengerArray = [];
    //public static FlightWithPaxArray: Array<FlightWithPax> = [];
    Converters.PassengerList = [];
    Converters.CompleteDepartureArray = [];
    Converters.DepartureArray = [];
    Converters.DepartureArrayforFQTV = [];
    Converters.PassengerNewList = [];
    Converters.PaxListDepartures = [];
    Converters.PaxListDeparturesNC = [];
    Converters.FQTVList = [];
    return Converters;
}());
exports.Converters = Converters;