import { createFileRoute } from "@tanstack/react-router";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createIdea } from "@/api/ideas";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/ideas/new/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: createIdea,
    onSuccess: () => {
      navigate({
        to: "/ideas",
      });
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedSummary = summary.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle || !trimmedSummary || !trimmedDescription) return;

    try {
      mutate({
        title: trimmedTitle,
        summary: trimmedSummary,
        description: trimmedDescription,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag !== ""),
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4 rounded-lg bg-white p-6 text-gray-800 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Create New Idea</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
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
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        <div className="">
          <button
            type="submit"
            className="mt-4 w-full cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
            disabled={isPending}
          >
            {isPending ? "Creating..." : "Create Idea"}
          </button>
        </div>
      </form>
    </div>
  );
}
