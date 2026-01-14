// app/[recordId]/page.tsx
"use client";
import { useState } from 'react';

export default function PodcastPortal({ params }: { params: { recordId: string } }) {
  const [auth, setAuth] = useState({ email: '', password: '' });
  const [content, setContent] = useState<any>(null);
  const [error, setError] = useState('');

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/unlock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recordId: params.recordId, ...auth }),
    });
    const result = await res.json();
    if (result.success) setContent(result.data);
    else setError(result.message);
  };

  // State 1: Password Gate (The "Login")
  if (!content) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6 font-sans">
        <form onSubmit={handleUnlock} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Unlock Your Story</h2>
          <input type="email" placeholder="Email" required className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300" 
                 onChange={(e) => setAuth({...auth, email: e.target.value})} />
          <input type="password" placeholder="Password" required className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300" 
                 onChange={(e) => setAuth({...auth, password: e.target.value})} />
          <button className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold p-3 rounded-lg transition-colors">Listen Together</button>
          {error && <p className="text-red-500 mt-4 text-center text-sm">{error}</p>}
        </form>
      </div>
    );
  }

  // State 2: The Unlocked Podcast Page
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-white font-sans text-center">
      <div className="max-w-md w-full">
        <img src={content.cover} className="w-full aspect-square rounded-2xl shadow-2xl mb-8 object-cover" alt="Album Cover" />
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Our Love Podcast</h1>
        <audio controls className="w-full mb-8">
          <source src={content.audio} type="audio/mpeg" />
        </audio>
        <div className="bg-gray-50 p-6 rounded-xl border-t-4 border-pink-400">
          <p className="italic text-gray-700 leading-relaxed">"{content.message}"</p>
        </div>
      </div>
    </div>
  );
}
