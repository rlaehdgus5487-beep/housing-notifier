"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, MapPin, ExternalLink, Calendar, Mail, Loader2 } from "lucide-react";
import { RegionSelector } from "@/components/RegionSelector";
import { cn } from "@/lib/utils";

// Mock data type
interface Announcement {
  id: number;
  title: string;
  provider: 'LH' | 'SH' | 'GH';
  regionName: string;
  url: string;
  publishedDate: string;
  startDate: string;
  endDate: string;
  recruitmentCount: number;
  announcementType: '청년' | '신혼부부' | '고령자' | '일반';
  propertyLimit: string;
  incomeLimit: string;
  isNew?: boolean;
}

// Generate mock data for the last 2 weeks
const generateMockData = (): Announcement[] => {
  const providers: ('LH' | 'SH' | 'GH')[] = ['LH', 'SH', 'GH'];
  const regions = [
    "서울특별시 강남구", "서울특별시 서초구", "서울특별시 송파구",
    "경기도 성남시", "경기도 수원시", "경기도 용인시",
    "경기도 하남시", "경기도 광명시", "인천광역시"
  ];
  const types: ('청년' | '신혼부부' | '고령자' | '일반')[] = ['청년', '신혼부부', '고령자', '일반'];
  
  const data: Announcement[] = [];
  const now = new Date();
  
  for (let i = 0; i < 20; i++) {
    const pubDate = new Date();
    pubDate.setDate(now.getDate() - Math.floor(Math.random() * 14)); // Last 14 days
    
    const startDate = new Date(pubDate);
    startDate.setDate(pubDate.getDate() + 7);
    
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 14);
    
    const region = regions[i % regions.length];
    const provider = providers[i % providers.length];
    const type = types[i % types.length];
    const isNew = i < 3; // First 3 are always new for demo
    
    data.push({
      id: i,
      title: `[${i % 2 === 0 ? '행복주택' : '국민임대'}] ${region} ${type} 매입임대주택 예비입주자 모집`,
      provider,
      regionName: region,
      url: provider === 'LH' ? 'https://apply.lh.or.kr' : provider === 'SH' ? 'https://www.i-sh.co.kr' : 'https://apply.gh.or.kr',
      publishedDate: pubDate.toISOString().split('T')[0],
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      recruitmentCount: Math.floor(Math.random() * 100) + 10,
      announcementType: type,
      propertyLimit: type === '청년' ? '2억 7,300만원 이하' : '3억 4,500만원 이하',
      incomeLimit: type === '청년' ? '월평균 소득 100% 이하' : '월평균 소득 120% 이하',
      isNew
    });
  }
  
  return data.sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
};

