import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSearchParams, Link } from "react-router-dom";
import { getNewsPages } from "../../utils/htttps";
import { useMutation } from "@tanstack/react-query";
import { postLogOut, queryClient } from "../../utils/htttps";

export default function NewsList() {
  const [news, setNews] = useState([]); // Stores news articles
  const [page, setPage] = useState(1); // Tracks the page number
  const [hasMore, setHasMore] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();



  //handle to logout token 
    const {mutate, isPending} = useMutation({
      mutationFn: postLogOut, 
      onSuccess: (data) => {
          queryClient.invalidateQueries('logout')
          console.log(data)
        
      }
    })

    
    const handleLogout = ( ) => {
      mutate()
  }

  useEffect(() => {
    loadNews(1); // Load first 3 articles initially
  }, []);

  const loadNews = async (pageNumber) => {
    const newNews = await getNewsPages(pageNumber);

    if (newNews.length === 0) {
      setHasMore(false);
      return;
    }

    setNews((prevNews) => [...prevNews, ...newNews]); // Append new articles
    setPage(pageNumber + 1); // Update page number for next request
    setSearchParams({ page: pageNumber + 1 });
  };

  return (
    <div className="container mx-auto px-4 py-6">
     <div className=" flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-6 text-center">Latest News</h1>
     </div>
      <InfiniteScroll
        dataLength={news.length}
        next={() => loadNews(page)}
        hasMore={hasMore}
        loader={<h4 className="text-center text-gray-500">Loading...</h4>}
        endMessage={
          <p className="text-center text-gray-600 mt-4">No more news available.</p>
        }
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((article) => (
            <div
              key={article._id}
              className="border border-gray-300 rounded-lg p-4 shadow-lg bg-white"
            >
              <img
                src={article.images}
                alt={article.title}
                className="w-full h-48 object-cover rounded-md"
              />
              <h2 className="text-xl font-semibold mt-3">{article.title}</h2>
              <p className="text-gray-700 mt-2">{article.text}</p>
              <p className="text-gray-500 mt-2">
                <strong>Author:</strong> {article.author}
              </p>
              <p className="text-gray-500">
                <strong>Category:</strong> {article.cathegory}
              </p>
               {/* See Details Button */}
               <Link to={`/news-list/${article._id}`}>
                <button className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                  See Details
                </button>
              </Link>
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}
