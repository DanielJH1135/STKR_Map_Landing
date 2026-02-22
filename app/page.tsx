'use client';
import React, { useState, useEffect } from 'react';
import { Map, MapMarker, MarkerClusterer } from "react-kakao-maps-sdk";
import { Award } from 'lucide-react';

export default function LandingPage() {
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

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="bg-slate-900 text-white py-12 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="bg-blue-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Premium Straumann</span>
          <h1 className="text-3xl md:text-5xl font-bold mt-4 mb-2 tracking-tight">내 주변 스트라우만 치과 찾기</h1>
          <p className="text-slate-400 text-lg font-light">전 세계 1위 스트라우만의 정밀함을 가까운 파트너 치과에서 경험하세요.</p>
        </div>
      </header>
      <main className="flex-1 relative">
        <Map center={position} style={{ width: "100%", height: "650px" }} level={4}>
          <MarkerClusterer averageCenter={true} minLevel={6}>
            {clinics.map((clinic: any) => (
              <MapMarker key={clinic.id} position={{ lat: clinic.lat, lng: clinic.lng }} onClick={() => alert(`${clinic.name}\n${clinic.address}`)} />
            ))}
          </MarkerClusterer>
        </Map>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-white/95 backdrop-blur shadow-2xl rounded-2xl p-5 border border-slate-100 z-10">
          <div className="flex items-center gap-2 mb-1 text-blue-600">
            <Award size={18} />
            <span className="font-bold text-sm">스트라우만 공식 인증 파트너</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">지도의 마커를 클릭하면 치과 정보를 확인할 수 있습니다. 총 {clinics.length}곳의 파트너사가 함께합니다.</p>
        </div>
      </main>
    </div>
  );
}