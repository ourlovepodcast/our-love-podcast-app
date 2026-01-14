// app/api/unlock/route.ts
import { NextResponse } from 'next/server';
import Airtable from 'airtable';

const baseId = process.env.AIRTABLE_BASE_ID;
const base = new Airtable({ 
  apiKey: process.env.AIRTABLE_API_KEY 
}).base(baseId || '');

export async function POST(req: Request) {
  try {
    const { recordId, email, password } = await req.json();

    if (!recordId) {
      return NextResponse.json({ success: false, message: "Error: No Record ID provided." }, { status: 400 });
    }

    const record = await base(process.env.AIRTABLE_TABLE_NAME!).find(recordId);

    if (record.fields.Email === email && record.fields.Password === password) {
      return NextResponse.json({
        success: true,
        data: {
          // REMOVED "(url)" to match your actual Airtable column names
          cover: record.fields['Cover Image'],
          audio: record.fields['Podcast Link'],
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
