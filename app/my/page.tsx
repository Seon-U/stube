import { LogOutIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { signOut } from "next-auth/react";
import { use } from "react";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";

export default function My() {
  const session = use(auth());
  if (!session?.user?.name) redirect("/sign");
  const { name, image } = session.user;
  return (
    <div>
      <div className="flex">
        <img src={image || ""} alt="profileImage" />
        <h1>{name}</h1>
      </div>
      <div className="flex">
        <Button onClick={() => signOut({ redirect: false })}>
          <LogOutIcon />
          Sign out
        </Button>
      </div>
    </div>
  );
}
