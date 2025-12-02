import { redirect } from "next/navigation";
import { use } from "react";
import PlayerSection from "@/components/player-section";
import PlaylistAccordian from "@/components/playlist-accordian";
import { auth } from "@/lib/auth";
import { getPlaylistAndVideo } from "@/lib/db";
import NextVideo from "./next-video";

type PageProps = {
  searchParams: Promise<{
    playlistId?: string;
    videoId?: string;
  }>;
};

export default function Home({ searchParams }: PageProps) {
  const session = use(auth());
  if (!session?.user) redirect("/sign");

  const { playlistId, videoId } = use(searchParams);
  const { id, name } = session?.user ?? { id: 1, name: "seo" };
  const [{ channel }] = use(getPlaylistAndVideo(Number(id)));
  const playlists = channel[0].playlist;

  let currentPlaylist = playlists[0];
  let currentVideo = playlists[0].video[1];

  if (playlistId && videoId) {
    const foundPlaylist = playlists.find((p) => p.id === Number(playlistId));
    if (foundPlaylist) {
      currentPlaylist = foundPlaylist;
      const foundVideo = foundPlaylist.video.find(
        (v) => v.id === Number(videoId)
      );
      if (foundVideo) {
        currentVideo = foundVideo;
      }
    }
  }

  return (
    <div className="w-full min-h-screen bg-slate-100 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 lg:flex-row">
        <section className="flex-1 space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl">
            <PlayerSection
              videoId={currentVideo.videoApiId}
              playlistTitle={currentPlaylist.title}
              title={currentVideo.title}
              description={currentVideo.description}
            />
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg">
            <NextVideo
              nextVideo={currentPlaylist.video[currentVideo.position + 1]}
            />
          </div>
        </section>

        <aside className="w-full lg:w-[360px]">
          <div className="rounded-3xl border border-slate-200 bg-white shadow-xl">
            <div className="border-b border-slate-100 px-5 py-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                {name}'s
              </p>
              <p className="text-lg font-semibold text-slate-900">Playlist</p>
            </div>
            <PlaylistAccordian
              playlist={playlists}
              currentPlaylistId={currentPlaylist.id}
              currentVideoId={currentVideo.id}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
