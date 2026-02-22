'use client';
import React, { useState, useEffect } from 'react';
import { Map, MapMarker, MarkerClusterer, useKakaoLoader } from "react-kakao-maps-sdk";
import { Award, ShieldCheck, MapPin } from 'lucide-react';

export default function LandingPage() {
  // 1. 카카오 지도 엔진 로딩 (오직 여기서만 호출합니다)
  const [loading, error] = useKakaoLoader({
    appkey: "a6b2a62a3c249934be77b4e192f17c19", // JavaScript 키
    libraries: ["services", "clusterer"],
  });

  const [clinics, setClinics] = useState([]);
  const [position, setPosition] = useState({ lat: 37.5665, lng: 126.9780 });

  useEffect(() => {
    // 2. 데이터 로드 (5,103건)
    fetch('/clinics.json')
      .then(res => res.json())
      .then(data => setClinics(data))
      .catch(err => console.error("데이터 로드 실패:", err));

    // 3. 현재 위치 파악
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
  }, []);

  // 지도 엔진 로딩 중일 때
  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#002B45] text-white">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-400 mb-4"></div>
      <p className="text-sm font-light tracking-widest uppercase">Initializing Premium Map...</p>
    </div>
  );

  // 로딩 에러 발생 시 (image_223239 에러 대응)
  if (error) return (
    <div className="flex flex-col items-center justify-center h-screen text-[#002B45] p-6 text-center">
      <p className="font-bold text-lg mb-2">지도 서버 연결 실패</p>
      <p className="text-sm text-slate-500 mb-4">광고 차단 확장 프로그램(AdBlock 등)이 켜져 있다면 꺼주세요.</p>
      <button onClick={() => window.location.reload()} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">새로고침</button>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="bg-[#002B45] text-white py-12 px-6 text-center border-b-4 border-blue-600">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex justify-center items-center gap-2">
            <ShieldCheck className="text-blue-400" size={20} />
            <span className="text-blue-400 font-bold tracking-[0.2em] text-[10px] uppercase">Straumann Global Partner</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">내 주변 스트라우만 치과 찾기</h1>
          <p className="text-slate-300 text-lg font-light italic opacity-90">"70년 역사의 정밀함, 전 세계 전문가가 선택한 프리미엄"</p>
        </div>
      </header>

      <main className="flex-1 relative w-full bg-slate-100 min-h-[700px]">
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

        {/* 하단 플로팅 정보 배너 */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-30">
          <div className="bg-white/95 backdrop-blur-md shadow-2xl rounded-[2.5rem] p-7 border border-blue-50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-[#002B45]">
                <Award className="text-blue-600" size={20} />
                <span className="font-extrabold text-[11px] uppercase tracking-tighter">Official Partner Network</span>
              </div>
            </div>
            <p className="text-slate-600 text-[15px] mb-3 leading-relaxed">
              현재 전국 <span className="text-blue-600 font-black text-2xl underline decoration-blue-200 decoration-4 underline-offset-4">{clinics.length.toLocaleString()}</span>곳의 
              스트라우만 파트너사가 함께합니다.
            </p>
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <MapPin size={12} className="text-blue-300" /> 마커를 클릭하여 상세 주소를 확인하세요.
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-slate-900 py-6 text-center">
        <p className="text-[10px] text-slate-500 font-bold tracking-[0.4em] uppercase opacity-40">© 2026 Straumann Group Korea</p>
      </footer>
    </div>
  );
}