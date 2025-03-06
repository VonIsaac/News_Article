
import { useMutation, } from "@tanstack/react-query";
import { useState } from "react";
import { likeNews, queryClient } from "../../utils/htttps";
import { IconButton } from "@mui/material";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';

export default function NewsLike({newsId, initialLike, initialDislike}) {
    const [likes, setLikes] = useState(initialLike)
    const [dislikes, setDislikes] = useState(initialDislike);
    const [userReaction, setUserReaction] = useState(null); // Tracks the user's current reaction


    const { mutate: handleReaction } = useMutation({
      mutationFn: (likeType) => likeNews({ newsId, likeType }),
      onMutate: async (likeType) => {
        await queryClient.cancelQueries(["news", newsId]);
        const previousData = queryClient.getQueryData(["news", newsId]);
    
        let newLikes = likes;
        let newDislikes = dislikes;
    
        if (userReaction === likeType) {
          // Remove reaction
          if (likeType === "like") newLikes -= 1;
          if (likeType === "dislike") newDislikes -= 1;
          setUserReaction(null);
        } else {
          // Change or add reaction
          if (likeType === "like") {
            newLikes += 1;
            if (userReaction === "dislike") newDislikes -= 1;
          } else {
            newDislikes += 1;
            if (userReaction === "like") newLikes -= 1;
          }
          setUserReaction(likeType);
        }
    
        setLikes(newLikes);
        setDislikes(newDislikes);
        return { previousData };
      },
      onSuccess: (data) => {
        // Update state with backend response
        if (data?.news) {
          setLikes(data.news.like);
          setDislikes(data.news.dislike);
        }
      },
      onError: (err, likeType, context) => {
        queryClient.setQueryData(["news", newsId], context.previousData);
      },
      onSettled: () => {
        queryClient.invalidateQueries(["news", newsId]);
      },
    });
    
  return (
    <div>
    <IconButton  onClick={() => handleReaction('like')}  color={userReaction === 'like' ? "primary" : "default"}>
        <ThumbUpIcon /> {likes}
    </IconButton>
    <IconButton   onClick={() => handleReaction('dislike')} color={userReaction === 'dislike' ? "primary" : "default"}>
        <ThumbDownAltIcon /> {dislikes}
    </IconButton>
  </div>
  )
}
