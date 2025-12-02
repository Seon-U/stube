import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Link from "next/link";
import { use } from "react";
import { Avatar } from "@/components/ui/avatar";
import { auth } from "@/lib/auth";

/**
 * Renders the top navigation control that shows the current user's avatar linked to "/my" when signed in, or a "Login" link to "/sign" when not.
 *
 * The avatar uses the user's image when available and falls back to the first two characters of the user's name.
 *
 * @returns The navigation JSX element containing either the linked user avatar or a login link.
 */
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