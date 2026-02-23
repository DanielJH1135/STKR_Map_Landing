import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "스트라우만 파트너 치과 찾기",
  description: "전 세계 1위 프리미엄 임플란트 파트너를 확인하세요.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        {/* 브라우저가 네이버에 보내는 주소 형식을 안정화시키는 태그입니다 */}
        <meta name="referrer" content="no-referrer-when-downgrade" />
      </head>
      <body>
        {children}
        <Script
          src="https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=d5xf9ixwcd"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}