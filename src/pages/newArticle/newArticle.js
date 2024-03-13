import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { createArticle, updateArticle, getArticle } from '../../api';
import Input from '../../components/input';
import Button from '../../components/button';
import Popup from '../../components/popup';
import ErrorP from '../../components/error-paragraph';
import classes from './newArticle.module.scss';

export default function NewArticle() {
    const getUserData = (state) => state.userData;
    const timeoutRef = useRef();
    const { username, token } = useSelector(getUserData);
    const { state } = useLocation();
    const [pageData, setPageData] = useState(null);
    const navigate = useNavigate();
    const params = useParams();
    const componentType = params?.slug ? 'update' : 'new';
    const [isPending, setPending] = useState(false);
    const [isPopup, setPopup] = useState(false);
    const [isButton, setButton] = useState(false);
    const [isRedirecting, setRedirecting] = useState(false);
    const [popupMessage, setPopupMessage] = useState(null);
    const [popupType, setPopupType] = useState(null);
    const [serverMessage, setServerMessage] = useState(null);
    const {
        control,
        register,
        setValue,
        formState: { errors },
        handleSubmit,
    } = useForm({
        mode: 'onChange',
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'Tags',
        rules: { required: true, maxLength: 10, minLength: 1 },
    });

    const removeItem = (index) => {
        if (fields.length < 2) return;
        remove(index);
    };

    useEffect(() => {
        if (!state && componentType === 'update') {
            getArticle(params.slug).then((response) => {
                if (response === 'Not Found') {
                    navigate('/');
                }
                setPageData(response);
            });
        } else if (state && componentType === 'update') {
            const tags = state?.tagList || [];
            setValue('title', state.title);
            setValue('description', state.description);
            setValue('body', state.body);
            if (tags?.length) {
                tags.map((tag) => append({ value: tag }));
            } else append({ value: '' });
        } else if (componentType === 'new') append({ value: '' });
    }, []);

    useEffect(() => {
        const pageAuthor = pageData?.article?.author?.username || null;
        if (!state && params?.slug) {
            if (pageAuthor === username && pageAuthor && username) {
                const page = pageData.article;
                const tags = page?.tagList || [];
                setValue('title', page.title);
                setValue('description', page.description);
                setValue('body', page.body);
                if (tags?.length) {
                    tags.map((tag) => append({ value: tag }));
                } else append({ value: '' });
            } else if (pageAuthor && username && pageAuthor !== username) navigate('/');
        }
    }, [username, pageData]);

    useEffect(() => {
        if (isPopup) {
            if (popupMessage?.props?.children[0]?.includes('Article')) {
                const urlArticle = serverMessage.article.slug;
                timeoutRef.current = setTimeout(() => navigate(`/article/${urlArticle}`), 5000);
            } else timeoutRef.current = setTimeout(() => setPopup(false), 5000);
        }
        return () => {
            clearTimeout(timeoutRef.current);
        };
    }, [isPopup]);

    const handleTextAreaInput = (event) => {
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

    const onSubmit = ({ title, body, description, Tags }) => {
        const tagList = Tags.map((tag) => tag.value);
        const requestBody = {
            article: {
                title,
                description,
                body,
                tagList,
            },
        };
        const request =
            componentType === 'new'
                ? createArticle(token, requestBody)
                : updateArticle(token, requestBody, params.slug);
        setPopup(false);
        setPending(true);
        setButton(true);
        request.then((response) => {
            setPending(false);
            setServerMessage(response);
            const responseWord = componentType === 'new' ? 'created' : 'updated';
            if (Object.prototype.hasOwnProperty.call(response, 'article')) {
                setPopupMessage(
                    <span>
                        {`Article successfully ${responseWord}!\nRedirecting in 5 seconds\n`}
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-around',
                                alignContent: 'center',
                                margin: 4,
                            }}
                        >
                            <button className={classes['popup-button']} type="button">
                                <Link to={`/article/${response.article.slug}`}>Redirect now</Link>
                            </button>
                            <button
                                className={classes['popup-button']}
                                type="button"
                                onClick={() => {
                                    setRedirecting(false);
                                    setButton(false);
                                    setPopup(false);
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </span>,
                );
                setPopupType('good');
                setPopup(true);
                setRedirecting(true);
            }
            if (response === 'Forbidden') {
                setPopupMessage('Access forbidden.');
                setPopupType('bad');
                setPopup(true);
            }
        });
    };

    return (
        <>
            {isPopup && <Popup type={popupType}>{popupMessage}</Popup>}
            <form className={classes['new-article']} onSubmit={handleSubmit(onSubmit)}>
                <h2 className={classes['new-article__title']}>
                    {componentType === 'update' ? 'Edit article' : 'Create new article'}
                </h2>
                <label style={{ width: '100%' }}>
                    <span>Title</span>
                    <Input
                        placeholder="Title"
                        style={{ width: 842, height: 8 }}
                        {...register('title', { required: 'Field is required' })}
                    />
                    {errors?.title && <ErrorP>{errors?.title?.message || 'Error'}</ErrorP>}
                </label>
                <label>
                    <span>Short description</span>
                    <Input
                        placeholder="Short description"
                        style={{ width: 842, height: 8 }}
                        {...register('description', { required: 'Field is required' })}
                    />
                    {errors?.description && (
                        <ErrorP>{errors?.description?.message || 'Error'}</ErrorP>
                    )}
                </label>
                <label>
                    <span>Text</span>
                    <textarea
                        className={classes.textarea}
                        placeholder="Text"
                        autoFocus
                        {...register('body', {
                            required: 'Field is required',
                            onChange: handleTextAreaInput,
                            onBlur: handleTextAreaInput,
                            onFocus: handleTextAreaInput,
                        })}
                    />
                    {errors?.body && <ErrorP>{errors?.body?.message || 'Error'}</ErrorP>}
                </label>
                <label style={{ alignSelf: 'start', marginBottom: 21 }}>
                    Tags
                    {fields.map((item, index) => {
                        const isItemWithError =
                            typeof errors?.Tags === 'object' &&
                            typeof errors?.Tags[index] === 'object';
                        const inlineStyle = { marginRight: 17, width: 268 };
                        if (isItemWithError) inlineStyle.outlineColor = 'red';
                        const element = (
                            <>
                                <Input
                                    style={inlineStyle}
                                    placeholder="tag"
                                    {...register(`Tags.${index}.value`, {
                                        required: 'Field is required',
                                        pattern: {
                                            value: /^[a-zа-яА-ЯA-Z0-9]+$/,
                                            message: 'Only letters and digits w/o spaces',
                                        },
                                        maxLength: 25,
                                        minLength: 2,
                                    })}
                                />
                                <Button
                                    style={{ height: '100%', width: 118, marginRight: 17 }}
                                    onClick={() => removeItem(index)}
                                    classList="red transparent"
                                >
                                    Delete
                                </Button>
                            </>
                        );

                        return (
                            <div key={item.id} className={classes['tag-container']}>
                                {element}
                                {index === fields.length - 1 && (
                                    <Button
                                        style={{ height: '100%', width: 118 }}
                                        onClick={() => append({ value: '' })}
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
                    classList={`blue ${isButton && 'disabled'}`}
                    style={{ alignSelf: 'start', height: 40, width: 319 }}
                    disabled={isButton}
                >
                    {isPending ? 'Sending' : isRedirecting ? 'Redirecting' : 'Send'}
                </Button>
            </form>
        </>
    );
}
