"use client";
import Navbar from "../Navbar";
import { Suspense } from "react";
import ResetPasswordForm from './ResetPasswordForm';


export default function ResetPasswordPage() {
  
  return (

    <main className="min-h-screen relative flex flex-col font-sans">
      <Navbar />

      <Suspense fallback={<div>Loading...</div>}>
          <ResetPasswordForm/>
      </Suspense>
    </main>

  );
}
