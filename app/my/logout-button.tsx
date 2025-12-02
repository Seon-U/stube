"use client";

import { LogOutIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "../sign/sign.action";

/**
 * Render a button that signs the current user out.
 *
 * @returns A JSX element: a button containing a logout icon and the label "Sign out" that calls `logout` when clicked.
 */
export default function LogOutButton() {
  return (
    <Button onClick={logout}>
      <LogOutIcon />
      Sign out
    </Button>
  );
}