"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { completeLogin } from "@/providers/convex-client-provider";

export default function AuthCallbackPage() {
  const router = useRouter();
  const callbackStarted = useRef(false);

  useEffect(() => {
    if (callbackStarted.current) return;
    callbackStarted.current = true;
    void completeLogin().then(() => router.replace("/")).catch((error: unknown) => {
      console.error("Login callback failed", error);
    });
  }, [router]);

  return <main className="p-8 text-center">Completing sign in…</main>;
}
