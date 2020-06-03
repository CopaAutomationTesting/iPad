import { LoginComponent } from "./login/login.component";
import { HomeComponent } from "./home/home.component";
import { SearchComponent } from "./search/search.component";
import { SearchResultComponent } from "./searchresult/searchresult.component";
import { CheckInComponent } from "./checkin/checkin.component";
import { ApisComponent } from "./apis/apis.component";
import { BaggageinfoComponent } from "./baggageinfo/baggageinfo.component";
import { DepartureHomeComponent } from "./departurehome/departurehome.component";
import { DepartureAllComponent } from "./departureall/departureall.component";
import { DeparturePaxListComponent } from "./departurepaxlist/departurepaxlist.component";
import { FqtvListComponent } from "./fqtvlist/fqtvlist.component";
import { FqtvComponent } from "./fqtv/fqtv.component";
import { SeatMapComponent } from "./seatmap/seatmap.component";
import { SettingComponent } from "./settings/setting.component";
import { CompensationSearchComponent } from "./compensationsearch/compensationsearch.component";
import { CompensationSearchResultComponent } from "./compensationsearchresult/compensationsearchresult.component";
import { CompensationAdditionalDetailsComponent } from "./compensationadditionaldetails/compensationadditionaldetails.component";
import { IssueCompensationWithTabComponent } from"./issuecompensationwithtab/issuecompensationwithtab.component";
import { IssueCompensationComponent } from "./issuecompensation/issuecompensation.component";
import { CompensationSelectSegment } from "./compensation-selectsegment/compensation-selectsegment.component";
import { CompensationSelectPax } from "./compensation-selectpax/compensation-selectpax.component";
import { CompensationFQTVList } from "./compensation-fqtvlist/compensation-fqtvlist.component";
import { CompensationSearchResultWithTabComponent } from "./compensation-searchresultwithtab/compensation-searchresultwithtab.component";
import { CompensationPrintScreenComponent } from "./compensation-printscreen/compensation-printscreen.component";
 
export const AppRoutes: any = [
    { path: "", component: LoginComponent },
    { path: "home", component: HomeComponent },
    { path: "search", component: SearchComponent },
    { path: "searchresult", component: SearchResultComponent },
    { path: "checkin", component: CheckInComponent },
    { path: "apis", component: ApisComponent },
    { path: "baggageinfo", component: BaggageinfoComponent },
    { path: "departhome", component: DepartureHomeComponent },
    { path: "deppaxlist", component: DeparturePaxListComponent },
    { path: "departall", component: DepartureAllComponent },
    { path: "departall", component: DepartureAllComponent },
    { path: "fqtvlist", component: FqtvListComponent },
    { path: "fqtv", component: FqtvComponent },
    { path: "seatmap", component: SeatMapComponent },
    { path: "setting", component: SettingComponent },
    { path: "compensation", component : CompensationSearchComponent },
    { path: "compensationresult", component : CompensationSearchResultComponent },
    { path: "compensationadditionaldetails", component : CompensationAdditionalDetailsComponent},
    { path: "issuecompensation", component : IssueCompensationComponent},
    { path: "issuecompensationwithtab", component: IssueCompensationWithTabComponent},
    { path: "compensationselectsegment" ,component : CompensationSelectSegment},
    { path: "compensationselectpax", component:CompensationSelectPax},
    { path: "compensationfqtv", component:CompensationFQTVList},
    { path: "compensationsearchresultwithtab", component : CompensationSearchResultWithTabComponent},
    { path: "compensationprintscreen", component : CompensationPrintScreenComponent}
];

export const AppComponents: any = [
    LoginComponent,
    HomeComponent,
    SearchComponent,
    SearchResultComponent,
    CheckInComponent,
    ApisComponent,
    BaggageinfoComponent,
    DepartureAllComponent,
    DeparturePaxListComponent,
    DepartureHomeComponent,
    FqtvListComponent,
    FqtvComponent,
    SeatMapComponent,
    SettingComponent,
    CompensationSearchComponent,
    CompensationSearchResultComponent,
    CompensationAdditionalDetailsComponent,
    IssueCompensationComponent,
    IssueCompensationWithTabComponent,
    CompensationSelectSegment,
    CompensationSelectPax,
    CompensationFQTVList,
    CompensationSearchResultWithTabComponent,
    CompensationPrintScreenComponent
];