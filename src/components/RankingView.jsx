import React, { useMemo, useState, useEffect } from "react";
import { allMoviesArray } from "../data/mockMovies.js";
import SearchPanel from "./SearchPanel.jsx";
import RankingTable from "./RankingTable.jsx";
import Header from "./Header.jsx";
import { fetchDailyBoxOffice } from "../utils/api.js";
import { formatDateLabel, formatDateForAPI } from "../utils/format.js";

export default function RankingView() {
  const [date, setDate] = useState(
    formatDateLabel(new Date(Date.now() - 86400000))
  );
  const [keyword, setKeyword] = useState("");
  const [sort, setSort] = useState("asc");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async (targetDate = date) => {
    setLoading(true);
    setError(null);
    try {
      const formattedDate = formatDateForAPI(targetDate);
      // API는 최대 10개까지만 제공
      const apiMovies = await fetchDailyBoxOffice(formattedDate, 10);
      setMovies(apiMovies);
      // 영화 목록을 localStorage에 저장 (DetailView에서 사용하기 위해)
      localStorage.setItem("movies", JSON.stringify(apiMovies));
    } catch (err) {
      console.error("영화 데이터 로드 실패:", err);
      setError(err.message || "데이터를 불러오는데 실패했습니다.");
      setMovies(allMoviesArray);
      // 에러 발생 시 mock 데이터도 localStorage에 저장
      localStorage.setItem("movies", JSON.stringify(allMoviesArray));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (searchDate) => {
    const dateToUse = searchDate || date;
    if (searchDate && searchDate !== date) {
      setDate(searchDate);
    }
    await loadMovies(dateToUse);
  };

  const rows = useMemo(() => {
    let items = [...movies];
    // 영화 제목으로 필터링
    if (keyword.trim()) {
      items = items.filter((m) =>
        m.title.toLowerCase().includes(keyword.trim().toLowerCase())
      );
    }
    // 순위 기준 정렬
    items.sort((a, b) => (sort === "asc" ? a.rank - b.rank : b.rank - a.rank));
    return items;
  }, [movies, keyword, sort]);

  return (
    <>
      <Header title="Movie Bogga" />
      <main className="container mx-auto p-4 md:p-8">
        <SearchPanel
          date={date}
          setDate={setDate}
          keyword={keyword}
          setKeyword={setKeyword}
          sort={sort}
          setSort={setSort}
          resultCount={rows.length}
          onSearch={handleSearch}
        />
        {loading && (
          <div className="panel p-6 md:p-8 text-center text-gray-400">
            데이터를 불러오는 중...
          </div>
        )}
        {error && !loading && (
          <div className="panel p-6 md:p-8 text-center text-red-400">
            {error}
          </div>
        )}
        {!loading && !error && <RankingTable rows={rows} />}
      </main>
    </>
  );
}
