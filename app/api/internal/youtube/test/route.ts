import { auth } from "@/lib/auth";
import {
  getChannelByToken,
  getPlaylistByToken,
  getPlaylistItemsByToken,
} from "@/lib/youtube.action";
import { NextRequest, NextResponse } from "next/server";



/*
* how to test api
* just use the endPoint inside
* `${process.env.NEXT_PUBLIC_URL}/api/internal/youtube/test?target=${target}`
* outside example path will be like that
* http://localhost:3001/api/internal/youtube/test?target=channel
*/
export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === "production") return NextResponse.json({error: "Test endpoint not available in production"}, {status: 403})
    process.env.NEXT_PUBLIC_URL
  const session = await auth();
  const target = await req.nextUrl.searchParams.get("target");
  const playlistId = req.nextUrl.searchParams.get("playlistId");

  console.log("=== Youtube Api Test Started ===");
  console.log("Target:", target);
  console.log("Session exists:", !!session);
  console.log("playlistId:", playlistId);

  if (!session || !session?.accessToken) {
    return NextResponse.json({ error: "No valid session" }, { status: 401 });
  }

  try {
    let result;
    const startTime = Date.now();

    switch (target) {
      case "channel": 
        console.log("Testing getChannelByToken...");
        result = await getChannelByToken(session.accessToken);
        break;

      case "playlist":
        console.log("Testing getPlaylistByToken...");
        result = await getPlaylistByToken(session.accessToken);
        break;

      case "playlistItems":
        console.log("Testing getPlaylist Items...")
        if (!playlistId) {
          return NextResponse.json({success: false, error: "playlistId parameter required"}, {status: 400})
        } else result = await getPlaylistItemsByToken({accessToken: session.accessToken, playlistId});
        break;

      default:
        return NextResponse.json({success: false, error: "Invalid target"}, {status: 400})
    }
    const duration = Date.now() - startTime;
    console.log(`Test completed in ${duration}ms`)
    if (result.success) {
      console.log(`Success, Found ${result.items.length} items`);

      return NextResponse.json({
        success: true,
        target,
        itemCount: result.items.length,
        duration: `${duration}ms`,
        sampleData: result.items.slice(0,3),
        allData: result.items,
      })
    } else {
      console.error("Test failed:", result.error);

      return NextResponse.json({
        success: false,
        error: result.error,
        duration: `${duration}ms`,
      }, {status: result.error.status || 500})
    }
  } catch (error) {
    console.error("Test endpoint error:", error)
    
    return NextResponse.json({
      success: false,
      error: "Internal server error",
      details: error instanceof Error ? error.message : String(error),
    }, {
      status: 500
    })
  }
}

// export async function SET(request: NextRequest) {}

// export async function POST(request: NextRequest) {}

// export async function PUT(request: NextRequest) {}

// export async function DELETE(request: NextRequest) {}

