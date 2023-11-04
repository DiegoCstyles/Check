"use client";
import React, { useState, useEffect } from 'react';
import { NewsDisplay } from '@/components';
import axios from 'axios';

const ClientComponent = () => {
  const [newsArticles, setNewsArticles] = useState([]);

  useEffect(() => {
    // Replace 'YOUR_GOOGLE_NEWS_API_KEY' with your actual API key
    const apiKey = 'YOUR_GOOGLE_NEWS_API_KEY';
    const apiUrl = `https://newsapi.org/v2/top-headlines?sources=google-news&apiKey=${apiKey}`;

    axios.get(apiUrl)
      .then(response => {
        setNewsArticles(response.data.articles);
      })
      .catch(error => {
        console.error('Error fetching news articles:', error);
      });
  }, []);

  return <NewsDisplay />;
};

export default ClientComponent;
