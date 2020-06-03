/************************************************************************************
 * (c) 2016-2017 Master Technology
 * Licensed under a commercial licensing
 *
 * Any questions please feel free to email me or put a issue up on github
 * Version 1.20                                 Nathan@master-technology.com
 ***********************************************************************************/
"use strict";
/* global EAAccessoryManager, Promise */

function Discovery() {
    if (!this instanceof Discovery) { // jshint ignore:line
        //noinspection JSValidateTypes
        return new Discovery();
    }
}

Discovery.prototype.searchBluetooth = function() {
    return new Promise(function(resolve)
    {
        var results = [];
        //noinspection JSUnresolvedFunction
        var sam = EAAccessoryManager.sharedAccessoryManager();

        //noinspection JSUnresolvedFunction
        var connectedDevices = sam.connectedAccessories;
        for (var i=0;i<connectedDevices.count;i++) {
            //noinspection JSUnresolvedFunction
            var accessory = connectedDevices.objectAtIndex(i);

            //console.log("Found objects");
			//console.dump(accessory);

		    //noinspection JSUnresolvedVariable
            if ((accessory.protocolStrings.toString().indexOf('com.zebra.rawport') !== -1) || (accessory.protocolStrings.toString().indexOf('com.epson.escpos') !== -1)) {
                //noinspection JSUnresolvedVariable

                results.push({address: accessory.serialNumber.toString(), friendlyName: accessory.name.toString()});
            }
        }
        resolve(results);
    });
};

module.exports = Discovery;