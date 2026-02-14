import { Alert } from "heroui-native";

import { useFormContext } from "@/hooks/form/form-context";

export function FormError() {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => state.errorMap.onSubmit}>
      {(error) => {
        if (!error) return null;
        const message = typeof error === "string" ? error : String(error);
        return (
          <Alert status="danger" className="items-center bg-danger/5">
            <Alert.Indicator className="pt-0" />
            <Alert.Content>
              <Alert.Title>{message}</Alert.Title>
            </Alert.Content>
          </Alert>
        );
      }}
    </form.Subscribe>
  );
}
