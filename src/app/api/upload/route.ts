import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";

export async function POST(req: NextRequest) {
    const data = await req.formData();
    // console.log(data)
    const file: File | any = data.get('file');
    if (!file) {
        return NextResponse.json(
            { success: false, },
            { status: 404 }
        )
    }
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes)

    const path = join('src', 'temp', "uploaded.pdf")
    await writeFile(path, buffer);

    return NextResponse.json({ success: true }, { status: 200 })

}