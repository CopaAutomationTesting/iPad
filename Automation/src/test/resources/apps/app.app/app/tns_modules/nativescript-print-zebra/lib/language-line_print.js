/************************************************************************************
 * (c) 2016 Master Technology
 * Licensed under a commercial licensing
 *
 * Any questions please email me
 * Version 1.01                                 Nathan@master-technology.com
 ***********************************************************************************/
"use strict";
/* global com, java, Promise */

// All commands need a CR/LF pair
var CRLF = "\r\n";

var defaultFont = 0;
var defaultFontSize = 3;
var currentFont = 0;
var currentFontSize = 3;

// --------------------------------------------------------------------------------------------------------------------

exports.render = function(document, options) {
    var results = "";
    //options = options || {};

    // Reset back to Defaults on a new render
    defaultFont = 0;
    defaultFontSize = 3;

    var data = document._getData();

    for (var i=0;i<data.length;i++) {
        try {
            switch (data[i].cmd) {
                case document.LANGUAGE_COMMANDS.TEXT: // Text
                    results += handleText(data[i]);
                    break;
                case document.LANGUAGE_COMMANDS.ALIGNMENT: // Alignment
                    results += handleAlignment(data[i]);
                    break;
                case document.LANGUAGE_COMMANDS.BOLD: // Bold
                    results += handleBold(data[i]);
                    break;
                case document.LANGUAGE_COMMANDS.BARCODE: // Barcode
                    results += handleBarcode(data[i]);
                    break;
                case document.LANGUAGE_COMMANDS.BOX: // Box
                    results += handleBox(data[i]);
                    break;
                case document.LANGUAGE_COMMANDS.LINE: // Line
                    results += handleLine(data[i]);
                    break;
                case document.LANGUAGE_COMMANDS.FONT: // Font
                    results += handleFont(data[i]);
                    break;
                case document.LANGUAGE_COMMANDS.RAW: // Raw
                    results += data[i].raw;
                    break;
                case document.LANGUAGE_COMMANDS.NEWLINE:
                    results += handleNewLine(data[i]);
                    break;
                case document.LANGUAGE_COMMANDS.LABEL:
                    results += handleLabel(data[i]);
                    break;
                case document.LANGUAGE_COMMANDS.IMAGE:
                    results += handleImage(data[i]);
                    break;
                default:
                    console.log("Command", data[i].cmd, "is not supported in CPCL mode, skipped.");
            }
        } catch (err) {
            console.log("Error processing: ", data[i], ", skipped.  Error:", err);
        }
    }

    // Add header/footer
    results = "! U1 BEGIN-PAGE" + CRLF + results + "! U1 END-PAGE" + CRLF;

    return results;
};

function handleImage(data) {
    return 'EG '+data.width+" "+data.height+" " + data.x + " " + data.y + " " + data.data + CRLF;
}

function handleBox (data) {
    return '! U1 BOX '+data.x1.toString()+" "+data.y1.toString()+" "+data.x2.toString()+" "+data.y2.toString()+" "+data.thickness.toString() + CRLF;
}

function handleLine(data) {
    return '! U1 LINE '+data.x1.toString()+" "+data.y1.toString()+" "+data.x2.toString()+" "+data.y2.toString()+" "+data.thickness.toString() + CRLF;
}

function handleBold(data) {
    if (data.bold) {
        return '! U1 SETBOLD 3' + CRLF;
    } else {
        return '! U1 SETBOLD 0' + CRLF;
    }
}

function handleAlignment(data) {
    switch (data.align) {
        case 'center': return "! U1 CENTER" + CRLF;
        case 'left': return "! U1 LEFT" + CRLF;
        case 'right': return "! U1 RIGHT" + CRLF;
    }
    return "";
}

function handleFont(data) {
    defaultFont = data.id;
    var size = data.size;

    if (data.id === '0' || data.id === 0) {
        if (size > 15) { size = 3; }
    }
    defaultFontSize = size;

    return setFont(data.id, size);    
}

function setFont(id, size) {
    if (id === '0' || id === 0) {
        if (size > 15) { size = 3; }
    }
    currentFont = id;
    currentFontSize = size;
    return '! U1 SETLP ' + id +" " + size + " " + fontTable[id][size].HEIGHT + CRLF;
}

function handleNewLine() {
    return CRLF;
}

