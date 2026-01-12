import { Webhook } from "svix";
import { db } from "@/lib/prisma";

export async function POST(req) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("[Clerk Webhook] Missing CLERK_WEBHOOK_SECRET");
    return new Response("Webhook secret not configured", { status: 500 });
  }

  const svix_id = req.headers.get("svix-id");
  const svix_timestamp = req.headers.get("svix-timestamp");
  const svix_signature = req.headers.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const body = await req.text();

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("[Clerk Webhook] Verification failed:", err.message);
    return new Response("Unauthorized", { status: 401 });
  }

  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name } = evt.data;

    try {
      // Use upsert to avoid unique constraint violations if user was partially created
      await db.user.upsert({
        where: { clerkUserId: id },
        update: {
          email: email_addresses[0]?.email_address || "",
          name: `${first_name || ""} ${last_name || ""}`.trim() || "User",
        },
        create: {
          clerkUserId: id,
          email: email_addresses[0]?.email_address || "",
          name: `${first_name || ""} ${last_name || ""}`.trim() || "User",
        },
      });
      console.log(`[Clerk Webhook] User synced: ${id}`);
    } catch (error) {
      console.error("[Clerk Webhook] Error syncing user:", error.message);
      return new Response("Error syncing user", { status: 500 });
    }
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;

    try {
      await db.user.delete({
        where: { clerkUserId: id },
      });
      console.log(`[Clerk Webhook] User deleted: ${id}`);
    } catch (error) {
      console.error("[Clerk Webhook] Error deleting user:", error.message);
    }
  }

  return new Response("Webhook processed", { status: 200 });
}
