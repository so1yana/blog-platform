import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { createArticle, updateArticle, getArticle } from '../../api';
import Input from '../../components/input';
import Button from '../../components/button';
import Popup from '../../components/popup';
import ErrorP from '../../components/error-paragraph';
import classes from './newArticle.module.scss';

const validateString = (string, min, max, isRequiered) => {
    let resultMessage = null;
    if (string.trim().length >= 1 && string.trim().length < min) {
        resultMessage = `Length must be at least ${min} characters`;
    }
    if (string.length > max) {
        resultMessage = `Length must be less than ${max} characters`;
    }
    if (string.trim().length === 0 && isRequiered) {
        resultMessage = 'Field is required';
    }

    return resultMessage;
};

export default function NewArticle() {
    const [pageData, setPageData] = useState(null);
    const { token, username } = useSelector((state) => state.userData);
    const { state, pathname } = useLocation();
    const navigate = useNavigate();
    const timeoutRef = useRef();
    const tagsRef = useRef();
    const titleRef = useRef();
    const descriptionRef = useRef();
    const bodyRef = useRef();
    const [serverMessage, setServerMessage] = useState(null);
    const [tags, setTags] = useState(state?.tagList?.length ? state.tagList : ['']);
    const [isPopup, setPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState(null);
    const [popupType, setPopupType] = useState('bad');
    const [titleMessage, setTitleMessage] = useState(null);
    const [descriptionMessage, setDescriptionMessage] = useState(null);
    const [bodyMessage, setBodyMessage] = useState(null);
    const params = useParams();
    const componentType = params?.slug ? 'update' : 'new';

    useEffect(() => {
        if (!state && params?.slug) {
            getArticle(params.slug).then((response) => {
                setPageData(response);
            });
        }
    }, []);

    useEffect(() => {
        if (isPopup) {
            if (popupMessage.includes('Article')) {
                const urlArticle = serverMessage.article.slug;
                timeoutRef.current = setTimeout(() => navigate(`/article/${urlArticle}`), 5000);
            } else timeoutRef.current = setTimeout(() => setPopup(false), 5000);
        }
        return () => {
            clearTimeout(timeoutRef.current);
        };
    }, [isPopup]);

    const addTag = () => {
        if (tags.length >= 10) {
            if (!isPopup) {
                setPopup(true);
                setPopupMessage('You cannot add more than 10 tags');
            }
            return;
        }
        setTags([...tags, '']);
    };

    const changeTag = (index, value) => {
        const tagsCopy = [...tags];
        const newTags = [...tagsCopy.slice(0, index), value, ...tagsCopy.slice(index + 1)];
        setTags(newTags);
    };

    const deleteTag = (index) => {
        if (tags.length === 1) {
            setPopup(true);
            setPopupMessage('You cannot delete this input');
            return;
        }
        const tagsCopy = [...tags];
        const newTags = [...tagsCopy.slice(0, index), ...tagsCopy.slice(index + 1)];
        setTags(newTags);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const title = titleRef.current;
        const description = descriptionRef.current;
        const body = bodyRef.current;
        const validateTitle = validateString(title.value, 3, 100, true);
        const validateDescription = validateString(description.value, 3, 100, true);
        const validateBody = validateString(body.value, 3, 20000, true);
        const isAllGood = !validateTitle && !validateDescription && !validateBody;
        setTitleMessage(validateTitle);
        setDescriptionMessage(validateDescription);
        setBodyMessage(validateBody);
        const tagsArray = tags.filter((tag) => {
            let isReturn = false;
            const normalizedTag = tag.trim();
            if (normalizedTag.length) isReturn = true;
            return isReturn;
        });
        const requestBody = {
            article: {
                title: title.value,
                description: description.value,
                body: body.value,
            },
        };
        if (tagsArray.length) requestBody.article.tagList = tagsArray;
        if (!isAllGood) return;
        const request =
            componentType === 'new'
                ? createArticle(token, requestBody)
                : updateArticle(token, requestBody, params.slug);
        request.then((response) => {
            setServerMessage(response);
            const responseWord = componentType === 'new' ? 'created' : 'updated';
            if (Object.prototype.hasOwnProperty.call(response, 'article')) {
                setPopupMessage(`Article successfully ${responseWord}!\nRedirected in 5 seconds`);
                setPopupType('good');
                setPopup(true);
            }
            if (response === 'Forbidden') {
                setPopupMessage('Access forbidden.');
                setPopupType('bad');
                setPopup(true);
            }
        });
    };

    const handleTextAreaInput = (event) => {
        setBodyMessage(null);
        const scrollLeft =
            window.scrollX ||
            (document.documentElement || document.body.parentNode || document.body).scrollLeft;
        const scrollTop =
            window.scrollY ||
            (document.documentElement || document.body.parentNode || document.body).scrollTop;
        const textarea = event?.target || event.current;

        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight - 32}px`;

        window.scrollTo(scrollLeft, scrollTop);
    };

    useEffect(() => {
        const { username: pageAuthor } = pageData?.article?.author || '.';
        if (!state && params?.slug) {
            if (pageAuthor && username && pageAuthor !== username) {
                const pathArr = pathname.split('/');
                const path = pathArr.slice(0, pathArr.length - 1).join('/');
                navigate(path);
            } else if (pageAuthor && username && pageAuthor === username) {
                const page = pageData.article;
                titleRef.current.value = page.title;
                descriptionRef.current.value = page.description;
                bodyRef.current.value = page.body;
                setTags(page.tagList);
                handleTextAreaInput(bodyRef);
            }
        }
    }, [pageData, username]);

    return (
        <>
            {isPopup && <Popup type={popupType}>{popupMessage}</Popup>}
            <form className={classes['new-article']} onSubmit={handleSubmit}>
                <h2 className={classes['new-article__title']}>
                    {componentType === 'update' ? 'Edit article' : 'Create new article'}
                </h2>
                <label style={{ width: '100%' }}>
                    <span>Title</span>
                    <Input
                        defaultValue={state?.title || ''}
                        ref={titleRef}
                        placeholder="Title"
                        style={{ width: 842, height: 8 }}
                        onChange={() => setTitleMessage(null)}
                    />
                    {titleMessage && <ErrorP>{titleMessage}</ErrorP>}
                </label>
                <label>
                    <span>Short description</span>
                    <Input
                        defaultValue={state?.description || ''}
                        ref={descriptionRef}
                        placeholder="Short description"
                        style={{ width: 842, height: 8 }}
                        onChange={() => setDescriptionMessage(null)}
                    />
                    {descriptionMessage && <ErrorP>{descriptionMessage}</ErrorP>}
                </label>
                <label>
                    <span>Text</span>
                    <textarea
                        defaultValue={state?.body || ''}
                        ref={bodyRef}
                        className={classes.textarea}
                        placeholder="Text"
                        onChange={handleTextAreaInput}
                        onFocus={handleTextAreaInput}
                        autoFocus
                    />
                    {bodyMessage && <ErrorP>{bodyMessage}</ErrorP>}
                </label>
                <label ref={tagsRef} style={{ alignSelf: 'start', marginBottom: 21 }}>
                    <span>Tags</span>
                    {tags.map((tag, index) => {
                        const element = (
                            <>
                                <Input
                                    style={{ marginRight: 17, width: 268 }}
                                    placeholder="Tag"
                                    value={tag}
                                    onChange={(e) => changeTag(index, e.target.value)}
                                />
                                <Button
                                    style={{ height: '100%', width: 118, marginRight: 17 }}
                                    onClick={() => deleteTag(index)}
                                    classList="red transparent"
                                >
                                    Delete
                                </Button>
                            </>
                        );
                        return (
                            <div key={`tag${index + 2}`} className={classes['tag-container']}>
                                {element}
                                {index === tags.length - 1 && (
                                    <Button
                                        style={{ height: '100%', width: 118 }}
                                        onClick={() => addTag()}
                                        classList="blue transparent"
                                    >
                                        Add tag
                                    </Button>
                                )}
                            </div>
                        );
                    })}
                </label>
                <Button
                    type="submit"
                    classList="blue"
                    style={{ alignSelf: 'start', height: 40, width: 319 }}
                >
                    Send
                </Button>
            </form>
        </>
    );
}
