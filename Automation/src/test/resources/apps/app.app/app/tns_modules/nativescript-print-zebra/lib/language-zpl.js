/************************************************************************************
 * (c) 2016 Master Technology
 * Licensed under a commercial licensing
 *
 * Any questions please email me
 * Version 1.00                                 Nathan@master-technology.com
 ***********************************************************************************/
"use strict";
/* global com, java, Promise */

// Not sure if we need a CR/LF pair in ZPL
var CRLF = "\r\n";

var totalSize = 0;
var defaultFont = 0;
var defaultFontSize = 3;
var alignment = "";


// --------------------------------------------------------------------------------------------------------------------

exports.render = function(document, options) {
    var results = "";
    options = options || {};

    // Reset back to Defaults on a new render
    totalSize = 0;
    defaultFont = 0;
    defaultFontSize = 3;

    if (typeof options.size !== "undefined" && options.size > 0) {
        totalSize = parseInt(options.size, 10);
    } else {
        totalSize = document._getTotalSize();
    }

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
                    // Does Nothing in ZPL mode
                    break;
                case document.LANGUAGE_COMMANDS.LABEL:
                    results += handleLabel(data[i]);
                    break;
                case document.LANGUAGE_COMMANDS.IMAGE:
                    results += handleImage(data[i]);
                    break;
                default:
                    console.log("Command", data[i].cmd, "is not supported in ZPL mode, skipped.");
            }
        } catch (err) {
            console.log("Error processing: ", data[i], ", skipped.  Error:", err);
        }
    }

    // Add header/footer
    results = "^XA" + CRLF + results + "^XZ" + CRLF;

    return results;
};
function handleImage(data) {
    return 'EG '+data.width+" "+data.height+" " + data.x + " " + data.y + " " + data.data + CRLF;
}
function handleBox (data) {

    return '^FO'+data.x1+','+data.y1+CRLF+'^GB'+(data.x2-data.x1)+','+(data.y2-data.y1)+','+data.thickness+'^FS'+CRLF;
}

function handleLine(data) {
    var width = data.x2-data.x1; var height = data.y2-data.y1;
    if (width <= 0) { width = 1; }
    if (height <= 0) { height = 1; }
    // can't do diagonal line, only 90 degree lines.
    if (width !== 1 && height !== 1) {
        width = 1;
    }
    return '^FO'+data.x1+','+data.y1+CRLF+'^GB'+(width)+','+(height)+','+data.thickness+'^FS'+CRLF;
}

function handleBold(data) {
    if (data.bold) {
        return '^MD10' + CRLF;
    } else {
        return '^MD0' + CRLF;
    }
}

function handleAlignment(data) {
    switch (data.align) {
        case 'center': alignment = "^FB0,99,0,C" + CRLF; break;
        case 'left': alignment = ""; break;
        case 'right': alignment = "^FB0,99,0,R" + CRLF; break;
    }
    return "";
}

function handleFont(data) {
    defaultFont = data.id;
    defaultFontSize = data.size;
    
    return '^CF'+defaultFont+","+exports.getFontHeight(defaultFont, defaultFontSize) + "," + getFontWidth(defaultFont, defaultFontSize) + CRLF;
}

function handleText(data) {
    var x = data.x || 0;

    // Setup Field position
    var result = "^FO"+x+","+data.y+CRLF;

    // Setup Alignment
    if (alignment && alignment.length) { result += alignment; }

    var font, fontSize;
    if (typeof data.font !== 'undefined') {
        font = data.font;
    } else {
        font = defaultFont;
    }
    if (typeof data.size !== 'undefined') {
        fontSize = data.size;
    }  else {
        fontSize = defaultFontSize;
    }
    
    if (font !== defaultFont || fontSize !== defaultFontSize) {
        // Setup Font
        result += "^A" + font + "," + exports.getFontHeight(font, fontSize) + "," + getFontWidth(font, fontSize) + CRLF;
    }

    // Print Text
    result += "^FD"+data.text +"^FS"+CRLF;

    return result;
}

function handleBarcode(data) {

    var results = "^FO0,"+data.y+"^B";
    var isSlot2;

    // Is this the object
    if (typeof data.type.NAME !== "undefined") {
        results += data.type.ID + "N,";
        isSlot2 = data.type.slot2;
    } else {
        results += exports.BARCODE[data.type].ID + "N,";
        isSlot2 = exports.BARCODE[data.type].slot2;
    }
    if (isSlot2) {
        results += isSlot2 + ",";
    }
    results += data.height + CRLF;

    results += "^FD" + data.data + "^FS" + CRLF;

    return results;
}

