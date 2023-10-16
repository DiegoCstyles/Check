"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card } from 'react-bootstrap';
var NewsDisplay = function () {
    var _a = useState([]), newsArticles = _a[0], setNewsArticles = _a[1];
    useEffect(function () {
        // Replace 'YOUR_GOOGLE_NEWS_API_KEY' with your actual API key
        var apiKey = '54d23d7fa5de4370ac7fe6c049ca88c5';
        var query = 'ford cars'; // Query for "wheel industry" in Portuguese
        var apiUrl = "https://newsapi.org/v2/everything?q=".concat(encodeURIComponent(query), "&apiKey=").concat(apiKey);
        axios.get(apiUrl)
            .then(function (response) {
            var limitedArticles = response.data.articles.slice(0, 2);
            setNewsArticles(limitedArticles);
        })
            .catch(function (error) {
            console.error('Error fetching news articles:', error);
        });
    }, []);
    return (<Container>
      <Row>
        {newsArticles.map(function (article, index) { return (<Col key={index} md={4} className='mb-4'>
            <Card className='border-b-4 border-slate-400 mt-4 p-2'>
                <div className='justify-center flex'>
              <Card.Img src={article.urlToImage} className='object-cover inset-0 bg-transparent opacity-60 m-2 ' width={400} height={400} alt='Article Image'/>
              </div>
              <Card.Body className='mt-4'>
                    <Card.Title className='text-xs font-bold uppercase mb-2 ml-2 text-center'>{article.title}</Card.Title>
                    <Card.Text className='text-xs text-slate-400 ml-2 text-justify'>{article.description}</Card.Text>
              </Card.Body>
              <Card.Footer>
                <small className='text-muted'>
                  <a className='text-xs border-b-4 border-cyan-300 ml-2' href={article.url} target='_blank' rel='noopener noreferrer'>
                    leia mais
                  </a>
                </small>
              </Card.Footer>
            </Card>
          </Col>); })}
      </Row>
    </Container>);
};
export default NewsDisplay;
