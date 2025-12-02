import Player from "./player";

type Props = {
  videoId: string | null;
  playlistTitle: string | null;
  title: string | null;
  description: string | null;
};

/**
 * Render a video player with an accompanying info panel showing the current playlist, video title, and description.
 *
 * The component renders a Player for `videoId` and a details panel that displays the playlist title, the video title
 * (falls back to "No video found" when `title` is null), and the video description (falls back to
 * "Please select your video from playlist" when `description` is null).
 *
 * @param videoId - The ID of the video to play; passed directly to the Player component.
 * @param playlistTitle - The name of the current playlist to display above the title; may be null.
 * @param title - The video title to display; when `null` the UI shows "No video found".
 * @param description - The video description to display; when `null` the UI shows "Please select your video from playlist".
 * @returns A JSX element containing the Player and the textual info panel.
 */
export default function PlayerSection({
  videoId,
  playlistTitle,
  title,
  description,
}: Props) {
  return (
    <>
      <Player videoId={videoId} />
      <div className="mt-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">
            현재 {playlistTitle} 재생 중
          </p>
          <h1 className="text-2xl font-semibold text-slate-900">
            {title ?? "No video found"}
          </h1>
          <p className="text-sm text-slate-500 line-clamp-3">
            {description ?? "Please select your video from playlist"}
          </p>
        </div>
        {/* <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-2 text-right shadow-sm"> */}
        {/* <p className="text-xs text-slate-400">대략 재생 시간</p> */}
        {/* <p className="text-lg font-semibold text-slate-900">18:27</p> */}
        {/* </div> */}
      </div>
    </>
  );
}