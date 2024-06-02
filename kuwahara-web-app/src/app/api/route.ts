export async function GET(request: Request) {
  console.info("Called route");
  return Response.json({message: "Called Route"});
}
