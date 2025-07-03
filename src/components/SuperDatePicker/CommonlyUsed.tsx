import React from 'react';
import styles from './SuperDatePicker.module.css';
import type { PresetRange } from '../../types';

interface CommonlyUsedProps {
    onSelect: (preset: PresetRange) => void;
}

const clone = (d: Date) => new Date(d.getTime());

export const CommonlyUsed: React.FC<CommonlyUsedProps> = ({ onSelect }) => {
    const presets: PresetRange[] = [
        {
            label: 'Today',
            getRange: () => {
                const now = new Date();
                const start = clone(now);
                start.setHours(0, 0, 0, 0);
                return { start, end: now };
            },
        },
        {
            label: 'Yesterday',
            getRange: () => {
                const end = new Date();
                end.setDate(end.getDate() - 1);
                end.setHours(23, 59, 59, 999);
                const start = clone(end);
                start.setHours(0, 0, 0, 0);
                return { start, end };
            },
        },
        {
            label: 'This week',
            getRange: () => {
                const now = new Date();
                const start = clone(now);
                const day = start.getDay() || 7;
                start.setDate(start.getDate() - day + 1);
                start.setHours(0, 0, 0, 0);
                return { start, end: now };
            },
        },
        {
            label: 'Week to date',
            getRange: () => {
                const now = new Date();
                const start = clone(now);
                start.setDate(start.getDate() - start.getDay() + 1);
                start.setHours(0, 0, 0, 0);
                return { start, end: now };
            },
        },
        {
            label: 'This month',
            getRange: () => {
                const now = new Date();
                const start = clone(now);
                start.setDate(1);
                start.setHours(0, 0, 0, 0);
                return { start, end: now };
            },
        },
        {
            label: 'Month to date',
            getRange: () => {
                const now = new Date();
                const start = new Date(now.getFullYear(), now.getMonth(), 1);
                return { start, end: now };
            },
        },
        {
            label: 'This year',
            getRange: () => {
                const now = new Date();
                const start = new Date(now.getFullYear(), 0, 1);
                return { start, end: now };
            },
        },
        {
            label: 'Year to date',
            getRange: () => {
                const now = new Date();
                const start = new Date(now.getFullYear(), 0, 1);
                return { start, end: now };
            },
        },
    ];

    return (
        <div className={styles.commonlyUsed}>
            <h4>Commonly used</h4>
            <table className={styles.presetsTable}>
                <tbody>
                {Array.from({ length: Math.ceil(presets.length / 2) }).map((_, row) => {
                    const first = presets[row * 2];
                    const second = presets[row * 2 + 1];

                    return (
                        <tr key={row}>
                            <td>
                                {first && (
                                    <button onClick={() => onSelect(first)}>{first.label}</button>
                                )}
                            </td>
                            <td>
                                {second && (
                                    <button onClick={() => onSelect(second)}>{second.label}</button>
                                )}
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
};
