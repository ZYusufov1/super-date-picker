import React, { useState, useEffect } from 'react';
import styles from '../SuperDatePicker/SuperDatePicker.module.css';
import {toExpression} from "../../utils/toExpression.ts";
import {parseExpression} from "../../utils/parseExpression.ts";

interface ExpressionInputProps {
    value: Date;
    onChange: (date: Date) => void;
}

export const ExpressionInput: React.FC<ExpressionInputProps> = ({ value, onChange }) => {
    const [input, setInput] = useState('');
    const [error, setError] = useState(false);

    useEffect(() => {
        console.log(value);
        setInput(toExpression(value));
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
        setError(false);
    };

    const handleBlur = () => {
        const parsed = parseExpression(input.trim());
        if (parsed) {
            onChange(parsed);
        } else {
            setError(true);
        }
    };

    return (
        <div className={styles.expressionInputWrapper}>
            <input
                value={input}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${styles.expressionInput} ${error ? styles.invalid : ''}`}
            />
        </div>
    );
};
