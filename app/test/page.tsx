"use client";

import { Button } from "@/components/ui/button";
import { secretAction } from "@/lib/youtube.action";

export default function TestBtn() {
  return (
    <Button onClick={(...args) => secretAction({ test: args })}>
      Call Secret Action
    </Button>
  );
}
