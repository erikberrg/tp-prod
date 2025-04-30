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
**BLE:** ESP32
**LED Control:** FastLED Library (WS2812B)

## Contributors
Erik Berg & Jacob Jeager

## License
This project is licensed under the MIT License.
