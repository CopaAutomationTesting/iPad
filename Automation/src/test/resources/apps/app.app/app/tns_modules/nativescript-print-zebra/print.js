/************************************************************************************
 * (c) 2016-2017 Master Technology
 * Licensed under a commercial licensing
 *
 * Any questions please email me
 * Version 1.20                                          Nathan@master-technology.com
 ***********************************************************************************/
"use strict";
/* global Promise, __extends, android, NSNumber, CGContextRelease, CFRelease,
 UIImage, interop, CGRectMake, CGContextDrawImage, CGBitmapContextCreate,
 CGColorSpaceCreateDeviceRGB, kCGImageAlphaNoneSkipFirst, CGColorSpaceRelease,
 NSMutableDictionary, NSString, UIColor, NSFontAttributeName, CGSizeMake, CGRectMake,
 NSForegroundColorAttributeName, UIGraphicsBeginImageContextWithOptions, CGContextFillRect,
 UIGraphicsGetCurrentContext, UIGraphicsEndImageContext, NSStringDrawingUsesLineFragmentOrigin,
 UIGraphicsGetImageFromCurrentImageContext
 */

// --------------------------------------------------------------------------------------------------------------------

var fs, Font;
function ensureFS() {
    if (!fs) {
        fs = require("file-system");
    }
}

function ensureFont() {
	if (!Font) {
		Font = require('ui/styling/font').Font;
	}
}



/**
 * Base Printer type
 * @param settings
 * @constructor
 */
function Printer(settings) {
    if (!settings || !settings.address) {
        throw new Error("Connection to Printer must be specified");
    }
    this._address = settings.address;
    this._connected = false;
}

/**
 * Is this printer connected
 * @returns {boolean}
 */
Printer.prototype.isConnected = function() {
    return this._connected;
};

// --------------------------------------------------------------------------------------------------------------------

/**
 * Base Document Type
 * @param {Printer} printer
 * @param defaults
 * @constructor
 */
function Document(printer, defaults) {
    if (typeof defaults === 'undefined') { defaults = {}; }
    this._currentFont = 0;
    this._currentFontSize = 3;
    this._y = 0;
    this._copies = 1;
    this._data = [];
    this._postData = [];
    this._fontHeight = 0;
    this._hasSetFont = false;
    this._defaultSpacing = 5;
    this._currentAlignment = "left";
    this._printer = printer;
    this._priorX = null;

    if (typeof defaults.spacing !== 'undefined') {
        this._defaultSpacing = parseInt(defaults.spacing,10);
    }
    if (typeof defaults.font !== 'undefined') {
        this.font(defaults.font, defaults.fontSize || 0);
    }
    if (typeof defaults.copies !== 'undefined') {
        this.copies(defaults.copies);
    }

    //noinspection JSUnresolvedFunction
    this._fontHeight = this.getFontHeight(this._currentFont, this._currentFontSize);
}

/**
 * How many pixels total are used
 * @returns {*}
 * @private
 */
Document.prototype._getTotalSize = function() {
    return this._y;
};

/**
 * How many copies are specifid
 * @returns {Number|*|number}
 * @private
 */
Document.prototype._getTotalCopies = function() {
    return this._copies;
};

/**
 * Returns the data for final processing
 * @returns {Array}
 * @private
 */
Document.prototype._getData = function() {
    return this._data.concat(this._postData);
};

/**
 * Used to signify this is a Document object
 * @type {boolean}
 */
Document.prototype.isDocument = true;

/**
 * Sets the default line spacing
 * @param value
 * @returns {*}
 */
Document.prototype.spacing = function(value) {
    if (typeof value !== 'undefined') {
        this._defaultSpacing = parseInt(value, 10);
    } else {
        return this._defaultSpacing;
    }
    return this;
};

/**
 * Sets the number of Copies to print
 * @param {int} value
 * @returns {Document|int}
 */
Document.prototype.copies = function(value) {
    if (typeof value !== "undefined") {
        this._copies = parseInt(value,10);
        return this;
    }
    return this._copies;
};

/**
 * Sets the font and font size
 * @param fontName
 * @param {int} fontSize
 * @returns {Document}
 */
