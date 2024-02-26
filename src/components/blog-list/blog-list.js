import { Pagination } from 'antd';
import { useParams, Link, useLoaderData, defer, Await } from 'react-router-dom';
import { Suspense } from 'react';
import getArticles from '../../api';
import BlogListItem from '../blog-list-item';
import BlogListSkeleton from './blog-list-skeleton';
import './normalize.css';

const render = (p, t) => {
    return (
        <Link style={{ padding: '0', width: '30px', height: '30px' }} to={`/${p}`}>
            {t === 'jump-next' ? (
                <div>{'>>'}</div>
            ) : t === 'jump-prev' ? (
                <div>{'<<'}</div>
            ) : t === 'prev' ? (
                <div>{'<'}</div>
            ) : t === 'next' ? (
                <div>{'>'}</div>
            ) : (
                p
            )}
        </Link>
    );
};

export default function BlogList() {
    const { page } = useParams();
    const { articles } = useLoaderData();

    return (
        <Suspense fallback={<BlogListSkeleton />}>
            <Await resolve={articles}>
                {({ articles: items, articlesCount }) => {
                    let elems = [];
                    if (items.length > 0) {
                        elems = items.map((el) => (
                            <BlogListItem
                                // eslint-disable-next-line max-len
                                key={`${el.slug}${(Math.random() + 15) * (Math.random() + 15) * 123}`}
                                item={el}
                            />
                        ));
                    }
                    return (
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                marginBottom: '16px',
                                marginTop: '96px',
                            }}
                        >
                            {elems}
                            <Pagination
                                defaultCurrent={Number(page) || 1}
                                total={articlesCount}
                                pageSize={5}
                                showSizeChanger={false}
                                itemRender={render}
                            />
                        </div>
                    );
                }}
            </Await>
        </Suspense>
    );
}

async function getPosts(page) {
    const result = await getArticles(page * 5 - 5, page || 1);

    return result;
}

const blogLoader = async ({ params }) => {
    const { page } = params;

    return defer({
        articles: getPosts(page),
    });
};

export { blogLoader };
