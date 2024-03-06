import { forwardRef } from 'react';
import classes from './button.module.scss';

const Button = forwardRef((props, ref) => {
    const { onClick, style, children, classList, type } = props;
    const classesList =
        classList?.split(' ').map((el) => {
            return classes[el];
        }) || [];

    return (
        <button
            ref={ref}
            className={`${classes.button} ${classesList.join(' ')}`}
            type={!type ? 'button' : 'submit'}
            onClick={onClick}
            style={style}
        >
            {children}
        </button>
    );
});

export default Button;
