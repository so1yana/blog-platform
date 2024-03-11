import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { updateUser } from '../../api';
import { setUser } from '../../reducers';
import Popup from '../../components/popup';
import Button from '../../components/button';
import Input from '../../components/input';
import ErrorP from '../../components/error-paragraph';
import classes from './edit-profile.module.scss';

export default function EditProfile() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const usernameInput = searchParams.get('username');
    const emailInput = searchParams.get('mail');
    const imageInput = searchParams.get('img');
    const usernameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const imageRef = useRef();
    const getToken = (state) => state.userData.token;
    const token = useSelector(getToken);
    const [message, setMessage] = useState();
    const [isUsername, setUsername] = useState(true);
    const [isEmail, setEmail] = useState(true);
    const [isPassword, setPassword] = useState(true);
    const [isImage, setImage] = useState(true);
    const [isPending, setPending] = useState(false);
    const [usernameMessage, setUsernameMessage] = useState(null);

    const handleSubmit = (e) => {
        setMessage();
        setUsername(true);
        setEmail(true);
        setPassword(true);
        setImage(true);
        setUsernameMessage(null);
        e.preventDefault();
        let isAllGood = true;
        if (usernameRef.current.value.length < 3 || usernameRef.current.value.length > 20) {
            isAllGood = false;
            setUsername(false);
            setUsernameMessage('Username must be at least 3 and less than 20 characters');
        }
        if (!usernameRef.current.value.match(/^[a-zA-Z0-9]*$/)) {
            isAllGood = false;
            setUsername(false);
            setUsernameMessage('Only characters A-z and numbers 0-9');
        }
        if (
            !emailRef.current.value.toLowerCase().match(
                // eslint-disable-next-line max-len
                /^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            )
        ) {
            isAllGood = false;
            setEmail(false);
        }
        if (
            (passwordRef.current.value.length > 0 && passwordRef.current.value.length < 6) ||
            passwordRef.current.value.length > 40
        ) {
            isAllGood = false;
            setPassword(false);
        }
        const regex =
            // eslint-disable-next-line max-len
            /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})(\.[a-zA-Z0-9]{2,})?/;
        if (imageRef.current.value.length && !imageRef.current.value.toLowerCase().match(regex)) {
            isAllGood = false;
            setImage(false);
        }
        if (
            !passwordRef.current.value.length &&
            usernameInput === usernameRef.current.value &&
            emailInput === emailRef.current.value &&
            imageInput === imageRef.current.value
        ) {
            isAllGood = false;
            setMessage({ message: 'Nothing to update', type: 'bad' });
        }
        if (isAllGood) {
            setPending(true);
            const userPost = {
                user: {
                    username: usernameRef.current.value,
                    email: emailRef.current.value,
                },
            };
            if (passwordRef.current.value.length)
                userPost.user.password = passwordRef.current.value;
            if (imageRef.current.value.length) userPost.user.image = imageRef.current.value;
            updateUser(token, userPost).then((response) => {
                setPending(false);
                if (Object.prototype.hasOwnProperty.call(response, 'errors')) setMessage(response);
                else {
                    dispatch(setUser(response));
                    navigate(
                        // eslint-disable-next-line max-len
                        `/profile?username=${response.user.username}&mail=${response.user.email}&img=${response.user.image}`,
                    );
                    setMessage(response);
                    passwordRef.current.value = '';
                }
            });
        }
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            setMessage(null);
        }, 5000);

        return () => {
            clearTimeout(timeout);
        };
    }, [message]);

    return (
        <>
            {message?.user?.token && <Popup type="good">Updated!</Popup>}
            {message?.errors && <Popup type="bad">Error!</Popup>}
            {message?.message && <Popup type={message.type}>{message.message}</Popup>}
            <form className={classes['edit-profile']} onSubmit={handleSubmit}>
                <h2 className={classes['edit-profile__title']}>Edit profile</h2>
                <label>
                    Username
                    <Input
                        ref={usernameRef}
                        name="username"
                        type="text"
                        placeholder="Username"
                        defaultValue={usernameInput}
                        onChange={() => {
                            setUsername(true);
                            setUsernameMessage(null);
                            setMessage();
                        }}
                        style={{ width: 287 }}
                    />
                    {!isUsername ? (
                        <ErrorP>{usernameMessage}</ErrorP>
                    ) : message?.errors?.username ? (
                        <ErrorP>{message?.errors?.username}</ErrorP>
                    ) : null}
                </label>
                <label>
                    Email address
                    <Input
                        ref={emailRef}
                        name="email"
                        type="email"
                        placeholder="Email address"
                        defaultValue={emailInput}
                        onChange={() => {
                            setEmail(true);
                            setMessage();
                        }}
                        style={{ width: 287 }}
                    />
                    {!isEmail ? (
                        <ErrorP>Write correct email. Example: example@gmail.com</ErrorP>
                    ) : message?.errors?.email ? (
                        <ErrorP>{message?.errors?.email}</ErrorP>
                    ) : null}
                </label>
                <label>
                    New password
                    <Input
                        ref={passwordRef}
                        name="password"
                        type="password"
                        placeholder="New password"
                        onChange={() => setPassword(true)}
                        style={{ width: 287 }}
                    />
                    {!isPassword && (
                        <ErrorP>Password must be at least 6 and less than 40 characters</ErrorP>
                    )}
                </label>
                <label>
                    Avatar image (url)
                    <Input
                        ref={imageRef}
                        name="image"
                        type="text"
                        placeholder="Avatar image"
                        defaultValue={imageInput}
                        onChange={() => setImage(true)}
                        style={{ width: 287 }}
                    />
                    {!isImage && <ErrorP>Avatar image must be URL</ErrorP>}
                </label>
                <Button
                    classList={`blue ${isPending && 'disabled'}`}
                    style={{ width: 319, height: 40, marginTop: 21 }}
                    type="submit"
                    disabled={isPending}
                >
                    {isPending ? 'Changing...' : 'Change'}
                </Button>
            </form>
        </>
    );
}
