import { Routes, Route } from 'react-router-dom';
import React from 'react';
import Header from '../header';
import BlogList from '../blog-list';
import Article from '../article';

function App() {
    return (
        <>
            <Header />
            <Routes>
                <Route path="/" element={<BlogList />} />
                <Route path="/article/:slug" element={<Article />} />
            </Routes>
        </>
    );
}

export default App;
