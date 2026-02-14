import { Button } from "heroui-native";

import { useFormContext } from "@/hooks/form/form-context";

type FormSubmitButtonProps = {
  label: string;
  loadingLabel?: string;
};

export function FormSubmitButton({ label, loadingLabel = "Submitting..." }: FormSubmitButtonProps) {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
      {([canSubmit, isSubmitting]) => (
        <Button
          variant="primary"
          size="lg"
          isDisabled={!canSubmit || isSubmitting}
          onPress={() => void form.handleSubmit()}
        >
          {isSubmitting ? loadingLabel : label}
        </Button>
      )}
    </form.Subscribe>
  );
}
