import {
    Route,
    RouterProvider,
    createRoutesFromElements,
    createBrowserRouter,
    Navigate,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { Tuple, configureStore } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk';
import React from 'react';
import Layout from '../../pages/layout';
import BlogList, { blogLoader } from '../blog-list';
import Article, { articleLoader } from '../article';
import Login from '../../pages/login';
import Register from '../../pages/register';
import EditProfile from '../../pages/edit-profile';
import RequireAuth from '../hoc/RequireAuth';
import NewArticle from '../../pages/newArticle';
import reducer from '../../reducers';

const store = configureStore({ reducer, middleware: () => new Tuple(thunk) });

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Layout />} errorElement={<Navigate to="/1" />}>
            <Route
                path="/:page?"
                element={<BlogList />}
                loader={(a) => {
                    a.context = store.getState().userData.token;
                    return blogLoader(a);
                }}
            />
            <Route
                path="/article/:slug"
                element={<Article />}
                loader={(a) => {
                    a.context = store.getState().userData.token;
                    return articleLoader(a);
                }}
                errorElement={<h2 style={{ marginTop: 96 }}>Not found</h2>}
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
                path="/article/:slug/edit"
                element={
                    <RequireAuth>
                        <NewArticle />
                    </RequireAuth>
                }
            />
            <Route
                path="/profile"
                element={
                    <RequireAuth>
                        <EditProfile />
                    </RequireAuth>
                }
            />
            <Route
                path="/new-article"
                element={
                    <RequireAuth>
                        <NewArticle />
                    </RequireAuth>
                }
            />
        </Route>,
    ),
);

function App() {
    return (
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    );
}

export default App;
