import {
  Html,
  Body,
  Head,
  Heading,
  Hr,
  Container,
  Preview,
  Section,
  Text,
  Link,
  Button,
} from "@react-email/components";
import * as React from "react";

interface HousingEmailProps {
  userName?: string;
  announcements: {
    title: string;
    region: string;
    provider: string;
    url: string;
  }[];
}

export const HousingEmail = ({
  userName = "고객",
  announcements = [],
}: HousingEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>오늘의 맞춤형 주거 공고가 도착했습니다.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>🏠 주거알리미 맞춤 공고</Heading>
          <Text style={text}>
            안녕하세요 {userName}님, 설정하신 관심 지역의 새로운 공고를 알려드립니다.
          </Text>
          
          <Section style={section}>
            {announcements.length > 0 ? (
              announcements.map((item, index) => (
                <div key={index} style={card}>
                  <Text style={providerBadge}>{item.provider}</Text>
                  <Text style={cardTitle}>{item.title}</Text>
                  <Text style={cardRegion}>📍 {item.region}</Text>
                  <Button
                    style={button}
                    href={item.url}
                  >
                    공고 상세보기
                  </Button>
                  {index < announcements.length - 1 && <Hr style={hr} />}
                </div>
              ))
            ) : (
              <Text style={text}>새로운 맞춤 공고가 없습니다.</Text>
            )}
          </Section>

          <Hr style={hr} />
          <Text style={footer}>
            본 메일은 주거알리미 서비스에 의해 자동으로 발송되었습니다.
            알림 설정을 변경하시려면 <Link href="#">여기를 클릭</Link>하세요.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const section = {
  padding: "0 48px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "30px 0",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  padding: "0 48px",
};

const card = {
  padding: "16px 0",
};

const providerBadge = {
  display: "inline-block",
  padding: "4px 8px",
  backgroundColor: "#e1e7ff",
  color: "#3b82f6",
  borderRadius: "4px",
  fontSize: "12px",
  fontWeight: "bold",
  margin: "0 0 8px 0",
};

const cardTitle = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#1f2937",
  margin: "8px 0",
};

const cardRegion = {
  fontSize: "14px",
  color: "#6b7280",
  margin: "4px 0 16px 0",
};

const button = {
  backgroundColor: "#3b82f6",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
  padding: "12px 12px",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  textAlign: "center" as const,
  padding: "0 48px",
};

export default HousingEmail;
