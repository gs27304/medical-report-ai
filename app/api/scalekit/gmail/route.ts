
import { NextRequest, NextResponse } from "next/server";
import { getAuthorizationUrl } from "@/lib/scalekit-clean";

const GMAIL_CONNECTION_ID = process.env.SCALEKIT_GMAIL_CONNECTION_ID || "gmail";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action !== "get_authorization_url") {
      return NextResponse.json(
        {
          error:
            "Unsupported action. For this MVP only `get_authorization_url` is implemented.",
        },
        { status: 400 }
      );
    }

    // ✅ FIXED: Changed fallback to match the localhost redirect URI you set in the Scalekit Dashboard
    const redirectUri =
      process.env.SCALEKIT_REDIRECT_URI ||
      "http://localhost:3000/api/scalekit/callback";

    const data = getAuthorizationUrl({
      connectionId: GMAIL_CONNECTION_ID,
      redirectUri,
      state: "gmail-connection",
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Scalekit API error:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to get Scalekit authorization URL",
      },
      { status: 500 }
    );
  }
}