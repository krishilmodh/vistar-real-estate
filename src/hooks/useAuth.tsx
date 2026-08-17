"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session, AuthChangeEvent } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: { role: string; full_name: string | null } | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<{ role: string; full_name: string | null } | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("role, full_name")
      .eq("id", userId)
      .single();
    if (data) setProfile(data);
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
      const sess = data.session;
      setSession(sess);
      setUser(sess?.user ?? null);
      if (sess?.user) fetchProfile(sess.user.id);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, sess: Session | null) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      if (sess?.user) fetchProfile(sess.user.id);
      else setProfile(null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

export function useRole() {
  const { profile } = useAuth();
  return profile?.role ?? "staff";
}

export function usePermissions() {
  const role = useRole();
  const check = (permission: string) => {
    if (role === "admin") return true;
    const permissions: Record<string, string[]> = {
      manager: [
        "properties:read", "properties:write",
        "flats:read", "flats:write",
        "customers:read", "customers:write",
        "contracts:read", "contracts:write",
        "rent:read", "rent:write",
        "payments:read", "payments:write",
        "reports:read",
        "imports:read", "imports:write",
      ],
      staff: [
        "properties:read",
        "flats:read",
        "customers:read", "customers:write",
        "contracts:read", "contracts:write",
        "rent:read",
        "payments:read", "payments:write",
      ],
    };
    return permissions[role]?.includes(permission) ?? false;
  };
  return { check, role };
}