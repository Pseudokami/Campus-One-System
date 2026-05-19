import { cookies } from "next/headers";
import { readDb } from "@/lib/backend/store";

export async function GET() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;
  const userEmail = cookieStore.get("user_email")?.value;
  if (!userId) return Response.json({}, { status: 401 });

  return Response.json({ id: userId, email: userEmail || "" });
}
