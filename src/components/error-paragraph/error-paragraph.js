import classes from './error-paragraph.module.scss';

export default function ErrorP({ children }) {
    return <p className={classes['error-paragraph']}>{children}</p>;
}
