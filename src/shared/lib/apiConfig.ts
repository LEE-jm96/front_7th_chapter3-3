// API Base URL 설정
// 개발 환경: Vite proxy 사용 (/api)
// 프로덕션: DummyJSON API 직접 호출

// @ts-ignore - Vite 환경 변수
const isProduction = import.meta.env?.PROD === true

export const API_BASE_URL = isProduction
  ? "https://dummyjson.com"  // 프로덕션: DummyJSON 직접 호출
  : "/api"  // 개발 환경: Vite proxy 사용

