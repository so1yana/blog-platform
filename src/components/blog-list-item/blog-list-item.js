import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { likeArticle } from '../../api';
import classes from './blog-list-item.module.scss';

const stripText = (text, count) => {
    if (!text) return '';
    const result = text.slice(0, count);
    return text.length > result.length ? `${result}...` : result;
};

export default function BlogListItem({ item }) {
    const { title, tagList, body, favoritesCount, createdAt, author, slug, favorited } = item;
    const getToken = (state) => state.userData.token;
    const token = useSelector(getToken);
    const [likesCount, setLikes] = useState(favoritesCount || 0);
    const [heartClasses, setHeartClasses] = useState(
        !favorited ? [classes.heart] : [classes.heart, classes.liked],
    );
    const normalizedTags = tagList.map((tag, index) => {
        if (index >= 6) return null;
        return (
            <p
                key={`${tag}${(Math.random() + 15) * (Math.random() + 15) * 123}`}
                className={classes.article__tag}
            >
                {stripText(tag, 10)}
            </p>
        );
    });
    const normalizedTitle = stripText(title, 45);
    const normalizedBody = stripText(body, 180);
    const normalizedDate = format(new Date(createdAt), 'LLLL dd, yyyy');
    return (
        <Link style={{ height: 140, marginBottom: 26 }} to={`/article/${slug}`}>
            <li className={classes.article}>
                <div className={classes.article__body}>
                    <div className={classes.article__title}>
                        <h3 className={classes['artice__title-text']}>{normalizedTitle}</h3>
                        <svg
                            className={heartClasses.join(' ')}
                            onClick={(e) => {
                                e.preventDefault();
                                likeArticle(token, slug, !(heartClasses.length > 1)).then(
                                    (response) => {
                                        if (
                                            Object.prototype.hasOwnProperty.call(
                                                response,
                                                'article',
                                            )
                                        ) {
                                            const isLiked = response.article.favorited;
                                            if (isLiked) {
                                                setLikes(likesCount + 1);
                                                setHeartClasses([classes.heart, classes.liked]);
                                            } else {
                                                setLikes(likesCount - 1);
                                                setHeartClasses([classes.heart]);
                                            }
                                        }
                                    },
                                );
                            }}
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
                        <span className={classes['artice__title-likes']}>{`${likesCount}`}</span>
                    </div>
                    <div className={classes.article__tags}>{normalizedTags}</div>
                    <p className={classes.article__text}>{normalizedBody}</p>
                </div>
                <div className={classes.article__author}>
                    <div className={classes['article__author-info']}>
                        <h3 className={classes['article__author-name']}>{author.username}</h3>
                        <span className={classes.article__date}>{normalizedDate}</span>
                    </div>
                    <img
                        className={classes['article__author-avatar']}
                        alt="avatar"
                        src={author.image}
                        onError={(e) => {
                            e.target.style.backgroundColor = '#F0F0F0';
                            e.target.alt = ' ';
                        }}
                    />
                </div>
            </li>
        </Link>
    );
}
