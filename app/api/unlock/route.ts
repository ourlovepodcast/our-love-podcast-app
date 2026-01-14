// app/api/unlock/route.ts
import { NextResponse } from 'next/server';
import Airtable from 'airtable';

const base = new Airtable({ 
  apiKey: process.env.AIRTABLE_API_KEY 
}).base(process.env.AIRTABLE_BASE_ID!);

export async function POST(req: Request) {
  try {
    const { recordId, email, password } = await req.json();

    // 1. Fetch specific row by RECORD_ID() from URL
    const record = await base(process.env.AIRTABLE_TABLE_NAME!).find(recordId);

    // 2. Exact match check using your field names
    // Note: Use exact case-sensitive names from your Airtable columns
    if (record.fields.Email === email && record.fields.Password === password) {
      return NextResponse.json({
        success: true,
        data: {
          cover: record.fields['Cover Image (url)'],
          audio: record.fields['Podcast Link (url)'],
          message: record.fields['Personal Message']
        }
      });
    }

    return NextResponse.json({ 
      success: false, 
      message: "Invalid Email or Password" 
    }, { status: 401 });

  } catch (error: any) {
    // This logs the REAL error to your Vercel logs for you to see
    console.error("DEBUG - Airtable Error:", error);

    // This sends the REAL error message back to your screen so you can read it
    return NextResponse.json({ 
      success: false, 
      message: `Airtable Error: ${error.message || "Record not found"}` 
    }, { status: 500 });
  }
}
