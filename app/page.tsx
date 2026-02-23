'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Award, ShieldCheck, MapPin } from 'lucide-react';

// 1. TypeScript에게 window.naver가 있다고 선언 (빌드 에러 해결 포인트!)
declare global {
  interface Window {
    naver: any;
  }
}

export default function LandingPage() {
  const mapRef = useRef<any>(null);
  const [clinics, setClinics] = useState([]);
  const [userPos, setUserPos] = useState({ lat: 37.5665, lng: 126.9780 });

  useEffect(() => {
    // 2. 5,103건의 데이터 로드
    fetch('/clinics.json')
      .then(res => res.json())
      .then(data => setClinics(data))
      .catch(err => console.error("Data Load Error:", err));

    // 3. 내 위치 파악
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
  }, []);

  useEffect(() => {
    // 4. 네이버 지도 초기화 (window.naver 존재 여부 체크)
    if (typeof window !== "undefined" && window.naver && window.naver.maps && !mapRef.current) {
      const mapOptions = {
        center: new window.naver.maps.LatLng(userPos.lat, userPos.lng),
        zoom: 11,
        zoomControl: true,
      };
      mapRef.current = new window.naver.maps.Map('map', mapOptions);
    }

    // 5. 마커 생성 및 클릭 이벤트
    if (mapRef.current && clinics.length > 0) {
      clinics.forEach((clinic: any) => {
        const marker = new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(clinic.lat, clinic.lng),
          map: mapRef.current,
        });

        window.naver.maps.Event.addListener(marker, 'click', () => {
          alert(`[스트라우만 공식 파트너]\n치과명: ${clinic.name}\n주소: ${clinic.address}`);
        });
      });
    }
  }, [clinics, userPos]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 프리미엄 헤더 디자인 */}
      <header className="bg-[#002B45] text-white py-12 px-6 text-center border-b-4 border-blue-600 shadow-2xl">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex justify-center items-center gap-2">
            <ShieldCheck className="text-blue-400" size={20} />
            <span className="text-blue-400 font-bold tracking-[0.2em] text-[10px] uppercase font-mono">Official Straumann Partner</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">내 주변 스트라우만 치과 찾기</h1>
          <p className="text-slate-300 text-lg font-light italic opacity-90">"70년 역사가 증명하는 프리미엄, 가까운 파트너에서 확인하세요."</p>
        </div>
      </header>

      {/* 지도 영역: 높이 700px 고정 */}
      <main className="flex-1 relative w-full h-[700px] bg-slate-100">
        <div id="map" className="w-full h-full shadow-inner" />
        
        {/* 하단 플로팅 배너 */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-30">
          <div className="bg-white/95 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-[2.5rem] p-8 border border-blue-50 text-[#002B45]">
            <div className="flex items-center gap-2 mb-4">
              <Award className="text-blue-600" size={22} />
              <span className="font-extrabold text-[12px] uppercase tracking-tighter text-blue-900">Verified Network</span>
            </div>
            <p className="text-slate-600 text-[16px] mb-4 leading-relaxed font-medium">
              전국 <span className="text-blue-600 font-black text-2xl underline decoration-blue-200 decoration-4 underline-offset-4 font-mono">{clinics.length.toLocaleString()}</span>곳의 
              스트라우만 파트너사가 실시간 검색되었습니다.
            </p>
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 border-t pt-4 border-slate-100">
              <MapPin size={12} className="text-blue-400" /> 지도를 조작하여 치과 위치를 확인하세요.
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-slate-900 py-8 text-center border-t border-slate-800">
        <p className="text-[10px] text-slate-500 font-bold tracking-[0.4em] uppercase opacity-40 italic">
          © 2026 Straumann Group Korea · Premium Partner Locator
        </p>
      </footer>
    </div>
  );
}