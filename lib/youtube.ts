// //request를 리턴하는 함수
// export function getYoutubeData({ target }: youtubeApiRequest) {
//   //받아올 엔드 포인
//   const { NEXT_PUBLIC_URL, AUTH_SECRET } = process.env;
//   return fetch(`${NEXT_PUBLIC_URL}/api/youtube`, {
//     method: "GET",
//     headers: {
//       authorization: `Bearer ${AUTH_SECRET}`,
//     },
//     body: JSON.stringify({ target }),
//   });
// }

// export function getPlaylistById() {}

// export function getVideosById() {}
