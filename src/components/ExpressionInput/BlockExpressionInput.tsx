import type {DateRange} from "../../types";
import {ExpressionInput} from "./ExpressionInput.tsx";
import styles from "../SuperDatePicker/SuperDatePicker.module.css";
import React from "react";

interface ExpressionInputProps {
    value: DateRange,
    onChange: (value: (((prevState: DateRange) => DateRange) | DateRange)) => void
}

export const BlockExpressionInput: React.FC<ExpressionInputProps> = ({value, onChange}) => {


    return (
        <div className={styles.expressionInputRow}>
            <div className={styles.expressionInputTitle}> Dates </div>

            <ExpressionInput value={value.start} onChange={(d) => onChange(r => ({...r, start: d}))}/>
            <span className={styles.arrow}> → </span>
            <ExpressionInput value={value.end} onChange={(d) => onChange(r => ({...r, end: d}))}/>

        </div>
    )

};