Document.prototype.font = function(fontName, fontSize) {
    if (typeof fontName === "undefined") { fontName = 0; }
    if (typeof fontSize === "undefined") { fontSize = 0; }

    this._currentFont = fontName;
    this._currentFontSize = parseInt(fontSize,10);

    //noinspection JSUnresolvedFunction
    this._fontHeight = this.getFontHeight(this._currentFont, this._currentFontSize);
    this._data.push({cmd: this.LANGUAGE_COMMANDS.FONT, id: this._currentFont, size: this._currentFontSize});
    this._hasSetFont = true;

    return this;
};

/**
 * Increments the printer by a new line
 * @param count - optional number of newlines to print
 * @param size - optional font height
 * @returns {Document}
 */
Document.prototype.newLine = function(count, size) {
    count = count || 1;
    size = size || this._fontHeight;
    for (var i=0;i<count;i++) {

        //noinspection JSUnresolvedVariable
        if (this.isLineMode) {
            this._data.push({cmd: this.LANGUAGE_COMMANDS.NEWLINE});
        } else {
            this._y += size + this._defaultSpacing;
        }
    }

    return this;
};

/**
 * Increments the printer by a new line
 * @param count - optional number of newlines to print
 * @param size - optional font height
 * @returns {Document}
 */
Document.prototype.newline = Document.prototype.newLine;

/**
 * Allows you to send a raw command to the printer
 * @param raw - Raw string of data to send to printer
 * @param size - Size used by raw command, can be null/0
 * @returns {Document}
 */
Document.prototype.raw = function(raw, size) {
    size = size || 0;
    this._data.push({cmd: this.LANGUAGE_COMMANDS.RAW, raw: raw});

    //noinspection JSUnresolvedVariable
    if (!this.isLineMode) {
        this._y += parseInt(size, 10);
    }

    return this;
};

Document.prototype.fontText = function(text, font, options ) {
	ensureFont();
	options = options || {};
	if (typeof font === 'undefined') { this.text(text, options); return this; }
	if (typeof options.size === 'undefined') { options.size = 30; }
	if (typeof options.weight === 'undefined') { options.weight = 'normal'; }
	if (typeof options.style === 'undefined') { options.style = 'normal'; }

	var fontFace = new Font(font, options.size, options.style, options.weight);

	if (global.android) {
		this._buildAndroidTextImage(fontFace, text, options);
	} else {
		this._buildIOSTextImage(fontFace, text, options);
	}

	return this;
};

/**
 * Generates a image from text and a font (Android)
 * @param fontClass
 * @param text
 * @param options
 * @private
 */
Document.prototype._buildAndroidTextImage = function(fontClass, text, options) {

	// Get our android font
	var font = fontClass.getAndroidTypeface();
	options = options || {};
	if (typeof options.margin === 'undefined') { options.margin = 1; }
	if (typeof options.lineSpacing === 'undefined') { options.lineSpacing = 0.2; }

	var i;
	var width = this._printer._dotsWide;
	var widthMinusMargin = width - (options.margin * 2);

	var fontSize = options.size || fontClass.fontSize;
	//console.log("Font Size", fontSize);


	var paint = new android.graphics.Paint();
	paint.setTypeface(font);
	paint.setAntiAlias(true);
	paint.setSubpixelText(true);
	paint.setTextSize(fontSize);
	paint.setColor(0xff000000);
	paint.setStyle(android.graphics.Paint.Style.FILL);
	var result = new android.graphics.Rect();

	// Get the text maximum height / and top location.
	paint.getTextBounds(text, 0, text.length, result);

	// Store our information for later usage.
	var lineHeight = result.height();
	var top = result.top;

	// Ok, lets break all the text into sentances that are shorter than the max width
	var finalText = [];
	if (result.width() > widthMinusMargin) {
		var currentLine = "";
		var words = text.split(" ");
		currentLine = words[0];
		for (i=1;i<words.length;i++) {
			var newLine = currentLine+" "+words[i];
			paint.getTextBounds(newLine, 0, newLine.length, result);
			if (result.width() > widthMinusMargin) {
				finalText.push(currentLine);
				currentLine = words[i];
			} else {
				currentLine += " " + words[i];
			}
		}
		if (currentLine.length) {
			finalText.push(currentLine);
		}
	} else {
		finalText.push(text);
	}

	// Calculate the maximum line width now that we have split everything...
	var lineWidth = 0;
	for (i=0;i<finalText.length;i++) {
		paint.getTextBounds(finalText[i], 0, finalText[i].length, result);
		var newWidth = result.width();
		if (newWidth > lineWidth) {
			lineWidth = newWidth;
		}
	}

	// Add our margin to the width
	lineWidth += (options.margin * 2);

	// Figure out line spacing
	var lineSpacing = lineHeight * options.lineSpacing;

	// Figure out total height of image (We don't need lineSpacing on the last line)
	var imageHeight = ((lineHeight + lineSpacing) * finalText.length) - lineSpacing;

	// Ok, generate a Image to be used to draw our text into
	var bitmap = new android.graphics.Bitmap.createBitmap(lineWidth, imageHeight+2, android.graphics.Bitmap.Config.ARGB_8888);
	bitmap.eraseColor(0xffffffff);
	var canvas = new android.graphics.Canvas(bitmap);

	// Loop through all the text lines and print them to the canvas
	for (i=0;i<finalText.length;i++) {
		canvas.drawText(finalText[i], options.margin, -top + 1 + ((lineHeight + lineSpacing) * i), paint);
	}

	// Save a temporary file so we can verify what it looks like
/*	var file = new java.io.File(fs.knownFolders.currentApp().path + "/Image-1.jpg");
	if (file.exists()) { file.delete(); }
	var out = new java.io.FileOutputStream(file);
	bitmap.compress(android.graphics.Bitmap.CompressFormat.JPEG, 90, out);
	out.flush();
	out.close(); */

	// Ok, lets send this image to the imaging system so the printer will print it.
	return this.image(bitmap, options);
};


