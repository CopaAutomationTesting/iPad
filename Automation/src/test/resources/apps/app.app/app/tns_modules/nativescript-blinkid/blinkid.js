"use strict";
var coordinatorWithError = function (error, type, licenseKeys) {
    if (PPCameraCoordinator.isScanningUnsupportedForCameraTypeError(PPCameraTypeBack, error)) {
        return null;
    }
    var settings = PPSettings.alloc().init();
    settings.licenseSettings.licenseKey = licenseKeys;
    if (type == "Passport") {
        var mrtdRecognizerSettings = PPMrtdRecognizerSettings.alloc().init();
        mrtdRecognizerSettings.dewarpFullDocument = false;
        settings.scanSettings.addRecognizerSettings(mrtdRecognizerSettings);
    }
    else {
        var pdf417RecognizerSettings = PPPdf417RecognizerSettings.alloc().init();
        settings.scanSettings.addRecognizerSettings(pdf417RecognizerSettings);
        var zxingRecognizerSettings = PPZXingRecognizerSettings.alloc().init();
        settings.scanSettings.addRecognizerSettings(zxingRecognizerSettings);
        zxingRecognizerSettings.scanQR = true;
        zxingRecognizerSettings.scanAztec = true;
    }
    var coordinator = PPCameraCoordinator.alloc().initWithSettings(settings);
    return coordinator;
};
exports.didTapScan = function (type, licenseKey) {
    var _this = this;
    return new Promise(function (resolve, reject) {
        console.log(licenseKey);
        var error = new interop.Reference();
        var coordinator = coordinatorWithError(error, type, licenseKey);
        if (coordinator == null) {
            var messageString = error.localizedDescription;
            UIAlertView.alloc().initWithTitleMessageDelegateCancelButtonTitleOtherButtonTitles("Warning", messageString, null, "Ok").show();
            return;
        }
        _this.listener = PPScanningDelegateImpl.new().initWithCallback(resolve, type);
        var scanningViewController;
        scanningViewController = PPViewControllerFactory.cameraViewControllerWithDelegateCoordinatorError(_this.listener, coordinator, null);
        scanningViewController.autorotate = true;
        scanningViewController.supportedOrientations = UIInterfaceOrientationMaskAll;
        var frame = require("ui/frame");
        var topMostFrame = frame.topmost();
        if (topMostFrame) {
            var viewController = topMostFrame.currentPage && topMostFrame.currentPage.ios;
            if (viewController) {
                viewController.presentViewControllerAnimatedCompletion(scanningViewController, true, null);
            }
        }
    });
};
var PPScanningDelegateImpl = (function (_super) {
    __extends(PPScanningDelegateImpl, _super);
    function PPScanningDelegateImpl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._type = "";
        return _this;
    }
    PPScanningDelegateImpl.new = function () {
        return _super.new.call(this);
    };
    PPScanningDelegateImpl.prototype.initWithCallback = function (callback, type) {
        this._callback = callback;
        this._type = type;
        return this;
    };
    PPScanningDelegateImpl.prototype.scanningViewControllerUnauthorizedCamera = function (scanningViewController) {
        console.info('scanningViewControllerUnauthorizedCamera');
    };
    PPScanningDelegateImpl.prototype.scanningViewControllerDidFindError = function (scanningViewController, error) {
        console.info('scanningViewControllerDidFindError');
    };
    PPScanningDelegateImpl.prototype.scanningViewControllerDidClose = function (scanningViewController) {
        console.info('scanningViewControllerDidClose');
        scanningViewController.dismissViewControllerAnimatedCompletion(1, null);
    };
    PPScanningDelegateImpl.prototype.scanningViewControllerDidOutputResults = function (scanningViewController, results) {
        console.info('scanningViewControllerDidOutputResults');
        if (this._callback) {
            if (this._type == "Passport") {
                this.setMrtdDataAndCallCallback(results[0]);
            }
            else {
                this.setPdfDataAndCallCallback(results[0]);
            }
        }
        scanningViewController.dismissViewControllerAnimatedCompletion(1, null);
    };
    PPScanningDelegateImpl.prototype.scanningViewControllerDidOutputMetadata = function (scanningViewController, metadata) {
        console.info('scanningViewControllerDidOutputMetadata');
    };
    PPScanningDelegateImpl.prototype.alertViewClickedButtonAtIndex = function (alertView, buttonIndex) {
        console.info('alertViewClickedButtonAtIndex');
        scanningViewController.dismissViewControllerAnimatedCompletion(1, null);
    };
    PPScanningDelegateImpl.prototype.setMrtdDataAndCallCallback = function (mrtdData) {
        this._callback(mrtdData);
    };
    PPScanningDelegateImpl.prototype.setPdfDataAndCallCallback = function (pdf417Data) {
        this._callback(pdf417Data);
    };
    PPScanningDelegateImpl.prototype.setPdfDataAndCallCallback = function (qrData) {
        this._callback(qrData);
    };
    return PPScanningDelegateImpl;
}(NSObject));
PPScanningDelegateImpl.ObjCProtocols = [PPScanningDelegate];
//# sourceMappingURL=blinkid.js.map