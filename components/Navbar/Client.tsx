"use client";
import React, { useState, useEffect } from 'react';
import { NewsDisplay } from '@/components';
import axios from 'axios';

const ClientComponent = () => {
  const [newsArticles, setNewsArticles] = useState([]);

  useEffect(() => {
    const apiKey = '54d23d7fa5de4370ac7fe6c049ca88c5';
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
