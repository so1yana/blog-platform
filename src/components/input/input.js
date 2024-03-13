import { forwardRef } from 'react';
import classes from './input.module.scss';

const Input = forwardRef((props, ref) => {
    const {
        type,
        defaultValue,
        placeholder,
        autofocus,
        onChange,
        id,
        name,
        style,
        value,
        onBlur,
        classList,
    } = props;

    const classesList =
        (typeof classList === 'string' &&
            classList?.split(' ')?.map((el) => {
                return classes[el];
            })) ||
        [];

    return (
        <input
            id={id}
            ref={ref}
            name={name}
            className={`${classes.input} ${classesList.join(' ')}`}
            type={type || 'text'}
            defaultValue={defaultValue}
            value={value}
            placeholder={placeholder}
            autoFocus={autofocus}
            onChange={onChange}
            onBlurCapture={onBlur}
            style={style}
        />
    );
});

export default Input;
