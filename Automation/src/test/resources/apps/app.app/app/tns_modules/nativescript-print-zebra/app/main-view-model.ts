import { Observable } from 'data/observable';
import { Discovery, Printer } from 'nativescript-print-zebra';
// import {appSettings} from 'application-settings';
import * as appSettings from 'application-settings';

var printId = "", binding = new Observable();
function getPrinter() {
	if (appSettings.hasKey('printer')) {
		printId = appSettings.getString('printer', '');
		binding.set("printer", "Printer: " + printId);
        console.log(printId); // Prints out a list of devices found!
		
	}
}
export class HelloWorldModel extends Observable {
	public message: string;
	private discovery: Discovery;

	constructor() {
		super();
		this.discovery = new Discovery();
		this.discovery.searchBluetooth().then(function (printers) {
            var count = printers.length;
            // for (var i=0;i<count;i++) {
            // 	var printer = printers.get(i);
            // 	this.pdata.push({name: printer.friendlyName, address: printer.address});
            // }
            // console.dump(this.pdata); // Prints out a list of devices found!
            // });
            if (count === 0) {
                console.log("message", "Unable to find");
            } else if (count === 1) {
                // We found a valid printer
                appSettings.setString('printer', printers[0].address);
                getPrinter();
            }
            // else {
            //     // We found some devices; show them to allow it to be picked
            //     page.showModal('discoveryList', { printers: printers }, function (result) {
            //         if (result) {
            //             appSettings.setString('printer', result.toString());
            //             getPrinter();
            //         }
        });
		this.message = "Testing";
		new Printer({ address: "XXQPJ162400947", language: 'CPCL' }).then(function (curPrinter, result) {
			var document = curPrinter.createDocument();
			document.image('~/sample.jpeg',0);
            // document.text('~/BoardingPassATO_2.pdf',0);
			curPrinter.print(document).then(function () {
				curPrinter.disconnect();
			});
		});
	}
}
