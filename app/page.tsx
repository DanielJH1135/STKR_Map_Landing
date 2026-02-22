'use client';
import React, { useState, useEffect } from 'react';
import { Map, MapMarker, MarkerClusterer } from "react-kakao-maps-sdk";
import { Award, ShieldCheck, MapPin } from 'lucide-react';

export default function LandingPage() {
  const [clinics, setClinics] = useState([]);
  const [position, setPosition] = useState({ lat: 37.5665, lng: 126.9780 });
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    // 1. 데이터 로드
    fetch('/clinics.json')
      .then(res => res.json())
      .then(data => setClinics(data))
      .catch(err => console.error("데이터 로드 실패:", err));

    // 2. 카카오 지도 엔진이 완전히 로드될 때까지 반복 체크
    const checkKakao = setInterval(() => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          setIsMapReady(true);
          clearInterval(checkKakao);
        });
      }
    }, 100);

    // 3. 내 위치 파악
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
    return () => clearInterval(checkKakao);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 프리미엄 헤더 */}
      <header className="bg-[#002B45] text-white py-12 px-6 text-center border-b-4 border-blue-600">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex justify-center items-center gap-2">
            <ShieldCheck className="text-blue-400" size={20} />
            <span className="text-blue-400 font-bold tracking-[0.2em] text-[10px] uppercase">Straumann Global Partner</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">내 주변 스트라우만 치과 찾기</h1>
          <p className="text-slate-300 text-lg font-light italic opacity-90">"70년 역사의 정밀함, 전 세계 전문가가 선택한 프리미엄"</p>
        </div>
      </header>

      {/* 지도 섹션: 높이를 고정하고 지도가 준비되었을 때만 렌더링 */}
      <main className="flex-1 relative w-full bg-slate-100 min-h-[600px]">
        {isMapReady ? (
          <Map 
            center={position} 
            style={{ width: "100%", height: "700px" }} 
            level={5}
          >
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
        ) : (
          <div className="flex items-center justify-center h-[700px] bg-slate-50 text-slate-400">
            지도를 불러오는 중입니다...
          </div>
        )}

        {/* 하단 플로팅 정보 카드 */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-30">
          <div className="bg-white/95 backdrop-blur-md shadow-2xl rounded-[2rem] p-6 border border-blue-50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-[#002B45]">
                <Award className="text-blue-600" size={18} />
                <span className="font-bold text-xs uppercase tracking-tighter">Official Partner Network</span>
              </div>
            </div>
            <p className="text-slate-600 text-sm mb-2 leading-relaxed">
              전국 <span className="text-blue-600 font-black text-xl underline decoration-blue-200 decoration-4">{clinics.length.toLocaleString()}</span>곳의 
              스트라우만 파트너사가 함께합니다.
            </p>
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <MapPin size={10} /> 마커를 클릭하면 상세 주소를 볼 수 있습니다.
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-slate-900 py-6 text-center">
        <p className="text-[10px] text-slate-500 font-bold tracking-[0.4em] uppercase opacity-50">© 2026 Straumann Group Korea</p>
      </footer>
    </div>
  );
}