import React, { forwardRef } from 'react';
import { TextInput, TextInputProps, View, StyleSheet } from 'react-native';
import { Text } from './Text';
import { useTheme } from '@/contexts/ThemeContext';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<TextInput, InputProps>(({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  style,
  ...props
}, ref) => {
  const { isDark } = useTheme();

  const backgroundColor = isDark ? '#1A1A1A' : '#FFFFFF';
  const borderColor = error 
    ? '#EF4444' 
    : isDark ? '#3D3D3D' : '#E5E5E5';
  const textColor = isDark ? '#FAFAFA' : '#171717';
  const placeholderColor = isDark ? '#737373' : '#A3A3A3';
  const labelColor = isDark ? '#D4D4D4' : '#525252';
  const hintColor = isDark ? '#737373' : '#737373';

  return (
    <View style={styles.container}>
      {label && (
        <Text variant="body-sm" style={[styles.label, { color: labelColor }]}>
          {label}
        </Text>
      )}
      
      <View style={[
        styles.inputContainer,
        { backgroundColor, borderColor },
        error && styles.errorBorder,
      ]}>
        {leftIcon && (
          <View style={styles.leftIcon}>{leftIcon}</View>
        )}
        
        <TextInput
          ref={ref}
          style={[
            styles.input,
            { color: textColor },
            leftIcon ? styles.inputWithLeftIcon : undefined,
            rightIcon ? styles.inputWithRightIcon : undefined,
            style,
          ]}
          placeholderTextColor={placeholderColor}
          {...props}
        />
        
        {rightIcon && (
          <View style={styles.rightIcon}>{rightIcon}</View>
        )}
      </View>
      
      {error && (
        <Text variant="caption" style={styles.error}>
          {error}
        </Text>
      )}
      
      {hint && !error && (
        <Text variant="caption" style={[styles.hint, { color: hintColor }]}>
          {hint}
        </Text>
      )}
    </View>
  );
});

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  errorBorder: {
    borderColor: '#EF4444',
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  inputWithLeftIcon: {
    marginLeft: 8,
  },
  inputWithRightIcon: {
    marginRight: 8,
  },
  leftIcon: {
    marginRight: 4,
  },
  rightIcon: {
    marginLeft: 4,
  },
  error: {
    marginTop: 4,
    color: '#EF4444',
  },
  hint: {
    marginTop: 4,
  },
});

export default Input;
