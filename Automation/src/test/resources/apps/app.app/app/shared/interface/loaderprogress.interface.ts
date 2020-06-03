import { ElementRef } from "@angular/core";
import { ActivityIndicator } from "ui/activity-indicator";
import { StackLayout } from "ui/layouts/stack-layout";
import { Label } from "ui/label";
import { View } from "ui/core/view";


export class LoaderProgress {
    private _isLoading: boolean = false;
    private _loadingText: string = "Please Wait..."
    public activityInd: ActivityIndicator;
    public back_container: StackLayout;
    public loader_container: StackLayout;
    public loader_label: Label;



    get IsLoading(): boolean {
        return this._isLoading;
    }

    get LoadingText(): string {
        return this._loadingText;
    }

    public showLoader(loadingText?: string) {
        this._isLoading = true;
        if (loadingText) {
            this.loader_label.text = loadingText;
        }
        this.activityInd.busy = true;
        this.back_container.visibility = 'visible';
    }

    public hideLoader() {
        this._isLoading = false;
        this.activityInd.busy = false;
        this.back_container.visibility = 'collapse';
    }



    // <StackLayout [visibility]="loaderProgress.IsLoading ? 'visible' : 'collapsed'" style="vertical-align:middle;background-color: rgba(0,0,0,0.6); "
    //         height="100%" width="100%">
    //         <StackLayout width="200" style="horizontal-align:center;background-color:#DDD; padding:20;">
    //             <ActivityIndicator busy="{{ loaderProgress.IsLoading }}" width="100%"></ActivityIndicator>
    //             <Label text="{{loaderProgress.LoadingText}}" textWrap="true" style="horizontal-align:center; font-size:13;color:#AAA; padding-top:10"></Label>
    //         </StackLayout>
    //     </StackLayout>  
    public initLoader(currentView: ElementRef, loadingText?: string) {


        var indView = currentView.nativeElement;

        this.loader_label = new Label;
        this.loader_label.className = "loader-label";
        if (loadingText) {
            this.loader_label.text = loadingText;
        } else {
            this.loader_label.text = this._loadingText;
        }


        this.activityInd = new ActivityIndicator();
        this.activityInd.className = "loader";
        this.activityInd.busy = false;

        this.loader_container = new StackLayout();
        this.loader_container.className = "loader-container";
        if (this.activityInd.ios) this.activityInd.ios.activityIndicatorViewStyle = "0"
        this.loader_container.addChild(this.activityInd);
        // this.loader_container.addChild(this.loader_label);

        this.back_container = new StackLayout();
        this.back_container.className = "loader-back";
        this.back_container.visibility = 'collapse';
        this.back_container.addChild(this.loader_container);

        indView.addChild(this.back_container);
    }


}
