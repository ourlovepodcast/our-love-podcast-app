// app/[recordId]/page.tsx
"use client";
import { useState, use, useRef, useEffect } from 'react';

export default function PodcastPortal({ params }: { params: Promise<{ recordId: string }> }) {
  const decodedParams = use(params);
  const recordId = decodedParams.recordId;
  
  const [auth, setAuth] = useState({ email: '', password: '' });
  const [content, setContent] = useState<any>(null);
  const [error, setError] = useState('');

  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (content && (window as any).Trustpilot) {
      (window as any).Trustpilot.loadFromElement(document.querySelector('.trustpilot-widget'));
    }
  }, [content]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); 
    const res = await fetch('/api/unlock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recordId, email: auth.email, password: auth.password }),
    });
    const result = await res.json();
    if (result.success) setContent(result.data);
    else setError(result.message);
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  // Function to handle the download safely from S3
  const handleDownload = async () => {
    try {
      const response = await fetch(content.audio);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "OurLovePodcast_Episode.mp3";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  if (!content) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#030303] p-6 font-sans text-white">
        <div className="w-full max-w-sm space-y-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-[#1A1A1A] rounded-xl mb-4">
              <span className="text-2xl">😊</span>
            </div>
            <p className="text-gray-400 text-sm">Hey you, lovely couple!</p>
            <h2 className="text-2xl font-bold leading-tight">Log in to listen your episode!</h2>
          <form onSubmit={handleUnlock} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">E-mail</label>
              <input type="email" required className="w-full bg-[#1A1A1A] border-none text-white p-4 rounded-xl focus:ring-1 focus:ring-[#F53DA8] outline-none transition-all" placeholder="email@example.com" onChange={(e) => setAuth({...auth, email: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Password</label>
              <input type="password" required className="w-full bg-[#1A1A1A] border-none text-white p-4 rounded-xl focus:ring-1 focus:ring-[#F53DA8] outline-none transition-all" placeholder="••••••••" onChange={(e) => setAuth({...auth, password: e.target.value})} />
            </div>
            <button type="submit" className="w-full bg-[#F53DA8] hover:bg-[#D4348F] text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-pink-500/20 active:scale-95">Log in</button>
            {error && <p className="text-red-400 text-center text-sm font-medium pt-2">{error}</p>}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-[#030303] font-sans text-center text-white">
      <div className="max-w-md w-full relative">
        
        {/* NEW DOWNLOAD BUTTON AT THE TOP */}
        <button 
          onClick={handleDownload}
          className="mb-8 inline-flex items-center gap-2 text-[#F53DA8] font-bold py-2 px-6 rounded-full border-2 border-[#F53DA8] hover:bg-[#F53DA8] hover:text-white transition-all text-sm uppercase tracking-widest"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
          Download Episode
        </button>

        <img src={content.cover} crossOrigin="anonymous" className="w-full aspect-square rounded-3xl shadow-2xl mb-10 object-cover border border-[#1A1A1A]" alt="Album Cover" />
        <h1 className="text-2xl font-bold mb-8">Our Love Podcast</h1>
        
        <audio 
          ref={audioRef} 
          src={content.audio} 
          onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)} 
          onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)} 
          crossOrigin="anonymous" 
        />

        <div className="w-full mb-10 px-2 text-left">
          <div className="w-full h-1 bg-gray-800 rounded-full mb-3 relative overflow-hidden">
            <div className="h-full bg-[#F53DA8] transition-all duration-100 ease-linear" style={{ width: `${(currentTime / duration) * 100}%` }} />
          </div>
          <div className="flex justify-between text-xs text-gray-500 font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <div className="flex justify-center mt-8">
            <button onClick={togglePlay} className="w-16 h-16 rounded-full bg-[#F53DA8] flex items-center justify-center shadow-lg shadow-pink-500/30 active:scale-90 transition-transform">
              {isPlaying ? (
                <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
              ) : (
                <svg className="w-6 h-6 fill-white ml-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              )}
            </button>
          </div>
        </div>

        <div className="mb-10 min-h-[52px]">
          <div className="trustpilot-widget" data-locale="en-US" data-template-id="56278e9abfbbba0bdcd568bc" data-businessunit-id="696f337dfb05178b81d8bb0c" data-style-height="52px" data-style-width="100%" data-token="1029ad08-dc3c-47cf-9775-aaa1a3797e7c">
            <a href="https://www.trustpilot.com/review/ourlovepodcast.com" target="_blank" rel="noopener">Trustpilot</a>
          </div>
        </div>
        
        <div className="bg-[#1A1A1A] p-8 rounded-2xl border-l-4 border-[#F53DA8] text-left">
          <p className="text-gray-300 italic leading-relaxed text-lg">"{content.message}"</p>
        </div>
      </div>
    </div>
  );
}
