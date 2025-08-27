import { createSlice } from "@reduxjs/toolkit"

interface ModalProperty {
  isModalOpen: boolean,
  isButtonDisabled: boolean,
  isConfirmModalOpen: boolean
}

const initialState: ModalProperty = {
  isModalOpen: false,
  isButtonDisabled: false,
  isConfirmModalOpen: false
}

const modalControlSlice = createSlice({
  name: "modalControl",
  initialState,
  reducers: {
    setIsModalOpen: (state, action) => {
      state.isModalOpen = action.payload
    },
    setIsButtonDisabled: (state, action) => {
      state.isButtonDisabled = action.payload
    },
    setIsConfirmModalOpen: (state, action) => {
      state.isConfirmModalOpen = action.payload
    }
  }
})

export const { setIsModalOpen, setIsButtonDisabled, setIsConfirmModalOpen } = modalControlSlice.actions

export default modalControlSlice.reducer