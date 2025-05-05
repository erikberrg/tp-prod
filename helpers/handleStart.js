// helpers/handleStart.js
import * as Haptics from "expo-haptics";
import Toast from "react-native-toast-message";
import bleHelper from "./ble";
import {
  calculateDuration,
  calculateDistance,
  calculateRepetition,
  calculateDelay,
} from "./calculations";

let setAnimationColorRef;
let startAnimationRef;

// Setup refs from animation context
export const setAnimationHelpers = ({ setAnimationColor, startAnimation }) => {
  setAnimationColorRef = setAnimationColor;
  startAnimationRef = startAnimation;
};

// 💡 Only animation logic here
export const startPacerAnimation = async (pacer) => {
  try {
    const duration = calculateDuration(pacer.minutes, pacer.seconds, pacer.hundredths) * 1000;
    const distance = calculateDistance(pacer.distance);
    const repetitions = calculateRepetition(pacer.repetitions);
    const delay = calculateDelay(pacer.delay);

    startAnimationRef?.(duration, distance, repetitions, delay);
    setAnimationColorRef?.(pacer.color);
  } catch (err) {
    console.error("❌ Animation failed to start:", err);
  }
};

// 💡 Everything else here
export const handleStart = async ({
  pacer,
  router,
}) => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Success);
      router.replace({
        pathname: "/(main)",
        params: { pacer: JSON.stringify(pacer) },
      });
      await bleHelper.sendPacer(
        pacer.color,
        calculateDuration(pacer.minutes, pacer.seconds, pacer.hundredths),
        calculateDistance(pacer.distance)
      );
      console.log("Pacer sent:", pacer);
    } catch (error) {
      console.error("❌ handleStart failed:", error);
      Toast.show({
        type: "messageToast",
        text1: "Device not connected",
        text2: "bluetooth",
        position: "top",
        topOffset: 60,
        visibilityTime: 4000,
        autoHide: true,
        swipeable: true,
      });
    };
  };
