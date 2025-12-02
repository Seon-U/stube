import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Link from "next/link";
import { use } from "react";
import { Avatar } from "@/components/ui/avatar";
import { auth } from "@/lib/auth";

export default function Nav() {
  const session = use(auth());
  const didlogin = !!session?.user;
  console.log("🚀 ~ Nav ~ session:", session);
  return (
    <div className="flex items-center gap-5 py-1">
      {didlogin ? (
        <Link
          href="/my"
          className="relative h-[40px] w-[40px] overflow-hidden rounded-full border"
        >
          <Avatar>
            <AvatarImage src={session.user?.image || ""} />
            <AvatarFallback className="text-xl">
              {session.user?.name?.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
        </Link>
      ) : (
        <Link href="/sign">Login</Link>
      )}
    </div>
  );
}
