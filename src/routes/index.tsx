import { createFileRoute, Link } from "@tanstack/react-router";
import { Lightbulb } from "lucide-react";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { fetchIdeas } from "@/api/ideas";
import IdeaCard from "@/components/IdeaCard";

const ideasQueryOptions = () =>
  queryOptions({
    queryKey: ["ideas", { limit: 3 }],
    queryFn: () => fetchIdeas(3),
  });

export const Route = createFileRoute("/")({
  component: App,
  loader: async ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(ideasQueryOptions());
  },
});

function App() {
  const { data: ideas } = useSuspenseQuery(ideasQueryOptions());

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

      <section className="flex-1">
        <h2 className="mb-4 text-2xl font-semibold text-gray-800">
          Latest Ideas
        </h2>
        <div className="space-y-6">
          {ideas.map((idea) => (
            <IdeaCard key={idea._id} idea={idea} label="Read more" />
          ))}
        </div>

        <div className="mt-6">
          <Link
            to="/ideas"
            className="inline-block w-full rounded-lg bg-gray-600 px-4 py-2 text-center text-sm text-white transition hover:bg-gray-700"
          >
            View All Ideas
          </Link>
        </div>
      </section>
    </div>
  );
}
