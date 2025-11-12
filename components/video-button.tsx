import Image from "next/image";
import { Button } from "./ui/button";

type VideoButtonProps = {
  id: string;
  duration: string;
  title: string;
  description: string;
};

export default function VideoButton({ title, description }: VideoButtonProps) {
  return (
    <Button className="flex w-full h-full items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-slate-200 hover:bg-white">
      <Image
        src={"https://i.ytimg.com/vi/EvOPoQrtFGI/default.jpg"}
        width={100}
        height={100}
        alt="videoThumbnail"
      />
      <div className="flex flex-1 flex-col">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="text-xs text-slate-500">
          {description ?? "description text"}
        </p>
        {/* <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
          <span>{description ?? "아무거나 일단 입력해봄"}</span>
        </div> */}
      </div>
    </Button>
  );
}
