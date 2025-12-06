import React, { useMemo, useState } from 'react'
import { allMoviesArray } from '../data/mockMovies.js'
import SearchPanel from './SearchPanel.jsx'
import RankingTable from './RankingTable.jsx'
import Header from './Header.jsx'

export default function RankingView() {
  const [date, setDate] = useState('2024. 04. 24.')
  const [count, setCount] = useState(20)
  const [company, setCompany] = useState('all')
  const [nation, setNation] = useState('all')
  const [keyword, setKeyword] = useState('')
  const [sort, setSort] = useState('asc')

  const rows = useMemo(() => {
    let items = [...allMoviesArray]
    if (keyword.trim()) items = items.filter((m) => m.title.includes(keyword.trim()))
    items.sort((a, b) => (sort === 'asc' ? a.rank - b.rank : b.rank - a.rank))
    return items.slice(0, Math.min(count, 100))
  }, [keyword, sort, count])

  return (
    <>
      <Header title="KOBIS 일일 박스오피스" />
      <main className="container mx-auto p-4 md:p-8">
        <SearchPanel
          date={date}
          setDate={setDate}
          count={count}
          setCount={setCount}
          company={company}
          setCompany={setCompany}
          nation={nation}
          setNation={setNation}
          keyword={keyword}
          setKeyword={setKeyword}
          sort={sort}
          setSort={setSort}
          resultCount={rows.length}
          onSearch={() => {
            // 실제 API 연동 시 여기서 호출
            // 현재는 콘솔만 출력 (index.html 동작과 동일)
            // eslint-disable-next-line no-console
            console.log(`[Search] 날짜: ${date}, 개수: ${count}, 회사: ${company}, 국적: ${nation}, 키워드: ${keyword}, 정렬: ${sort}`)
          }}
        />
        <RankingTable rows={rows} />
      </main>
    </>
  )
}

