"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SessionGuard() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/auth")) return;

    const noPersist = localStorage.getItem("fitguide_no_persist");
    if (!noPersist) return; // "Remember me" was checked — do nothing

    const sessionActive = sessionStorage.getItem("fitguide_session");
    if (sessionActive) return; // same browser session, still valid

    // Browser was closed and reopened without "Remember me" — sign out
    const supabase = createClient();
    supabase.auth.signOut().then(() => {
      localStorage.removeItem("fitguide_no_persist");
      router.push("/auth/login");
    });
  }, [pathname, router]);

  return null;
}
