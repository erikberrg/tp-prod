import { StyleSheet, Text, View, Pressable, Platform } from 'react-native'
import React from 'react'
import { theme } from '../../constants/theme'
import Loading from './Loading'

const Button = ({
    buttonStyle,
    textStyle,
    title='',
    onPress=()=>{},
    loading = false,
    hasShadow = true,
}) => {

  const shadowStyle = {
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8},
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 4,
  }

  if(loading){
    return (
      <View style={[styles.button, buttonStyle, {backgroundColor: theme.colors.white}]}>
        <Loading />
      </View>
    )
  }


return (
    <Pressable   
    onPress={() => {
        if (Platform.OS === 'ios' || Platform.OS === 'android') {
          const { impactAsync, ImpactFeedbackStyle } = require('expo-haptics');
          impactAsync(ImpactFeedbackStyle.Medium);
        }
        onPress();
      }} style={[styles.button, buttonStyle, hasShadow && shadowStyle]}>
        <Text style={[styles.text, textStyle]}>{title}</Text>
    </Pressable>
)
}

export default Button

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary,
    height: 50,
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderCurve: 'continuous',
    borderRadius: theme.radius.xl,
  },
  text: {
    fontSize: 14,
    color: theme.darkColors.text,
    fontWeight: theme.fonts.medium,
  }
})