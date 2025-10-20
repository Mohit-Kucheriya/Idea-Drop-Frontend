import {
  HeadContent,
  Link,
  Outlet,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanstackDevtools } from "@tanstack/react-devtools";
import { QueryClient } from "@tanstack/react-query";
import Header from "@/components/Header";

type RouterContext = {
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      {
        name: "description",
        content:
          "Idea Drop is a platform where you can create and share your ideas with your team. It is a place where you can get feedback and support from your peers. You can also get inspired by other people's ideas and get inspired to create your own ideas.",
      },
      {
        title: "IdeaDrop - Create and Share your Ideas",
      },
    ],
  }),
  component: RootLayout,
  notFoundComponent: NotFoundPage,
});

function RootLayout() {
  return (
    <div className="flrx min-h-screen flex-col bg-gray-200">
      <HeadContent />
      <Header />
      <main className="flex justify-center p-6">
        <div className="w-full max-w-5xl rounded-lg p-8">
          <Outlet />
        </div>
      </main>
      <TanstackDevtools
        config={{
          position: "bottom-left",
        }}
        plugins={[
          {
            name: "Tanstack Router",
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="mb-2 text-4xl font-bold">404</h1>
      <p className="mb-8 font-medium text-gray-600">
        Oops! The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="rounded-lg bg-gray-600 px-4 py-2 text-sm text-white transition hover:bg-gray-700"
      >
        Back to home
      </Link>
    </div>
  );
}
