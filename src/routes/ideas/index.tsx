import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { fetchIdeas } from "@/api/ideas";
import IdeaCard from "@/components/IdeaCard";

const ideasQueryOptions = () =>
  queryOptions({
    queryKey: ["ideas"],
    queryFn: () => fetchIdeas(),
  });

export const Route = createFileRoute("/ideas/")({
  component: IdeasPage,
  loader: async ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(ideasQueryOptions());
  },
});

function IdeasPage() {
  const { data: ideas } = useSuspenseQuery(ideasQueryOptions());

  return (
    <div className="">
      <h2 className="mb-4 text-2xl font-semibold">Ideas</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {ideas?.map((idea) => (
          <IdeaCard key={idea._id} idea={idea} label="View Idea" />
        ))}
      </div>
    </div>
  );
}
