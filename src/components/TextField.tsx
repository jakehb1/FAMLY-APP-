import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { colors, radius, spacing } from '../theme/colors';

interface TextFieldProps extends TextInputProps {
  label: string;
  error?: string;
}

export default function TextField({ label, error, style, ...props }: TextFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.fieldWrapper, error && styles.fieldWrapperError]}>
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={colors.textSecondary}
          {...props}
        />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.m,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.s,
  },
  fieldWrapper: {
    borderRadius: radius.l,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceStrong,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
  },
  fieldWrapperError: {
    borderColor: colors.danger,
  },
  input: {
    fontSize: 16,
    color: colors.text,
    paddingVertical: 6,
  },
  error: {
    marginTop: spacing.xs,
    fontSize: 12,
    color: colors.danger,
  },
});
