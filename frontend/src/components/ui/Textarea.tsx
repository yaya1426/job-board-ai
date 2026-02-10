import { useState } from 'react';
import type { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  showCharCount?: boolean;
  maxLength?: number;
}

export function Textarea({
  label,
  error,
  helperText,
  showCharCount = false,
  maxLength,
  className = '',
  id,
  value,
  onChange,
  ...props
}: TextareaProps) {
  const [charCount, setCharCount] = useState(0);
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCharCount(e.target.value.length);
    if (onChange) onChange(e);
  };

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        id={inputId}
        className={`
          w-full px-3 py-2 border rounded-lg transition-colors resize-y
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${className}
        `}
        value={value}
        onChange={handleChange}
        maxLength={maxLength}
        {...props}
      />
      <div className="mt-1 flex justify-between items-center">
        <div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {helperText && !error && <p className="text-sm text-gray-500">{helperText}</p>}
        </div>
        {showCharCount && maxLength && (
          <p className="text-sm text-gray-500">
            {charCount}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
}
