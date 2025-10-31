/// <reference lib="deno.ns" />
import { createClient } from "jsr:@supabase/supabase-js@2.58.0";

// Helper to parse JWT and extract sub (user id)
function parseJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

Deno.serve(async (req: Request) => {
  const supabaseClient = createClient(
    Deno.env.get("EXPO_PUBLIC_SUPABASE_URL")!,
    Deno.env.get("SERVICE_ROLE_KEY")!
  );

  // 1. Get and validate Authorization header
  const authHeader =
    req.headers.get("authorization") || req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response(
      JSON.stringify({ error: "Missing or invalid authorization header" }),
      { status: 401 }
    );
  }
  const token = authHeader.replace("Bearer ", "");

  // 2. Parse JWT to get user id
  const payload = parseJwt(token);
  const user_id = payload?.sub;
  if (!user_id) {
    return new Response(JSON.stringify({ error: "Invalid access token" }), {
      status: 401,
    });
  }

  // 3. Optionally, you can verify the JWT (signature, exp) with Supabase if needed

  // 4. Delete the user
  const { error } = await supabaseClient.auth.admin.deleteUser(user_id);
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
});
