import React, { useMemo } from 'react'
import { formatDateLabel } from '../utils/format.js'

export default function SearchPanel({
  date,
  setDate,
  count,
  setCount,
  company,
  setCompany,
  nation,
  setNation,
  keyword,
  setKeyword,
  sort,
  setSort,
  resultCount,
  onSearch,
}) {
  const yesterday = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() - 1)
    return formatDateLabel(d)
  }, [])

  return (
    <section className="panel p-6 md:p-8 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-4 mb-6 pb-4 border-b border-gray-700">
        <div className="flex flex-col col-span-1 md:col-span-2">
          <label htmlFor="date-select" className="text-sm font-medium mb-1">조회 날짜</label>
          <input
            id="date-select"
            type="text"
            className="input-style w-full"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="YYYYMMDD"
          />
          <span className="text-xs text-gray-500 mt-1">yyyymmdd 형식 전송</span>
        </div>
        <div className="flex flex-col col-span-1 md:col-span-2">
          <label htmlFor="count-select" className="text-sm font-medium mb-1">표시 개수 (≤100)</label>
          <input
            id="count-select"
            type="number"
            min={1}
            max={100}
            className="input-style w-full"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-4 mb-6">
        <div className="flex flex-col">
          <label htmlFor="company-select" className="text-sm font-medium mb-1">배급사/상영사</label>
          <select id="company-select" className="input-style" value={company} onChange={(e) => setCompany(e.target.value)}>
            <option value="all">전체</option>
            <option value="CJ">CJ</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="nation-select" className="text-sm font-medium mb-1">국적</label>
          <select id="nation-select" className="input-style" value={nation} onChange={(e) => setNation(e.target.value)}>
            <option value="all">전체</option>
            <option value="KR">국내</option>
          </select>
        </div>
        <div className="flex flex-col col-span-2">
          <label htmlFor="branch-code" className="text-sm font-medium mb-1">영화 제목</label>
          <input id="branch-code" className="input-style" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="(선택)" />
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
            오름차순
          </button>
          <button
            className={`filter-btn input-style text-sm font-medium ${sort === 'desc' ? 'active bg-gray-700 border-gray-700' : 'bg-gray-600 border-gray-600'}`}
            onClick={() => setSort('desc')}
            type="button"
          >
            내림차순
          </button>
        </div>
        <div className="flex space-x-3">
          <button
            className="py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition duration-150 text-sm"
            type="button"
            onClick={() => setDate(yesterday)}
          >
            어제 날짜
          </button>
          <button
            className="py-2 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-150 text-sm"
            type="button"
            onClick={onSearch}
          >
            조회
          </button>
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-4">원료: <strong>{resultCount}건</strong></p>
    </section>
  )
}

