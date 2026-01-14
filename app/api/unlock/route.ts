// app/api/unlock/route.ts
import { NextResponse } from 'next/server';
import Airtable from 'airtable';

// Validate that Base ID exists to prevent initialization errors
const baseId = process.env.AIRTABLE_BASE_ID;
if (!baseId) {
  console.error("CRITICAL: AIRTABLE_BASE_ID is missing from environment variables.");
}

const base = new Airtable({ 
  apiKey: process.env.AIRTABLE_API_KEY 
}).base(baseId || '');

export async function POST(req: Request) {
  try {
    const { recordId, email, password } = await req.json();

    // Safety check: Ensure recordId was actually received
    if (!recordId) {
      return NextResponse.json({ success: false, message: "Error: No Record ID provided." }, { status: 400 });
    }

    // 1. Fetch specific row by RECORD_ID() from URL
    const record = await base(process.env.AIRTABLE_TABLE_NAME!).find(recordId);

    // 2. Exact match check using your field names
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

    return NextResponse.json({ success: false, message: "Invalid Email or Password" }, { status: 401 });

  } catch (error: any) {
    console.error("DEBUG - Airtable Error:", error);
    return NextResponse.json({ 
      success: false, 
      message: `Airtable Error: ${error.message || "Record not found"}` 
    }, { status: 500 });
  }
}
