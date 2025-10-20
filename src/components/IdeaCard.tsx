import type { Idea } from "@/types";
import { Link } from "@tanstack/react-router";
import { TiArrowForwardOutline } from "react-icons/ti";

export default function IdeaCard({
  idea,
  label,
}: {
  idea: Idea;
  label?: string;
}) {
  return (
    <div
      key={idea._id}
      className="flex flex-col justify-between gap-2 rounded-lg bg-white p-4 shadow-lg"
    >
      <div>
        <h2 className="mb-1 text-lg font-semibold">{idea.title}</h2>
        <p className="text-sm font-medium text-gray-600">{idea.summary}</p>
      </div>

      <Link
        to="/ideas/$ideaId"
        params={{ ideaId: idea._id.toString() }}
        className="mt-3 flex items-center gap-2 font-medium text-blue-600"
      >
        {label}
        <TiArrowForwardOutline className="text-lg" />
      </Link>
    </div>
  );
}
