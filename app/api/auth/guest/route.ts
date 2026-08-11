import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const GUEST_CREDENTIALS = {
  email: "interviewer@demo.com",
  password: "Interviewer@123",
  fullName: "Interviewer Demo Account",
  role: "guest",
};

export async function POST(req: NextRequest) {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: "Supabase environment variables are missing." },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // 1. Attempt to sign in to check if guest account exists
    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email: GUEST_CREDENTIALS.email,
        password: GUEST_CREDENTIALS.password,
      });

    if (signInData?.user) {
      return NextResponse.json({
        success: true,
        message: "Guest account verified and ready.",
        created: false,
        user: {
          email: signInData.user.email,
          role: signInData.user.user_metadata?.role || "guest",
        },
      });
    }

    // 2. If sign in failed due to invalid credentials or user not found, create the guest account
    if (signInError) {
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email: GUEST_CREDENTIALS.email,
          password: GUEST_CREDENTIALS.password,
          options: {
            data: {
              full_name: GUEST_CREDENTIALS.fullName,
              role: GUEST_CREDENTIALS.role,
              is_guest: true,
            },
          },
        });

      if (signUpError) {
        // If sign up fails because user already exists (e.g. password mismatch), log warning
        console.warn("Guest signup warning:", signUpError.message);
        return NextResponse.json(
          {
            success: false,
            error: "Failed to initialize guest account",
            details: signUpError.message,
          },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Guest account created successfully.",
        created: true,
        user: {
          email: signUpData.user?.email || GUEST_CREDENTIALS.email,
          role: GUEST_CREDENTIALS.role,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Guest account ready.",
    });
  } catch (error: any) {
    console.error("Guest account initialization error:", error);
    return NextResponse.json(
      {
        error: "Internal server error during guest account setup.",
        details: error.message || String(error),
      },
      { status: 500 }
    );
  }
}
