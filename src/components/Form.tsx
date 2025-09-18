import React from "react";
import { useForm, FormProvider, SubmitHandler, FieldValues, UseFormProps } from "react-hook-form";
import { ZodSchema, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type FormProps<T extends FieldValues> = {
  schema: ZodSchema<T>;
  defaultValues: UseFormProps<T>["defaultValues"];
  onSubmit: SubmitHandler<T>;
  children: React.ReactNode;
};

export function Form<T extends FieldValues>({ schema, defaultValues, onSubmit, children }: FormProps<T>) {
  const methods = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onChange",
  });

  return (
    <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
      {children}
      </form>
    </FormProvider>
  );
}