function handleText(data) {
    var newFont = defaultFont;
    var newFontSize = defaultFontSize;
    var result = "";
    
    if (typeof data.font !== 'undefined') {
        newFont = parseInt(data.font,0);
    }
    if (typeof data.size !== 'undefined') {
        newFontSize = parseInt(data.size);
    }
    
    if (newFont !== currentFont || newFontSize !== currentFontSize) {
        result += setFont(newFont, newFontSize);
    }
    
    result += data.text;

    return result;
}

function handleBarcode(data) {

    var results = "! U1 BARCODE ";

    // Is this the object
    if (typeof data.type.NAME !== "undefined") {
        results += data.type.NAME + " " + data.type.WIDTH + " " + data.type.RATIO + " ";
    } else {
        results += data.BARCODE[data.type].NAME + " " + data.BARCODE[data.type].WIDTH + " " + data.BARCODE[data.type].RATIO + " ";
    }

    results += data.height + " 0 " + data.y + " " +  data.data + CRLF;

    return results;
}

function handleLabel(data) {
    var results = "! U1 UF " + data.name + CRLF;
    for (var i=0;i<data.values.length;i++) {
        results += data.values[i] + CRLF;
    }
    return results;
}

var fontTable = /*** Built in Fonts of Zebra Printers ***/
    [
        /* Font 0 */ {0: {HEIGHT: 9, WIDTH: 8},    1: {HEIGHT: 9, WEIGHT: 16},  2: {HEIGHT: 18, WIDTH: 8},   3: {HEIGHT: 18, WIDTH: 16},
        4: {HEIGHT: 18, WIDTH: 32},  5: {HEIGHT: 36, WIDTH: 16},  6: {HEIGHT: 36, WIDTH: 32}  },
        /* Font 1 */ {0: {HEIGHT: 48, WIDTH: 22}},
        /* Font 2 */ {0: {HEIGHT: 12, WIDTH: 20},  1: {HEIGHT: 24, WIDTH: 20}},
        { /* Font 3 does not exist */ },
        /* Font 4 */ {0: {HEIGHT: 47, WIDTH: 28},  1: {HEIGHT: 94, WIDTH: 28},  2: {HEIGHT: 45, WIDTH: 50},  3: {HEIGHT: 90, WIDTH: 50},
        4: {HEIGHT: 180, WIDTH: 50}, 5: {HEIGHT: 270, WIDTH: 50}, 6: {HEIGHT: 360, WIDTH: 50}, 7: {HEIGHT: 450, WIDTH: 50}},
        /* Font 5 */ {0: {HEIGHT: 24, WIDTH: 20},  1: {HEIGHT: 48, WIDTH: 20},  2: {HEIGHT: 46, WIDTH: 30},  3: {HEIGHT: 92, WIDTH: 30}},
        /* Font 6 */ {0: {HEIGHT: 27, WIDTH: 28}},
        /* Font 7 */ {0: {HEIGHT: 24, WIDTH: 12},  1: {HEIGHT: 48, WIDTH: 12}}
    ];


