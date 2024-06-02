import { NextResponse } from "next/server";

export async function GET(request: Request) {
  console.info("Called route");
  return NextResponse.json({message: "Called route"});
}
