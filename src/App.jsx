import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import RankingView from './components/RankingView.jsx'
import DetailView from './components/DetailView.jsx'
import ReviewForm from './components/ReviewForm.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RankingView />} />
        <Route path="/detail/:id" element={<DetailView />} />
        <Route path="/review/:id" element={<ReviewForm />} />
        <Route path="/review/:id/edit" element={<ReviewForm />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