/**
 * Generates a image from text and a font (iOS)
 * @param fontClass
 * @param text
 * @param options
 * @private
 */
Document.prototype._buildIOSTextImage = function(fontClass, text, options) {
	// Get our android font
	var font = fontClass.getUIFont();
	options = options || {};
	if (typeof options.margin === 'undefined') {
		options.margin = 1;
	}
	if (typeof options.lineSpacing === 'undefined') {
		options.lineSpacing = 0.2;
	}

	var width = this._printer._dotsWide;
	var widthMinusMargin = width - (options.margin * 2);

	// Setup Dictionary
	var attrDict = NSMutableDictionary.alloc().init();
	attrDict.setObjectForKey(font, NSFontAttributeName);
	attrDict.setObjectForKey(UIColor.alloc().initWithRedGreenBlueAlpha(0.0, 0.0, 0.0, 1.0), NSForegroundColorAttributeName);

	// Setup iOS String object
	var nsString = NSString.stringWithString(text);

	// Measure the String
	var rect = nsString.boundingRectWithSizeOptionsAttributesContext(
		CGSizeMake(widthMinusMargin, 300000),
		NSStringDrawingUsesLineFragmentOrigin,
		attrDict,
		null
	);

	//noinspection JSSuspiciousNameCombination
	var imageHeight = Math.floor(rect.size.height) + 2;
	var imageWidth = Math.floor(rect.size.width) + (options.margin * 2);

	UIGraphicsBeginImageContextWithOptions(CGSizeMake(imageWidth, imageHeight), true, 1.0);
	var context = UIGraphicsGetCurrentContext();
	//CGContextSetFillColorWithColor(UIGraphicsGetCurrentContext(), UIColor.alloc().initWithRedGreenBlueAlpha(1.0,1.0,1.0,1));


	// Fill the image with white
	var white = UIColor.alloc().initWithRedGreenBlueAlpha(1.0, 1.0, 1.0, 1);
	white.set();
	CGContextFillRect(context, CGRectMake(0, 0, imageWidth, imageHeight));

	// Draw the text into the image
	nsString.drawInRectWithAttributes(CGRectMake(options.margin, 1, imageWidth, imageHeight), attrDict);

	// Get the bitmap
	var bitmap = UIGraphicsGetImageFromCurrentImageContext();
	UIGraphicsEndImageContext();

	// SAae the image so we can see it
	// UIImageWriteToSavedPhotosAlbum(bitmap, null, null, null);

	// Ok, lets send this image to the imaging system so the printer will print it.
	return this.image(bitmap, options);
};



/**
 * Print a image
 * @param fileName
 * @param options
 */
