import React, { useRef } from "react";
import { Animated, Pressable } from "react-native";

export default function AnimatedButton({
  children,
  style,
  onPress,
  onLongPress,
  onPressIn: customPressIn,
  onPressOut: customPressOut,
  ...rest
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 50,
      bounciness: 10,
    }).start();

    // Call user-defined onPressIn
    if (typeof customPressIn === "function") {
      customPressIn();
    }
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 10,
    }).start();

    // Call user-defined onPressOut
    if (typeof customPressOut === "function") {
      customPressOut();
    }
  };

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...rest}
    >
      <Animated.View style={[{ transform: [{ scale }] }, style]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
