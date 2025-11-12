"use client";

import { LogOutIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "../sign/sign.action";

export default function LogOutButton() {
  return (
    <Button onClick={logout}>
      <LogOutIcon />
      Sign out
    </Button>
  );
}
