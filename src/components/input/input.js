import { forwardRef } from 'react';
import classes from './input.module.scss';

// const defaultProps = {
//     type: 'text',
//     defaultValue: '',
//     placeholder: '',
//     autofocus: false,
//     onChange: () => {},
// };

const Input = forwardRef((props, ref) => {
    const { type, defaultValue, placeholder, autofocus, onChange, id, name } = props;

    return (
        <input
            id={id}
            ref={ref}
            name={name}
            className={classes.input}
            type={type}
            defaultValue={defaultValue}
            placeholder={placeholder}
            autoFocus={autofocus}
            onChange={onChange}
        />
    );
});

export default Input;
