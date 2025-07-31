"use client"

import { useEffect } from "react";
import { rehydrate } from "@/redux/slices/authSlice";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";

export default function RehydrateUser() {
  const dispatch = useDispatch<AppDispatch>();
  
  useEffect(() => {
    dispatch(rehydrate());
  }, []);

  return null
}