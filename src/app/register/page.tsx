"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ChangeEvent } from "react";
import { Lock, Mail, User } from "lucide-react";
import toast from "react-hot-toast";
import { registerUser, startGoogleSignIn, uploadImage } from "@/lib/api";
import type { AppRole } from "@/lib/auth-user";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");
    const role = String(formData.get("role") || "user") as AppRole;

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

  async function handlePhotoUpload(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    setUploadingPhoto(true);
    try {
      const url = await uploadImage(file);
      if (!url) {
        toast.error("Image upload failed. Please try again.");
        return;
      }

      setPhotoUrl(url);
      toast.success("Profile image uploaded.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Image upload failed.");
    } finally {
      setUploadingPhoto(false);
      input.value = "";
    }
  }

  async function handleGoogleSignIn() {
    setGoogleLoading(true);

    try {
      const callbackURL = `${window.location.origin}/`;
      const response = await startGoogleSignIn(callbackURL);

      if (!response?.url) {
        toast.error("Google sign-in is not configured yet.");
        return;
      }

      window.location.assign(response.url);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Google sign-in failed.");
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <div className="mx-auto grid min-h-[calc(100vh-180px)] max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
      <div className="glass-panel rounded-[2.5rem] p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-700">Create account</p>
        <h1 className="mt-4 max-w-lg text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">
          Register as a reader or a librarian.
        </h1>
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

          <div>
            <p className="text-sm font-medium text-slate-700">Profile image</p>
            <label className="mt-2 flex w-full cursor-pointer items-center justify-center rounded-2xl border border-dashed border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 sm:w-auto">
              {uploadingPhoto ? "Uploading..." : "Upload image"}
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Register"}
          </button>

          <div className="relative py-2 text-center text-sm text-slate-400">
            <span className="relative z-10 bg-white px-3">or continue with</span>
            <div className="absolute left-0 top-1/2 h-px w-full bg-slate-200" />
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {googleLoading ? "Opening Google..." : "Continue with Google"}
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
