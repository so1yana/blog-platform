/* eslint-disable max-len */
// import { useEffect, useRef, useState } from 'react';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { updateUser } from '../../api';
import { setUser } from '../../reducers';
// import { useEffect } from 'react';
import Popup from '../../components/popup';
import Button from '../../components/button';
import Input from '../../components/input';
import ErrorP from '../../components/error-paragraph';
import classes from './edit-profile.module.scss';

export default function EditProfile() {
    const emailPattern =
        /^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const urlPattern =
        /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})(\.[a-zA-Z0-9]{2,})?/;
    const [searchParams] = useSearchParams();
    const usernameInput = searchParams.get('username');
    const emailInput = searchParams.get('mail');
    const imageInput = searchParams.get('img');
    const {
        register,
        handleSubmit,
        resetField,
        setError,
        formState: { errors },
    } = useForm({
        mode: 'onBlur',
        defaultValues: {
            username: usernameInput,
            email: emailInput,
            image: imageInput,
        },
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const getToken = (state) => state.userData.token;
    const token = useSelector(getToken);
    const [message, setMessage] = useState(null);
    const [isPopup, setPopup] = useState(false);
    const [isPending, setPending] = useState(false);

    useEffect(() => {
        let timeout;
        if (isPopup) {
            timeout = setTimeout(() => {
                setPopup(false);
                setMessage(null);
            }, 5000);
        }

        return () => {
            clearTimeout(timeout);
        };
    }, [message]);

    const onSubmit = ({ username, email, password, image }) => {
        if (
            username === usernameInput &&
            email === emailInput &&
            image === imageInput &&
            !password?.length
        ) {
            setMessage({ message: 'Nothing to update', type: 'bad' });
            setPopup(true);
            return;
        }
        setPending(true);
        const userPost = {
            user: {
                username,
                email,
                image,
            },
        };
        if (password?.length) userPost.user.password = password;
        updateUser(token, userPost).then((response) => {
            setPending(false);
            console.log(response);
            if (Object.prototype.hasOwnProperty.call(response, 'errors')) {
                if (response.errors?.username) {
                    setError(
                        'username',
                        { message: `Username ${response.errors.username}` },
                        { shouldFocus: true },
                    );
                }
                if (response.errors?.email) {
                    setError(
                        'email',
                        { message: `Email ${response.errors.email}` },
                        { shouldFocus: true },
                    );
                }
            } else {
                setPopup(true);
                setMessage({ message: 'Successfully updated!', type: 'good' });
                dispatch(setUser(response));
                resetField('password');
                navigate(
                    `/profile?username=${response.user.username}&mail=${response.user.email}&img=${response.user.image}`,
                );
            }
        });
    };

    return (
        <>
            {isPopup && <Popup type={message?.type || 'bad'}>{message?.message || 'Error'}</Popup>}
            <form className={classes['edit-profile']} onSubmit={handleSubmit(onSubmit)}>
                <h2 className={classes['edit-profile__title']}>Edit profile</h2>
                <label>
                    Username
                    <Input
                        placeholder="Username"
                        style={{ width: 287 }}
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
                        })}
                    />
                    {errors?.username && <ErrorP>{errors?.username?.message || 'Error'}</ErrorP>}
                </label>
                <label>
                    Email address
                    <Input
                        placeholder="Email address"
                        style={{ width: 287 }}
                        {...register('email', {
                            required: 'Required field',
                            pattern: {
                                value: emailPattern,
                                message: 'Write correct email. Example: example@gmail.com',
                            },
                        })}
                    />
                    {errors?.email && <ErrorP>{errors?.email?.message || 'Error'}</ErrorP>}
                </label>
                <label>
                    New password
                    <Input
                        type="password"
                        placeholder="New password"
                        style={{ width: 287 }}
                        {...register('password', {
                            required: false,
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
                    Avatar image (url)
                    <Input
                        placeholder="Avatar image"
                        style={{ width: 287 }}
                        {...register('image', {
                            required: false,
                            pattern: {
                                value: urlPattern,
                                message: 'Avatar image must be URL',
                            },
                        })}
                    />
                    {errors?.image && <ErrorP>{errors?.image?.message || 'Error'}</ErrorP>}
                </label>
                <Button
                    classList={`blue ${isPending && 'disabled'}`}
                    style={{ width: 319, height: 40, marginTop: 21 }}
                    type="submit"
                    onClick={() => setPopup(false)}
                    disabled={isPending}
                >
                    {isPending ? 'Changing...' : 'Change'}
                </Button>
            </form>
        </>
    );
}
