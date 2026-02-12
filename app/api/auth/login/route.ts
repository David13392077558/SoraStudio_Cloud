import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/app/utils/supabase";

export const runtime = "nodejs";

type LoginBody = {
  email: string;
  password: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as LoginBody;
    if (!body?.email || !body?.password) {
      return NextResponse.json(
        { success: false, error: "Missing fields: email/password" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: body.email,
      password: body.password,
    });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    const res = NextResponse.json({
      success: true,
      user: data.user,
      session: data.session,
      token: data.session?.access_token ?? null,
    });
    // Minimal session: store access token (httpOnly) for later use
    if (data.session?.access_token) {
      res.cookies.set("auth_token", data.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
    }
    return res;
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

