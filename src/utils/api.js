const API_KEY = import.meta.env.VITE_KOBIS_API_KEY
const BASE_URL = 'http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json'

const transformMovieData = (apiMovie, index) => {
  return {
    id: apiMovie.movieCd || `movie_${index}`,
    title: apiMovie.movieNm || '',
    rank: parseInt(apiMovie.rank || '0', 10),
    release: apiMovie.openDt ? apiMovie.openDt.replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3') : '',
    dailySales: parseInt(apiMovie.salesAmt || '0', 10),
    dailyAudience: parseInt(apiMovie.audiCnt || '0', 10),
    totalAudience: parseInt(apiMovie.audiAcc || '0', 10),
    increaseRate: parseFloat(
      apiMovie.salesChange ?? apiMovie.audiChange ?? '0',
      10
    ),
    screenCount: parseInt(apiMovie.scrnCnt || '0', 10),
    location: '',
    quote: '',
    cookie: '',
    partners: '',
  }
}

export const fetchDailyBoxOffice = async (targetDate, itemPerPage = 10) => {
  try {
    if (!API_KEY) {
      throw new Error('API 키가 설정되지 않았습니다. .env 파일을 확인해주세요.')
    }

    const url = new URL(BASE_URL)
    url.searchParams.append('key', API_KEY)
    url.searchParams.append('targetDt', targetDate)
    url.searchParams.append('itemPerPage', Math.min(itemPerPage, 10).toString())

    const response = await fetch(url.toString())
    
    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    if (data.faultInfo) {
      throw new Error(`API 오류: ${data.faultInfo.message || '알 수 없는 오류'}`)
    }

    if (!data.boxOfficeResult || !data.boxOfficeResult.dailyBoxOfficeList) {
      return []
    }

    return data.boxOfficeResult.dailyBoxOfficeList.map((movie, index) => 
      transformMovieData(movie, index)
    )
  } catch (error) {
    console.error('박스오피스 조회 실패:', error)
    throw error
  }
}

export const fetchMovieDetail = async (movieCd) => {
  try {
    if (!API_KEY) {
      throw new Error('API 키가 설정되지 않았습니다.')
    }

    const detailUrl = 'http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json'
    const url = new URL(detailUrl)
    url.searchParams.append('key', API_KEY)
    url.searchParams.append('movieCd', movieCd)

    const response = await fetch(url.toString())
    
    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.faultInfo) {
      throw new Error(`API 오류: ${data.faultInfo.message || '알 수 없는 오류'}`)
    }

    if (!data.movieInfoResult || !data.movieInfoResult.movieInfo) {
      return null
    }

    const movieInfo = data.movieInfoResult.movieInfo
    return {
      title: movieInfo.movieNm || '',
      release: movieInfo.openDt ? movieInfo.openDt.replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3') : '',
    }
  } catch (error) {
    console.error('영화 상세 조회 실패:', error)
    throw error
  }
}

