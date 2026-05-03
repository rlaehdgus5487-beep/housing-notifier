import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { HousingEmail } from '@/lib/email/HousingEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, announcements } = body;

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ 
        success: false, 
        error: 'RESEND_API_KEY is not configured in .env.local' 
      }, { status: 500 });
    }

    const { data, error } = await resend.emails.send({
      from: 'Housing Notifier <onboarding@resend.dev>',
      to: email || 'rlaehdgus5487@gmail.com',
      subject: '🏠 오늘의 맞춤 주거 공고 알림',
      react: HousingEmail({ 
        userName: '테스트 사용자',
        announcements: announcements.map((a: { title: string; regionName: string; provider: string; url: string }) => ({
          title: a.title,
          region: a.regionName,
          provider: a.provider,
          url: a.url
        }))
      }),
    });

    if (error) {
      return NextResponse.json({ success: false, error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
