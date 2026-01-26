import React from 'react';
import { Pressable, PressableProps, View } from 'react-native';
import { Text } from './Text';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends Omit<PressableProps, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
  disabled?: boolean;
}

const variantClasses: Record<ButtonVariant, { container: string; text: string }> = {
  primary: {
    container: 'bg-[#1A1A1A] dark:bg-[#FAFAFA]',
    text: 'text-white dark:text-[#0F0F0F]',
  },
  secondary: {
    container: 'bg-primary-100 dark:bg-primary-900',
    text: 'text-[#1A1A1A] dark:text-[#FAFAFA]',
  },
  outline: {
    container: 'border border-[#E5E5E5] dark:border-[#3D3D3D] bg-transparent',
    text: 'text-[#1A1A1A] dark:text-[#FAFAFA]',
  },
  ghost: {
    container: 'bg-transparent',
    text: 'text-[#1A1A1A] dark:text-[#FAFAFA]',
  },
  destructive: {
    container: 'bg-error',
    text: 'text-white',
  },
};

const sizeClasses: Record<ButtonSize, { container: string; text: string }> = {
  sm: {
    container: 'h-9 px-4',
    text: 'text-body-sm',
  },
  md: {
    container: 'h-12 px-6',
    text: 'text-body',
  },
  lg: {
    container: 'h-14 px-8',
    text: 'text-body-lg',
  },
  icon: {
    container: 'h-11 w-11',
    text: '',
  },
};

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  iconPosition = 'left',
  className = '',
  disabled = false,
  ...props
}: ButtonProps) {
  const variantStyle = variantClasses[variant];
  const sizeStyle = sizeClasses[size];

  const containerClasses = `
    flex-row items-center justify-center rounded-full
    ${variantStyle.container}
    ${sizeStyle.container}
    ${disabled ? 'opacity-50' : ''}
    ${className}
  `.trim();

  const textClasses = `
    font-medium
    ${variantStyle.text}
    ${sizeStyle.text}
  `.trim();

  return (
    <Pressable
      className={containerClasses}
      disabled={disabled}
      style={({ pressed }) => [pressed && { transform: [{ scale: 0.97 }] }]}
      {...props}
    >
      {icon && iconPosition === 'left' && <View className="mr-2">{icon}</View>}
      {typeof children === 'string' ? <Text className={textClasses}>{children}</Text> : children}
      {icon && iconPosition === 'right' && <View className="ml-2">{icon}</View>}
    </Pressable>
  );
}

export default Button;
