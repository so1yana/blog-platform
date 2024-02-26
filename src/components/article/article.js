import Markdown from 'react-markdown';
import { Await, useLoaderData, defer } from 'react-router-dom';
import { Suspense } from 'react';
import { format } from 'date-fns';
import { getArticle } from '../../api';
import articleClass from '../blog-list-item/blog-list-item.module.scss';
import cardClass from './article.module.scss';
import ArticleSkeleton from './article-skeleton';

const stripText = (text, count) => {
    if (!text.length) return '';
    const result = text.slice(0, count);
    return text.length > result.length ? `${result}...` : result;
};

function Article() {
    const { article } = useLoaderData();

    return (
        <Suspense fallback={<ArticleSkeleton />}>
            <Await resolve={article}>
                {(art) => {
                    const { author, body, createdAt, description, favoritesCount, tagList, title } =
                        art.article;
                    const normalizedTags = tagList.map((tag, id) => {
                        if (id === 7) return '...';
                        if (id > 7) return null;
                        return (
                            <p
                                key={`${tag}${(Math.random() + 15) * (Math.random() + 15) * 123}`}
                                className={articleClass.article__tag}
                            >
                                {tag ? stripText(tag, 8) : ''}
                            </p>
                        );
                    });
                    const normalizedDate = format(new Date(createdAt), 'LLLL dd, yyyy');
                    return (
                        <div className={cardClass.card}>
                            <div className={articleClass.article__body}>
                                <div className={cardClass.card__title}>
                                    <h3
                                        className={cardClass['card__title-text']}
                                        style={
                                            title.length > 80
                                                ? { fontSize: '12px' }
                                                : { fontSize: '20px' }
                                        }
                                    >
                                        {title}
                                    </h3>
                                    <svg
                                        className={`${cardClass.heart}`}
                                        onClick={() => {}}
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="nonzero"
                                            clipRule="evenodd"
                                            // eslint-disable-next-line max-len
                                            d="M12.0122 5.57169L10.9252 4.48469C8.77734 2.33681 5.29493 2.33681 3.14705 4.48469C0.999162 6.63258 0.999162 10.115 3.14705 12.2629L11.9859 21.1017L11.9877 21.0999L12.014 21.1262L20.8528 12.2874C23.0007 10.1395 23.0007 6.65711 20.8528 4.50923C18.705 2.36134 15.2226 2.36134 13.0747 4.50923L12.0122 5.57169ZM11.9877 0"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    <span
                                        className={articleClass['artice__title-likes']}
                                    >{`${favoritesCount}`}</span>
                                </div>
                                <div className={articleClass.article__tags}>{normalizedTags}</div>
                                <p className={cardClass.card__description}>{description}</p>
                                <Markdown className={cardClass.card__text}>{body}</Markdown>
                            </div>
                            <div className={articleClass.article__author}>
                                <div className={articleClass['article__author-info']}>
                                    <h3 className={articleClass['article__author-name']}>
                                        {author.username}
                                    </h3>
                                    <span className={articleClass.article__date}>
                                        {normalizedDate}
                                    </span>
                                </div>
                                <img
                                    className={articleClass['article__author-avatar']}
                                    alt="avatar"
                                    src={author.image}
                                    onError={(e) => {
                                        e.target.style.backgroundColor = '#F0F0F0';
                                        e.target.alt = ' ';
                                    }}
                                />
                            </div>
                        </div>
                    );
                }}
            </Await>
        </Suspense>
    );
}

async function getArticleItem(slug) {
    const result = await getArticle(slug);

    return result;
}

const articleLoader = async ({ params }) => {
    const { slug } = params;

    return defer({
        article: getArticleItem(slug),
    });
};

export default Article;
export { articleLoader };
