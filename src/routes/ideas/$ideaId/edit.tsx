import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import {
  useSuspenseQuery,
  useMutation,
  queryOptions,
} from "@tanstack/react-query";
import { fetchIdeaDetail, updateIdea } from "@/api/ideas";
import { useState } from "react";
import { TiArrowBackOutline } from "react-icons/ti";

export const Route = createFileRoute("/ideas/$ideaId/edit")({
  component: EditIdeaPage,
  loader: async ({ params, context: { queryClient } }) => {
    return queryClient.ensureQueryData(ideaQueryOptions(params.ideaId));
  },
});

const ideaQueryOptions = (ideaId: string) =>
  queryOptions({
    queryKey: ["idea", ideaId],
    queryFn: () => fetchIdeaDetail(ideaId),
  });

function EditIdeaPage() {
  const navigate = useNavigate();

  const { ideaId } = Route.useParams();
  const { data: idea } = useSuspenseQuery(ideaQueryOptions(ideaId));

  const [title, setTitle] = useState(idea?.title);
  const [summary, setSummary] = useState(idea?.summary);
  const [description, setDescription] = useState(idea?.description);
  const [tagInput, setTagInput] = useState(idea?.tags.join(", "));

  // TO UPDATE IDEA
  const { mutateAsync: updateMutate, isPending } = useMutation({
    mutationFn: () =>
      updateIdea(ideaId, {
        title,
        summary,
        description,
        tags: tagInput
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag !== ""),
      }),
    onSuccess: () =>
      navigate({
        to: "/ideas/$ideaId",
        params: { ideaId },
      }),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateMutate();
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4 rounded-lg bg-white p-6 text-gray-800 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Edit Idea</h2>
        <Link
          to="/ideas/$ideaId"
          params={{ ideaId: ideaId }}
          className="flex items-center gap-2 font-medium text-blue-600"
        >
          <TiArrowBackOutline className="text-lg" /> Back to idea
        </Link>
      </div>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="title"
            className="mb-1 block text-base font-medium text-gray-600 uppercase"
          >
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="Enter idea title"
            className="w-full rounded-lg border border-gray-300 p-2 font-medium placeholder:text-sm focus:ring-1 focus:ring-gray-600 focus:ring-offset-1 focus:outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label
            htmlFor="summary"
            className="mb-1 block text-base font-medium text-gray-600 uppercase"
          >
            Summary
          </label>
          <input
            id="summary"
            name="summary"
            type="text"
            placeholder="Enter idea summary"
            className="w-full rounded-lg border border-gray-300 p-2 font-medium placeholder:text-sm focus:ring-1 focus:ring-gray-600 focus:ring-offset-1 focus:outline-none"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-1 block text-base font-medium text-gray-600 uppercase"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Write out the description of your idea"
            className="w-full resize-none rounded-lg border border-gray-300 p-2 font-medium placeholder:text-sm focus:ring-1 focus:ring-gray-600 focus:ring-offset-1 focus:outline-none"
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div>
          <label
            htmlFor="tags"
            className="mb-1 block text-base font-medium text-gray-600 uppercase"
          >
            Tags
          </label>
          <input
            id="tags"
            name="tags"
            type="text"
            placeholder="optional tags, comma separated"
            className="w-full rounded-lg border border-gray-300 p-2 font-medium placeholder:text-sm focus:ring-1 focus:ring-gray-600 focus:ring-offset-1 focus:outline-none"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
          />
        </div>

        <div className="">
          <button
            type="submit"
            className="mt-4 w-full cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
            disabled={isPending}
          >
            {isPending ? "Updating..." : "Update Idea"}
          </button>
        </div>
      </form>
    </div>
  );
}
