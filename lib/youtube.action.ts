"use server";

const ChannelEndPoint = "https://www.googleapis.com/youtube/v3/channels";
const PlaylistEndPoint = "https://www.googleapis.com/youtube/v3/playlists";
const PlaylistItemEndPoint =
  "https://www.googleapis.com/youtube/v3/playlistItems";
const VideoEndPoint = "https://www.googleapis.com/youtube/v3/videos";

type QueryParams = {
  part: Array<string>;
  id?: string;
  maxResults?: number;
  q?: string;
};

//body정의
//body정의를 통해서 channel 가지고 오는 fetch funciton

// curl \
//   'https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=UC_x5XG1OV2P6uZZ5FSM9Ttw&key=[YOUR_API_KEY]' \
//   --header 'Authorization: Bearer [YOUR_ACCESS_TOKEN]' \
//   --header 'Accept: application/json' \
//   --compressed

// NextResponse.json({ error: "Unauthorized User" }, { status: 401 });

type channelAPiError = {
  error: {
    code: number;
    message: string;
    errors: [
      {
        message: string;
        domain: string;
        reason: string;
        location: string;
        locationType: string;
      },
    ];
  };
};

type channelItems = {
  kind: string;
  id: string;
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      default: {
        url: string;
      };
    };
  };
};

type youtubeApiError = {
  message: string;
  status: number;
};

type channelApiReturn =
  | { success: true; items: channelItems[] }
  | { success: false; error: youtubeApiError };

/**
 * Fetches the YouTube channels owned by the authenticated user using the provided OAuth access token.
 *
 * Requests the channels endpoint with pagination and accumulates all returned channel items. On error returns a structured error with an HTTP-like status and message.
 *
 * @returns `{ success: true, items: channelItems[] }` containing all retrieved channels on success; `{ success: false, error: { message: string, status: number } }` on failure.
 */
export async function getChannelByToken(
  accessToken: string
): Promise<channelApiReturn> {
  if (!accessToken) {
    return {
      success: false,
      error: {
        message: "ChannelByToken : no accessToken submitted! Plz login again",
        status: 404,
      },
    };
  }
  const MAX_RESULT = 50;
  const API_PARTS = "id,snippet,contentDetails";
  const { YOUTUBE_API_KEY } = process.env;
  //!API key 빼고 에러 나는지 한 번 체크해보기
  // const url = `${ChannelEndPoint}?part=${API_PARTS}&mine=true&key=${YOUTUBE_API_KEY}`;
  let nextPageToken = "";
  const channelData: channelItems[] = [];

  do {
    const url =
      nextPageToken === ""
        ? `${ChannelEndPoint}?part=${API_PARTS}&maxResults=${MAX_RESULT}&mine=true`
        : `${ChannelEndPoint}?part=${API_PARTS}&maxResults=${MAX_RESULT}&pageToken=${nextPageToken}&mine=true`;
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
        return {
          success: false,
          error: { message: errorText, status: res.status },
        };
      }

      //data 구조 분해 할당처리
      const jsonRes = await res.json();
      console.log("🚀 ~ getChannelById ~ ChannelData:", jsonRes);

      if (!jsonRes.pageInfo.totalResults)
        return {
          success: false,
          error: { message: "there is no channel", status: res.status },
        };

      // return { success: true, items: channelData.items };
      channelData.push(...jsonRes.items);
      nextPageToken = jsonRes.nextPageToken ?? "";
    } catch (error) {
      console.log("🚀 ~ getChannelByToken ~ error:", error);
      return {
        success: false,
        error: {
          message: "Data fetch Error: failed To get Channel",
          status: 500,
        },
      };
    }
  } while (nextPageToken !== "");
  return { success: true, items: channelData };
}

type PlaylistItem = {
  id: string;
  snippet: {
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      default: {
        url: string;
      };
    };
  };
};

type playlistApiReturn =
  | {
      success: true;
      items: PlaylistItem[];
    }
  | { success: false; error: youtubeApiError };

/**
 * Retrieves playlists owned by the authenticated user, handling pagination.
 *
 * @param accessToken - OAuth 2.0 Bearer token for the YouTube account used to authenticate requests
 * @returns An object with `success: true` and `items` containing playlist entries when successful; otherwise `success: false` and `error` containing `message` and `status`
 */
