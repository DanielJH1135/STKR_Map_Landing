import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "스트라우만 공식 파트너 치과 찾기",
  description: "전 세계 1위 프리미엄 임플란트 파트너를 확인하세요.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        {children}
        {/* 제공해주신 ID d5xf9ixwcd를 시스템적으로 가장 안전하게 불러옵니다 */}
        <Script
          src="https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=d5xf9ixwcd&submodules=geocoder"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}