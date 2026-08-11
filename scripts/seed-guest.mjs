import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to load .env.local manually without external dependencies
function loadEnvLocal() {
  const envPath = path.resolve(__dirname, "../.env.local");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf8");
    for (const line of envContent.split("\n")) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const [key, ...valueParts] = trimmed.split("=");
        if (key && valueParts.length > 0) {
          const val = valueParts.join("=").replace(/^["']|["']$/g, "").trim();
          process.env[key.trim()] = val;
        }
      }
    }
  }
}

loadEnvLocal();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const GUEST_CREDENTIALS = {
  email: "interviewer@demo.com",
  password: "Interviewer@123",
  fullName: "Interviewer Demo Account",
  role: "guest",
};

async function seedGuestAccount() {
  console.log("------------------------------------------");
  console.log("PathoLens - Guest Account Seeding Mechanism");
  console.log("------------------------------------------");

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      "❌ Error: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing in environment."
    );
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  console.log(`Checking guest account (${GUEST_CREDENTIALS.email})...`);

  // Try sign in
  const { data: signInData } = await supabase.auth.signInWithPassword({
    email: GUEST_CREDENTIALS.email,
    password: GUEST_CREDENTIALS.password,
  });

  if (signInData?.user) {
    console.log(
      `✅ Guest account already exists! User ID: ${signInData.user.id}`
    );
    console.log(`Email: ${signInData.user.email}`);
    console.log(`Role: ${signInData.user.user_metadata?.role || "guest"}`);
    console.log("------------------------------------------");
    return;
  }

  console.log("Guest account not found or invalid credentials. Creating new guest account...");

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
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
    console.error("❌ Failed to create guest account:", signUpError.message);
    process.exit(1);
  }

  console.log(
    `🎉 Guest account created successfully! User ID: ${signUpData.user?.id}`
  );
  console.log(`Email: ${GUEST_CREDENTIALS.email}`);
  console.log(`Password: ${GUEST_CREDENTIALS.password}`);
  console.log(`Role: ${GUEST_CREDENTIALS.role}`);
  console.log("------------------------------------------");
}

seedGuestAccount().catch((err) => {
  console.error("Unexpected seeding error:", err);
  process.exit(1);
});
