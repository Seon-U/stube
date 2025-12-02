import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine class name inputs into a single string and resolve Tailwind class conflicts.
 *
 * @param inputs - One or more `ClassValue` entries (strings, arrays, objects, etc.) representing class names
 * @returns A single class string with duplicates/conflicts merged according to Tailwind rules
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export const getPlaylistsHandler = async () => {
//   const session = await auth();
//   if (session?.user) redirect("/sign");
//   const [{ channel }] = await getPlaylistAndVideo(session?.user.id);
//   return { playlists: channel[0].playlist };
// };