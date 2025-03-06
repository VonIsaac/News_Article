import { QueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import {jwtDecode} from 'jwt-decode'
import API from "./API";

export const queryClient = new QueryClient()



//getting the news Article

const getNews = async ({signal}) => {
    try{
        const response =  await API.get('/user-news/get-news', {signal})
        console.log(response)
        return response.data
    }catch(err){
        console.log(err)
    }
}

//get news by a single data
const getNewsId = async ({id}) => {
    try{
        const response = await API.get(`/user-news/get-news/${id}`)
        console.log(response)
        return response.data
    }catch(err){
        console.log(err)
    }
}

// deleting the news
const deleteNews = async ({id}) => {
    try{
        const response = await API.delete(`/news/delete-news/${id}`)
        console.log(response)
        if(!response.ok){
            const error = new Error('An error occurred while deleting the news');
            error.code = response.status;
            error.info = await response.json();
            throw error;
        }
        //return response
    }catch(err){
       console.log(err)
    }
}

// getting the news by page 

const getNewsPages = async (pageNews) => {
    try{
        const response =  await API.get(`/user-news/news-page?page=${pageNews}`)
        console.log(response.data.news)
        return response.data.news;
    }catch(err){
        console.error("Error fetching news:", err);
        return [];
    }
}

// adding a news data
const postNews = async (newsData) => {
    try{
        const response = await API.post('/news/create-news', newsData)
        console.log(response.data)
        return response.data
    }catch(err){
        if (err.response && err.response.data) {
            //alert("Invalid Credentials");
            throw new Error(err.response.data.message || 'Posting News Failed');
            
        }

        throw err;
    }
}



const postLogOut = async () => {
    try{
        const response = await API.post('/user/logout')
        console.log(response)
        Cookies.remove('token'); // Remove from client-side (if stored)
    }catch(err){
        console.log(err )
    }
}

const likeNews = async ({newsId,  likeType}) => {
    try{
        const response = await API.post(`/user-news/like-dislike/${newsId}`, {likeType}) 
        return response.data
    }catch(err){
        console.log(err )
    }
}

export{
    getNews,
    getNewsId,
    deleteNews,
    getNewsPages,
    postNews,
    postLogOut,
    likeNews,
}
