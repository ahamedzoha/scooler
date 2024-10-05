import { cn } from "@/lib/cn.util";
import { FieldError } from "react-hook-form";

type InputFieldProps = {
  label: string;
  type?: string;
  register: any;
  name: string;
  defaultValue?: string;
  error?: FieldError;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  className?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
};

const InputField = ({
  label,
  type = "text",
  register,
  name,
  defaultValue,
  error,
  inputProps,
  className, // For the entire component
  containerClassName, // For the container div
  labelClassName, // For the label
  inputClassName, // For the input
  errorClassName, // For the error message
}: InputFieldProps) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 w-full md:w-1/4",
        containerClassName,
        className
      )}
    >
      <label className={cn("text-xs text-gray-500", labelClassName)}>
        {label}
      </label>
      <input
        type={type}
        {...register(name)}
        className={cn(
          "ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full",
          "focus:outline-none focus:ring-2 focus:ring-blue-500",
          "transition-all duration-200",
          error && "ring-red-400",
          inputClassName
        )}
        {...inputProps}
        defaultValue={defaultValue}
      />
      {error?.message && (
        <p className={cn("text-xs text-red-400", errorClassName)}>
          {error.message.toString()}
        </p>
      )}
    </div>
  );
};

export default InputField;