export default function Home() {
  const [selectedRegions, setSelectedRegions] = React.useState<string[]>(["서울특별시 강남구", "경기도 성남시"]);
  const [announcements, setAnnouncements] = React.useState<Announcement[]>([]);
  const [mounted, setMounted] = React.useState(false);
  const [isRegionSelectorOpen, setIsRegionSelectorOpen] = React.useState(false);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAnnouncements(generateMockData());
    setMounted(true);
  }, []);
  
  const [email, setEmail] = React.useState("");
  const [subscribing, setSubscribing] = React.useState(false);

  const handleSubscribe = async () => {
    if (!email) {
      alert('이메일을 입력해주세요.');
      return;
    }
    
    setSubscribing(true);
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          regions: selectedRegions
        })
      });
      const data = await response.json();
      if (data.success) {
        alert(data.message || '구독이 성공적으로 완료되었습니다! 매일 낮 12시에 알림을 보내드립니다.');
      } else {
        alert('구독 실패: ' + (data.error || '알 수 없는 에러'));
      }
    } catch (error) {
      alert('에러 발생: ' + String(error));
    } finally {
      setSubscribing(false);
    }
  };

  if (!mounted) {
    return null;
  }

  const filteredAnnouncements = announcements.filter(a => 
    selectedRegions.some(r => a.regionName.includes(r.split(" ")[1] || r))
  );

  const newAnnouncements = announcements.filter(a => a.isNew);

  return (
    <main className="min-h-screen bg-slate-50/50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-blue-600 p-1.5 text-white">
              <Bell size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">주거알리미</h1>
          </div>
          <div className="flex items-center gap-3">
            <RegionSelector 
              selectedRegions={selectedRegions} 
              onSelectedRegionsChange={setSelectedRegions} 
              open={isRegionSelectorOpen}
              onOpenChange={setIsRegionSelectorOpen}
            />
            <Button size="sm">로그인</Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 pt-8">
        <div className="grid gap-8 md:grid-cols-[300px_1fr]">
          {/* Sidebar / Preferences Summary */}
          <aside className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">내 구독 정보</CardTitle>
                <CardDescription>매일 낮 12시 알림 전송</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">관심 지역</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedRegions.map(region => (
                      <Badge key={region} variant="secondary">{region.split(" ")[1] || region}</Badge>
                    ))}
                  </div>
                </div>
                <Button 
                  className="w-full" 
                  variant="outline" 
                  onClick={() => setIsRegionSelectorOpen(true)}
                >
                  설정 변경
                </Button>
                
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <p className="text-sm font-medium text-muted-foreground">이메일 구독</p>
                  <input 
                    type="email" 
                    placeholder="이메일을 입력하세요" 
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Button 
                    className="w-full gap-2" 
                    variant="default"
                    onClick={handleSubscribe}
                    disabled={subscribing || !email}
                  >
                    {subscribing ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
                    구독하기
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-blue-50 border-blue-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-blue-800">최근 2주 통계</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-900">{filteredAnnouncements.length}건</p>
                <p className="text-xs text-blue-700 mt-1">선택하신 지역에서 새로운 공고가 등록되었습니다.</p>
              </CardContent>
            </Card>
          </aside>

          {/* Main Feed */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">최신 공고 피드</h2>
              <div className="flex gap-2">
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">LH</Badge>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none">SH</Badge>
                <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-none">GH</Badge>
              </div>
            </div>

            <Tabs defaultValue="match" className="w-full">
              <TabsList className="grid w-full grid-cols-3 max-w-[400px]">
                <TabsTrigger value="match">맞춤 공고 ({filteredAnnouncements.length})</TabsTrigger>
                <TabsTrigger value="all">전체 공고 ({announcements.length})</TabsTrigger>
                <TabsTrigger value="new">신규 ({newAnnouncements.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="match" className="mt-6 space-y-4">
                {filteredAnnouncements.length > 0 ? (
                  filteredAnnouncements.map((announcement) => (
                    <AnnouncementCard key={announcement.id} announcement={announcement} highlight />
                  ))
                ) : (
                  <div className="py-20 text-center">
                    <p className="text-muted-foreground text-lg">선택하신 지역의 공고가 없습니다.</p>
                    <p className="text-sm text-muted-foreground mt-1">지역 설정을 변경해 보세요.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="all" className="mt-6 space-y-4">
                {announcements.map((announcement) => (
                  <AnnouncementCard key={announcement.id} announcement={announcement} />
                ))}
              </TabsContent>

              <TabsContent value="new" className="mt-6 space-y-4">
                {newAnnouncements.map((announcement) => (
                  <AnnouncementCard key={announcement.id} announcement={announcement} highlight />
                ))}
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </div>
    </main>
  );
}

function AnnouncementCard({ announcement, highlight = false }: { announcement: Announcement, highlight?: boolean }) {
  return (
    <Card className={cn("transition-all hover:shadow-md", highlight && "border-l-4 border-l-blue-500")}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className={cn(
                  "font-semibold",
                  announcement.provider === 'LH' ? "text-blue-600 border-blue-200" : 
                  announcement.provider === 'SH' ? "text-green-600 border-green-200" : 
                  "text-orange-600 border-orange-200"
                )}
              >
                {announcement.provider} 공사
              </Badge>
              <Badge variant="secondary" className="font-medium bg-slate-100 text-slate-700 border-none">
                {announcement.announcementType}
              </Badge>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar size={12} /> {announcement.publishedDate} 게시
              </span>
            </div>
            <CardTitle className="text-xl leading-snug">
              {announcement.title}
            </CardTitle>
          </div>
          <a
            href={announcement.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "shrink-0")}
          >
            <ExternalLink size={18} />
          </a>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin size={14} />
            <span>{announcement.regionName}</span>
          </div>
          <div className="h-1 w-1 rounded-full bg-slate-300 hidden sm:block" />
          <div className="flex items-center gap-1">
            <Calendar size={14} className="text-blue-500" />
            <span className="font-medium text-slate-700">접수기간: {announcement.startDate} ~ {announcement.endDate}</span>
          </div>
          <div className="h-1 w-1 rounded-full bg-slate-300 hidden sm:block" />
          <span>모집인원: {announcement.recruitmentCount}호</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">소득 조건</p>
            <p className="text-sm text-slate-700">{announcement.incomeLimit}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">재산 조건</p>
            <p className="text-sm text-slate-700">{announcement.propertyLimit}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
