import PlayerSection from "@/components/player-section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import VideoButton from "@/components/video-button";

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
        level: "초급",
        published: "3일 전",
      },
      {
        id: "vid-2",
        title: "사전 세팅 & 공용 툴 소개",
        channel: "stube.dev",
        duration: "09:12",
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
        level: "중급",
        published: "2주 전",
      },
      {
        id: "vid-4",
        title: "프론트 구조 리팩터링 전략",
        channel: "design ops",
        duration: "21:05",
        level: "고급",
        published: "한 달 전",
      },
      {
        id: "vid-5",
        title: "마이크로 인터랙션 접근법",
        channel: "design ops",
        duration: "07:55",
        level: "중급",
        published: "한 달 전",
      },
    ],
  },
];

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-slate-100 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 lg:flex-row">
        <section className="flex-1 space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl">
            <PlayerSection />
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  큐시트
                </p>
                <p className="text-base font-semibold text-slate-900">
                  {DummyPlaylists[0].videos[1].title}
                </p>
              </div>
              {/* <Button
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300"
                variant="ghost"
              >
                전체 재생
              </Button> */}
            </div>
          </div>
        </section>

        <aside className="w-full lg:w-[360px]">
          <div className="rounded-3xl border border-slate-200 bg-white shadow-xl">
            <div className="border-b border-slate-100 px-5 py-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                user name's
              </p>
              <p className="text-lg font-semibold text-slate-900">Playlist</p>
            </div>
            <Accordion
              type="single"
              collapsible
              className="divide-y divide-slate-100"
            >
              {DummyPlaylists.map((playlist) => (
                <AccordionItem
                  key={playlist.id}
                  value={playlist.id}
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
                  <AccordionContent className="space-y-3 pb-5 pt-3 [overflow:visible]">
                    {playlist.videos.map((video) => (
                      <VideoButton key={video.id} {...video} />
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </aside>
      </div>
    </div>
  );
}
