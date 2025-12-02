"use server";

import { signIn, signOut } from "@/lib/auth";

export type Provider = "google";

export const login = async (provider: Provider) => {
  await signIn(provider, { redirect: false });
};

export const logout = async () => {
  await signOut({ redirectTo: "/" });
};
