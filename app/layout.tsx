import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "스트라우만 공식 파트너 치과 찾기",
  description: "전 세계 1위 프리미엄 임플란트, 스트라우만 파트너 치과를 확인하세요.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}