Document.prototype.image = function(fileName, options) {
    options = options || {};

    var cmd = null;
    if (global.android) {
        cmd = this._generateImageDataAndroid(fileName);
    } else if (typeof NSNumber !== 'undefined') {
        cmd = this._generateImageDataIOS(fileName);
    }
    if (cmd === null) {
        return this;
    }

    if (typeof options.x !== 'undefined') {
        cmd.x = options.x;
    }

    //noinspection JSUnresolvedVariable
    if (this.isLineMode) {
        this._y = 0;
    } else {
        this._y += cmd.height + this._defaultSpacing;
    }
    this._data.push(cmd);
    return this;
};

/**
 * Generates a Image structure based on a image from the file
 * @param fileName
 * @returns {*}
 * @private
 */
Document.prototype._generateImageDataAndroid = function(fileName) {
    var data = "", width, height, PartialSize, encoding = 0;
    ensureFS();

    if (this._printer) {
		switch (this._printer.driver) {
			case 'EPSON':
				encoding = 1;
				break;
			case 'ZEBRA':
				encoding = 0;
				break;
			default:
				encoding = 0;
				break;
		}
	}

	//console.log("Encoding", encoding, this._printer.driver);

    try {
        var bmp;

        if (typeof fileName.indexOf === 'function') {
            if (fileName.indexOf("~/") === 0) {
                fileName = fs.path.join(fs.knownFolders.currentApp().path, fileName.replace("~/", ""));
            }
            //noinspection JSUnresolvedVariable,JSUnresolvedFunction
            bmp = android.graphics.BitmapFactory.decodeFile(fileName, null);
        } else {
        	//console.log("We are on the BMP = filename path");
            bmp = fileName;
        }

        //console.log("BMP:", typeof bmp.getWidth);

        var partialPass = false;
        var pixel, bit;
        var hex;

        // The data is sent in 8 bit groups
        if (bmp === null) {
            //console.log("Unable to decode image");
            return null;
        }

        //noinspection JSUnresolvedFunction
        width = bmp.getWidth();
        height = bmp.getHeight();

        // Need to make it a even 8 pixels
        PartialSize = 8 - (width % 8);
        if (PartialSize === 8) {
            PartialSize = 0;
        }
        else if (PartialSize > 0) {
            partialPass = true;
        }

        if (width <= 0 || height <= 0) {
            return null;
        }

        for (var y = 0; y < height; y++) {
            bit = 0;
            for (var x = 0; x < width; x++) {

                // Get a single pixel from the image
                //noinspection JSUnresolvedFunction
                pixel = bmp.getPixel(x, y);

                // jshint -W016
                // Figure out the Color (Black or White)
                var intensity = 255 - (((pixel & 255) + ((pixel >> 8) & 255) + ((pixel >> 16) & 255)) / 3);

                // Check for Alphas
                if ((pixel >> 24) === 0) {
                    intensity = 0;
                }

                // Shift our Bit array by one bit Left
                bit <<= 1;

                // We are going to assume anything greater the 50% is black
                if (intensity > 128) {
                    bit |= 1;
                }

                // Every 8 bits we need to store this as a hex number in the data stream
                if ((x % 8) === 7) {

					if (encoding === 0) {
						// We are limiting this to 8 bits
						hex = (bit & 255).toString(16);
						if (hex.length === 1) {
							hex = "0" + hex;
						}
						data += hex.toUpperCase();
					} else {
						data += String.fromCharCode(bit & 255);
					}
                }
            }

            // Because we could have a odd size image; we have to align it to be a mulitple of 8; so we add the missing
            // blank pixels
            if (partialPass) {
                bit <<= PartialSize;
                if (encoding === 0) {
					hex = (bit & 255).toString(16);
					if (hex.length === 1) {
						hex = "0" + hex;
					}
					data += hex.toUpperCase();
				} else {
                	data += String.fromCharCode(bit & 255);
				}
            }
        }
        bmp = null;
    } catch (e) {
        //console.error("Error Processing Image", e, e.stack);
        return null;
    }

    var encodedWidth = (width + PartialSize) / 8;
    if (encoding === 1) {
    	encodedWidth = (width + PartialSize);
	}
	//console.log("Image Data:", data.length, encodedWidth, height);


    return {cmd: this.LANGUAGE_COMMANDS.IMAGE, data: data, y: this._y, x: 0, height: height, width: encodedWidth };
    //console.dump(cmd);
    //return cmd;

};

/**
 * Generates a Image structure based on a image from the file
 * @param fileName
 * @returns {*}
 * @private
 */
