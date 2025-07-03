import React, {useState} from 'react';
import {
    addMinutes,
    addHours,
    addDays,
    addWeeks,
    addMonths,
    addYears,
} from 'date-fns';
import styles from './SuperDatePicker.module.css'

interface RelativeSelectorProps {
    onApply: (start: Date, end: Date, label: string) => void,
    onClose: () => void,
    setShowTime: (b: boolean) => void,
}

type Unit = 'm' | 'h' | 'd' | 'w' | 'M' | 'y';

const unitOptions: Record<Unit, string> = {
    m: 'minutes',
    h: 'hours',
    d: 'days',
    w: 'weeks',
    M: 'months',
    y: 'years',
};

const addFn: Record<Unit, (d: Date, n: number) => Date> = {
    m: addMinutes,
    h: addHours,
    d: addDays,
    w: addWeeks,
    M: addMonths,
    y: addYears,
};

export const RelativeSelector: React.FC<RelativeSelectorProps> = ({
    onApply,
    onClose,
    setShowTime,
}) => {
    const [direction, setDirection] = useState<'last' | 'next'>('last');
    const [amount, setAmount] = useState(15);
    const [unit, setUnit] = useState<Unit>('m');

    const apply = () => {
        const now = new Date();
        const n = direction === 'last' ? -amount : amount;
        const start = addFn[unit](now, n);
        const end = now;
        const label =
            direction === 'last'
                ? `Last ${amount} ${unitOptions[unit]}`
                : `Next ${amount} ${unitOptions[unit]}`;
        onApply(
            direction === 'last' ? start : now,
            direction === 'last' ? end : start,
            label
        );
        setShowTime(false);
        onClose();
    };

    return (
        <div style={{padding: 8}} className={`${styles.popover} ${styles.quickRow}`}>
            <div style={{display: 'flex', gap: 6}}>
                <select
                    value={direction}
                    onChange={e => setDirection(e.target.value as 'last' | 'next')}
                >
                    <option value="last">Last</option>
                    <option value="next">Next</option>
                </select>

                <input
                    type="number"
                    min={1}
                    value={amount}
                    onChange={e => setAmount(+e.target.value)}
                    style={{width: 70}}
                />

                <select value={unit} onChange={e => setUnit(e.target.value as Unit)}>
                    {Object.entries(unitOptions).map(([key, label]) => (
                        <option key={key} value={key}>
                            {label}
                        </option>
                    ))}
                </select>

                <button onClick={apply} className={styles.applyBtn}>Apply</button>
            </div>

        </div>
    );
};
