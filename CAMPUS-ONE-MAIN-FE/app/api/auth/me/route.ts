import { cookies } from "next/headers";
import { readDb } from "@/lib/backend/store";

export async function GET() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;
  if (!userId) return Response.json({}, { status: 401 });

  const db = await readDb();
  const user = db.users.find((u) => u.id === userId);
  if (!user) return Response.json({}, { status: 404 });

  return Response.json({ id: user.id, email: user.email });
}
