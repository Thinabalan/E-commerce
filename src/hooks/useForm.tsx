import { useState } from "react";
import type { ChangeEvent } from "react";

type InputEvent = ChangeEvent<HTMLInputElement>;

export function useForm<T extends Record<string, any>>(initialState: T) {
  const [form, setForm] = useState<T>(initialState);

  const handleChange = (e: InputEvent) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return {
    form,
    setForm,
    handleChange
  };
}
