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
  
  async sendTest(color, duration, distance, repetitions, delay) {
    const test = `${color} ${duration} ${distance} ${repetitions} ${delay}`;
    if (!this.device) {
      console.error("No device connected.");
      return;
    }
    try {
      const base64Message = Buffer.from(test, "utf-8").toString("base64");
      await this.device.writeCharacteristicWithResponseForService(
        UART_SERVICE_UUID,
        TX_CHARACTERISTIC_UUID,
        base64Message
      );
      console.log(`Sent test command: ${test}`);
    } catch {
      console.error("Error sending test command:", error);
    }
  }

  async sendPacer(color, duration) {
    const pacer = `start ${color} ${duration}`;
    if (!this.device) {
      console.error("No device connected.");
      return;
    }

    try {
      const base64Message = Buffer.from(pacer, "utf-8").toString("base64");
      await this.device.writeCharacteristicWithResponseForService(
        UART_SERVICE_UUID,
        TX_CHARACTERISTIC_UUID,
        base64Message
      );
      console.log(`${color}, ${duration}, ${distance}, ${repetitions}, ${delay}`);
      console.log(`Sent pacer command: ${pacer}`);
    } catch (error) {
      console.error("Error sending color command:", error);
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

  disconnect() {
    if (this.device) {
      this.device.disconnect();
      this.device = null;
      console.log("Disconnected from ESP32.");
    }
  }
  
  getConnectionStatus() {
    return this.connectionStatus;
  }
}

const bleHelper = new BLEHelper();
export default bleHelper;
