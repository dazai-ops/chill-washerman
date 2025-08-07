import { ValidationError } from "./singleFormValidation.model";
import { validateField } from "./validateField";
import { FieldRules } from "./singleFormValidation.model";

export const validateForm = (
  formData: Record<string, string | number | boolean | object | null | undefined>,
  formRules: Record<string, FieldRules>
): ValidationError[] => {
  const errors: ValidationError[] = [];

  for (const field in formRules) {
    const error = validateField(field ,formData[field], formRules[field]);
    if (error) {
      errors.push(error);
    }
  }

  return errors
}