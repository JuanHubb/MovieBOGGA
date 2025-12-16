import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./Header.jsx";
import { mockMovies } from "../data/mockMovies.js";

function Star({ active, onClick, idx }) {
  return (
    <i
      className={`fas fa-star text-3xl cursor-pointer transition ${
        active ? "text-yellow-400" : "text-gray-600 hover:text-yellow-400"
      }`}
      data-rating={idx}
      onClick={onClick}
    />
  );
}

export default function ReviewForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const movie = mockMovies[id];

  const [sex, setSex] = useState("");
  const [age, setAge] = useState("");
  const [rating, setRating] = useState(0);
  const [location, setLocation] = useState("");
  const [partners, setPartners] = useState("");
  const [cookie, setCookie] = useState("");
  const [quote, setQuote] = useState("");
  const [content, setContent] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");

  const title = useMemo(
    () => (movie ? `Write Review for ${movie.title}` : "Write Review"),
    [movie],
  );

  const submit = async (e) => {
    e.preventDefault();
    const valid =
      sex &&
      age &&
      rating > 0 &&
      content.length >= 10 &&
      password.length >= 4 &&
      nickname;
    if (!valid) {
      alert(
        "Please fill in all required fields (Nickname, Gender, Age, Rating, Review (min. 10 characters), Password (min. 4 characters)).",
      );
      return;
    }

    const reviewData = {
      nickname,
      sex,
      age: parseInt(age, 10),
      rating,
      location,
      companion: partners,
      pcScene: cookie === "Y",
      quote,
      review: content,
      password,
      movieID: parseInt(id, 10),
    };

    try {
      const response = await fetch(
        "https://6933b1984090fe3bf01dc49f.mockapi.io/reviews",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reviewData),
        },
      );

      if (response.ok) {
        alert(
          `Review submitted successfully! (Movie: ${
            movie?.title ?? ""
          }, Rating: ${rating})`,
        );
        navigate(`/detail/${id}`);
      } else {
        const errorData = await response.json();
        alert(
          `Failed to submit review: ${errorData.message || "Unknown error"}`,
        );
      }
    } catch (error) {
      console.error("Network error while submitting review:", error);
      alert(
        "An error occurred while submitting the review. Please check your internet connection.",
      );
    }
  };

  return (
    <>
      <Header title={title} />
      <main className="container mx-auto p-4 md:p-8">
        <section className="panel p-6 md:p-8">
          <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-3">
            <button
              className="text-gray-400 hover:text-white transition duration-150"
              onClick={() => navigate(`/detail/${id}`)}
            >
              <i className="fas fa-arrow-left mr-2" /> Back to Details
            </button>
            <h3 className="text-2xl font-bold text-white">{title}</h3>
            <div />
          </div>

          <form className="space-y-4" onSubmit={submit}>
            <input type="hidden" value={id} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label htmlFor="reviewNickname" className="text-sm font-medium mb-1">
                  Nickname
                </label>
                <input
                  id="reviewNickname"
                  className="input-style"
                  placeholder="Enter your nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="reviewSex" className="text-sm font-medium mb-1">
                  Gender
                </label>
                <select
                  id="reviewSex"
                  className="input-style"
                  value={sex}
                  onChange={(e) => setSex(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="reviewAge" className="text-sm font-medium mb-1">
                  Age
                </label>
                <select
                  id="reviewAge"
                  className="input-style"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="10">10s</option>
                  <option value="20">20s</option>
                  <option value="30">30s</option>
                  <option value="40">40s</option>
                  <option value="50+">50s+</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium mb-2">Rating</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    idx={i}
                    active={i <= rating}
                    onClick={() => setRating(i)}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label
                  htmlFor="reviewLocation"
                  className="text-sm font-medium mb-1"
                >
                  Location
                </label>
                <input
                  id="reviewLocation"
                  className="input-style"
                  placeholder="e.g., CGV Gangnam"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="reviewPartners"
                  className="text-sm font-medium mb-1"
                >
                  Companion
                </label>
                <input
                  id="reviewPartners"
                  className="input-style"
                  placeholder="e.g., Friend, Alone, Partner"
                  value={partners}
                  onChange={(e) => setPartners(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="reviewCookie"
                  className="text-sm font-medium mb-1"
                >
                  Post-credits Scene
                </label>
                <select
                  id="reviewCookie"
                  className="input-style"
                  value={cookie}
                  onChange={(e) => setCookie(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="Y">Yes</option>
                  <option value="N">No</option>
                  <option value="Maybe">Unknown</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="reviewQuote" className="text-sm font-medium mb-1">
                Memorable Quote
              </label>
              <input
                id="reviewQuote"
                className="input-style"
                placeholder="Enter the most memorable quote."
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="reviewContent"
                className="text-sm font-medium mb-1"
              >
                Review
              </label>
              <textarea
                id="reviewContent"
                rows={5}
                className="input-style"
                placeholder="Please write an honest review (min. 10 characters)."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="reviewPassword"
                className="text-sm font-medium mb-1"
              >
                Password (for edit/delete)
              </label>
              <input
                id="reviewPassword"
                type="password"
                className="input-style"
                placeholder="Enter at least 4 characters."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="text-xs text-gray-500 mt-1">
                Required for editing or deleting the review.
              </span>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="py-2 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-150"
              >
                Submit Review
              </button>
            </div>
          </form>
        </section>
      </main>
    </>
  );
}
