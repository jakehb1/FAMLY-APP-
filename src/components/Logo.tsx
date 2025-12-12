import React from 'react';
import { Text, StyleSheet, ViewStyle } from 'react-native';

interface LogoProps {
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  color?: string;
  style?: ViewStyle;
}

export default function Logo({ size = 'large', color = '#000', style }: LogoProps) {
  const sizeStyles = {
    small: { fontSize: 24, letterSpacing: 2 },
    medium: { fontSize: 36, letterSpacing: 3 },
    large: { fontSize: 48, letterSpacing: 4 },
    xlarge: { fontSize: 64, letterSpacing: 5 },
  };

  return (
    <Text
      style={[
        styles.logo,
        sizeStyles[size],
        { color },
        style,
      ]}
    >
      FAMLY
    </Text>
  );
}

const styles = StyleSheet.create({
  logo: {
    fontWeight: '900',
    fontFamily: 'PlayExtraUnlicensed-VAR',
    textAlign: 'center',
  },
});
