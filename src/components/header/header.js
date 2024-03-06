import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect } from 'react';
import { clearToken, setUserData } from '../../actions/api';
import Button from '../button';
import replaceImage from '../../assets/avatarDef.png';
import classes from './header.module.scss';

export default function Header() {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const getUserData = useCallback((state) => state.userData);
    const userData = useSelector(getUserData);
    const { token, username, image, email } = userData;
    const newToken = token?.split('.')[0] || '';
    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        if (token) {
            fetch('https://blog.kata.academy/api/user', {
                headers: {
                    Authorization: `Token ${token}`,
                },
                signal,
            })
                .then((response) => response.json())
                .then((response) => {
                    dispatch(setUserData(response));
                })
                .catch((err) => console.log('abort', err));
        }

        return () => {
            controller.abort();
        };
    }, [newToken, username, email]);
    return (
        <header className={classes.header}>
            <Link to="/1">
                <h2 className={classes.header__title}>Realworld Blog</h2>
            </Link>
            <div className={classes.header__buttons}>
                {token && (
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <Link to="/new-article">
                            <Button
                                classList="green transparent"
                                style={{ height: 31, width: 112, marginRight: 32, marginLeft: 5 }}
                            >
                                Create article
                            </Button>
                        </Link>
                        <button
                            className={classes['header__image-button']}
                            type="button"
                            onClick={() =>
                                navigate(`/profile?username=${username}&mail=${email}&img=${image}`)
                            }
                        >
                            <p className={classes.header__username}>{username}</p>
                            <img
                                className={classes.header__image}
                                alt="avatar"
                                src={image || replaceImage}
                            />
                        </button>
                        <Button
                            style={{ marginRight: 32, width: 109, height: 51, fontSize: 18 }}
                            onClick={() => dispatch(clearToken())}
                            classList="black transparent"
                        >
                            Log out
                        </Button>
                    </div>
                )}
                {!token && (
                    <>
                        <Link
                            to="/login"
                            state={{ from: location }}
                            style={{ display: 'block', maxWidth: 109, marginRight: 16 }}
                        >
                            <button
                                className={`${classes.button} ${classes['button__sign-in']}`}
                                type="button"
                            >
                                Sign in
                            </button>
                        </Link>
                        <Link
                            to="/register"
                            style={{ display: 'block', maxWidth: 109, marginRight: 32 }}
                        >
                            <button
                                className={`${classes.button} ${classes['button__sign-up']}`}
                                type="button"
                            >
                                Sign up
                            </button>
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
}
