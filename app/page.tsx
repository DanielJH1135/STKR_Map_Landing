'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Award, ShieldCheck, MapPin } from 'lucide-react';

declare global { interface Window { naver: any; } }

export default function LandingPage() {
  const mapRef = useRef<any>(null);
  const [clinics, setClinics] = useState([]);
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    // 1. 데이터 로드
    fetch('/clinics.json')
      .then(res => res.json())
      .then(data => setClinics(data))
      .catch(err => console.error("Data Error:", err));

    // 2. 네이버 엔진이 100% 준비될 때까지 체크
    const timer = setInterval(() => {
      if (window.naver && window.naver.maps) {
        setIsMapReady(true);
        clearInterval(timer);
      }
    }, 200);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // 3. 지도가 준비되면 그리기 시작
    if (isMapReady && clinics.length > 0 && !mapRef.current) {
      const mapOptions = {
        center: new window.naver.maps.LatLng(37.5665, 126.9780),
        zoom: 11,
      };
      const map = new window.naver.maps.Map('map', mapOptions);
      mapRef.current = map;

      // 성공했던 image_9ebf1d 로직을 그대로 복원합니다
      clinics.forEach((clinic: any) => {
        new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(Number(clinic.lat), Number(clinic.lng)),
          map: map,
          icon: {
            content: '<div style="width:8px; height:8px; background:#3b82f6; border:1px solid white; border-radius:50%;"></div>',
            anchor: new window.naver.maps.Point(4, 4)
          }
        });
      });
    }
  }, [isMapReady, clinics]);

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      <header className="bg-[#002B45] text-white py-12 px-6 text-center border-b-4 border-blue-600 shadow-2xl">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex justify-center items-center gap-2">
            <ShieldCheck className="text-blue-400" size={20} />
            <span className="text-blue-400 font-bold tracking-[0.2em] text-[10px] uppercase">Official Straumann Locator</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">내 주변 스트라우만 치과 찾기</h1>
        </div>
      </header>

      <main className="flex-1 relative w-full bg-slate-100 min-h-[700px]">
        <div id="map" className="w-full h-[700px]" />
        
        {!isMapReady && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 z-50">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-[#002B45] font-bold animate-pulse text-xs tracking-widest uppercase">Verifying Straumann Partner Network...</p>
          </div>
        )}

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-30">
          <div className="bg-white/95 backdrop-blur-md shadow-2xl rounded-[2.5rem] p-8 border border-blue-50">
            <p className="text-slate-600 text-[16px] mb-2 leading-relaxed">
              현재 전국 <span className="text-blue-600 font-black text-2xl font-mono underline decoration-blue-200 decoration-4 underline-offset-4">{clinics.length.toLocaleString()}</span>곳의 파트너사가 실시간 확인되었습니다.
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-slate-900 py-6 text-center">
        <p className="text-[10px] text-slate-500 font-bold tracking-[0.4em] uppercase opacity-40 italic">© 2026 Straumann Group Korea</p>
      </footer>
    </div>
  );
}