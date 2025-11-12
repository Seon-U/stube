import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export const getPlaylistsHandler = async () => {
//   const session = await auth();
//   if (session?.user) redirect("/sign");
//   const [{ channel }] = await getPlaylistAndVideo(session?.user.id);
//   return { playlists: channel[0].playlist };
// };
