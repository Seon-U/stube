import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import VideoButton from "./video-button";

type Playlist = {
  id: number;
  description: string | null;
  title: string;
  video: {
    id: number;
    description: string | null;
    title: string | null;
    thumbnailUrl: string | null;
    position: number;
    videoApiId: string;
  }[];
};

type Props = {
  playlist: Playlist[];
  currentVideoId: number;
  currentPlaylistId: number;
};

/**
 * Render an accordion listing playlists where each playlist expands to show its videos.
 *
 * @param playlists - Array of playlists to display; each playlist's videos are rendered as individual video buttons.
 * @param currentVideoId - ID of the currently active video; the corresponding video button is marked active.
 * @returns The rendered accordion element containing playlist items and their videos.
 */
export default function PlaylistAccordian({
  playlist: playlists,
  // currentPlaylistId,
  currentVideoId,
}: Props) {
  return (
    <Accordion type="single" collapsible className="divide-y divide-slate-100">
      {playlists.map((playlist) => (
        <AccordionItem
          key={playlist.id}
          value={String(playlist.id)}
          className="px-5"
        >
          <AccordionTrigger className="py-4 text-left font-semibold text-slate-900 hover:no-underline">
            <div>
              <p>{playlist.title}</p>
              <p className="text-sm font-normal text-slate-500">
                {playlist.description}
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-3 pb-5 pt-3 overflow-visible">
            <div className="max-h-100 overflow-y-auto sticky">
              {playlist.video.map((video) => (
                <VideoButton
                  key={video.id}
                  playlistId={playlist.id}
                  videoId={video.id}
                  isActive={currentVideoId === video.id}
                  {...video}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}