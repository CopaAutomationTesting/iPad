/************************************************************************************
 * (c) 2016-2017 Master Technology
 * Licensed under a commercial licensing
 *
 * Any questions please email me
 * Version 1.21		                                 Nathan@master-technology.com
 ***********************************************************************************/
"use strict";
/* global com, java, Promise, android, __extends, PrinterHelper, NSString, NSObject, MTPrinterDelegate, NSMutableDictionary */

var basePrinter = require('./print.js');

/*jshint -W079 */
var Document = basePrinter.Document;
var CRLF = "\r\n";

// These have to match the code in the Compiled iOS/Android Bluetooth support Library
var COMMAND = {QUIT: 0, PRINT: 2, GET: 1, RECONNECT: 3, STATUS: 4};

if (typeof NSString !== 'undefined') {
    //noinspection JSCheckFunctionSignatures
    var _PrinterDelegate = NSObject.extend({
        wrapper: null,
        did: 0,

        onEventDataError: function(id, data, error) {
            var newData = data.toString();
            /* console.log("OEDE", id, "DelId:", this.did, "Wrapper:",
                this.wrapper != null ? "true" : "false", // jshint ignore:line
                this.did != null ? this.did : 'this.did=null', // jshint ignore:line
                this !== currentDelegate ? "!!! THIS doesn't match" : "- Delegate Matches"); */
            this.wrapper._onEvent(id, newData, error);
        }
    }, {protocols: [MTPrinterDelegate]});
}


var did = 0;
var currentDelegate=null;
/**
 * Creates a new Printer
 * @param settings
 * @returns {Promise}
 * @constructor
 */
function Printer(settings) {
    if (!this instanceof Printer) { // jshint ignore:line
        //noinspection JSValidateTypes
        return new Printer(settings);
    }

    basePrinter.Printer.call(this, settings);
    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    if (typeof android !== 'undefined') {
        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
        this._printer = new com.master_technology.printer.support.PrinterCommunication(this._address);
    } else {
		this._printer = new PrinterHelper(this._address, "com.zebra.rawport");

        // Create Delegate
        //noinspection JSUnresolvedFunction
        this._delegate = _PrinterDelegate.alloc().init();
        currentDelegate = this._delegate;
        this._delegate.wrapper = this;
        did++;
        this.did = did;
        this._delegate.did = did;

        this._printer.delegate = this._delegate;
    }

    if (settings.debugging) {
        this._debugging = true;
        //noinspection JSUnresolvedFunction
        this._printer.enableDebugging();
    }

    this._commId = 0;
    this._commPromises = {};
    this._currentLanguage = 'AUTO';
    this._connectPromise = null;
    this._language = null;
    this._connected = false;
    this._onError = settings.onError || null;
    this._onCompletion = null;
    this._promiseCount=0;
    this._dotsWide = 0;
    this._dpi = 0;
    this._mmWide = 0;

    if (typeof settings.language !== "undefined") {
        this._currentLanguage = settings.language;
        if (this._currentLanguage !== "ZPL" && this._currentLanguage !== "CPCL" && this._currentLanguage !== "line_print" && this._currentLanguage !== "AUTO") {
            throw new Error("The printer language you set when creating a new Printer() is unsupported: ", this._currentLanguage,", please fix!");
        }
    }

    var that = this;
    return new Promise(function(resolve, reject) {
        that._connect().then(function() {
            resolve(that);
        }).catch(reject);
    });
}

// Use the TypeScript extend function to extend the basePrinter
__extends(Printer, basePrinter.Printer);

// Set the Driver Name
Printer.prototype.driver = Printer.driver = "ZEBRA";

