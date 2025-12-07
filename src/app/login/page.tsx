'use client'
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { saveToken } from '@/lib/auth';
import { API_BASE } from '@/lib/config';
import { Input } from '@/components/ui/input'; // Make sure Input is imported
import { Card, CardContent } from '@/components/ui/card'; // Optional wrapper if needed

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const [fieldErrors, setFieldErrors] = useState({ username: '', password: '' });

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError('');
    setFieldErrors({ username: '', password: '' });

    const newErrors: any = {};
    if (!username.trim()) newErrors.username = "Please fill in this field";
    if (!password.trim()) newErrors.password = "Please fill in this field";

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      return;
    }

    try {
      setLoading(true); // Start loading
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Invalid username or password');
        return;
      }

      // Save token and username
      saveToken(data.accessToken);
      localStorage.setItem('username', username);

      // Navigate to dashboard
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false); // Stop loading
    }
  }

  return (
    <div className="flex justify-center items-center h-screen w-full 
      bg-gradient-to-br from-red-700 to-black p-4">

      <div className="bg-white/10 backdrop-blur-md border border-red-600 
        rounded-3xl p-10 w-full max-w-md shadow-2xl">

        <h1 className="text-white text-4xl text-center font-extrabold mb-8">
          Login
        </h1>

        <form onSubmit={handleLogin} className="space-y-6">

          {error && (
            <p className="text-red-400 text-center font-semibold">{error}</p>
          )}

          {/* USERNAME FIELD */}
          <div>
            <Input
              className="bg-zinc-800 text-white border-red-600 focus:border-red-500"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {fieldErrors.username && (
              <p className="text-red-400 text-sm mt-1">
                {fieldErrors.username}
              </p>
            )}
          </div>

          {/* PASSWORD FIELD */}
          <div>
            <Input
              type="password"
              className="bg-zinc-800 text-white border-red-600 focus:border-red-500"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {fieldErrors.password && (
              <p className="text-red-400 text-sm mt-1">
                {fieldErrors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-black text-white rounded-2xl text-lg 
            font-semibold hover:bg-zinc-900 transition disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center text-sm text-gray-300 mt-2">
            Don’t have an account yet?{" "}
            <span
              onClick={() => router.push('/register')}
              className="text-red-500 font-semibold hover:underline cursor-pointer"
            >
              Register
            </span>
          </p>

        </form>
      </div>
    </div>
  );
}
