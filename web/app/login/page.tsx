import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-8 py-16">
      <div className="w-full max-w-[380px]">
        <div className="font-heading font-extrabold text-lg mb-8">
          RAVANA<span style={{ color: "var(--color-accent)" }}>GEMS</span>
        </div>
        <h1 className="mb-6 text-[28px]">Sign in</h1>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
