# NativeScript Print Zebra

This is a NativeScript cross platform printing library for Zebra printers.

## Installation 

Run `tns plugin add nativescript-print-zebra` in your ROOT directory of your project.

### iOS Installation

You need to edit the app/App_Resouces/iOS/info.plist file and add the following to it:

<key>UIBackgroundModes</key>
<array>
   <string>external-accessory</string>
</array>
<key>UISupportedExternalAccessoryProtocols</key>
<array>
   <string>com.zebra.rawport</string>
</array>



## Limitations
* This plugin currently only supports CPCL & line_print modes; it does not currently support opl, epl or zpl properly.
* line_print mode has limited support for drawing boxes and putting anything inside of them.


## Usage

```js
var zebra = require('nativescript-print-zebra');

// Do device discovery
var discovery = new zebra.Discovery();
  discovery.searchBluetooth().then(function(printers) {
        var count = printers && printers.size();
        var pdata = [];

        for (var i=0;i<count;i++) {
            var printer = printers.get(i);
            pdata.push({name: printer.friendlyName, address: printer.address});
        }
        console.dump(pdata); // Prints out a list of devices found!
  });


// Do actual printing...
new zebra.Printer({address: printMacAdress}).then(function(curPrinter, result) {
   var document = curPrinter.createDocument();
   document.text('Hi this is a test!');
   curPrinter.print(document).then( function() {
       curPrinter.disconnect();
   });
});

```

## Commands

### new zebra.Discovery()
#### returns a promise; promise
##### .then(printers)
- a list of printers; the array will have a object with **name** and **address** for each device discovered
##### .catch(errors)

### new zebra.Printer({options})
#### Options object
- **address:** "bluetooth mac address to connect to" **REQUIRED**
- **language:** "CPCL", "line_print", "AUTO"  **DEFAULT: AUTO**
- **onError:** Error callback anytime an error occurs in the class
- Please note, CPCL is never detected as a valid "AUTO" language; so if you want CPCL then you have to specifically choose it.  Auto will detect the other languages, as it asks the printer what mode it is in, but printers don't have a specific CPCL mode as all modes support CPCL.
#### Returns: Promise.then(CurrentPrinter)
- **CurrentPrinter** is the class to do any work with this printer object.


## CurrentPrinter Methods

### .close()
- Close the current connection to the printer; you will need to create a new zebra.Printer to print anything else.

### .isConnected()
- Returns true if the printer **service** is connected; this is primarily to let you know if you can use this connection, or if you need to reconnect or recreate a new connection..

### .isDeviceConnected()
- Returns promise, then() = true if the printer is able to be contacted, .catch() = false the printer is offline

### .getStatus()
- Returns an Promise when resolved will give you different status of the printer (like Ready, Out of paper, etc)

### .getSetting(SettingName)
- Returns a Promise that will contain the value of that setting.

### .setSetting(SettingName, value)
- Allows you to change a setting on the printer

### .getStatus()
- Returns the current printer status, not all printers support all status options

### .powerOff()
- Turns off the printers power, and will also close the connection.

### .getLanguage()
- Returns a promise with the current language of the printer

### .print(Document)
- Document can be a single string with raw codes for the printer that you wish to send directly
- ** OR **
- Document can be a **Document** object that you created using .createDocument()

### .createDocument(options)
#### Returns a Document object  (see Document object below)
#### Options object can be:
- spacing: default spacing between sentences; defaults to 5 pixels.  Not all drivers support this.
- copies: number of copies to print; defaults to 1.  Only CPCL supports this for LABELS forms
- font: default font
- fontSize: default font size


## Document Methods

### .image(fileName, options)
- file name and path to a local black & white png image
- options: x = where do you want the image to start in x coords.

### .spacing(value)
- Set the spacing between sentences; defaults to 5

### .copies(value)
- Set the number of copies to print (only supported for Labels using CPCL)

### .font(font, size)
- Change the font and font size for the rest of the document
- font / size - see FONTs below

### .newline (<count>)
- Add a new line to the document, optionally you can use count to set the number of new lines

### .raw (string, sizeUsed)
- raw = Send a raw code to the printer at this location in the document.
- SizeUsed is how much height you used; some of the printing langauges need to know this for calculation purposes

### .text (string, options)
- string = Print the string
#### Options
- y = change the y location, this one is only useful under some drivers and some printers.
- addy = increases the y position.
- x = set the x location
- font = font to use
- size = font size to use
- bold = bold this text
- alignment = allows you to set the alignment for this line of text, "center", "left", "right"
- newLine = false to disable the automatic linefeed for this instance.
- noWrap = disable wrapping of text
- priorX = false, disable auto-resetting of x on a newLine = false.

### .inverse(startX, width, height)
- startX - where to start the inversing
- width - how wide to make the inversing
- height - how tall to make the inversing

### .print()
- Print this document - please note you can run print as many times as you want...

### .barcode(value, type, height, addY)
- value to print
- type of barcode  (See below)
- height of barcode
- add any Y offset between the prior printed item and this one

### .label(labelName, [values])
#### Use a saved label/format file from printer
- labelName = name Label was saved to on printer
- [values] = array of values to use for the label

### .box (startx, starty, endx, endy, thickness )
### .line(startx, starty, endx, endy, thickness )
#### Prints a box/line on the printer
 - some language don't support diagonal lines
 - some languages don't support putting text inside boxes

### .alignment(align)
#### align - the alignment for the remainder of the document
 - left, center, right = alignment of text/barcodes

### .fontText ( text, font, options )
#### text - the text to print
#### font - the font to use; please use just the name (i.e. "FontAwesome") of the font that exists in your fonts folder
#### options - size: size of font; defaults to 20.   (Otherwise same options as .text)
 - This will use any application font to print to the printer.


## BARCODES
#### Some printer languages don't support all barcode types; the common barcode types supported for all printers are
 - UPCE, EAN8, I2OF5, 39, 93, 128, EAN13, I2OF5C, I2OF5G, CODABAR, MSI, UPCA, POSTNET
 - To Use: **.barcode('12345678', Document.BARCODE.EAN8, 30)**


## Fonts
#### Printer languages have different font, CPCL & line_mode use the same font
See Section 3-1 through 3-3 of the CPCL programming PDF for fonts and font sizes.

See pages 1315 & 1316 of the ZPL for fonts and font sizes in the ZPL language



## Notes
- If you want to use ANY raw codes; just use the Document.raw() and pass any any raw commands as described in their respective manuals -- please note if you change some sort of global options; the report generator may not be able to figure out the rest of the report properly, so proceed with caution.
- You can also create your entire document as a string and just pass it in without using the easy to use document interface.



## Building full plugin from Source (Repo Access Required)

1. You need to open the Android project in the Android studio Repo and build the release or debug AAR file.
- The built aar file will then be located at /AndroidProject/build/outputs/aar and named app-release.arr (or app-debug.arr).
- This file needs to be copied to the print repo; Print-Zebra/Platforms/android folder and renamed to be "zebra-support.arr"
2. You need to open the Mac project in XCode ... <Instructions coming soon>

3. Change to the root of the Print-Zebra repo, and type "npm pack", this will create the full plugin .tgz file that can be installed using the tns command line.

For installation of this version you do:
- tns plugin remove nativescript-print-zebra

then
- tns plugin add \path\to\nativescript-print-zebra-x.x.x.tgz

where x.x.x is the version number that was generated.