"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var login_component_1 = require("./login/login.component");
var home_component_1 = require("./home/home.component");
var search_component_1 = require("./search/search.component");
var searchresult_component_1 = require("./searchresult/searchresult.component");
var checkin_component_1 = require("./checkin/checkin.component");
var apis_component_1 = require("./apis/apis.component");
var baggageinfo_component_1 = require("./baggageinfo/baggageinfo.component");
var departurehome_component_1 = require("./departurehome/departurehome.component");
var departureall_component_1 = require("./departureall/departureall.component");
var departurepaxlist_component_1 = require("./departurepaxlist/departurepaxlist.component");
var fqtvlist_component_1 = require("./fqtvlist/fqtvlist.component");
var fqtv_component_1 = require("./fqtv/fqtv.component");
var seatmap_component_1 = require("./seatmap/seatmap.component");
var setting_component_1 = require("./settings/setting.component");
var compensationsearch_component_1 = require("./compensationsearch/compensationsearch.component");
var compensationsearchresult_component_1 = require("./compensationsearchresult/compensationsearchresult.component");
var compensationadditionaldetails_component_1 = require("./compensationadditionaldetails/compensationadditionaldetails.component");
var issuecompensationwithtab_component_1 = require("./issuecompensationwithtab/issuecompensationwithtab.component");
var issuecompensation_component_1 = require("./issuecompensation/issuecompensation.component");
var compensation_selectsegment_component_1 = require("./compensation-selectsegment/compensation-selectsegment.component");
var compensation_selectpax_component_1 = require("./compensation-selectpax/compensation-selectpax.component");
var compensation_fqtvlist_component_1 = require("./compensation-fqtvlist/compensation-fqtvlist.component");
var compensation_searchresultwithtab_component_1 = require("./compensation-searchresultwithtab/compensation-searchresultwithtab.component");
var compensation_printscreen_component_1 = require("./compensation-printscreen/compensation-printscreen.component");
exports.AppRoutes = [
    { path: "", component: login_component_1.LoginComponent },
    { path: "home", component: home_component_1.HomeComponent },
    { path: "search", component: search_component_1.SearchComponent },
    { path: "searchresult", component: searchresult_component_1.SearchResultComponent },
    { path: "checkin", component: checkin_component_1.CheckInComponent },
    { path: "apis", component: apis_component_1.ApisComponent },
    { path: "baggageinfo", component: baggageinfo_component_1.BaggageinfoComponent },
    { path: "departhome", component: departurehome_component_1.DepartureHomeComponent },
    { path: "deppaxlist", component: departurepaxlist_component_1.DeparturePaxListComponent },
    { path: "departall", component: departureall_component_1.DepartureAllComponent },
    { path: "departall", component: departureall_component_1.DepartureAllComponent },
    { path: "fqtvlist", component: fqtvlist_component_1.FqtvListComponent },
    { path: "fqtv", component: fqtv_component_1.FqtvComponent },
    { path: "seatmap", component: seatmap_component_1.SeatMapComponent },
    { path: "setting", component: setting_component_1.SettingComponent },
    { path: "compensation", component: compensationsearch_component_1.CompensationSearchComponent },
    { path: "compensationresult", component: compensationsearchresult_component_1.CompensationSearchResultComponent },
    { path: "compensationadditionaldetails", component: compensationadditionaldetails_component_1.CompensationAdditionalDetailsComponent },
    { path: "issuecompensation", component: issuecompensation_component_1.IssueCompensationComponent },
    { path: "issuecompensationwithtab", component: issuecompensationwithtab_component_1.IssueCompensationWithTabComponent },
    { path: "compensationselectsegment", component: compensation_selectsegment_component_1.CompensationSelectSegment },
    { path: "compensationselectpax", component: compensation_selectpax_component_1.CompensationSelectPax },
    { path: "compensationfqtv", component: compensation_fqtvlist_component_1.CompensationFQTVList },
    { path: "compensationsearchresultwithtab", component: compensation_searchresultwithtab_component_1.CompensationSearchResultWithTabComponent },
    { path: "compensationprintscreen", component: compensation_printscreen_component_1.CompensationPrintScreenComponent }
];
exports.AppComponents = [
    login_component_1.LoginComponent,
    home_component_1.HomeComponent,
    search_component_1.SearchComponent,
    searchresult_component_1.SearchResultComponent,
    checkin_component_1.CheckInComponent,
    apis_component_1.ApisComponent,
    baggageinfo_component_1.BaggageinfoComponent,
    departureall_component_1.DepartureAllComponent,
    departurepaxlist_component_1.DeparturePaxListComponent,
    departurehome_component_1.DepartureHomeComponent,
    fqtvlist_component_1.FqtvListComponent,
    fqtv_component_1.FqtvComponent,
    seatmap_component_1.SeatMapComponent,
    setting_component_1.SettingComponent,
    compensationsearch_component_1.CompensationSearchComponent,
    compensationsearchresult_component_1.CompensationSearchResultComponent,
    compensationadditionaldetails_component_1.CompensationAdditionalDetailsComponent,
    issuecompensation_component_1.IssueCompensationComponent,
    issuecompensationwithtab_component_1.IssueCompensationWithTabComponent,
    compensation_selectsegment_component_1.CompensationSelectSegment,
    compensation_selectpax_component_1.CompensationSelectPax,
    compensation_fqtvlist_component_1.CompensationFQTVList,
    compensation_searchresultwithtab_component_1.CompensationSearchResultWithTabComponent,
    compensation_printscreen_component_1.CompensationPrintScreenComponent
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLnJvdXRpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhcHAucm91dGluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDJEQUF5RDtBQUN6RCx3REFBc0Q7QUFDdEQsOERBQTREO0FBQzVELGdGQUE4RTtBQUM5RSxpRUFBK0Q7QUFDL0Qsd0RBQXNEO0FBQ3RELDZFQUEyRTtBQUMzRSxtRkFBaUY7QUFDakYsZ0ZBQThFO0FBQzlFLDRGQUEwRjtBQUMxRixvRUFBa0U7QUFDbEUsd0RBQXNEO0FBQ3RELGlFQUErRDtBQUMvRCxrRUFBZ0U7QUFDaEUsa0dBQWdHO0FBQ2hHLG9IQUFrSDtBQUNsSCxtSUFBaUk7QUFDakksb0hBQWlIO0FBQ2pILCtGQUE2RjtBQUM3RiwwSEFBOEc7QUFDOUcsOEdBQWtHO0FBQ2xHLDJHQUErRjtBQUMvRiw0SUFBeUk7QUFDekksb0hBQWlIO0FBRXBHLFFBQUEsU0FBUyxHQUFRO0lBQzFCLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsZ0NBQWMsRUFBRTtJQUN2QyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLDhCQUFhLEVBQUU7SUFDMUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxrQ0FBZSxFQUFFO0lBQzlDLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBRSxTQUFTLEVBQUUsOENBQXFCLEVBQUU7SUFDMUQsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxvQ0FBZ0IsRUFBRTtJQUNoRCxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLDhCQUFhLEVBQUU7SUFDMUMsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLFNBQVMsRUFBRSw0Q0FBb0IsRUFBRTtJQUN4RCxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLGdEQUFzQixFQUFFO0lBQ3pELEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsc0RBQXlCLEVBQUU7SUFDNUQsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSw4Q0FBcUIsRUFBRTtJQUN2RCxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLDhDQUFxQixFQUFFO0lBQ3ZELEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsc0NBQWlCLEVBQUU7SUFDbEQsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSw4QkFBYSxFQUFFO0lBQzFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsb0NBQWdCLEVBQUU7SUFDaEQsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxvQ0FBZ0IsRUFBRTtJQUNoRCxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsU0FBUyxFQUFHLDBEQUEyQixFQUFFO0lBQ2pFLEVBQUUsSUFBSSxFQUFFLG9CQUFvQixFQUFFLFNBQVMsRUFBRyxzRUFBaUMsRUFBRTtJQUM3RSxFQUFFLElBQUksRUFBRSwrQkFBK0IsRUFBRSxTQUFTLEVBQUcsZ0ZBQXNDLEVBQUM7SUFDNUYsRUFBRSxJQUFJLEVBQUUsbUJBQW1CLEVBQUUsU0FBUyxFQUFHLHdEQUEwQixFQUFDO0lBQ3BFLEVBQUUsSUFBSSxFQUFFLDBCQUEwQixFQUFFLFNBQVMsRUFBRSxzRUFBaUMsRUFBQztJQUNqRixFQUFFLElBQUksRUFBRSwyQkFBMkIsRUFBRSxTQUFTLEVBQUcsZ0VBQXlCLEVBQUM7SUFDM0UsRUFBRSxJQUFJLEVBQUUsdUJBQXVCLEVBQUUsU0FBUyxFQUFDLHdEQUFxQixFQUFDO0lBQ2pFLEVBQUUsSUFBSSxFQUFFLGtCQUFrQixFQUFFLFNBQVMsRUFBQyxzREFBb0IsRUFBQztJQUMzRCxFQUFFLElBQUksRUFBRSxpQ0FBaUMsRUFBRSxTQUFTLEVBQUcscUZBQXdDLEVBQUM7SUFDaEcsRUFBRSxJQUFJLEVBQUUseUJBQXlCLEVBQUUsU0FBUyxFQUFHLHFFQUFnQyxFQUFDO0NBQ25GLENBQUM7QUFFVyxRQUFBLGFBQWEsR0FBUTtJQUM5QixnQ0FBYztJQUNkLDhCQUFhO0lBQ2Isa0NBQWU7SUFDZiw4Q0FBcUI7SUFDckIsb0NBQWdCO0lBQ2hCLDhCQUFhO0lBQ2IsNENBQW9CO0lBQ3BCLDhDQUFxQjtJQUNyQixzREFBeUI7SUFDekIsZ0RBQXNCO0lBQ3RCLHNDQUFpQjtJQUNqQiw4QkFBYTtJQUNiLG9DQUFnQjtJQUNoQixvQ0FBZ0I7SUFDaEIsMERBQTJCO0lBQzNCLHNFQUFpQztJQUNqQyxnRkFBc0M7SUFDdEMsd0RBQTBCO0lBQzFCLHNFQUFpQztJQUNqQyxnRUFBeUI7SUFDekIsd0RBQXFCO0lBQ3JCLHNEQUFvQjtJQUNwQixxRkFBd0M7SUFDeEMscUVBQWdDO0NBQ25DLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBMb2dpbkNvbXBvbmVudCB9IGZyb20gXCIuL2xvZ2luL2xvZ2luLmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgSG9tZUNvbXBvbmVudCB9IGZyb20gXCIuL2hvbWUvaG9tZS5jb21wb25lbnRcIjtcbmltcG9ydCB7IFNlYXJjaENvbXBvbmVudCB9IGZyb20gXCIuL3NlYXJjaC9zZWFyY2guY29tcG9uZW50XCI7XG5pbXBvcnQgeyBTZWFyY2hSZXN1bHRDb21wb25lbnQgfSBmcm9tIFwiLi9zZWFyY2hyZXN1bHQvc2VhcmNocmVzdWx0LmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgQ2hlY2tJbkNvbXBvbmVudCB9IGZyb20gXCIuL2NoZWNraW4vY2hlY2tpbi5jb21wb25lbnRcIjtcbmltcG9ydCB7IEFwaXNDb21wb25lbnQgfSBmcm9tIFwiLi9hcGlzL2FwaXMuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBCYWdnYWdlaW5mb0NvbXBvbmVudCB9IGZyb20gXCIuL2JhZ2dhZ2VpbmZvL2JhZ2dhZ2VpbmZvLmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgRGVwYXJ0dXJlSG9tZUNvbXBvbmVudCB9IGZyb20gXCIuL2RlcGFydHVyZWhvbWUvZGVwYXJ0dXJlaG9tZS5jb21wb25lbnRcIjtcbmltcG9ydCB7IERlcGFydHVyZUFsbENvbXBvbmVudCB9IGZyb20gXCIuL2RlcGFydHVyZWFsbC9kZXBhcnR1cmVhbGwuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBEZXBhcnR1cmVQYXhMaXN0Q29tcG9uZW50IH0gZnJvbSBcIi4vZGVwYXJ0dXJlcGF4bGlzdC9kZXBhcnR1cmVwYXhsaXN0LmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgRnF0dkxpc3RDb21wb25lbnQgfSBmcm9tIFwiLi9mcXR2bGlzdC9mcXR2bGlzdC5jb21wb25lbnRcIjtcbmltcG9ydCB7IEZxdHZDb21wb25lbnQgfSBmcm9tIFwiLi9mcXR2L2ZxdHYuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBTZWF0TWFwQ29tcG9uZW50IH0gZnJvbSBcIi4vc2VhdG1hcC9zZWF0bWFwLmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgU2V0dGluZ0NvbXBvbmVudCB9IGZyb20gXCIuL3NldHRpbmdzL3NldHRpbmcuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBDb21wZW5zYXRpb25TZWFyY2hDb21wb25lbnQgfSBmcm9tIFwiLi9jb21wZW5zYXRpb25zZWFyY2gvY29tcGVuc2F0aW9uc2VhcmNoLmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgQ29tcGVuc2F0aW9uU2VhcmNoUmVzdWx0Q29tcG9uZW50IH0gZnJvbSBcIi4vY29tcGVuc2F0aW9uc2VhcmNocmVzdWx0L2NvbXBlbnNhdGlvbnNlYXJjaHJlc3VsdC5jb21wb25lbnRcIjtcbmltcG9ydCB7IENvbXBlbnNhdGlvbkFkZGl0aW9uYWxEZXRhaWxzQ29tcG9uZW50IH0gZnJvbSBcIi4vY29tcGVuc2F0aW9uYWRkaXRpb25hbGRldGFpbHMvY29tcGVuc2F0aW9uYWRkaXRpb25hbGRldGFpbHMuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBJc3N1ZUNvbXBlbnNhdGlvbldpdGhUYWJDb21wb25lbnQgfSBmcm9tXCIuL2lzc3VlY29tcGVuc2F0aW9ud2l0aHRhYi9pc3N1ZWNvbXBlbnNhdGlvbndpdGh0YWIuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBJc3N1ZUNvbXBlbnNhdGlvbkNvbXBvbmVudCB9IGZyb20gXCIuL2lzc3VlY29tcGVuc2F0aW9uL2lzc3VlY29tcGVuc2F0aW9uLmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgQ29tcGVuc2F0aW9uU2VsZWN0U2VnbWVudCB9IGZyb20gXCIuL2NvbXBlbnNhdGlvbi1zZWxlY3RzZWdtZW50L2NvbXBlbnNhdGlvbi1zZWxlY3RzZWdtZW50LmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgQ29tcGVuc2F0aW9uU2VsZWN0UGF4IH0gZnJvbSBcIi4vY29tcGVuc2F0aW9uLXNlbGVjdHBheC9jb21wZW5zYXRpb24tc2VsZWN0cGF4LmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgQ29tcGVuc2F0aW9uRlFUVkxpc3QgfSBmcm9tIFwiLi9jb21wZW5zYXRpb24tZnF0dmxpc3QvY29tcGVuc2F0aW9uLWZxdHZsaXN0LmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgQ29tcGVuc2F0aW9uU2VhcmNoUmVzdWx0V2l0aFRhYkNvbXBvbmVudCB9IGZyb20gXCIuL2NvbXBlbnNhdGlvbi1zZWFyY2hyZXN1bHR3aXRodGFiL2NvbXBlbnNhdGlvbi1zZWFyY2hyZXN1bHR3aXRodGFiLmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgQ29tcGVuc2F0aW9uUHJpbnRTY3JlZW5Db21wb25lbnQgfSBmcm9tIFwiLi9jb21wZW5zYXRpb24tcHJpbnRzY3JlZW4vY29tcGVuc2F0aW9uLXByaW50c2NyZWVuLmNvbXBvbmVudFwiO1xuIFxuZXhwb3J0IGNvbnN0IEFwcFJvdXRlczogYW55ID0gW1xuICAgIHsgcGF0aDogXCJcIiwgY29tcG9uZW50OiBMb2dpbkNvbXBvbmVudCB9LFxuICAgIHsgcGF0aDogXCJob21lXCIsIGNvbXBvbmVudDogSG9tZUNvbXBvbmVudCB9LFxuICAgIHsgcGF0aDogXCJzZWFyY2hcIiwgY29tcG9uZW50OiBTZWFyY2hDb21wb25lbnQgfSxcbiAgICB7IHBhdGg6IFwic2VhcmNocmVzdWx0XCIsIGNvbXBvbmVudDogU2VhcmNoUmVzdWx0Q29tcG9uZW50IH0sXG4gICAgeyBwYXRoOiBcImNoZWNraW5cIiwgY29tcG9uZW50OiBDaGVja0luQ29tcG9uZW50IH0sXG4gICAgeyBwYXRoOiBcImFwaXNcIiwgY29tcG9uZW50OiBBcGlzQ29tcG9uZW50IH0sXG4gICAgeyBwYXRoOiBcImJhZ2dhZ2VpbmZvXCIsIGNvbXBvbmVudDogQmFnZ2FnZWluZm9Db21wb25lbnQgfSxcbiAgICB7IHBhdGg6IFwiZGVwYXJ0aG9tZVwiLCBjb21wb25lbnQ6IERlcGFydHVyZUhvbWVDb21wb25lbnQgfSxcbiAgICB7IHBhdGg6IFwiZGVwcGF4bGlzdFwiLCBjb21wb25lbnQ6IERlcGFydHVyZVBheExpc3RDb21wb25lbnQgfSxcbiAgICB7IHBhdGg6IFwiZGVwYXJ0YWxsXCIsIGNvbXBvbmVudDogRGVwYXJ0dXJlQWxsQ29tcG9uZW50IH0sXG4gICAgeyBwYXRoOiBcImRlcGFydGFsbFwiLCBjb21wb25lbnQ6IERlcGFydHVyZUFsbENvbXBvbmVudCB9LFxuICAgIHsgcGF0aDogXCJmcXR2bGlzdFwiLCBjb21wb25lbnQ6IEZxdHZMaXN0Q29tcG9uZW50IH0sXG4gICAgeyBwYXRoOiBcImZxdHZcIiwgY29tcG9uZW50OiBGcXR2Q29tcG9uZW50IH0sXG4gICAgeyBwYXRoOiBcInNlYXRtYXBcIiwgY29tcG9uZW50OiBTZWF0TWFwQ29tcG9uZW50IH0sXG4gICAgeyBwYXRoOiBcInNldHRpbmdcIiwgY29tcG9uZW50OiBTZXR0aW5nQ29tcG9uZW50IH0sXG4gICAgeyBwYXRoOiBcImNvbXBlbnNhdGlvblwiLCBjb21wb25lbnQgOiBDb21wZW5zYXRpb25TZWFyY2hDb21wb25lbnQgfSxcbiAgICB7IHBhdGg6IFwiY29tcGVuc2F0aW9ucmVzdWx0XCIsIGNvbXBvbmVudCA6IENvbXBlbnNhdGlvblNlYXJjaFJlc3VsdENvbXBvbmVudCB9LFxuICAgIHsgcGF0aDogXCJjb21wZW5zYXRpb25hZGRpdGlvbmFsZGV0YWlsc1wiLCBjb21wb25lbnQgOiBDb21wZW5zYXRpb25BZGRpdGlvbmFsRGV0YWlsc0NvbXBvbmVudH0sXG4gICAgeyBwYXRoOiBcImlzc3VlY29tcGVuc2F0aW9uXCIsIGNvbXBvbmVudCA6IElzc3VlQ29tcGVuc2F0aW9uQ29tcG9uZW50fSxcbiAgICB7IHBhdGg6IFwiaXNzdWVjb21wZW5zYXRpb253aXRodGFiXCIsIGNvbXBvbmVudDogSXNzdWVDb21wZW5zYXRpb25XaXRoVGFiQ29tcG9uZW50fSxcbiAgICB7IHBhdGg6IFwiY29tcGVuc2F0aW9uc2VsZWN0c2VnbWVudFwiICxjb21wb25lbnQgOiBDb21wZW5zYXRpb25TZWxlY3RTZWdtZW50fSxcbiAgICB7IHBhdGg6IFwiY29tcGVuc2F0aW9uc2VsZWN0cGF4XCIsIGNvbXBvbmVudDpDb21wZW5zYXRpb25TZWxlY3RQYXh9LFxuICAgIHsgcGF0aDogXCJjb21wZW5zYXRpb25mcXR2XCIsIGNvbXBvbmVudDpDb21wZW5zYXRpb25GUVRWTGlzdH0sXG4gICAgeyBwYXRoOiBcImNvbXBlbnNhdGlvbnNlYXJjaHJlc3VsdHdpdGh0YWJcIiwgY29tcG9uZW50IDogQ29tcGVuc2F0aW9uU2VhcmNoUmVzdWx0V2l0aFRhYkNvbXBvbmVudH0sXG4gICAgeyBwYXRoOiBcImNvbXBlbnNhdGlvbnByaW50c2NyZWVuXCIsIGNvbXBvbmVudCA6IENvbXBlbnNhdGlvblByaW50U2NyZWVuQ29tcG9uZW50fVxuXTtcblxuZXhwb3J0IGNvbnN0IEFwcENvbXBvbmVudHM6IGFueSA9IFtcbiAgICBMb2dpbkNvbXBvbmVudCxcbiAgICBIb21lQ29tcG9uZW50LFxuICAgIFNlYXJjaENvbXBvbmVudCxcbiAgICBTZWFyY2hSZXN1bHRDb21wb25lbnQsXG4gICAgQ2hlY2tJbkNvbXBvbmVudCxcbiAgICBBcGlzQ29tcG9uZW50LFxuICAgIEJhZ2dhZ2VpbmZvQ29tcG9uZW50LFxuICAgIERlcGFydHVyZUFsbENvbXBvbmVudCxcbiAgICBEZXBhcnR1cmVQYXhMaXN0Q29tcG9uZW50LFxuICAgIERlcGFydHVyZUhvbWVDb21wb25lbnQsXG4gICAgRnF0dkxpc3RDb21wb25lbnQsXG4gICAgRnF0dkNvbXBvbmVudCxcbiAgICBTZWF0TWFwQ29tcG9uZW50LFxuICAgIFNldHRpbmdDb21wb25lbnQsXG4gICAgQ29tcGVuc2F0aW9uU2VhcmNoQ29tcG9uZW50LFxuICAgIENvbXBlbnNhdGlvblNlYXJjaFJlc3VsdENvbXBvbmVudCxcbiAgICBDb21wZW5zYXRpb25BZGRpdGlvbmFsRGV0YWlsc0NvbXBvbmVudCxcbiAgICBJc3N1ZUNvbXBlbnNhdGlvbkNvbXBvbmVudCxcbiAgICBJc3N1ZUNvbXBlbnNhdGlvbldpdGhUYWJDb21wb25lbnQsXG4gICAgQ29tcGVuc2F0aW9uU2VsZWN0U2VnbWVudCxcbiAgICBDb21wZW5zYXRpb25TZWxlY3RQYXgsXG4gICAgQ29tcGVuc2F0aW9uRlFUVkxpc3QsXG4gICAgQ29tcGVuc2F0aW9uU2VhcmNoUmVzdWx0V2l0aFRhYkNvbXBvbmVudCxcbiAgICBDb21wZW5zYXRpb25QcmludFNjcmVlbkNvbXBvbmVudFxuXTsiXX0=