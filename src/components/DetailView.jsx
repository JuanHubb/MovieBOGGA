import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./Header.jsx";
import { mockMovies } from "../data/mockMovies.js";
import {
  formatCurrency,
  formatNumber,
  formatPercent,
} from "../utils/format.js";
import styled from "styled-components";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

function StarDisplay({ rating }) {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <i
          key={i}
          className={`fas fa-star text-lg ${
            i <= rating ? "text-yellow-400" : "text-gray-600"
          }`}
        />
      ))}
    </div>
  );
}

export default function DetailView() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 먼저 localStorage에서 영화 목록 확인 (API에서 가져온 데이터)
  // 없으면 mockMovies에서 확인
  const [movie, setMovie] = useState(() => {
    try {
      const storedMovies = localStorage.getItem("movies");
      if (storedMovies) {
        const movies = JSON.parse(storedMovies);
        const foundMovie = movies.find((m) => m.id === id);
        if (foundMovie) return foundMovie;
      }
    } catch (e) {
      console.error("localStorage 읽기 실패:", e);
    }
    // localStorage에 없으면 mockMovies에서 찾기
    return mockMovies[id] || null;
  });

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tmdbPosterPath, setTmdbPosterPath] = useState(null);
  const [movieDetail, setMovieDetail] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [tmdbLoading, setTmdbLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [password, setPassword] = useState("");
  const [modalAction, setModalAction] = useState("delete"); // 'delete' or 'edit'

  const handleEditClick = (review) => {
    setSelectedReview(review);
    setModalAction("edit");
    setShowModal(true);
    setPassword("");
  };

  const handleDeleteClick = (review) => {
    setSelectedReview(review);
    setModalAction("delete");
    setShowModal(true);
    setPassword("");
  };

  const handleConfirm = async () => {
    if (!selectedReview) return;

    if (password !== selectedReview.password) {
      alert("Wrong password!");
      return;
    }

    if (modalAction === "delete") {
      try {
        const response = await fetch(
          `https://6933b1984090fe3bf01dc49f.mockapi.io/reviews/${selectedReview.id}`,
          {
            method: "DELETE",
          },
        );

        if (!response.ok) {
          throw new Error("Review does not exist");
        }

        setReviews((prevReviews) =>
          prevReviews.filter((review) => review.id !== selectedReview.id),
        );
        setShowModal(false);
        setSelectedReview(null);
        alert("Your review is deleted!");
      } catch (e) {
        alert(e.message);
        setError(e.message);
      }
    } else if (modalAction === "edit") {
      setShowModal(false);
      navigate(`/review/${selectedReview.movieID}/edit`, {
        state: { review: selectedReview },
      });
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://6933b1984090fe3bf01dc49f.mockapi.io/reviews?movieID=${id}`
        );
        if (!response.ok) {
          throw new Error("Review does not exist");
        }
        const data = await response.json();
        setReviews(data);
        setError(null);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchTmdbData = async () => {
      if (!movie || (tmdbPosterPath && trailerKey)) return;

      setTmdbLoading(true);
      try {
        const searchResponse = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
            movie.title
          )}&language=ko-KR`
        );

        if (!searchResponse.ok) {
          throw new Error("Failed to load TMDb search data.");
        }

        const searchData = await searchResponse.json();

        if (searchData.results && searchData.results.length > 0) {
          const tmdbMovie = searchData.results[0];
          const movieId = tmdbMovie.id;

          setTmdbPosterPath(tmdbMovie.poster_path);
          setMovieDetail(tmdbMovie.overview);

          const videosResponse = await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${TMDB_API_KEY}&language=ko-KR`
          );

          if (!videosResponse.ok) {
            console.warn("No videos found or failed to load videos.");
            setTrailerKey(null);
          } else {
            const videosData = await videosResponse.json();

            const trailer = videosData.results.find(
              (v) =>
                v.site === "YouTube" &&
                (v.type === "Trailer" || v.type === "Teaser")
            );

            if (trailer) {
              setTrailerKey(trailer.key);
            } else {
              setTrailerKey(null);
            }
          }
        } else {
          setTmdbPosterPath(null);
          setMovieDetail(null);
          setTrailerKey(null);
        }
      } catch (e) {
        console.error("TMDb Fetch Error:", e);
      } finally {
        setTmdbLoading(false);
      }
    };

    if (id) {
      fetchReviews();
      fetchTmdbData();
    }
  }, [id, movie, tmdbPosterPath, movieDetail, trailerKey]);

  if (!movie) {
    return (
      <>
        <Header title="Movie Details" />
        <main className="container mx-auto p-4 md:p-8">
          <div className="panel p-6 md:p-8">Invalid movie ID.</div>
        </main>
      </>
    );
  }

  const posterUrl = tmdbPosterPath
    ? `${TMDB_IMAGE_BASE_URL}${tmdbPosterPath}`
    : null;

  const movieDetailText = movieDetail
    ? movieDetail
    : "No additional details available.";

  const trailerUrl = trailerKey
    ? `https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&rel=0`
    : null;

  return (
    <>
      <Header title={`${movie.title} Details`} />
      <main className="container mx-auto p-4 md:p-8">
        <section className="panel p-6 md:p-8">
          <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-3">
            <button
              className="text-gray-400 hover:text-white transition duration-150"
              onClick={() => navigate("/")}
            >
              <i className="fas fa-arrow-left mr-2" /> Back to Ranking
            </button>
            <h3 className="text-2xl font-bold text-white">{movie.title}</h3>
            <button
              className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-150 text-sm"
              onClick={() => navigate(`/review/${id}`)}
            >
              Write Review <i className="fas fa-pen ml-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div
              className="md:col-span-1 bg-gray-700 h-96 rounded-lg flex items-center justify-center text-gray-400 text-xl font-bold relative overflow-hidden"
              style={
                posterUrl
                  ? {
                      backgroundImage: `url(${posterUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }
                  : {}
              }
            >
              {posterUrl && (
                <div className="absolute inset-0 backdrop-blur-md bg-gray-700/60"></div>
              )}
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                {tmdbLoading ? (
                  <p>Loading poster...</p>
                ) : posterUrl ? (
                  <img
                    src={posterUrl}
                    alt={`${movie.title} Poster`}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <p>[Image of 포스터]</p>
                )}
              </div>
            </div>
            <div className="md:col-span-2 space-y-3 p-4 bg-gray-700/30 rounded-lg h-96 flex flex-col overflow-hidden">
              <div className="text-4xl font-extrabold text-white mb-4">
                <span className="text-blue-400">{movie.rank}th</span>{" "}
                {movie.title}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="font-medium text-gray-400">
                  Release Date:{" "}
                  <span className="text-white">{movie.release}</span>
                </div>
                <div className="font-medium text-gray-400">
                  Screen Count:{" "}
                  <span className="text-white">
                    {formatNumber(movie.screenCount)}
                  </span>
                </div>
              </div>
              <div className="border-t border-gray-700 pt-3 grid grid-cols-2 gap-4 text-sm">
                <div className="font-medium text-gray-400">
                  Daily Sales:{" "}
                  <span className="text-green-400 font-bold">
                    {formatCurrency(movie.dailySales)}
                  </span>
                </div>
                <div className="font-medium text-gray-400">
                  Daily Audience:{" "}
                  <span className="text-yellow-300 font-bold">
                    {formatNumber(movie.dailyAudience)}
                  </span>
                </div>
                <div className="font-medium text-gray-400">
                  Total Audience:{" "}
                  <span className="text-white">
                    {formatNumber(movie.totalAudience)}
                  </span>
                </div>
                <div className="font-medium text-gray-400">
                  Increase Rate:{" "}
                  <span
                    className={`${
                      movie.increaseRate >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    } font-bold`}
                  >
                    {formatPercent(movie.increaseRate)}
                  </span>
                </div>
              </div>
              <div className="border-t border-gray-700 pt-3 flex-1 flex flex-col min-h-0">
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 flex-1 overflow-y-auto">
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {movieDetailText}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-3 p-4 bg-gray-700/30 rounded-lg">
              <div className="text-sm font-medium text-gray-400 mb-2">
                Movie Trailer
              </div>
              {trailerUrl ? (
                <div
                  className="relative w-full"
                  style={{ paddingBottom: "18.75%" }}
                >
                  <iframe
                    title="Movie Trailer"
                    src={trailerUrl}
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-400">
                  <p>No trailer available</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <ReviewSection>
          <h4 className="text-xl font-bold text-white mb-4">Review List</h4>
          {loading && <p>Loading reviews...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading &&
            !error &&
            (reviews.length > 0 ? (
              <ReviewList>
                {reviews.map((review) => (
                  <ReviewItem key={review.id}>
                    <Avatar />
                    <div className="w-full">
                      <ReviewerInfo>
                        <span className="font-semibold text-blue-400">
                          {review.nickname}
                        </span>
                        <StarDisplay rating={review.rating} />
                      </ReviewerInfo>
                      <div className="text-sm text-gray-400 mb-2">
                        <span>Gender: {review.sex}</span>
                        <span className="mx-2">·</span>
                        <span>Age: {review.age}</span>
                        <span className="mx-2">·</span>
                        <span>Location: {review.location}</span>
                        <span className="mx-2">·</span>
                        <span>With: {review.companion}</span>
                        <span className="mx-2">·</span>
                        <span>
                          Post-credits Scence: {review.pcScene ? "Yes" : "No"}
                        </span>
                      </div>
                      {review.quote && (
                        <blockquote className="italic text-gray-300 my-2 p-2 border-l-4 border-gray-600">
                          "{review.quote}"
                        </blockquote>
                      )}
                      <p className="text-gray-200">{review.review}</p>
                      <div className="flex justify-end mt-4 space-x-2">
                        <EditButton onClick={() => handleEditClick(review)}>
                          Edit
                        </EditButton>
                        <DeleteButton onClick={() => handleDeleteClick(review)}>
                          Delete
                        </DeleteButton>
                      </div>
                    </div>
                  </ReviewItem>
                ))}
              </ReviewList>
            ) : (
              <p>No reviews yet.</p>
            ))}
        </ReviewSection>
      </main>
      {showModal && (
        <ModalBackdrop onClick={() => setShowModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4 text-white">
              {modalAction === "edit"
                ? "Enter password to edit"
                : "Enter the password"}
            </h3>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Password"
            />
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => {
                  setShowModal(false);
                  setPassword("");
                }}
                className="py-2 px-4 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition duration-150"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className={`py-2 px-4 text-white font-semibold rounded-lg transition duration-150 ${
                  modalAction === "edit"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {modalAction === "edit" ? "Confirm" : "Delete"}
              </button>
            </div>
          </ModalContent>
        </ModalBackdrop>
      )}
    </>
  );
}

