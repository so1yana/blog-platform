import { useState } from 'react';
import classes from './blog-list-item.module.scss';

export default function BlogListItem({ item }) {
    const { title, tags, text, likes, date, author } = item;
    const [liked, setLike] = useState('liked', false);
    const normalizedTags = tags.map((tag) => (
        <p key={tag} className={classes.article__tag}>
            {tag}
        </p>
    ));
    return (
        <li className={classes.article}>
            <div className={classes.article__body}>
                <div className={classes.article__title}>
                    <h3 className={classes['artice__title-text']}>{title}</h3>
                    <svg
                        className={liked ? `${classes.heart} ${classes.liked}` : classes.heart}
                        onClick={() => setLike(!liked)}
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
                    <span className={classes['artice__title-likes']}>{`${likes}`}</span>
                </div>
                <div className={classes.article__tags}>{normalizedTags}</div>
                <p className={classes.article__text}>{text}</p>
            </div>
            <div className={classes.article__author}>
                <div className={classes['article__author-info']}>
                    <h3 className={classes['article__author-name']}>{author.name}</h3>
                    <span className={classes.article__date}>{date}</span>
                </div>
                <img
                    className={classes['article__author-avatar']}
                    alt="avatar"
                    src={author.avatar}
                />
            </div>
        </li>
    );
}
