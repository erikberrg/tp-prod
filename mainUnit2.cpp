#include <WiFi.h>
#include <esp_now.h>
#include <FastLED.h>

#define LED_PIN 5
#define NUM_LEDS 1200
#define BRIGHTNESS 255
#define LED_TYPE WS2812B
#define COLOR_ORDER GRB

CRGB leds[NUM_LEDS];

bool running = false;
CRGB pacerColor = CRGB::Red;
int pacerPosition = 0;
unsigned long lastUpdate = 0;
unsigned long stepSpeed = 100; // Default speed (ms between steps)
const int PACER_LEDS = 40;      // Number of LEDs in the pacer
const int STEP_SIZE = 20;       // Step size in LEDs

void onReceive(const uint8_t *mac, const uint8_t *incomingData, int len) {
  Serial.println("onReceive() called!");

  String received = String((char*)incomingData);

  Serial.print("Raw received message: ");
  Serial.println(received);

  if (received.startsWith("start")) {
    Serial.println("Valid start command detected!");

    String command = received.substring(6);
    int firstSpace = command.indexOf(' ');
    String color = command.substring(0, firstSpace);
    String speedStr = command.substring(firstSpace + 1);

    // Parse color
    if (color == "#FFC82E") pacerColor = CRGB::OrangeRed;
    else if (color == "#512698") pacerColor = CRGB::Purple;
    else if (color == "#009CDF") pacerColor = CRGB::Blue;
    else if (color == "#E23838") pacerColor = CRGB::Red;
    else if (color == "#F78200") pacerColor = CRGB::Orange;
    else if (color == "#5EBD3E") pacerColor = CRGB::Green;
    else pacerColor = CRGB::Red; // fallback

    // Parse speed
    float totalTimeSeconds = speedStr.toFloat();
    int steps = (NUM_LEDS - PACER_LEDS) / STEP_SIZE;
    stepSpeed = ((totalTimeSeconds / 4) * 1000) / steps;

    running = true;
    pacerPosition = 0;

    Serial.println("Pacer animation started!");
  } else {
    Serial.println("Received message did not start with 'start'");
  }
}


void setup() {
  Serial.begin(115200);

  WiFi.mode(WIFI_STA);
  if (esp_now_init() != ESP_OK) {
    Serial.println("ESP-NOW init failed");
    return;
  } else {
    Serial.println("ESP-NOW initialized successfully");
  }

  esp_now_register_recv_cb(onReceive);

  FastLED.addLeds<LED_TYPE, LED_PIN, COLOR_ORDER>(leds, NUM_LEDS);
  FastLED.setBrightness(BRIGHTNESS);
  fill_solid(leds, NUM_LEDS, CRGB::Black);
  FastLED.show();
}

void loop() {
  if (running) {
    if (millis() - lastUpdate >= stepSpeed) {
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
        Serial.println("Pacer finished on this unit!");
      }
    }
  }
}
