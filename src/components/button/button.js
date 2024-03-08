import { forwardRef } from 'react';
import classes from './button.module.scss';

const Button = forwardRef((props, ref) => {
    const { onClick, style, children, classList, type, disabled } = props;
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
            disabled={disabled}
        >
            {children}
        </button>
    );
});

export default Button;
