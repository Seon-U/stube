import { use } from "react";
import PlayerSection from "@/components/player-section";
import PlaylistAccordian from "@/components/playlist-accordian";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { getPlaylistAndVideo } from "@/lib/db";

const DummyPlaylists = [
  {
    id: "item-1",
    title: "온보딩 / Orientation",
    description: "팀 소개와 전체 일정 요약",
    videos: [
      {
        id: "vid-1",
        title: "프로젝트 구조 빠르게 훑어보기",
        channel: "stube.dev",
        duration: "12:43",
        description: "폴더 구조와 공통 패턴을 요약 정리합니다.",
        level: "초급",
        published: "3일 전",
      },
      {
        id: "vid-2",
        title: "사전 세팅 & 공용 툴 소개",
        channel: "stube.dev",
        duration: "09:12",
        description: "팀에서 공통으로 쓰는 세팅과 툴을 빠르게 소개합니다.",
        level: "초급",
        published: "1주 전",
      },
    ],
  },
  {
    id: "item-2",
    title: "실전 코드 리뷰",
    description: "실제 PR과 리뷰 팁 모음",
    videos: [
      {
        id: "vid-3",
        title: "UI 스냅샷 테스트 짚어보기",
        channel: "design ops",
        duration: "16:20",
        description: "비주얼 리그레션 대비용 테스트 전략을 다룹니다.",
        level: "중급",
        published: "2주 전",
      },
      {
        id: "vid-4",
        title: "프론트 구조 리팩터링 전략",
        channel: "design ops",
        duration: "21:05",
        description: "컴포넌트 분리와 라우트 구조 개선 사례를 공유합니다.",
        level: "고급",
        published: "한 달 전",
      },
      {
        id: "vid-5",
        title: "마이크로 인터랙션 접근법",
        channel: "design ops",
        duration: "07:55",
        description: "경량 애니메이션과 상태 전환 팁을 정리했습니다.",
        level: "중급",
        published: "한 달 전",
      },
    ],
  },
];

// const getPlaylist = async (id: number) => {
//   const [{ channel }] = await getPlaylistAndVideo(id);
//   return channel[0].playlist;
// };

export default function Home() {
  const session = use(auth());
  // if (!session?.user) redirect("/sign");
  const { id, name } = session?.user ?? { id: 1, name: "seo" };
  const [{ channel }] = use(getPlaylistAndVideo(id));
  const playlists = channel[0].playlist;
  const currentPlaylist = playlists[0];
  const currentVideo = playlists[0].video[1];

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
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  큐시트
                </p>
                <p className="text-base font-semibold text-slate-900">
                  {playlists[0].video[1].title ?? "재생할 영상이 없습니다"}
                </p>
              </div>
              <Button
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300"
                variant="ghost"
              >
                바로 재생하기
              </Button>
            </div>
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
            <PlaylistAccordian playlist={playlists} />
          </div>
        </aside>
      </div>
    </div>
  );
}
