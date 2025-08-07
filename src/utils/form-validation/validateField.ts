import { formatFieldName } from '../fieldNameFormatter';
import { FieldRules, ValidationError } from './singleFormValidation.model';

export const validateField = (
  fieldName: string,
  value: string | number | boolean | object | null | undefined,
  rules: FieldRules
): ValidationError | null => {
  for (const rule of rules) {
    if(rule === 'required'){
      if (value === '' || value === null || value === undefined) {
        return { field: fieldName, message: `${formatFieldName(fieldName)} is required` };
      }
    }
    if(typeof value === 'number' && rule === 'numeric'){
      if(value && isNaN(value)){
        return { field: fieldName, message: `${formatFieldName(fieldName)} must be a number` };
      }
    }
    if(typeof value === 'string' && rule === 'email'){
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(value && !emailRegex.test(value)){
        return { field: fieldName, message: `${formatFieldName(fieldName)} must be a valid email` };
      }
    }
    if(typeof rule === 'object' && typeof value === 'string' && 'minLength' in rule) {
      if(value.length < rule.minLength){
        return { field: fieldName, message: `${formatFieldName(fieldName)} must be at least ${rule.minLength} characters long` };
      }
    }
    if(typeof rule === 'object' && typeof value === 'string' && 'maxLength' in rule) {
      if(value.length > rule.maxLength){
        return { field: fieldName, message: `${formatFieldName(fieldName)} must be at least ${rule.maxLength} characters long` };
      }
    }
  }
  return null
}