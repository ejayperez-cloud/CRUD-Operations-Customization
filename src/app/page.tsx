'use client'

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function IntroPage() {
  const router = useRouter();

  return (
    <div className="flex justify-center items-center h-screen p-6 bg-gradient-to-br from-red-700 via-red-800 to-gray-900">
      <div className="w-full max-w-md p-8 rounded-xl bg-red-900/70 border border-red-600 text-center shadow-lg">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-white">
          Welcome to my Next.js and NestJS Authentication
        </h1>

        <p className="text-gray-200 mb-8 text-lg">
          Click Enter!
        </p>

        <Button
          onClick={() => router.push("/login")}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg
                     transition transform duration-300 hover:scale-105 ring-2 ring-red-500 hover:ring-4 hover:ring-red-600 shadow-md hover:shadow-lg"
        >
          Enter
        </Button>
      </div>
    </div>
  );
}
