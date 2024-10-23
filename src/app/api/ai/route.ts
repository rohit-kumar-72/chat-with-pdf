import { getAnswer } from "@/utils/chat";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { question } = await req.json();
    try {
        const answer = await getAnswer(question);
        return NextResponse.json({ success: true, data: answer }, { status: 200 })
    } catch (error: any) {
        console.log("ERROR FETCHING ANSWER ", error)
        return NextResponse.json({ success: false, message: error.message }, { status: 400 })
    }
}