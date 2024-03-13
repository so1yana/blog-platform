import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { token } from '../../reducers';
import ErrorP from '../../components/error-paragraph';
import Input from '../../components/input';
import Popup from '../../components/popup';
import Button from '../../components/button';
import classes from './login.module.scss';

export default function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const emailPattern =
        // eslint-disable-next-line max-len
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const fromPage = location?.state?.from
        ? `${location?.state?.from?.pathname}${location?.state?.from?.search}`
        : '/';
    const [serverMessage, setServerMessage] = useState(null);
    const [isPending, setPending] = useState(false);
    const [isPopup, setPopup] = useState(false);

    const onSubmit = ({ email, password }) => {
        setPending(true);
        setPopup(false);
        const userPost = {
            user: {
                email,
                password,
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
                setPending(false);
                if (Object.prototype.hasOwnProperty.call(response, 'errors')) {
                    setServerMessage(response);
                } else {
                    dispatch(token(response.user.token));
                    localStorage.setItem('token', response.user.token);
                    if (fromPage === '/login') navigate('/1');
                    else navigate(fromPage);
                }
            });
    };

    useEffect(() => {
        let timeout;
        if (serverMessage?.errors) {
            setPopup(true);
            timeout = setTimeout(() => setPopup(false), 5000);
        }

        return () => {
            clearTimeout(timeout);
        };
    }, [serverMessage]);

    return (
        <>
            {isPopup && <Popup type="bad">Write correct data</Popup>}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={classes['login-page']}>
                    <h2 className={classes['login-page__title']}>Sign in</h2>
                    <label htmlFor="email">
                        Email address
                        <Input
                            style={{ width: 320 - 32 }}
                            placeholder="Email address"
                            {...register('email', {
                                required: 'Required field',
                                pattern: {
                                    value: emailPattern,
                                    message: 'Write correct email. Example: username@example.com',
                                },
                            })}
                        />
                        {errors?.email && <ErrorP>{errors?.email?.message || 'Error'}</ErrorP>}
                    </label>
                    <label htmlFor="password">
                        Password
                        <Input
                            style={{ width: 320 - 32 }}
                            placeholder="Password"
                            type="password"
                            {...register('password', {
                                required: 'Required field',
                                minLength: {
                                    value: 6,
                                    message: 'Password must be at least 6 characters',
                                },
                                maxLength: {
                                    value: 40,
                                    message: 'Password must be less than 40 characters',
                                },
                            })}
                        />
                        {errors?.password && (
                            <ErrorP>{errors?.password?.message || 'Error'}</ErrorP>
                        )}
                    </label>
                    <Button
                        classList={`blue ${isPending && 'disabled'}`}
                        style={{ width: 319, height: 40, marginTop: 21, marginBottom: 12 }}
                        type="submit"
                        disabled={isPending}
                    >
                        Login
                    </Button>
                    <p className={classes['login-page__register']}>
                        Don’t have an account?{' '}
                        <Link style={{ display: 'inline' }} to="/register">
                            Sign Up.
                        </Link>
                    </p>
                </div>
            </form>
        </>
    );
}
