import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Home() {
  return (
    <div>
      {/* iframe youtube 영상왼쪽 */}
      {/* 오른쪽 아코디언 활용한 playlist-video영역 */}
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <div className="flex flex-col">
              <h1 className="font-bold">Playlist.title</h1>
              <p className="text-gray-600 text-sm">Playlist.descriptiton</p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {/* 왼쪽에 video thumbnail image */}
            {/* 오른쪽에 video title, video descriptiton을 flex-col로 */}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
