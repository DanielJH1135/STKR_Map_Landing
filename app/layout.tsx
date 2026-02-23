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
      <body>
        {children}
        {/* 네이버 지도 API: 제공해주신 ID(d5xf9ixwcd)를 정확히 적용했습니다. */}
        <Script
          src="https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=d5xf9ixwcd&submodules=geocoder"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}