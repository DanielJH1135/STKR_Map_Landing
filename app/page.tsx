'use client';
import React, { useState, useEffect } from 'react';
import { Map, MapMarker, MarkerClusterer, useKakaoLoader } from "react-kakao-maps-sdk";
import { Award, ShieldCheck, MapPin } from 'lucide-react';

export default function LandingPage() {
  // 1. 카카오 지도 전용 로더 사용 (에러 방지 핵심)
  const [loading, error] = useKakaoLoader({
    appkey: "a6b2a62a3c249934be77b4e192f17c19", // 이미지에서 확인한 JS 키
    libraries: ["services", "clusterer"],
  });

  const [clinics, setClinics] = useState([]);
  const [position, setPosition] = useState({ lat: 37.5665, lng: 126.9780 });

  useEffect(() => {
    fetch('/clinics.json')
      .then(res => res.json())
      .then(data => setClinics(data))
      .catch(err => console.error("데이터 로딩 실패:", err));

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
  }, []);

  // 지도가 로딩 중일 때 보여줄 화면
  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#002B45] text-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400 mb-4"></div>
      <p className="text-sm font-light tracking-widest uppercase">Map Engine Loading...</p>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="bg-[#002B45] text-white py-10 px-6 text-center border-b-4 border-blue-600">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex justify-center items-center gap-2">
            <ShieldCheck className="text-blue-400" size={20} />
            <span className="text-blue-400 font-bold tracking-[0.2em] text-[10px] uppercase">Straumann Global Partner</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">내 주변 스트라우만 치과 찾기</h1>
          <p className="text-slate-300 text-base md:text-lg font-light italic">"70년 역사의 정밀함, 전 세계 전문가가 선택한 프리미엄"</p>
        </div>
      </header>

      <main className="flex-1 relative w-full h-[700px]">
        <Map center={position} style={{ width: "100%", height: "700px" }} level={5}>
          <MarkerClusterer averageCenter={true} minLevel={6}>
            {clinics.map((clinic: any) => (
              <MapMarker
                key={clinic.id}
                position={{ lat: Number(clinic.lat), lng: Number(clinic.lng) }}
                onClick={() => alert(`${clinic.name}\n${clinic.address}`)}
              />
            ))}
          </MarkerClusterer>
        </Map>

        {/* 하단 플로팅 카드 */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-20">
          <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-3xl p-6 border border-blue-50 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Award className="text-blue-600" size={18} />
              <span className="font-bold text-xs text-slate-800 uppercase tracking-tighter text-blue-600">Official Partner Network</span>
            </div>
            <p className="text-slate-600 text-sm mb-1 font-medium italic">
              전국 <span className="text-blue-600 font-black text-xl">{clinics.length.toLocaleString()}</span>곳의 파트너사가 함께합니다.
            </p>
            <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
              <MapPin size={10} /> 마커를 클릭하여 상세 위치를 확인하세요.
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-slate-900 py-6 text-center border-t border-slate-800">
        <p className="text-[9px] text-slate-500 font-bold tracking-[0.4em] uppercase">© 2026 Straumann Group Korea</p>
      </footer>
    </div>
  );
}