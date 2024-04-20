import { useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { getPost } from "~/models/post.server";
import { json } from "@remix-run/node";
import { marked } from "marked";

export const loader = async ({ params }: LoaderArgs) => {
  const { slug } = params;
  if (!slug) throw new Error("Missing slug");

  const post = await getPost(slug);
  if (!post) throw new Error("Post not found");

  const html = marked(post.markdown);

  return json({ title: post.title, html });
};

export default function PostRoute() {
  const { title, html } = useLoaderData<typeof loader>();

  return (
    <main className="mx-auto max-w-4xl">
      <h1 className="my-6 border-b-2 text-center text-3xl">{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}
