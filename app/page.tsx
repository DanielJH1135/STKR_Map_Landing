'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Award, ShieldCheck, MapPin } from 'lucide-react';

// TypeScript 빌드 에러 방지
declare global {
  interface Window {
    naver: any;
  }
}

export default function LandingPage() {
  const mapRef = useRef<any>(null);
  const [clinics, setClinics] = useState([]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    // 1. 5,103건 데이터 로드
    fetch('/clinics.json')
      .then(res => res.json())
      .then(data => setClinics(data))
      .catch(err => console.error("Data Load Error:", err));

    // 2. 네이버 지도 엔진 로딩 대기
    const checkNaver = setInterval(() => {
      if (window.naver && window.naver.maps) {
        setIsMapLoaded(true);
        clearInterval(checkNaver);
      }
    }, 200);
    return () => clearInterval(checkNaver);
  }, []);

  useEffect(() => {
    // 3. 엔진과 데이터가 모두 준비되면 지도 그리기
    if (isMapLoaded && clinics.length > 0 && !mapRef.current) {
      const mapOptions = {
        center: new window.naver.maps.LatLng(37.5665, 126.9780),
        zoom: 11,
        zoomControl: true,
      };
      
      const map = new window.naver.maps.Map('map', mapOptions);
      mapRef.current = map;

      // 4. 마커 생성 (성능 최적화 버전)
      clinics.forEach((clinic: any) => {
        const marker = new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(Number(clinic.lat), Number(clinic.lng)),
          map: map,
          icon: {
            content: '<div style="width:8px; height:8px; background:#3b82f6; border:1px solid white; border-radius:50%; box-shadow:0 0 3px rgba(0,0,0,0.3);"></div>',
            anchor: new window.naver.maps.Point(4, 4)
          }
        });

        window.naver.maps.Event.addListener(marker, 'click', () => {
          alert(`[스트라우만 파트너]\n${clinic.name}\n${clinic.address}`);
        });
      });
    }
  }, [isMapLoaded, clinics]);

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-[#002B45]">
      <header className="bg-[#002B45] text-white py-12 px-6 text-center border-b-4 border-blue-600 shadow-2xl">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex justify-center items-center gap-2">
            <ShieldCheck className="text-blue-400" size={20} />
            <span className="text-blue-400 font-bold tracking-[0.2em] text-[10px] uppercase">Official Straumann Locator</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">내 주변 스트라우만 치과 찾기</h1>
        </div>
      </header>

      <main className="flex-1 relative w-full bg-slate-100 min-h-[700px]">
        {/* 지도가 그려지는 영역 */}
        <div id="map" className="w-full h-[700px] shadow-inner" />
        
        {/* 로딩 표시 */}
        {!isMapLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 z-50">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-[#002B45] font-bold animate-pulse text-xs tracking-widest uppercase">Initializing Global Partner Map...</p>
          </div>
        )}

        {/* 하단 정보 카드 */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-30">
          <div className="bg-white/95 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-[2.5rem] p-8 border border-blue-50">
            <div className="flex items-center gap-2 mb-4">
              <Award className="text-blue-600" size={22} />
              <span className="font-extrabold text-[12px] uppercase tracking-tighter text-blue-900">Verified Network</span>
            </div>
            <p className="text-slate-600 text-[16px] mb-4 leading-relaxed font-medium">
              현재 전국 <span className="text-blue-600 font-black text-2xl underline decoration-blue-200 decoration-4 underline-offset-4">{clinics.length.toLocaleString()}</span>곳의 
              스트라우만 파트너사가 실시간 검색되었습니다.
            </p>
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 border-t pt-4 border-slate-100 font-medium">
              <MapPin size={12} className="text-blue-400" /> 지도를 조작하여 치과 위치를 확인하세요.
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-slate-900 py-8 text-center border-t border-slate-800">
        <p className="text-[10px] text-slate-500 font-bold tracking-[0.4em] uppercase opacity-40 italic font-mono">© 2026 Straumann Group Korea · Internal Build</p>
      </footer>
    </div>
  );
}