import { createFormHook, formOptions } from "@tanstack/react-form";

import { FormError } from "@/components/form/form-error";
import { FormSubmitButton } from "@/components/form/form-submit-button";
import { FormTextField } from "@/components/form/form-text-field";
import { fieldContext, formContext } from "@/hooks/form/form-context";

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField: FormTextField,
  },
  formComponents: {
    SubmitButton: FormSubmitButton,
    FormError: FormError,
  },
});

export { formOptions };
