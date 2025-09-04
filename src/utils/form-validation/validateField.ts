import { formatFieldName } from '@/utils/helpers/formatters/fieldName';
import { FieldRules, ValidationError } from '@/utils/form-validation/validation.model';

export const validateField = (
  fieldName: string,
  value: string | number | boolean | object | null | undefined,
  rules: FieldRules
): ValidationError | null => {
  for (const rule of rules) {
    if(rule === 'required'){
      if (value === '' || value === null || value === undefined || value === "") {
        return { field: fieldName, message: `${formatFieldName(fieldName)} harus diisi` };
      }
    }
    if(typeof value === 'number' && rule === 'numeric'){
      if(value && isNaN(value)){
        return { field: fieldName, message: `${formatFieldName(fieldName)} hanya boleh angka` };
      }
    }
    if(typeof value === 'string' && rule === 'email'){
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(value && !emailRegex.test(value)){
        return { field: fieldName, message: `${formatFieldName(fieldName)} harus email valid` };
      }
    }
    if(typeof rule === 'object' && typeof value === 'string' && 'minLength' in rule) {
      if(value.length < rule.minLength){
        return { field: fieldName, message: `${formatFieldName(fieldName)} setidaknya ${rule.minLength} karakter` };
      }
    }
    if(typeof rule === 'object' && typeof value === 'string' && 'maxLength' in rule) {
      if(value.length > rule.maxLength){
        return { field: fieldName, message: `${formatFieldName(fieldName)} maksimal ${rule.maxLength} karakter` };
      }
    }
  }
  return null
}