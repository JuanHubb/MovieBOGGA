import React from 'react'
import { useNavigate } from 'react-router-dom'
import { formatCurrency, formatNumber, formatPercent } from '../utils/format.js'

export default function RankingTable({ rows }) {
  const navigate = useNavigate()
  return (
    <section className="panel p-6 md:p-8">
      <h3 className="text-xl font-semibold mb-6 text-white border-b border-gray-700 pb-3">📊 박스오피스 순위</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left ranking-table text-sm">
          <thead>
            <tr>
              <th scope="col" className="font-bold">순위</th>
              <th scope="col" className="font-bold">영화명</th>
              <th scope="col" className="font-bold">개봉일</th>
              <th scope="col" className="font-bold text-right">매출액</th>
              <th scope="col" className="font-bold text-right">관객수</th>
              <th scope="col" className="font-bold text-right">누적 관객수</th>
              <th scope="col" className="font-bold text-right">전일대비 증감비율</th>
              <th scope="col" className="font-bold text-right">상영 횟수</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((m) => (
              <tr key={m.id} className="text-gray-300 ranking-row">
                <td className="font-bold text-lg text-blue-400">{m.rank}</td>
                <td
                  className="font-semibold text-white cursor-pointer hover:underline"
                  onClick={() => navigate(`/detail/${m.id}`)}
                >
                  {m.title}
                </td>
                <td>{m.release}</td>
                <td className="text-right text-green-400">{formatNumber(m.dailySales)}</td>
                <td className="text-right text-yellow-300">{formatNumber(m.dailyAudience)}</td>
                <td className="text-right">{formatNumber(m.totalAudience)}</td>
                <td className={`text-right ${m.increaseRate >= 0 ? 'text-green-400' : 'text-red-400'}`}>{formatPercent(m.increaseRate)}</td>
                <td className="text-right">{formatNumber(m.screenCount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

