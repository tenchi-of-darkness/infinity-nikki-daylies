"use client";

import { ConvexProviderWithAuth, ConvexReactClient } from "convex/react";
import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { User, UserManager } from "oidc-client-ts";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

let userManager: UserManager | undefined;
let renewalInFlight: Promise<User | null> | null = null;

function getUserManager() {
  userManager ??= new UserManager({
    authority: "http://192.168.178.12:5556/dex",
    client_id: "daylies",
    redirect_uri: `${window.location.origin}/callback`,
    response_type: "code",
    scope: "openid profile email offline_access",
    post_logout_redirect_uri: `${window.location.origin}/`,
    automaticSilentRenew: false,
  });
  return userManager;
}

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAppAuth() {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("useAppAuth must be used inside ConvexClientProvider");
  return auth;
}

export async function completeLogin() {
  return getUserManager().signinRedirectCallback();
}

function renewUser() {
  if (!renewalInFlight) {
    renewalInFlight = getUserManager().signinSilent().finally(() => {
      renewalInFlight = null;
    });
  }
  return renewalInFlight;
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const userRef = useRef<User | null>(null);
  const loadingRef = useRef(true);
  userRef.current = user;
  loadingRef.current = isLoading;

  useEffect(() => {
    const manager = getUserManager();
    const onUserLoaded = (nextUser: User) => setUser(nextUser);
    const onUserUnloaded = () => setUser(null);
    manager.events.addUserLoaded(onUserLoaded);
    manager.events.addUserUnloaded(onUserUnloaded);
    void manager.getUser().then(setUser).catch((error: unknown) => {
      console.error("Could not restore the login session", error);
    }).finally(() => setIsLoading(false));
    return () => {
      manager.events.removeUserLoaded(onUserLoaded);
      manager.events.removeUserUnloaded(onUserUnloaded);
    };
  }, []);

  const signIn = useCallback(() => getUserManager().signinRedirect(), []);
  const signOut = useCallback(() => getUserManager().signoutRedirect(), []);
  const authValue = useMemo(() => ({ user, isLoading, signIn, signOut }), [user, isLoading, signIn, signOut]);
  const fetchAccessToken = useCallback(async ({ forceRefreshToken }: { forceRefreshToken: boolean }) => {
    let currentUser = userRef.current;
    if (forceRefreshToken || !currentUser || currentUser.expired) {
      try {
        currentUser = await renewUser();
        userRef.current = currentUser;
        setUser(currentUser);
      } catch (error) {
        console.error("Dex session renewal failed; sign in again", error);
        await getUserManager().removeUser();
        userRef.current = null;
        setUser(null);
        return null;
      }
    }
    return currentUser?.id_token ?? null;
  }, []);
  const authState = useMemo(() => ({
    isLoading,
    isAuthenticated: !!user && !user.expired,
    fetchAccessToken,
  }), [isLoading, user, fetchAccessToken]);
  const useAuth = useCallback(() => authState, [authState]);

  return (
    <AuthContext.Provider value={authValue}>
      <ConvexProviderWithAuth client={convex} useAuth={useAuth}>{children}</ConvexProviderWithAuth>
    </AuthContext.Provider>
  );
}
