#include <FastLED.h>
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>

#define LED_PIN 5 // Data pin
#define COLOR_ORDER GRB // LED light order, can also be BGR

int NUM_LEDS = 150; // Number of LEDs
int PACER_LEDS = 10                                   ; // Number of LEDs in the pacer bar
int STEP_SIZE = 1; // Step size for pacer movement

CRGB* leds;
int pacerPosition = 0;
unsigned long speed = 1000;
bool running = false;
CRGB pacerColor = CRGB::Red;

// Function to map color string to CRGB color
CRGB getColor(String color) {
  if (color == "#FFC82E") return CRGB::OrangeRed;
  if (color == "#512698") return CRGB::Purple;
  if (color == "#009CDF") return CRGB::Blue;
  if (color == "#E23838") return CRGB::Red;
  if (color == "#F78200") return CRGB::Orange;
  if (color == "#5EBD3E") return CRGB::Green;
  return CRGB::Red;  // Default color
}

// BLE UUIDs for service and characteristics
#define SERVICE_UUID "6E400001-B5A3-F393-E0A9-E50E24DCCA9E"
#define RX_CHARACTERISTIC_UUID "6E400002-B5A3-F393-E0A9-E50E24DCCA9E"
#define TX_CHARACTERISTIC_UUID "6E400003-B5A3-F393-E0A9-E50E24DCCA9E"

BLECharacteristic *pTxCharacteristic;
bool deviceConnected = false;

// Callback for BLE server
class MyServerCallbacks : public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) {
        deviceConnected = true;
        Serial.println("Device Connected!");
    }

    void onDisconnect(BLEServer* pServer) {
        deviceConnected = false;
        Serial.println("Device Disconnected!");
        pServer->getAdvertising()->start();  // Restart advertising
    }
};

// Callback for receiving data via BLE
class MyCallbacks : public BLECharacteristicCallbacks {
    void onWrite(BLECharacteristic *pCharacteristic) {
        String rxValue = pCharacteristic->getValue().c_str();
        if (!rxValue.isEmpty()) {
            Serial.print("Received via BLE: ");
            Serial.println(rxValue);

            if (rxValue.startsWith("start")) {
                String command = rxValue.substring(6);
                int firstSpace = command.indexOf(' ');
                String color = command.substring(0, firstSpace);
                String speedStr = command.substring(firstSpace + 1);

                pacerColor = getColor(color);
                float totalTimeSeconds = speedStr.toFloat();
                int steps = (NUM_LEDS - PACER_LEDS) / STEP_SIZE;
                speed = (totalTimeSeconds * 1000) / steps;

                running = true;
                pacerPosition = 0;
                Serial.println("Pacer started!");
            }
            else if (rxValue.startsWith("stop")) {
                running = false;
                fill_solid(leds, NUM_LEDS, CRGB::Black);
                FastLED.show();
                Serial.println("Pacer stopped, all LEDs off!");
            }
        }
    }
};

void setup() {
    Serial.begin(115200);

    leds = new CRGB[NUM_LEDS];
    FastLED.addLeds<WS2812B, LED_PIN, COLOR_ORDER>(leds, NUM_LEDS);
    FastLED.setBrightness(255);
    fill_solid(leds, NUM_LEDS, CRGB::Black);
    FastLED.show();

    BLEDevice::init("ESP32_BLE_UART");

    // Create the BLE server
    BLEServer *pServer = BLEDevice::createServer();
    pServer->setCallbacks(new MyServerCallbacks());

    BLEService *pService = pServer->createService(SERVICE_UUID);

    BLECharacteristic *pRxCharacteristic = pService->createCharacteristic(
        RX_CHARACTERISTIC_UUID,
        BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_WRITE
    );
    pRxCharacteristic->setCallbacks(new MyCallbacks());

    pTxCharacteristic = pService->createCharacteristic(
        TX_CHARACTERISTIC_UUID,
        BLECharacteristic::PROPERTY_NOTIFY
    );

    pService->start();

    BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
    pAdvertising->addServiceUUID(SERVICE_UUID);
    pServer->getAdvertising()->start();

    Serial.println("BLE UART Ready!");
}

void loop() {
    if (running) {
        static unsigned long lastUpdate = 0;
        if (millis() - lastUpdate >= speed) {
            lastUpdate = millis();

            int prevPos = pacerPosition - STEP_SIZE;
            if (prevPos >= 0) {
                for (int i = 0; i < STEP_SIZE; i++) {
                    if (prevPos + i < NUM_LEDS) {
                        leds[prevPos + i] = CRGB::Black;
                    }
                }
            }

            for (int i = 0; i < PACER_LEDS; i++) {
                if (pacerPosition + i < NUM_LEDS) {
                    leds[pacerPosition + i] = pacerColor;
                }
            }

            FastLED.show();
            pacerPosition += STEP_SIZE;

            if (pacerPosition >= NUM_LEDS - PACER_LEDS) {
                running = false;
                fill_solid(leds, NUM_LEDS, CRGB::Black);
                FastLED.show();
                Serial.println("Pacer finished!");
                
            }
        }
    }
}
