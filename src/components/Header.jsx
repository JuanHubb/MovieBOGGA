import React from 'react'

export default function Header({ title }) {
  return (
    <header className="bg-black/20 p-4 border-b border-gray-700 flex justify-between items-center shadow-md">
      <div className="text-xl font-bold text-white">{title}</div>
      <i className="fas fa-video text-2xl text-gray-500" />
    </header>
  )
}

