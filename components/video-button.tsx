import Image from "next/image";
import { Button } from "./ui/button";

type VideoButtonProps = {
  title: string | null;
  description: string | null;
  thumbnailUrl: string | null;
};

export default function VideoButton({
  title,
  description,
  thumbnailUrl,
}: VideoButtonProps) {
  const videoTitle = title ?? "no name";
  const resolvedDescription =
    description ?? "추후 DB에서 설명을 불러올 예정입니다.";
  const resolvedThumbnail =
    thumbnailUrl ?? "https://i.ytimg.com/vi/EvOPoQrtFGI/default.jpg";

  return (
    <Button className="flex h-full w-full justify-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-slate-200 hover:bg-white">
      <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border border-slate-100">
        <Image
          src={resolvedThumbnail}
          fill
          alt="videoThumbnail"
          className="object-cover"
          sizes="96px"
        />
      </div>
      <div className="flex flex-col min-w-0">
        <h1 className="truncate text-sm font-semibold text-slate-900 whitespace-nowrap">
          {videoTitle}
        </h1>
        <p className="max-w-[80%] truncate text-xs text-slate-500 whitespace-nowrap">
          {resolvedDescription}
        </p>
      </div>
    </Button>
  );
}
