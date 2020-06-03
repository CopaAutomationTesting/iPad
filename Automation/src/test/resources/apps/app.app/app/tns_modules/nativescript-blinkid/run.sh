tsc
cd demo
tns plugin remove nativescript-blinkid
tns plugin add ../
tns platform remove ios
tns run ios --device 1
cd ../
