'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Award, ShieldCheck, MapPin, AlertCircle } from 'lucide-react';

declare global {
  interface Window {
    naver: any;
  }
}

export default function LandingPage() {
  const mapRef = useRef<any>(null);
  const [clinics, setClinics] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [userPos, setUserPos] = useState({ lat: 37.5665, lng: 126.9780 });

  useEffect(() => {
    // 1. 데이터 로드 및 검증
    fetch('/clinics.json')
      .then(res => res.json())
      .then(data => {
        // 좌표가 없는 데이터는 걸러내서 에러 방지
        const validData = data.filter((item: any) => item.lat && item.lng);
        setClinics(validData);
      })
      .catch(err => console.error("Data Load Error:", err));

    // 2. 현재 위치 파악
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }

    // 3. 네이버 엔진 로딩 체크
    const checkNaver = setInterval(() => {
      if (window.naver && window.naver.maps) {
        setIsReady(true);
        clearInterval(checkNaver);
      }
    }, 200);

    return () => clearInterval(checkNaver);
  }, []);

  useEffect(() => {
    // 4. 지도 초기화 및 마커 생성 (안전장치 강화)
    if (isReady && clinics.length > 0 && !mapRef.current) {
      const container = document.getElementById('map');
      if (!container) return;

      const mapOptions = {
        center: new window.naver.maps.LatLng(userPos.lat, userPos.lng),
        zoom: 12,
      };
      
      const map = new window.naver.maps.Map(container, mapOptions);
      mapRef.current = map;

      clinics.forEach((clinic: any) => {
        const marker = new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(Number(clinic.lat), Number(clinic.lng)),
          map: map,
        });

        window.naver.maps.Event.addListener(marker, 'click', () => {
          alert(`[스트라우만 공식 파트너]\n${clinic.name}\n${clinic.address}`);
        });
      });
    }
  }, [isReady, clinics, userPos]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="bg-[#002B45] text-white py-12 px-6 text-center border-b-4 border-blue-600 shadow-2xl">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex justify-center items-center gap-2">
            <ShieldCheck className="text-blue-400" size={20} />
            <span className="text-blue-400 font-bold tracking-[0.2em] text-[10px] uppercase font-mono">Official Straumann Partner</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">내 주변 스트라우만 치과 찾기</h1>
        </div>
      </header>

      <main className="flex-1 relative w-full min-h-[700px] bg-slate-100">
        <div id="map" className="w-full h-[700px]" />
        
        {!isReady && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-50">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-[#002B45] font-medium animate-pulse uppercase tracking-widest text-xs">Connecting to Naver Map...</p>
          </div>
        )}

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-30">
          <div className="bg-white/95 backdrop-blur-md shadow-2xl rounded-[2rem] p-8 border border-blue-50 text-[#002B45]">
            <p className="text-slate-600 text-[16px] mb-4 leading-relaxed font-medium">
              전국 <span className="text-blue-600 font-black text-2xl underline decoration-blue-200 decoration-4 underline-offset-4 font-mono">{clinics.length.toLocaleString()}</span>곳의 
              스트라우만 파트너사가 실시간 검색되었습니다.
            </p>
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 border-t pt-4 border-slate-100">
              <MapPin size={12} className="text-blue-400" /> 지도를 드래그하여 주변 치과를 확인하세요.
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