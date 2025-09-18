import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { useTheme } from '../theme/NativeWindProvider';

export function Button({ children, ...props }: TouchableOpacityProps) {
  useTheme(); // for rerender on theme change
  return (
    <TouchableOpacity
      className="bg-primary rounded-lg px-md py-sm active:bg-secondary dark:bg-background"
      {...props}
    >
      <Text className="text-white text-body font-bold dark:text-primary">{children}</Text>
    </TouchableOpacity>
  );
}
