"use client"
import { useState } from 'react';
import Image from 'next/image';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2Icon, ChevronLeft, ChevronRight } from "lucide-react";

export default function Home() {
  const [query, setQuery] = useState('');
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [shortsScrollPosition, setShortsScrollPosition] = useState(0);
  const [showAll, setShowAll] = useState(false);

  const fetchContent = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/scrapping?q=${query}`);
      const responseData = await res.json();
      if (responseData.success) {
        setData({
          youtube: {
            all: responseData.youtube.all,
            shorts: responseData.youtube.shorts,
            regularVideos: responseData.youtube.regularVideos,
            totalCount: responseData.youtube.totalCount,
            shortsCount: responseData.youtube.shortsCount,
            regularCount: responseData.youtube.regularCount
          },
          reddit: {
            all: responseData.reddit.all,
            discussions: responseData.reddit.discussions,
            media: responseData.reddit.media,
            totalCount: responseData.reddit.totalCount,
            discussionsCount: responseData.reddit.discussionsCount,
            mediaCount: responseData.reddit.mediaCount
          },
          query: responseData.query,
          timestamp: responseData.timestamp
        });
        console.log(responseData);
      } else {
        alert('Failed to fetch content: ' + responseData.error);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      alert('Failed to fetch content!');
    } finally {
      setIsLoading(false);
    }
  };

  const scrollShorts = (direction) => {
    const container = document.getElementById('shorts-container');
    const scrollAmount = 220;
    if (container) {  
      const newPosition = direction === 'left' 
        ? Math.max(0, shortsScrollPosition - scrollAmount)
        : Math.min(container.scrollWidth - container.clientWidth, shortsScrollPosition + scrollAmount);
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      setShortsScrollPosition(newPosition);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-neutral-100 dark:to-neutral-400">
            Multi-Platform Content Search
          </h1>
          <div className="flex w-full max-w-2xl gap-4">
            <Input
              type="text"
              placeholder="Enter search query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && fetchContent()}
              className="flex-1"
            />
            <Button 
              onClick={fetchContent}
              disabled={isLoading}
              className="relative inline-flex h-9 overflow-hidden  p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
            >
              {isLoading ? (
                <Loader2Icon className="h-5 w-5 animate-spin" />
              ) : (
                "Search"
              )}
            </Button>
          </div>
        </div>

        {data?.youtube?.shorts.length > 0 && (
          <div className="mb-12 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-black dark:text-white">YouTube Shorts</h2>
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                {data.youtube.shortsCount} shorts found
              </span>
            </div>
            <div className="relative group">
              <Button
                onClick={() => scrollShorts('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-black/80 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                variant="ghost"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <div 
                id="shorts-container"
                className="flex gap-4 pb-4 overflow-x-hidden scroll-smooth"
              >
                {data.youtube.shorts.map((video, index) => (
                  <div key={index} className="flex-shrink-0 w-[200px]">
                    <a href={video.link} target="_blank" rel="noopener noreferrer" className="block">
                      <div className="relative w-[200px] h-[356px] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                        <Image
                          src={video.thumbnail}
                          alt={video.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-2 left-2 right-2">
                          <div className="flex items-center gap-2 text-white">
                            <span className="bg-red-500 px-2 py-0.5 rounded text-xs">Short</span>
                            <span className="text-sm">{video.views}</span>
                          </div>
                        </div>
                      </div>
                      <h3 className="text-sm font-semibold mt-2 text-black dark:text-white line-clamp-2">
                        {video.title}
                      </h3>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                        {video.channelName} • {video.publishedTime}
                      </p>
                    </a>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => scrollShorts('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-black/80 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                variant="ghost"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          </div>
        )}

        {data?.youtube?.regularVideos.length > 0 && (
          <div className={`mb-12 ${showAll ? '' : "max-h-[500px]"} relative overflow-hidden`}  >
            {!showAll && (<div onClick={() => setShowAll(true)} className="absolute flex justify-center h-full w-full items-end text-white text-2xl font-bold z-40 cursor-pointer" style={{background: 'linear-gradient(to top, rgba(0,0,0,0.7  ), rgba(0,0,0,0))'}}><h2 className="text-2xl font-bold text-white mb-8">Show All</h2></div>)}
              <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-black dark:text-white">YouTube Videos</h2>
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                {data.youtube.regularCount} videos found
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.youtube.regularVideos.map((video, index) => (
                <div key={index} className="bg-white dark:bg-neutral-900 rounded-lg overflow-hidden shadow-lg border border-neutral-200 dark:border-neutral-800 hover:shadow-xl transition-shadow">
                  <a href={video.link} target="_blank" rel="noopener noreferrer" className="block">
                    <div className="relative w-full h-48 overflow-hidden">
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 hover:scale-105"
                      />
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-sm">
                        {video.duration}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-black dark:text-white hover:text-blue-600 dark:hover:text-blue-400 line-clamp-2">
                        {video.title}
                      </h3>
                      <div className="mt-2 flex flex-col gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{video.channelName}</span>
                          {video.badges?.length > 0 && (
                            <span className="bg-neutral-200 dark:bg-neutral-800 px-2 py-0.5 rounded-full text-xs">
                              {video.badges[0]}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span>{video.views}</span>
                          <span>•</span>
                          <span>{video.publishedTime}</span>
                        </div>
                        <p className="text-sm line-clamp-2 mt-1">{video.description}</p>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {data?.reddit?.all.length > 0 && (
          <div className="mb-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-black dark:text-white">Reddit Content</h2>
              <div className="flex gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                <span>{data.reddit.discussionsCount} discussions</span>
                <span>{data.reddit.mediaCount} media posts</span>
              </div>
            </div>
            <div className="grid gap-4">
              {data.reddit.all.map((post, index) => (
                <div key={index} className="bg-white dark:bg-neutral-900 rounded-lg p-4 shadow-lg border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors">
                  <a href={post.link} target="_blank" rel="noopener noreferrer" className="block">
                    <h3 className="text-lg font-semibold text-black dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                      {post.title}
                    </h3>
                    <div className="mt-2 flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <span className={post.isMedia ? "text-green-600 dark:text-green-400" : "text-blue-600 dark:text-blue-400"}>
                        {post.isMedia ? "Media" : "Discussion"}
                      </span>
                      <span>•</span>
                      <span>{post.subreddit}</span>
                      <span>•</span>
                      <span>{post.score} points</span>
                      <span>•</span>
                      <span>{post.numComments} comments</span>
                      <span>•</span>
                      <span>by {post.author}</span>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
