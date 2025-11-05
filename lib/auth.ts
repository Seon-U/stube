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
        if (!user || !account?.access_token || !profile) {
          return false;
        }

        const { image, name, email } = user;
        if (!email) return false;

        const googleId = account?.provider === "google" ? profile?.sub : "";

        const didSign = await findMemberByEmail(email);
        const member = !didSign
          ? await prisma.member.create({
              data: {
                email,
                name,
                image,
                googleId,
              },
            })
          : didSign;

        console.log("signin-didLogin, member", didSign, member);

        //전달된 user의 값에 member가 이미 있을 경우 멤버 정보 추가
        //자동 생성된 인덱스값으로 id값 변경, email, nickname, profileImg도 일단 db기준 세팅
        user.id = String(member.id);
        user.email = member.email;
        user.name = member.name;
        if (member.image) user.image = member.image;
        user.googleId = member.googleId ?? "";

        return true;
      },

      async jwt({ token, user, trigger, session, account }) {
        console.log("jwt - unchanged token", token);
        const member = trigger === "update" ? session.user : user;

        if (member) {
          token.id = user.id;
          token.name = user.name;
          token.email = user.email;
          token.picture = user.image;
          token.googleid = user.googleId;
        }

        if (account?.provider === "google" && account.access_token)
          token.accessToken = account.access_token;

        //token, accessToken => undefined
        console.log("jwt - token", token);
        console.log("jwt - member", member, trigger);
        console.log("jwt - session", session);
        return token;
      },
      async session({ session, token }) {
        console.log("🚀 session ~ token:", token);
        //토큰이 있으면 세션에 토큰값 넣어반납, 세션반납

        //? 그냥 강제로 as String주면 안되는지 고민해보기
        if (token) {
          session.userId = token.id as string;
          session.user.email = token.email ?? "";
          session.user.image = token.picture;
          session.user.name = token.name;
          session.accessToken = token.accessToken;
        }

        console.log("session22", session);
        return session;
      },
    },
  };
});
