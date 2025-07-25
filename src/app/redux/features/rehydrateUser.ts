"use client"

import { useEffect } from "react";
import { rehydrate } from "../slices/authSlice";
import { AppDispatch } from "../store";
import { useDispatch } from "react-redux";

export default function RehydrateUser() {
  const dispatch = useDispatch<AppDispatch>();
  
  useEffect(() => {
    dispatch(rehydrate());
  }, []);

  return null
}