export async function getPlaylistByToken(
  accessToken: string
): Promise<playlistApiReturn> {
  //playlist:list 활용
  if (!accessToken) {
    return {
      success: false,
      error: {
        message: "PlaylistByToken : no accessToken submitted! Plz login again",
        status: 404,
      },
    };
  }
  const API_PARTS = "id,snippet";
  const { YOUTUBE_API_KEY } = process.env;
  const playlistData: PlaylistItem[] = [];
  let nextPageToken = "";

  do {
    //!API key 빼고 에러 나는지 한 번 체크해보기
    // const url = `${ChannelEndPoint}?part=${API_PARTS}&mine=true&key=${YOUTUBE_API_KEY}`;
    const url =
      nextPageToken === ""
        ? `${PlaylistEndPoint}?part=${API_PARTS}&mine=true`
        : `${PlaylistEndPoint}?part=${API_PARTS}&pageToken=${nextPageToken}&mine=true`;

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
        return {
          success: false,
          error: { message: errorText, status: res.status },
        };
      }

      //data 구조 분해 할당처리
      const jsonRes = await res.json();
      console.log("🚀 ~ getPlaylistByToken ~ playlistData:", jsonRes);

      if (!jsonRes.pageInfo.totalResults)
        return {
          success: false,
          error: { message: "there is no playlistItem", status: res.status },
        };

      nextPageToken = jsonRes.nextPageToken || "";
      playlistData.push(...jsonRes.items);
    } catch (error) {
      console.log("🚀 ~ getPlaylistByToken ~ error:", error);
      return {
        success: false,
        error: {
          message: "Data fetch Error: failed To get Playlist",
          status: 500,
        },
      };
    }
  } while (nextPageToken !== "");
  return { success: true, items: playlistData };
}

type playlistListItem = {
  id: string;
  playlistId: string;
  snippet: {
    position: number;
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      default: {
        url: string;
      };
    };
    resourceId: {
      videoId: string;
    };
  };
};

type PlaylistItemsReturn =
  | {
      success: true;
      items: playlistListItem[];
    }
  | { success: false; error: youtubeApiError };

/**
 * Fetches all items from the specified YouTube playlist using the provided user access token and follows pagination until all pages are retrieved.
 *
 * @param accessToken - OAuth 2.0 Bearer token used to authorize requests to the YouTube Data API
 * @param playlistId - ID of the playlist whose items should be retrieved
 * @returns On success, `{ success: true, items }` where `items` is an array of `playlistListItem`; on failure, `{ success: false, error }` where `error` contains `message` and HTTP `status`
 */
export async function getPlaylistItemsByToken({
  accessToken,
  playlistId,
}: {
  accessToken: string;
  playlistId: string;
}): Promise<PlaylistItemsReturn> {
  //playlist-Item API활용
  //playlist:list 활용
  if (!accessToken) {
    return {
      success: false,
      error: {
        message: `getPlaylistItemsByToken : No accessToken found ${accessToken}`,
        status: 404,
      },
    };
  }

  console.log(accessToken);
  const API_PARTS = "id, snippet";
  const { YOUTUBE_API_KEY } = process.env;
  const MAX_RESULT = 50;
  let nextPageToken = "";
  const playlistItemData: playlistListItem[] = [];

  do {
    // const url = `${ChannelEndPoint}?part=${API_PARTS}&mine=true&key=${YOUTUBE_API_KEY}`;
    const url =
      nextPageToken === ""
        ? `${PlaylistItemEndPoint}?part=${API_PARTS}&maxResults=${MAX_RESULT}&playlistId=${playlistId}&key=${YOUTUBE_API_KEY}`
        : `${PlaylistItemEndPoint}?part=${API_PARTS}&maxResults=${MAX_RESULT}&playlistId=${playlistId}&pageToken=${nextPageToken}&key=${YOUTUBE_API_KEY}`;

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
        return {
          success: false,
          error: { message: errorText, status: res.status },
        };
      }

      //data 구조 분해 할당처리
      const jsonRes = await res.json();
      console.log("🚀 ~ getPlaylistItemsByToken ~ playlistData:", jsonRes);

      if (!jsonRes.pageInfo.totalResults)
        return {
          success: false,
          error: { message: "there is no channel", status: res.status },
        };

      nextPageToken = jsonRes.nextPageToken || "";
      playlistItemData.push(...jsonRes.items);
    } catch (error) {
      console.log("🚀 ~ getPlaylistItemsByToken ~ error:", error);
      return {
        success: false,
        error: {
          message: "Data fetch Error: failed To get Playlist",
          status: 500,
        },
      };
    }
  } while (nextPageToken !== "");
  return { success: true, items: playlistItemData };
}