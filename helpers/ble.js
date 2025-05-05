import { BleManager } from "react-native-ble-plx";
import { Buffer } from "buffer";
import { PermissionsAndroid, Platform } from "react-native";

const UART_SERVICE_UUID = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";
const TX_CHARACTERISTIC_UUID = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E";

class BLEHelper {
  constructor() {
    this.manager = new BleManager();
    this.device = null;
    this.connectionStatus = false;
  }

  setConnectionStatus(status) {
    this.connectionStatus = status;
  }

  async requestPermissions() {
    if (Platform.OS === "android" && Platform.Version >= 23) {
      const permissions = [];
  
      permissions.push(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
  
      if (Platform.Version >= 31) {
        // Android 12+ additional BLE permissions
        permissions.push(PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN);
        permissions.push(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT);
      }
  
      const granted = await PermissionsAndroid.requestMultiple(permissions);
      const allGranted = Object.values(granted).every(
        status => status === PermissionsAndroid.RESULTS.GRANTED
      );
  
      if (!allGranted) {
        console.warn("Not all BLE permissions granted.");
      }
    }
  }

  async scanAndConnect() {
    return new Promise((resolve, reject) => {
      this.manager.startDeviceScan(null, null, async (error, scannedDevice) => {
        if (error) {
          console.error("Scan error:", error);
          reject(error);
          return;
        }

        if (scannedDevice?.name?.includes("ESP32")) {
          this.manager.stopDeviceScan();
          try {
            const connectedDevice = await scannedDevice.connect();
            await connectedDevice.discoverAllServicesAndCharacteristics();
            this.device = connectedDevice;
            this.setConnectionStatus(true);
            console.log("Connected to ESP32:", connectedDevice.name);
            resolve(connectedDevice);
          } catch (err) {
            console.error("Connection error:", err);
            reject(err);
          }
        }
      });

      setTimeout(() => {
        this.manager.stopDeviceScan();
        reject(new Error("No ESP32 device found"));
      }, 4000);
    });
  }

  async sendPacer(color, duration, distance) {
    if (!this.device) {
      console.error("No device connected.");
      return;
    }
  
    const lapDuration = parseFloat(duration) / parseFloat(distance);
    console.log(`Duration: ${duration}`);
    console.log(`Lap duration: ${lapDuration}`);
    const segmentDelayMs = (lapDuration * 1000) / 5;
    const fullLapDelayMs = lapDuration * 1000;
  
    for (let lap = 0; lap < distance; lap++) {
      console.log(`Starting lap ${lap + 1}/${distance}`);
  
      const firstPacer = `start ${color} ${lapDuration.toFixed(2)} ${distance}`;
      console.log(`${lapDuration}`)
      console.log(`Segment Distance: ${segmentDelayMs}`);
      console.log(`Sending pacer command: ${firstPacer}`);
  
      try {
        const base64Message = Buffer.from(firstPacer, "utf-8").toString("base64");
        await this.device.writeCharacteristicWithResponseForService(
          UART_SERVICE_UUID,
          TX_CHARACTERISTIC_UUID,
          base64Message
        );
        console.log("Sent start command to Unit 1");
  
        setTimeout(async () => {
          const twoMsg = `two`;
          console.log(`Sending to Unit 2: ${twoMsg}`);
          const twoBase64 = Buffer.from(twoMsg, "utf-8").toString("base64");
          await this.device.writeCharacteristicWithResponseForService(
            UART_SERVICE_UUID,
            TX_CHARACTERISTIC_UUID,
            twoBase64
          );
        }, segmentDelayMs);
  
        setTimeout(async () => {
          const threeMsg = `three`;
          console.log(`Sending to Unit 3: ${threeMsg}`);
          const threeBase64 = Buffer.from(threeMsg, "utf-8").toString("base64");
          await this.device.writeCharacteristicWithResponseForService(
            UART_SERVICE_UUID,
            TX_CHARACTERISTIC_UUID,
            threeBase64
          );
        }, segmentDelayMs * 2);
  
        setTimeout(async () => {
          const fourMsg = `four`;
          console.log(`Sending to Unit 4: ${fourMsg}`);
          const fourBase64 = Buffer.from(fourMsg, "utf-8").toString("base64");
          await this.device.writeCharacteristicWithResponseForService(
            UART_SERVICE_UUID,
            TX_CHARACTERISTIC_UUID,
            fourBase64
          );
        }, segmentDelayMs * 3);

        setTimeout(async () => {
          const fiveMsg = `five`;
          console.log(`Sending to Unit 5: ${fiveMsg}`);
          const fiveBase64 = Buffer.from(fiveMsg, "utf-8").toString("base64");
          await this.device.writeCharacteristicWithResponseForService(
            UART_SERVICE_UUID,
            TX_CHARACTERISTIC_UUID,
            fiveBase64
          );
        }, segmentDelayMs * 4);
  
      } catch (error) {
        console.error("Error sending pacer sequence:", error);
      }
  
      if (lap < distance - 1) {
        console.log(`Waiting ${fullLapDelayMs}ms before next lap...`);
        await new Promise(resolve => setTimeout(resolve, fullLapDelayMs));
      }
    }
  }
  
  async sendStop() {
    const stop = `stop`;
    if (!this.device) {
      console.error("No device connected.");
      return;
    }
    try {
      const base64Message = Buffer.from(stop, "utf-8").toString("base64");
      await this.device.writeCharacteristicWithResponseForService(
        UART_SERVICE_UUID,
        TX_CHARACTERISTIC_UUID,
        base64Message
      );
      console.log(`Sent stop command: ${stop}`);
    } catch (error) {
      console.error("Error sending stop command:", error);
    }
  }

  async disconnect() {
    if (this.device) {
      try {
        await this.device.cancelConnection();
        console.log("Disconnected from ESP32.");
        this.device = null;
        this.setConnectionStatus(false);
      } catch (error) {
        console.error("Error disconnecting from ESP32:", error);
        throw error;
      }
    } else {
      console.log("No device to disconnect.");
    }
  }
  
  
  
  getConnectionStatus() {
    return this.connectionStatus;
  }
}

const bleHelper = new BLEHelper();
export default bleHelper;