Document.prototype._generateImageDataIOS = function(fileName) {
    var result = "", width, height, PartialSize, encoding = 0;
    ensureFS();

	if (this._printer) {
		switch (this._printer.DRIVER) {
			case 'EPSON':
				encoding = 1;
				break;
			case 'ZEBRA':
				encoding = 0;
				break;
			default:
				encoding = 0;
				break;
		}
	}

	try {
        var bmp;

        if (fileName && typeof fileName.indexOf === 'function') {
            if (fileName.indexOf("~/") === 0) {
                fileName = fs.path.join(fs.knownFolders.currentApp().path, fileName.replace("~/", ""));
            }
            //noinspection JSUnresolvedFunction
            bmp = UIImage.imageNamed(fileName);
        } else {
            bmp = fileName;
        }

        var partialPass = false;
        var bit;
        var hex;

        // The data is sent in 8 bit groups
        if (bmp === null) {
            //console.log("Unable to decode image");
            return null;
        }

        width = bmp.size.width;
        height = bmp.size.height;

        // Need to make it a even 8 pixels
        PartialSize = 8 - (width % 8);
        if (PartialSize === 8) {
            PartialSize = 0;
        }
        else if (PartialSize > 0) {
            partialPass = true;
        }

        if (width <= 0 || height <= 0) {
            return null;
        }

        var colorSpace = CGColorSpaceCreateDeviceRGB();

        //noinspection JSUnresolvedFunction
        var adata = interop.alloc(height * width * 4);
        //noinspection JSUnresolvedFunction,JSUnresolvedVariable
        var data = interop.Reference(interop.types.uint8, adata);

        //noinspection JSUnresolvedVariable,JSHint
        var context = CGBitmapContextCreate(data, width, height,
            8, 4 * width, colorSpace,
            (kCGImageAlphaPremultipliedLast | kCGBitmapByteOrder32Big));

        CGColorSpaceRelease(colorSpace);

        //noinspection JSUnresolvedVariable
        CGContextDrawImage(context, CGRectMake(0, 0, width, height), bmp.CGImage);


        var byteIndex = 0;
        for (var y = 0, j=0; y < height; y++) {
            bit = 0;
            for (var x = 0; x < width; x++, j++, byteIndex += 4) {

                // jshint -W016
                // Figure out the Color (Black or White)
                var intensity = 255 - ((data[byteIndex] + data[byteIndex+1] + data[byteIndex+2] ) / 3);

                // Check for Alphas
                if ((data[byteIndex + 3]) === 0) {
                    intensity = 0;
                }

                // Shift our Bit array by one bit Left
                bit <<= 1;

                // We are going to assume anything greater the 50% is black
                if (intensity > 128) {
                    bit |= 1;
                }

                // Every 8 bits we need to store this as a hex number in the data stream
                if ((x % 8) === 7) {

                	if (encoding === 0) {
						// We are limiting this to 8 bits
						hex = (bit & 255).toString(16);
						if (hex.length === 1) {
							hex = "0" + hex;
						}
						result += hex.toUpperCase();
					} else {
                		result += String.fromCharCode(bit & 255);
					}
                }

            }

            // Because we could have a odd size image; we have to align it to be a mulitple of 8; so we add the missing
            // blank pixels
            if (partialPass) {
                bit <<= PartialSize;
                if (encoding === 0) {
					hex = (bit & 255).toString(16);
					if (hex.length === 1) {
						hex = "0" + hex;
					}
					result += hex.toUpperCase();
				} else {
                	result += String.fromCharCode(bit & 255);
				}
            }
        }
        data = null;

        // Don't free this, it is adopted by data
        //interop.free(adata);
        //adata = null;

        colorSpace = null;
        context = null;
        bmp = null;


    } catch (e) {
        console.error("Error Processing Image", e);
        return null;
    }

    //console.log("Image Data:", result.length, width);
    return {cmd: this.LANGUAGE_COMMANDS.IMAGE, data: result, y: this._y, x: 0, height: height, width: (width + PartialSize) / 8 };
};

/**
 * Allows you to inverse an area of the print
 * @param x_start
 * @param width
 * @param height
 */
Document.prototype.inverse = function(x_start, width, height) {
	// TODO Track inversing
    this._postData.push({cmd: this.LANGUAGE_COMMANDS.INVERSE, xStart: x_start, width: width, yStart: this._y, height: height});
    return this;
};



