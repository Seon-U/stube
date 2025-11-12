import { PrismaClient } from "@/lib/generated/prisma/client";

//TODO: 싱글톤으로 교체하기
const prisma = new PrismaClient();

export default prisma;

//TODO: 중복 id체크하기
export const findMemberByEmail = async (
  email: string,
  isIncludePasswd: boolean = false
) =>
  prisma.member.findUnique({
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      googleId: true,
    },
    where: { email },
  });

export const findChannelByAPiId = async (
  channelId: string,
  isIncludePasswd: boolean = false
) =>
  prisma.channel.findUnique({
    select: {
      id: true,
    },
    where: { channel_api_id: channelId },
  });

/*중첩 include처리용 함수
 */
const includedData = (keys: string[]): {} => {
  if (keys.length === 0) {
    return true;
  }
  const [key, ...last] = keys;
  return {
    [key]: includedData(last),
  };
};

//TODO: 유저의 모든 포스트를 불러오기
export const getAllPlaylistAndVideo = async (id: number) => {
  const data = includedData(["channel", "playlist", "video"]);
  return prisma.member.findUnique({
    where: { id },
    include: data,
  });
};

export type PlaylistAndVideoType = Awaited<
  ReturnType<typeof getPlaylistAndVideo>
>;

//TODO: 쿼리 바꾸고 타입 정리 좀 하고 모듈화처리
export const getPlaylistAndVideo = async (id: number) => {
  return prisma.member.findMany({
    where: { id },
    select: {
      channel: {
        select: {
          playlist: {
            select: {
              id: true,
              title: true,
              description: true,
              video: {
                select: {
                  id: true,
                  title: true,
                  description: true,
                  videoApiId: true,
                  thumbnailUrl: true,
                  position: true,
                },
                orderBy: { position: "asc" },
              },
            },
          },
        },
      },
    },
  });
};

//TODO: 탈퇴 시 로그인 정보 삭제하기

//TODO: API이용하여 끌어온 정보 저장하기
