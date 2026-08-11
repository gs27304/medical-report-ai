"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, LogOut, Settings, Shield, Sparkles, Lock } from "lucide-react";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";

export function UserMenu() {
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getUser().then(({ data, error }: { data: { user: SupabaseUser | null }; error: unknown }) => {
      if (error) {
        setUser(null);
      } else {
        setUser(data?.user ?? null);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        router.push("/auth");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const handleSignOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    router.push("/auth");
  };

  if (loading) {
    return (
      <div className="h-8 w-8 rounded-full bg-gray-100 animate-pulse border border-gray-200" />
    );
  }

  if (!user) {
    return (
      <Button
        variant="default"
        size="sm"
        onClick={() => router.push("/auth")}
        className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all active:scale-95"
      >
        Sign In
      </Button>
    );
  }

  const userEmail = user.email || "User";
  const isGuest =
    userEmail === "interviewer@demo.com" ||
    user.user_metadata?.role === "guest" ||
    user.user_metadata?.is_guest === true;

  const initials = userEmail
    .split("@")[0]
    .split(/[\._]/)
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleRestrictedAction = () => {
    alert(
      "Notice: Changing credentials or deleting the demo account is disabled in Interviewer Demo Mode to ensure continuous evaluation availability."
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full p-0 hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 active:scale-95 transition-transform"
        >
          {/* Avatar with Ring/Border effect */}
          <div className={`h-10 w-10 rounded-full p-[2px] ${
            isGuest 
              ? "bg-gradient-to-tr from-amber-500 to-indigo-600" 
              : "bg-gradient-to-tr from-blue-600 to-indigo-400"
          }`}>
            <Avatar className="h-full w-full border-2 border-white shadow-sm">
              <AvatarImage src={user.user_metadata?.avatar_url} alt={userEmail} />
              <AvatarFallback className={`bg-white font-bold text-xs ${isGuest ? "text-amber-600" : "text-blue-600"}`}>
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-72 mt-2 p-2 shadow-xl border-gray-100 rounded-xl"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="font-normal px-2 py-3">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
              isGuest ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
            }`}>
              {isGuest ? <Sparkles className="h-5 w-5" /> : <User className="h-5 w-5" />}
            </div>
            <div className="flex flex-col space-y-1 overflow-hidden">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-semibold text-gray-900 leading-none truncate">
                  {user.user_metadata?.full_name || (isGuest ? "Interviewer Demo" : "Medical User")}
                </p>
              </div>
              <p className="text-xs font-medium leading-none text-muted-foreground truncate">
                {userEmail}
              </p>
              {isGuest && (
                <div className="pt-1">
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] py-0 px-1.5 font-medium">
                    Interviewer Demo Mode
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="mx-2 bg-gray-100" />

        <div className="py-1">
          <DropdownMenuItem
            className="rounded-lg py-2 cursor-pointer focus:bg-blue-50 focus:text-blue-700"
            onClick={() => router.push("/")}
          >
            <User className="mr-3 h-4 w-4 opacity-70" />
            <span className="font-medium">Dashboard Overview</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="rounded-lg py-2 cursor-pointer focus:bg-blue-50 focus:text-blue-700"
            onClick={isGuest ? handleRestrictedAction : () => router.push("/profile")}
          >
            {isGuest ? <Lock className="mr-3 h-4 w-4 text-amber-500" /> : <Settings className="mr-3 h-4 w-4 opacity-70" />}
            <span className="font-medium">
              {isGuest ? "Account Settings (Protected)" : "Account Settings"}
            </span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="rounded-lg py-2 cursor-pointer focus:bg-blue-50 focus:text-blue-700"
            onClick={isGuest ? handleRestrictedAction : undefined}
          >
            <Shield className="mr-3 h-4 w-4 opacity-70" />
            <span className="font-medium">Privacy & Security</span>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="mx-2 bg-gray-100" />

        <DropdownMenuItem
          onClick={handleSignOut}
          className="rounded-lg py-2 mt-1 cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700"
        >
          <LogOut className="mr-3 h-4 w-4" />
          <span className="font-semibold">Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
