/* eslint-disable no-unsafe-optional-chaining */
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { token } from '../../reducers';
import ErrorP from '../../components/error-paragraph';
import Input from '../../components/input';
import Button from '../../components/button';
import classes from './register.module.scss';

export default function Register() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ mode: 'onBlur' });
    const emailPattern =
        // eslint-disable-next-line max-len
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [message, setMessage] = useState(null);
    const [usernameMessage, setUsernameMessage] = useState(null);
    const [emailMessage, setEmailMessage] = useState(null);
    const [isPending, setPending] = useState(false);
    useEffect(() => {
        if (message?.username) setUsernameMessage(`Username ${message.username}`);
        if (message?.email) setEmailMessage(`Email ${message.email}`);
    }, [message]);

    const onSubmit = ({ username, email, password }) => {
        if (usernameMessage || emailMessage) return;
        setMessage(null);
        setPending(true);
        const userPost = {
            user: {
                username,
                email,
                password,
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
                setPending(false);
                console.log(response);
                if (Object.prototype.hasOwnProperty.call(response, 'errors'))
                    setMessage(response.errors);
                else {
                    dispatch(token(response.user.token));
                    localStorage.setItem('token', response.user.token);
                    navigate('/1');
                }
            });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className={classes['register-page']}>
                <h2 className={classes['register-page__title']}>Create new account</h2>
                <label>
                    Username
                    <Input
                        style={{ width: 320 - 32 }}
                        placeholder="Username"
                        {...register('username', {
                            required: 'Required field',
                            minLength: {
                                value: 3,
                                message: 'Username must be at least 3 characters',
                            },
                            maxLength: {
                                value: 20,
                                message: 'Username must be less than 40 characters',
                            },
                            onChange: () => setUsernameMessage(null),
                        })}
                    />
                    {errors?.username ? (
                        <ErrorP>{errors?.username?.message || 'Error'}</ErrorP>
                    ) : (
                        <ErrorP>{usernameMessage}</ErrorP>
                    )}
                </label>
                <label>
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
                            onChange: () => setEmailMessage(null),
                        })}
                    />
                    {errors?.email ? (
                        <ErrorP>{errors?.email?.message || 'Error'}</ErrorP>
                    ) : (
                        <ErrorP>{emailMessage}</ErrorP>
                    )}
                </label>
                <label>
                    Password
                    <Input
                        style={{ width: 320 - 32 }}
                        type="password"
                        placeholder="Password"
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
                    {errors?.password && <ErrorP>{errors?.password?.message || 'Error'}</ErrorP>}
                </label>
                <label>
                    Repeat password
                    <Input
                        style={{ width: 320 - 32 }}
                        type="password"
                        placeholder="Password"
                        {...register('repeatPassword', {
                            required: 'Required field',
                            validate: (curr, { password }) => {
                                return curr === password || 'Password mismatch';
                            },
                        })}
                    />
                    {errors?.repeatPassword && (
                        <ErrorP>{errors?.repeatPassword?.message || 'Error'}</ErrorP>
                    )}
                </label>
                <hr className={classes['register-page__line']} />
                <label className={`${classes['register-page__agree']}`} htmlFor="isAgree">
                    <input
                        id="isAgree"
                        type="checkbox"
                        {...register('isAgree', { required: 'Required field' })}
                        style={
                            errors?.isAgree ? { borderColor: 'red' } : { borderColor: '#1890ff' }
                        }
                    />
                    I agree to the processing of my personal information
                </label>
                <Button
                    style={{ width: 319, height: 40, marginTop: 21, marginBottom: 12 }}
                    classList={`blue ${isPending && 'disabled'}`}
                    type="submit"
                >
                    Create
                </Button>
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
