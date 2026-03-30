import { createServerClient, tryCreateAdminClient } from "@/lib/supabase";

/**
 * Check if a user is an admin
 * Uses admin client to bypass RLS and prevent infinite recursion
 * @param userId - The user ID to check
 * @returns Promise<boolean> - True if user is admin, false otherwise
 */
export async function isAdmin(userId: string): Promise<boolean> {
  try {
    // Use admin client to bypass RLS and prevent infinite recursion
    const adminSupabase = tryCreateAdminClient();

    if (!adminSupabase) {
      console.error("ADMIN CHECK ERROR: Could not create admin client. Check SUPABASE_SERVICE_ROLE_KEY.");
      return false;
    }

    // STRICT MODE: Do NOT fallback to createServerClient() because RLS will block access.
    const supabase = adminSupabase;

    // Debug logging
    console.log(`Checking admin status for user: ${userId}`);
    const adminClientCreated = !!adminSupabase;
    console.log(`Admin client created: ${adminClientCreated}`);

    const { data: user, error } = await supabase
      .from("users")
      .select("role")
      .eq("id", userId)
      .single();

    console.log(`Admin check result:`, { user, error });

    if (error || !user) {
      console.log('Admin check failed: User not found or error');
      return false;
    }

    const isUserAdmin = user.role === "admin";
    console.log(`User role: ${user.role}, Is Admin: ${isUserAdmin}`);
    return isUserAdmin;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

/**
 * Get admin user ID from request headers
 * @param request - Next.js request object
 * @returns Promise<string | null> - Admin user ID or null if not admin
 */
export async function getAdminUserId(request: Request): Promise<string | null> {
  try {
    const supabase = createServerClient();

    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return null;
    }

    const token = authHeader.replace("Bearer ", "");

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return null;
    }

    const adminStatus = await isAdmin(user.id);
    return adminStatus ? user.id : null;
  } catch (error) {
    console.error("Error getting admin user ID:", error);
    return null;
  }
}