function handleLabel(data) {
    var results = "^XFR:"+ data.name +CRLF;

    for (var i=0;i<data.values.length;i++) {
        results += "^FN" + (i+1) + "^FD" + data.values[i] + "^FS" + CRLF;
    }
    return results;
}

var fontTable = /*** Build in Fonts of Zebra Printers ***/
    {A: 9, B: 11, C:18, D: 18, E: 28, F: 26, G: 60, H: 21, P: 20, Q: 28, R: 35, S:40, T: 48, U: 59, V: 80, '0': 15};
var widthTable =
    {A: 5, B: 7, C:10, D: 10, E: 15, F: 13, G: 40, H: 13, P: 18, Q: 24, R: 31, S:35, T: 42, U: 53, V: 71, '0': 12};

exports.getFontHeight = function (fontId, fontSize) {
    if (!fontTable[fontId]) {return 20; }
    if (fontId === '0' || fontId === 0) {
        // This is a freelly scalable font
        if (fontSize > 15) { return fontSize; }
        else { return 15 + parseInt((fontSize/10) * 15,10); }
    }

    var normalSize = fontTable[fontId];
    normalSize *= (1 + fontSize); 

    return parseInt(normalSize,10);
};

function getFontWidth(fontId, fontSize) {
    if (!fontTable[fontId]) {return 20; }
    if (fontId === '0' || fontId === 0) {
        // This is a freelly scalable font
        if (fontSize > 15) { return fontSize; }
        else { return 12 + parseInt((fontSize/10) * 12,10); }
    }

    var normalSize = widthTable[fontId];
    normalSize *= (1 + fontSize);

    return parseInt(normalSize,10);
}



exports.BARCODES = {
    /* UPC-E */             "UPCE":      {NAME: "UPCE",      ID: 9},
    /* Ean 8 */             "EAN8":      {NAME: "EAN8",      ID: 8},
    /* Interleave 2 of 5 */ "I2OF5":     {NAME: "I2OF5",     ID: 2},
    /* Code 39 */           "39":        {NAME: "39",        ID: 3, slot2: "N"},
    /* Code 93 */           "93":        {NAME: "93",        ID: "A"},
    /* Code 128 */          "128" :      {NAME: "128",       ID: "C"},
    /* Ean 13 */            "EAN13":     {NAME: "EAN13",     ID: "E"},
                            "I2OF5C":    {NAME: "I2OF5C",    ID: "I"},
                            "I2OF5G":    {NAME: "I2OF5G",    ID: "J"},
    /* CODABAR */           "CODABAR":   {NAME: "CODABAR",   ID: "K", slot2: "N"},
    /* MSI/Plessy MSI */    "MSI":       {NAME: "MSI",       ID: "M", slot2: "B"},
    /* UPC-A */             "UPCA":      {NAME: "UPCA",      ID: "U"},
    /* Postnet */           "POSTNET":   {NAME: "POSTNET",   ID: "Z"}
};

exports.LINEMODE = false;

exports.languageSetup = function(printer, resolve, reject) {
    printer.getSetting('device.languages').then(function(result) {
        console.log("Printer Language:", result);
        if (result === 'zpl' || result === "epl_zpl" || result === "hybrid_xml_zpl") {
            resolve();
            return; // Printer is in the proper language mode
        }
        return printer.setSetting('device.languages','zpl').then(function() {
            return printer.getSetting('device.languages').then(function(result) {
                console.log("Printer Language2:", result);
                if (result === 'zpl' || result === "hybrid_xml_zpl") {
                    resolve();
                } else {
                    reject("Unable to set printer language, current language is " + result);
                }
            });
        });
    }).catch(function(err) {
        reject(err);
    });
};

exports.getPrinterStatus = function(printer, promise, COMMAND) {
    var status = {ready: true, paperOut: false, latchOpen: false, lowBattery: false, reset: false, other: ''};
    printer._sendMessageToPrinterCreatePromise(COMMAND.GET, "~HQES")
        .then(function (value) {
            console.log("Raw status: ", value);

            var idx = value.indexOf('ERRORS:');
            var data = value.substring(idx+7,value.indexOf('WARNINGS:')).trim();
            console.log("Status: ", data);

            promise.resolve(status);
        })
        .catch(promise.reject);
};