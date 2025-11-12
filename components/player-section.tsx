import Player from "./player";

type Props = {
  title?: string;
  description?: string;
};

export default function PlayerSection({ title, description }: Props) {
  return (
    <>
      <Player />
      <div className="mt-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">
            현재 재생 중
          </p>
          <h1 className="text-2xl font-semibold text-slate-900">
            {title ?? "No video found"}
          </h1>
          <p className="text-sm text-slate-500">
            {description ?? "Please select your video from playlist"}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-2 text-right shadow-sm">
          {/* <p className="text-xs text-slate-400">대략 재생 시간</p> */}
          {/* <p className="text-lg font-semibold text-slate-900">18:27</p> */}
        </div>
      </div>
    </>
  );
}
