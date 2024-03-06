import { Link, useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { token } from '../../actions/api';
import Input from '../../components/input';
import classes from './register.module.scss';

export default function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const usernameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const rePasswordRef = useRef();
    const agreeRef = useRef();
    const [isUsername, setUsername] = useState(true);
    const [isEmail, setEmail] = useState(true);
    const [isPassword, setPassword] = useState(true);
    const [isRePassword, setRePassword] = useState(true);
    const [isAgree, setAgree] = useState(true);
    const [message, setMessage] = useState('');

    if (!isAgree) agreeRef.current.style.borderColor = 'red';
    if (isAgree && agreeRef.current) agreeRef.current.style.borderColor = '#1890ff';
    const handleSubmit = (e) => {
        let isAllGood = true;
        e.preventDefault();
        if (usernameRef.current.value.length < 3 || usernameRef.current.value.length > 20) {
            isAllGood = false;
            setUsername(false);
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
        if (passwordRef.current.value.length < 6 || passwordRef.current.value.length > 40) {
            isAllGood = false;
            setPassword(false);
        }
        if (rePasswordRef.current.value.length < 6 || rePasswordRef.current.value.length > 40) {
            isAllGood = false;
            setRePassword('length');
        } else if (rePasswordRef.current.value !== passwordRef.current.value) {
            isAllGood = false;
            setRePassword('match');
        }
        if (!agreeRef.current.checked) {
            isAllGood = false;
            setAgree(false);
        }
        if (isAllGood) {
            const userPost = {
                user: {
                    username: usernameRef.current.value,
                    email: emailRef.current.value,
                    password: passwordRef.current.value,
                },
            };
            fetch('https://blog.kata.academy/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userPost),
            })
                .then((response) => response.json())
                .then((response) => {
                    console.log(response);
                    if (Object.prototype.hasOwnProperty.call(response, 'errors'))
                        setMessage(response);
                    else {
                        dispatch(token(response.user.token));
                        localStorage.setItem('token', response.user.token);
                        navigate('/1');
                    }
                });
        }
    };
    return (
        <form onSubmit={handleSubmit}>
            <div className={classes['register-page']}>
                <h2 className={classes['register-page__title']}>Create new account</h2>
                <label>
                    Username
                    <Input
                        style={{ width: 320 - 32 }}
                        ref={usernameRef}
                        name="username"
                        type="text"
                        placeholder="Username"
                        onChange={() => setUsername(true)}
                        autoFocus
                    />
                    {!isUsername ? (
                        <p className={classes['register-page__error-message']}>
                            Username must be at least 3 and less than 20 characters
                        </p>
                    ) : message?.errors?.username ? (
                        <p className={classes['register-page__error-message']}>
                            {message?.errors?.username}
                        </p>
                    ) : null}
                </label>
                <label>
                    Email address
                    <Input
                        style={{ width: 320 - 32 }}
                        ref={emailRef}
                        name="email"
                        type="text"
                        placeholder="Email address"
                        onChange={() => setEmail(true)}
                    />
                    {!isEmail ? (
                        <p className={classes['register-page__error-message']}>
                            Write correct email. Example: example@gmail.com
                        </p>
                    ) : message?.errors?.email ? (
                        <p className={classes['register-page__error-message']}>
                            {message?.errors?.email}
                        </p>
                    ) : null}
                </label>
                <label>
                    Password
                    <Input
                        style={{ width: 320 - 32 }}
                        ref={passwordRef}
                        name="password"
                        type="password"
                        placeholder="Password"
                        onChange={() => setPassword(true)}
                    />
                    {!isPassword && (
                        <p className={classes['register-page__error-message']}>
                            Password must be at least 6 and less than 40 characters
                        </p>
                    )}
                </label>
                <label>
                    Repeat password
                    <Input
                        style={{ width: 320 - 32 }}
                        ref={rePasswordRef}
                        name="repeat-password"
                        type="password"
                        placeholder="Password"
                        onChange={() => setRePassword(true)}
                    />
                    {isRePassword === 'length' ? (
                        <p className={classes['register-page__error-message']}>
                            Password must be at least 6 and less than 40 characters
                        </p>
                    ) : isRePassword === 'match' ? (
                        <p className={classes['register-page__error-message']}>
                            RePassword should be match with password
                        </p>
                    ) : null}
                </label>
                <hr className={classes['register-page__line']} />
                <label className={`${classes['register-page__agree']}`} htmlFor="agree">
                    <input
                        ref={agreeRef}
                        id="agree"
                        type="checkbox"
                        onChange={() => setAgree(true)}
                    />
                    I agree to the processing of my personal information
                </label>
                <button className={classes['register-page__button']} type="submit">
                    Create
                </button>
                <p className={classes['register-page__signin']}>
                    Already have an account?{' '}
                    <Link style={{ display: 'inline' }} to="/login">
                        Sign in
                    </Link>
                </p>
            </div>
        </form>
    );
}
