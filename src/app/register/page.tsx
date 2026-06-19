"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Camera, Lock, Mail, User } from "lucide-react";
import toast from "react-hot-toast";
import { registerUser } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");
    const photoUrl = String(formData.get("photoUrl") || "").trim();
    const role = String(formData.get("role") || "user") as "user" | "librarian";

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await registerUser({
        name,
        email,
        password,
        confirmPassword,
        photoUrl,
        role,
      });

      if (!response?.user) {
        toast.error("Registration failed. Please try again.");
        return;
      }

      toast.success("Registration successful. Welcome to BiblioDrop.");
      router.push("/");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto grid min-h-[calc(100vh-180px)] max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
      <div className="glass-panel rounded-[2.5rem] p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-700">Create account</p>
        <h1 className="mt-4 max-w-lg text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">
          Register as a reader or a librarian.
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600">
          The form now talks to the Express registration route and supports the required role,
          email, password, and photo URL fields.
        </p>

        <div className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-5">
          <p className="text-sm font-semibold text-slate-950">Submission defaults</p>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Successful registration redirects to Home, and login will route users to the right
            dashboard based on the saved role.
          </p>
        </div>
      </div>

      <div className="glass-panel rounded-[2.5rem] p-8">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700">Full name</label>
              <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <User className="h-4 w-4 text-slate-400" />
                <input
                  name="name"
                  type="text"
                  placeholder="Your full name"
                  className="w-full bg-transparent text-sm outline-none"
                  autoComplete="name"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Role</label>
              <select
                name="role"
                defaultValue="user"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
              >
                <option value="user">User / Reader</option>
                <option value="librarian">Librarian</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Email</label>
            <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <Mail className="h-4 w-4 text-slate-400" />
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                className="w-full bg-transparent text-sm outline-none"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700">Password</label>
              <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <Lock className="h-4 w-4 text-slate-400" />
                <input
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  className="w-full bg-transparent text-sm outline-none"
                  autoComplete="new-password"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Confirm password</label>
              <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <Lock className="h-4 w-4 text-slate-400" />
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  className="w-full bg-transparent text-sm outline-none"
                  autoComplete="new-password"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-[1fr_auto]">
            <div>
              <label className="text-sm font-medium text-slate-700">Photo URL</label>
              <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <Camera className="h-4 w-4 text-slate-400" />
                <input
                  name="photoUrl"
                  type="url"
                  placeholder="https://..."
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>
            <label className="flex cursor-pointer items-center justify-center rounded-2xl border border-dashed border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700">
              Upload image
              <input type="file" className="hidden" />
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Register"}
          </button>

          <p className="text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-slate-950">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
