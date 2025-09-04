export type ValidationRule = 
  | 'required' 
  | 'email' 
  | 'required'
  | 'password' 
  | 'numeric' 
  | {minLength: number}
  | {maxLength: number}

export type FieldRules = ValidationRule[]

export interface ValidationError {
  field: string,
  message: string
}