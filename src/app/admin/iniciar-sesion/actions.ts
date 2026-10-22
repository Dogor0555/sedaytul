"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";

export async function login(formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/admin",
    });
  } catch (error) {
    if (error instanceof AuthError) return;
    throw error;
  }
}
