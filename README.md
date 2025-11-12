# Stube

YouTube 재생목록을 내 공간으로 옮겨와 감상할 수 있는 개인용 미디어 허브입니다. Google 계정으로 로그인하면 채널 · 플레이리스트 · 영상 메타데이터를 자동으로 동기화하고, Next.js App Router 기반의 대시보드에서 즉시 재생할 수 있습니다.

## 주요 기능

- **Google OAuth 2.0 + NextAuth v5**: 최초 로그인 시 Google/YouTube 권한을 위임받아 액세스 토큰을 확보하고 세션으로 유지합니다.
- **YouTube 데이터 동기화**: `lib/youtube.action.ts`에서 채널/플레이리스트/영상 엔드포인트를 순차호출하여 Prisma(MySQL)에 upsert 합니다.
- **개인화된 플레이어**: `app/page.tsx`에서 사용자별 재생목록을 불러와 `PlayerSection`, `PlaylistAccordion`, `NextVideo` 컴포넌트로 현재/다음 영상을 안내합니다.
- **마이페이지 & 세션 제어**: `app/my` 경로에서 프로필 이미지, 이름, 로그아웃 버튼을 제공하며, 인증되지 않은 사용자는 `/sign`으로 리다이렉트됩니다.
- **Docker 기반 로컬 DB**: `docker-compose.yml`로 MySQL 8.0을 구동하고 Prisma 스키마(`prisma/schema.prisma`)와 연동합니다.

## 기술 스택

- **Framework**: Next.js 16 (App Router, React 19, React Compiler)
- **UI**: Tailwind CSS 4, Radix UI, shadcn 스타일 버튼/아코디언 컴포넌트
- **Auth**: NextAuth v5 beta, Google Provider (YouTube scope 포함)
- **Data**: Prisma Client, MySQL 8 (Docker)
- **Tooling**: TypeScript 5, Biome (lint/format), pnpm, dotenv-cli

## 디렉터리 개요

```text
app/
  page.tsx                # 메인 대시보드 (플레이어, 플레이리스트, 다음 영상)
  sign/                   # 로그인 페이지, Google OAuth 버튼 및 server action
  my/                     # 사용자 프로필 및 로그아웃
  api/youtubedata/        # 세션 액세스 토큰을 이용한 YouTube fetch 라우트
components/
  player-section.tsx      # 영상 프레임 + 메타 정보
  playlist-accordian.tsx  # Radix Accordion 기반 재생목록
  video-button.tsx        # 재생목록 아이템 선택 버튼
lib/
  auth.ts                 # NextAuth 설정, YouTube 동기화 로직
  db.ts                   # Prisma Client 및 쿼리 유틸
  youtube.action.ts       # 채널/플레이리스트/영상 fetch helpers
prisma/
  schema.prisma           # member/channel/playlist/video 모델 정의
docker-compose.yml        # 로컬 MySQL 컨테이너 정의
```

## 사전 준비

- Node.js ≥ 20.x (Next.js 16 권장 버전)
- pnpm ≥ 8 (또는 npm/yarn, 단 스크립트는 pnpm 기준)
- Docker & Docker Compose (로컬 MySQL 구동용)
- Google Cloud OAuth 클라이언트 + YouTube Data API v3 활성화

## 환경 변수 설정

루트에 `.env.local`을 생성하고 필요한 값을 채워주세요.

```bash
AUTH_GOOGLE_ID=your-google-oauth-client-id
AUTH_GOOGLE_SECRET=your-google-oauth-client-secret
AUTH_SECRET=any-random-string
YOUTUBE_API_KEY=your-youtube-data-api-key

DATABASE_URL=yout-DB-root
SHADOW_DATABASE_URL=yout-shadow-db-root
NEXTAUTH_URL=http://localhost:3001-Or-yout-domain-link
```

> **Tip**: `docker-compose.yml`은 3308 포트를 호스트에 노출합니다. 비밀번호/DB명은 `.env.local`과 `docker-compose.yml`의 `MYSQL_*` 값이 일치하도록 맞춰주세요.

## 로컬 개발 절차

1. **의존성 설치**
   ```bash
   pnpm install
   ```
