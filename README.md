<img src="https://github.com/erikberrg/track-pacer/blob/main/assets/images/icon.png" width="64">

# Track Pacer System
An **interactive LED pacing system** for a 200m track, designed to help runners train with precise pacing.  The system is controlled via a **React Native app**, which allows users to create custom presets for speed, color, distance, and repetitions.  The lights are powered by **WS2812B LEDs** and controlled by **Teensy 4.1 microcontrollers** that synchronize via **WiFi and Bluetooth**

## Features
**Customizable Pacing Presets** - Set distance, speed, color, repetitions, and delays.
**Real-Time Synchronization** - LEDs light up in sync with a moving animation in the app.
**Multi-Device Communication** - Teensy microcontrollers communicate over WiFi while the React Native app uses BLE for real-time control.

## Tech Stack
**Frontend:** React Native (Expo)
**Backend:** Arduino IDE / Async Storage Library
**Microcontrollers:** Teensy 4.1
**BLE:** Adafruit BLE UART Friend
**LED Control:** FastLED Library (WS2812B)

## Contributors
Erik Berg & Jacob Jeager

## License
This project is licensed under the MIT License.
