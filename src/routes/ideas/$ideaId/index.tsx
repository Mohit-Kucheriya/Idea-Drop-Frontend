import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  useSuspenseQuery,
  queryOptions,
  useMutation,
} from "@tanstack/react-query";
import { TiArrowBackOutline } from "react-icons/ti";
import { deleteIdea, fetchIdeaDetail } from "@/api/ideas";
import { useAuth } from "@/context/AuthContext";

const ideaQueryOptions = (ideaId: string) =>
  queryOptions({
    queryKey: ["idea", ideaId],
    queryFn: async () => await fetchIdeaDetail(ideaId),
  });

export const Route = createFileRoute("/ideas/$ideaId/")({
  component: IdeaDetailPage,
  loader: async ({ params, context: { queryClient } }) => {
    return queryClient.ensureQueryData(ideaQueryOptions(params.ideaId));
  },
});

function IdeaDetailPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { ideaId } = Route.useParams();
  const { data: idea } = useSuspenseQuery(ideaQueryOptions(ideaId));

  // TO DELETE IDEA
  const { mutateAsync: deleteMutate, isPending } = useMutation({
    mutationFn: () => deleteIdea(ideaId),
    onSuccess: () =>
      navigate({
        to: "/ideas",
      }),
  });

  function handleDelete() {
    deleteMutate();
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-lg">
      <Link
        to="/ideas"
        className="mb-4 flex items-center gap-2 font-medium text-blue-600"
      >
        <TiArrowBackOutline className="text-lg" /> Back to ideas
      </Link>
      <h2 className="mb-2 text-xl font-semibold">{idea?.title}</h2>
      <p className="text-sm font-medium text-gray-600">{idea?.description}</p>

      {user && user.id === idea.user && (
        <div className="mt-6 flex items-center gap-3">
          <Link
            to="/ideas/$ideaId/edit"
            params={{ ideaId: idea._id }}
            className="inline-block rounded-lg bg-yellow-500 px-4 py-2 text-sm text-white transition hover:bg-yellow-600"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-sm text-white transition hover:bg-red-700"
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete Idea"}
          </button>
        </div>
      )}
    </div>
  );
}
