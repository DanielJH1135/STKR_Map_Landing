import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "스트라우만 공식 파트너 치과 찾기",
  description: "전 세계 1위 프리미엄 임플란트, 내 주변 스트라우만 치과를 확인하세요.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        {children}
        {/* 카카오 지도 API - autoload=false를 제거하여 가장 안정적으로 불러옵니다 */}
        <Script
          src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=a6b2a62a3c249934be77b4e192f17c19&libraries=services,clusterer"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}