import React, { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from './Header.jsx'
import { mockMovies } from '../data/mockMovies.js'

function Star({ active, onClick, idx }) {
  return (
    <i
      className={`fas fa-star text-3xl cursor-pointer transition ${active ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-400'}`}
      data-rating={idx}
      onClick={onClick}
    />
  )
}

export default function ReviewForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const movie = mockMovies[id]

  const [sex, setSex] = useState('')
  const [age, setAge] = useState('')
  const [rating, setRating] = useState(0)
  const [location, setLocation] = useState('')
  const [partners, setPartners] = useState('')
  const [cookie, setCookie] = useState('')
  const [quote, setQuote] = useState('')
  const [content, setContent] = useState('')
  const [password, setPassword] = useState('')

  const title = useMemo(() => (movie ? `${movie.title} 리뷰 작성` : '리뷰 작성'), [movie])

  const submit = async (e) => {
    e.preventDefault()
    const valid = sex && age && rating > 0 && content.length >= 10 && password.length >= 4
    if (!valid) {
      alert('필수 정보 (성별, 연령, 별점, 리뷰 10자 이상, 비밀번호 4자리 이상)를 모두 입력해주세요.')
      return
    }

    const reviewData = {
      sex,
      age: parseInt(age, 10),
      rating,
      location,
      companion: partners,
      pcScene: cookie === 'Y',
      quote,
      review: content,
      password,
      movieID: parseInt(id, 10),
    }

    try {
      const response = await fetch('https://6933b1984090fe3bf01dc49f.mockapi.io/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      })

      if (response.ok) {
        alert(`리뷰 제출 완료! (영화: ${movie?.title ?? ''}, 별점: ${rating}점)`)
        navigate(`/detail/${id}`)
      } else {
        const errorData = await response.json()
        alert(`리뷰 제출에 실패했습니다: ${errorData.message || '알 수 없는 오류'}`)
      }
    } catch (error) {
      console.error('리뷰 제출 중 네트워크 오류 발생:', error)
      alert('리뷰 제출 중 오류가 발생했습니다. 인터넷 연결을 확인해주세요.')
    }
  }

  return (
    <>
      <Header title={title} />
      <main className="container mx-auto p-4 md:p-8">
        <section className="panel p-6 md:p-8">
          <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-3">
            <button className="text-gray-400 hover:text-white transition duration-150" onClick={() => navigate(`/detail/${id}`)}>
              <i className="fas fa-arrow-left mr-2" /> 상세로 돌아가기
            </button>
            <h3 className="text-2xl font-bold text-white">{title}</h3>
            <div />
          </div>

          <form className="space-y-4" onSubmit={submit}>
            <input type="hidden" value={id} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label htmlFor="reviewSex" className="text-sm font-medium mb-1">성별</label>
                <select id="reviewSex" className="input-style" value={sex} onChange={(e) => setSex(e.target.value)}>
                  <option value="">선택</option>
                  <option value="M">남성</option>
                  <option value="F">여성</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="reviewAge" className="text-sm font-medium mb-1">연령</label>
                <select id="reviewAge" className="input-style" value={age} onChange={(e) => setAge(e.target.value)}>
                  <option value="">선택</option>
                  <option value="10">10대</option>
                  <option value="20">20대</option>
                  <option value="30">30대</option>
                  <option value="40">40대</option>
                  <option value="50+">50대 이상</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium mb-2">별점</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} idx={i} active={i <= rating} onClick={() => setRating(i)} />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label htmlFor="reviewLocation" className="text-sm font-medium mb-1">본 장소</label>
                <input id="reviewLocation" className="input-style" placeholder="예: CGV 강남" value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>
              <div className="flex flex-col">
                <label htmlFor="reviewPartners" className="text-sm font-medium mb-1">같이 본 사람</label>
                <input id="reviewPartners" className="input-style" placeholder="예: 친구, 혼자, 연인" value={partners} onChange={(e) => setPartners(e.target.value)} />
              </div>
              <div className="flex flex-col">
                <label htmlFor="reviewCookie" className="text-sm font-medium mb-1">쿠키영상 여부</label>
                <select id="reviewCookie" className="input-style" value={cookie} onChange={(e) => setCookie(e.target.value)}>
                  <option value="">선택</option>
                  <option value="Y">있음</option>
                  <option value="N">없음</option>
                  <option value="Maybe">모름</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="reviewQuote" className="text-sm font-medium mb-1">생각나는 명대사</label>
              <input id="reviewQuote" className="input-style" placeholder="가장 인상 깊었던 대사를 남겨주세요" value={quote} onChange={(e) => setQuote(e.target.value)} />
            </div>

            <div className="flex flex-col">
              <label htmlFor="reviewContent" className="text-sm font-medium mb-1">리뷰</label>
              <textarea id="reviewContent" rows={5} className="input-style" placeholder="솔직한 리뷰를 남겨주세요 (최소 10자)" value={content} onChange={(e) => setContent(e.target.value)} />
            </div>

            <div className="flex flex-col">
              <label htmlFor="reviewPassword" className="text-sm font-medium mb-1">비밀번호 (수정/삭제용)</label>
              <input id="reviewPassword" type="password" className="input-style" placeholder="4자리 이상 입력" value={password} onChange={(e) => setPassword(e.target.value)} />
              <span className="text-xs text-gray-500 mt-1">리뷰 수정/삭제 시 필요합니다.</span>
            </div>

            <div className="flex justify-end pt-4">
              <button type="submit" className="py-2 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-150">
                리뷰 제출하기
              </button>
            </div>
          </form>
        </section>
      </main>
    </>
  )
}

