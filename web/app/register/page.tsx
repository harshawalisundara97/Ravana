import { RegisterForm } from "./RegisterForm";

export default function RegisterPage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-8 py-16">
      <div className="w-full max-w-[380px]">
        <div className="font-heading font-extrabold text-lg mb-8">
          RAVANA<span style={{ color: "var(--color-accent)" }}>GEMS</span>
        </div>
        <h1 className="mb-6 text-[28px]">Create your account</h1>
        <RegisterForm />
      </div>
    </main>
  );
}
