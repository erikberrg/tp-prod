import React, { createContext, useContext, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';
import { theme } from '../constants/theme';

const AnimationContext = createContext();

export const AnimationProvider = ({ children }) => {
  const [animationColor, setAnimationColor] = useState(theme.colors.transparent);
  const animationProgress = useRef(new Animated.Value(0));
  const animationLoop = useRef(null); // To store the loop reference

  const startAnimation = (duration, lapCountNumber, repetitions, delay) => {
    const timePerLap = duration / lapCountNumber;
    animationProgress.current.setValue(0);

    const lapAnimation = Animated.timing(animationProgress.current, {
      toValue: 1,
      duration: timePerLap,
      easing: Easing.linear,
      useNativeDriver: false,
    });

    // Set up a loop with delay and repetitions
    animationLoop.current = Animated.loop(
      Animated.sequence([
        Animated.loop(lapAnimation, { iterations: lapCountNumber }),
        Animated.delay(delay),
      ]),
      { iterations: repetitions }
    );

    animationLoop.current.start(); // Start the loop
  };

    // Function to reset the animation and stop it
    const resetAnimation = () => {
      animationProgress.current.setValue(0); // Reset the progress to 0
      if (animationLoop.current) {
        animationLoop.current.stop(); // Stop the animation loop
      }
    };

  return (
<AnimationContext.Provider
  value={{
    startAnimation,
    resetAnimation, // Provide reset function
    animationProgress,
    animationColor,
    setAnimationColor,
  }}
>
  {children}
</AnimationContext.Provider>
  );
};

export const useAnimationContext = () => useContext(AnimationContext);
