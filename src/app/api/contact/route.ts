import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Simple validation schema check
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Skeleton handler: In production, send email (e.g. Resend, Sendgrid) or insert into database.
    console.log("Contact submission payload:", { name, email, message });

    return NextResponse.json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("API Error in contact route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
