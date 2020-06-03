import * as CheckinService from "../services/checkin.service";
import * as CheckinOrderService from "../services/checkinorder.service";
import * as DataService from "../services/passenger-list.services";
import * as PassengerService from "../services/passenger.service";
import * as CommonService from "../services/common.service";
import * as PaymentService from "../services/payment.service";
import * as TimeOutService from "../services/timeOut.service";
import * as Compensation from "../services/compensation.service";
import * as PrintEmailService from "../services/print_email.services"
import * as DepartureService from "../services/departure.services";
import * as Common from "../services/common.service";
import * as SeatMapService  from "../services/seatmap.services";
import * as LoginService from "../services/login.service";
import * as HomePageService from "../services/homePage.services"
import * as SearchService from "../services/search.services";
import * as MessageService from "../services/message.service";
export const APP_SERVICE: any[] = [
 CheckinService,
 CheckinOrderService,
 DataService,
 PassengerService,
 PaymentService,
 TimeOutService,
 Compensation,
 DepartureService,
 PrintEmailService,
 Common,
 SeatMapService,
 LoginService,
 HomePageService,
 SearchService,
 MessageService
];

export * from "../services/checkin.service";
export * from "../services/checkinorder.service";
export * from "../services/passenger-list.services";
export * from "../services/passenger.service";
export * from "../services/common.service";
export * from "../services/payment.service";
export * from "../services/timeOut.service";
export * from "../services/compensation.service";
export * from "../services/departure.services";
export * from "../services/print_email.services";
export * from "../services/seatmap.services";
export * from "../services/login.service";
export * from "../services/homePage.services";
export * from "../services/search.services";
export * from "../services/message.service";
