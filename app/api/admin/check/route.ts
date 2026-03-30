import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { createServerClient } from "@/lib/supabase";
import fs from 'fs';
import path from 'path';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

function logToDebugFile(message: string, data: any = {}) {
  try {
    const logPath = path.resolve(process.cwd(), 'admin_check_debug.log');
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}: ${JSON.stringify(data, null, 2)}\n`;
    fs.appendFileSync(logPath, logEntry);
  } catch (err) {
    console.error('Failed to write to debug file', err);
  }
}

export async function GET(request: NextRequest) {
  try {
    logToDebugFile('Starting Admin Check Request');

    const supabase = createServerClient();

    const authHeader = request.headers.get("authorization");
    logToDebugFile('Auth Header length', authHeader?.length || 0);

    if (!authHeader) {
      logToDebugFile('Missing auth header');
      return NextResponse.json({ isAdmin: false, error: "No auth header" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");

    // Verify user token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      logToDebugFile('Auth verification failed', authError);
      return NextResponse.json({ isAdmin: false, error: "Auth failed" }, { status: 401 });
    }

    // DIRECT DB QUERY DEBUGGING
    const { tryCreateAdminClient } = require('@/lib/supabase');
    const adminClient = tryCreateAdminClient();

    if (!adminClient) {
      logToDebugFile('FAILED TO CREATE ADMIN CLIENT', { reason: 'tryCreateAdminClient returned null' });
      return NextResponse.json({ isAdmin: false, error: "Details logged" }, { status: 500 });
    }

    const { data: dbUser, error: dbError } = await adminClient
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    logToDebugFile('Direct DB Query Result', { dbUser, dbError });

    const adminStatus = dbUser?.role === 'admin';

    return NextResponse.json({
      isAdmin: adminStatus,
      debug: {
        userId: user.id,
        email: user.email,
        dbResult: dbUser,
        dbError: dbError,
        calculatedAdminStatus: adminStatus
      }
    });
  } catch (error: any) {
    logToDebugFile("EXCEPTION checking admin status", error.message);
    console.error("Error checking admin status:", error);
    return NextResponse.json({ isAdmin: false, error: error.message }, { status: 500 });
  }
}
