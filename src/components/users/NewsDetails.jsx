import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getNewsId } from "../../utils/htttps";

import NewsLike from "./NewsLike";

export default function NewsDetails() {
  const { id } = useParams(); // Get news ID from URL

  // Use useQuery to fetch news details
  const { data, isLoading, isError } = useQuery({
    queryKey: ["news-id", id], // Unique cache key
    queryFn: () => getNewsId({ id }), // Fetch function
  });

  if (isLoading) return <p className="text-center mt-5">Loading...</p>;
  if (isError) return <p className="text-center text-red-500">Error fetching news.</p>;

  const news = data.findNewsById; // Extract news object

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-2xl mx-auto bg-white p-6 shadow-lg rounded-lg">
        <img src={news.images} alt={news.title} className="w-full h-64 object-cover rounded-md mb-4" />
        <h1 className="text-3xl font-bold">{news.title}</h1>
        <p className="text-gray-700 mt-4">{news.text}</p>
        <p className="text-gray-500 mt-2"><strong>Author:</strong> {news.author}</p>
        <p className="text-gray-500"><strong>Category:</strong> {news.cathegory}</p>
        <p className="text-gray-500"><strong>Source:</strong> {news.source}</p>

        {/* Display Tags */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Tags:</h3>
          <div className="flex gap-2 mt-2">
            {news.tags.map((tag) => (
              <span key={tag._id} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                {tag.name}
              </span>
            ))}
          </div>
        </div>

        <div className=" flex justify-between items-center">
          <a href="/" className="mt-4 inline-block text-blue-600 hover:underline">Back to News</a>
            <NewsLike newsId={news._id}   initialDislike={news.dislike}  initialLike={news.like}  />
        </div>
      </div>
    </div>
  );
}
