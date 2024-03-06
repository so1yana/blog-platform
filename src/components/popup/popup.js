import classes from './popup.module.scss';

export default function Popup({ children, type }) {
    const defaultType = 'middle';

    return (
        <div className={`${classes.popup} ${classes[type] || classes[defaultType]}`}>
            <span>{children}</span>
        </div>
    );
}
