
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
import { User, LogOut, Settings, CreditCard, Shield } from "lucide-react";

export function UserMenu() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getUser().then(({ data, error }: any) => {
      if (error) {
        setUser(null);
      } else {
        setUser(data?.user);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
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
  const initials = userEmail
    .split("@")[0]
    .split(/[\._]/)
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-10 w-10 rounded-full p-0 hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 active:scale-95 transition-transform"
        >
          {/* Avatar with Ring/Border effect */}
          <div className="h-10 w-10 rounded-full p-[2px] bg-gradient-to-tr from-blue-600 to-indigo-400">
            <Avatar className="h-full w-full border-2 border-white shadow-sm">
              <AvatarImage src={user.user_metadata?.avatar_url} alt={userEmail} />
              <AvatarFallback className="bg-white text-blue-600 font-bold text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-64 mt-2 p-2 shadow-xl border-gray-100 rounded-xl" align="end" forceMount>
        <DropdownMenuLabel className="font-normal px-2 py-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
               <User className="h-5 w-5" />
            </div>
            <div className="flex flex-col space-y-0.5 overflow-hidden">
              <p className="text-sm font-semibold text-gray-900 leading-none truncate">
                {user.user_metadata?.full_name || "Medical User"}
              </p>
              <p className="text-xs font-medium leading-none text-muted-foreground truncate">
                {userEmail}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="mx-2 bg-gray-100" />
        
        <div className="py-1">
          <DropdownMenuItem 
            className="rounded-lg py-2 cursor-pointer focus:bg-blue-50 focus:text-blue-700" 
            onClick={() => router.push("/profile")}
          >
            <User className="mr-3 h-4 w-4 opacity-70" />
            <span className="font-medium">My Profile</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            className="rounded-lg py-2 cursor-pointer focus:bg-blue-50 focus:text-blue-700"
            disabled
          >
            <Settings className="mr-3 h-4 w-4 opacity-70" />
            <span className="font-medium">Account Settings</span>
          </DropdownMenuItem>

          <DropdownMenuItem 
            className="rounded-lg py-2 cursor-pointer focus:bg-blue-50 focus:text-blue-700"
          >
            <Shield className="mr-3 h-4 w-4 opacity-70" />
            <span className="font-medium">Privacy</span>
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



