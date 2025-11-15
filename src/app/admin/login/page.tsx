"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid credentials");
      } else {
        router.push("/admin");
      }
    } catch (error) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-white mb-2 font-geist">
            Admin Login
          </h1>
          <p className="text-neutral-400 font-geist">
            Sign in to manage your portfolio
          </p>
        </div>

        <div className="bg-neutral-900/80 rounded-2xl border border-neutral-800 p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm font-geist">
                {error}
              </div>
            )}

            <div>
              <label className="block text-white font-semibold mb-2 font-geist">
                Email
              </label>
              <input
                type="email"
                value={credentials.email}
                onChange={(e) =>
                  setCredentials({ ...credentials, email: e.target.value })
                }
                className="w-full bg-neutral-800 text-white px-4 py-3 rounded-lg border border-neutral-700 focus:border-white transition font-geist"
                placeholder="Enter email"
                required
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2 font-geist">
                Password
              </label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                className="w-full bg-neutral-800 text-white px-4 py-3 rounded-lg border border-neutral-700 focus:border-white transition font-geist"
                placeholder="Enter password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-neutral-100 transition font-geist disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 p-4 bg-neutral-800/50 rounded-lg">
            <p className="text-neutral-400 text-sm font-geist mb-2">
              Default credentials:
            </p>
            <p className="text-neutral-300 text-sm font-geist">
              Email: <code className="bg-neutral-700 px-2 py-1 rounded">admin@example.com</code>
            </p>
            <p className="text-neutral-300 text-sm font-geist">
              Password: <code className="bg-neutral-700 px-2 py-1 rounded">admin123</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
