import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { getPlaylistById, getVideosById } from "@/lib/youtube";
import { getChannelById } from "@/lib/youtube.action";

// export type youtubeApiRequest = {
//   target: "channel" | "playlist" | "video";
// };

export async function GET(req: NextRequest) {
  //세션 가져
  //이 세션 가져오는 건 다른쪽으로 옮기기(올때부터 세션 가지고 들어오기)
  const session = await auth();

  const target = await req.nextUrl.searchParams.get("target");
  // const authorization = req.headers.get("authorization");

  //QQQ: internal_secret is undefined yet
  //first checking code
  // if (authorization !== `Bearer ${process.env.AUTH_SECRET}`) {
  //   console.log("Unauthorized Access");
  //   // return NextResponse.json({ error: "Unauthorized Access" }, { status: 400 });
  // }

  //No user on session
  if (!session || !session?.accessToken) {
    return console.log("Unauthorized User");
    // return NextResponse.json({ error: "Unauthorized User" }, { status: 401 });
  }

  try {
    target === "channel"
      ? getChannelById({ accessToken: session?.accessToken || "" })
      : target === "playlist"
        ? getPlaylistById()
        : getVideosById();
  } catch (error) {
    return console.log(error);
    // return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function SET(request: NextRequest) {}

export async function POST(request: NextRequest) {}

export async function PUT(request: NextRequest) {}

export async function DELETE(request: NextRequest) {}

//끌고 올 데이터 타입을 정의하기
//이거 그냥 channel orm 연결하면 안되나?
//header타입정의가 필요한가?

//channel 끌어오기 키값 : userID

//return response받
