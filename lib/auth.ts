import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import prisma, { findMemberByEmail } from "./db";
import {
  getChannelByToken,
  getPlaylistByToken,
  getPlaylistItemsByToken,
} from "./youtube.action";

const MAX_AGE = 60 * 60 * 24;

export const { handlers, auth, signIn, signOut } = NextAuth(async (req) => {
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
    pages: {
      signIn: "/sign",
      error: "/sign",
    },
    secret: process.env.AUTH_SECRET,
    callbacks: {
      async signIn({ user, profile, account }) {
        console.log("🚀 ~ account:", account);
        console.log("🚀 ~ profile:", profile);
        console.log("🚀 ~ user:", user);
        if (!user || !account?.access_token || !profile) {
          throw Error(`no data found`);
        }

        const channelData = await getChannelByToken(account.access_token);
        if (!channelData.success)
          throw Error(channelData.error.message + channelData.error.status);

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

        const channel = await prisma.channel.upsert({
          where: { channel_api_id: channelData.items[0].id },
          update: {
            title: channelData.items[0].snippet.title,
            channelThumb: channelData.items[0].snippet.thumbnails.default.url,
            accessToken: account.access_token,
            refreshToken: account.refresh_token,
            lastSelected: true,
          },
          create: {
            memberId: member.id,
            title: channelData.items[0].snippet.title,
            channel_api_id: channelData.items[0].id,
            channelThumb: channelData.items[0].snippet.thumbnails.default.url,
            accessToken: account.access_token,
            refreshToken: account.refresh_token,
            lastSelected: true,
          },
        });

        //전달된 user의 값에 member가 이미 있을 경우 멤버 정보 추가
        //자동 생성된 인덱스값으로 id값 변경, email, nickname, profileImg도 일단 db기준 세팅
        user.id = String(member.id);
        user.email = member.email;
        user.name = member.name;
        if (member.image) user.image = member.image;
        user.googleId = member.googleId ?? "";

        const playlistData = await getPlaylistByToken(account.access_token);
        if (!playlistData.success) {
          console.log(playlistData.error.message, playlistData.error.status);
          return true;
        }

        for (const playlist of playlistData.items) {
          const playlistData = await prisma.playlist.upsert({
            where: { playlistApiId: playlist.id },
            update: {
              title: playlist.snippet.title,
              description: playlist.snippet.description,
              publishedAt: new Date(),
            },
            create: {
              createdAt: new Date(),
              title: playlist.snippet.title,
              description: playlist.snippet.description,
              playlistApiId: playlist.id,
              publishedAt: new Date(),
              channelId: channel.id,
            },
          });
          const videoData = await getPlaylistItemsByToken({
            accessToken: account.access_token,
            playlistId: playlist.id,
          });

          if (!videoData.success) continue;

          for (const playlistItem of videoData.items) {
            console.log("🚀 ~ playlistItem:", playlistItem);
            const newPlaylistItem = await prisma.video.upsert({
              where: { listApiId: playlistItem.id },
              update: {
                updatedAt: new Date(),
                title: playlistItem.snippet.title,
                description: playlistItem.snippet.description,
                position: playlistItem.snippet.position,
                thumbnailUrl: playlistItem.snippet.thumbnails?.default?.url,
              },
              create: {
                createdAt: new Date(),
                updatedAt: new Date(),
                title: playlistItem.snippet.title,
                description: playlistItem.snippet.description,
                publishedAt: new Date(),
                listApiId: playlistItem.id,
                position: playlistItem.snippet.position,
                playlistId: playlistData.id,
                videoApiId: playlistItem.snippet.resourceId.videoId,
                thumbnailUrl: playlistItem.snippet.thumbnails?.default?.url,
              },
            });
          }
        }

        console.log(
          "signin-didLogin, member, channel",
          didSign,
          member,
          channel
        );

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
