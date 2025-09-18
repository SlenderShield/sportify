import React from "react";
import { View, Button, Text } from "react-native";
import { z } from "zod";
import { Form } from "../../components/Form";
import { FormField } from "../../components/FormField";

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type FormValues = z.infer<typeof schema>;

export function DemoLoginForm() {
  return (
    <View className="p-md">
      <Form<FormValues>
        schema={schema}
        defaultValues={{ email: "", password: "" }}
  onSubmit={(data: FormValues) => alert(JSON.stringify(data))}
      >
        <FormField name="email" label="Email" autoCapitalize="none" keyboardType="email-address" />
        <FormField name="password" label="Password" secureTextEntry />
        <Button title="Login" onPress={() => {}} />
      </Form>
    </View>
  );
}
