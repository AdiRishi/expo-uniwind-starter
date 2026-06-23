import { FieldError, Input, Label, TextField } from "heroui-native";
import type { TextInputProps } from "react-native";

import { useFieldContext, useFieldError } from "@/hooks/form/form-context";

type FormTextFieldProps = {
  label: string;
} & Omit<TextInputProps, "value" | "onChangeText" | "onBlur">;

export function FormTextField({ label, ...inputProps }: FormTextFieldProps) {
  const field = useFieldContext<string>();
  const { errorMessage, isInvalid } = useFieldError();

  return (
    <TextField isInvalid={isInvalid}>
      <Label>{label}</Label>
      <Input
        value={field.state.value}
        onChangeText={(text) => field.handleChange(text)}
        onBlur={() => field.handleBlur()}
        {...inputProps}
      />
      <FieldError>{errorMessage}</FieldError>
    </TextField>
  );
}
