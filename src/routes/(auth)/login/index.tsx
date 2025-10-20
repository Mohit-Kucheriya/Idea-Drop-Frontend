import { loginUser } from "@/api/auth";
import { useAuth } from "@/context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/(auth)/login/")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();

  const { setAccessToken, setUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { mutateAsync, isPending } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      setUser(data.user);
      navigate({
        to: "/ideas",
      });
    },
    onError: (err: any) => {
      setError(err.message);
    },
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await mutateAsync({
        email,
        password,
      });
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Login</h2>
      </div>
      {error && (
        <div className="mb-4 rounded-lg bg-red-100 px-3 py-2 text-center text-red-500">
          <p className="text-sm">{error}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            autoCorrect="off"
            className="w-full rounded-lg border border-gray-300 p-2 font-medium placeholder:text-sm focus:ring-1 focus:ring-gray-600 focus:ring-offset-1 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            autoCorrect="off"
            className="w-full rounded-lg border border-gray-300 p-2 font-medium placeholder:text-sm focus:ring-1 focus:ring-gray-600 focus:ring-offset-1 focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="">
          <button
            type="submit"
            className="mt-4 w-full cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isPending}
          >
            {isPending ? "Logging in..." : "Login"}
          </button>
          <p className="mt-3 text-center text-sm font-medium text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
