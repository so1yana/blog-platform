import {
    Route,
    RouterProvider,
    createRoutesFromElements,
    createBrowserRouter,
} from 'react-router-dom';
import React from 'react';
import Layout from '../layout';
import BlogList, { blogLoader } from '../blog-list';
import Article, { articleLoader } from '../article';
import Login from '../login';
import Register from '../register';
import EditProfile from '../edit-profile';
import EditArticle from '../edit-article';
import RequireAuth from '../hoc/RequireAuth';

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Layout />}>
            <Route path="/:page?" element={<BlogList />} loader={blogLoader} />
            <Route
                path="/article/:slug"
                element={<Article />}
                loader={articleLoader}
                errorElement={<h2 style={{ marginTop: 96 }}>Not found</h2>}
            />
            <Route path="/article/:slug/edit" element={<EditArticle />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
                path="/profile"
                element={
                    <RequireAuth>
                        <EditProfile />
                    </RequireAuth>
                }
            />
        </Route>,
    ),
);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
