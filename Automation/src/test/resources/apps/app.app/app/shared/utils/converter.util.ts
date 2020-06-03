import * as appinterface from "../../shared/interface/index";
import * as appmodel from "../../shared/model/index";
import * as moment from "moment";
import { Observable } from 'rxjs/Rx';
import { AppExecutiontime } from '../../app.executiontime';
import * as Toast from 'nativescript-toast';
import * as ApplicationSettings from "application-settings";
import { DataService, PassengerService, CheckinOrderService, TimeOutService } from "../../shared/services/index";
import { EmergencyDetail } from "../../shared/model/index";
// import { CompensationPassengerList} from "../../shared/model/index";

export class Converters {
    public static PassengerArray: Array<appinterface.PaxTemplate> = [];
    //public static FlightWithPaxArray: Array<FlightWithPax> = [];
    public static PassengerList: Array<appinterface.PassengerListTemplate> = [];
    public PassengerList: Array<appinterface.MultiSegmentTemplate.Passenger> = [];
    public static CompleteDepartureArray: Array<appinterface.DepartureInfo1.Departure> = [];
    public static DepartureArray: Array<appinterface.DepartureInfo1.Departure> = [];
    public static DepartureArrayforFQTV: Array<appinterface.DepartureInfo> = [];
    public static PassengerNewList: Array<appinterface.PassengerList> = [];
    public static PaxListDepartures: Array<appinterface.DeparturePaxList> = [];
    public static PaxListDeparturesNC: Array<appinterface.DeparturePaxList> = [];
    public static FQTVList: Array<appinterface.FQTVInfo> = [];
    public static SecurityDocs: appmodel.SecurityModel;
    public static SecurityValidate: appmodel.SecurityValidation.RootObject;
    public static AccountProfileArray: appinterface.AccontProfileModel.AccountProfileTemplate;
    constructor(public _shared: CheckinOrderService) {
        // public static CompensationPassengerDetail: appmodel.CompensationOrderList;
    }


