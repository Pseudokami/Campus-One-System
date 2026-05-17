import { cookies } from "next/headers";

const BE_URL = process.env.BE_URL ?? "http://localhost:4001";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const beRes = await fetch(`${BE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await beRes.json();
    if (!beRes.ok) return Response.json(data, { status: beRes.status });

    const cookieStore = await cookies();
    cookieStore.set("user_id", data.user.id, { httpOnly: true, path: "/", sameSite: "lax" });

    return Response.json(data);
  } catch {
    return Response.json({ message: "Could not reach the backend server." }, { status: 503 });
  }
}
