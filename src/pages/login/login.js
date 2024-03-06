import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { token } from '../../actions/api';
import Input from '../../components/input';
import classes from './login.module.scss';

export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const fromPage = location.state?.from?.pathname || '/';
    const emailRef = useRef();
    const passwordRef = useRef();
    const [isMail, setEmail] = useState(true);
    const [isPassword, setPassword] = useState(true);
    const [message, setMessage] = useState(null);
    const [isLoading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        let isAllGood = true;
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
        if (isAllGood) {
            setLoading(true);
            const userPost = {
                user: {
                    email: emailRef.current.value,
                    password: passwordRef.current.value,
                },
            };
            fetch('https://blog.kata.academy/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userPost),
            })
                .then((response) => response.json())
                .then((response) => {
                    setLoading(false);
                    if (Object.prototype.hasOwnProperty.call(response, 'errors')) {
                        setMessage(response.errors);
                    } else {
                        dispatch(token(response.user.token));
                        localStorage.setItem('token', response.user.token);
                        if (fromPage === '/login') navigate('/1');
                        else navigate(fromPage);
                    }
                });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className={classes['login-page']}>
                <h2 className={classes['login-page__title']}>Sign in</h2>
                <label htmlFor="email">
                    Email address
                    <Input
                        style={{ width: 320 - 32 }}
                        id="email"
                        type="text"
                        placeholder="Email address"
                        ref={emailRef}
                        onChange={() => setEmail(true)}
                    />
                    {!isMail && (
                        <p className={classes['register-page__error-message']}>
                            Write correct email. Example: username@example.com
                        </p>
                    )}
                </label>
                <label htmlFor="password">
                    Password
                    <Input
                        style={{ width: 320 - 32 }}
                        id="password"
                        type="password"
                        placeholder="Password"
                        ref={passwordRef}
                        onChange={() => setPassword(true)}
                    />
                    {!isPassword && (
                        <p className={classes['register-page__error-message']}>
                            Password must be at least 6 and less than 40 characters
                        </p>
                    )}
                </label>
                {message && (
                    <p className={classes['register-page__error-message']}>Write correct data</p>
                )}
                <button className={classes['login-page__button']} type="submit">
                    {isLoading ? 'Loading...' : 'Login'}
                </button>
                <p className={classes['login-page__register']}>
                    Don’t have an account?{' '}
                    <Link style={{ display: 'inline' }} to="/register">
                        Sign Up.
                    </Link>
                </p>
            </div>
        </form>
    );
}