    //Accountrofile
    public static ConvertToAccountProfileTemplate(response: any): appinterface.AccontProfileModel.AccountProfileTemplate {

        try {
            var sDate = new Date();
            console.log('Convert Account Profile  --------------- Start Date Time : ' + sDate);
            console.log('Inside convert function For Account Profile');
            let obj = new appinterface.AccontProfileModel.AccountProfileTemplate();
            obj.LastName = response.LastName;
            obj.FirstName = response.FirstName;
            obj.Username = response.Username;
            response.PointOfSales.forEach((data, Index) => {
                let obj2 = new appinterface.AccontProfileModel.PointOfSales();
                obj2.AirportCode = data.AgentLocationCode;
                obj2.Name = data.Name;
                obj2.ID = data.ID;
                obj2.currencies = data.Currencies;
                obj2.AgentCode = data.AgentCode;
                obj.PointOfSales.push(obj2);

            })
            obj.AirportCode = response.AirportCode;
            obj.ISOCurrencyCode = response.ISOCurrencyCode;
            obj.Currencies = response.Currencies;
            obj.PhysicalLocation = response.PhysicalLocation;
            obj.Requestor_ID = response.Requestor_ID;
            Converters.AccountProfileArray = obj;
            console.log(this.AccountProfileArray);
            var eDate = new Date();
            console.log('Convert Account Profile --------------- End Date Time : ' + eDate);
            console.log('Convert Account Profile Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
            return Converters.AccountProfileArray;
        }
        catch (error) {
            console.log(error.message);
        }
    }

    //MultiSegmentPassnger 
    public static ConvertToFlightWithPaxTemplate(response: appmodel.Order.RootObject, allStatus: any, scTable: any, etktNumber: string): appinterface.MultiSegmentTemplate.RootObject {

        try {
            let obj = new appinterface.MultiSegmentTemplate.RootObject();
            console.log("inside Convertor");
            var POSLocation = ApplicationSettings.getString("userdetails", "").substr(0, 3);
            var OriginPosMatch: boolean = false;
            var isAnyFlightNotOpen: boolean = true;
            var ValidETKTStatus: boolean = true;
            var isFirstSegment: boolean = true;
            var inboundCheck: boolean = true;
            if ((response.Segments != null) && (response.Segments.length > 0)) {
                let objFlightWithPax1 = new appinterface.MultiSegmentTemplate.FlightWithPax();
                let isBoardingLoc: boolean = true;
                response.Segments.forEach((SegElement, SegIndex) => {
                    if (SegElement.Origin.AirportCode == POSLocation && inboundCheck && SegElement.Status.StatusCode != "FLOWN" && SegIndex > 0) {
                        inboundCheck = false;
                        let date = "";
                        let origin = "";
                        let flightnum = ""

                        if (response.Segments[SegIndex - 1].MarketingFlight.substr(0, 2) != "CM" && response.Segments[SegIndex - 1].OperatingFlight != null && response.Segments[SegIndex - 1].OperatingFlight.substr(0, 2) == "CM") {
                            flightnum = response.Segments[SegIndex - 1].OperatingFlight
                        } else {
                            flightnum = response.Segments[SegIndex - 1].MarketingFlight
                        }
                        date = response.Segments[SegIndex - 1].DepartureDateTime.toString().substr(0, 10);
                        origin = response.Segments[SegIndex - 1].Origin.AirportCode
                        if (response.Segments[SegIndex - 1].Status.StatusCode != "FLOWN") {
                            objFlightWithPax1.InboundDetail = (flightnum + "/" + date + "/" + origin).toString();
                            console.log(objFlightWithPax1.InboundDetail);
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
                                        let objFlightWithPax = new appinterface.MultiSegmentTemplate.FlightWithPax();
                                        objFlightWithPax.MarketingFlight = response.Segments[SegIndex].MarketingFlight;
                                        objFlightWithPax.OriginCity = SegElement.Origin.City;
                                        objFlightWithPax.DestinationCity = SegElement.Destination.City;
                                        objFlightWithPax.InboundDetail = objFlightWithPax1.InboundDetail;
                                        objFlightWithPax.Origin = SegElement.Origin.AirportCode;
                                        objFlightWithPax.Destination = SegElement.Destination.AirportCode;
                                        objFlightWithPax.FlightStatus = SegElement.Status.StatusDescription;
                                        // objFlightWithPax.STD = SegElement.DepartureDateTime.toString().substr(11, 5);
                                        // objFlightWithPax.ETD = SegElement.DepartureDateTime.toString().substr(11, 5);
                                        // objFlightWithPax.ETA = SegElement.ArrivalDateTime.toString().substr(11, 5);
                                        objFlightWithPax.FlightDate = SegElement.DepartureDateTime.toString().substr(0, 10);
                                        objFlightWithPax.RPH = SegElement.RPH;
                                        objFlightWithPax.DepartureDateTime = SegElement.DepartureDateTime;
                                        objFlightWithPax.ArrivalDateTime = SegElement.ArrivalDateTime;
                                        objFlightWithPax.MarketingFlight = SegElement.MarketingFlight;
                                        objFlightWithPax.DepartureCity = SegElement.Origin.AirportCode;
                                        objFlightWithPax.PassengerRPHs = SegElement.PassengerRPHs;
                                        objFlightWithPax.RBD = SegElement.RBD;
                                        objFlightWithPax.FlightCheckIn = SegElement.FlightCheckIn.CheckInStatus;
                                        objFlightWithPax.SegmentRPH = SegElement.RPH;
                                        objFlightWithPax1.SegmentRPH = SegElement.RPH;
                                        objFlightWithPax.FlightInfo = SegElement.FlightInfo;
                                        objFlightWithPax.IsThroughOrChangeOfGaugeFlight = SegElement.IsThroughOrChangeOfGaugeFlight;
                                        objFlightWithPax.Selected = SegElement.Selected;
                                        objFlightWithPax.Connection = SegElement.Connection;
                                        objFlightWithPax.Stopover = SegElement.Stopover;
                                        objFlightWithPax.Turnaround = SegElement.Turnaround;
                                        objFlightWithPax.StatusNumber = SegElement.Status.StatusNumber;
                                        objFlightWithPax.OperatingFlight = SegElement.OperatingFlight;
                                        objFlightWithPax.IsInternational = SegElement.IsInternational;
                                        if (SegElement.Origin.AirportCode == POSLocation) {
                                            if (isBoardingLoc) {
                                                objFlightWithPax.isAPISSeatBagDisabled = false;
                                                isBoardingLoc = false;
                                            }
                                        }
                                        // if(SegElement.IsInternational==false && response.Segments.splice(SegIndex).filter(m=>m.IsInternational==true && m.IsWithinCheckInWindow ==true).length>0){
                                        //     objFlightWithPax.APISRequired = true;
                                        // }else{
                                        //     objFlightWithPax.APISRequired = false;
                                        // }
                                        objFlightWithPax.IsFlightRestricted = SegElement.IsFlightRestricted;
                                        response.Passengers.forEach((element, index) => {

                                            let objPaxTemplate = new appinterface.MultiSegmentTemplate.Passenger();
                                            let count: boolean;
                                            count = true;
                                            objPaxTemplate.OrderID = response.ID;
                                            objPaxTemplate.FirstName = element.Firstname;
                                            objPaxTemplate.LastName = element.Lastname;
                                            objPaxTemplate.FullName = element.Fullname;
                                            objPaxTemplate.GivenNameRefNumber = element.GivenNameRefNumber;
                                            if (element.Documents.length == 0) {
                                                console.log("APIS 1");
                                                objFlightWithPax.APISRequired = false;
                                            } else {
                                                console.log("APIS 2");
                                                objFlightWithPax.APISRequired = true;
                                            }
                                            // objPaxTemplate.PassengerType = element.PassengerTypeCodeDesc;
                                            if (element.PassengerTypeCodeDesc != "Infant without seat" && response.SegmentTravelerInfos && response.SegmentTravelerInfos.filter(m => m.PassengerRPH == element.RPH && m.SegmentRPH == SegElement.RPH)[0].CheckinPassengerTypeCodeDesc) {
                                                console.log("Segment Traveller Info" + response.SegmentTravelerInfos.filter(m => m.PassengerRPH == element.RPH && m.SegmentRPH == SegElement.RPH)[0].CheckinPassengerTypeCodeDesc);
                                                objPaxTemplate.PassengerType = response.SegmentTravelerInfos.filter(m => m.PassengerRPH == element.RPH && m.SegmentRPH == SegElement.RPH)[0].CheckinPassengerTypeCodeDesc;
                                            }
                                            else if (element.PassengerTypeCodeDesc == "Infant with seat") {
                                                objPaxTemplate.PassengerType = "Child";
                                            } else {
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
                                            objPaxTemplate.TierLevel = "HON";  // not mapped
                                            objPaxTemplate.RPH = element.RPH;
                                            // objPaxTemplate.SurnameRefNumber = element.SurnameRefNumber;
                                            objPaxTemplate.PassengerTypeCode = element.PassengerTypeCode;
                                            objPaxTemplate.Selected = element.Selected;
                                            objPaxTemplate.BagCount = element.CheckInBagCountTotal;
                                            objPaxTemplate.AssociatedInfantRPH = element.AssociatedInfantRPH;
                                            objPaxTemplate.AssociatedAdultRPH = element.AssociatedAdultRPH;
                                            objPaxTemplate.FqtTravelers = element.FqtTravelers;
                                            if ((element.FqtTravelers != null) && (element.FqtTravelers.length > 0)) {
                                                element.FqtTravelers.forEach((FQTV, FQTVIndex) => {
                                                    objPaxTemplate.FQTVNumber = FQTV.MembershipID.split('.')[0];
                                                    objPaxTemplate.ProgramIDxx = FQTV.ProgramID;
                                                    if (FQTV.AllianceTierLevel != null && FQTV.AllianceTierLevel.Name != null) {
                                                        objPaxTemplate.StarLevel = FQTV.AllianceTierLevel.Name;
                                                        objPaxTemplate.LoyalLevel = FQTV.TierLevel.Name;
                                                    } else {
                                                        objPaxTemplate.LoyalLevel = FQTV.TierLevel.Name;
                                                    }
                                                });
                                            }
                                            objPaxTemplate.DateOfBirth = element.DateOfBirth;
                                            element.PhoneNumbers.forEach((PhoneInfo, PhoneIndex) => {
                                                let phoneNumbers = new appinterface.MultiSegmentTemplate.PhoneNumber();
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
                                            element.Emails.forEach((emailInfo, emailIndex) => {
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
                                                response.SegmentTravelerInfos.forEach((TravelerInfos, SegIndex) => {
                                                    if (TravelerInfos.Services != null) {
                                                        if ((objPaxTemplate.RPH == TravelerInfos.Services[0].PassengerRPH && TravelerInfos.SegmentRPH == objFlightWithPax.SegmentRPH)) {
                                                            objPaxTemplate.serviceText = TravelerInfos.Services[0].Text;
                                                            if (TravelerInfos.ShortPassDesc == "Infant with seat") {
                                                                objPaxTemplate.SeatNumber = ((TravelerInfos.Seats != null) && (TravelerInfos.Seats[0].SeatNumber != null)) ? TravelerInfos.Seats[0].SeatNumber : "Auto";
                                                            }
                                                            else if (TravelerInfos.ShortPassDesc == "Infant without seat") {
                                                                objPaxTemplate.SeatNumber = "";
                                                            }

                                                        }
                                                    }
                                                    if ((objPaxTemplate.RPH == TravelerInfos.PassengerRPH && TravelerInfos.SegmentRPH == objFlightWithPax.SegmentRPH)) {
                                                        //objPaxTemplate.CheckinStatus = (TravelerInfos.CheckinInfos != null && TravelerInfos.CheckinInfos[0].Status.trim() == "Checkedin") ? true : false;
                                                        if (TravelerInfos.CheckinInfos != [] && TravelerInfos.CheckinInfos != null) {
                                                            if (TravelerInfos.CheckinInfos[0].Status == "Checkedin" || TravelerInfos.CheckinInfos[0].Status == "CheckedinStandby" || TravelerInfos.CheckinInfos[0].Status == "CheckedinNonRevSpaceAvailable") {
                                                                objPaxTemplate.CheckinStatus = true

                                                            }
                                                            if (TravelerInfos.CheckinInfos[0].Status == "CheckedinStandby" || TravelerInfos.CheckinInfos[0].Status == "CheckedinNonRevSpaceAvailable") {
                                                                objPaxTemplate.OnStandby = true;
                                                                objPaxTemplate.BoardingPriority = TravelerInfos.CheckinInfos[0].BoardingPriority
                                                            }
                                                        }
                                                        if (TravelerInfos.ShortPassDesc == "Child") {
                                                            objPaxTemplate.SeatNumber = ((TravelerInfos.Seats != null) && (TravelerInfos.Seats[0].SeatNumber != null)) ? TravelerInfos.Seats[0].SeatNumber : "Auto";

                                                        }
                                                        objPaxTemplate.PassengerRefNumber = TravelerInfos.PassengerRefNumber;
                                                    }


                                                    if ((objPaxTemplate.RPH == TravelerInfos.PassengerRPH && TravelerInfos.SegmentRPH == objFlightWithPax.SegmentRPH)) {
                                                        objPaxTemplate.SeatNumber = ((TravelerInfos.Seats != null) && (TravelerInfos.Seats[0].SeatNumber != null)) ? TravelerInfos.Seats[0].SeatNumber : "Auto";
                                                        objPaxTemplate.Seats = TravelerInfos.Seats

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
                                                            TravelerInfos.Services.forEach((Service, index) => {
                                                                if (objPaxTemplate.SSR.filter(m => m.toString() == Service.Code).length == 0) {
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
                                                                } else if (TravelerInfos.CheckinInfos[0].PassengerAdditionalInfo.IsFlightDeckJumpSeatIndicator) {
                                                                    objPaxTemplate.SeatNumber = "FDJ";

                                                                }
                                                            } else if (objPaxTemplate.SeatNumber == "Auto") {

                                                                objPaxTemplate.SeatNumber = "SBY";
                                                            }
                                                            objPaxTemplate.Seats.forEach((seat, index) => {
                                                                if ((seat.SeatNumber == null || seat.SeatNumber == "Auto") && (TravelerInfos.CheckinInfos[0].PassengerAdditionalInfo.IsCabinJumpSeatIndicator || TravelerInfos.CheckinInfos[0].PassengerAdditionalInfo.IsFlightDeckJumpSeatIndicator)) {
                                                                    if (TravelerInfos.CheckinInfos[0].PassengerAdditionalInfo.IsCabinJumpSeatIndicator) {
                                                                        seat.SeatNumber = "CBJ";
                                                                    } else if (TravelerInfos.CheckinInfos[0].PassengerAdditionalInfo.IsFlightDeckJumpSeatIndicator) {
                                                                        seat.SeatNumber = "FDJ";
                                                                    }
                                                                } else if (seat.SeatNumber == null || seat.SeatNumber == "Auto") {
                                                                    seat.SeatNumber = "SBY";
                                                                }
                                                            })
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
                                                if (etktNumber != "" && element.PrimaryTickets.filter(m => m.PrimaryTicketNumber == etktNumber).length > 0) {

                                                    if (element.PrimaryTickets.filter(m => m.PrimaryTicketNumber == etktNumber)[0].Tickets != null && element.PrimaryTickets.filter(m => m.PrimaryTicketNumber == etktNumber)[0].Tickets.length > 0) {
                                                        if (element.PrimaryTickets.filter(m => m.PrimaryTicketNumber == etktNumber)[0].Tickets[0].TicketCoupons != null && element.PrimaryTickets.filter(m => m.PrimaryTicketNumber == etktNumber)[0].Tickets[0].TicketCoupons.length > 0) {
                                                            if (element.PrimaryTickets.filter(m => m.PrimaryTicketNumber == etktNumber)[0].Tickets[0].TicketCoupons.filter(m => m.SegmentNumber == SegElement.RPH).length > 0) {
                                                                let TicketCoupon = element.PrimaryTickets.filter(m => m.PrimaryTicketNumber == etktNumber)[0].Tickets[0].TicketCoupons.filter(m => m.SegmentNumber == SegElement.RPH && m.Origin == SegElement.Origin.AirportCode)[0];
                                                                if (TicketCoupon) {
                                                                    if ((SegElement.MarketingFlight.substr(0, 2) != "CM" || (SegElement.OperatingFlight != null && SegElement.OperatingFlight.substr(0, 2) != "CM")) || TicketCoupon.CouponStatusText == "Open" || TicketCoupon.CouponStatusText == "ADJUSTED" || TicketCoupon.CouponStatusText == "CHECKED-IN" || TicketCoupon.CouponStatusText == "LIFTED" || TicketCoupon.CouponStatusText == "BOARDED") {

                                                                    } else {
                                                                        ValidETKTStatus = false
                                                                        Toast.makeText("Etkt status of the segment are not allowed to checkin").show();
                                                                    }
                                                                } else {
                                                                    ValidETKTStatus = false
                                                                    Toast.makeText("Etkt status of the segment are not allowed to checkin").show();
                                                                }

                                                            }

                                                        }

                                                    }
                                                } else {
                                                    if (element.PrimaryTickets[0].Tickets != null && element.PrimaryTickets[0].Tickets.length > 0) {
                                                        if (element.PrimaryTickets[0].Tickets[0].TicketCoupons != null && element.PrimaryTickets[0].Tickets[0].TicketCoupons.length > 0) {
                                                            if (element.PrimaryTickets[0].Tickets[0].TicketCoupons.filter(m => m.SegmentNumber == SegElement.RPH).length > 0) {
                                                                let TicketCoupon = element.PrimaryTickets[0].Tickets[0].TicketCoupons.filter(m => m.SegmentNumber == SegElement.RPH && m.Origin == SegElement.Origin.AirportCode)[0];
                                                                if (TicketCoupon) {
                                                                    if ((SegElement.MarketingFlight.substr(0, 2) != "CM" || (SegElement.OperatingFlight != null && SegElement.OperatingFlight.substr(0, 2) != "CM")) || TicketCoupon.CouponStatusText == "Open" || TicketCoupon.CouponStatusText == "ADJUSTED" || TicketCoupon.CouponStatusText == "CHECKED-IN" || TicketCoupon.CouponStatusText == "LIFTED" || TicketCoupon.CouponStatusText == "BOARDED") {

                                                                    } else {
                                                                        ValidETKTStatus = false
                                                                        Toast.makeText("Etkt status of the segment are not allowed to checkin").show();
                                                                    }
                                                                } else {
                                                                    ValidETKTStatus = false
                                                                    Toast.makeText("Etkt status of the segment are not allowed to checkin").show();
                                                                }



                                                            }

                                                        }

                                                    }
                                                }

                                            }


                                            objFlightWithPax.Passenger.push(objPaxTemplate);
                                            console.dir(objFlightWithPax.Passenger)
                                            console.log('objFlightWithPax.Passenger')
                                        });
                                        //  obj.Segment.push(Obj1);
                                        if (ValidETKTStatus) {
                                            obj.Segment.push(objFlightWithPax);
                                        }
                                        // console.dir(obj);
                                        console.log('Inside covert to flight with pax');
                                        // console.log(objFlightWithPax.MarketingFlight);
                                    } else {
                                        isAnyFlightNotOpen = false;
                                    }
                                } else {
                                    OriginPosMatch = false;
                                }
                            }
                        }

                    }
                });

                obj.Segment.forEach((item, index) => {
                    let passengerIndex: number = 0;
                    response.SegmentTravelerInfos.forEach((TravelerInfos, SegIndex) => {
                        if (item.RPH == TravelerInfos.SegmentRPH) {
                            obj.Segment[index].Passenger[passengerIndex].SecurityCode = TravelerInfos.SecurityCode;
                            obj.Segment[index].Passenger[passengerIndex].SecurityCodeDesc = TravelerInfos.SecurityCodeDesc;
                            scTable.forEach(element => {
                                if (element.Key == TravelerInfos.SecurityCode) {
                                    obj.Segment[index].Passenger[passengerIndex].SecurityValue = element.Value;
                                }
                            });
                            passengerIndex++;
                        }
                    });
                })
                // Passenger Details
                let AssociatedInfantRPH: string = null;
                obj.Segment.forEach((segment, segIndex) => {
                    segment.Passenger.forEach((passenger, index) => {
                        if (passenger.CheckinStatus && passenger.AssociatedInfantRPH != null) {
                            AssociatedInfantRPH = passenger.AssociatedInfantRPH
                        }
                        else if (!passenger.CheckinStatus && passenger.AssociatedInfantRPH != null) {
                            AssociatedInfantRPH = passenger.AssociatedInfantRPH
                            AssociatedInfantRPH = "false";
                        }
                        if (AssociatedInfantRPH == passenger.RPH) {
                            if (segment.IsInternational) {
                                if (passenger.ApisDocoStatus == "Complete") {
                                    obj.Segment[segIndex].Passenger[index].CheckinStatus = true;
                                }
                                else {
                                    obj.Segment[segIndex].Passenger[index].CheckinStatus = false;
                                }
                            }
                            else {
                                obj.Segment[segIndex].Passenger[index].CheckinStatus = true;
                            }
                            AssociatedInfantRPH = null;
                        }
                        else if (AssociatedInfantRPH == "false") {
                            obj.Segment[segIndex].Passenger[index].CheckinStatus = false;
                            AssociatedInfantRPH = null;
                        }
                    });

                });



            }
            // }
            obj.Warning = response.Warnings;
            console.dir(obj);
            return obj;

        }
        catch (error) {
            console.log(error.message);
            // alert(error.message);
            return null;
        }
    }

    public static ConvertToPassengerTemplate(response: appmodel.Order.RootObject, allStatus: any): Array<appinterface.PaxTemplate> {
        try {
            var sDate = new Date();
            console.log('Convert Passenger Template --------------- Start Date Time : ' + sDate);
            Converters.PassengerArray = [new appinterface.PaxTemplate];
            Converters.PassengerArray.length = 0;
            var temp: appinterface.FlightInfo = null;
            if (response.Passengers != null) {
                response.Passengers.forEach((element, index) => {
                    if (response.ID != null) {
                        // console.dir(element);
                        let obj = new appinterface.PaxTemplate();
                        let count: boolean;
                        count = true;
                        obj.OrderID = response.ID;
                        obj.FirstName = element.Firstname;
                        obj.LastName = element.Lastname;
                        obj.FullName = element.Fullname;
                        obj.PassengerType = element.PassengerTypeCodeDesc;
                        if (element.PassengerTypeCodeDesc != null && element.PassengerTypeCodeDesc != "") {
                            obj.INFwithoutSeat = element.PassengerTypeCodeDesc == "Infant without seat" ? true : false;

                        }
                        if ((element.SSRs != null) && (element.SSRs.length > 0)) {
                            element.SSRs.forEach((SSRElement, SSRIndex) => {
                                //   obj.SSR = obj.SSR + SSRElement.Code + " "; 
                                obj.SSR = SSRElement.Code;
                            });
                        }
                        if ((element.EMDs != null) && (element.EMDs.length > 0)) {
                            element.EMDs.forEach((EMDElement, EMDIndex) => {
                                //  obj.EMD = obj.EMD + EMDElement.DocumentNumber + " ";
                                obj.EMD = EMDElement.Code;
                            });
                        }
                        obj.IsSecurityDocsComplete = (element.ApisDocoStatus.toString().toUpperCase() == "COMPLETE");
                        obj.ApisDocoStatus = element.ApisDocoStatus;
                        obj.TierLevel = "";  // not mapped
                        obj.RPH = element.RPH;
                        obj.SurnameRefNumber = element.SurnameRefNumber;
                        obj.PassengerTypeCode = element.PassengerTypeCode;
                        obj.Selected = element.Selected;
                        //obj.BagCount = 0;
                        obj.BagCount = element.CheckInBagCountTotal != 0 ? element.CheckInBagCountTotal : 0;
                        if ((element.FqtTravelers != null) && (element.FqtTravelers.length > 0)) {
                            element.FqtTravelers.forEach((FQTV, FQTVIndex) => {
                                obj.FQTVNumber = FQTV.MembershipID;
                                obj.ProgramIDxx = FQTV.ProgramID;
                            });
                        }
                        obj.DateOfBirth = element.DateOfBirth;
                        element.PhoneNumbers.forEach((PhoneInfo, PhoneIndex) => {
                            let phoneNumbers = new appinterface.PhoneNumber();
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
                            obj.PhoneNumbers.push(phoneNumbers);
                        });
                        if ((response.Segments != null) && (response.Segments.length > 0)) {
                            response.Segments.forEach((SegElement, SegIndex) => {

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
                                    obj.CheckinStatus = false;
                                    obj.SeatNumber = "Auto";
                                    obj.BagCount = 0;

                                    if ((response.SegmentTravelerInfos != null) && (response.SegmentTravelerInfos.length > 0)) {
                                        response.SegmentTravelerInfos.forEach((TravelerInfos, SegIndex) => {
                                            if (TravelerInfos.Services != null) {
                                                if ((obj.RPH == TravelerInfos.Services[0].PassengerRPH && TravelerInfos.SegmentRPH == temp.SegmentRPH)) {
                                                    obj.serviceText = TravelerInfos.Services[0].Text;
                                                    if (TravelerInfos.ShortPassDesc == "Infant with seat") {
                                                        obj.SeatNumber = ((TravelerInfos.Seats != null) && (TravelerInfos.Seats[0].SeatNumber != null)) ? TravelerInfos.Seats[0].SeatNumber : "Auto";
                                                    }
                                                    else if (TravelerInfos.ShortPassDesc == "Infant without seat") {
                                                        obj.SeatNumber = "";
                                                    }
                                                }
                                            }
                                            if ((obj.RPH == TravelerInfos.PassengerRPH && TravelerInfos.SegmentRPH == temp.SegmentRPH)) {
                                                obj.CheckinStatus = (TravelerInfos.CheckinInfos != null && TravelerInfos.CheckinInfos[0].Status.trim() == "Checkedin") ? true : false;
                                                if (TravelerInfos.ShortPassDesc == "Child") {
                                                    obj.SeatNumber = ((TravelerInfos.Seats != null) && (TravelerInfos.Seats[0].SeatNumber != null)) ? TravelerInfos.Seats[0].SeatNumber : "Auto";
                                                }
                                            }

                                            if ((obj.RPH == TravelerInfos.PassengerRPH && TravelerInfos.SegmentRPH == temp.SegmentRPH)) {

                                                if (TravelerInfos.ShortPassDesc == "") {
                                                    obj.SeatNumber = ((TravelerInfos.Seats != null) && (TravelerInfos.Seats[0].SeatNumber != null)) ? TravelerInfos.Seats[0].SeatNumber : "Auto";
                                                }
                                                if (TravelerInfos.BaggageInfo != null) {
                                                    obj.BagCount = TravelerInfos.BaggageInfo.CheckedBagCountTotal != null ? TravelerInfos.BaggageInfo.CheckedBagCountTotal : 0;
                                                    obj.BaggageInfo = TravelerInfos.BaggageInfo;
                                                    console.log("inside con" + TravelerInfos.BaggageInfo.CheckedBagCountTotal);

                                                }
                                                else {
                                                    obj.BagCount = 0;
                                                }
                                                if (TravelerInfos.Services != null) {
                                                    TravelerInfos.Services.forEach((Service, index) => {
                                                        //obj.SSR = Service.Code;
                                                        obj.SSR.push(Service.Code);
                                                        // if (obj.SSR != "") {
                                                        //     obj.SSR = obj.SSR + "," + Service.Code;

                                                        // }
                                                        // else {
                                                        //     obj.SSR = Service.Code;


                                                        // }


                                                    });

                                                }

                                            }

                                        }

                                        );

                                    }
                                    obj.FlightDetails.push(temp);

                                }
                            });
                        }
                        Converters.PassengerArray.push(obj);

                    }
                });
            }
            // console.log(this.PassengerArray[0].FirstName);
            // console.log(this.PassengerArray[0].FullName);
            var eDate = new Date();
            console.log('Convert Passenger Template --------------- End Date Time : ' + eDate);
            console.log('Convert Passenger Template Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
            console.dir(Converters.PassengerArray);
            return Converters.PassengerArray;

        }
        catch (error) {
            console.log(error.message);
        }
    }

    public static ConvertToDepartureTemplate(response: appmodel.Departures.RootObject, destination: string, gatenumber: string, args: string): Array<appinterface.DepartureInfo1.Departure> {
        try {
            var sDate = new Date();
            console.log('Convert Departure Template --------------- Start Date Time : ' + sDate);
            console.log("Inside convert function For Departures" + JSON.stringify(response));
            Converters.CompleteDepartureArray.length = 0;
            if (response.AirportDepartures != null) {
                response.AirportDepartures.forEach((element, index) => {
                    let obj = new appinterface.DepartureInfo1.Departure();
                    obj.FlightStatus = response.AirportDepartures[index].FlightStatus;
                    obj.CheckinStatus = response.AirportDepartures[index].CheckInStatus;
                    obj.Destination = response.AirportDepartures[index].Destination;
                    obj.Gate = response.AirportDepartures[index].Gate;
                    obj.FlightNumber = "CM" + response.AirportDepartures[index].FlightNumber;
                    obj.DestinationAirport = response.AirportDepartures[index].DestinationAirport;
                    switch (obj.FlightStatus) {
                        case "ONTIME": obj.Color = "#00A973";
                            break;
                        case "BOARDING": obj.Color = "#00A973";
                            break;
                        case "CLOSED": obj.Color = "#666666";
                            break;
                        case "DIVERTED": obj.Color = "#666666";
                            break;
                        case "CANCELLED": obj.Color = "#D7410B";
                            break;
                        case "DELAYED": obj.Color = "#D7410B";
                            break;
                        default: obj.Color = "#00008B";
                    }
                    obj.STD = response.AirportDepartures[index].ScheduledDepartureDate.toString().substr(11, 5);

                    obj.ETD = response.AirportDepartures[index].ExpectedDepartureDate.toString().substr(11, 5);
                    obj.Date = moment(response.AirportDepartures[index].ExpectedDepartureDate).format("YYYY-MM-DD");
                    console.log("Date" + obj.Date);

                    obj.STA = response.AirportDepartures[index].ScheduledArrivalDate.toString().substr(11, 5);
                    element.configurations.forEach((configelement, configindex) => {
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
                    console.log(this.CompleteDepartureArray)
                    this.DepartureArray = this.CompleteDepartureArray.filter(r => r.Destination.toLowerCase() == destination.toLowerCase() || r.DestinationAirport.toLowerCase() == destination.toLowerCase());
                    console.log(this.DepartureArray)
                }
            } else {
                if (gatenumber.trim() == "") {
                    this.DepartureArray = this.DepartureArray;
                }
                else {
                    this.DepartureArray = this.DepartureArray.filter(r => r.Gate.toLowerCase() == gatenumber.toLowerCase());
                }
            }

            // if (this.DepartureArray.length > 12) {
            //     this.DepartureArray = this.DepartureArray.slice(0, 12);


            // }
            var eDate = new Date();
            console.log('Convert Departure Template --------------- End Date Time : ' + eDate);
            console.log('Convert Departure Template Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
            return Converters.DepartureArray;

        }
        catch (error) {
            console.log(error.message);
        }
    }

    public static ConvertToDepartureTemplateforStatus(response: appmodel.Departures.RootObject): Array<appinterface.DepartureInfo> {

        try {
            var sDate = new Date();
            console.log('Convert Departure Template Status --------------- Start Date Time : ' + sDate);
            console.log('Inside convert function For Departures');
            Converters.DepartureArrayforFQTV.length = 0;
            response.AirportDepartures.forEach((element, index) => {
                let obj = new appinterface.DepartureInfo();
                obj.FlightStatus = response.AirportDepartures[index].FlightStatus;
                obj.CheckinStatus = response.AirportDepartures[index].CheckInStatus;
                Converters.DepartureArrayforFQTV.push(obj);
            });
            var eDate = new Date();
            console.log('Convert Departure Template Status --------------- End Date Time : ' + eDate);
            console.log('Convert Departure Template Status Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
            return Converters.DepartureArrayforFQTV;
        }
        catch (error) {
            console.log(error.message);
        }
    }

    public static ConvertToPassengerListTemplate(response: appmodel.Order.RootObject): Array<appinterface.PassengerListTemplate> {
        try {
            var sDate = new Date();
            console.log('ConvertToPassengerListTemplate --------------- Start Date Time : ' + sDate);
            console.log('Inside convert function');
            Converters.PassengerList.length = 0;
            if (response.Passengers != null) {
                response.Passengers.forEach((element, index) => {
                    let obj = new appinterface.PassengerListTemplate();
                    obj.OrderID = response.ID;
                    obj.FullName = element.Fullname;
                    obj.SSR = element.SSRs.toString();
                    response.Segments.forEach((SegElement, SegIndex) => {
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
            console.log('ConvertToPassengerListTemplate Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
            return Converters.PassengerList;
        }
        catch (error) {
            console.log(error.message);
        }
    }

    public static ConvertToPassList(response: appmodel.Order.RootObject): Array<appinterface.PassengerList> {

        try {
            var sDate = new Date();
            console.log('ConvertToPassList --------------- Start Date Time : ' + sDate);
            console.log('Inside convert function');
            Converters.PassengerNewList.length = 0;
            response.Passengers.forEach((element, index) => {
                let obj = new appinterface.PassengerList();
                obj.OrderID = response.ID;
                obj.FullName = element.Fullname;
                obj.SSR = element.SSRs.toString();
                response.Segments.forEach((SegElement, SegIndex) => {
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
            console.log('ConvertToPassList Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
            return Converters.PassengerNewList;
        }
        catch (error) {
            console.log(error.message);
        }
    }

    public static ConvertToPaxByFlightTemplate(response: appmodel.Order.PassengerDetailList): Array<appinterface.PassengerListTemplate> {
        try {
            var sDate = new Date();
            console.log('ConvertToPaxByFlightTemplate --------------- Start Date Time : ' + sDate);
            console.log('Inside convert function');
            Converters.PassengerList.length = 0;
            response.PassengerList.forEach((element, index) => {
                console.log('Inside convert function');
                let obj = new appinterface.PassengerListTemplate();
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
            console.log('ConvertToPaxByFlightTemplate Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
            return Converters.PassengerList;
        }
        catch (error) {
            console.log(error.message);
        }
    }

    public static ConvertToPaxByFlightTemplateNew(response: appmodel.Order.PassengerDetailList): Array<appinterface.PassengerList> {
        try {
            var sDate = new Date();
            console.log('ConvertToPaxByFlightTemplateNew --------------- Start Date Time : ' + sDate);
            console.log('Inside convert function');
            Converters.PassengerNewList.length = 0;
            //obj.OrderID = response.ID;
            console.log(response.PassengerList.length);
            if (response != null) {
                response.PassengerList.forEach((element, index) => {

                    let obj = new appinterface.PassengerList();
                    obj.OrderID = element.OrderId;
                    if (element.GivenName != null) {
                        obj.FullName = element.Surname + " / " + element.GivenName;
                    } else {
                        obj.FullName = element.Surname;
                    }
                    obj.FirstName = element.GivenName;
                    obj.LastName = element.Surname;
                    obj.InfantIndicator = element.InfantIndicator;
                    obj.PassengerType = element.PassengerType;
                    if (element.PassengerCharacteristics != null) {
                        element.PassengerCharacteristics.forEach((element, index) => {
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

                        element.PassengerCharacteristics.forEach((element, index) => {

                            if (element == "TicketOutOfSync") {

                                obj.SyncTicket = true;



                            }

                        });

                    }
                    if (element.PassengerCharacteristics != null) {

                        element.PassengerCharacteristics.forEach((element, index) => {

                            if (element == "OnStandby") {

                                obj.OnStandby = true;

                            }

                        });

                    }


                    if (element.FqtTravelers != null) {
                        if (element.FqtTravelers[0].TierLevel != null && element.FqtTravelers[0].TierLevel.Name != "") {
                            obj.TierLevel = element.FqtTravelers[0].TierLevel.Name;
                        } else {
                            obj.TierLevel = element.FqtTravelers[0].AllianceTierLevel.Name;

                        }
                    }

                    if (element.BoardingPriority != null) {
                        obj.BoardPriority = element.BoardingPriority;
                    }
                    //obj.AssociatedAdultRPH=element.
                    if ((element.SSRs != null) && (element.SSRs.length > 0)) {

                        element.SSRs.forEach((SSRElement, SSRIndex) => {
                            if (SSRElement == "INFT") {
                                if ((element.SpecialServiceRequest != null) && (element.SpecialServiceRequest.length > 0)) {
                                    element.SpecialServiceRequest.forEach((ServiceRequest, SSRIndex) => {
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
                        element.PassengerCharacteristics.forEach((element, index) => {
                            if (element == "APISCompleted") {
                                obj.IsSecurityDocsComplete = true;

                            }
                        });
                    }
                    if (element.Status != null) {

                        if (element.Status == "Checkedin" || element.Status == "CheckedinStandby" || element.Status == "CheckedinNonRevSpaceAvailable") {

                            obj.CheckinStatus = true

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
            console.log('ConvertToPaxByFlightTemplateNew Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
            return Converters.PassengerNewList;
        }
        catch (error) {
            console.log(error.message);
        }
    }

    public static ConvertToPaxByFlightforDepartureTemplate(response: appmodel.FlightPassengerList.RootObject, checkind: number, location: string): Array<appinterface.DeparturePaxList> {

        try {
            var sDate = new Date();
            console.log('ConvertToPaxByFlightforDepartureTemplate --------------- Start Date Time : ' + sDate);
            console.log('Inside convert function');
            Converters.PaxListDepartures.length = 0;
            Converters.PaxListDeparturesNC.length = 0;
            if (response != null) {
                response.PassengerList.forEach((element, index) => {

                    let obj = new appinterface.DeparturePaxList();
                    obj.OrderId = element.OrderId;
                    console.log(element.OrderId);
                    // obj.FullName = element.Surname + " / " + element.GivenName;
                    if (element.GivenName != null) {
                        obj.FullName = element.Surname + " / " + element.GivenName;
                        obj.GivenName = element.GivenName;
                    } else {
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
                        } else {
                            obj.TierLevel = element.FqtTravelers[0].AllianceTierLevel.Name;

                        }
                    }

                    if (element.PassengerCharacteristics != null) {

                        element.PassengerCharacteristics.forEach((element, index) => {

                            if (element == "OnStandby") {

                                obj.OnStandby = true;

                            }

                        });

                    }
                    if (element.PassengerCharacteristics != null) {
                        element.PassengerCharacteristics.forEach((element, index) => {
                            if (element == "Oversold") {
                                obj.Oversold = true;
                            }
                        });
                    }
                    if (element.PassengerCharacteristics != null) {
                        element.PassengerCharacteristics.forEach((element, index) => {
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
                            obj.SeatNumber = element.SeatList[0].SeatNumber
                        }
                    }
                    else {
                        obj.SeatNumber = null;
                    }
                    if ((element.SSRs != null) && (element.SSRs.length > 0)) {
                        element.SSRs.forEach((SSRElement, SSRIndex) => {
                            if (SSRElement == "INFT") {
                                obj.SSRcount = SSRElement;
                                if ((element.SpecialServiceRequest != null) && (element.SpecialServiceRequest.length > 0)) {
                                    element.SpecialServiceRequest.forEach((ServiceRequest, SSRIndex) => {
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

                            obj.CheckinStatus = true

                        }

                    }
                    //obj.CheckinStatus = element.Status == "Checkedin" ? true : false
                    if (element.PassengerCharacteristics != null) {
                        element.PassengerCharacteristics.forEach((element, index) => {
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
            console.log('ConvertToPaxByFlightforDepartureTemplate Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
            return Converters.PaxListDeparturesNC;
        }
        catch (error) {
            console.log(error.message);
        }
    }

    public static ConvertToFQTVTemplate(response: appmodel.FQTV.RootObject): Array<appinterface.FQTVInfo> {
        try {
            var sDate = new Date();
            console.log('ConvertToFQTVTemplate --------------- Start Date Time : ' + sDate);
            Converters.FQTVList.length = 0;
            var temp: appinterface.FlightInfo = null;
            var POSLocation = ApplicationSettings.getString("userdetails", "").substr(0, 3);
            if (response != null) {
                response.OrderFQTVStatus.forEach((element, index) => {
                    if (element.Origin != null && element.Origin == POSLocation) {
                        let obj = new appinterface.FQTVInfo();
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
            console.log('ConvertToFQTVTemplate Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
            return Converters.FQTVList;
        }
        catch (error) {
            console.log(error.message);
        }
    }

    public static ConvertToInventory(response: any): Array<appinterface.MultiSegmentTemplate.inven> {
        try {
            //console.log("inside ConvertToInventory");

            // var obj = new MultiSegmentTemplate.inven();
            var obj = new Array<appinterface.MultiSegmentTemplate.inven>();
            if (response.DisplayBookinCount[0] != null) {
                response.DisplayBookinCount.forEach((invEle, invIndex) => {
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
    }

    public static ConvertToInBound(response: any): number {
        try {
            console.log("inside ConvertToInventory");
            var obj = new appinterface.InBound.Inbou();
            var inboundCount = 0;
            if (response != null) {
                if (response.InboundFlights != null) {
                    response.InboundFlights.forEach((element, Index) => {
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
    }

    public static ConvertToFQTV(response: appmodel.FqtvPrograms.RootObject): Array<appinterface.FqtvClassPrograms> {
        try {
            let obj = new appinterface.MultiSegmentTemplate.Passenger();
            obj.FqtvPrograms = new Array<appinterface.MultiSegmentTemplate.FqtvClassPrograms>();
            if (response != null) {
                if (response.ReferenceInfo != null) {
                    response.ReferenceInfo[0].FqtvPrograms.forEach((element, index) => {
                        let obj1 = new appinterface.MultiSegmentTemplate.FqtvClassPrograms();
                        obj1.ProgramID = element.Value.ProgramID;
                        obj1.ProgramName = element.Value.ProgramID + "/" + element.Value.Carrier;
                        // console.log("before push fqtv");
                        obj.FqtvPrograms.push(obj1);
                        //console.log(obj1.ProgramID);
                        //console.log(obj1.ProgramName);
                    });
                }
            } else {
                let obj1 = new appinterface.MultiSegmentTemplate.FqtvClassPrograms();
                obj1.ProgramID = "";
                obj1.ProgramName = "";
                obj.FqtvPrograms.push(obj1);
            }
            return obj.FqtvPrograms;
        }
        catch (ex) {
            console.log(ex.message);
        }
    }

    public static ConvertToCheckInPostTemplate(response: appinterface.MultiSegmentTemplate.FlightWithPax[], id, SelectedPassenger: appinterface.PassengerCheckin.SelectedPassenger[], segmentList: appinterface.MultiSegmentTemplate.FlightWithPax, checkintype: any, ShortCheckAirportCode: string, CheckedBags: Array<appinterface.Bagtag.PassengerList>): appinterface.CheckInPostTemplate.RootObject {
        try {
            var sDate = new Date();
            console.log('ConvertToCheckInPostTemplate --------------- Start Date Time : ' + sDate);
            var postTemp: appinterface.MultiSegmentTemplate.RootObject = new appinterface.MultiSegmentTemplate.RootObject();
            console.log("Inside convert to checkin template");
            console.log(response.length);
            var temprph: string = "0";
            let obj = new appinterface.CheckInPostTemplate.RootObject();
            if (id == "CheckIn") {
                if (checkintype == "Waitlist") {
                    //  obj.CheckInType = "CheckIn";
                    obj.CheckInType = "Waitlist";
                } else if(checkintype == "UpdatePassengerInfo"){
                    obj.CheckInType = "UpdatePassengerInfo";
                    obj.IsFQTVUpdate = true;
                }else{
                    obj.CheckInType = "CheckIn";
                }
            }
            else {
                obj.CheckInType = "ChangeSeat";
            }

            obj.PassengerList = new Array<appinterface.CheckInPostTemplate.PassengerList>();
            obj.SegmentList = Array<appinterface.CheckInPostTemplate.SegmentList>();
            obj.IsInterlineCheckin = false;
            if (SelectedPassenger.length > 0) {
                SelectedPassenger.forEach((elements, index) => {
                    var responseData = segmentList.Passenger.filter(m => m.FirstName == elements.FirstName && m.LastName == elements.LastName)[0];
                    let tempPassengerList = new appinterface.CheckInPostTemplate.PassengerList();
                    if (responseData.PassengerTypeCode != "INF") {
                        tempPassengerList.GivenName = responseData.FirstName;
                        tempPassengerList.Surname = responseData.LastName;
                        tempPassengerList.SurnameRefNumber = responseData.SurnameRefNumber;
                        tempPassengerList.SurnameRefNumberCount = responseData.SurnameRefNumberCount;
                        if (responseData.PassengerTypeCode != "INS") {
                            tempPassengerList.PassengerTypeCode = responseData.PassengerTypeCode;
                        } else {
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
                        tempPassengerList.Age = responseData.Age
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
                        if (CheckedBags != null && CheckedBags.length > 0 && CheckedBags.filter(m => m.RPH == responseData.RPH).length > 0) {
                            tempPassengerList.CheckedBags = CheckedBags.filter(m => m.RPH == responseData.RPH)[0].CheckedBags;
                            obj.Source = "TAB";
                            let baggage = CheckedBags.filter(m => m.RPH == responseData.RPH)[0].CheckedBags;
                            baggage[0].BaggageInfo.BagTagDetails.forEach((element, index) => {
                                element.ShortCheckAirportCode = responseData.ShortCheckAirportCode;
                            })
                            if (CheckedBags.filter(m => m.RPH == responseData.RPH)[0].isManualBag) {
                                obj.isManualBag = true;
                            } else {
                                obj.isManualBag = false;
                            }
                            if (ApplicationSettings.getBoolean("isHostBagtag")) {
                                obj.BoardingPassDeliveryDetail = [];
                                let BoardingPrint = new appinterface.BagTagPrint.BoardingPassDeliveryDetail();
                                var office = ApplicationSettings.getString("hostBagtagOffice", "");
                                var Worksatation = ApplicationSettings.getString("hostBagtagWS", "");
                                var DeviceName = ApplicationSettings.getString("bagtagDeviceName", "");
                                var DeviceType = ApplicationSettings.getString("BTdeviceType", "");
                                var PectabVersion = ApplicationSettings.getString("bagtagpectabVersion", "");
                                obj.BluetoothBagTag = false;
                                BoardingPrint.Email = null;
                                BoardingPrint.Gateway = "WS";
                                BoardingPrint.PrinterAddress = "MyPrinter123";
                                BoardingPrint.Printer = new appinterface.BoardingPass.Printer();
                                BoardingPrint.Printer.DeviceName = DeviceName;
                                BoardingPrint.Printer.ClientCode = "CM";
                                BoardingPrint.Printer.OfficeName = office;
                                BoardingPrint.Printer.PectabVersion = PectabVersion;
                                BoardingPrint.Printer.WorkstationName = Worksatation;
                                BoardingPrint.Printer.DeviceType = DeviceType
                                // bagTagDetail.DeliveryDetail = BoardingPrint;
                                obj.BoardingPassDeliveryDetail.push(BoardingPrint);
                            } else {
                                obj.BoardingPassDeliveryDetail = [];
                                let BoardingPrint = new appinterface.BagTagPrint.BoardingPassDeliveryDetail();
                                BoardingPrint.Printer = new appinterface.BoardingPass.Printer();
                                obj.BluetoothBagTag = true;
                                obj.BoardingPassDeliveryDetail.push(BoardingPrint);

                            }
                            console.log(CheckedBags);
                        }
                        if (CheckedBags != null && CheckedBags.length > 0 && CheckedBags.filter(m => m.RPH == responseData.RPH).length > 0) {
                            tempPassengerList.CheckinRePrint = false;
                            tempPassengerList.CheckInBagWeightTotal = CheckedBags.filter(m => m.RPH == responseData.RPH)[0].CheckedBags[0].BaggageInfo.CheckedBagWeightTotal;
                            tempPassengerList.CheckInBagCountTotal = CheckedBags.filter(m => m.RPH == responseData.RPH)[0].CheckedBags[0].BaggageInfo.CheckedBagCountTotal;
                        }

                        // tempPassengerList.CheckedBags
                        // tempPassengerList.Status  = ""
                        let tempFFPgm = new appinterface.CheckInPostTemplate.FqtTraveler();
                        tempFFPgm.MembershipID = responseData.FQTVNumber == "" ? null : responseData.FQTVNumber;
                        tempFFPgm.ProgramID = responseData.ProgramIDxx == "" ? null : responseData.ProgramIDxx;
                        if (responseData.FQTVNumber != null) {
                            tempPassengerList.FqtTravelers.push(tempFFPgm);
                        }
                        obj.PassengerList.push(tempPassengerList);

                        if (obj.SegmentList.length == 0) {
                            let tempSegmentList = new appinterface.CheckInPostTemplate.SegmentList();
                            tempSegmentList.RPH = segmentList.SegmentRPH;

                            tempSegmentList.OrderId = segmentList.Passenger[0].OrderID;
                            tempSegmentList.DepartureDateTime = segmentList.DepartureDateTime;
                            if (segmentList.MarketingFlight.substr(0, 2) == "CM") {
                                tempSegmentList.MarketingFlight = segmentList.MarketingFlight;
                            } else if (segmentList.OperatingFlight != null && segmentList.OperatingFlight.substr(0, 2) == "CM") {
                                tempSegmentList.MarketingFlight = segmentList.MarketingFlight;
                                tempSegmentList.OperatingFlight = segmentList.OperatingFlight;
                            } else {
                                tempSegmentList.MarketingFlight = segmentList.MarketingFlight;
                            }
                            tempSegmentList.Selected = true;
                            tempSegmentList.DepartureCity = segmentList.DepartureCity;
                            tempSegmentList.ArrivalCity = segmentList.Destination;
                            // obj.PassengerList.push(tempPassengerList);

                            obj.SegmentList.push(tempSegmentList);
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
            console.log(JSON.stringify(obj));


            var eDate = new Date();
            console.log('ConvertToCheckInPostTemplate --------------- End Date Time : ' + eDate);
            console.log('ConvertToCheckInPostTemplate Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
            return obj;
        }
        catch (error) {
            console.log(error.message);
        }
    }
    public static ConvertToWaitlistCheckInPostTemplate(response: appinterface.MultiSegmentTemplate.FlightWithPax[], id, SelectedPassenger: appinterface.PassengerCheckin.SelectedPassenger[], segmentList: appinterface.MultiSegmentTemplate.FlightWithPax, checkintype: any, ShortCheckAirportCode: string, CheckedBags: Array<appinterface.Bagtag.PassengerList>): appinterface.CheckInPostTemplate.WaitlistRootObject {
        try {
            var sDate = new Date();
            console.log('ConvertToCheckInPostTemplate --------------- Start Date Time : ' + sDate);
            var postTemp: appinterface.MultiSegmentTemplate.RootObject = new appinterface.MultiSegmentTemplate.RootObject();
            console.log("Inside convert to checkin template");
            console.log(response.length);
            var temprph: string = "0";
            let obj = new appinterface.CheckInPostTemplate.WaitlistRootObject();
            obj.CheckInType = "Waitlist";
            obj.PassengerList = new Array<appinterface.CheckInPostTemplate.WaitListPassenger>();
            obj.SegmentList = Array<appinterface.CheckInPostTemplate.SegmentList>();
            obj.BoardingPassDeliveryDetail = null;
            if (SelectedPassenger.length > 0) {
                SelectedPassenger.forEach((elements, index) => {
                    var responseData = segmentList.Passenger.filter(m => m.FirstName == elements.FirstName && m.LastName == elements.LastName)[0];
                    let tempPassengerList = new appinterface.CheckInPostTemplate.WaitListPassenger();
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
                        tempPassengerList.FOID = null
                        tempPassengerList.Firstname = responseData.FirstName;
                        tempPassengerList.Lastname = responseData.LastName;
                        tempPassengerList.Selected = true;
                        tempPassengerList.FreeBaggageCount = 2;
                        tempPassengerList.ApisStatus = responseData.ApisDocoStatus;
                        obj.PassengerList.push(tempPassengerList);
                        if (obj.SegmentList.length == 0) {
                            let tempSegmentList = new appinterface.CheckInPostTemplate.SegmentList();
                            tempSegmentList.RPH = segmentList.SegmentRPH;
                            tempSegmentList.OrderId = segmentList.Passenger[0].OrderID;
                            tempSegmentList.DepartureDateTime = segmentList.DepartureDateTime;
                            if (segmentList.MarketingFlight.substr(0, 2) == "CM") {
                                tempSegmentList.MarketingFlight = segmentList.MarketingFlight;
                            } else if (segmentList.OperatingFlight != null && segmentList.OperatingFlight.substr(0, 2) == "CM") {
                                tempSegmentList.MarketingFlight = segmentList.MarketingFlight;
                                tempSegmentList.OperatingFlight = segmentList.OperatingFlight;
                            } else {
                                tempSegmentList.MarketingFlight = segmentList.MarketingFlight;
                            }
                            tempSegmentList.Selected = true;
                            tempSegmentList.DepartureCity = segmentList.DepartureCity;
                            tempSegmentList.ArrivalCity = segmentList.Destination;
                            obj.SegmentList.push(tempSegmentList);
                        }

                    }
                });

            }
            else {
                Toast.makeText("Please select the passenger").show();
            }
            console.log("after checkintype original");
            console.log(JSON.stringify(obj));
            var eDate = new Date();
            console.log('ConvertToCheckInPostTemplate --------------- End Date Time : ' + eDate);
            console.log('ConvertToCheckInPostTemplate Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
            return obj;
        }
        catch (error) {
            console.log(error.message);
        }
    }

    public static UpgradeOrDowngradeChangesConvertor(response: appinterface.MultiSegmentTemplate.FlightWithPax[], SelectedPassenger: appinterface.PassengerCheckin.SelectedPassenger[], segmentList: appinterface.MultiSegmentTemplate.FlightWithPax, UpgrdaeResponse: appinterface.UpgradeInfoArray): appinterface.UpgradeInfo.RootObject {
        try {
            let UpgradeObj = new appinterface.UpgradeInfo.RootObject();
            UpgradeObj.CheckInType = "RequestUpgrade";

            var SegObj = new appinterface.UpgradeInfo.SegmentList();
            SegObj.DepartureCity = segmentList.DepartureCity;
            SegObj.DepartureDateTime = segmentList.DepartureDateTime;
            SegObj.MarketingFlight = segmentList.MarketingFlight;
            SegObj.RPH = segmentList.SegmentRPH;
            SegObj.Selected = true;

            UpgradeObj.SegmentList.push(SegObj);

            SelectedPassenger.forEach((PaxData, PaxIndex) => {
                var responseData = segmentList.Passenger.filter(m => m.FirstName == PaxData.FirstName && m.LastName == PaxData.LastName)[0];
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

                UpgradeObj.PassengerList.push(PaxObj);

            });
            var UpdowngradeObj = new appinterface.UpgradeInfo.UpgradeDowngradeInfo();
            UpdowngradeObj.IsVoluntary = UpgrdaeResponse.IsVoluntary;
            UpdowngradeObj.BookingClass = UpgrdaeResponse.BookingClass;
            UpdowngradeObj.ReasonCode = UpgrdaeResponse.ReasonCode;

            UpgradeObj.UpgradeDowngradeInfo = UpdowngradeObj;

            response.forEach((SegData, SegIndex) => {
                SelectedPassenger.forEach((PaxData, PaxIndex) => {
                    if (segmentList.SegmentRPH == SegData.SegmentRPH) {
                        var SegTravelObj = new appinterface.UpgradeInfo.SegmentTravelerInfo();
                        var responseData = SegData.Passenger.filter(m => m.FirstName == PaxData.FirstName && m.LastName == PaxData.LastName)[0];
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

                        UpgradeObj.SegmentTravelerInfo.push(SegTravelObj);
                    }

                });


            });
            console.dir(UpgradeObj);
            return UpgradeObj;
        } catch (error) {
            console.log(error.message);
        }
    }

    public static ConvertToPassengersDetail(response: appmodel.Order.RootObject, PassedPassengerDetail: any, CountryList: Array<string>, CountryItems: any[], ADCbyPass: any[]): appmodel.SecurityModel {
        try {
            var sDate = new Date();
            console.log('Convert Passenger Details --------------- Start Date Time : ' + sDate);
            Converters.SecurityDocs = new appmodel.SecurityModel();
            Converters.SecurityDocs = null;
            console.dir(response);
            //obj.OrderID = response.ID;
            let obj = new appmodel.SecurityModel();
            obj.ApisUpdateRequests = [new appmodel.ApisUpdateRequest];
            obj.ApisUpdateRequests[0].Addresses = [new appmodel.Address()];
            obj.ApisUpdateRequests[0].Addresses.length = 0;
            obj.ApisUpdateRequests[0].Documents = [new appmodel.Document()];
            obj.ApisUpdateRequests[0].Documents.length = 0;
            obj.DocumentTypeIndexList = [];
            obj.ApisUpdateRequests[0].ApisRequirements = [new appmodel.ApisRequirement()];
            obj.ApisUpdateRequests[0].ApisAddressRequirements = [];
            let sortTypeOrder: any[];
            let typeOrder: any[];
            obj.DocumentTypeList = [new appmodel.DocumentType()];
            obj.DocumentType = [];
            obj.DocumentTypeList.length = 0;
            obj.ADCByPassNameList = [];
            obj.ADCByPassList = [new appmodel.ADCByPass()];
            obj.ADCByPassList.length = 0;
            // obj.ADCByPassList.push({"Type":"0","TypeText":"DOUBLE NATIONALITY"});
            // obj.ADCByPassList.push({"Type":"1","TypeText":"PROCESSING RESIDENCY"});
            // obj.ADCByPassList.push({"Type":"2","TypeText":"VISA AT ARRIVAL"});
            // obj.ADCByPassList.push({"Type":"3","TypeText":"OTHER TRANSPORTATIONS"});
            // obj.ADCByPassList.push({"Type":"4","TypeText":"ADC DOWN"});
            // obj.ADCByPassList.push({"Type":"5","TypeText":"SPECIAL VISA"});
            // obj.ADCByPassList.push({"Type":"6","TypeText":"INMIGRATION PROBLEMS"});
            // obj.ADCByPassList.push({"Type":"7","TypeText":"TIMATIC UPDATE"});
            obj.ADCByPassList = ADCbyPass;
            obj.ADCByPassList.forEach((item, index) => {
                let byPassText: string;
                byPassText = item.Text;
                obj.ADCByPassNameList.push(byPassText);
            })
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

            obj.ApisUpdateRequests[0].Addresses.length = 0;
            if (response.Passengers != null) {

                response.Passengers.forEach((element, index) => {
                    console.dir(PassedPassengerDetail);
                    console.dir(response.Passengers[index]);
                    //if (response.Passengers[0].Documents.length > 0) {
                    if (PassedPassengerDetail.FirstName == element.Firstname && PassedPassengerDetail.LastName == element.Lastname && PassedPassengerDetail.RPH == element.RPH) {
                        let objDoc = new appmodel.Document();
                        let objAddr = new appmodel.Address();
                        obj.ApisDocoStatus = response.Passengers[0].ApisDocoStatus;
                        obj.ADCStatus = response.Passengers[0].AdcDecisionStatus;
                        if (PassedPassengerDetail.FirstName == element.Firstname && PassedPassengerDetail.LastName == element.Lastname) {
                            obj.ApisUpdateRequests[0].Firstname = element.Firstname;
                            obj.ApisUpdateRequests[0].Lastname = element.Lastname;
                            obj.ApisUpdateRequests[0].SurnameRefNumber = PassedPassengerDetail.SurnameRefNumber;
                            obj.ApisUpdateRequests[0].Prefix = element.Prefix;
                            obj.ApisUpdateRequests[0].RPH = PassedPassengerDetail.RPH;
                            obj.ApisUpdateRequests[0].Emails = element.Emails;
                            obj.ApisUpdateRequests[0].Gender = "0";
                            obj.ApisUpdateRequests[0].DateOfBirth = PassedPassengerDetail.DateOfBirth;
                            obj.ApisUpdateRequests[0].PassengerTypeCode = PassedPassengerDetail.PassengerTypeCode;
                            obj.ApisUpdateRequests[0].PhoneNumbers = element.PhoneNumbers;
                            obj.ApisUpdateRequests[0].Age = element.Age;
                            obj.ApisUpdateRequests[0].AssociatedAdultRPH = element.AssociatedAdultRPH;
                            obj.ApisUpdateRequests[0].AssociatedInfantRPH = element.AssociatedInfantRPH;
                            obj.ApisUpdateRequests[0].FqtTravelers = element.FqtTravelers;
                            obj.ApisUpdateRequests[0].Nationality = element.Nationality;
                            obj.ApisUpdateRequests[0].GivenName = element.Firstname;
                            obj.ApisUpdateRequests[0].Surname = element.Lastname;

                            if (response.Passengers[index].EmergencyDetails.length > 0) {
                                console.log(response.Passengers[index].EmergencyDetails[0].EmergencyContactName);
                                obj.ApisUpdateRequests[0].EmergencyDetails = [new appmodel.EmergencyDetail()];
                                obj.ApisUpdateRequests[0].OldEmergencyDetails = [new appmodel.OldEmergencyDetail()];
                                obj.ApisUpdateRequests[0].EmergencyDetails.length = 0;
                                obj.ApisUpdateRequests[0].OldEmergencyDetails.length = 0;
                                response.Passengers.forEach((passenger, index) => {
                                    if (PassedPassengerDetail.FirstName == passenger.Firstname && PassedPassengerDetail.LastName == passenger.Lastname) {
                                        passenger.EmergencyDetails.forEach((item, index) => {
                                            let emergency: EmergencyDetail = new EmergencyDetail();
                                            emergency.EmergencyContactName = item.EmergencyContactName;
                                            emergency.EmergencyPhone.Value = item.EmergencyPhone.Value;
                                            emergency.EmergencyRelationship = item.EmergencyRelationship;
                                            obj.ApisUpdateRequests[0].EmergencyDetails.push(emergency);
                                            obj.ApisUpdateRequests[0].OldEmergencyDetails.push(emergency);
                                            // obj.ApisUpdateRequests[0].EmergencyDetails[0].EmergencyPhone.Value = item.EmergencyPhone.Value;
                                            // obj.ApisUpdateRequests[0].EmergencyDetails[0].EmergencyRelationship = item.EmergencyRelationship;
                                        });
                                    }
                                });
                            }
                            else {
                                obj.ApisUpdateRequests[0].EmergencyDetails = [new appmodel.EmergencyDetail()];
                                obj.ApisUpdateRequests[0].EmergencyDetails[0].EmergencyContactName = "";
                                obj.ApisUpdateRequests[0].EmergencyDetails[0].EmergencyPhone.Value = "";
                                obj.ApisUpdateRequests[0].EmergencyDetails[0].EmergencyRelationship = "Tourist";
                            }
                            obj.ApisUpdateRequests[0].KnownTravelerNumber = element.KnownTravelerNumber;
                            obj.ApisUpdateRequests[0].RedressNumber = element.RedressNumber;
                            obj.ApisUpdateRequests[0].OldKnownTravelerNumber = element.KnownTravelerNumber;
                            obj.ApisUpdateRequests[0].OldRedressNumber = element.OldRedressNumber;
                            obj.ApisUpdateRequests[0].FOID = null;
                            obj.ApisUpdateRequests[0].OldNationality = null;
                            obj.ApisUpdateRequests[0].OldDateOfBirth = null;
                            obj.ApisUpdateRequests[0].OldGender = null;
                            obj.ApisUpdateRequests[0].OldFOID = null;
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
                            element.Documents.forEach((docElement, docindex) => {
                                console.dir(element);
                                console.dir(docElement);
                                console.dir(PassedPassengerDetail);
                                // if (docElement.Firstname != null) {
                                if (PassedPassengerDetail.FirstName == element.Firstname && PassedPassengerDetail.LastName == element.Lastname && PassedPassengerDetail.RPH == element.RPH) {
                                    let objDoc = new appmodel.Document();
                                    if (obj.ApisUpdateRequests[0].AssociatedAdultRPH != null) {
                                        let associatedDetails: any = response.Passengers.filter(m => m.RPH == obj.ApisUpdateRequests[0].AssociatedAdultRPH)[0]
                                        let objAssociated = new appmodel.AssociatedPassenger();
                                        objAssociated.Firstname = associatedDetails.Firstname;
                                        objAssociated.Lastname = associatedDetails.Lastname;;
                                        objAssociated.RPH = obj.ApisUpdateRequests[0].AssociatedAdultRPH;
                                        objAssociated.SurnameRefNumber = obj.ApisUpdateRequests[0].SurnameRefNumber;
                                        obj.ApisUpdateRequests[0].AssociatedPassenger = objAssociated;
                                    }
                                    else {
                                        obj.ApisUpdateRequests[0].AssociatedPassenger = null;
                                    }
                                    objDoc.Surname = docElement.Surname;
                                    console.log(objDoc.Surname);
                                    objDoc.Firstname = docElement.Firstname;
                                    objDoc.DocID = docElement.DocID;
                                    objDoc.DocLevelInd = "1";
                                    objDoc.BirthDate = docElement.BirthDate != null ? moment(docElement.BirthDate).format("MM/DD/YYYY") : "";
                                    objDoc.ExpireDate = moment(docElement.ExpireDate).format("MM/DD/YYYY") != "01/01/0001" ? moment(docElement.ExpireDate).format("MM/DD/YYYY") : "";
                                    objDoc.DocIssueCountry = docElement.DocIssueCountry;
                                    objDoc.DocHolderNationality = docElement.DocHolderNationality;
                                    objDoc.DocHolderGender = docElement.DocHolderGender;
                                    if (docElement.inputType != "Manual" && docElement.inputType != undefined) {
                                        objDoc.inputType = "Machine Readable";
                                        objDoc.OCRString = PassedPassengerDetail.OCRString;
                                    }
                                    else {
                                        objDoc.inputType = "Manual";
                                    }
                                    objDoc.EffectiveDate = docElement.EffectiveDate;
                                    objDoc.DocLevel = docElement.DocLevel;
                                    objDoc.CountryOfResidence = docElement.CountryOfResidence;
                                    objDoc.IsTrustedData = docElement.IsTrustedData;//docElement.IsTrustedData;
                                    objDoc.IsVerifiedData = docElement.IsVerifiedData;
                                    objDoc.IsRefValue = docElement.IsRefValue;
                                    objDoc.DocType = docElement.DocType == "0" ? "2" : docElement.DocType;
                                    objDoc.DocTypeText = docElement.DocTypeText != "Undefined" ? docElement.DocTypeText : "Passport";
                                    //objDoc.DocLevelInd = docElement.DocLevelInd;;
                                    console.log(objDoc);
                                    console.log(docElement.DocID);
                                    obj.ApisUpdateRequests[0].Documents.push(objDoc);
                                    console.log(obj.ApisUpdateRequests[0].Documents);
                                }

                                //}

                            });

                            if (element.Documents.length < 2) {
                                let objDoc = new appmodel.Document();
                                objDoc.Surname = '';
                                objDoc.Firstname = '';
                                objDoc.DocID = null;
                                objDoc.ExpireDate = null;
                                objDoc.DocIssueCountry = null;
                                objDoc.DocType = "14";
                                objDoc.DocTypeText = "Permanent Resident Card";
                                obj.ApisUpdateRequests[0].Documents.push(objDoc);
                            }
                            // }
                        }
                        else {
                            if (PassedPassengerDetail.FirstName == element.Firstname && PassedPassengerDetail.LastName == element.Lastname) {
                                let objDoc = new appmodel.Document();
                                objDoc.Surname = element.Lastname;
                                console.log(objDoc.Surname);
                                objDoc.Firstname = element.Firstname;
                                objDoc.DocID = "";
                                objDoc.DocLevelInd = "1";
                                objDoc.BirthDate = "";
                                objDoc.ExpireDate = "";
                                objDoc.DocIssueCountry = "";
                                objDoc.DocHolderNationality = "";
                                objDoc.DocHolderGender = "0"
                                objDoc.inputType = "Manual";
                                objDoc.CountryOfResidence = null;
                                objDoc.IsTrustedData = false;
                                objDoc.DocType = "2";
                                objDoc.DocTypeText = "Passport";
                                obj.ApisUpdateRequests[0].Documents.push(objDoc);
                                console.log(obj.ApisUpdateRequests[0].Documents);
                            }
                        }
                        obj.DocumentTypeIndexList.length = 0;
                        //let documentTypeIndexList:any[] = [];
                        //documentTypeIndexList.length = 0;
                        obj.ApisUpdateRequests[0].ApisRequirements.length = 0;
                        obj.ApisUpdateRequests[0].ApisRequirements = response.Passengers[index].ApisRequirements;
                        console.dir(response.Passengers[index].ApisAddressRequirements);
                        obj.ApisUpdateRequests[0].ApisAddressRequirements.length = 0;
                        obj.ApisUpdateRequests[0].ApisAddressRequirements = response.Passengers[index].ApisAddressRequirements;
                        if (response.Passengers[index].ApisRequirements != null && response.Passengers[index].ApisRequirements.length > 0) {
                            response.Passengers[index].ApisRequirements.forEach((apisItems, apisIndex) => {
                                let iCheck: boolean = true;
                                if (obj.DocumentTypeIndexList.length == 0) {
                                    obj.DocumentTypeIndexList.push({ "Type": apisItems.DocType, "Text": apisItems.DocTypeText, "DocLevel": apisItems.DocLevel });
                                    //documentTypeIndexList.push(apisItems.DocType);
                                }
                                else {
                                    obj.DocumentTypeIndexList.forEach((dType, dIndex) => {
                                        if (obj.DocumentTypeIndexList[dIndex].Type == apisItems.DocType) {
                                            iCheck = false;
                                        }
                                    });
                                    if (iCheck) {
                                        obj.DocumentTypeIndexList.push({ "Type": apisItems.DocType, "Text": apisItems.DocTypeText, "DocLevel": apisItems.DocLevel });
                                        //documentTypeIndexList.push(apisItems.DocType);
                                    }
                                }
                            });
                        }

                        typeOrder = obj.DocumentTypeIndexList;
                        sortTypeOrder = typeOrder.sort((n1, n2) => n1 - n2);


                        element.Addresses.forEach((docElement, docindex) => {
                            objAddr.IsRefValue = false;
                            objAddr.Type = docElement.Type;
                            objAddr.TypeText = docElement.TypeText;
                            //objAddr.CityCode = docElement.CityCode;
                            objAddr.Address = docElement.Address;
                            objAddr.PostalCode = docElement.PostalCode;
                            objAddr.City = docElement.City;
                            objAddr.State = docElement.State;
                            //objAddr.CarrierCode = docElement.CarrierCode;
                            objAddr.Operation = docElement.Operation;
                            //objAddr.OSIText = docElement.OSIText;
                            objAddr.AgencyName = docElement.AgencyName;
                            objAddr.DocLevelInd = docElement.DocLevelInd;
                            objAddr.AddressLineRequired = docElement.AddressLineRequired;
                            objAddr.AddressCityRequired = false;
                            //objAddr.AddressStateProvRequired = null;
                            objAddr.AddressPostalCodeRequired = null;
                            //objAddr.AddressCountryNameRequired = null;
                            objAddr.AddressCountryCodeRequired = false;
                            objAddr.AddressRequired = null;
                            objAddr.CountryCode = docElement.CountryCode;
                            objAddr.Country = docElement.Country;
                            obj.ApisUpdateRequests[0].Addresses.push(objAddr);
                        });
                    }
                    //}
                });

            }

            if (sortTypeOrder.length > 0) {

                sortTypeOrder.forEach((docType, index) => {
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
                    if (obj.DocumentTypeList.filter(m => m.DocType == obj.DocumentTypeIndexList[index].Type).length == 0) {
                        obj.DocumentTypeList.push({ DocType: obj.DocumentTypeIndexList[index].Type, DocTypeText: obj.DocumentTypeIndexList[index].Text, DocLevel: obj.DocumentTypeIndexList[index].DocLevel });
                        obj.DocumentType.push(obj.DocumentTypeIndexList[index].Text);
                    }

                });
                console.dir(obj.DocumentTypeList)
            }


            var eDate = new Date();
            console.log('Convert Passenger Details --------------- End Date Time : ' + eDate);
            console.log('Convert Passenger Details Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
            return obj;
        }
        catch (error) {
            console.log(error.message);
        }

    }

    public static ConvertToAssignSeat(response: appinterface.MultiSegmentTemplate.Passenger[], flightInfo: appinterface.MultiSegmentTemplate.FlightWithPax, Order: appmodel.Order.RootObject, multiPaxArray: appinterface.MultiSegmentTemplate.RootObject): appinterface.AssignSeat.seat {
        try {
            var newSeatList = new appinterface.AssignSeat.seat();
            console.log("before seat assignment");
            console.dir(response);
            // 
            let isValid: boolean;
            if (flightInfo.MarketingFlight.substr(0, 2) == "CM" || (flightInfo.OperatingFlight != null && flightInfo.OperatingFlight.substr(0, 2) == "CM")) {
                isValid = true;

            }
            if (isValid) {
                response.forEach((passengerList, index) => {
                    // multiPaxArray.Segment.forEach((SegData, SegIndex) => {
                    // SegData.Passenger.forEach((passengerList, index) => {
                    var newSeat = new appinterface.AssignSeat.seats();
                    newSeat.OrderId = passengerList.OrderID;
                    newSeat.SeatNo = passengerList.SeatNumber;

                    if (newSeat.SeatNo == "") {
                        newSeat.NoSeat = true;
                    } else {
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
                    if (Order.SegmentTravelerInfos != null && Order.SegmentTravelerInfos.filter(m => m.PassengerRPH == passengerList.RPH && m.SegmentRPH == flightInfo.RPH)[0].CheckinInfos != null) {
                        newSeat.IsCheckedIn = Order.SegmentTravelerInfos.filter(m => m.PassengerRPH == passengerList.RPH && m.SegmentRPH == flightInfo.RPH)[0].CheckinInfos[0].Status;

                    } else {
                        newSeat.IsCheckedIn = "UNKNOWN"
                    }
                    if (passengerList.FlightLegDepartureAirportCode != "") {
                        newSeat.FlightLegDepartureAirportCode = passengerList.FlightLegDepartureAirportCode;
                    }
                    //newSeat.DepartureDateTime = "2017-02-01T07:41:00" as Date ;    
                    newSeatList.SeatList.push(newSeat);
                })

            } else {
                newSeatList.IsInterlineSeatMap = true;
                multiPaxArray.Segment.forEach((SegData, SegIndex) => {
                    SegData.Passenger.forEach((passengerList, index) => {
                        var newSeat = new appinterface.AssignSeat.seats();
                        newSeat.OrderId = passengerList.OrderID;
                        newSeat.SeatNo = passengerList.SeatNumber;

                        if (newSeat.SeatNo == "") {
                            newSeat.NoSeat = true;
                        } else {
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
                        if (Order.SegmentTravelerInfos != null && Order.SegmentTravelerInfos.filter(m => m.PassengerRPH == passengerList.RPH && m.SegmentRPH == SegData.RPH)[0].CheckinInfos != null) {
                            newSeat.IsCheckedIn = Order.SegmentTravelerInfos.filter(m => m.PassengerRPH == passengerList.RPH && m.SegmentRPH == SegData.RPH)[0].CheckinInfos[0].Status;

                        } else {
                            newSeat.IsCheckedIn = "UNKNOWN"
                        }
                        if (passengerList.FlightLegDepartureAirportCode != "") {
                            newSeat.FlightLegDepartureAirportCode = passengerList.FlightLegDepartureAirportCode;
                        }
                        if (!isValid) {
                            newSeat.FlightLegDepartureAirportCode = SegData.Origin;
                        }
                        //newSeat.DepartureDateTime = "2017-02-01T07:41:00" as Date ;    
                        newSeatList.SeatList.push(newSeat);
                    })
                });
            }


            // })

            console.log(newSeatList)
            return newSeatList;

        }
        catch (error) {
            console.log("Seat assignment conversion error");
        }
    }

    public static ConvertToSeatMap(response: appmodel.seatModel.RootObject, Paxresponse: Array<appinterface.MultiSegmentTemplate.Passenger>, flightnumber: any, Legs: any, origin: any, destination: any): appinterface.SeatMap.RootObject {
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
                var flightSeatList = response.Items.filter(m => m.FlightSegment.Flight == flightnumber || m.FlightSegment.Origin.LocationCode == origin && m.FlightSegment.Destination.LocationCode == destination);
                console.log("leg lenght:" + flightSeatList.length);
                if (Legs != null && Legs != undefined) {
                    Legs.forEach((legs, Index) => {
                        let seatMapList = flightSeatList.filter(m => m.FlightSegment.Origin.LocationCode == legs.DepartureAirport.LocationCode && m.FlightSegment.Destination.LocationCode == legs.ArrivalAirport.LocationCode);
                        if (seatMapList.length > 0) {
                            let itemObj = new appinterface.SeatMap.Item();
                            itemObj.FlightSegment = seatMapList[0].FlightSegment;
                            itemObj.SeatProductInformation = seatMapList[0].SeatProductInformation;
                            itemObj.CabinList = [new appinterface.SeatMap.CabinList()];
                            itemObj.CabinList.length = 0;
                            seatMapList[0].CabinList.forEach((cabinElement, cabinIndex) => {
                                var cabinList = new appinterface.SeatMap.CabinList();;
                                cabinList.CabinType = cabinElement.CabinType;
                                cabinList.CabinName = cabinElement.Name;
                                cabinList.AirRowList = [];
                                var colNames = new appinterface.SeatMap.AirSeatList();
                                var colNamesRow = new appinterface.SeatMap.AirRowList();
                                var headerRow = new appinterface.SeatMap.AirRowList();
                                cabinElement.AirRowList.forEach((airRowElement, rowIndex) => {
                                    var rowList = new appinterface.SeatMap.AirRowList;
                                    rowList.RowNumber = airRowElement.RowNumber;
                                    rowList.AirSeatList = [];
                                    let aisleFnd: boolean = false;
                                    let isLeftExit: boolean = true;
                                    airRowElement.AirSeatList.forEach((airSeatElement, seatIndex) => {
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
                                            } else {
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
                                        if (seatstyle.filter(myObj => myObj.value == airSeatElement.SeatAvailability).length > 0) {
                                            seat.StyleClass = seatstyle.filter(myObj => myObj.value == airSeatElement.SeatAvailability)[0].characteristic;
                                            if (seat.StyleClass == 'availableSeat') {
                                                itemObj.SeatProductInformation.forEach((seatInfo, Index) => {
                                                    if (airSeatElement.SeatCharacteristics.filter(m => m === seatInfo.OTACode).length > 0) {
                                                        seat.SeatCode = seatInfo.SHARESCode;
                                                        // seat.isSpecialSeat = true;
                                                    }
                                                })
                                            }

                                        } else {
                                            seat.StyleClass = 'unavailable';
                                        }
                                        itemObj.SeatProductInformation.forEach((seatInfo, Index) => {
                                            if (airSeatElement.SeatCharacteristics.filter(m => m === seatInfo.OTACode).length > 0) {
                                                seat.isSpecialSeat = true;
                                            }
                                        })
                                        Paxresponse.forEach((pax, index) => {
                                            pax.Seats.forEach((seats, seatindex) => {
                                                if (seats.SeatNumber == seat.SeatNum && seats.DepartureCode == legs.DepartureAirport.LocationCode && seats.ArrivalCode == legs.ArrivalAirport.LocationCode) {
                                                    console.log("inside new condition");
                                                    seat.StyleClass = 'selectedseat';
                                                    seat.IsPaxSelected = true;
                                                    seat.PaxRPH = pax.RPH;
                                                }
                                            })

                                        })
                                    });
                                    if (rowIndex == 0) {
                                        headerRow.HeaderRow = true;
                                        rowList.AirSeatList.forEach((headerItem, hIndex) => {
                                            var newhItem = new appinterface.SeatMap.AirSeatList();
                                            if (!headerItem.MidCol) newhItem.SeatNumber = headerItem.SeatNumber;
                                            headerRow.AirSeatList.push(newhItem);
                                        })
                                        cabinList.AirRowList.push(headerRow);
                                    }
                                    if (rowList.AirSeatList.filter(myObj => myObj.SeatAvailability === '16').length == rowList.AirSeatList.length - 1) {
                                        rowList.StyleClass = "hiderow";
                                    }
                                    if (airRowElement.RowCharacteristics.indexOf("4") > -1) {
                                        rowList.StyleClass += " exitrow";
                                    }

                                    cabinList.AirRowList.push(rowList);
                                });
                                itemObj.CabinList.push(cabinList);
                            });
                            itemList.Items.push(itemObj);
                        }

                    });
                }

                if (flightSeatList.length > 1) {
                    var n = Legs.length;
                    console.log("len:" + n);
                    var previousIndex = n - 1;
                    let seatMapList = flightSeatList.filter(m => m.FlightSegment.Origin.LocationCode == origin && m.FlightSegment.Destination.LocationCode == destination);
                    if (seatMapList.length > 0) {
                        let itemObj = new appinterface.SeatMap.Item();
                        console.log("V1" + JSON.stringify(seatMapList[0].FlightSegment.Origin.LocationCode));
                        console.log("R1" + JSON.stringify(seatMapList[0].FlightSegment.Destination.LocationCode));
                        itemObj.FlightSegment = seatMapList[0].FlightSegment;
                        itemObj.SeatProductInformation = seatMapList[0].SeatProductInformation;
                        itemObj.CabinList = [new appinterface.SeatMap.CabinList()];
                        itemObj.CabinList.length = 0;
                        seatMapList[0].CabinList.forEach((cabinElement, cabinIndex) => {
                            var cabinList = new appinterface.SeatMap.CabinList();;
                            cabinList.CabinType = cabinElement.CabinType;
                            cabinList.CabinName = cabinElement.Name;
                            cabinList.AirRowList = [];
                            var colNames = new appinterface.SeatMap.AirSeatList();
                            var colNamesRow = new appinterface.SeatMap.AirRowList();
                            var headerRow = new appinterface.SeatMap.AirRowList();
                            cabinElement.AirRowList.forEach((airRowElement, rowIndex) => {
                                //console.log("each row number " + objSeatMap.seatRowNumber);
                                var rowList = new appinterface.SeatMap.AirRowList;
                                rowList.RowNumber = airRowElement.RowNumber;
                                rowList.AirSeatList = [];
                                let aisleFnd: boolean = false;
                                let isLeftExit: boolean = true;

                                airRowElement.AirSeatList.forEach((airSeatElement, seatIndex) => {
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
                                        } else {
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
                                    if (seatstyle.filter(myObj => myObj.value == airSeatElement.SeatAvailability).length > 0) {
                                        seat.StyleClass = seatstyle.filter(myObj => myObj.value == airSeatElement.SeatAvailability)[0].characteristic;
                                        if (seat.StyleClass == 'availableSeat') {
                                            itemObj.SeatProductInformation.forEach((seatInfo, Index) => {
                                                if (airSeatElement.SeatCharacteristics.filter(m => m === seatInfo.OTACode).length > 0) {
                                                    seat.SeatCode = seatInfo.SHARESCode;
                                                    seat.StyleClass = 'specialseat';
                                                }
                                            })
                                        }

                                    } else {
                                        seat.StyleClass = 'unavailable';
                                    }
                                    itemObj.SeatProductInformation.forEach((seatInfo, Index) => {
                                        if (airSeatElement.SeatCharacteristics.filter(m => m === seatInfo.OTACode).length > 0) {
                                            seat.isSpecialSeat = true;
                                        }
                                    })
                                    Paxresponse.forEach((pax, index) => {
                                        if (pax.SeatNumber == seat.SeatNum) {
                                            console.log("inside new condition");
                                            seat.StyleClass = 'selectedseat';
                                            seat.IsPaxSelected = true;
                                            seat.PaxRPH = pax.RPH;
                                        }
                                    })
                                });
                                if (rowIndex == 0) {
                                    headerRow.HeaderRow = true;
                                    rowList.AirSeatList.forEach((headerItem, hIndex) => {
                                        var newhItem = new appinterface.SeatMap.AirSeatList();
                                        if (!headerItem.MidCol) newhItem.SeatNumber = headerItem.SeatNumber;
                                        headerRow.AirSeatList.push(newhItem);
                                    })
                                    cabinList.AirRowList.push(headerRow);
                                }
                                if (rowList.AirSeatList.filter(myObj => myObj.SeatAvailability === '16').length == rowList.AirSeatList.length - 1) {
                                    rowList.StyleClass = "hiderow";
                                }

                                if (airRowElement.RowCharacteristics.indexOf("4") > -1) {
                                    rowList.StyleClass += " exitrow";
                                }
                                cabinList.AirRowList.push(rowList);
                            });
                            itemObj.CabinList.push(cabinList);
                        });
                        itemList.Items.push(itemObj);
                    }

                }
            }
            else {
                console.log("null response for seatmap");
            }
            var eDate = new Date();
            console.log('Convert Seat Map --------------- End Date Time : ' + eDate);
            console.log('Convert Seat Map Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
        }
        catch (error) {
            console.log(error.message);
        }
        return itemList;
    }

    public static OAseatmap(response: appmodel.seatModel.RootObject, Paxresponse: Array<appinterface.MultiSegmentTemplate.Passenger>, flightnumber: any, Legs: any, origin: any, destination: any): appinterface.SeatMap.RootObject {
        try {
            var sDate = new Date();
            console.log('Convert Seat Map --------------- Start Date Time : ' + sDate);
            var itemList = new appinterface.SeatMap.RootObject();
            console.log("before conversion");
            if (response != null && response.Items != null) {
                itemList.Items = [new appinterface.SeatMap.Item];
                itemList.Items.length = 0;
                var flightSeatList = response.Items.filter(m => m.FlightSegment.Flight == flightnumber || m.FlightSegment.Origin.LocationCode == origin && m.FlightSegment.Destination.LocationCode == destination);
                let seatMapList = flightSeatList;
                if (seatMapList.length > 0) {
                    let itemObj = new appinterface.SeatMap.Item();
                    itemObj.FlightSegment = seatMapList[0].FlightSegment;
                    itemObj.SeatProductInformation = seatMapList[0].SeatProductInformation;
                    itemObj.CabinList = [new appinterface.SeatMap.CabinList()];
                    itemObj.CabinList.length = 0;
                    seatMapList[0].CabinList.forEach((cabinElement, cabinIndex) => {
                        var cabinList = new appinterface.SeatMap.CabinList();;
                        cabinList.CabinType = cabinElement.CabinType;
                        cabinList.CabinName = cabinElement.Name;
                        cabinList.AirRowList = [];
                        var colNames = new appinterface.SeatMap.AirSeatList();
                        var colNamesRow = new appinterface.SeatMap.AirRowList();
                        var headerRow = new appinterface.SeatMap.AirRowList();
                        cabinElement.AirRowList.forEach((airRowElement, rowIndex) => {
                            var rowList = new appinterface.SeatMap.AirRowList;
                            rowList.RowNumber = airRowElement.RowNumber;
                            rowList.AirSeatList = [];
                            let aisleFnd: boolean = false;
                            let isLeftExit: boolean = true;
                            airRowElement.AirSeatList.forEach((airSeatElement, seatIndex) => {
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
                                    } else {
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
                                if (seatstyle.filter(myObj => myObj.value == airSeatElement.SeatAvailability).length > 0) {
                                    seat.StyleClass = seatstyle.filter(myObj => myObj.value == airSeatElement.SeatAvailability)[0].characteristic;
                                    if (seat.StyleClass == 'availableSeat') {
                                        itemObj.SeatProductInformation.forEach((seatInfo, Index) => {
                                            if (airSeatElement.SeatCharacteristics.filter(m => m === seatInfo.OTACode).length > 0) {
                                                seat.SeatCode = seatInfo.SHARESCode;
                                            }
                                        })
                                    }

                                } else {
                                    seat.StyleClass = 'unavailable';
                                }
                                itemObj.SeatProductInformation.forEach((seatInfo, Index) => {
                                    if (airSeatElement.SeatCharacteristics.filter(m => m === seatInfo.OTACode).length > 0) {
                                        seat.isSpecialSeat = true;
                                    }
                                })
                                Paxresponse.forEach((pax, index) => {
                                    pax.Seats.forEach((seats, seatindex) => {
                                        if (seats.SeatNumber == seat.SeatNum) {
                                            console.log("inside new condition");
                                            seat.StyleClass = 'selectedseat';
                                            seat.IsPaxSelected = true;
                                            seat.PaxRPH = pax.RPH;
                                        }
                                    })

                                })
                            });
                            if (rowIndex == 0) {
                                headerRow.HeaderRow = true;
                                rowList.AirSeatList.forEach((headerItem, hIndex) => {
                                    var newhItem = new appinterface.SeatMap.AirSeatList();
                                    if (!headerItem.MidCol) newhItem.SeatNumber = headerItem.SeatNumber;
                                    headerRow.AirSeatList.push(newhItem);
                                })
                                cabinList.AirRowList.push(headerRow);
                            }
                            if (rowList.AirSeatList.filter(myObj => myObj.SeatAvailability === '16').length == rowList.AirSeatList.length - 1) {
                                rowList.StyleClass = "hiderow";
                            }
                            if (airRowElement.RowCharacteristics.indexOf("4") > -1) {
                                rowList.StyleClass += " exitrow";
                            }

                            cabinList.AirRowList.push(rowList);
                        });
                        itemObj.CabinList.push(cabinList);
                    });
                    itemList.Items.push(itemObj);
                }
            }
            else {
                console.log("null response for seatmap");
            }
            var eDate = new Date();
            console.log('Convert Seat Map --------------- End Date Time : ' + eDate);
            console.log('Convert Seat Map Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
        }
        catch (error) {
            console.log(error.message);
        }
        return itemList;
    }
    public static GetBagTag(response: any, flightInfo: appinterface.MultiSegmentTemplate.FlightWithPax, BaggegeDetails: Array<appinterface.baggageTemplate.AddBaggegeDetails>, SelectedPassenger: appinterface.MultiSegmentTemplate.FlightWithPax, shortCheckin: string): appinterface.Bagtag.RootObject {

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
                tag.Source = ""
            } else {
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
            response.PhoneNumbers.forEach((phoneElement, phoneIndex) => {
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
            var selectedpax = SelectedPassenger.Passenger.filter(m => m.RPH == response.RPH);
            PassengerList.FqtTravelers = selectedpax[0].FqtTravelers;
            PassengerList.Nationality = null;
            PassengerList.EmergencyDetails = [];
            var CheckedBags = new appinterface.Bagtag.CheckedBag();
            var BaggageInfo = new appinterface.Bagtag.BaggageInfo();
            let Totalweight: number = 0;


            BaggegeDetails.forEach((Detail, Index) => {



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
                    Totalweight += Number(Detail.weight);
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


            BaggageInfo.CheckedBagWeightTotal = Totalweight.toString();
            console.log(BaggageInfo.CheckedBagWeightTotal);
            BaggageInfo.UnitOfMeasureCode = "16";
            BaggageInfo.PassengerRPH = response.RPH;
            BaggageInfo.CheckedBagCountTotal = BaggegeDetails != null ? BaggegeDetails.filter(m => m.AlreadyExisting != true).length.toString() : "0";
            CheckedBags.BaggageInfo = BaggageInfo;
            CheckedBags.CancelOperation = false;
            CheckedBags.MessageFunction = 30;
            PassengerList.CheckedBags.push(CheckedBags);

            PassengerList.CheckInBagCountTotal = BaggegeDetails != null ? BaggegeDetails.filter(m => m.AlreadyExisting != true).length.toString() : "0";
            PassengerList.CheckInBagWeightTotal = Totalweight.toString();
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
                let BoardingPrint = new appinterface.BagTagPrint.BoardingPassDeliveryDetail();
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
                BoardingPrint.Printer.DeviceType = DeviceType
                // bagTagDetail.DeliveryDetail = BoardingPrint;
                tag.DeliveryDetail = BoardingPrint;
            } else {
                tag.DeliveryDetail = new appinterface.BagTagPrint.BoardingPassDeliveryDetail();
                let BoardingPrint = new appinterface.BagTagPrint.BoardingPassDeliveryDetail();
                BoardingPrint.Printer = new appinterface.BoardingPass.Printer();
                tag.DeliveryDetail = BoardingPrint;

            }
            return tag;
        }
        catch (error) {
            console.log(error.message);
        }

    }
    public static GetBagCatalog(response: any) {
        let PassengerArray = [];
        PassengerArray = response.Passengers;
        let SegmentArray = [];
        SegmentArray = response.Segments;
        let baggagecatalog = {
            "PassengerList": PassengerArray, "SegmentList": SegmentArray
        }
        console.log(baggagecatalog);
        return baggagecatalog;
    }
    public static DeleteBagTag(response: any, flightInfo: any, BaggegeDetails: Array<appinterface.baggageTemplate.AddBaggegeDetails>): any {

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
            response.PhoneNumbers.forEach((phoneElement, phoneIndex) => {
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


            BaggegeDetails.forEach((Detail, Index) => {



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
                    BagTagDetails.Weight = null
                    BagTagDetails.Amount = null;
                    BagTagDetails.IsAutoBag = true;
                    BaggageInfoToDelete.BagTagDetails.push(BagTagDetails);

                }
            });

            if (response.BaggageInfo != null && response.BaggageInfo != "" && response.BaggageInfo.UnitOfMeasureQuantity != null) {
                BaggageInfoToDelete.CheckedBagWeightTotal = response.BaggageInfo.UnitOfMeasureQuantity.toString();

            } else {
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
            let BoardingPrint = new appinterface.BoardingPass.BoardingPassDeliveryDetail();
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

    }

    public static ConvertToOutBound(response: any): number {
        try {
            console.log("inside ConvertToOutBound");
            var obj1 = new appinterface.OutBound.Outbou();
            var outboundCount = 0;
            obj1.PassengerCount = 0;
            if (response != null) {
                if (response.OutboundFlights != null) {
                    response.OutboundFlights.forEach((element, Index) => {
                        outboundCount = outboundCount + element.PassengerCount;
                        console.log("inside OutBound " + outboundCount)
                    });
                    obj1.PassengerCount = outboundCount;
                }
            }

            return outboundCount;
        }
        catch (ex) {
            console.log(ex.message);
        }
    }

    public static ConvertToPrintBoardingPass(responseData: any[], segmentList: appinterface.MultiSegmentTemplate.FlightWithPax, passengerDetails: appmodel.Order.RootObject, type: string, response: appinterface.MultiSegmentTemplate.RootObject, RPHValue: number): any {
        try {
            var boardingPass = new appinterface.BoardingPass.RootObject();
            // boardingPass.PassengerList = [new appinterface.BoardingPass.PassengerList()];
            // boardingPass.SegmentList = [new appinterface.BoardingPass.SegmentList()];
            let checkedInData: boolean = false;
            responseData.forEach((elements, index) => {
                let selectedPassenger = segmentList.Passenger.filter(m => m.FirstName == elements.FirstName && m.LastName == elements.LastName)[0];
                if (selectedPassenger != null) {
                    if (selectedPassenger.CheckinStatus == true) {
                        checkedInData = true;
                    }
                }
            });
            if (checkedInData) {

                var flightdetails = passengerDetails.Segments.filter(m => m.RPH == segmentList.RPH)[0];
                if (responseData != null && flightdetails != null) {
                    // boardingPass.CheckInType = "CheckIn"
                    if (type == 'hosted') {
                        var Worksatation = ApplicationSettings.getString("hostBoardingWS", "");
                        var DeviceName = ApplicationSettings.getString("boardingPassDeviceName", "");
                        var PectabVersion = ApplicationSettings.getString("pectabVersion", "");
                        var DeviceType = ApplicationSettings.getString("deviceType", "");
                        var Office = ApplicationSettings.getString("hostBoardingOffice", "")
                        boardingPass.DeliveryDetail = new appinterface.BoardingPass.BoardingPassDeliveryDetail();
                        let BoardingPrint = new appinterface.BoardingPass.BoardingPassDeliveryDetail();
                        BoardingPrint.Email = null;
                        BoardingPrint.Gateway = "WS";
                        BoardingPrint.PrinterAddress = DeviceName;
                        BoardingPrint.Printer = new appinterface.BoardingPass.Printer();
                        BoardingPrint.Printer.DeviceName = DeviceName;
                        BoardingPrint.Printer.ClientCode = "CM";
                        BoardingPrint.Printer.OfficeName = Office;
                        BoardingPrint.Printer.PectabVersion = PectabVersion;
                        BoardingPrint.Printer.DeviceType = DeviceType
                        BoardingPrint.Printer.WorkstationName = Worksatation;
                        boardingPass.DeliveryDetail = BoardingPrint;
                    }
                    responseData.forEach((elements, index) => {
                        let selectedPassenger = segmentList.Passenger.filter(m => m.FirstName == elements.FirstName && m.LastName == elements.LastName)[0];
                        if (selectedPassenger != null) {
                            if (selectedPassenger.CheckinStatus == true && selectedPassenger.CheckinPassengerType != "INF") {
                                let passengerDetail = new appinterface.BoardingPass.PassengerList();
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
                                    passengerDetail.INFGivenName = segmentList.Passenger.filter(m => m.RPH == selectedPassenger.AssociatedInfantRPH)[0].FirstName;
                                    passengerDetail.INFSurname = segmentList.Passenger.filter(m => m.RPH == selectedPassenger.AssociatedInfantRPH)[0].LastName;
                                } else if (selectedPassenger.CheckinPassengerType == "INF") {
                                    passengerDetail.INFGivenName = selectedPassenger.FirstName;
                                    passengerDetail.INFSurname = selectedPassenger.LastName;
                                    passengerDetail.AssociatedInfantRPH = selectedPassenger.RPH;
                                }

                                boardingPass.Passengers.push(passengerDetail);
                            }
                        }
                    });

                    let segmentDetail = new appinterface.BoardingPass.SegmentList();

                    if (response.Segment.filter(m => m.MarketingFlight.substr(0, 2) == "CM" || (m.OperatingFlight != null && m.OperatingFlight.substr(0, 2) == "CM")).length > 0) {
                        let flightlist = response.Segment.filter(m => m.MarketingFlight.substr(0, 2) == "CM" || (m.OperatingFlight != null && m.OperatingFlight.substr(0, 2) == "CM"))[0];
                        if (flightlist.FlightInfo.length > 0) {
                            if (flightlist.RPH <= segmentList.RPH) {
                                segmentDetail.DepartureCity = flightlist.DepartureCity;
                                segmentDetail.ArrivalCity = flightlist.Destination;
                                segmentDetail.DepartureDateTime = flightlist.DepartureDateTime;
                                if (flightlist.MarketingFlight.substr(0, 2) != "CM" && flightlist.OperatingFlight != null && flightlist.OperatingFlight.substr(0, 2) == "CM") {
                                    segmentDetail.MarketingFlight = flightlist.OperatingFlight;
                                } else {
                                    segmentDetail.MarketingFlight = flightlist.MarketingFlight;
                                }
                                segmentDetail.RPH = (RPHValue + 1).toString();
                                console.log(flightlist);
                                // segmentDetail.Gate = flightlist.FlightInfo[0].DepartureTerminalGate;
                                boardingPass.Segments.push(segmentDetail);
                            } else {
                                Toast.makeText("Cannot Print BoardingPass for OA flights").show();
                                boardingPass = null;
                            }
                        } else {
                            segmentDetail.DepartureCity = segmentList.DepartureCity;
                            segmentDetail.DepartureDateTime = segmentList.DepartureDateTime;
                            // segmentDetail.Gate = segmentList.FlightInfo[0].DepartureTerminalGate;
                            segmentDetail.MarketingFlight = segmentList.MarketingFlight;
                            segmentDetail.RPH = "1";
                            segmentDetail.OrderId = segmentList.Passenger[0].OrderID;
                            boardingPass.Segments.push(segmentDetail);
                        }
                    } else {
                        Toast.makeText("Cannot Print BoardingPass for OA flights").show();
                        boardingPass = null;
                    }
                } else {

                }


            }
            else {
                boardingPass = null;
            }
            console.log(JSON.stringify(boardingPass));
            return boardingPass;
        } catch (error) {
            console.log(error.message);
        }
    }

    public static ConvertToPrintBagTag(responseData: any[], segmentList: appinterface.MultiSegmentTemplate.FlightWithPax, passengerDetails: appmodel.Order.RootObject, type: string, segmentDetails: any): any {
        try {
            var bagTagDetail = new appinterface.BagTagPrint.RootObject();
            let checkedInData: boolean = false;
            responseData.forEach((elements, index) => {
                let selectedPassenger = segmentList.Passenger.filter(m => m.FirstName == elements.FirstName && m.LastName == elements.LastName)[0];
                if (selectedPassenger != null) {
                    if (selectedPassenger.CheckinStatus == true) {
                        checkedInData = true;
                    }
                }
            });

            let requestData: any = null;
            if (checkedInData) {
                //  if (responseData.BaggageInfo.BagTagDetails != null) {
                var flightdetails = passengerDetails.Segments.filter(m => m.RPH == segmentList.RPH)[0];
                if (responseData != null && flightdetails != null) {
                    // boardingPass.CheckInType = "CheckIn"
                    if (type == 'hosted') {
                        bagTagDetail.DeliveryDetail = new appinterface.BagTagPrint.BoardingPassDeliveryDetail();
                        let BoardingPrint = new appinterface.BagTagPrint.BoardingPassDeliveryDetail();
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
                        BoardingPrint.Printer.DeviceType = DeviceType
                        bagTagDetail.DeliveryDetail = BoardingPrint;
                    }
                    responseData.forEach((elements, index) => {
                        let selectedPassenger = segmentList.Passenger.filter(m => m.FirstName == elements.FirstName && m.LastName == elements.LastName)[0];
                        console.dir(selectedPassenger);
                        if (selectedPassenger != null) {
                            if (selectedPassenger.CheckinStatus == true) {
                                let passengerDetail = new appinterface.BagTagPrint.PassengerList();
                                passengerDetail.OrderId = selectedPassenger.OrderID;
                                passengerDetail.PassengerRefNumber = selectedPassenger.PassengerRefNumber;
                                passengerDetail.CheckinAirportCode = segmentList.Origin;
                                passengerDetail.AssociatedInfantRPH = selectedPassenger.AssociatedInfantRPH;
                                passengerDetail.CheckedBagCount = selectedPassenger.BagCount;
                                passengerDetail.Firstname = selectedPassenger.FirstName;
                                passengerDetail.Lastname = selectedPassenger.LastName;

                                passengerDetail.PassengerTypeCode = selectedPassenger.PassengerTypeCode;
                                passengerDetail.RPH = selectedPassenger.RPH;
                                passengerDetail.Selected = true;// responseData.Selected;

                                passengerDetail.CheckInBagCountTotal = selectedPassenger.BagCount.toString();
                                passengerDetail.CheckInBagWeightTotal = selectedPassenger.UnitOfMeasureQuantity;
                                let BagsInfo = new appinterface.BagTagPrint.BaggageInfo();

                                BagsInfo.PassengerRPH = selectedPassenger.RPH;
                                BagsInfo.CheckedBagCountTotal = selectedPassenger.BaggageInfo.CheckedBagCountTotal != null ? selectedPassenger.BaggageInfo.CheckedBagCountTotal : "0";
                                BagsInfo.CheckedBagWeightTotal = selectedPassenger.BaggageInfo.UnitOfMeasureQuantity;
                                BagsInfo.UnitOfMeasureCode = selectedPassenger.BaggageInfo.UnitOfMeasureCode
                                if (selectedPassenger.BaggageInfo.BagTagDetails != null) {
                                    selectedPassenger.BaggageInfo.BagTagDetails.forEach((bags, indexs) => {
                                        let BagTagDetail = new appinterface.BagTagPrint.BagTagDetail();
                                        BagTagDetail.BagTagType = bags.BagTagType;
                                        BagTagDetail.SerialNumber = bags.SerialNumber;
                                        BagTagDetail.BagTagCount = bags.BagTagCount;
                                        BagTagDetail.CarrierCode = bags.CarrierCode;
                                        BagTagDetail.IssuerCode = bags.IssuerCode;
                                        BagTagDetail.WeightToDelete = bags.WeightToDelete;
                                        BagTagDetail.WeightToDelete_Editable = bags.WeightToDelete_Editable;
                                        BagTagDetail.SegmentRPH = bags.SegmentRPH;
                                        BagsInfo.BagTagDetails.push(BagTagDetail);
                                    });
                                }

                                let bagsInfoDetails = new appinterface.BagTagPrint.CheckedBags();
                                bagsInfoDetails.BaggageInfo = BagsInfo;
                                bagsInfoDetails.CancelOperation = false;
                                passengerDetail.CheckedBags.push(bagsInfoDetails);
                                let fqt = new appinterface.BagTagPrint.FqtTraveler();
                                if (elements.FQTVNumber != "" || elements.FQTVNumber == null) {
                                    fqt.MembershipID = elements.FQTVNumber;
                                    fqt.ProgramID = elements.ProgramIDxx;
                                }
                                passengerDetail.FqtTravelers.push(fqt);
                                bagTagDetail.Passengers.push(passengerDetail);
                            }
                        }
                    });
                    let segmentDetail = new appinterface.BagTagPrint.SegmentList();
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
        } catch (error) {
            console.log(error.message);
        }
    }

    public static ConvertToFqtvUpdateTemplate(PassengerResponse: any, fqtv: any, VendorCodes: any, id: any): appmodel.FQTVUpdate.RootObject {
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


    }

    public ConverToBluetoothPrinter(): appmodel.PrintModel.RootObject {
        let obj = new appmodel.PrintModel.RootObject();
        let outputRequest = new appmodel.PrintModel.OutputRequest();
        let printer = new appmodel.PrintModel.Printer();
        //printer =
        return obj;

    }

    public static ConvertToOAOffloadTemplate(response: appinterface.MultiSegmentTemplate.FlightWithPax[], SelectedPassenger: appinterface.PassengerCheckin.SelectedPassenger[], segmentList: appinterface.MultiSegmentTemplate.RootObject, index: any, checkintype: any) {
        try {
            let obj = new appinterface.InterlineThroughCheckin.RootObject();
            if (checkintype == "Waitlist") {
                obj.CheckInType = "Waitlist";

            } else {
                obj.CheckInType = "InterlineCheckInChangeSeat";
            }
            var previousIndex = index - 1;

            if (segmentList.Segment.filter(m => m.MarketingFlight.substr(0, 2) == "CM").length > 0) {
                let flightlist = segmentList.Segment[previousIndex];
                if (flightlist.MarketingFlight.substr(0, 2) == "CM") {
                    let SegObj = new appinterface.InterlineThroughCheckin.SegmentList();
                    SegObj.RPH = "1";
                    SegObj.DepartureDateTime = flightlist.DepartureDateTime;
                    SegObj.DepartureCity = flightlist.DepartureCity;
                    SegObj.MarketingFlight = flightlist.MarketingFlight;
                    SegObj.Selected = true;
                    obj.SegmentList.push(SegObj);
                    if (SelectedPassenger.length > 0) {
                        SelectedPassenger.forEach((elements, Paxindex) => {
                            var responseData = response[0].Passenger.filter(m => m.FirstName == elements.FirstName && m.LastName == elements.LastName)[0];

                            let PaxObj = new appinterface.InterlineThroughCheckin.PassengerList();
                            PaxObj.GivenName = responseData.FirstName;
                            PaxObj.Surname = responseData.LastName;
                            PaxObj.Emails = [];
                            PaxObj.PassengerTypeCode = responseData.PassengerTypeCode;
                            PaxObj.PassengerRefNumber = responseData.PassengerRefNumber;
                            PaxObj.PhoneNumbers = responseData.PhoneNumbers;

                            let FQTVObj = new appinterface.InterlineThroughCheckin.FqtTraveler();
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
                            console.log("RPB:" + flightlist.RBD);
                            PaxObj.ResBookDesigCode = flightlist.RBD;
                            PaxObj.RPH = responseData.RPH;
                            PaxObj.Firstname = responseData.FirstName;
                            PaxObj.Lastname = responseData.LastName;
                            PaxObj.Selected = true;
                            PaxObj.AssociatedInfantRPH = null;
                            obj.PassengerList.push(PaxObj);

                        });

                    }

                } else {
                    Toast.makeText("Cannot perform offload")
                    obj = null;
                }
            } else {
                Toast.makeText("Cannot perform offload")
                obj = null;
            }
            return obj;
        }

        catch (error) {

            console.log(error.message);

        }


    }

    public static ConvertToInterlineThroughCheckInPostTemplate(response: appinterface.MultiSegmentTemplate.FlightWithPax[], SelectedPassenger: appinterface.PassengerCheckin.SelectedPassenger[], segmentList: appinterface.MultiSegmentTemplate.RootObject, index: any, Flightdeatils: string, checkintype: any, Order: appmodel.Order.RootObject, CheckedBags: Array<appinterface.Bagtag.PassengerList>): appinterface.InterlineThroughCheckin.RootObject {

        try {
            let obj = new appinterface.InterlineThroughCheckin.RootObject();
            if (checkintype == "Waitlist") {
                obj.CheckInType = "Waitlist";

            } else {
                obj.CheckInType = "InterlineCheckIn";
            }
            var nextIndex = index + 1;

            let SegObj = new appinterface.InterlineThroughCheckin.SegmentList();
            SegObj.RPH = "1";
            SegObj.DepartureDateTime = segmentList.Segment[index].DepartureDateTime;
            SegObj.DepartureCity = segmentList.Segment[index].DepartureCity;
            SegObj.MarketingFlight = segmentList.Segment[index].MarketingFlight;
            SegObj.Selected = true;
            SegObj.OrderId = response[0].Passenger[0].OrderID;
            obj.SegmentList.push(SegObj);
            if (SelectedPassenger.length > 0) {
                SelectedPassenger.forEach((elements, Paxindex) => {
                    var responseData = response[0].Passenger.filter(m => m.FirstName == elements.FirstName && m.LastName == elements.LastName)[0];

                    let PaxObj = new appinterface.InterlineThroughCheckin.PassengerList();
                    PaxObj.GivenName = responseData.FirstName;
                    PaxObj.Surname = responseData.LastName;
                    PaxObj.Emails = [];
                    PaxObj.PassengerTypeCode = responseData.PassengerTypeCode;
                    PaxObj.PassengerRefNumber = responseData.PassengerRefNumber;
                    PaxObj.SurnameRefNumber = responseData.SurnameRefNumber;
                    PaxObj.SurnameRefNumberCount = responseData.SurnameRefNumberCount;
                    PaxObj.PhoneNumbers = responseData.PhoneNumbers;

                    let FQTVObj = new appinterface.InterlineThroughCheckin.FqtTraveler();
                    FQTVObj.MembershipID = null;
                    FQTVObj.ProgramID = null;
                    PaxObj.FqtTravelers.push(FQTVObj);
                    PaxObj.EmergencyDetails = [];
                    if (Order.SegmentTravelerInfos != null && Order.SegmentTravelerInfos.filter(m => m.PassengerRPH == responseData.RPH && m.SegmentRPH == segmentList.Segment[index].RPH)[0].CheckinInfos != null) {
                        PaxObj.Status = Order.SegmentTravelerInfos.filter(m => m.PassengerRPH == responseData.RPH && m.SegmentRPH == segmentList.Segment[index].RPH)[0].CheckinInfos[0].Status;

                    } else {
                        PaxObj.Status = "UNKNOWN"
                    }
                    PaxObj.addPartialMember = false
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
                    if (CheckedBags != null && CheckedBags.length > 0 && CheckedBags.filter(m => m.RPH == responseData.RPH).length > 0) {
                        PaxObj.CheckedBags = CheckedBags.filter(m => m.RPH == responseData.RPH)[0].CheckedBags;
                        obj.Source = "TAB";
                        if (CheckedBags.filter(m => m.RPH == responseData.RPH)[0].isManualBag) {
                            obj.isManualBag = true;
                        } else {
                            obj.isManualBag = false;
                        }
                        if (ApplicationSettings.getBoolean("isHostBagtag")) {
                            obj.BoardingPassDeliveryDetail = [];
                            let BoardingPrint = new appinterface.BagTagPrint.BoardingPassDeliveryDetail();
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
                            BoardingPrint.Printer.DeviceType = DeviceType
                            obj.BluetoothBagTag = false;
                            // bagTagDetail.DeliveryDetail = BoardingPrint;
                            obj.BoardingPassDeliveryDetail.push(BoardingPrint);
                        } else {
                            obj.BoardingPassDeliveryDetail = [];
                            let BoardingPrint = new appinterface.BagTagPrint.BoardingPassDeliveryDetail();
                            BoardingPrint.Printer = new appinterface.BoardingPass.Printer();
                            obj.BluetoothBagTag = true;
                            obj.BoardingPassDeliveryDetail.push(BoardingPrint);

                        }
                    }
                    let OutboundFlightsObj = new appinterface.InterlineThroughCheckin.OutBoundConnectingFlightInfo();
                    OutboundFlightsObj.FlightRPH = "1";
                    let obj3 = new appinterface.InterlineThroughCheckin.FlightNumber();
                    var length = Flightdeatils.length;
                    var airlineCode = Flightdeatils.substring(0, 2);
                    var NumberLen: number = Flightdeatils.length - 2;
                    var VendorCode = Flightdeatils.substring(2);
                    obj3.AirlineCode = airlineCode;
                    obj3.Number = VendorCode;
                    OutboundFlightsObj.FlightNumber.push(obj3);
                    OutboundFlightsObj.ActualDepartureDateTime = segmentList.Segment[nextIndex].DepartureDateTime;
                    OutboundFlightsObj.DepartureCode = segmentList.Segment[nextIndex].DepartureCity;
                    OutboundFlightsObj.ArrivalCode = segmentList.Segment[nextIndex].Destination;
                    var NextSegPassengerDetails = segmentList.Segment[nextIndex].Passenger.filter(m => m.FirstName == elements.FirstName && m.LastName == elements.LastName)[0];

                    let obj4 = new appinterface.InterlineThroughCheckin.SeatList();
                    obj4.Cabin = null;
                    if (NextSegPassengerDetails.SeatNumber != "Auto") {
                        obj4.SeatNumber = NextSegPassengerDetails.SeatNumber;
                    } else {
                        obj4.SeatNumber = null;
                    }
                    OutboundFlightsObj.SeatList.push(obj4);
                    OutboundFlightsObj.ResBookDesigCode = segmentList.Segment[nextIndex].RBD;

                    let obj5 = new appinterface.InterlineThroughCheckin.FqtTraveler2();
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
                    obj.PassengerList.push(PaxObj);

                });

            }

            return obj;

        }

        catch (error) {

            console.log(error.message);

        }

    }

    public static BluetoothPrinterResponse(addManualBagTagRequest: appinterface.Bagtag.RootObject, bagtagVMDetails: any, BluetoothPrintStatus: boolean, ): appinterface.PrintResponse.RootObject {
        try {
            let bluetoothReq = new appinterface.PrintResponse.RootObject();
            bluetoothReq.addManualBagTagRequest = addManualBagTagRequest;
            bluetoothReq.bagTagVMDetails = bagtagVMDetails;
            bluetoothReq.BluetoothPrintStatus = BluetoothPrintStatus;
            if (bluetoothReq.bagTagVMDetails.BagTagPrintResponse != null && bluetoothReq.bagTagVMDetails.BagTagPrintResponse.BagTagOutput != null && bluetoothReq.bagTagVMDetails.BagTagPrintResponse.BagTagOutput.length > 0) {
                bluetoothReq.bagTagVMDetails.BagTagPrintResponse.BagTagOutput[0].PicRawData = null
            }
            console.log(bluetoothReq)
            return bluetoothReq;
        }
        catch (error) {
            console.log(error.message);
        }
    }

    public static BluetoothPrinterResponseCheckin(CheckinRequest: appinterface.CheckInPostTemplate.RootObject, CheckinResponse: any, BluetoothPrintStatus: boolean): any {
        try {
            let bluetoothReq = new appinterface.CheckinPrintResponse.RootObject();
            bluetoothReq.CheckinRequest = CheckinRequest;
            bluetoothReq.CheckinResponse = CheckinResponse;
            bluetoothReq.BluetoothPrintStatus = BluetoothPrintStatus;
            if (bluetoothReq.CheckinResponse.BagTagOutput != null && bluetoothReq.CheckinResponse.BagTagOutput.length > 0) {
                bluetoothReq.CheckinResponse.BagTagOutput[0].PicRawData = null
            }
            console.log(bluetoothReq)
            return bluetoothReq;
        }
        catch (error) {
            console.log(error.message);
        }
    }

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


    public static convertoCompensationPassengerList(response: any, FlightDetails: any, loc: any): appinterface.CompensationSearchModule.CompensationRootObject {
        try {
            let compensationObejct: appinterface.CompensationSearchModule.CompensationRootObject = new appinterface.CompensationSearchModule.CompensationRootObject;
            let flightModel: appinterface.CompensationSearchModule.FlightModel = new appinterface.CompensationSearchModule.FlightModel;
            // console.log("V in con" + JSON.stringify(FlightDetails));

            compensationObejct.FlightModel = flightModel;
            if (response.FlightSegments) {
                if (FlightDetails.Flights != null) {
                    flightModel.DepartureAirport = FlightDetails.Flights[0].Legs[0].DepartureAirport.LocationCode;
                    flightModel.DestinationAirport = FlightDetails.Flights[0].Legs[0].ArrivalAirport.LocationCode;
                    flightModel.DepartureDate = FlightDetails.Parameters.DepartureDate.toString().substr(0, 10);
                    flightModel.FlightNumber = FlightDetails.Parameters.FlightNumber;

                    flightModel.DepartureDateTime = FlightDetails.Flights[0].Legs[0].DepartureDateTime.Scheduled;
                    if (FlightDetails.Flights[0].Legs.length > 1) {
                        console.log("legs inside");
                        console.log(loc);
                        let legs = FlightDetails.Flights[0].Legs.filter(m => m.DepartureAirport.LocationCode == loc)[0];
                        flightModel.STD = legs.DepartureDateTime.Scheduled.toString().substr(11, 5);
                        flightModel.ETD = legs.DepartureDateTime.Estimated.toString().substr(11, 5);
                        flightModel.STA = legs.ArrivalDateTime.Scheduled.toString().substr(11, 5);
                        flightModel.finalDestination = FlightDetails.Flights[0].Legs[1].ArrivalAirport.LocationCode
                        flightModel.multiLegFlight = true;
                        FlightDetails.Flights[0].Legs.forEach((legs, legIndex) => {
                            if (legIndex >= 1) {
                                flightModel.Legs.push(legs.ArrivalAirport.LocationCode);
                            }
                        });
                    } else {
                        flightModel.STD = FlightDetails.Flights[0].Legs[0].DepartureDateTime.Scheduled.toString().substr(11, 5);
                        flightModel.ETD = FlightDetails.Flights[0].Legs[0].DepartureDateTime.Estimated.toString().substr(11, 5);
                        flightModel.STA = FlightDetails.Flights[0].Legs[0].ArrivalDateTime.Scheduled.toString().substr(11, 5);
                    }
                    flightModel.ArrivalDateTime = FlightDetails.Flights[0].Legs[0].ArrivalDateTime.Scheduled;
                    flightModel.Status = FlightDetails.Flights[0].Legs[0].Status;
                } else {
                    flightModel.DepartureAirport = response.FlightSegments[0].Departure;
                    flightModel.DestinationAirport = response.FlightSegments[0].Arrival;
                    flightModel.DepartureDate = moment(response.FlightSegments[0].DepartureDt.toString().substr(0, 10)).format("YYYY-MM-DD");
                    flightModel.FlightNumber = response.FlightSegments[0].FlightNo;
                    flightModel.STD = "N/A";
                    flightModel.ETD = "N/A";
                    flightModel.STA = "N/A";
                    flightModel.DepartureDateTime = moment(response.FlightSegments[0].DepartureDt.toString().substr(0, 10)).format("YYYY-MM-DD");
                    flightModel.Status = "N/A";
                }
                if (response.FlightSegments[0].Passengers) {
                    response.FlightSegments[0].Passengers.forEach((CompPax, CompIndex) => {
                        console.log("Passenger List");
                        let CompPaxObj: appinterface.CompensationSearchModule.CompensationPassengerList = new appinterface.CompensationSearchModule.CompensationPassengerList;
                        CompPaxObj.FlightSegmentId = CompPax.FlightSegmentId;
                        CompPaxObj.GivenName = CompPax.PaxFirstNm;
                        CompPaxObj.LastName = CompPax.PaxLastNm;
                        CompPaxObj.FullName = CompPax.PaxLastNm + "/" + CompPax.PaxFirstNm;
                        CompPaxObj.OrderId = CompPax.OrderId;
                        CompPaxObj.AdditionalDetails = "Edit";
                        if (CompPax.CabinClass == null) {
                            CompPaxObj.Cabin = "";
                        } else {
                            CompPaxObj.Cabin = CompPax.CabinClass;
                        }
                        CompPaxObj.CheckedInIndicator = CompPax.CheckedInIndicator;
                        if (CompPax.Compensations) {
                            CompPaxObj.CompensationReasonId = CompPax.Compensations[0].CompReasonId;
                            CompPaxObj.CompensationReason = CompPax.Compensations[0].CompReasonText;
                        } else {
                            CompPaxObj.CompensationReason = "";
                        }
                        if (CompPax.SSRS) {
                            CompPax.SSRS.forEach((SSRs, Index) => {
                                CompPaxObj.SSRsCount = SSRs.SSRsCount;
                                SSRs.SpecialRequest.forEach((SSR, index) => {
                                    CompPaxObj.SSRs.push(SSR);
                                })
                            })
                        }
                        if (CompPax.FqtvTier == "Gold") {
                            CompPaxObj.Tier = "G";
                        } else if (CompPax.FqtvTier == "Silver") {
                            CompPaxObj.Tier = "S";
                        } else if (CompPax.FqtvTier == "Presidential") {
                            CompPaxObj.Tier = "PP";
                        } else if (CompPax.FqtvTier == "Platinum") {
                            CompPaxObj.Tier = "P";
                        } else {
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
                            CompPax.ExistingCompensations.forEach((exiCompData, exiCompIndex) => {
                                exiCompData.Emds.forEach((exiEMDData, exiEMDIndex) => {
                                    CompPaxObj.ExistingCompensations[exiCompIndex].Emds[exiEMDIndex].IssueDt = moment(exiEMDData.IssueD).format("YYYY-MM-DD");
                                })
                            })
                        }
                        compensationObejct.PassengerList.push(CompPaxObj);
                        // this.NewPassengerList.push(CompPaxObj);
                    })
                }
            } else {
                console.log("Compensation List");
                if (response.Results[0].FlightSegments || response.Results[0].FlightSegments[0].Passengers) {
                    if (FlightDetails.Flights != null) {
                        flightModel.DepartureAirport = FlightDetails.Flights[0].Legs[0].DepartureAirport.LocationCode;
                        flightModel.DestinationAirport = FlightDetails.Flights[0].Legs[0].ArrivalAirport.LocationCode;
                        flightModel.DepartureDate = FlightDetails.Parameters.DepartureDate.toString().substr(0, 10);
                        flightModel.FlightNumber = FlightDetails.Parameters.FlightNumber;
                        flightModel.DepartureDateTime = FlightDetails.Flights[0].Legs[0].DepartureDateTime.Scheduled;
                        flightModel.ArrivalDateTime = FlightDetails.Flights[0].Legs[0].ArrivalDateTime.Scheduled;
                        if (FlightDetails.Flights[0].Legs.length > 1) {
                            console.log("legs inside");
                            console.log(loc);
                            let legs = FlightDetails.Flights[0].Legs.filter(m => m.DepartureAirport.LocationCode == loc)[0];
                            flightModel.STD = legs.DepartureDateTime.Scheduled.toString().substr(11, 5);
                            flightModel.ETD = legs.DepartureDateTime.Estimated.toString().substr(11, 5);
                            flightModel.STA = legs.ArrivalDateTime.Scheduled.toString().substr(11, 5);
                            flightModel.finalDestination = FlightDetails.Flights[0].Legs[1].ArrivalAirport.LocationCode
                            flightModel.multiLegFlight = true;
                        } else {
                            flightModel.STD = FlightDetails.Flights[0].Legs[0].DepartureDateTime.Scheduled.toString().substr(11, 5);
                            flightModel.ETD = FlightDetails.Flights[0].Legs[0].DepartureDateTime.Estimated.toString().substr(11, 5);
                            flightModel.STA = FlightDetails.Flights[0].Legs[0].ArrivalDateTime.Scheduled.toString().substr(11, 5);
                        }
                        flightModel.Status = FlightDetails.Flights[0].Legs[0].Status;
                    } else {
                        flightModel.DepartureAirport = response.Results[0].FlightSegments[0].Departure;
                        flightModel.DestinationAirport = response.Results[0].FlightSegments[0].Arrival;
                        flightModel.DepartureDate = response.Results[0].FlightSegments[0].DepartureDt;
                        flightModel.FlightNumber = response.Results[0].FlightSegments[0].AirlineCode + response.Results[0].FlightSegments[0].FlightNo;
                        flightModel.STD = "N/A";
                        flightModel.ETD = "N/A";
                        flightModel.STA = "N/A";
                        flightModel.Status = "N/A";
                        flightModel.DepartureDateTime = response.Results[0].FlightSegments[0].DepartureDt;
                    }
                    response.Results[0].FlightSegments[0].Passengers.forEach((CompPax, CompIndex) => {
                        console.log("came here");
                        let CompPaxObj: appinterface.CompensationSearchModule.CompensationPassengerList = new appinterface.CompensationSearchModule.CompensationPassengerList;
                        CompPaxObj.FlightSegmentId = CompPax.FlightSegmentId;
                        CompPaxObj.GivenName = CompPax.PaxFirstNm;
                        CompPaxObj.LastName = CompPax.PaxLastNm;
                        CompPaxObj.FullName = CompPax.PaxLastNm + "/" + CompPax.PaxFirstNm;
                        CompPaxObj.OrderId = CompPax.OrderId;
                        CompPaxObj.AdditionalDetails = "Edit";
                        if (CompPax.CabinClass == null) {
                            CompPaxObj.Cabin = "";
                        } else {
                            CompPaxObj.Cabin = CompPax.CabinClass;
                        }
                        if (CompPax.Compensations) {
                            CompPaxObj.CompensationReasonId = CompPax.Compensations[0].CompReasonId;
                            CompPaxObj.CompensationReason = CompPax.Compensations[0].CompReasonText;
                        } else {
                            CompPaxObj.CompensationReason = "";
                        }
                        if (CompPax.SSRS) {
                            CompPax.SSRS.forEach((SSRs, Index) => {
                                CompPaxObj.SSRsCount = SSRs.SSRsCount;
                                SSRs.SpecialRequest.forEach((SSR, index) => {
                                    CompPaxObj.SSRs.push(SSR);
                                })
                            })
                        }
                        if (CompPax.FqtvTier == "Gold") {
                            CompPaxObj.Tier = "G";
                        } else if (CompPax.FqtvTier == "Silver") {
                            CompPaxObj.Tier = "S";
                        } else if (CompPax.FqtvTier == "Presidential") {
                            CompPaxObj.Tier = "PP";
                        } else if (CompPax.FqtvTier == "Platinum") {
                            CompPaxObj.Tier = "P";
                        } else {
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
                            CompPax.ExistingCompensations.forEach((exiCompData, exiCompIndex) => {
                                if (CompPax.Compensations[0].CompReasonText === exiCompData.CompReasonText && CompPax.Compensations[0].FlightNo === exiCompData.FlightNo) {
                                    exiCompData.Emds.forEach((exiEMDData, exiEMDIndex) => {
                                        if (exiCompData.CompTypeText == "Monetary") {
                                            CompPaxObj.monetary = CompPaxObj.monetary + Number(exiEMDData.CompAmt);
                                            if (exiCompData.Emds[0].Endorsements1Txt) {
                                                CompPaxObj.monetaryendorsementTextItems = exiCompData.Emds[0].Endorsements1Txt.split('.');
                                            }
                                            CompPaxObj.MonetaryOverrideReason = exiCompData.Emds[0].OverrideReason;
                                            if (exiCompData.Emds[0].EmailStatus != null) {
                                                if (exiCompData.Emds[0].EmailStatus == "y") {
                                                    CompPaxObj.monetaryEmailStatus = true;
                                                } else {
                                                    CompPaxObj.monetaryEmailStatus = false;
                                                }
                                            } else {
                                                CompPaxObj.monetaryEmailStatus = false;
                                            }
                                            if (exiCompData.Emds[0].PrintStatus != null) {
                                                if (exiCompData.Emds[0].PrintStatus == "y") {
                                                    CompPaxObj.monetaryPrintStatus = true;
                                                } else {
                                                    CompPaxObj.monetaryPrintStatus = false;
                                                }
                                            } else {
                                                CompPaxObj.monetaryPrintStatus = false;
                                            }
                                        } else if (exiCompData.CompTypeText == "Hotel") {
                                            CompPaxObj.hotel = CompPaxObj.hotel + Number(exiEMDData.VoucherCnt);
                                            CompPaxObj.HotelOverrideReason = exiCompData.Emds[0].OverrideReason;
                                            CompPaxObj.hotelDetails = exiCompData.Emds[0].RemarkTxt;
                                            CompPaxObj.hotelendorsementTextItems = exiCompData.Emds[0].Endorsements1Txt.split('.');
                                            if (exiCompData.Emds[0].PrintStatus != null) {
                                                if (exiCompData.Emds[0].PrintStatus == "y") {
                                                    CompPaxObj.hotelPrintStatus = true;
                                                } else {
                                                    CompPaxObj.hotelPrintStatus = false;
                                                }
                                            } else {
                                                CompPaxObj.hotelPrintStatus = false;
                                            }
                                        } else if (exiCompData.CompTypeText == "Meal") {
                                            CompPaxObj.meal = CompPaxObj.meal + Number(exiEMDData.VoucherCnt);
                                            CompPaxObj.MealOverrideReason = exiCompData.Emds[0].OverrideReason;
                                            CompPaxObj.mealDetails = exiCompData.Emds[0].RemarkTxt;
                                            CompPaxObj.mealendorsementTextItems = exiCompData.Emds[0].Endorsements1Txt.split('.');
                                            if (exiCompData.Emds[0].PrintStatus != null) {
                                                if (exiCompData.Emds[0].PrintStatus == "y") {
                                                    CompPaxObj.mealPrintStatus = true;
                                                } else {
                                                    CompPaxObj.mealPrintStatus = false;
                                                }
                                            } else {
                                                CompPaxObj.mealPrintStatus = false;
                                            }
                                        } else {
                                            CompPaxObj.transportation = CompPaxObj.transportation + Number(exiEMDData.VoucherCnt);
                                            CompPaxObj.TransportOverrideReason = exiCompData.Emds[0].OverrideReason;
                                            CompPaxObj.transportEMD = exiCompData.Emds[0].RemarkTxt;
                                            CompPaxObj.transportationendorsementTextItems = exiCompData.Emds[0].Endorsements1Txt.split('.');
                                            if (exiCompData.Emds[0].PrintStatus != null) {
                                                if (exiCompData.Emds[0].PrintStatus == "y") {
                                                    CompPaxObj.transportPrintStatus = true;
                                                } else {
                                                    CompPaxObj.transportPrintStatus = false;
                                                }
                                            } else {
                                                CompPaxObj.transportPrintStatus = false;
                                            }
                                        }
                                        CompPaxObj.ExistingCompensations[exiCompIndex].Emds[exiEMDIndex].IssueDt = moment(exiEMDData.IssueDt).format("YYYY-MM-DD");
                                    })
                                }
                            })
                        }
                        compensationObejct.PassengerList.push(CompPaxObj);
                        // this.NewPassengerList.push(CompPaxObj);
                    })
                }
            }
            console.dir(compensationObejct);
            return compensationObejct;
        } catch (error) {

            console.log(error.message);

        }
    }
    //Compensation Order List
    public static convertToFlightHeaderInfo(response: any, location: any): appinterface.CompensationSearchModule.FlightModel {
        try {
            let FlightObejct: appinterface.CompensationSearchModule.FlightModel = new appinterface.CompensationSearchModule.FlightModel;
            if (response.Flights != null) {
                let flightModel: appinterface.CompensationSearchModule.FlightModel = new appinterface.CompensationSearchModule.FlightModel;
                flightModel.DepartureAirport = response.Flights[0].Legs[0].DepartureAirport.LocationCode;
                flightModel.DestinationAirport = response.Flights[0].Legs[0].ArrivalAirport.LocationCode;
                flightModel.DepartureDate = response.Flights[0].Date.toString().substr(0, 10);
                console.log("flight HeaderInfo");
                flightModel.FlightNumber = response.Flights[0].Number;
                flightModel.DepartureDateTime = response.Flights[0].Legs[0].DepartureDateTime;
                flightModel.ArrivalDateTime = response.Flights[0].Legs[0].ArrivalDateTime;
                if (response.Flights[0].Legs.length > 1) {
                    let legs = response.Flights[0].Legs.filter(m => m.DepartureAirport.LocationCode == location)[0];
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
        } catch (error) {
            console.log(error.message);
        }
    }


    //BRE Response
    public static convertToBREResponseForOrderId(response: any, Paxresponse: Array<appinterface.CompensationOrderID.Passenger>): Array<appinterface.CompensationOrderID.FlightSegment> {
        try {
            var sDate = new Date();
            console.log('Convert IssueCompensation Template --------------- Start Date Time : ' + sDate);
            let SegArray = [new appinterface.CompensationOrderID.FlightSegment];
            SegArray.length = 0;
            if (response.Results != null) {
                if (response.Results[0].FlightSegments != null && response.Results[0].FlightSegments.length > 0) {
                    response.Results[0].FlightSegments.forEach((Segdata, Index) => {
                        let SegObj: appinterface.CompensationOrderID.FlightSegment = new appinterface.CompensationOrderID.FlightSegment;
                        SegObj.FlightSegmentId = Segdata.FlightSegmentId;
                        SegObj.AirlineCode = Segdata.AirlineCode;
                        SegObj.FlightNo = Segdata.FlightNo;
                        SegObj.Arrival = Segdata.Arrival;
                        SegObj.FlightSegmentRPH = Segdata.FlightSegmentRPH;
                        SegObj.Departure = Segdata.Departure;
                        SegObj.DepartureDt = Segdata.DepartureDt;
                        SegObj.Passengers = [new appinterface.CompensationOrderID.Passenger];
                        SegObj.Passengers.length = 0;
                        Segdata.Passengers.forEach((element, index) => {
                            Paxresponse.forEach((paxElement, Index) => {
                                if (paxElement.GivenName == element.PaxFirstNm && paxElement.LastName == element.PaxLastNm && paxElement.OrderId == element.OrderId) {
                                    let paxEle: appinterface.CompensationOrderID.Passenger = new appinterface.CompensationOrderID.Passenger();
                                    paxEle.BREEmd = [new appinterface.CompensationOrderID.BREEmd()];
                                    paxEle.BREEmd.length = 0;
                                    if (Segdata.BREemd != null && Segdata.BREemd.length > 0) {
                                        Segdata.BREemd.forEach((element, index) => {
                                            let objEMD: appinterface.CompensationOrderID.BREEmd = new appinterface.CompensationOrderID.BREEmd();
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
                                                paxEle.monetaryendorsementTextItems = element.endorsementTextItems;
                                            } else if (element.compensationType == "Hotel") {
                                                paxEle.hotelendorsementTextItems = element.endorsementTextItems;
                                            }
                                            else if (element.compensationType == "Meal") {
                                                paxEle.mealendorsementTextItems = element.endorsementTextItems;
                                            } else {
                                                paxEle.transportationendorsementTextItems = element.endorsementTextItems;
                                            }
                                            objEMD.formOfPayment = element.formOfPayment;
                                            objEMD.productCode = element.productCode;
                                            objEMD.productName = element.productName;
                                            objEMD.subProductCode = element.subProductCode;
                                            paxEle.BREEmd.push(objEMD);
                                        });
                                    }
                                    element.BRE_Compensations.forEach((compensations, index) => {
                                        if (compensations.compensationType == "Monetary") {
                                            paxEle.monetary = compensations.amount;
                                            paxEle.monetaryLowerLimit = compensations.lowerLimit;
                                            paxEle.monetaryHigherLimit = compensations.upperLimit;
                                        } else if (compensations.compensationType == "Hotel") {
                                            paxEle.hotel = compensations.amount;
                                            paxEle.hotelLowerLimit = compensations.lowerLimit;
                                            paxEle.hotelHigherLimit = compensations.upperLimit;
                                        }
                                        else if (compensations.compensationType == "Meal") {
                                            paxEle.meal = compensations.amount;
                                            paxEle.mealLowerLimit = compensations.lowerLimit;
                                            paxEle.mealHigherLimit = compensations.upperLimit;
                                        } else {
                                            paxEle.transportation = compensations.amount;
                                            paxEle.transportationLowerLimit = compensations.lowerLimit;
                                            paxEle.transportationHigherLimit = compensations.upperLimit;
                                        }
                                    })
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
                                    paxEle.BRECompensation = element.BRE_Compensations;
                                    paxEle.IsExistingCompensation = element.IsExistingCompensation;
                                    paxEle.UpdateLockNbr = element.UpdateLockNbr;
                                    paxEle.FqtvTier = element.FqtvTier;
                                    paxEle.Cabin = element.CabinClass;
                                    paxEle.PaxRPH = element.PaxRPH;
                                    paxEle.IsCompensationIssued = element.IsCompensationIssued;
                                    paxEle.SSR = element.SSR;
                                    paxEle.Etkt = element.Etkt;
                                    paxEle.ReaccomDetails = element.ReaccomDetails;
                                    paxEle.Bags = element.Bags;
                                    paxEle.Compensations = element.Compensations;
                                    paxEle.ExistingCompensations = element.ExistingCompensations;
                                    paxEle.AdditionalDetails = "Edit";


                                    SegObj.Passengers.push(paxEle);
                                }
                            });

                        })

                        SegArray.push(SegObj);
                    })
                }

            }


            var eDate = new Date();
            console.log('Convert IssueCompensation Template --------------- End Date Time : ' + eDate);
            console.log('Convert IssueCompensation Template Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
            return SegArray;
        }
        catch (error) {
            console.log(error.message);
        }
    }

    public static convertToBREResponse(response: any, Paxresponse: Array<appinterface.CompensationSearchModule.CompensationPassengerList>): Array<appinterface.CompensationSearchModule.CompensationPassengerList> {
        try {
            var sDate = new Date();
            console.log('Convert IssueCompensation Template --------------- Start Date Time : ' + sDate);
            Paxresponse.forEach((paxEle, Index) => {
                if (response.Results != null) {
                    if (response.Results[0].FlightSegments != null && response.Results[0].FlightSegments.length > 0) {
                        response.Results[0].FlightSegments[0].Passengers.forEach((element, index) => {

                            if (paxEle.GivenName == element.PaxFirstNm && paxEle.LastName == element.PaxLastNm && paxEle.OrderId == element.OrderId) {
                                paxEle.BREEmd = [new appinterface.CompensationSearchModule.BREEmd()];
                                paxEle.BREEmd.length = 0;
                                if (response.Results[0].FlightSegments[0].BREemd != null && response.Results[0].FlightSegments[0].BREemd.length > 0) {
                                    response.Results[0].FlightSegments[0].BREemd.forEach((element, index) => {
                                        let objEMD: appinterface.CompensationSearchModule.BREEmd = new appinterface.CompensationSearchModule.BREEmd();
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
                                        } else if (element.compensationType == "Hotel") {
                                            paxEle.hotelendorsementTextItems = element.endorsementTextItems;
                                        }
                                        else if (element.compensationType == "Meal") {
                                            paxEle.mealendorsementTextItems = element.endorsementTextItems;
                                        } else {
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
                                element.BRE_Compensations.forEach((compensations, index) => {
                                    if (compensations.compensationType == "Monetary") {
                                        paxEle.monetary = compensations.amount;
                                        paxEle.monetaryInitialValue = compensations.amount;
                                        paxEle.monetaryTempValue = compensations.amount;
                                        paxEle.monetaryLowerLimit = compensations.lowerLimit;
                                        paxEle.monetaryHigherLimit = compensations.upperLimit;
                                    } else if (compensations.compensationType == "Hotel") {
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
                                    } else {
                                        paxEle.transportation = compensations.amount;
                                        paxEle.transportationInitialValue = compensations.amount;
                                        paxEle.transportationTempValue = compensations.amount;
                                        paxEle.transportationLowerLimit = compensations.lowerLimit;
                                        paxEle.transportationHigherLimit = compensations.upperLimit;
                                    }
                                })
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
                                } else {
                                    paxEle.Cabin = element.CabinClass;
                                }
                                paxEle.PaxRPH = element.PaxRPH;
                                paxEle.IsCompensationIssued = element.IsCompensationIssued;
                                paxEle.SSR = element.SSR;
                                if (element.SSRS) {
                                    element.SSRS.forEach((SSRs, Index) => {
                                        paxEle.SSRsCount = SSRs.SSRsCount;
                                        SSRs.SpecialRequest.forEach((SSR, index) => {
                                            paxEle.SSRs.push(SSR);
                                        })
                                    })
                                }
                                paxEle.Etkt = element.Etkt;
                                paxEle.ReaccomDetails = element.ReaccomDetails;
                                paxEle.Bags = element.Bags;
                                paxEle.Compensations = element.Compensations;
                                paxEle.ExistingCompensations = element.ExistingCompensations;
                                paxEle.AdditionalDetails = "Edit";



                            }
                        })
                    }
                }
            });

            var eDate = new Date();
            console.log('Convert IssueCompensation Template --------------- End Date Time : ' + eDate);
            console.log('Convert IssueCompensation Template Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
            return Paxresponse;
        }
        catch (error) {
            console.log(error.message);
        }
    }

    public static ConvertToCompPaxTemplateByFQTV(response: any): appinterface.OrderFQTVStatus[] {
        try {
            var sDate = new Date();
            console.log('ConvertToCompensationFQTVStatus Template --------------- Start Date Time : ' + sDate);
            let CompObj: Array<appinterface.OrderFQTVStatus> = [];
            if (response != null && response.length > 0) {
                response.forEach((element, index) => {
                    let obj: appinterface.OrderFQTVStatus = new appinterface.OrderFQTVStatus();
                    obj.OrderID = element.OrderID;
                    obj.PassengerName = element.PassengerName;
                    obj.Status = element.Status;
                    obj.FlightNumber = element.FlightNumber;
                    obj.FlightDate = element.FlightDate.toString().substr(0, 10);
                    obj.RPH = element.RPH;
                    obj.Origin = element.Origin;
                    obj.Destination = element.Destination;
                    CompObj.push(obj);
                });
            }
            var eDate = new Date();
            console.log('ConvertToCompensationFQTVStatus Template --------------- End Date Time : ' + eDate);
            console.log('ConvertToCompensationFQTVStatus Template Execution Time : ' + AppExecutiontime.ExecutionTime(new Date(sDate), new Date(eDate)));
            return CompObj;

        }
        catch (error) {
            console.log(error.message);
        }
    }
    public static convertToBRERequest(paxresponse: Array<appinterface.CompensationSearchModule.CompensationPassengerList>, privilage: any, flightresponse: appinterface.CompensationSearchModule.FlightModel): appmodel.BreRequest.RootObject {
        try {
            let obj: appmodel.BreRequest.RootObject = new appmodel.BreRequest.RootObject();
            obj.SourceId = "PSS_TABLET";
            obj.privilege = privilage;
            obj.UserId = ApplicationSettings.getString("UserName", "");
            obj.FlightSegments = [new appmodel.BreRequest.FlightSegment()];
            obj.FlightSegments.length = 0;
            let objFlight: appmodel.BreRequest.FlightSegment = new appmodel.BreRequest.FlightSegment();
            objFlight.FlightSegmentId = paxresponse[0].FlightSegmentId;
            objFlight.AirlineCode = flightresponse.FlightNumber.substr(0, 2);
            objFlight.FlightNo = flightresponse.FlightNumber.substr(2);
            objFlight.DepartureDt = flightresponse.DepartureDate;
            objFlight.Departure = flightresponse.DepartureAirport;
            objFlight.Arrival = flightresponse.DestinationAirport;
            objFlight.FlightSegmentRPH = null;

            objFlight.Passengers = [new appmodel.BreRequest.Passenger()];
            objFlight.Passengers.length = 0;
            paxresponse.forEach((data, Index) => {
                let objPax: appmodel.BreRequest.Passenger = new appmodel.BreRequest.Passenger();
                if (data.FlightSegmentId) {
                    objPax.FlightSegmentId = data.FlightSegmentId.toString();;
                } else {
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
                } else {
                    objPax.FqtvTier = data.TierName;
                }
                if (data.Cabin == "") {
                    objPax.CabinClass = null;
                } else {
                    objPax.CabinClass = data.Cabin;
                }
                objPax.PaxRPH = data.PaxRPH;
                objPax.CompReasonText = data.CompensationReason;
                objPax.SSR = [new appmodel.BreRequest.SSRs()];
                objPax.SSR.length = 0;
                if (data.SSRs) {
                    data.SSRs.forEach((SSR, Index) => {
                        let ssrObj: appmodel.BreRequest.SSRs = new appmodel.BreRequest.SSRs();
                        ssrObj.FlightSegmentId = data.FlightSegmentId;
                        ssrObj.PassengerSeq = data.PassengerSeq;
                        ssrObj.SsrCode = SSR;
                    })
                }
                if (data.Etkt == null) {
                    objPax.Etkt = [];
                } else {
                    objPax.Etkt = data.Etkt;
                }
                console.log(JSON.stringify(data.ReaccomDetails));
                if (data.ReaccomDetails) {
                    objPax.ReaccomDetails = [new appmodel.SaveCompensationRequest.ReaccomDetail()];
                    objPax.ReaccomDetails.length = 0;
                    data.ReaccomDetails.forEach((ReaccData, Index) => {
                        let reaccomObj: appmodel.SaveCompensationRequest.ReaccomDetail = new appmodel.SaveCompensationRequest.ReaccomDetail();
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
                    })
                } else {
                    objPax.ReaccomDetails = [];
                } if (data.Bags == null) {
                    objPax.Bags = [];
                } else {
                    objPax.Bags = data.Bags;
                }
                objPax.Compensations = [];
                objFlight.Passengers.push(objPax);
            });

            obj.FlightSegments.push(objFlight);

            return obj;
        } catch (error) {
            console.log(error.message);
        }
    }

    public static convertToBRERequestForOrderID(response: appinterface.CompensationOrderID.RootObject, paxresponse: Array<appinterface.CompensationOrderID.Passenger>, privilage: any, flightresponse: appinterface.CompensationSearchModule.FlightModel): appmodel.BreRequest.RootObject {
        try {
            console.log("in 0" + JSON.stringify(paxresponse));
            let obj: appmodel.BreRequest.RootObject = new appmodel.BreRequest.RootObject();
            obj.SourceId = "PSS_TABLET";
            obj.privilege = privilage;
            obj.UserId = ApplicationSettings.getString("UserName", "");
            obj.FlightSegments = [new appmodel.BreRequest.FlightSegment()];
            obj.FlightSegments.length = 0;
            response.FlightSegments.forEach((Segdata, SegIndex) => {
                let objFlight: appmodel.BreRequest.FlightSegment = new appmodel.BreRequest.FlightSegment();
                objFlight.FlightSegmentId = Segdata.FlightSegmentId;
                objFlight.AirlineCode = Segdata.AirlineCode;
                objFlight.FlightNo = Segdata.FlightNo.substr(2);
                objFlight.DepartureDt = Segdata.DepartureDt;
                objFlight.Departure = Segdata.Departure;
                objFlight.Arrival = Segdata.Arrival;
                objFlight.FlightSegmentRPH = Segdata.FlightSegmentRPH;
                objFlight.Passengers = [new appmodel.BreRequest.Passenger()];
                objFlight.Passengers.length = 0;
                Segdata.Passengers.forEach((PaxData, index) => {
                    console.log("in 0");
                    paxresponse.forEach((data, PaxIndex) => {
                        console.log("in 1");
                        if (data.GivenName == PaxData.PaxFirstNm && data.LastName == PaxData.PaxLastNm) {
                            console.log("in 2");
                            let objPax: appmodel.BreRequest.Passenger = new appmodel.BreRequest.Passenger();
                            if (data.FlightSegmentId) {
                                objPax.FlightSegmentId = data.FlightSegmentId.toString();;
                            } else {
                                objPax.FlightSegmentId = null;
                            }
                            objPax.PassengerSeq = data.PassengerSeq;
                            objPax.OrderId = data.OrderId;
                            objPax.PaxLastNm = data.LastName;
                            objPax.PaxFirstNm = data.GivenName;
                            if (data.PaxType == "") {
                                objPax.PaxType = null;
                            } else {
                                objPax.PaxType = data.PaxType;
                            }
                            objPax.PaxCompReasonId = data.CompensationReasonId.toString();
                            objPax.FqtvCc = data.FqtvCc;
                            objPax.FqtvNumber = data.FqtvNumber;
                            objPax.PaxStatus = data.PaxStatus;
                            objPax.PaxEmailAddress = "";
                            objPax.PaxFirstNm = data.GivenName;
                            objPax.UpdateLockNbr = data.UpdateLockNbr;
                            if (data.FqtvTier == "") {
                                objPax.FqtvTier = null;
                            } else {
                                objPax.FqtvTier = data.FqtvTier;
                            }
                            objPax.CabinClass = data.Cabin;
                            objPax.PaxRPH = data.PaxRPH;
                            objPax.CompReasonText = data.CompensationReason;
                            if (data.SSR == null) {
                                objPax.SSR = [];
                            } else {
                                objPax.SSR = data.SSR;
                            }
                            if (data.Etkt == null) {
                                objPax.Etkt = [];
                            } else {
                                objPax.Etkt = data.Etkt;
                            }
                            console.log(JSON.stringify(data.ReaccomDetails));
                            if (data.ReaccomDetails) {
                                objPax.ReaccomDetails = [new appmodel.SaveCompensationRequest.ReaccomDetail()];
                                objPax.ReaccomDetails.length = 0;
                                data.ReaccomDetails.forEach((ReaccData, Index) => {
                                    let reaccomObj: appmodel.SaveCompensationRequest.ReaccomDetail = new appmodel.SaveCompensationRequest.ReaccomDetail();
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
                                })
                            } else {
                                objPax.ReaccomDetails = [];
                            } if (data.Bags == null) {
                                objPax.Bags = [];
                            } else {
                                objPax.Bags = data.Bags;
                            }
                            objPax.Compensations = [];
                            objFlight.Passengers.push(objPax);
                        }
                    })

                })
                obj.FlightSegments.push(objFlight);
            })



            return obj;
        } catch (error) {
            console.log(error.message);
        }
    }
    public static convertToSaveCompensationTemplate(paxresponse: Array<appinterface.CompensationSearchModule.CompensationPassengerList>, flightresponse: appinterface.CompensationSearchModule.FlightModel): appmodel.SaveCompensationRequest.RootObject {
        try {
            let Obj: appmodel.SaveCompensationRequest.RootObject = new appmodel.SaveCompensationRequest.RootObject();
            Obj.SourceId = "PSS_TABLET";
            Obj.UserId = ApplicationSettings.getString("UserName", "");
            let FlightObj: appmodel.SaveCompensationRequest.FlightSegment[] = [new appmodel.SaveCompensationRequest.FlightSegment];
            FlightObj.length = 0;
            Obj.FlightSegments = [new appmodel.SaveCompensationRequest.FlightSegment()];
            Obj.FlightSegments.length = 0;
            let flightele: appmodel.SaveCompensationRequest.FlightSegment = new appmodel.SaveCompensationRequest.FlightSegment();
            flightele.Passengers = [new appmodel.SaveCompensationRequest.Passenger()];
            flightele.Passengers.length = 0;
            flightele.AirlineCode = flightresponse.FlightNumber.substr(0, 2);
            flightele.Arrival = flightresponse.DestinationAirport;
            flightele.Departure = flightresponse.DepartureAirport;
            flightele.DepartureDt = flightresponse.DepartureDate;
            flightele.FlightNo = flightresponse.FlightNumber.substr(2);
            flightele.FlightSegmentId = paxresponse[0].FlightSegmentId;
            paxresponse.forEach((PaxEle, Index) => {
                let paxObj: appmodel.SaveCompensationRequest.Passenger = new appmodel.SaveCompensationRequest.Passenger();
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
                    PaxEle.ReaccomDetails.forEach((ReaccData, Index) => {
                        // if (ReaccData.ReaccomFlightNo != "") {
                        let reaccomObj: appmodel.SaveCompensationRequest.ReaccomDetail = new appmodel.SaveCompensationRequest.ReaccomDetail();
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
                    })
                } else {
                    paxObj.ReaccomDetails = null;
                }
                flightele.Passengers.push(paxObj);
            });

            Obj.FlightSegments.push(flightele);
            return Obj;
        } catch (error) {
            console.log(error.message);
        }
    }
    public static convertToSaveCompensationTemplateForPrint(paxresponse: Array<appinterface.CompensationSearchModule.CompensationPassengerList>, flightresponse: appinterface.CompensationSearchModule.FlightModel): appmodel.SaveCompensationRequest.RootObject {
        try {
            let Obj: appmodel.SaveCompensationRequest.RootObject = new appmodel.SaveCompensationRequest.RootObject();
            Obj.SourceId = "PSS_TABLET";
            Obj.UserId = ApplicationSettings.getString("UserName", "");
            let FlightObj: appmodel.SaveCompensationRequest.FlightSegment[] = [new appmodel.SaveCompensationRequest.FlightSegment];
            FlightObj.length = 0;
            Obj.FlightSegments = [new appmodel.SaveCompensationRequest.FlightSegment()];
            Obj.FlightSegments.length = 0;
            let flightele: appmodel.SaveCompensationRequest.FlightSegment = new appmodel.SaveCompensationRequest.FlightSegment();
            flightele.Passengers = [new appmodel.SaveCompensationRequest.Passenger()];
            flightele.Passengers.length = 0;
            flightele.AirlineCode = flightresponse.FlightNumber.substr(0, 2);
            flightele.Arrival = flightresponse.DestinationAirport;
            flightele.Departure = flightresponse.DepartureAirport;
            flightele.DepartureDt = flightresponse.DepartureDate;
            flightele.FlightNo = flightresponse.FlightNumber.substr(2);
            flightele.FlightSegmentId = paxresponse[0].FlightSegmentId;
            paxresponse.forEach((PaxEle, Index) => {
                let paxObj: appmodel.SaveCompensationRequest.Passenger = new appmodel.SaveCompensationRequest.Passenger();
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
                paxObj.Compensations.forEach((compData, compIndex) => {
                    if (compData.Emds) {
                        compData.Emds.forEach((emdData, emdIndex) => {
                            emdData.FirstNm = PaxEle.GivenName;
                            emdData.LastNm = PaxEle.LastName;
                            emdData.PrintStatus = "y";
                        })
                    }
                })

                if (PaxEle.ReaccomDetails) {
                    paxObj.ReaccomDetails = [new appmodel.SaveCompensationRequest.ReaccomDetail()];
                    paxObj.ReaccomDetails.length = 0;
                    PaxEle.ReaccomDetails.forEach((ReaccData, Index) => {
                        // if (ReaccData.ReaccomFlightNo != "") {
                        let reaccomObj: appmodel.SaveCompensationRequest.ReaccomDetail = new appmodel.SaveCompensationRequest.ReaccomDetail();
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
                    })
                } else {
                    paxObj.ReaccomDetails = null;
                }
                flightele.Passengers.push(paxObj);
            });

            Obj.FlightSegments.push(flightele);
            return Obj;
        } catch (error) {
            console.log(error.message);
        }
    }
    public static convertToDeleteCompensationTemplate(paxresponse: Array<appinterface.CompensationSearchModule.CompensationPassengerList>, flightresponse: appinterface.CompensationSearchModule.FlightModel): appmodel.SaveCompensationRequest.RootObject {
        try {
            let Obj: appmodel.SaveCompensationRequest.RootObject = new appmodel.SaveCompensationRequest.RootObject();
            Obj.SourceId = "PSS_TABLET";
            Obj.UserId = ApplicationSettings.getString("UserName", "");
            let FlightObj: appmodel.SaveCompensationRequest.FlightSegment[] = [new appmodel.SaveCompensationRequest.FlightSegment];
            FlightObj.length = 0;
            Obj.FlightSegments = [new appmodel.SaveCompensationRequest.FlightSegment()];
            Obj.FlightSegments.length = 0;
            let flightele: appmodel.SaveCompensationRequest.FlightSegment = new appmodel.SaveCompensationRequest.FlightSegment();
            flightele.Passengers = [new appmodel.SaveCompensationRequest.Passenger()];
            flightele.Passengers.length = 0;
            flightele.AirlineCode = flightresponse.FlightNumber.substr(0, 2);
            flightele.Arrival = flightresponse.DestinationAirport;
            flightele.Departure = flightresponse.DepartureAirport;
            flightele.DepartureDt = flightresponse.DepartureDate;
            flightele.FlightNo = flightresponse.FlightNumber.substr(2);
            flightele.FlightSegmentId = paxresponse[0].FlightSegmentId;
            paxresponse.forEach((PaxEle, Index) => {
                let paxObj: appmodel.SaveCompensationRequest.Passenger = new appmodel.SaveCompensationRequest.Passenger();
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
                    PaxEle.ReaccomDetails.forEach((ReaccData, Index) => {
                        let reaccomObj: appmodel.SaveCompensationRequest.ReaccomDetail = new appmodel.SaveCompensationRequest.ReaccomDetail();
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
                    })
                } else {
                    paxObj.ReaccomDetails = null;
                }
                flightele.Passengers.push(paxObj);
            });

            Obj.FlightSegments.push(flightele);
            return Obj;
        } catch (error) {
            console.log(error.message);
        }
    }
    public static convertToIssueCompensation(paxresponse: Array<appinterface.CompensationSearchModule.CompensationPassengerList>, flightresponse: appinterface.CompensationSearchModule.FlightModel, IssueDate: any, AgentProfile: appinterface.AccontProfileModel.AccountProfileTemplate): appmodel.IssueCompensationRequest.RootObject {
        try {
            let Obj: appmodel.IssueCompensationRequest.RootObject = new appmodel.IssueCompensationRequest.RootObject();
            Obj.SourceId = "PSS_TABLET";
            Obj.UserId = ApplicationSettings.getString("UserName", "");
            Obj.AddOrderFlow = "N";
            Obj.FlightSegments = [new appmodel.IssueCompensationRequest.FlightSegment()];
            Obj.FlightSegments.length = 0;
            let flightele: appmodel.IssueCompensationRequest.FlightSegment = new appmodel.IssueCompensationRequest.FlightSegment();
            flightele.Passengers = [new appmodel.IssueCompensationRequest.Passenger()];
            flightele.Passengers.length = 0;
            flightele.AirlineCode = flightresponse.FlightNumber.substr(0, 2);
            flightele.Arrival = flightresponse.DestinationAirport;
            flightele.Departure = flightresponse.DepartureAirport;
            flightele.DepartureDt = flightresponse.DepartureDate;
            // flightele.FlightNo = flightresponse.FlightNumber.substr(2);
            flightele.FlightSegmentId = paxresponse[0].FlightSegmentId;
            flightele.HasStopover = true;
            // flightele.DepartureDateTime = flightresponse.DepartureDateTime.toString().substr(0, 10);
            // flightele.ArrivalDateTime = flightresponse.ArrivalDateTime;
            paxresponse.forEach((PaxEle, Index) => {
                let paxObj: appmodel.IssueCompensationRequest.Passenger = new appmodel.IssueCompensationRequest.Passenger();
                paxObj.FlightSegmentId = PaxEle.FlightSegmentId.toString();
                paxObj.PassengerSeq = PaxEle.PassengerSeq.toString();
                paxObj.OrderId = PaxEle.OrderId;
                paxObj.PaxLastNm = PaxEle.LastName;
                paxObj.PaxFirstNm = PaxEle.GivenName;
                if (PaxEle.PassengerType == "") {
                    paxObj.PaxType = null;
                } else {
                    paxObj.PaxType = PaxEle.PassengerType;
                }
                paxObj.FqtvCc = PaxEle.FqtvCc;
                if (PaxEle.FqtvNumber != undefined) {
                    paxObj.FqtvNumber = PaxEle.FqtvNumber;
                } else {
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
                } else {
                    paxObj.SSR = PaxEle.SSR;
                }
                if (PaxEle.SSRs != []) {
                    PaxEle.SSRs.forEach((SSR, Index) => {
                        let ssrObj: appmodel.BreRequest.SSRs = new appmodel.BreRequest.SSRs();
                        ssrObj.FlightSegmentId = PaxEle.FlightSegmentId;
                        ssrObj.PassengerSeq = PaxEle.PassengerSeq;
                        ssrObj.SsrCode = SSR;
                    })
                } else {
                    paxObj.SSRs = [];
                }
                paxObj.Etkt = [];
                if (PaxEle.ReaccomDetails) {
                    paxObj.ReaccomDetails = [new appmodel.SaveCompensationRequest.ReaccomDetail()];
                    paxObj.ReaccomDetails.length = 0;
                    PaxEle.ReaccomDetails.forEach((ReaccData, Index) => {
                        // if (ReaccData.ReaccomFlightNo != "") {
                        let reaccomObj: appmodel.SaveCompensationRequest.ReaccomDetail = new appmodel.SaveCompensationRequest.ReaccomDetail();
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
                    })
                } else {
                    paxObj.ReaccomDetails = null;
                }
                if (PaxEle.Bags == null) {
                    paxObj.Bags = [];
                } else {
                    paxObj.Bags = PaxEle.Bags;
                } if (PaxEle.ExistingCompensations == null) {
                    paxObj.ExistingCompensations = []
                } else {
                    paxObj.ExistingCompensations = PaxEle.ExistingCompensations;
                }
                paxObj.Compensations = [new appmodel.IssueCompensationRequest.Compensation()];
                paxObj.Compensations.length = 0;
                if (PaxEle.monetary > 0) {
                    let compMoneyObj: appmodel.IssueCompensationRequest.Compensation = new appmodel.IssueCompensationRequest.Compensation();
                    compMoneyObj.FlightSegmentId = PaxEle.FlightSegmentId.toString();
                    compMoneyObj.PassengerSeq = PaxEle.PassengerSeq.toString();
                    compMoneyObj.CompSeq = PaxEle.Compensations.filter(m => m.CompTypeText == "Monetary")[0].CompSeq;
                    compMoneyObj.CompReasonId = PaxEle.CompensationReasonId.toString();
                    compMoneyObj.CompReasonText = PaxEle.CompensationReason;
                    compMoneyObj.CompTypeId = PaxEle.Compensations.filter(m => m.CompTypeText == "Monetary")[0].CompTypeId;
                    compMoneyObj.CompTypeText = "Monetary";
                    // compMoneyObj.OverrideReason = PaxEle.MonetaryOverrideReason;
                    compMoneyObj.UpdateLockNbr = PaxEle.Compensations.filter(m => m.CompTypeText == "Monetary")[0].UpdateLockNbr.toString();
                    compMoneyObj.Remarks = null;
                    compMoneyObj.Endorsement = null;
                    let serviceObj: appmodel.IssueCompensationRequest.Services = new appmodel.IssueCompensationRequest.Services();
                    serviceObj.Taxes = null;
                    serviceObj.passengerRPH = PaxEle.PaxRPH;
                    serviceObj.segmentRPH = null;
                    serviceObj.currencyCode = "USD";
                    serviceObj.amount = PaxEle.monetary.toString();
                    serviceObj.ticketNumber = null;
                    serviceObj.Remarks = null;
                    serviceObj.Endorsement = null;
                    let selectedServiceObj: appmodel.IssueCompensationRequest.SelectedService = new appmodel.IssueCompensationRequest.SelectedService();
                    selectedServiceObj.RFISC_code = PaxEle.BREEmd.filter(m => m.compensationType == "Monetary")[0].productCode;
                    selectedServiceObj.RFISC_subCode = PaxEle.BREEmd.filter(m => m.compensationType == "Monetary")[0].subProductCode;
                    selectedServiceObj.SSRCode = "CHLD";
                    selectedServiceObj.commercialName = PaxEle.BREEmd.filter(m => m.compensationType == "Monetary")[0].productName;
                    selectedServiceObj.EmdType = PaxEle.BREEmd.filter(m => m.compensationType == "Monetary")[0].emdType;
                    selectedServiceObj.TypeOfService = null;
                    selectedServiceObj.emdRefundable = PaxEle.BREEmd.filter(m => m.compensationType == "Monetary")[0].emdRefundable;
                    selectedServiceObj.emdEndorsable = PaxEle.BREEmd.filter(m => m.compensationType == "Monetary")[0].emdEndorsable;
                    selectedServiceObj.emdExchangeable = PaxEle.BREEmd.filter(m => m.compensationType == "Monetary")[0].emdExchangeable;
                    selectedServiceObj.emdUsedAtIssuance = PaxEle.BREEmd.filter(m => m.compensationType == "Monetary")[0].emdUsedAtIssuance;
                    selectedServiceObj.IsRefundable = PaxEle.BREEmd.filter(m => m.compensationType == "Monetary")[0].IsRefundable;
                    serviceObj.selectedService = selectedServiceObj;
                    compMoneyObj.Services = serviceObj;
                    let paymentObj: appmodel.IssueCompensationRequest.Payments = new appmodel.IssueCompensationRequest.Payments();
                    paymentObj.Type = PaxEle.BREEmd.filter(m => m.compensationType == "Monetary")[0].formOfPayment.substr(0, 2);
                    paymentObj.TransactionType = "Authorize";
                    paymentObj.SubType = PaxEle.BREEmd.filter(m => m.compensationType == "Monetary")[0].formOfPayment.substr(3);
                    paymentObj.Description = "Monetary";
                    paymentObj.Amount = PaxEle.monetary.toString();
                    paymentObj.CurrencyCode = PaxEle.BREEmd.filter(m => m.compensationType == "Monetary")[0].currency;
                    paymentObj.AccountCode = PaxEle.BREEmd.filter(m => m.compensationType == "Monetary")[0].accountCode;
                    compMoneyObj.Payments = paymentObj;
                    compMoneyObj.Emds = [new appmodel.IssueCompensationRequest.Emd()];
                    compMoneyObj.Emds.length = 0;
                    let emdObj: appmodel.IssueCompensationRequest.Emd = new appmodel.IssueCompensationRequest.Emd();
                    emdObj.FlightSegmentId = PaxEle.FlightSegmentId.toString();
                    emdObj.PassengerSeq = PaxEle.PassengerSeq.toString();
                    emdObj.CompSeq = PaxEle.Compensations.filter(m => m.CompTypeText == "Monetary")[0].CompSeq;
                    emdObj.PrimaryDocumentNbr = null;
                    emdObj.PrimaryAirlineCd = "CM";
                    emdObj.IssueDt = moment(IssueDate).format("YYYY-MM-DD");
                    emdObj.FirstNm = AgentProfile.FirstName;
                    emdObj.LastNm = AgentProfile.LastName;
                    emdObj.OverrideReason = PaxEle.MonetaryOverrideReason;
                    emdObj.UserId = ApplicationSettings.getString("UserName", "");
                    emdObj.ReasonForIssuanceSubCd = PaxEle.BREEmd.filter(m => m.compensationType == "Monetary")[0].subProductCode;
                    emdObj.ReasonForIssuanceCd = PaxEle.BREEmd.filter(m => m.compensationType == "Monetary")[0].productCode;
                    PaxEle.monetaryendorsementTextItems.forEach((data, Index) => {
                        emdObj.Endorsements1Txt = emdObj.Endorsements1Txt + data;
                    })
                    if (PaxEle.monetaryfreeText != "" || PaxEle.monetaryfreeText != null) {
                        emdObj.Endorsements1Txt = emdObj.Endorsements1Txt + '.?.' + PaxEle.monetaryfreeText + '.';
                    }
                    emdObj.Endorsements1Txt = emdObj.Endorsements1Txt.substr(0, 255);
                    var lastIndexOfDot = emdObj.Endorsements1Txt.lastIndexOf('.');
                    emdObj.Endorsements1Txt = emdObj.Endorsements1Txt.substr(0, lastIndexOfDot);

                    emdObj.RemarkTxt = "";
                    emdObj.CompAmt = PaxEle.monetary.toString();
                    emdObj.CompCurrencyCd = "USD";
                    emdObj.VoucherCnt = "1";
                    emdObj.PointOfSale = ApplicationSettings.getString("userdetails", "").substr(0, 3);
                    compMoneyObj.Emds.push(emdObj);
                    paxObj.Compensations.push(compMoneyObj);
                }
                if (PaxEle.hotel > 0) {
                    let compMealObj: appmodel.IssueCompensationRequest.Compensation = new appmodel.IssueCompensationRequest.Compensation();
                    compMealObj.FlightSegmentId = PaxEle.FlightSegmentId.toString();
                    compMealObj.PassengerSeq = PaxEle.PassengerSeq;
                    compMealObj.CompSeq = PaxEle.Compensations.filter(m => m.CompTypeText == "Hotel")[0].CompSeq;
                    compMealObj.CompReasonId = PaxEle.CompensationReasonId.toString();
                    compMealObj.CompReasonText = PaxEle.CompensationReason;
                    compMealObj.CompTypeId = PaxEle.Compensations.filter(m => m.CompTypeText == "Hotel")[0].CompTypeId;
                    compMealObj.CompTypeText = "Hotel";
                    // compMealObj.OverrideReason = PaxEle.HotelOverrideReason;
                    compMealObj.UpdateLockNbr = PaxEle.Compensations.filter(m => m.CompTypeText == "Hotel")[0].UpdateLockNbr.toString();
                    compMealObj.Remarks = null;
                    compMealObj.Endorsement = null;
                    let serviceObj: appmodel.IssueCompensationRequest.Services = new appmodel.IssueCompensationRequest.Services();
                    serviceObj.Taxes = null;
                    serviceObj.passengerRPH = PaxEle.PaxRPH;
                    serviceObj.segmentRPH = null;
                    serviceObj.currencyCode = "USD";
                    serviceObj.amount = "0";
                    serviceObj.ticketNumber = null;
                    serviceObj.Remarks = null;
                    serviceObj.Endorsement = null;
                    let selectedServiceObj: appmodel.IssueCompensationRequest.SelectedService = new appmodel.IssueCompensationRequest.SelectedService();
                    selectedServiceObj.RFISC_code = PaxEle.BREEmd.filter(m => m.compensationType == "Hotel")[0].productCode;
                    selectedServiceObj.RFISC_subCode = PaxEle.BREEmd.filter(m => m.compensationType == "Hotel")[0].subProductCode;
                    // selectedServiceObj.SSRCode = null;
                    selectedServiceObj.SSRCode = "CHLD";
                    selectedServiceObj.commercialName = PaxEle.BREEmd.filter(m => m.compensationType == "Hotel")[0].productName;
                    selectedServiceObj.EmdType = PaxEle.BREEmd.filter(m => m.compensationType == "Hotel")[0].emdType;
                    selectedServiceObj.emdRefundable = PaxEle.BREEmd.filter(m => m.compensationType == "Hotel")[0].emdRefundable;
                    selectedServiceObj.emdEndorsable = PaxEle.BREEmd.filter(m => m.compensationType == "Hotel")[0].emdEndorsable;
                    selectedServiceObj.emdExchangeable = PaxEle.BREEmd.filter(m => m.compensationType == "Hotel")[0].emdExchangeable;
                    selectedServiceObj.emdUsedAtIssuance = PaxEle.BREEmd.filter(m => m.compensationType == "Hotel")[0].emdUsedAtIssuance;
                    selectedServiceObj.IsRefundable = PaxEle.BREEmd.filter(m => m.compensationType == "Hotel")[0].IsRefundable;
                    serviceObj.selectedService = selectedServiceObj;
                    selectedServiceObj.TypeOfService = null;
                    compMealObj.Services = serviceObj;
                    let paymentObj: appmodel.IssueCompensationRequest.Payments = new appmodel.IssueCompensationRequest.Payments();
                    paymentObj.Type = PaxEle.BREEmd.filter(m => m.compensationType == "Hotel")[0].formOfPayment.substr(0, 2);
                    paymentObj.TransactionType = "Authorize";
                    paymentObj.SubType = PaxEle.BREEmd.filter(m => m.compensationType == "Hotel")[0].formOfPayment.substr(3);
                    paymentObj.Description = "Hotel";
                    paymentObj.Amount = "0";
                    paymentObj.CurrencyCode = PaxEle.BREEmd.filter(m => m.compensationType == "Hotel")[0].currency;
                    paymentObj.AccountCode = PaxEle.BREEmd.filter(m => m.compensationType == "Hotel")[0].accountCode;
                    compMealObj.Payments = paymentObj;
                    compMealObj.Emds = [new appmodel.IssueCompensationRequest.Emd()];
                    compMealObj.Emds.length = 0;
                    let emdObj: appmodel.IssueCompensationRequest.Emd = new appmodel.IssueCompensationRequest.Emd();
                    emdObj.FlightSegmentId = PaxEle.FlightSegmentId.toString();
                    emdObj.PassengerSeq = PaxEle.PassengerSeq;
                    emdObj.CompSeq = PaxEle.Compensations.filter(m => m.CompTypeText == "Hotel")[0].CompSeq;
                    emdObj.PrimaryDocumentNbr = null;
                    emdObj.PrimaryAirlineCd = "CM";
                    emdObj.IssueDt = moment(IssueDate).format("YYYY-MM-DD");
                    emdObj.FirstNm = AgentProfile.FirstName;
                    emdObj.LastNm = AgentProfile.LastName;
                    emdObj.OverrideReason = PaxEle.HotelOverrideReason;
                    emdObj.UserId = ApplicationSettings.getString("UserName", "");
                    emdObj.ReasonForIssuanceSubCd = PaxEle.BREEmd.filter(m => m.compensationType == "Hotel")[0].subProductCode;
                    emdObj.ReasonForIssuanceCd = PaxEle.BREEmd.filter(m => m.compensationType == "Hotel")[0].productCode;
                    PaxEle.hotelendorsementTextItems.forEach((data, Index) => {
                        emdObj.Endorsements1Txt = emdObj.Endorsements1Txt + data;
                    })
                    if (PaxEle.hotelFreeText != "" || PaxEle.hotelFreeText != null) {
                        emdObj.Endorsements1Txt = emdObj.Endorsements1Txt + '.?.' + PaxEle.hotelFreeText + '.';
                    }
                    emdObj.Endorsements1Txt = emdObj.Endorsements1Txt.substr(0, 255);
                    var lastIndexOfDot = emdObj.Endorsements1Txt.lastIndexOf('.');
                    emdObj.Endorsements1Txt = emdObj.Endorsements1Txt.substr(0, lastIndexOfDot);

                    emdObj.RemarkTxt = PaxEle.hotelDetails;
                    emdObj.CompAmt = "0";
                    emdObj.CompCurrencyCd = "USD";
                    emdObj.VoucherCnt = PaxEle.hotel.toString();
                    emdObj.PointOfSale = ApplicationSettings.getString("userdetails", "").substr(0, 3);
                    compMealObj.Emds.push(emdObj);
                    paxObj.Compensations.push(compMealObj);
                }
                if (PaxEle.meal > 0) {
                    let compHotelObj: appmodel.IssueCompensationRequest.Compensation = new appmodel.IssueCompensationRequest.Compensation();
                    compHotelObj.FlightSegmentId = PaxEle.FlightSegmentId.toString();
                    compHotelObj.PassengerSeq = PaxEle.PassengerSeq.toString();
                    compHotelObj.CompSeq = PaxEle.Compensations.filter(m => m.CompTypeText == "Meal")[0].CompSeq;
                    compHotelObj.CompReasonId = PaxEle.CompensationReasonId.toString();
                    compHotelObj.CompReasonText = PaxEle.CompensationReason;
                    compHotelObj.CompTypeId = PaxEle.Compensations.filter(m => m.CompTypeText == "Meal")[0].CompTypeId;
                    compHotelObj.CompTypeText = "Meal";
                    // compHotelObj.OverrideReason = PaxEle.MealOverrideReason;
                    compHotelObj.UpdateLockNbr = PaxEle.Compensations.filter(m => m.CompTypeText == "Meal")[0].UpdateLockNbr.toString();
                    compHotelObj.Remarks = null;
                    compHotelObj.Endorsement = null;
                    let serviceObj: appmodel.IssueCompensationRequest.Services = new appmodel.IssueCompensationRequest.Services();
                    serviceObj.Taxes = null;
                    serviceObj.passengerRPH = PaxEle.PaxRPH;
                    serviceObj.segmentRPH = null;
                    serviceObj.currencyCode = "USD";
                    serviceObj.amount = "0";
                    serviceObj.ticketNumber = null;
                    serviceObj.Remarks = null;
                    serviceObj.Endorsement = null;
                    let selectedServiceObj: appmodel.IssueCompensationRequest.SelectedService = new appmodel.IssueCompensationRequest.SelectedService();
                    selectedServiceObj.RFISC_code = PaxEle.BREEmd.filter(m => m.compensationType == "Meal")[0].productCode;
                    selectedServiceObj.RFISC_subCode = PaxEle.BREEmd.filter(m => m.compensationType == "Meal")[0].subProductCode;
                    selectedServiceObj.SSRCode = "CHLD";
                    selectedServiceObj.commercialName = PaxEle.BREEmd.filter(m => m.compensationType == "Meal")[0].productName;
                    selectedServiceObj.EmdType = PaxEle.BREEmd.filter(m => m.compensationType == "Meal")[0].emdType;
                    selectedServiceObj.TypeOfService = null;
                    selectedServiceObj.emdRefundable = PaxEle.BREEmd.filter(m => m.compensationType == "Meal")[0].emdRefundable;
                    selectedServiceObj.emdEndorsable = PaxEle.BREEmd.filter(m => m.compensationType == "Meal")[0].emdEndorsable;
                    selectedServiceObj.emdExchangeable = PaxEle.BREEmd.filter(m => m.compensationType == "Meal")[0].emdExchangeable;
                    selectedServiceObj.emdUsedAtIssuance = PaxEle.BREEmd.filter(m => m.compensationType == "Meal")[0].emdUsedAtIssuance;
                    selectedServiceObj.IsRefundable = PaxEle.BREEmd.filter(m => m.compensationType == "Meal")[0].IsRefundable;
                    serviceObj.selectedService = selectedServiceObj;
                    compHotelObj.Services = serviceObj;
                    let paymentObj: appmodel.IssueCompensationRequest.Payments = new appmodel.IssueCompensationRequest.Payments();
                    paymentObj.Type = PaxEle.BREEmd.filter(m => m.compensationType == "Meal")[0].formOfPayment.substr(0, 2);
                    paymentObj.TransactionType = "Authorize";
                    paymentObj.SubType = PaxEle.BREEmd.filter(m => m.compensationType == "Meal")[0].formOfPayment.substr(3);
                    paymentObj.Description = "Meal";
                    paymentObj.Amount = "0";
                    paymentObj.CurrencyCode = PaxEle.BREEmd.filter(m => m.compensationType == "Meal")[0].currency;
                    paymentObj.AccountCode = PaxEle.BREEmd.filter(m => m.compensationType == "Meal")[0].accountCode;
                    compHotelObj.Payments = paymentObj;
                    compHotelObj.Emds = [new appmodel.IssueCompensationRequest.Emd()];
                    compHotelObj.Emds.length = 0;
                    let emdObj: appmodel.IssueCompensationRequest.Emd = new appmodel.IssueCompensationRequest.Emd();
                    emdObj.FlightSegmentId = PaxEle.FlightSegmentId.toString();
                    emdObj.PassengerSeq = PaxEle.PassengerSeq;
                    emdObj.CompSeq = PaxEle.Compensations.filter(m => m.CompTypeText == "Meal")[0].CompSeq;
                    emdObj.PrimaryDocumentNbr = null;
                    emdObj.PrimaryAirlineCd = "CM";
                    emdObj.IssueDt = moment(IssueDate).format("YYYY-MM-DD");
                    emdObj.FirstNm = AgentProfile.FirstName;
                    emdObj.LastNm = AgentProfile.LastName;
                    emdObj.OverrideReason = PaxEle.MealOverrideReason;
                    emdObj.UserId = ApplicationSettings.getString("UserName", "");
                    emdObj.ReasonForIssuanceSubCd = PaxEle.BREEmd.filter(m => m.compensationType == "Meal")[0].subProductCode;
                    emdObj.ReasonForIssuanceCd = PaxEle.BREEmd.filter(m => m.compensationType == "Meal")[0].productCode;
                    PaxEle.mealendorsementTextItems.forEach((data, Index) => {
                        emdObj.Endorsements1Txt = emdObj.Endorsements1Txt + data;
                    })
                    if (PaxEle.mealFreeText != "" || PaxEle.mealFreeText != null) {
                        emdObj.Endorsements1Txt = emdObj.Endorsements1Txt + '.?.' + PaxEle.mealFreeText + '.';
                    }
                    emdObj.Endorsements1Txt = emdObj.Endorsements1Txt.substr(0, 255);
                    var lastIndexOfDot = emdObj.Endorsements1Txt.lastIndexOf('.');
                    emdObj.Endorsements1Txt = emdObj.Endorsements1Txt.substr(0, lastIndexOfDot);

                    emdObj.RemarkTxt = PaxEle.mealDetails;
                    emdObj.CompAmt = "0";
                    emdObj.CompCurrencyCd = "USD";
                    emdObj.VoucherCnt = PaxEle.meal.toString();
                    emdObj.PointOfSale = ApplicationSettings.getString("userdetails", "").substr(0, 3);
                    compHotelObj.Emds.push(emdObj);
                    paxObj.Compensations.push(compHotelObj);
                }
                if (PaxEle.transportation > 0) {
                    let compTransportationObj: appmodel.IssueCompensationRequest.Compensation = new appmodel.IssueCompensationRequest.Compensation();
                    compTransportationObj.FlightSegmentId = PaxEle.FlightSegmentId.toString();
                    compTransportationObj.PassengerSeq = PaxEle.PassengerSeq;
                    compTransportationObj.CompSeq = PaxEle.Compensations.filter(m => m.CompTypeText == "Transportation")[0].CompSeq;
                    compTransportationObj.CompReasonId = PaxEle.CompensationReasonId.toString();
                    compTransportationObj.CompReasonText = PaxEle.CompensationReason;
                    compTransportationObj.CompTypeId = PaxEle.Compensations.filter(m => m.CompTypeText == "Transportation")[0].CompTypeId;
                    compTransportationObj.CompTypeText = "Transportation";
                    // compTransportationObj.OverrideReason = PaxEle.TransportOverrideReason;
                    compTransportationObj.UpdateLockNbr = PaxEle.Compensations.filter(m => m.CompTypeText == "Transportation")[0].UpdateLockNbr.toString();;
                    compTransportationObj.Remarks = null;
                    compTransportationObj.Endorsement = null;
                    let serviceObj: appmodel.IssueCompensationRequest.Services = new appmodel.IssueCompensationRequest.Services();
                    serviceObj.Taxes = null;
                    serviceObj.passengerRPH = PaxEle.PaxRPH;
                    serviceObj.segmentRPH = null;
                    serviceObj.currencyCode = "USD";
                    serviceObj.amount = "0";
                    serviceObj.ticketNumber = null;
                    serviceObj.Remarks = null;
                    serviceObj.Endorsement = null;
                    let selectedServiceObj: appmodel.IssueCompensationRequest.SelectedService = new appmodel.IssueCompensationRequest.SelectedService();
                    selectedServiceObj.RFISC_code = PaxEle.BREEmd.filter(m => m.compensationType == "Transportation")[0].productCode;
                    selectedServiceObj.RFISC_subCode = PaxEle.BREEmd.filter(m => m.compensationType == "Transportation")[0].subProductCode;
                    selectedServiceObj.SSRCode = "CHLD";
                    selectedServiceObj.commercialName = PaxEle.BREEmd.filter(m => m.compensationType == "Transportation")[0].productName;
                    selectedServiceObj.EmdType = PaxEle.BREEmd.filter(m => m.compensationType == "Transportation")[0].emdType;
                    selectedServiceObj.TypeOfService = null;
                    selectedServiceObj.emdRefundable = PaxEle.BREEmd.filter(m => m.compensationType == "Transportation")[0].emdRefundable;
                    selectedServiceObj.emdEndorsable = PaxEle.BREEmd.filter(m => m.compensationType == "Transportation")[0].emdEndorsable;
                    selectedServiceObj.emdExchangeable = PaxEle.BREEmd.filter(m => m.compensationType == "Transportation")[0].emdExchangeable;
                    selectedServiceObj.emdUsedAtIssuance = PaxEle.BREEmd.filter(m => m.compensationType == "Transportation")[0].emdUsedAtIssuance;
                    selectedServiceObj.IsRefundable = PaxEle.BREEmd.filter(m => m.compensationType == "Transportation")[0].IsRefundable;
                    serviceObj.selectedService = selectedServiceObj;
                    compTransportationObj.Services = serviceObj;
                    let paymentObj: appmodel.IssueCompensationRequest.Payments = new appmodel.IssueCompensationRequest.Payments();
                    paymentObj.Type = PaxEle.BREEmd.filter(m => m.compensationType == "Transportation")[0].formOfPayment.substr(0, 2);
                    paymentObj.TransactionType = "Authorize";
                    paymentObj.SubType = PaxEle.BREEmd.filter(m => m.compensationType == "Transportation")[0].formOfPayment.substr(3);
                    paymentObj.Description = "Transportation";
                    paymentObj.Amount = "0";
                    paymentObj.CurrencyCode = PaxEle.BREEmd.filter(m => m.compensationType == "Transportation")[0].currency;
                    paymentObj.AccountCode = PaxEle.BREEmd.filter(m => m.compensationType == "Transportation")[0].accountCode;
                    compTransportationObj.Payments = paymentObj;
                    compTransportationObj.Emds = [new appmodel.IssueCompensationRequest.Emd()];
                    compTransportationObj.Emds.length = 0;
                    let emdObj: appmodel.IssueCompensationRequest.Emd = new appmodel.IssueCompensationRequest.Emd();
                    emdObj.FlightSegmentId = PaxEle.FlightSegmentId.toString();
                    emdObj.PassengerSeq = PaxEle.PassengerSeq;
                    emdObj.CompSeq = PaxEle.Compensations.filter(m => m.CompTypeText == "Transportation")[0].CompSeq;
                    emdObj.PrimaryDocumentNbr = null;
                    emdObj.PrimaryAirlineCd = "CM";
                    emdObj.IssueDt = moment(IssueDate).format("YYYY-MM-DD");
                    emdObj.FirstNm = AgentProfile.FirstName;
                    emdObj.LastNm = AgentProfile.LastName;
                    emdObj.OverrideReason = PaxEle.TransportOverrideReason;
                    emdObj.UserId = ApplicationSettings.getString("UserName", "");
                    emdObj.ReasonForIssuanceSubCd = PaxEle.BREEmd.filter(m => m.compensationType == "Transportation")[0].subProductCode;
                    emdObj.ReasonForIssuanceCd = PaxEle.BREEmd.filter(m => m.compensationType == "Transportation")[0].productCode;
                    PaxEle.transportationendorsementTextItems.forEach((data, Index) => {
                        emdObj.Endorsements1Txt = emdObj.Endorsements1Txt + data;
                    })
                    if (PaxEle.transportFreeText != "" || PaxEle.transportFreeText != null) {
                        emdObj.Endorsements1Txt = emdObj.Endorsements1Txt + '.?.' + PaxEle.transportFreeText + '.';
                    }
                    emdObj.Endorsements1Txt = emdObj.Endorsements1Txt.substr(0, 255);
                    var lastIndexOfDot = emdObj.Endorsements1Txt.lastIndexOf('.');
                    emdObj.Endorsements1Txt = emdObj.Endorsements1Txt.substr(0, lastIndexOfDot);
                    emdObj.RemarkTxt = PaxEle.transportEMD;
                    emdObj.CompAmt = "0";
                    emdObj.CompCurrencyCd = "USD";
                    emdObj.VoucherCnt = PaxEle.transportation.toString();
                    emdObj.PointOfSale = ApplicationSettings.getString("userdetails", "").substr(0, 3);
                    compTransportationObj.Emds.push(emdObj);
                    paxObj.Compensations.push(compTransportationObj);
                }
                flightele.Passengers.push(paxObj);
            });
            Obj.FlightSegments.push(flightele);
            return Obj;
        } catch (error) {
            console.log(error.message);
        }
    }
    public static convertToIssueCompensationForOrderId(response: Array<appinterface.CompensationOrderID.FlightSegment>, paxresponse: Array<appinterface.CompensationSearchModule.CompensationPassengerList>, flightresponse: appinterface.CompensationSearchModule.FlightModel, IssueDate: any): appmodel.IssueCompensationRequest.RootObject {
        try {
            let Obj: appmodel.IssueCompensationRequest.RootObject = new appmodel.IssueCompensationRequest.RootObject();
            Obj.SourceId = "PSS_TABLET";
            Obj.UserId = ApplicationSettings.getString("UserName", "");
            Obj.FlightSegments = [new appmodel.IssueCompensationRequest.FlightSegment()];
            Obj.FlightSegments.length = 0;
            response.forEach((Segdata, SegIndex) => {
                let flightele: appmodel.IssueCompensationRequest.FlightSegment = new appmodel.IssueCompensationRequest.FlightSegment();
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
                Segdata.Passengers.forEach((PaxData, PaxIndex) => {
                    paxresponse.forEach((PaxEle, Index) => {
                        if (PaxEle.GivenName == PaxData.GivenName && PaxEle.LastName == PaxData.LastName) {
                            let paxObj: appmodel.IssueCompensationRequest.Passenger = new appmodel.IssueCompensationRequest.Passenger();
                            paxObj.FlightSegmentId = PaxData.FlightSegmentId.toString();
                            paxObj.PassengerSeq = PaxData.PassengerSeq.toString();
                            paxObj.OrderId = PaxData.OrderId;
                            paxObj.PaxLastNm = PaxData.LastName;
                            paxObj.PaxFirstNm = PaxData.GivenName;
                            if (PaxData.PaxType == "") {
                                paxObj.PaxType = null;
                            } else {
                                paxObj.PaxType = PaxData.PaxType;
                            }
                            paxObj.FqtvCc = PaxData.FqtvCc;
                            paxObj.FqtvNumber = PaxData.FqtvNumber;
                            paxObj.PaxStatus = PaxData.PaxStatus;
                            paxObj.PaxCompReasonID = PaxData.CompensationReasonId;
                            paxObj.CustomerCareCaseNum = PaxData.CustomerCareCaseNum;
                            paxObj.WorldTracerNum = PaxData.WorldTracerNum;
                            paxObj.IsExistingCompensation = PaxData.IsExistingCompensation;
                            paxObj.PaxEmailAddress = PaxData.PaxEmailAddress;
                            paxObj.UpdateLockNbr = PaxData.UpdateLockNbr.toString();
                            paxObj.FqtvTier = null;
                            paxObj.CabinClass = PaxData.Cabin;
                            paxObj.PaxRPH = PaxData.PaxRPH;
                            paxObj.IsCompensationIssued = PaxData.IsCompensationIssued;
                            if (PaxData.SSR == null) {
                                paxObj.SSR = [];
                            } else {
                                paxObj.SSR = PaxData.SSR;
                            }
                            paxObj.Etkt = [];
                            if (PaxData.ReaccomDetails) {
                                paxObj.ReaccomDetails = [new appmodel.SaveCompensationRequest.ReaccomDetail()];
                                paxObj.ReaccomDetails.length = 0;
                                PaxData.ReaccomDetails.forEach((ReaccData, Index) => {
                                    let reaccomObj: appmodel.SaveCompensationRequest.ReaccomDetail = new appmodel.SaveCompensationRequest.ReaccomDetail();
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
                                })
                            } else {
                                PaxData.ReaccomDetails = null;
                            }
                            if (PaxData.Bags == null) {
                                paxObj.Bags = [];
                            } else {
                                paxObj.Bags = PaxData.Bags;
                            } if (PaxData.ExistingCompensations == null) {
                                paxObj.ExistingCompensations = []
                            } else {
                                paxObj.ExistingCompensations = PaxData.ExistingCompensations;
                            }
                            paxObj.Compensations = [new appmodel.IssueCompensationRequest.Compensation()];
                            paxObj.Compensations.length = 0;
                            if (PaxData.monetary > 0) {
                                let compMoneyObj: appmodel.IssueCompensationRequest.Compensation = new appmodel.IssueCompensationRequest.Compensation();
                                compMoneyObj.FlightSegmentId = PaxData.FlightSegmentId.toString();
                                compMoneyObj.PassengerSeq = PaxData.PassengerSeq.toString();
                                compMoneyObj.CompSeq = PaxData.Compensations.filter(m => m.CompTypeText == "Monetary")[0].CompSeq;
                                compMoneyObj.CompReasonId = PaxData.CompensationReasonId.toString();
                                compMoneyObj.CompReasonText = PaxData.CompensationReason;
                                compMoneyObj.CompTypeId = PaxData.Compensations.filter(m => m.CompTypeText == "Monetary")[0].CompTypeId;
                                compMoneyObj.CompTypeText = "Monetary";
                                // compMoneyObj.OverrideReason = null;
                                compMoneyObj.UpdateLockNbr = PaxData.Compensations.filter(m => m.CompTypeText == "Monetary")[0].UpdateLockNbr.toString();
                                compMoneyObj.Remarks = null;
                                compMoneyObj.Endorsement = null;
                                let serviceObj: appmodel.IssueCompensationRequest.Services = new appmodel.IssueCompensationRequest.Services();
                                serviceObj.Taxes = null;
                                serviceObj.passengerRPH = PaxData.PaxRPH;
                                serviceObj.segmentRPH = null;
                                serviceObj.currencyCode = "USD";
                                serviceObj.amount = PaxData.monetary.toString();
                                serviceObj.ticketNumber = null;
                                serviceObj.Remarks = null;
                                serviceObj.Endorsement = null;
                                let selectedServiceObj: appmodel.IssueCompensationRequest.SelectedService = new appmodel.IssueCompensationRequest.SelectedService();
                                selectedServiceObj.RFISC_code = PaxData.BREEmd.filter(m => m.compensationType == "Monetary")[0].productCode;
                                selectedServiceObj.RFISC_subCode = PaxData.BREEmd.filter(m => m.compensationType == "Monetary")[0].subProductCode;
                                selectedServiceObj.SSRCode = null;
                                selectedServiceObj.commercialName = PaxData.BREEmd.filter(m => m.compensationType == "Monetary")[0].productName;
                                selectedServiceObj.EmdType = PaxData.BREEmd.filter(m => m.compensationType == "Monetary")[0].emdType;
                                selectedServiceObj.TypeOfService = null;
                                serviceObj.selectedService = selectedServiceObj;
                                compMoneyObj.Services = serviceObj;
                                let paymentObj: appmodel.IssueCompensationRequest.Payments = new appmodel.IssueCompensationRequest.Payments();
                                paymentObj.Type = PaxData.BREEmd.filter(m => m.compensationType == "Monetary")[0].formOfPayment.substr(0, 2);
                                paymentObj.TransactionType = "Authorize";
                                paymentObj.SubType = PaxData.BREEmd.filter(m => m.compensationType == "Monetary")[0].formOfPayment.substr(3);
                                paymentObj.Description = "Monetary";
                                paymentObj.Amount = PaxData.monetary.toString();
                                paymentObj.CurrencyCode = PaxData.BREEmd.filter(m => m.compensationType == "Monetary")[0].currency;
                                compMoneyObj.Payments = paymentObj;
                                compMoneyObj.Emds = [new appmodel.IssueCompensationRequest.Emd()];
                                compMoneyObj.Emds.length = 0;
                                let emdObj: appmodel.IssueCompensationRequest.Emd = new appmodel.IssueCompensationRequest.Emd();
                                emdObj.FlightSegmentId = PaxData.FlightSegmentId.toString();
                                emdObj.PassengerSeq = PaxData.PassengerSeq.toString();
                                emdObj.CompSeq = PaxData.Compensations.filter(m => m.CompTypeText == "Monetary")[0].CompSeq;
                                emdObj.PrimaryDocumentNbr = null;
                                emdObj.PrimaryAirlineCd = "CM";
                                emdObj.IssueDt = IssueDate;
                                emdObj.FirstNm = PaxData.GivenName;
                                emdObj.LastNm = PaxData.LastName;
                                emdObj.UserId = ApplicationSettings.getString("UserName", "");
                                emdObj.ReasonForIssuanceSubCd = PaxData.BREEmd.filter(m => m.compensationType == "Monetary")[0].subProductCode;
                                emdObj.ReasonForIssuanceCd = PaxData.BREEmd.filter(m => m.compensationType == "Monetary")[0].productCode;
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
                                paxObj.Compensations.push(compMoneyObj);
                            }
                            if (PaxData.hotel > 0) {
                                let compMealObj: appmodel.IssueCompensationRequest.Compensation = new appmodel.IssueCompensationRequest.Compensation();
                                compMealObj.FlightSegmentId = PaxData.FlightSegmentId.toString();
                                compMealObj.PassengerSeq = PaxData.PassengerSeq.toString();
                                compMealObj.CompSeq = PaxData.Compensations.filter(m => m.CompTypeText == "Hotel")[0].CompSeq;
                                compMealObj.CompReasonId = PaxData.CompensationReasonId.toString();
                                compMealObj.CompReasonText = PaxData.CompensationReason;
                                compMealObj.CompTypeId = PaxData.Compensations.filter(m => m.CompTypeText == "Hotel")[0].CompTypeId;
                                compMealObj.CompTypeText = "Hotel";
                                // compMealObj.OverrideReason = null;
                                compMealObj.UpdateLockNbr = PaxData.Compensations.filter(m => m.CompTypeText == "Hotel")[0].UpdateLockNbr.toString();
                                compMealObj.Remarks = null;
                                compMealObj.Endorsement = null;
                                let serviceObj: appmodel.IssueCompensationRequest.Services = new appmodel.IssueCompensationRequest.Services();
                                serviceObj.Taxes = null;
                                serviceObj.passengerRPH = PaxData.PaxRPH;
                                serviceObj.segmentRPH = null;
                                serviceObj.currencyCode = "USD";
                                serviceObj.amount = "0";
                                serviceObj.ticketNumber = null;
                                serviceObj.Remarks = null;
                                serviceObj.Endorsement = null;
                                let selectedServiceObj: appmodel.IssueCompensationRequest.SelectedService = new appmodel.IssueCompensationRequest.SelectedService();
                                selectedServiceObj.RFISC_code = PaxData.BREEmd.filter(m => m.compensationType == "Hotel")[0].productCode;
                                selectedServiceObj.RFISC_subCode = PaxData.BREEmd.filter(m => m.compensationType == "Hotel")[0].subProductCode;
                                selectedServiceObj.SSRCode = null;
                                selectedServiceObj.commercialName = PaxData.BREEmd.filter(m => m.compensationType == "Hotel")[0].productName;
                                selectedServiceObj.EmdType = PaxData.BREEmd.filter(m => m.compensationType == "Hotel")[0].emdType;
                                serviceObj.selectedService = selectedServiceObj;
                                selectedServiceObj.TypeOfService = null;
                                compMealObj.Services = serviceObj;
                                let paymentObj: appmodel.IssueCompensationRequest.Payments = new appmodel.IssueCompensationRequest.Payments();
                                paymentObj.Type = PaxData.BREEmd.filter(m => m.compensationType == "Hotel")[0].formOfPayment.substr(0, 2);
                                paymentObj.TransactionType = "Authorize";
                                paymentObj.SubType = PaxData.BREEmd.filter(m => m.compensationType == "Hotel")[0].formOfPayment.substr(3);
                                paymentObj.Description = "Hotel";
                                paymentObj.Amount = "0";
                                paymentObj.CurrencyCode = PaxData.BREEmd.filter(m => m.compensationType == "Hotel")[0].currency;
                                compMealObj.Payments = paymentObj;
                                compMealObj.Emds = [new appmodel.IssueCompensationRequest.Emd()];
                                compMealObj.Emds.length = 0;
                                let emdObj: appmodel.IssueCompensationRequest.Emd = new appmodel.IssueCompensationRequest.Emd();
                                emdObj.FlightSegmentId = PaxData.FlightSegmentId.toString();
                                emdObj.PassengerSeq = PaxData.PassengerSeq.toString();
                                emdObj.CompSeq = PaxData.Compensations.filter(m => m.CompTypeText == "Hotel")[0].CompSeq;
                                emdObj.PrimaryDocumentNbr = null;
                                emdObj.PrimaryAirlineCd = "CM";
                                emdObj.IssueDt = IssueDate;
                                emdObj.FirstNm = PaxData.GivenName;
                                emdObj.LastNm = PaxData.LastName;
                                emdObj.UserId = ApplicationSettings.getString("UserName", "");
                                emdObj.ReasonForIssuanceSubCd = PaxData.BREEmd.filter(m => m.compensationType == "Hotel")[0].subProductCode;
                                emdObj.ReasonForIssuanceCd = PaxData.BREEmd.filter(m => m.compensationType == "Hotel")[0].productCode;
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
                                paxObj.Compensations.push(compMealObj);
                            }
                            if (PaxData.meal > 0) {
                                let compHotelObj: appmodel.IssueCompensationRequest.Compensation = new appmodel.IssueCompensationRequest.Compensation();
                                compHotelObj.FlightSegmentId = PaxData.FlightSegmentId.toString();
                                compHotelObj.PassengerSeq = PaxData.PassengerSeq.toString();
                                compHotelObj.CompSeq = PaxData.Compensations.filter(m => m.CompTypeText == "Meal")[0].CompSeq;
                                compHotelObj.CompReasonId = PaxData.CompensationReasonId.toString();
                                compHotelObj.CompReasonText = PaxData.CompensationReason;
                                compHotelObj.CompTypeId = PaxData.Compensations.filter(m => m.CompTypeText == "Meal")[0].CompTypeId;
                                compHotelObj.CompTypeText = "Meal";
                                // compHotelObj.OverrideReason = null;
                                compHotelObj.UpdateLockNbr = PaxData.Compensations.filter(m => m.CompTypeText == "Meal")[0].UpdateLockNbr.toString();
                                compHotelObj.Remarks = null;
                                compHotelObj.Endorsement = null;
                                let serviceObj: appmodel.IssueCompensationRequest.Services = new appmodel.IssueCompensationRequest.Services();
                                serviceObj.Taxes = null;
                                serviceObj.passengerRPH = PaxData.PaxRPH;
                                serviceObj.segmentRPH = null;
                                serviceObj.currencyCode = "USD";
                                serviceObj.amount = "0";
                                serviceObj.ticketNumber = null;
                                serviceObj.Remarks = null;
                                serviceObj.Endorsement = null;
                                let selectedServiceObj: appmodel.IssueCompensationRequest.SelectedService = new appmodel.IssueCompensationRequest.SelectedService();
                                selectedServiceObj.RFISC_code = PaxData.BREEmd.filter(m => m.compensationType == "Meal")[0].productCode;
                                selectedServiceObj.RFISC_subCode = PaxData.BREEmd.filter(m => m.compensationType == "Meal")[0].subProductCode;
                                selectedServiceObj.SSRCode = null;
                                selectedServiceObj.commercialName = PaxData.BREEmd.filter(m => m.compensationType == "Meal")[0].productName;
                                selectedServiceObj.EmdType = PaxData.BREEmd.filter(m => m.compensationType == "Meal")[0].emdType;
                                selectedServiceObj.TypeOfService = null;
                                serviceObj.selectedService = selectedServiceObj;
                                compHotelObj.Services = serviceObj;
                                let paymentObj: appmodel.IssueCompensationRequest.Payments = new appmodel.IssueCompensationRequest.Payments();
                                paymentObj.Type = PaxData.BREEmd.filter(m => m.compensationType == "Meal")[0].formOfPayment.substr(0, 2);
                                paymentObj.TransactionType = "Authorize";
                                paymentObj.SubType = PaxData.BREEmd.filter(m => m.compensationType == "Meal")[0].formOfPayment.substr(3);
                                paymentObj.Description = "Meal";
                                paymentObj.Amount = "0";
                                paymentObj.CurrencyCode = PaxData.BREEmd.filter(m => m.compensationType == "Meal")[0].currency;
                                compHotelObj.Payments = paymentObj;
                                compHotelObj.Emds = [new appmodel.IssueCompensationRequest.Emd()];
                                compHotelObj.Emds.length = 0;
                                let emdObj: appmodel.IssueCompensationRequest.Emd = new appmodel.IssueCompensationRequest.Emd();
                                emdObj.FlightSegmentId = PaxData.FlightSegmentId.toString();
                                emdObj.PassengerSeq = PaxData.PassengerSeq.toString();
                                emdObj.CompSeq = PaxData.Compensations.filter(m => m.CompTypeText == "Meal")[0].CompSeq;
                                emdObj.PrimaryDocumentNbr = null;
                                emdObj.PrimaryAirlineCd = "CM";
                                emdObj.IssueDt = IssueDate;
                                emdObj.FirstNm = PaxData.GivenName;
                                emdObj.LastNm = PaxData.LastName;
                                emdObj.UserId = ApplicationSettings.getString("UserName", "");
                                emdObj.ReasonForIssuanceSubCd = PaxData.BREEmd.filter(m => m.compensationType == "Meal")[0].subProductCode;
                                emdObj.ReasonForIssuanceCd = PaxData.BREEmd.filter(m => m.compensationType == "Meal")[0].productCode;
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
                                paxObj.Compensations.push(compHotelObj);
                            }
                            if (PaxData.transportation > 0) {
                                let compTransportationObj: appmodel.IssueCompensationRequest.Compensation = new appmodel.IssueCompensationRequest.Compensation();
                                compTransportationObj.FlightSegmentId = PaxData.FlightSegmentId.toString();
                                compTransportationObj.PassengerSeq = PaxData.PassengerSeq.toString();;
                                compTransportationObj.CompSeq = PaxData.Compensations.filter(m => m.CompTypeText == "Transportation")[0].CompSeq;
                                compTransportationObj.CompReasonId = PaxData.CompensationReasonId.toString();
                                compTransportationObj.CompReasonText = PaxData.CompensationReason;
                                compTransportationObj.CompTypeId = PaxData.Compensations.filter(m => m.CompTypeText == "Transportation")[0].CompTypeId;
                                compTransportationObj.CompTypeText = "Transportation";
                                // compTransportationObj.OverrideReason = null;
                                compTransportationObj.UpdateLockNbr = PaxData.Compensations.filter(m => m.CompTypeText == "Transportation")[0].UpdateLockNbr.toString();;
                                compTransportationObj.Remarks = null;
                                compTransportationObj.Endorsement = null;
                                let serviceObj: appmodel.IssueCompensationRequest.Services = new appmodel.IssueCompensationRequest.Services();
                                serviceObj.Taxes = null;
                                serviceObj.passengerRPH = PaxData.PaxRPH;
                                serviceObj.segmentRPH = null;
                                serviceObj.currencyCode = "USD";
                                serviceObj.amount = "0";
                                serviceObj.ticketNumber = null;
                                serviceObj.Remarks = null;
                                serviceObj.Endorsement = null;
                                let selectedServiceObj: appmodel.IssueCompensationRequest.SelectedService = new appmodel.IssueCompensationRequest.SelectedService();
                                selectedServiceObj.RFISC_code = PaxData.BREEmd.filter(m => m.compensationType == "Transportation")[0].productCode;
                                selectedServiceObj.RFISC_subCode = PaxData.BREEmd.filter(m => m.compensationType == "Transportation")[0].subProductCode;
                                selectedServiceObj.SSRCode = null;
                                selectedServiceObj.commercialName = PaxData.BREEmd.filter(m => m.compensationType == "Transportation")[0].productName;
                                selectedServiceObj.EmdType = PaxData.BREEmd.filter(m => m.compensationType == "Transportation")[0].emdType;
                                selectedServiceObj.TypeOfService = null;
                                serviceObj.selectedService = selectedServiceObj;
                                compTransportationObj.Services = serviceObj;
                                let paymentObj: appmodel.IssueCompensationRequest.Payments = new appmodel.IssueCompensationRequest.Payments();
                                paymentObj.Type = PaxData.BREEmd.filter(m => m.compensationType == "Transportation")[0].formOfPayment.substr(0, 2);
                                paymentObj.TransactionType = "Authorize";
                                paymentObj.SubType = PaxData.BREEmd.filter(m => m.compensationType == "Transportation")[0].formOfPayment.substr(3);
                                paymentObj.Description = "Transportation";
                                paymentObj.Amount = "0";
                                paymentObj.CurrencyCode = PaxData.BREEmd.filter(m => m.compensationType == "Transportation")[0].currency;
                                compTransportationObj.Payments = paymentObj;
                                compTransportationObj.Emds = [new appmodel.IssueCompensationRequest.Emd()];
                                compTransportationObj.Emds.length = 0;
                                let emdObj: appmodel.IssueCompensationRequest.Emd = new appmodel.IssueCompensationRequest.Emd();
                                emdObj.FlightSegmentId = PaxData.FlightSegmentId.toString();
                                emdObj.PassengerSeq = PaxData.PassengerSeq.toString();
                                emdObj.CompSeq = PaxData.Compensations.filter(m => m.CompTypeText == "Transportation")[0].CompSeq;
                                emdObj.PrimaryDocumentNbr = null;
                                emdObj.PrimaryAirlineCd = "CM";
                                emdObj.IssueDt = IssueDate;
                                emdObj.FirstNm = PaxData.GivenName;
                                emdObj.LastNm = PaxData.LastName;
                                emdObj.UserId = ApplicationSettings.getString("UserName", "");
                                emdObj.ReasonForIssuanceSubCd = PaxData.BREEmd.filter(m => m.compensationType == "Transportation")[0].subProductCode;
                                emdObj.ReasonForIssuanceCd = PaxData.BREEmd.filter(m => m.compensationType == "Transportation")[0].productCode;
                                if (PaxData.transportFreeText != "") {
                                    emdObj.Endorsements1Txt = emdObj.Endorsements1Txt + PaxData.transportFreeText;
                                }
                                emdObj.RemarkTxt = "RemarkTxt";
                                emdObj.CompAmt = "0";
                                emdObj.CompCurrencyCd = "USD";
                                emdObj.VoucherCnt = PaxData.transportation.toString();
                                compTransportationObj.Emds.push(emdObj);
                                paxObj.Compensations.push(compTransportationObj);
                            }
                            flightele.Passengers.push(paxObj);
                        }
                    })

                })
                Obj.FlightSegments.push(flightele);
            })
            return Obj;
        } catch (error) {
            console.log(error.message);
        }
    }

    public static convertToIssueCompensationResponse(response: any, PaxResponse: Array<appinterface.CompensationSearchModule.CompensationPassengerList>): Array<appinterface.CompensationSearchModule.CompensationPassengerList> {
        try {
            PaxResponse.forEach((paxEle, Index) => {
                if (response.Results != null) {
                    if (response.Results[0].FlightSegments != null && response.Results[0].FlightSegments.length > 0) {
                        response.Results[0].FlightSegments[0].Passengers.forEach((element, index) => {

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
                                } else {
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
                                    paxEle.meal = 0
                                    paxEle.transportation = 0;
                                }
                                paxEle.IsSelected = false;
                                paxEle.Compensations = element.Compensations;
                                paxEle.ExistingCompensations = element.ExistingCompensations;
                                if (element.Compensations != null) {
                                    element.Compensations.forEach((exiCompData, exiCompIndex) => {
                                        if (exiCompData.Emds != null) {
                                            exiCompData.Emds.forEach((exiEMDData, exiEMDIndex) => {
                                                if (exiCompData.CompTypeText == "Monetary") {
                                                    paxEle.monetary = exiCompData.Emds[0].CompAmt;
                                                } else if (exiCompData.CompTypeText == "Hotel") {
                                                    paxEle.hotel = exiCompData.Emds[0].VoucherCnt;
                                                } else if (exiCompData.CompTypeText == "Meal") {
                                                    paxEle.meal = exiCompData.Emds[0].VoucherCnt;
                                                } else {
                                                    paxEle.transportation = exiCompData.Emds[0].VoucherCnt;
                                                }
                                                paxEle.Compensations[exiCompIndex].Emds[exiEMDIndex].IssueDt = moment(exiEMDData.IssueDt).format("YYYY-MM-DD");
                                            })
                                        }

                                    })
                                }
                                paxEle.AdditionalDetails = "Edit";

                            }
                        })
                    }
                }

            });
            return PaxResponse;
        } catch (error) {
            console.log(error.message);
        }
    }

    public static convertToEmailCompensation(PaxResponse: Array<appinterface.CompensationSearchModule.CompensationPassengerList>, flightResponse: appinterface.CompensationSearchModule.FlightModel): appmodel.EmailModule.RootObject {
        try {
            let emailObj: appmodel.EmailModule.RootObject = new appmodel.EmailModule.RootObject();

            emailObj.OrderId = null;
            emailObj.Gateway = "EMAIL";
            emailObj.ListType = "emd";
            emailObj.DocumentType = "COMPMONT";
            emailObj.Source = "Travel";
            emailObj.Segments = [new appmodel.EmailModule.SegmentsEntity()];
            emailObj.Segments.length = 0;
            let segObj: appmodel.EmailModule.SegmentsEntity = new appmodel.EmailModule.SegmentsEntity();
            segObj.OperatingCarrierCode = flightResponse.FlightNumber.substr(0, 2);
            segObj.OperatingCarrierNumber = flightResponse.FlightNumber.substr(2);
            let depObj: appmodel.EmailModule.DepartureOrArrival = new appmodel.EmailModule.DepartureOrArrival();
            depObj.CityName = flightResponse.DepartureAirport;
            depObj.Date = flightResponse.DepartureDate;
            segObj.Departure = depObj;
            let arrObj: appmodel.EmailModule.DepartureOrArrival = new appmodel.EmailModule.DepartureOrArrival();
            arrObj.CityName = flightResponse.DestinationAirport;
            segObj.Arrival = arrObj;
            emailObj.Segments.push(segObj);
            emailObj.Passengers = [new appmodel.EmailModule.Passenger()];
            emailObj.Passengers.length = 0;
            PaxResponse.forEach((paxEle, Index) => {
                paxEle.Compensations.forEach((exiCompData, exiIndex) => {
                    if (exiCompData.Emds) {
                        if (exiCompData.CompTypeText == "Monetary") {
                            exiCompData.Emds.forEach((emdData, emdIndex) => {
                                let paxObj: appmodel.EmailModule.Passenger = new appmodel.EmailModule.Passenger();
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
                                let delObj: appmodel.EmailModule.DeliveryDetail = new appmodel.EmailModule.DeliveryDetail();
                                let emailObject: appmodel.EmailModule.Email = new appmodel.EmailModule.Email();
                                let toObj = [new appmodel.EmailModule.ToEntity()];
                                toObj.length = 0;
                                let toAddrObj: appmodel.EmailModule.ToEntity = new appmodel.EmailModule.ToEntity();
                                toAddrObj.ToAddr = paxEle.Email;
                                toObj.push(toAddrObj);
                                emailObject.To = toObj;
                                delObj.Email = emailObject;
                                paxObj.DeliveryDetail = delObj;
                                emailObj.Passengers.push(paxObj);
                            })
                        }
                    }
                })

            });
            console.log("Email OBJ:" + JSON.stringify(emailObj));
            return emailObj;
        } catch (error) {
            console.log(error.message);
        }
    }
    public static convertToPrintEMDCompensation(PaxResponse: Array<appinterface.CompensationSearchModule.CompensationPassengerList>, flightResponse: appinterface.CompensationSearchModule.FlightModel): appmodel.PrintModule.RootObject {
        try {
            let printObj: appmodel.PrintModule.RootObject = new appmodel.PrintModule.RootObject();

            printObj.OrderId = null;
            printObj.Gateway = "EMAIL";
            printObj.ListType = "PRINTEMD";
            printObj.DocumentType = "COMP";
            printObj.Source = "Travel";
            printObj.Segments = [new appmodel.PrintModule.Segment()];
            printObj.Segments.length = 0;
            var segObj: appmodel.PrintModule.Segment = new appmodel.PrintModule.Segment();
            segObj.OperatingCarrierNumber = flightResponse.FlightNumber.substr(2);
            segObj.OperatingCarrierCode = flightResponse.FlightNumber.substr(0, 2);
            let arrcityObj = new appmodel.PrintModule.Arrival();
            arrcityObj.CityName = flightResponse.DestinationAirport;
            segObj.Arrival = arrcityObj;
            let depcityObj = new appmodel.PrintModule.Departure();
            depcityObj.CityName = flightResponse.DepartureAirport;
            segObj.Departure = depcityObj;
            printObj.Segments.push(segObj);
            printObj.Passengers = [new appmodel.PrintModule.Passenger()];
            printObj.Passengers.length = 0;
            PaxResponse.forEach((paxEle, Index) => {
                paxEle.Compensations.forEach((exiEmdObj, exiEmdIndex) => {
                    if (exiEmdObj.Emds) {
                        exiEmdObj.Emds.forEach((emdObj, emdIndex) => {
                            if (exiEmdObj.CompTypeText == "Monetary") {
                                let paxObj: appmodel.PrintModule.Passenger = new appmodel.PrintModule.Passenger();
                                paxObj.FlightSegmentId = paxEle.FlightSegmentId.toString();
                                paxObj.PassengerSeq = paxEle.PassengerSeq;
                                paxObj.OrderId = paxEle.OrderId
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
                                printObj.Passengers.push(paxObj);
                            } else {
                                if (emdObj.PrintStatus == "n") {
                                    let paxObj: appmodel.PrintModule.Passenger = new appmodel.PrintModule.Passenger();
                                    paxObj.FlightSegmentId = paxEle.FlightSegmentId.toString();
                                    paxObj.PassengerSeq = paxEle.PassengerSeq;
                                    paxObj.OrderId = paxEle.OrderId
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
                                    printObj.Passengers.push(paxObj);
                                }
                            }
                        })
                    }
                })
            });
            let delDetailObj: appmodel.PrintModule.DeliveryDetail = new appmodel.PrintModule.DeliveryDetail();
            delDetailObj.Email = null;
            let printDelObj: appmodel.PrintModule.Printer = new appmodel.PrintModule.Printer();
            var Worksatation = ApplicationSettings.getString("hostBoardingWS", "");
            var DeviceName = ApplicationSettings.getString("boardingPassDeviceName", "");
            var DeviceType = ApplicationSettings.getString("deviceType", "");
            var PectabVersion = ApplicationSettings.getString("pectabVersion", "");
            printDelObj.DeviceName = DeviceName;
            printDelObj.WorkstationName = Worksatation;
            // printDelObj.PectabVersion = PectabVersion;
            printDelObj.DeviceType = DeviceType;
            delDetailObj.Printer = printDelObj;
            printObj.DeliveryDetail = delDetailObj
            console.log("Email OBJ:" + JSON.stringify(printObj));
            return printObj;
        } catch (error) {
            console.log(error.message);
        }
    }
    public static convertToBluetoothPrintEMDCompensation(PaxResponse: Array<appinterface.CompensationSearchModule.CompensationPassengerList>, flightResponse: appinterface.CompensationSearchModule.FlightModel): appmodel.PrintModule.RootObject {
        try {
            let printObj: appmodel.PrintModule.RootObject = new appmodel.PrintModule.RootObject();

            printObj.OrderId = null;
            printObj.Gateway = "TAB";
            printObj.ListType = "EMD";
            printObj.DocumentType = "COMPTAB";
            printObj.Source = "CM-TAB";
            printObj.Segments = [new appmodel.PrintModule.Segment()];
            printObj.Segments.length = 0;
            var segObj: appmodel.PrintModule.Segment = new appmodel.PrintModule.Segment();
            segObj.OperatingCarrierNumber = flightResponse.FlightNumber.substr(2);
            segObj.OperatingCarrierCode = flightResponse.FlightNumber.substr(0, 2);
            let arrcityObj = new appmodel.PrintModule.Arrival();
            arrcityObj.CityName = flightResponse.DestinationAirport;
            segObj.Arrival = arrcityObj;
            let depcityObj = new appmodel.PrintModule.Departure();
            depcityObj.CityName = flightResponse.DepartureAirport;
            segObj.Departure = depcityObj;
            printObj.Segments.push(segObj);
            printObj.Passengers = [new appmodel.PrintModule.Passenger()];
            printObj.Passengers.length = 0;
            PaxResponse.forEach((paxEle, Index) => {
                paxEle.Compensations.forEach((exiEmdObj, exiEmdIndex) => {
                    if (exiEmdObj.Emds) {
                        exiEmdObj.Emds.forEach((emdObj, emdIndex) => {
                            if (exiEmdObj.CompTypeText == "Monetary") {
                                let paxObj: appmodel.PrintModule.Passenger = new appmodel.PrintModule.Passenger();
                                paxObj.FlightSegmentId = paxEle.FlightSegmentId.toString();
                                paxObj.PassengerSeq = paxEle.PassengerSeq;
                                paxObj.OrderId = paxEle.OrderId
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
                                printObj.Passengers.push(paxObj);
                            } else {
                                if (emdObj.PrintStatus == "n") {
                                    let paxObj: appmodel.PrintModule.Passenger = new appmodel.PrintModule.Passenger();
                                    paxObj.FlightSegmentId = paxEle.FlightSegmentId.toString();
                                    paxObj.PassengerSeq = paxEle.PassengerSeq;
                                    paxObj.OrderId = paxEle.OrderId
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
                                    printObj.Passengers.push(paxObj);
                                }
                            }
                        })
                    }
                })
            });
            let delDetailObj: appmodel.PrintModule.DeliveryDetail = new appmodel.PrintModule.DeliveryDetail();
            delDetailObj.Printer = null;
            printObj.DeliveryDetail = delDetailObj
            console.log("Email OBJ:" + JSON.stringify(printObj));
            return printObj;
        } catch (error) {
            console.log(error.message);
        }
    }
    public static convertToUpdateEmailId(PaxResponse: appinterface.CompensationSearchModule.CompensationPassengerList, orderResponse: any): appmodel.updateEmailModel.RootObject {
        try {
            let updateEmailObj: appmodel.updateEmailModel.RootObject = new appmodel.updateEmailModel.RootObject();
            updateEmailObj.ReturnOrder = false;
            updateEmailObj.ReceivedFrom = null;
            updateEmailObj.Changes = ["1", "2"];
            let paxObj: appmodel.updateEmailModel.Traveler = new appmodel.updateEmailModel.Traveler();
            orderResponse.Passengers.forEach((element, index) => {
                if (PaxResponse.GivenName == element.Firstname && PaxResponse.LastName == element.Lastname) {
                    paxObj.Firstname = element.Firstname;
                    paxObj.Lastname = element.Lastname;
                    paxObj.SurnameRefNumber = element.SurnameRefNumber;
                    paxObj.Prefix = element.Prefix;
                    paxObj.RPH = element.RPH;
                    paxObj.Gender = element.Gender;
                    paxObj.PassengerTypeCode = element.PassengerTypeCode;
                    paxObj.AssociatedInfantRPH = element.AssociatedInfantRPH;
                    paxObj.DateOfBirth = element.DateOfBirth;
                    paxObj.Age = element.Age;
                    paxObj.AssociatedAdultRPH = element.AssociatedAdultRPH;
                    paxObj.FOID = element.FOID;
                    paxObj.OldPhoneNumbers = element.OldPhoneNumbers
                    if (element.OldFirstname == null) {
                        paxObj.OldFirstname = element.Firstname;
                    } else {
                        paxObj.OldFirstname = element.OldFirstname;
                    } if (element.OldLastname == null) {
                        paxObj.OldLastname = element.Lastname;
                    } else {
                        paxObj.OldLastname = element.OldLastname;
                    }
                    paxObj.EmergencyDetails = element.EmergencyDetails;
                    paxObj.OldEmergencyDetails = element.OldEmergencyDetails;
                    paxObj.IsContactRefused = element.IsContactRefused;
                    paxObj.PhoneNumbers = element.PhoneNumbers;
                    paxObj.Emails = [new appmodel.updateEmailModel.EmailsEntity()];
                    paxObj.Emails.length = 0;
                    let emailObj: appmodel.updateEmailModel.EmailsEntity = new appmodel.updateEmailModel.EmailsEntity();
                    emailObj.Type = "CTCE";
                    emailObj.Value = PaxResponse.Email;
                    paxObj.Emails.push(emailObj);
                }

            })
            updateEmailObj.Traveler = paxObj;
            // console.log("Email OBJ:" + JSON.stringify(emailObj));
            return updateEmailObj;
        } catch (error) {
            console.log(error.message);
        }
    }

}


