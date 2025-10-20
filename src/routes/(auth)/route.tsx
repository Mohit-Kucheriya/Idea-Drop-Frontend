import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Lightbulb } from "lucide-react";

export const Route = createFileRoute("/(auth)")({
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <div className="flex flex-col items-start justify-between gap-10 p-6 md:flex-row">
      <div className="flex flex-col items-start gap-4">
        <Lightbulb className="h-16 w-16 text-yellow-400" />
        <h1 className="text-4xl font-bold text-gray-800">
          Welcome to IdeaDrop
        </h1>
        <p className="max-w-xs font-medium text-gray-600">
          Share, explore, and build on the best startup ideas and side hustles.
        </p>
      </div>

      <section className="flex-1 rounded-lg bg-white p-6 text-gray-700 shadow-lg">
        <Outlet />
      </section>
    </div>
  );
}
