import { logoutUser } from "@/api/auth";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "@tanstack/react-router";
import { Lightbulb } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

const Header = () => {
  const { user, setAccessToken, setUser } = useAuth();
  const navigate = useNavigate();

  const { mutateAsync } = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      setAccessToken(null);
      setUser(null);
      navigate({
        to: "/",
      });
    },
  });

  async function handleLogout() {
    try {
      await mutateAsync();
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <header className="sticky top-0 w-full bg-white shadow">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-2 text-gray-800">
          <Link
            to="/"
            className="flex items-center space-x-2 text-gray-800 focus:outline-none active:outline-none"
          >
            <Lightbulb className="h-6 w-6 text-yellow-500" />
            <h1 className="text-2xl font-semibold">IdeaDrop</h1>
          </Link>
        </div>

        <nav className="flex items-center space-x-4">
          <Link
            to="/ideas"
            className="rounded-lg bg-gray-600 px-4 py-2 text-sm text-white transition hover:bg-gray-700"
          >
            Ideas
          </Link>
          {user && (
            <Link
              to="/ideas/new"
              className="rounded-lg bg-gray-700 px-4 py-2 text-sm text-white"
            >
              + New Idea
            </Link>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          {!user ? (
            <>
              <Link
                to="/login"
                className="rounded-lg border border-blue-500 px-4 py-2 text-sm font-medium text-blue-600"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <p className="hidden font-medium sm:block">
                Welcome, <span className="text-gray-700"> {user.name}</span>
              </p>
              <button
                onClick={handleLogout}
                className="cursor-pointer px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 focus:outline-none"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
