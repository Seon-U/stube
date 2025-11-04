import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import prisma, { findMemberByEmail } from "./db";

export const MAX_AGE = 60 * 60 * 24;

export const {
  auth,
  handlers: { GET, POST },
  signIn,
  signOut,
} = NextAuth(async (req) => {
  console.log("Auth:req >>>", req);
  return {
    providers: [
      Google({
        clientId: process.env.AUTH_GOOGLE_ID,
        clientSecret: process.env.AUTH_GOOGLE_SECRET,
        authorization: {
          params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code",
            scope: [
              "openid email profile",
              "https://www.googleapis.com/auth/youtube.readonly",
              "https://www.googleapis.com/auth/youtube.force-ssl",
            ].join(" "),
          },
        },
      }),
    ],
    trustHost: true,
    jwt: { maxAge: MAX_AGE },
    session: {
      strategy: "jwt",
      maxAge: MAX_AGE,
    },
    // pages: {
    //   signIn: "/sign",
    //   error: "/sign/error",
    // },
    secret: process.env.AUTH_SECRET,
    callbacks: {
      async signIn({ user, profile, account }) {
        console.log("scope", account?.scope);
        console.log("sign profile", profile);
        //signIn action에 대한 전달 값을 받아 유저 생성
        const { email, name: nickname, image: profileImg } = user;
        console.log("🚀 ~ profileImg:", profileImg);
        //전달값이 이미 존재하는 유저인지 확인

        // const channelData = await getChannelById({
        //   accessToken: account?.access_token || "",
        // });
        // console.log(channelData);

        if (!email) throw Error("There is no email provided");

        const didSign = await findMemberByEmail(email);
        const member = !didSign
          ? await prisma.member.create({
              data: {
                email,
                nickname,
                profileImg,
              },
            })
          : didSign;

        console.log("member");
        console.log("firxt user", user);
        //전달된 user의 값에 member가 이미 있을 경우 멤버 정보 추가 (가 필요할까?)
        //자동 생성된 인덱스값으로 id값 변경, email, nickname, profileImg도 일단 db기준 세팅
        user.id = member.id.toString();
        user.email = member.email;
        user.name = member.nickname;
        if (member.profileImg) user.image = member.profileImg;

        return true;
      },

      async jwt({ token, user, trigger, session, account }) {
        const member = trigger === "update" ? session : user;
        //만약 업데이트 트리거 받으면 세션을 유저에 추가, 아니면 유저 토큰값에 세션값 넣기

        //account초기에만 생성됨 로그인 초기라면 provider있을 것, 확인 후 값넣
        if (account?.provider === "google" && account.access_token)
          token.accessToken = account.access_token;

        if (member) {
          token.user = member;
          token.email = member.email;
          token.name = member.name;
          token.picture = member.image;
          token.accessToken = member.accessToken;
        }

        return token;
      },
      async session({ session, token }) {
        console.log("🚀 session ~ token:", token);
        //토큰이 있으면 세션에 토큰값 넣어반납, 세션반납

        const { user, email, name, picture, accessToken } = token;

        //? 그냥 강제로 as String주면 안되는지 고민해보기
        if (token) {
          session.user.id = user?.toString() || "";
          session.user.email = email || "";
          session.user.image = picture || "";
          session.user.name = name;
          session.accessToken = accessToken?.toString() || "";
        }

        return session;
      },
    },
  };
});
