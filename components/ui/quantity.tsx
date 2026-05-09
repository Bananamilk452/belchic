"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

export function Quantity({
  value: controlledValue,
  onChange,
  min = 1,
  max = 99,
  className,
}: {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}) {
  const [internalValue, setInternalValue] = useState(controlledValue ?? 1);
  const value = controlledValue ?? internalValue;
  const isControlled = controlledValue !== undefined;

  const updateValue = (newValue: number) => {
    const clampedValue = Math.max(min, Math.min(max, newValue));
    if (isControlled) {
      onChange?.(clampedValue);
    } else {
      setInternalValue(clampedValue);
      onChange?.(clampedValue);
    }
  };

  const handleDecrement = () => {
    updateValue(value - 1);
  };

  const handleIncrement = () => {
    updateValue(value + 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue === "") {
      updateValue(min);
      return;
    }
    const numValue = parseInt(inputValue, 10);
    if (!isNaN(numValue)) {
      updateValue(numValue);
    }
  };

  const handleBlur = () => {
    if (value < min) {
      updateValue(min);
    } else if (value > max) {
      updateValue(max);
    }
  };

  return (
    <div className={cn("inline-flex items-center border border-black", className)}>
      <button
        type="button"
        onClick={handleDecrement}
        disabled={value <= min}
        className="flex size-10 items-center justify-center text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="감소"
      >
        <MinusIcon className="size-4" />
      </button>
      <input
        type="number"
        value={value}
        onChange={handleInputChange}
        onBlur={handleBlur}
        min={min}
        max={max}
        className="w-12 bg-white text-center text-sm outline-none [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={handleIncrement}
        disabled={value >= max}
        className="flex size-10 items-center justify-center text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="증가"
      >
        <PlusIcon className="size-4" />
      </button>
    </div>
  );
}
