'use client'

import FurParentForm from "@/components/FurParentForm";
import { useState } from "react";

export default function Home() {
  const [parentProfile, setParentProfile] = useState()


  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-lg p-4">
        <FurParentForm />
      </div>
    </main>
  );
}
