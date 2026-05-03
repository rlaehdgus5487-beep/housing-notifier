import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, userRegions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const { email, regions } = await request.json();

    if (!email || !regions || regions.length === 0) {
      return NextResponse.json({ success: false, error: '이메일과 관심 지역은 필수입니다.' }, { status: 400 });
    }

    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith('https')) {
      // DB가 아직 연결되지 않았거나 URL 형식이 잘못된 경우 (예: Supabase API URL이 잘못 들어간 경우)
      console.log('Mock Subscription (DB URL missing or wrong format):', { email, regions });
      return NextResponse.json({ 
        success: true, 
        message: '현재 DB 연결 설정이 완료되지 않아 임시로 성공 처리되었습니다. 실제 배포 시 올바른 DATABASE_URL(postgresql://...)이 필요합니다.',
        mock: true 
      });
    }

    // 1. 사용자 찾기 또는 생성
    let user = await db.query.users.findFirst({
      where: eq(users.email, email)
    });

    if (!user) {
      const [newUser] = await db.insert(users).values({ email }).returning();
      user = newUser;
    }

    // 2. 기존 지역 삭제
    await db.delete(userRegions).where(eq(userRegions.userId, user.id));

    // 3. 새로운 지역 삽입
    await db.insert(userRegions).values(
      regions.map((regionName: string) => ({
        userId: user!.id,
        regionName
      }))
    );

    return NextResponse.json({ success: true, message: '구독이 완료되었습니다.' });
  } catch (error: any) {
    console.error('Subscription error:', error);
    return NextResponse.json({ 
      success: false, 
      error: '구독 처리 중 오류가 발생했습니다.',
      details: error.message || String(error)
    }, { status: 500 });
  }
}
