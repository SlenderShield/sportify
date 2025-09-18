import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { TextInput, Text, View, TextInputProps } from "react-native";

interface FormFieldProps extends TextInputProps {
  name: string;
  label?: string;
}

export function FormField({ name, label, ...props }: FormFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <View className="mb-md">
      {label && <Text className="mb-xs text-body font-bold">{label}</Text>}
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className="border border-muted rounded-md px-md py-sm bg-surface text-body"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            {...props}
          />
        )}
      />
      {errors[name] && (
        <Text className="text-danger text-caption mt-xs">
          {errors[name]?.message?.toString()}
        </Text>
      )}
    </View>
  );
}
