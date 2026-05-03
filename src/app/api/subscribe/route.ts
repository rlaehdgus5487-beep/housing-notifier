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

    const dbUrl = process.env.DATABASE_URL?.replace(/["']/g, ''); // 따옴표 제거

    if (!dbUrl || dbUrl.startsWith('https')) {
      return NextResponse.json({ 
        success: false, 
        error: '데이터베이스 연결 설정 오류',
        details: 'DATABASE_URL이 올바르지 않습니다. https://... 형식이 아닌 postgresql://... 형식의 DB 접속 주소가 필요합니다.'
      }, { status: 400 });
    }

    // 1. 사용자 찾기 또는 생성
    let user;
    try {
      user = await db.query.users.findFirst({
        where: eq(users.email, email)
      });
    } catch (dbError: any) {
      console.error('Database connection error:', dbError);
      return NextResponse.json({ 
        success: false, 
        error: '데이터베이스 연결 실패',
        details: '테이블이 존재하지 않거나 DB 접속 정보가 틀립니다. npx drizzle-kit push를 실행했는지 확인하세요. 에러: ' + dbError.message
      }, { status: 500 });
    }

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