exports.BARCODES = {
    /* UPC-A */             "UPCA":      {NAME: "UPCA",      WIDTH: 2, RATIO: 1},
    "UPCA2":     {NAME: "UPCA2",     WIDTH: 2, RATIO: 1},
    "UPCA5":     {NAME: "UPCA5",     WIDTH: 2, RATIO: 1},
    /* UPC-E */             "UPCE":      {NAME: "UPCE",      WIDTH: 2, RATIO: 1},
    "UPCE2":     {NAME: "UPCE2",     WIDTH: 2, RATIO: 1},
    "UPCE5":     {NAME: "UPCE5",     WIDTH: 2, RATIO: 1},
    /* Ean 13 */            "EAN13":     {NAME: "EAN13",     WIDTH: 2, RATIO: 1},
    "EAN132":    {NAME: "EAN132",    WIDTH: 2, RATIO: 1},
    "EAN135":    {NAME: "EAN135",    WIDTH: 2, RATIO: 1},
    /* Ean 8 */             "EAN8":      {NAME: "EAN8",      WIDTH: 2, RATIO: 1},
    "EAN82":     {NAME: "EAN82",     WIDTH: 2, RATIO: 1},
    "EAN 85":    {NAME: "EAN 85",    WIDTH: 2, RATIO: 1},
    "EAN85":     {NAME: "EAN 85",    WIDTH: 2, RATIO: 1},
    /* Code 39 */           "39":        {NAME: "39",        WIDTH: 2, RATIO: 2},
    "39C":       {NAME: "39C",       WIDTH: 2, RATIO: 2},
    "F39":       {NAME: "F39",       WIDTH: 2, RATIO: 2},
    "F39C":      {NAME: "F39C",      WIDTH: 2, RATIO: 2},
    /* Code 93 */           "93":        {NAME: "93",        WIDTH: 1, RATIO: 0},
    /* Interleave 2 of 5 */ "I2OF5":     {NAME: "I2OF5",     WIDTH: 2, RATIO: 2},
    "I2OF5C":    {NAME: "I2OF5C",    WIDTH: 2, RATIO: 2},
    "I2OF5G":    {NAME: "I2OF5G",    WIDTH: 2, RATIO: 2},
    /* Code 128 */          "128" :      {NAME: "128",       WIDTH: 2, RATIO: 0},
    /* UCC EAN 128 */       "UCCEAN128": {NAME: "UCCEAN128", WIDTH: 2, RATIO: 0},
    /* CODABAR */           "CODABAR":   {NAME: "CODABAR",   WIDTH: 2, RATIO: 2},
    "CODABAR16": {NAME: "CODABAR16", WIDTH: 2, RATIO: 2},
    /* MSI/Plessy MSI */    "MSI":       {NAME: "MSI",       WIDTH: 2, RATIO: 1},
    "MSI10":     {NAME: "MSI10",     WIDTH: 2, RATIO: 1},
    "MSI1010":   {NAME: "MSI1010",   WIDTH: 2, RATIO: 1},
    "MSI1110":   {NAME: "MSI1110",   WIDTH: 2, RATIO: 1},
    /* Postnet */           "POSTNET":   {NAME: "POSTNET",   WIDTH: 3, RATIO: 4},
    /* FIM  */              "FIM":       {NAME: "FIM",       WIDTH: 6, RATIO: 0}
};

exports.LINEMODE = true;
exports.modeValid = false;

exports.getFontHeight = function (fontId, fontSize) {
    if (fontId === '0' || fontId === 0) {
        if (fontSize > 15) { return 18; }
    }
    if (!fontTable[fontId] || !fontTable[fontId][fontSize]) {return 20;}
    return fontTable[fontId][fontSize].HEIGHT || 20;
};

exports.getFontWidth = function(fontId, fontSize) {
    if (!fontTable[fontId] || !fontTable[fontId][fontSize]) {return 20;}
    return fontTable[fontId][fontSize].WIDTH || 20;
};



exports.languageSetup = function(printer, resolve, reject) {
    printer.getSetting('device.languages').then(function(result) {
        //noinspection JSValidateTypes
        if (result === 'line_print') {
            resolve();
            return; // Printer is in the proper language mode
        }
        return printer.setSetting('device.languages','line_print').then(function() {
            return printer.getSetting('device.languages').then(function(result) {
               //noinspection JSValidateTypes
                if (result === 'line_print') {
                    resolve();
               }  else {
                   reject("Unable to set printer language, current language is "+result);
               }
            });
        });
    }).catch(function(err) {
        reject(err);
    });
};

exports.getPrinterStatus = function(printer, promise, COMMAND) {
    var status = {ready: true, paperOut: false, latchOpen: false, lowBattery: false, reset: false, other: ''};
    printer._sendMessageToPrinterCreatePromise(COMMAND.GET, "\x1Bh")
        .then(function (value) {

            //noinspection JSUnresolvedFunction
            value = value.charCodeAt(0);
            console.log("Status: ", value);
            
            if ((value & 1) === 1) {  // jshint ignore:line
                status.ready = false;
            }
            if ((value & 2) === 2) { // jshint ignore:line
                status.paperOut = true;
            }
            if ((value & 4) === 4) { // jshint ignore:line
                status.latchOpen = true;
            }
            if ((value & 8) === 8) { // jshint ignore:line
                status.lowBattery = true;
            }
            if ((value & 16) === 16) { // jshint ignore:line
                status.reset = true;
            }

            /* for (var i = 0; i < 32; i++) {
                if ((value & (i << 1)) !== 0) { status.other += '1'; }
                else { status.other += '0'; }
            } */

            // console.log(value.charCodeAt(0));

            // console.dump(status);
            // promise.resolve(status);
        })
        .catch(promise.reject);
};