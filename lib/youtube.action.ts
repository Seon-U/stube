import { NextResponse } from "next/server";

const ChannelEndPoint = "https://www.googleapis.com/youtube/v3/channels";
const PlaylistEndPoint = "https://www.googleapis.com/youtube/v3/playlists";
const VideoEndPoint = "https://www.googleapis.com/youtube/v3/videos";

type QueryParams = {
  part: Array<string>;
  id?: string;
  maxResults?: number;
  q?: string;
};

type Props = {
  accessToken: string;
};
//body정의
//body정의를 통해서 channel 가지고 오는 fetch funciton

// curl \
//   'https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=UC_x5XG1OV2P6uZZ5FSM9Ttw&key=[YOUR_API_KEY]' \
//   --header 'Authorization: Bearer [YOUR_ACCESS_TOKEN]' \
//   --header 'Accept: application/json' \
//   --compressed

// NextResponse.json({ error: "Unauthorized User" }, { status: 401 });

export async function getChannelById({ accessToken }: Props) {
  if (!accessToken) {
    console.log("No accessToken found");
  }
  console.log(accessToken);
  const API_PARTS = "id,snippet,contentDetails";
  const { YOUTUBE_API_KEY } = process.env;
  const url = `${ChannelEndPoint}?part=${API_PARTS}&mine=true&key=${YOUTUBE_API_KEY}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: `application/json`,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("YouTube API Error:", res.status, errorText);
      return NextResponse.json({ error: errorText }, { status: res.status });
    }

    //data 구조 분해 할당처리
    const ChannelData = await res.json();
    console.log(ChannelData);

    return ChannelData;
  } catch (error) {
    console.log("🚀 ~ getChannelById ~ error:", error);
    return NextResponse.json(
      { error: "Data fetch Error: failed To get Channel" },
      { status: 500 }
    );
  }
}

const getPlaylistById = async () => {};
const getVideoById = async () => {};
