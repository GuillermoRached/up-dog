'use client'

import FurParentForm from "@/components/FurParentForm";

export default function Home() {
  return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-lg p-4">
          <FurParentForm />
        </div>
      </main>
  );
}