/**
 * Allows you to print text to the printer
 * @param text
 * @param settings
 * @returns {Document}
 */
Document.prototype.text = function(text, settings) {
    var size = null;
    if (typeof text === 'undefined') {
        text = '';
    }
    settings = settings || {};

    // Make sure before we do any printing we set a default font
    if (!this._hasSetFont) {
        this.font(this._currentFont, this._currentFontSize);
    }

    // Calculate y
    if (typeof settings.y !== "undefined") { this._y = settings.y; }

    //noinspection JSUnresolvedVariable
    if (typeof settings.addY !== "undefined") {
        //noinspection JSUnresolvedVariable
        this._y += settings.addY;
    }


    var data = {cmd: this.LANGUAGE_COMMANDS.TEXT, text: text, y: this._y, newLine: !!settings.newLine};

    var startOffsetX = 0;
    // Use Prior X calculation if present
    if (this._priorX) {
        if (settings._priorX !== false) {
            data.x = this._priorX;
        }
        this._priorX = null;
    }

    // Add x
    if (typeof settings.x !== "undefined") {
        if (typeof data.x === 'undefined') {
            data.x = settings.x;
        } else {
            data.x += settings.x;
        }
    }

    // We have to capture the current X incase we are saving it again
    if (typeof data.x !== 'undefined') {
        startOffsetX = data.x;
    }

    var font = this._currentFont, fontSize = this._currentFontSize;

    if (typeof settings.font !== "undefined") {
        font = settings.font;
        //noinspection JSUnresolvedFunction
        size = this.getFontHeight(font, fontSize);
    }
    if (typeof settings.size !== "undefined") {
        fontSize = settings.size;
        //noinspection JSUnresolvedFunction
        size = this.getFontHeight(font, fontSize);
    }

    if (font !== this._currentFont) { data.font = font; }
    if (fontSize !== this._currentFontSize) {data.size = fontSize; }
    //noinspection JSUnresolvedFunction
    var width = this.getFontWidth(font, fontSize);

    // We need to remove the offset if we are starting this text not from x = 0
    //noinspection JSUnresolvedVariable
    var cnt = parseInt((this.dotsWide-startOffsetX) / width, 10);

    // Save current Alignment and the change it if it exists
    var myAlignment = this._currentAlignment;
    if (typeof settings.alignment !== 'undefined') {
        this.alignment(settings.alignment);
    }

    if (settings.bold === true) {
        this._data.push({cmd: this.LANGUAGE_COMMANDS.BOLD, bold: true});
    }

    // Epson printer automatically wraps.
	// Check to see if we need to wrap or if wrapping is disabled.
    if (text.length <= cnt || settings.noWrap === true || this._printer.DRIVER === "EPSON") {
        this._data.push(data);
        if (settings.newLine === false) {
            this._priorX = startOffsetX + (text.length * width);
        }
    } else {
        var chunks = this._createChunks(text, cnt);
        for (var i=0;i<chunks.length;i++) {
            data = {text: chunks[i], cmd: this.LANGUAGE_COMMANDS.TEXT, x: startOffsetX, y: this._y, newLine: true};
            if (font !== this._currentFont) { data.font = font; }
            if (fontSize !== this._currentFontSize) { data.size = fontSize; }
            if (i < chunks.length-1) {
                this.newLine(1, size);
                // We reset this back to 0 on the next line
                startOffsetX = 0;

                //noinspection JSUnresolvedVariable
                cnt = parseInt((this.dotsWide - startOffsetX) / width, 10);

            }

            //noinspection JSUnresolvedVariable
            if (this.isLineMode) {
                this._y = 0;
            }

            this._data.push(data);

            // Capture the last priorX
            if (settings.newLine === false && i === (chunks.length-1)) {
                this._priorX = width * chunks[i].length;
            }
        }
    }

    if (settings.bold === true) {
        this._data.push({cmd: this.LANGUAGE_COMMANDS.BOLD, bold: false});
    }

    if (typeof settings.newLine === "undefined" || settings.newLine === true) {
        this.newLine(1, size);
    }

    // Reset Alignment
    if (this._currentAlignment !== myAlignment) {
        this.alignment(myAlignment);
    }

    //noinspection JSUnresolvedVariable
    if (this.isLineMode) {
        this._y = 0;
    }

    return this;
};

/**
 * Takes the lines of text and makes them into bite sized sentences
 * @param text
 * @param cnt
 * @returns {Array}
 * @private
 */
