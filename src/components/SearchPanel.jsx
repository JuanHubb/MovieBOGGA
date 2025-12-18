import React from 'react'
import { formatDateLabel, formatDateForAPI } from '../utils/format.js'

// 날짜 문자열을 YYYY-MM-DD 형식으로 변환 (date input용)
const formatDateForInput = (dateStr) => {
  // "YYYY. MM. DD." 형식을 "YYYY-MM-DD"로 변환
  const cleaned = dateStr.replace(/\.\s*/g, '').replace(/\s/g, '')
  if (cleaned.length === 8) {
    return `${cleaned.substring(0, 4)}-${cleaned.substring(4, 6)}-${cleaned.substring(6, 8)}`
  }
  return ''
}

// YYYY-MM-DD 형식을 "YYYY. MM. DD." 형식으로 변환
const formatDateFromInput = (dateInput) => {
  if (!dateInput) return ''
  const cleaned = dateInput.replace(/-/g, '')
  if (cleaned.length === 8) {
    return `${cleaned.substring(0, 4)}. ${cleaned.substring(4, 6)}. ${cleaned.substring(6, 8)}.`
  }
  return dateInput
}

export default function SearchPanel({
  date,
  setDate,
  keyword,
  setKeyword,
  sort,
  setSort,
  resultCount,
  onSearch,
}) {
  const dateInputValue = formatDateForInput(date)

  const handleDateChange = (e) => {
    const newDate = formatDateFromInput(e.target.value)
    setDate(newDate)
  }

  return (
    <section className="panel p-6 md:p-8 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 mb-6 pb-4 border-b border-gray-700">
        <div className="flex flex-col">
          <label htmlFor="date-select" className="text-sm font-medium mb-1">조회 날짜</label>
          <input
            id="date-select"
            type="date"
            className="input-style w-full"
            value={dateInputValue}
            onChange={handleDateChange}
            max={formatDateForInput(formatDateLabel(new Date(Date.now() - 86400000)))}
          />
          <span className="text-xs text-gray-500 mt-1">날짜를 선택하세요</span>
        </div>
        <div className="flex flex-col col-span-2">
          <label htmlFor="movie-title" className="text-sm font-medium mb-1">영화 제목 검색</label>
          <input
            id="movie-title"
            type="text"
            className="input-style w-full"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="영화 제목을 입력하세요"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-gray-700">
        <div className="flex space-x-2 mb-4 sm:mb-0">
          <span className="font-medium mr-1 text-gray-400">정렬:</span>
          <button
            className={`filter-btn input-style text-sm font-medium ${sort === 'asc' ? 'active bg-gray-700 border-gray-700' : 'bg-gray-600 border-gray-600'}`}
            onClick={() => setSort('asc')}
            type="button"
          >
            순위 오름차순
          </button>
          <button
            className={`filter-btn input-style text-sm font-medium ${sort === 'desc' ? 'active bg-gray-700 border-gray-700' : 'bg-gray-600 border-gray-600'}`}
            onClick={() => setSort('desc')}
            type="button"
          >
            순위 내림차순
          </button>
        </div>
        <div>
          <button
            className="py-2 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-150 text-sm"
            type="button"
            onClick={() => onSearch()}
          >
            조회
          </button>
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-4">검색 결과: <strong>{resultCount}건</strong></p>
    </section>
  )
}

