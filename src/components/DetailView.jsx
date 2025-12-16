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

const TMDB_API_KEY = 'd0ae6c80f1ae0a6dc5f19f0a08d88f44'
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'


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
  const movie = mockMovies[id];
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tmdbPosterPath, setTmdbPosterPath] = useState(null);
  const [tmdbLoading, setTmdbLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://6933b1984090fe3bf01dc49f.mockapi.io/reviews?movieID=${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to load reviews.");
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
      if ( !movie || tmdbPosterPath ) return 0;

      setTmdbLoading(true);
      try{
        const response = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(movie.title)}&language=ko-KR`
        );
        
        if (!response.ok){
          throw new Error("Failed to load TMDb data.");
        }

        const data = await response.json();

        if (data.results && data.results.length > 0){
          setTmdbPosterPath(data.results[0].poster_path);
        }else{
          setTmdbPosterPath(null);
        }
      }catch (e){
        console.error("TMDb Fetch Error:", e);
      }finally{
        setTmdbLoading(false);
      }
    }

    if (id) {
      fetchReviews();
      fetchTmdbData();
    }
  }, [id, movie]);

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
            <h3 className="text-2xl font-bold text-white">
              {movie.title} Details
            </h3>
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
              style={posterUrl ? {
                backgroundImage: `url(${posterUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              } : {}}
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
                      className = "max-w-full max-h-full object-contain" 
                      />
                  ) : (
                    <p>[Image of 포스터]</p>
                  )
                }
              </div>
            </div>
            <div className="md:col-span-2 space-y-3 p-4 bg-gray-700/30 rounded-lg">
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
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 p-4 bg-gray-700/30 rounded-lg space-y-2">
              <div className="font-semibold text-white">
                Viewing Information
              </div>
              <div className="text-sm text-gray-300">
                Location: {movie.location}
              </div>
              <div className="text-sm text-gray-300">
                With: {movie.partners}
              </div>
              <div className="text-sm text-gray-300">
                Cookie Video: {movie.cookie}
              </div>
            </div>
            <div className="md:col-span-2 p-4 bg-gray-700/30 rounded-lg">
              <div className="font-semibold text-white mb-2">
                Memorable Quote
              </div>
              <blockquote className="italic text-gray-300">
                “{movie.quote}”
              </blockquote>
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
                    </div>
                  </ReviewItem>
                ))}
              </ReviewList>
            ) : (
              <p>No reviews yet.</p>
            ))}
        </ReviewSection>
      </main>
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