Printer.prototype._onEvent = function (id, data, isError) {
    var promiseZero = false;
    if (this._debugging) {
        console.log("Got Event", id, data, isError);
    }
    var promise;
    if (id === -1) {
        console.error("Error from Printer", data);
        if (typeof this._onError === 'function') {
            this._onError(data);
        }
        return;
    } else if (id === 0) {  // We aren't tracking this request
        return;
    } else if (this._commPromises[id]) {
        promise = this._commPromises[id];
        delete this._commPromises[id];
        this._promiseCount--;
        if (this._promiseCount === 0 && typeof this._onCompletion === 'function') {
            promiseZero = true;
        }
    } else {
		if (this._debugging) {
			console.log("No existing promise for this id", id, " Error Status: ", isError);
			for (var key in this._commPromises) {
				if (this._commPromises.hasOwnProperty(key)) {
					console.log("    :", key);
				}
			}
			console.log("-----------------------");
		}
        return;
    }
    if (isError) {
        promise.reject(data);
        if (typeof this._onError === 'function') {
            this._onError(data);
        }
    } else {
        // Data comes as "value" so we have to remove the Quotes
        if (data && data.length) {
            data = data.replace(/"/g, '');
        }
        promise.resolve(data);
    }
    if (promiseZero) {
        this._onCompletion();
        this._onCompletion = null;
    }
};

/**
 * Opens a connection
 * @returns {*}
 * @private
 */
Printer.prototype._connect = function() {
    var that = this;
    if (this._connectPromise === true) {
        // If we somehow called connect but we have already resolved the initial promise; then we create
        // a dummy promise for the next caller attempting to attach so that re can resolve it for them...
        return new Promise(function(resolve) { resolve(); });
    } else if (this._connectPromise !== null) {
        // Return the outstanding promise, if it exists
        return this._connectPromise;
    }



    // Create a new connection promise
    this._connectPromise = new Promise(function(result, reject) {
        //noinspection JSUnresolvedVariable,JSUnresolvedFunction

        if (typeof android !== 'undefined') {
            //noinspection JSUnresolvedFunction,JSUnresolvedVariable
            that._printer.setEventListener(new com.master_technology.printer.support.PrinterListener(
                {
                    onEvent: function (id, data, error) {
                        that._onEvent(id, data, error);
                    }
                }));
            that._printer.start();
        }
        // IOS Sets up its delegate at creation, not here...

        that._connected = true;

        // Actually send the connection message
        that._sendMessageToPrinterCreatePromise(COMMAND.RECONNECT, null)
            .then(function() {
                return that.getSetting("media.width_sense.in_dots");
            })
            .then(function(value) {
                that._dotsWide = parseInt(value.toString(), 10);
                if (that._dotsWide <= 0) {
                    that._dotsWide = 576;
                }
                return that.getSetting("media.width_sense.in_mm");
            })
            .then(function(value) {
                that._mmWide = parseInt(value.toString(), 10);
                if (that._mmWide <= 0) {
                    that._dpi = 8;
                    that._mmWide = 72;
                } else {
                    that._dpi = that._dotsWide / that._mmWide;
                }
                if (that._debugging) {
					console.log("!!!! Media Width", that._dotsWide, that._mmWide, that._dpi);
				}
                return that.getSetting("device.languages");
            })
            .then(function (value) {
                if (that._currentLanguage === "AUTO") {
                    if (value === "line_print") {
                        value = "CPCL";
                    }
                    that._currentLanguage = value;
                }
                return that._loadLanguage();
            })
            .then(function() {
                // TODO: We might to make the a CPCL only command, unsure...
                return that._sendMessageToPrinter(COMMAND.PRINT, "! U1 SETLP-TIMEOUT 0"+CRLF);
            })
            .then(function () {
                that._connectPromise = true;
                result();
            })
            .catch(function(e) {
                console.error("Error",e);
                that._sendMessageToPrinter(COMMAND.QUIT, null, null);
                that._connected = false;
                reject(e);
            });

    });
    return this._connectPromise;
};


/**
 * Closes the Connection, this printer object is now DEAD and no longer usable
 * @returns {Promise<T>}
 */
Printer.prototype.close = function() {
    var that = this;
    if (this._debugging) {
        console.log("Closing connection normally, isOpen:", this._connected);
    }

    return new Promise(function(resolve) {
        if (!that._connected) {
            resolve();
            return;
        }
        that._sendMessageToPrinterCreatePromise(COMMAND.QUIT, null)
            .then(function() {
                if (that._debugging && typeof NSString !== 'undefined') {
                    console.log("Close Acknowledged, driver is dead!", that.did);
                    console.log("Wrapper: ", that._delegate.wrapper ? "Exists" : "Null");
                    console.log("Delegate: ", that._delegate === that._printer.delegate ? "Same" : "Different");
                }
                if (typeof NSString !== 'undefined') {
                    setTimeout(function () {
                        if (that._debugging) {
                            console.log("Clearing CurrentDelegate");
                        }
                        if (currentDelegate === that._delegate) {
                            currentDelegate = null;
                        }
                        if (that._debugging) {
                            console.log("Clearing Wrapper");
                        }
                        that._delegate.wrapper = null;
                        if (that._debugging) {
                            console.log("Clearing _delegate");
                        }
                        that._delegate = null;
                        if (that._debugging) {
                            console.log("clearing .delegate");
                        }
                        that._printer.delegate = null;
                        if (that._debugging) {
                            console.log("done clearing");
                        }
                    }, 3000);
                }
                resolve();

            });
        that._connected = false;
    });
};

/**
 * Sends a message to the printer and creates a response promise
 * @param command
 * @param data
 * @returns {Promise<T>}
 * @private
 */
Printer.prototype._sendMessageToPrinterCreatePromise = function(command, data) {
    var that = this;
    return new Promise(function(resolve, reject) {
        that._sendMessageToPrinter(command, data, {resolve: resolve, reject: reject});
    });
};

/**
 * Sends a message to the printer
 * @param command - REQUIRED
 * @param data - REQUIRED
 * @param promise - REQUIRED
 * @private
 */
if (typeof android !== 'undefined') {
    Printer.prototype._sendMessageToPrinter = function(command, data, promise) {
        if (this._debugging) {
            console.log("Android SendMessage: ", command, "Promise Id", promise ? (this._commId+1) : 0);
        }
        var transfer;
        if (promise) {
            this._commId++;

            //noinspection JSUnresolvedVariable,JSUnresolvedFunction
            transfer = new com.master_technology.printer.support.PrinterData(this._commId, command, data);
            this._promiseCount++;
            this._commPromises[this._commId] = promise;
        } else {
            //noinspection JSUnresolvedVariable,JSUnresolvedFunction
            transfer = new com.master_technology.printer.support.PrinterData(0, command, data);
        }
        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
        this._printer.addObject(transfer);
    };
} else {
    Printer.prototype._sendMessageToPrinter = function(command, data, promise) {
        if (this._debugging) {
            console.log("iOS SendMessage: ", command, "Promise Id", promise ? (this._commId+1) : 0);
        }
        //noinspection JSUnresolvedFunction
        var transfer = NSMutableDictionary.alloc().init();
        if (promise) {
            this._commId++;
            //noinspection JSUnresolvedFunction
            transfer.setObjectForKey(this._commId, 'id');

            this._promiseCount++;
            this._commPromises[this._commId] = promise;
        } else {
            //noinspection JSUnresolvedFunction
            transfer.setObjectForKey(0, 'id');

        }
        //noinspection JSUnresolvedFunction
        transfer.setObjectForKey(command, 'command');
        if (data == null) { data = ""; } // jshint ignore:line

        //noinspection JSUnresolvedFunction
        transfer.setObjectForKey(NSString.alloc().initWithString(data), 'Data');

        //noinspection JSUnresolvedFunction
        this._printer.addObject(transfer);
    };



}
/**
 * Returns if the class is connected
 * @returns {boolean}
 */
Printer.prototype.isConnected = function() {
    return this._connected;
};

/**
 * Checks to see if the printer is connected
 * @returns {Promise.<T>}
 */
Printer.prototype.isPrinterConnected = function() {
    var that = this;
    return new Promise(function(resolve, reject) {
        return that._sendMessageToPrinterCreatePromise(COMMAND.STATUS, null)
            .then(
                function(strValue) {
                    //noinspection JSValidateTypes
                    if (strValue === "true") {
                        resolve();
                    } else {
                        reject();
                    }
                }
            ).catch(reject);
    });

};

/**
 * If this connection has somehow been lost, you can re-connect it using this call
 * @returns {Promise.<T>}
 */
Printer.prototype.reconnect = function() {
    return this._sendMessageToPrinterCreatePromise(COMMAND.RECONNECT, null);
};

/**
 * Allows you to set a promise that is called when the print queue is empty
 * @returns {Promise<T>}
 */
Printer.prototype.onCompletion = function() {
    var that = this;
    return new Promise(function (resolve) {
        if (that._promiseCount === 0) {
            resolve();
        }
        else {
            that._onCompletion = resolve;
        }
    });
};


/**
 * Get a printer setting
 * @param key
 * @returns {Promise<T>}
 */
Printer.prototype.getSetting = function(key) {
    var that = this;
    return new Promise(function(resolve, reject) {
        if (!that.isConnected()) {
            that._connect().then(function() { that._getSetting(key, {resolve: resolve, reject: reject}); }).catch(reject);
        } else {
            that._getSetting(key, {resolve: resolve, reject: reject});
        }
    });
};

/**
 * Set a printer setting
 * @param key
 * @param value
 * @returns {Promise<T>}
 */
Printer.prototype.setSetting = function(key, value) {
    var that = this;
    return new Promise(function(resolve, reject) {
        if (!that.isConnected()) {
            that._connect().then(function() { that._setSetting(key, value, {resolve: resolve, reject: reject}); }).catch(reject);
        } else {
            that._setSetting(key, value, {resolve: resolve, reject: reject});
        }
    });
};

/**
 * Gets the current printer status
 * @returns {Promise<T>}
 */
Printer.prototype.getStatus = function() {
    var that = this;
    return new Promise(function(resolve, reject) {
        if (!that.isConnected()) {
            that._connect().then(function() { that._getStatus({resolve: resolve, reject: reject}); }).catch(reject);
        } else {
            that._getStatus({resolve: resolve, reject: reject});
        }
    });
};

/**
 * Internal get Settings
 * @param key
 * @param promise
 * @private
 */
Printer.prototype._getSetting = function(key, promise) {
    var data = '! U1 getvar "'+key+'"' + CRLF;
    this._sendMessageToPrinter(COMMAND.GET, data, promise);
};

/**
 * Internal set settings
 * @param key
 * @param value
 * @param promise
 * @private
 */
Printer.prototype._setSetting = function(key, value, promise) {
    var data = '! U1 setvar "'+key+'" "' + value + '"' + CRLF;
    this._sendMessageToPrinter(COMMAND.PRINT, data, promise);
};

/**
 * Turn off the power to the printer
 */
//noinspection JSUnusedGlobalSymbols
Printer.prototype.powerOff = function() {
    this._sendMessageToPrinter(COMMAND.PRINT, "\x1Bp");
    this.close();
};

/**
 * Gets and returns the current printer status
 * @param promise
 * @private
 */
Printer.prototype._getStatus = function(promise) {
    this._language.getPrinterStatus(this, promise, COMMAND);
};

/**
 * Returns the Current Printer language
 * @returns {Promise<T>}
 */
Printer.prototype.getLanguage = function() {
    var that = this;
    // Have to use new promise because we want to also capture the result value an use it in addition to returning it to them
    return new Promise(function(resolve, failed) {
        that.getSetting("device.languages").then(function(result) {
            if (result !== that._currentLanguage) {
                that._currentLanguage = result;
                that._loadLanguage().then(function() {
                    resolve(result);
                }).catch(failed);
            } else {
                resolve(result);
            }
        }).catch(failed);
    });
};

/**
 * Prints a Document or a string to the printer
 * @param {Document} document - Document object or a raw string
 * @param options - Printer Options
 */
Printer.prototype.print = function(document, options) {
    if (document.isDocument) {
        return this._sendMessageToPrinterCreatePromise(COMMAND.PRINT, this._render(document, options));
    } else {
        return this._sendMessageToPrinterCreatePromise(COMMAND.PRINT, document);
    }
};

/**
 * Render the Document into the Printer Language
 * @param document
 * @param options
 */
Printer.prototype._render = function(document, options) {
    return this._language.render(document, options);
};

/**
 * Returns a new Document
 * @param options
 * @returns {Document}
 */
Printer.prototype.createDocument = function(options) {
    return new Document(this, options);
};

/**
 * Loads a Printer Language file
 * @private
 */
Printer.prototype._loadLanguage = function() {
    var that = this;

    var language = this._currentLanguage.toLowerCase();
    if (language === "epl_zpl" || language === "hybrid_xml_zpl") { language = "zpl"; }
    if (language === "line_print") { language = "cpcl"; }
    return new Promise(function(resolve, reject) {
        try {
            that._language = require('./lib/language-' + language + '.js');
        } catch (err) {
            console.error("Language file doesn't exist", language, "Error: ", err);
            that._language = require('./lib/language-cpcl.js');
        }

        Document.prototype.isLineMode = !!that._language.LINEMODE;
        Document.prototype.BARCODE = that._language.BARCODES;
        Document.prototype.getFontHeight = that._language.getFontHeight;
        Document.prototype.getFontWidth = that._language.getFontWidth;
        Document.prototype.dotsWide  = that._dotsWide;

        if (typeof that._language.languageSetup === 'function') {
            that._language.languageSetup(that, resolve, reject);
        } else {
            resolve();
        }
    });

};

Printer.prototype.reset = function() {
	return this.setSetting("device.reset","");
};

// ------------------------------------------------------------------------------------------------------------------------------

// Export the Printer structure
exports.Printer = Printer;

// Load and export the Discovery Library
exports.Discovery = require('./lib/discovery.js');

