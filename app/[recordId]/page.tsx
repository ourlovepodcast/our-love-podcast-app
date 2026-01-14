// app/[recordId]/page.tsx
"use client";
import { useState, use } from 'react';

export default function PodcastPortal({ params }: { params: Promise<{ recordId: string }> }) {
  const decodedParams = use(params);
  const recordId = decodedParams.recordId;
  
  const [auth, setAuth] = useState({ email: '', password: '' });
  const [content, setContent] = useState<any>(null);
  const [error, setError] = useState('');

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); 
    
    const res = await fetch('/api/unlock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recordId, ...auth }),
    });
    
    const result = await res.json();
    if (result.success) {
      setContent(result.data);
    } else {
      setError(result.message);
    }
  };

  // State 1: Dark Minimalist Login UI
  if (!content) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#030303] p-6 font-sans">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center">
            {/* The "Smiley" Icon from your attachment */}
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-800 rounded-xl mb-6">
              <span className="text-2xl">😊</span>
            </div>
            <p className="text-gray-400 text-sm mb-2">Hey you, lovely couple!</p>
            <h2 className="text-2xl font-bold text-white">Log in to listen your episode!</h2>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">E-mail</label>
              <input 
                type="email" 
                required 
                className="w-full bg-[#1A1A1A] border-none text-white p-4 rounded-xl focus:ring-1 focus:ring-[#F53DA8] outline-none transition-all placeholder-gray-600"
                placeholder="email@example.com"
                onChange={(e) => setAuth({...auth, email: e.target.value})} 
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Password</label>
              <input 
                type="password" 
                required 
                className="w-full bg-[#1A1A1A] border-none text-white p-4 rounded-xl focus:ring-1 focus:ring-[#F53DA8] outline-none transition-all placeholder-gray-600"
                placeholder="••••••••"
                onChange={(e) => setAuth({...auth, password: e.target.value})} 
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-[#F53DA8] hover:bg-[#D4348F] text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-pink-500/20 active:scale-95"
            >
              Log in
            </button>
            
            {error && <p className="text-red-400 text-center text-sm font-medium pt-2">{error}</p>}
          </form>
        </div>
      </div>
    );
  }

  // State 2: Dark Podcast Player Page
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-[#030303] font-sans text-center">
      <div className="max-w-md w-full">
        <img 
          src={content.cover} 
          crossOrigin="anonymous"
          className="w-full aspect-square rounded-3xl shadow-2xl mb-10 object-cover" 
          alt="Album Cover" 
        />
        <h1 className="text-3xl font-bold mb-8 text-white">Our Love Podcast</h1>
        
        <div className="mb-10">
          <audio controls crossOrigin="anonymous" className="w-full custom-audio-player">
            <source src={content.audio} type="audio/mpeg" />
          </audio>
        </div>
        
        <div className="bg-[#1A1A1A] p-8 rounded-2xl border-l-4 border-[#F53DA8] text-left">
          <p className="text-gray-300 italic leading-relaxed text-lg">"{content.message}"</p>
        </div>
      </div>
      
      {/* Small Inline CSS to style the default audio player slightly for dark mode */}
      <style jsx>{`
        .custom-audio-player {
          filter: invert(100%) hue-rotate(180deg) brightness(1.5);
        }
      `}</style>
    </div>
  );
}