const ReviewSection = styled.section`
  margin-top: 2rem;
  background-color: #1f2937;
  padding: 1.5rem;
  border-radius: 0.5rem;
`;

const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ReviewItem = styled.div`
  display: flex;
  gap: 1rem;
  background-color: rgba(55, 65, 81, 0.3);
  padding: 1.5rem;
  border-radius: 0.5rem;
  border: 1px solid #4b5563;
  transition: box-shadow 0.3s;

  &:hover {
    box-shadow: 0 0 15px rgba(59, 130, 246, 0.3);
  }
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #4b5563;
  flex-shrink: 0;
`;

const ReviewerInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const DeleteButton = styled.button`
  background-color: transparent;
  color: #ef4444;
  border: 1px solid #ef4444;
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: all 0.2s ease-in-out;
  line-height: 1.25;

  &:hover {
    background-color: #ef4444;
    color: white;
    box-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
  }
`;

const EditButton = styled.button`
  background-color: transparent;
  color: #3b82f6;
  border: 1px solid #3b82f6;
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: all 0.2s ease-in-out;
  line-height: 1.25;

  &:hover {
    background-color: #3b82f6;
    color: white;
    box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
  }
`;

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #1f2937;
  padding: 2rem;
  border-radius: 0.5rem;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
`;
