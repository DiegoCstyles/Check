"use client";
import React, { useState, useEffect } from 'react';
import { NewsDisplay } from '@/components';
import axios from 'axios';
var ClientComponent = function () {
    var _a = useState([]), newsArticles = _a[0], setNewsArticles = _a[1];
    useEffect(function () {
        // Replace 'YOUR_GOOGLE_NEWS_API_KEY' with your actual API key
        var apiKey = 'YOUR_GOOGLE_NEWS_API_KEY';
        var apiUrl = "https://newsapi.org/v2/top-headlines?sources=google-news&apiKey=".concat(apiKey);
        axios.get(apiUrl)
            .then(function (response) {
            setNewsArticles(response.data.articles);
        })
            .catch(function (error) {
            console.error('Error fetching news articles:', error);
        });
    }, []);
    return <NewsDisplay />;
};
export default ClientComponent;
