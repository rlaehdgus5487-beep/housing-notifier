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

    if (!process.env.DATABASE_URL) {
      // DB가 아직 연결되지 않은 상태(로컬 테스트)를 위한 처리
      console.log('Mock Subscription:', { email, regions });
      return NextResponse.json({ 
        success: true, 
        message: '현재 DB가 연결되지 않아 임시로 성공 처리되었습니다. 실제 배포 시 DB에 저장됩니다.',
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
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json({ success: false, error: '구독 처리 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
