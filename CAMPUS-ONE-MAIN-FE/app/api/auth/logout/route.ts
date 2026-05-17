import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("user_id");
  return Response.json({ message: "Logged out." });
}
