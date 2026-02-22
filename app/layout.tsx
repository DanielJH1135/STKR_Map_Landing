import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "내 주변 스트라우만 파트너 치과 찾기",
  description: "전 세계 1위 스트라우만 임플란트 파트너 치과를 확인하세요.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        {children}
        {/* 'autoload=false'를 제거하고 가장 기본적인 방식으로 불러옵니다. */}
        <Script
          src="//dapi.kakao.com/v2/maps/sdk.js?appkey=a6b2a62a3c249934be77b4e192f17c19&libraries=services,clusterer"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}