2. **데이터베이스 기동**
   ```bash
   docker compose up -d localdb
   ```
3. **Prisma 마이그레이션/시드**
   ```bash
   pnpm db:push   # 스키마 반영
   pnpm db:seed   # (시드가 준비된 경우) 초기 데이터
   pnpm db:gen    # Prisma Client 재생성
   ```
4. **개발 서버 실행 (기본 포트 3001)**
   ```bash
   pnpm dev
   ```
5. **브라우저에서 확인**
   - `http://localhost:3001` : 인증된 사용자 대시보드
   - `http://localhost:3001/sign` : Google 로그인 페이지
   - `http://localhost:3001/my` : 마이페이지

## Prisma & DB 관리 스크립트

| 명령어          | 설명                                               |
| --------------- | -------------------------------------------------- |
| `pnpm db:pull`  | 기존 DB 스키마를 Prisma로 역추출                   |
| `pnpm db:push`  | 현재 Prisma 스키마를 DB에 반영                     |
| `pnpm db:mig`   | `prisma migrate dev` 실행 (마이그레이션 생성/적용) |
| `pnpm db:reset` | 개발 DB 초기화 후 재적용                           |
| `pnpm db:seed`  | `prisma db seed` 실행 (파일 구성 필요)             |
| `pnpm db:gen`   | Prisma Client 재생성                               |

## 개발 편의 스크립트

| 명령어        | 설명                          |
| ------------- | ----------------------------- |
| `pnpm dev`    | Next.js 개발 서버 (PORT=3001) |
| `pnpm build`  | 프로덕션 빌드                 |
| `pnpm start`  | 프로덕션 서버 실행            |
| `pnpm lint`   | Biome 기반 정적 점검          |
| `pnpm format` | Biome 포맷터 (`--write`)      |

## 데이터 동기화 플로우

1. 사용자가 `/sign`에서 Google 로그인을 수행하면 NextAuth가 OAuth code를 교환하여 액세스/리프레시 토큰을 획득합니다.
2. `auth.ts`의 `signIn` 콜백이 수행되며:
   - 사용자 정보를 `member` 테이블에 upsert
   - YouTube Data API (`channels`, `playlists`, `playlistItems`)를 호출해 `channel`, `playlist`, `video` 테이블에 upsert
3. 세션/ JWT 에는 `user.id`, `accessToken` 등을 저장하고, 이후 서버 컴포넌트에서는 `use(auth())`로 보안이 적용된 데이터를 조회합니다.
4. 메인 페이지(`app/page.tsx`)는 `getPlaylistAndVideo` 쿼리로 현재 사용자의 채널 → 플레이리스트 → 영상 데이터를 불러오고, 쿼리스트링(`playlistId`, `videoId`)로 재생 컨텍스트를 제어합니다.

## 문제 해결 가이드

- **401 / 로그인 루프**: `AUTH_SECRET`, `NEXTAUTH_URL`, Google OAuth 승인 도메인이 일치하는지 확인하고, 쿠키/세션을 지운 후 재시도합니다.
- **YouTube API 403**: Cloud Console에서 YouTube Data API v3를 활성화했는지, OAuth 클라이언트가 동일 프로젝트인지 확인합니다.
- **DB 연결 실패**: Docker 컨테이너 상태(`docker compose ps`)와 `.env.local`의 `DATABASE_URL` 호스트/포트가 일치하는지 점검하세요.

## 향후 개선 아이디어

- 재생목록 아이템 삭제 설정
- 재생목록 순서 수정 (드래그 드랍 구현)
- 비로그인 사용자용 기능 추가 (URL기반)
- API호출 최적화 (토큰 최소화)
- 채널 변경 기능 구현
- Prisma Client 싱글톤화 및 캐시 최적가 (`lib/db.ts` TODO)
- 플레이리스트/영상 동기화 상태 UI, 수동 새로고침 트리거
- Next.js Route Handler에 정식 JSON 응답 추가 (`app/api/youtubedata/route.ts`)
- 테스트 코드 및 e2e 시나리오 (Playwright) 도입
- 유저 행동 분석용 추적 추가
