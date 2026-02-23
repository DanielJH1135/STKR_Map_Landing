'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Award, ShieldCheck, MapPin } from 'lucide-react';

export default function LandingPage() {
  const mapRef = useRef<any>(null);
  const [clinics, setClinics] = useState([]);
  const [userPos, setUserPos] = useState({ lat: 37.5665, lng: 126.9780 });

  useEffect(() => {
    // 1. 데이터 불러오기
    fetch('/clinics.json')
      .then(res => res.json())
      .then(data => setClinics(data))
      .catch(err => console.error("데이터 로드 실패:", err));

    // 2. 내 위치 파악
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }

    // 3. 지도 초기화
    if (typeof window !== "undefined" && window.naver && window.naver.maps) {
      const mapOptions = {
        center: new window.naver.maps.LatLng(userPos.lat, userPos.lng),
        zoom: 12,
        logoControl: false, // 로고 컨트롤 숨김 (프리미엄 감각)
      };
      mapRef.current = new window.naver.maps.Map('map', mapOptions);
    }
  }, [userPos.lat, userPos.lng]);

  useEffect(() => {
    // 4. 데이터 로드 완료 후 마커 생성
    if (mapRef.current && clinics.length > 0) {
      clinics.forEach((clinic: any) => {
        const marker = new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(clinic.lat, clinic.lng),
          map: mapRef.current,
          // 마커 디자인 커스텀 가능
          icon: {
            content: '<div style="width:12px; height:12px; background:#3b82f6; border:2px solid white; border-radius:50%; box-shadow:0 0 5px rgba(0,0,0,0.3);"></div>',
            anchor: new window.naver.maps.Point(6, 6)
          }
        });

        window.naver.maps.Event.addListener(marker, 'click', () => {
          alert(`[스트라우만 파트너]\n${clinic.name}\n${clinic.address}`);
        });
      });
    }
  }, [clinics]);

  return (
    <div className="flex flex-col min-h-screen bg-white text-[#002B45]">
      <header className="bg-[#002B45] text-white py-12 px-6 text-center border-b-4 border-blue-600 shadow-xl">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex justify-center items-center gap-2">
            <ShieldCheck className="text-blue-400" size={20} />
            <span className="text-blue-400 font-bold tracking-[0.2em] text-[10px] uppercase font-mono">Premium Straumann Partner</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">내 주변 스트라우만 치과 찾기</h1>
          <p className="text-slate-300 text-lg font-light italic">"70년 정밀 공학의 결정체, 가까운 파트너 치과에서 경험하세요."</p>
        </div>
      </header>

      <main className="flex-1 relative w-full h-[700px] bg-slate-100">
        <div id="map" className="w-full h-full shadow-inner" />

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-30">
          <div className="bg-white/95 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-[2.5rem] p-8 border border-blue-50">
            <div className="flex items-center gap-2 mb-4">
              <Award className="text-blue-600" size={22} />
              <span className="font-extrabold text-[12px] uppercase tracking-tighter text-blue-900">Verified Partner Network</span>
            </div>
            <p className="text-slate-600 text-[16px] mb-4 leading-relaxed font-medium">
              현재 전국 <span className="text-blue-600 font-black text-2xl underline decoration-blue-200 decoration-4 underline-offset-4">{clinics.length.toLocaleString()}</span>곳의 
              스트라우만 파트너사가 실시간 확인되었습니다.
            </p>
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 border-t pt-4 border-slate-100">
              <MapPin size={12} className="text-blue-400" /> 지도를 드래그하여 주변 치과를 확인하세요.
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-slate-900 py-8 text-center border-t border-slate-800">
        <p className="text-[10px] text-slate-500 font-bold tracking-[0.4em] uppercase opacity-50">© 2026 Straumann Group Korea · Test Demo Build</p>
      </footer>
    </div>
  );
}