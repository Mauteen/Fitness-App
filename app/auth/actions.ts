"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signIn(formData: FormData) {
  try {
    const supabase = await createClient();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return { error: error.message };
    }

    redirect("/");
  } catch (err: unknown) {
    // re-throw redirect (it's not a real error)
    if (err instanceof Error && err.message === "NEXT_REDIRECT") throw err;
    const msg = err instanceof Error ? err.message : "Sign in failed. Please try again.";
    return { error: msg };
  }
}

export async function signUp(formData: FormData) {
  try {
    const supabase = await createClient();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `https://fitguide-delta.vercel.app/auth/callback`,
      },
    });

    if (error) {
      return { error: error.message };
    }

    return { success: "Check your email to confirm your account." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Sign up failed. Please try again.";
    return { error: msg };
  }
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/auth/login");
}