Document.prototype._createChunks = function(text, cnt) {
    var remainingText = text, addDash=false;
    var chunks=[];
    do {
        // We are specifically pulling cnt + 1 in case cnt + 1 != alpha character (i.e. a natural break)
        var line = remainingText.substring(0, cnt+1);
        addDash = false;
        if (line.length > cnt) {
            var idx = line.length;
            for (var i=line.length;i>cnt/2;i--) {
                var c = line.charCodeAt(i);
                // We break at anything that is not a Alpha character
                if ((c < 65 || (c > 90 && c < 97) || c > 122)) {
                    idx = i;
                    break;
                }
            }
            if (idx < cnt / 2 || idx > cnt) {
                idx = cnt - 1;
                addDash = true;
            }
            line = line.substring(0, idx);
            remainingText = remainingText.substring(idx).trim();
        } else {
            remainingText = "";
        }
        if (addDash) {
            chunks.push(line.trim()+"-");
        } else {
            chunks.push(line.trim());
        }
    } while (remainingText.length > 0);
    return chunks;
};

/**
 * Print this document
 */
Document.prototype.print = function() {
    return this._printer.print(this);
};

/**
 * Prints a barcode on the printer
 * @param type - Document.BARCODE.name
 * @param height - Height of Barcode
 * @param value - what you want in your barcode
 * @param addY - Add distance to the y value before printing
 * @returns {Document}
 */
Document.prototype.barcode = function(value, type, height, addY) {
    if (typeof addY !== 'undefined' && addY > 0) {
        this._y += addY;
    }
    if (typeof height === 'undefined') {
        height  = 30;
    }
    if (typeof type === 'undefined') {
        //noinspection JSUnresolvedVariable
        type = this.BARCODE.UPCA;
    }
    this._data.push({cmd: this.LANGUAGE_COMMANDS.BARCODE, type: type, height: height, data: value, y: this._y});
    this._y += height + this._defaultSpacing;

    //noinspection JSUnresolvedVariable
    if (this.isLineMode) {
        this._y = 0;
    }

    return this;
};

/**
 * Run an existing Label
 * @param labelName
 * @param values
 * @returns {Document}
 */
Document.prototype.label = function(labelName, values) {
    this._data.push({cmd: this.LANGUAGE_COMMANDS.LABEL, name: labelName, values: values});
    return this;
};

/**
 * Prints a box on the receipt
 * @param x1 - X1 Coord
 * @param y1 - Y1 Coord
 * @param x2 - X2 Coord
 * @param y2 - Y2 Coord
 * @param thickness
 */
Document.prototype.box = function(x1,y1, x2, y2, thickness) {
    if (typeof thickness === 'undefined') { thickness = 1; }
    this._data.push({cmd: this.LANGUAGE_COMMANDS.BOX, x1: x1, x2: x2, y1: y1, y2: y2, thickness: thickness});
    return this;
};

/**
 * Prints a line on the receipt
 * @param x1 - X1 Coord
 * @param y1 - Y1 Coord
 * @param x2 - X2 Coord
 * @param y2 - Y2 Coord
 * @param thickness
 */
Document.prototype.line = function(x1,y1, x2, y2, thickness) {
    if (typeof thickness === 'undefined') { thickness = 1; }
    this._data.push({cmd: this.LANGUAGE_COMMANDS.LINE, x1: x1, x2: x2, y1: y1, y2: y2, thickness: thickness});
    return this;
};

/**
 * Set printer alignment
 * @param alignment
 */
Document.prototype.alignment = function(alignment) {
    alignment = alignment || "left";
    alignment = alignment.toLowerCase();
    if (alignment !== "center" && alignment !== "left" && alignment !== "right") {
        alignment = "left";
    }
    this._currentAlignment = alignment;
    this._data.push({cmd: this.LANGUAGE_COMMANDS.ALIGNMENT, align: alignment});
    return this;
};

Document.prototype.LANGUAGE_COMMANDS = {LABEL: 0, TEXT: 1, BARCODE: 2, BOX: 3, LINE: 4, RAW: 5, NEWLINE: 6, FONT: 7, ALIGNMENT: 8, BOLD: 9, IMAGE: 10, INVERSE: 11};

// --------------------------------------------------------------------------------------------------------------------

exports.Printer = Printer;
exports.Document = Document;