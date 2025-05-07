<img src="https://github.com/erikberrg/tp-prod/blob/master/assets/images/icon.png" width="64">

# Track Pacer System
An **interactive LED pacing system** for a 200m track, designed to help runners train with precise pacing.  The system is controlled via a **React Native app**, which allows users to create custom presets for speed, color, and distance.  The lights are powered by **WS2812B LEDs** and controlled by **ESP32 microcontrollers** that synchronize via **ESP-Now and Bluetooth**

## Features
**Customizable Pacing Presets** - Set distance, speed, and color.
**Real-Time Synchronization** - LEDs light up in sync with a moving animation in the app.
**Multi-Device Communication** - ESP microcontrollers communicate over esp-now while the React Native app uses BLE for real-time control.

## Tech Stack
**Frontend:** React Native (Expo)
**Backend:** Arduino IDE / Async Storage Library
**Microcontrollers:** ESP32
**LED Control:** FastLED Library (WS2812B)

## Contributors
Erik Berg & Jacob Jeager

## License
This project is licensed under the MIT License.

# Further Development
Here are detailed instructions about the content of this directory for help with further development.

## React Native Application (Expo)
To continue development on the app, the user will need to download the directory and run the app using 'npx expo run:ios' or 'npx expo run:android' for a development build.

To make a production version of the app, for iOS if you are using expo eas, use the commands for that.  If you are bundling it from scratch (what we did), you will need to bundle the js to the application in Xcode.  To do this, run 'npx expo export' to create the dist folder that contains the mainjs.bundle.  From there you will need to run 'npx expo prebuild' to create the native iOS and Android folders.  You can bundle the js respectively in Android Studio and Xcode and make the builds of the application from there.

## ESP 32 Sketches
The Track Pacer system utilizes esp32's in each junction box, to update the code for those you will need to modify the c++ code using the Arduino IDE or another usable IDE.  To run new code on the esp32's you will need to plug in the USB C cable from the device with the code to the esp32 and upload the sketch.
