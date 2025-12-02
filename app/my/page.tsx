import { auth } from "@/lib/auth";
import Image from "next/image";
import { redirect } from "next/navigation";
import { use } from "react";
import LogOutButton from "./logout-button";

/**
 * Renders the authenticated user's profile page with avatar, display name, and a logout control.
 *
 * If the current session has no user name, the function redirects the client to "/sign".
 *
 * @returns A JSX element containing a centered profile image (using the user's `image` or a generated avatar URL), a header showing `user {name}`, and a LogOutButton.
 */
export default function My() {
  const session = use(auth());
  if (!session?.user?.name) redirect("/sign");
  const { name, image } = session?.user ?? { name: "not regist", image: "" };
  const src =
    image && image.trim() !== "" ? image : `https://avatar.vercel.sh/${name}`;
  return (
    <div className="grid place-items-center h-screen">
      <div className="flex flex-col">
        <Image
          src={src}
          width={200}
          height={200}
          alt="profileImage"
          className="rounded-full"
        />
        <h1 className="text-center pt-30 pb-5 font-bold">user {name}</h1>
        <LogOutButton />
      </div>
    </div>
  );
}