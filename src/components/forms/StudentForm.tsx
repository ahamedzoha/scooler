"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import Image from "next/image";
import { cn } from "@/lib/cn.util";

// Define the base student type
type Student = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  bloodType: string;
  birthday: Date;
  sex: "male" | "female";
  img?: File;
};

// Define the schema
const studentSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  email: z.string().email({ message: "Invalid email address!" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .optional()
    .or(z.literal("")), // Make password optional for updates
  firstName: z.string().min(1, { message: "First name is required!" }),
  lastName: z.string().min(1, { message: "Last name is required!" }),
  phone: z.string().min(1, { message: "Phone is required!" }),
  address: z.string().min(1, { message: "Address is required!" }),
  bloodType: z.string().min(1, { message: "Blood Type is required!" }),
  birthday: z.coerce.date({ required_error: "Birthday is required!" }), // Use coerce for proper date handling
  sex: z.enum(["male", "female"], {
    required_error: "Sex is required!",
    invalid_type_error: "Sex must be either male or female",
  }),
  img: z
    .instanceof(File, { message: "Image is required" })
    .optional()
    .or(z.literal("")), // Make image optional for updates
});

// Infer the form input type from the schema
type StudentFormInputs = z.infer<typeof studentSchema>;

// Define props type for the component
interface StudentFormProps {
  type: "create" | "update";
  data?: Partial<Student>;
  onSubmit?: (data: StudentFormInputs) => Promise<void> | void;
  className?: string;
}

const StudentForm = ({ type, data, onSubmit, className }: StudentFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<StudentFormInputs>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      username: data?.username || "",
      email: data?.email || "",
      firstName: data?.firstName || "",
      lastName: data?.lastName || "",
      phone: data?.phone || "",
      address: data?.address || "",
      bloodType: data?.bloodType || "",
      birthday: data?.birthday,
      sex: data?.sex || "male",
    },
  });

  const handleFormSubmit = async (formData: StudentFormInputs) => {
    try {
      await onSubmit?.(formData);
    } catch (error) {
      console.error(error);
      setError("root", {
        type: "submit",
        message: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-8", className)}
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new student" : "Update student"}
      </h1>

      <div className="space-y-8">
        <section>
          <span className="text-xs text-gray-400 font-medium">
            Authentication Information
          </span>
          <div className="mt-4 flex flex-wrap gap-4">
            <InputField
              label="Username"
              name="username"
              register={register}
              error={errors.username}
              className="w-full md:w-[calc(33%-16px)]"
            />
            <InputField
              label="Email"
              name="email"
              type="email"
              register={register}
              error={errors.email}
              className="w-full md:w-[calc(33%-16px)]"
            />
            {type === "create" && (
              <InputField
                label="Password"
                name="password"
                type="password"
                register={register}
                error={errors.password}
                className="w-full md:w-[calc(33%-16px)]"
              />
            )}
          </div>
        </section>

        <section>
          <span className="text-xs text-gray-400 font-medium">
            Personal Information
          </span>
          <div className="mt-4 flex flex-wrap gap-4">
            <InputField
              label="First Name"
              name="firstName"
              register={register}
              error={errors.firstName}
              className="w-full md:w-[calc(33%-16px)]"
            />
            <InputField
              label="Last Name"
              name="lastName"
              register={register}
              error={errors.lastName}
              className="w-full md:w-[calc(33%-16px)]"
            />
            <InputField
              label="Phone"
              name="phone"
              register={register}
              error={errors.phone}
              className="w-full md:w-[calc(33%-16px)]"
            />
            <InputField
              label="Address"
              name="address"
              register={register}
              error={errors.address}
              className="w-full md:w-[calc(33%-16px)]"
            />
            <InputField
              label="Blood Type"
              name="bloodType"
              register={register}
              error={errors.bloodType}
              className="w-full md:w-[calc(33%-16px)]"
            />
            <InputField
              label="Birthday"
              name="birthday"
              type="date"
              register={register}
              error={errors.birthday}
              className="w-full md:w-[calc(33%-16px)]"
            />

            <div className="flex flex-col gap-2 w-full md:w-[calc(33%-16px)]">
              <label className="text-xs text-gray-500">Sex</label>
              <select
                className={cn(
                  "ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500",
                  errors.sex && "ring-red-400"
                )}
                {...register("sex")}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              {errors.sex?.message && (
                <p className="text-xs text-red-400">{errors.sex.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2 w-full md:w-[calc(33%-16px)] justify-center">
              <label
                className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
                htmlFor="img"
              >
                <Image src="/upload.png" alt="" width={28} height={28} />
                <span>Upload a photo {type === "update" && "(optional)"}</span>
              </label>
              <input
                type="file"
                id="img"
                {...register("img")}
                className="hidden"
                accept="image/*"
              />
              {errors.img?.message && (
                <p className="text-xs text-red-400">{errors.img.message}</p>
              )}
            </div>
          </div>
        </section>
      </div>

      {errors.root && (
        <p className="text-sm text-red-500">{errors.root.message}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          "bg-blue-400 text-white p-2 rounded-md",
          "hover:bg-blue-500 transition-colors",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        {isSubmitting
          ? "Processing..."
          : type === "create"
            ? "Create Student"
            : "Update Student"}
      </button>
    </form>
  );
};

export default StudentForm;
