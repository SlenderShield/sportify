import React from "react";
import { TextInput, TextInputProps } from "react-native";

export const Input = React.forwardRef<TextInput, TextInputProps>(
  ({ ...props }, ref) => (
    <TextInput
      ref={ref}
      className="border border-muted rounded-md px-md py-sm bg-surface text-body"
      {...props}
    />
  )
);
Input.displayName = "Input";
