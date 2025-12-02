"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

type video = {
  position: number;
  title: string | null;
  id: number;
  description: string | null;
  thumbnailUrl: string | null;
  videoApiId: string;
};

type Props = {
  nextVideo: video;
};

/**
 * Render a UI block that displays the next video's title and a button which sets the current `videoId` query parameter to that video's `id`.
 *
 * @param nextVideo - The next video to display (fields include `id` and `title`); when `title` is null, a fallback label is shown.
 * @returns A React element containing the video label/title and a "바로 재생하기" button that updates the URL query to play the video.
 */
export default function NextVideo({ nextVideo }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClick = () => {
    const params = new URLSearchParams(searchParams);
    params.set("videoId", nextVideo.id.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-400">큐시트</p>
        <p className="text-base font-semibold text-slate-900">
          {nextVideo.title ?? "재생할 영상이 없습니다"}
        </p>
      </div>
      <Button
        className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300"
        variant="ghost"
        onClick={handleClick}
      >
        바로 재생하기
      </Button>
    </div>
  );
}