import { redirect } from "next/navigation";
import { use } from "react";
import { auth, signOut } from "@/lib/auth";
import LogOutButton from "./logout-button";

export default function My() {
  const session = use(auth());
  if (!session?.user?.name) redirect("/sign");
  const { name, image } = session.user;
  const logout = async () => {
    console.log("enter logout");
    await signOut();
  };
  return (
    <div>
      <div className="flex">
        <img src={image || ""} alt="profileImage" />
        <h1>{name}</h1>
      </div>
      <div className="flex">
        <LogOutButton />
      </div>
    </div>
  );
}
