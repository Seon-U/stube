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

// //TODO: 로그인 정보 db저장하기
// export const saveMember = async ({
//   email,
//   googleId,
//   nickname,
//   profileImg,
//   channel,
// }) => {
//   prisma.member.create({
//     data: {
//       email,
//       googleId,
//       nickname,
//       profileImg,
//       channel,
//     },
//   });
// };

//TODO: 탈퇴 시 로그인 정보 삭제하

//TODO: API이용하여 끌어온 정보 저장하기
