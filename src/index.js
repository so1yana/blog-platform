import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import Header from './components/header';
import BlogList from './components/blog-list';

const items = [
    {
        id: 1,
        title: 'Some article title',
        likes: 12,
        tags: ['Tag1', 'Tag2'],
        // eslint-disable-next-line max-len
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt utLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris  nisi ut aliquip ex ea commodo consequat. ',
        date: 'March 5, 2023',
        author: {
            name: 'John Doe',
            avatar: 'https://yt3.googleusercontent.com/-CFTJHU7fEWb7BYEb6Jh9gm1EpetvVGQqtof0Rbh-VQRIznYYKJxCaqv_9HeBcmJmIsp2vOO9JU=s900-c-k-c0x00ffffff-no-rj',
        },
    },
];
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Header />
        <BlogList items={items} />
    </React.StrictMode>,
);
