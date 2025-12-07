'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getToken, logOutUser } from "@/lib/auth";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/login");
      return;
    }

    const stored = localStorage.getItem("username") ?? "";
    setUsername(stored);
    setChecked(true);
  }, [router]);

  function logout() {
    logOutUser();
    localStorage.removeItem("username");
    router.replace("/login");
  }

  if (!checked) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* TOP HEADER */}
      <header className="flex justify-between items-center px-8 py-4 bg-white shadow">
        <h1 className="text-2xl font-bold text-red-600">
          Hello {username}!, Welcome to my NextJs and NestJs Authentication
        </h1>

        <Button
          onClick={logout}
          className="bg-black text-white rounded-full px-6 py-2 hover:bg-zinc-900"
        >
          Logout
        </Button>
      </header>

      {children}
    </div>
  );
}
