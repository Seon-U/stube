import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import VideoButton from "./video-button";

type Props = {
  playlist: {
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
  }[];
};
export default function PlaylistAccordian({ playlist: playlists }: Props) {
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
            {playlist.video.map((video) => (
              <VideoButton key={video.id} {...video} />
            ))}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
