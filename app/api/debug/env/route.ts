import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

    return NextResponse.json({
        serviceKeyStatus: serviceKey ? `Present (${serviceKey.substring(0, 10)}...)` : 'Missing',
        anonKeyStatus: anonKey ? `Present (${anonKey.substring(0, 10)}...)` : 'Missing',
        urlStatus: url ? `Present (${url})` : 'Missing',
        nodeEnv: process.env.NODE_ENV,
    });
}
