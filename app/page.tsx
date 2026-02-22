'use client';
import React, { useState, useEffect } from 'react';
import { Map, MapMarker, MarkerClusterer } from "react-kakao-maps-sdk";
import { Award, Search, MapPin, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
  const [clinics, setClinics] = useState([]);
  const [position, setPosition] = useState({ lat: 37.5665, lng: 126.9780 });

  useEffect(() => {
    // 데이터 로드
    fetch('/clinics.json')
      .then(res => res.json())
      .then(data => setClinics(data))
      .catch(err => console.error("데이터 로드 에러:", err));

    // 현재 위치 파악
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      {/* 프리미엄 헤더: 스트라우만 아이덴티티 강조 */}
      <header className="bg-[#002B45] text-white py-10 px-6 text-center shadow-lg">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex justify-center items-center gap-2 mb-2">
            <ShieldCheck className="text-blue-400" size={24} />
            <span className="text-blue-400 font-bold tracking-[0.2em] text-xs uppercase">Straumann Global Partner</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">내 주변 스트라우만 치과 찾기</h1>
          <p className="text-slate-300 text-lg font-light max-w-2xl mx-auto leading-relaxed">
            70년 역사의 정밀함, 전 세계 전문가가 선택한 <br className="hidden md:block" /> 
            프리미엄 스트라우만 임플란트 파트너를 지금 만나보세요.
          </p>
        </div>
      </header>

      {/* 지도 섹션: 높이를 명시적으로 700px 고정 */}
      <main className="flex-1 relative w-full bg-slate-100" style={{ minHeight: '700px' }}>
        <Map 
          center={position} 
          style={{ width: "100%", height: "700px" }} 
          level={5}
        >
          <MarkerClusterer 
            averageCenter={true} 
            minLevel={6}
            styles={[{
              width: '53px', height: '52px',
              background: 'rgba(0, 43, 69, 0.9)',
              color: '#fff',
              textAlign: 'center',
              lineHeight: '54px',
              borderRadius: '50%',
              fontWeight: 'bold',
              border: '2px solid #3b82f6'
            }]}
          >
            {clinics.map((clinic: any) => (
              <MapMarker
                key={clinic.id}
                position={{ lat: Number(clinic.lat), lng: Number(clinic.lng) }}
                onClick={() => alert(`${clinic.name}\n${clinic.address}`)}
                image={{
                  src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
                  size: { width: 24, height: 35 }
                }}
              />
            ))}
          </MarkerClusterer>
        </Map>

        {/* 하단 플로팅 정보 배너 */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-20">
          <div className="bg-white/95 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-3xl p-6 border border-blue-50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-[#002B45]">
                <Award className="text-blue-600" size={20} />
                <span className="font-extrabold text-sm uppercase tracking-tighter">Official Partner Network</span>
              </div>
              <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-md">2026 Updated</span>
            </div>
            <p className="text-slate-600 text-sm leading-snug mb-3">
              현재 전국 <span className="text-blue-600 font-black text-lg underline decoration-blue-200 underline-offset-4">{clinics.length.toLocaleString()}</span>곳의 
              스트라우만 공식 인증 치과가 검색되었습니다.
            </p>
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <MapPin size={10} /> 마커를 클릭하면 상세 주소를 확인할 수 있습니다.
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-slate-900 py-8 px-6 text-center border-t border-slate-800">
        <p className="text-[10px] text-slate-500 font-semibold tracking-[0.3em] uppercase">
          Straumann Group Korea · Premium Implant Solutions
        </p>
      </footer>
    </div>
  );
}