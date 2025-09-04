import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ValidationError } from "@/utils/form-validation/validation.model";

interface FormState {
  data: Record<string, any>
  errors: ValidationError[]
}

const initialState: FormState = {
  data: {},
  errors: []
}

export const formSlice = createSlice({
  name: 'form-admin',
  initialState,
  reducers: {
    setField(state, action: PayloadAction<{field: string, value:any}>) {
      state.data[action.payload.field] = action.payload.value
    },
    setForm(state, action: PayloadAction<Record<string, any>>) {
      state.data = action.payload
    },
    setErrors(state, action: PayloadAction<ValidationError[]>) {
      state.errors = action.payload
    },
    clearErrors(state) {
      state.errors = []
    },
    clearForm(state) {
      state.data = {}
      state.errors = []
    }
  }
})

export const {
  setField,
  setForm,
  setErrors,
  clearErrors,
  clearForm
} = formSlice.actions

export default formSlice.reducer