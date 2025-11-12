export default function Player({ videoId }: { videoId: string | null }) {
  const videoUrl = `https://www.youtube.com/embed/${videoId}`;
  const isVideo = !!videoId;
  // 영상 id를 전달받아서 해당 url로 영상을 재생하는 컴포넌트
  // 화면을 리턴함
  return (
    <div className="aspect-video overflow-hidden rounded-2xl bg-slate-900">
      <div className="flex h-full flex-col items-center justify-center text-center text-slate-200">
        {isVideo ? (
          <iframe
            id="ytplayer"
            width="640"
            height="360"
            src={videoUrl}
            title={videoId}
          ></iframe>
        ) : (
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-slate-400">
              No Video Found
            </p>
            <p className="text-xl font-semibold">Select the Video</p>
          </div>
        )}
      </div>
    </div>
  );
}
