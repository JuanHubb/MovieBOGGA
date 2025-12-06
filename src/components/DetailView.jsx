import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from './Header.jsx'
import { mockMovies } from '../data/mockMovies.js'
import { formatCurrency, formatNumber, formatPercent } from '../utils/format.js'

export default function DetailView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const movie = mockMovies[id]

  if (!movie) {
    return (
      <>
        <Header title="영화 상세 정보" />
        <main className="container mx-auto p-4 md:p-8">
          <div className="panel p-6 md:p-8">잘못된 영화 ID 입니다.</div>
        </main>
      </>
    )
  }

  return (
    <>
      <Header title={`${movie.title} 상세 정보`} />
      <main className="container mx-auto p-4 md:p-8">
        <section className="panel p-6 md:p-8">
          <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-3">
            <button className="text-gray-400 hover:text-white transition duration-150" onClick={() => navigate('/')}> 
              <i className="fas fa-arrow-left mr-2" /> 순위 목록으로
            </button>
            <h3 className="text-2xl font-bold text-white">{movie.title} 상세 정보</h3>
            <button className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-150 text-sm" onClick={() => navigate(`/review/${id}`)}>
              리뷰 작성 <i className="fas fa-pen ml-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-1 bg-gray-700 h-96 rounded-lg flex items-center justify-center text-gray-400 text-xl font-bold">
              [Image of 포스터]
            </div>
            <div className="md:col-span-2 space-y-3 p-4 bg-gray-700/30 rounded-lg">
              <div className="text-4xl font-extrabold text-white mb-4"><span className="text-blue-400">{movie.rank}위</span> {movie.title}</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="font-medium text-gray-400">개봉일: <span className="text-white">{movie.release}</span></div>
                <div className="font-medium text-gray-400">상영 횟수: <span className="text-white">{formatNumber(movie.screenCount)}회</span></div>
              </div>
              <div className="border-t border-gray-700 pt-3 grid grid-cols-2 gap-4 text-sm">
                <div className="font-medium text-gray-400">일일 매출액: <span className="text-green-400 font-bold">{formatCurrency(movie.dailySales)}</span></div>
                <div className="font-medium text-gray-400">일일 관객수: <span className="text-yellow-300 font-bold">{formatNumber(movie.dailyAudience)}명</span></div>
                <div className="font-medium text-gray-400">누적 관객수: <span className="text-white">{formatNumber(movie.totalAudience)}명</span></div>
                <div className="font-medium text-gray-400">전일대비 증감비율: <span className={`${movie.increaseRate >= 0 ? 'text-green-400' : 'text-red-400'} font-bold`}>{formatPercent(movie.increaseRate)}</span></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 p-4 bg-gray-700/30 rounded-lg space-y-2">
              <div className="font-semibold text-white">관람 정보</div>
              <div className="text-sm text-gray-300">본 장소: {movie.location}</div>
              <div className="text-sm text-gray-300">같이 본 사람: {movie.partners}</div>
              <div className="text-sm text-gray-300">쿠키영상: {movie.cookie}</div>
            </div>
            <div className="md:col-span-2 p-4 bg-gray-700/30 rounded-lg">
              <div className="font-semibold text-white mb-2">생각나는 명대사</div>
              <blockquote className="italic text-gray-300">“{movie.quote}”</blockquote>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

