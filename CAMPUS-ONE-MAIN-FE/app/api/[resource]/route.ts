import { createResource, isResourceName, listResource } from "@/lib/backend/store";

export async function GET(request: Request, context: RouteContext<"/api/[resource]">) {
  const { resource } = await context.params;

  if (!isResourceName(resource)) {
    return Response.json({ message: "Unknown resource" }, { status: 404 });
  }

  const url = new URL(request.url);
  const search = url.searchParams.get("search") ?? undefined;

  return Response.json(await listResource(resource, search));
}

export async function POST(request: Request, context: RouteContext<"/api/[resource]">) {
  const { resource } = await context.params;

  if (!isResourceName(resource)) {
    return Response.json({ message: "Unknown resource" }, { status: 404 });
  }

  const payload = await request.json();

  return Response.json(await createResource(resource, payload), { status: 201 });
}
