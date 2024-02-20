import classes from './header.module.scss';

export default function Header() {
    return (
        <header className={classes.header}>
            <h2 className={classes.header__title}>Realworld Blog</h2>
            <div className={classes.header__buttons}>
                <button className={`${classes.button} ${classes['button__sign-in']}`} type="button">
                    Sign in
                </button>
                <button className={`${classes.button} ${classes['button__sign-up']}`} type="button">
                    Sign up
                </button>
            </div>
        </header>
    );
}
