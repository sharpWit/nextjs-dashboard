"use client";

import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  AtSymbolIcon,
  KeyIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { Button } from "./button";
import { lusitana } from "@/app/ui/fonts";

const signInSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .max(50, "Email cannot exceed 50 characters")
    .trim(),
  password: z
    .string()
    .min(3, "Password must be at least 3 characters")
    .max(20, "Password cannot exceed 20 characters"),
});
type SignInSchemaType = z.infer<typeof signInSchema>;

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInSchemaType>({ resolver: zodResolver(signInSchema) });
  const router = useRouter();

  const handleAuthenticate = async (formData: SignInSchemaType) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        console.error("Error during login:", result.error);
      }
      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const onSubmit: SubmitHandler<SignInSchemaType> = (data) =>
    handleAuthenticate(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Please log in to continue.
        </h1>

        {/* Email Field */}
        <div>
          <label
            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
            htmlFor="email"
          >
            Email
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              placeholder="Enter your email address"
              className={`peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 ${
                errors.email ? "border-red-500" : ""
              }`}
              autoComplete="email"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
          {errors?.email && (
            <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="mt-4">
          <label
            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
            htmlFor="password"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className={`peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 ${
                errors.password ? "border-red-500" : ""
              }`}
              autoComplete="current-password"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
            <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
          {errors?.password && (
            <p className="mt-2 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button type="submit" className="mt-4 w-full">
          Log in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
      </div>
    </form>
  );
}
