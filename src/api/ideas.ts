import api from "@/lib/axios";
import type { Idea } from "@/types";

export async function fetchIdeas(limit?: number): Promise<Idea[]> {
  const res = await api.get("/ideas", {
    params: limit ? { _limit: limit } : {},
  });
  return res.data;
}

export async function fetchIdeaDetail(ideaId: string): Promise<Idea> {
  const res = await api.get(`/ideas/${ideaId}`);
  return res.data;
}

export async function createIdea(newIdea: {
  title: string;
  summary: string;
  description: string;
  tags: string[];
}): Promise<Idea> {
  const res = await api.post("/ideas", {
    ...newIdea,
    createdAt: new Date().toISOString(),
  });
  return res.data;
}

export async function deleteIdea(ideaId: string): Promise<void> {
  await api.delete(`/ideas/${ideaId}`);
}

export async function updateIdea(
  ideaId: string,
  updatedIdea: {
    title: string;
    summary: string;
    description: string;
    tags: string[];
  },
): Promise<Idea> {
  const res = await api.put(`/ideas/${ideaId}`, updatedIdea);
  return res.data;
}
