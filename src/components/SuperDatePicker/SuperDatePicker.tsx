import React, { useState, useEffect, useRef } from 'react';
import { FaRegCalendarAlt, FaCheck } from 'react-icons/fa';

import type { SuperDatePickerProps } from '../../types';
import styles from './SuperDatePicker.module.css';

import { formatDate } from '../../utils/dateHelpers';
import { RelativeSelector } from './RelativeSelector';
import { DatePopover } from './DatePopover';
import { useClickOutside } from '../../hooks/useClickOutside';
import {toExpression} from "../../utils/toExpression.ts";

export const SuperDatePicker: React.FC<SuperDatePickerProps> = ({
    value,
    onChange,
    refreshInterval = 0,
    onRefresh,
    minDate,
    maxDate,
    locale,
    compressed = false,
    isQuickSelectOnly = false,
    showUpdateButton = 'iconOnly',
    customQuickSelectPanels = [],
}) => {
    const [tempStart, setTempStart] = useState<Date | null>(value.start);
    const [tempEnd,   setTempEnd]   = useState<Date | null>(value.end);
    const [intervalMs, setIntervalMs] = useState<number>(refreshInterval);
    const [recentlyUsed, setRecentlyUsed] = useState<Array<{ start: Date; end: Date }>>([]);


    const [showRelative,     setShowRelative]     = useState(false);
    const [showTime,         setShowTime]         = useState(false);
    const [label,            setLabel]            = useState('Last 15 minutes');
    const [showStartPopover, setShowStartPopover] = useState(false);
    const [showEndPopover,   setShowEndPopover]   = useState(false);
    const [dirty,            setDirty]            = useState(false);

    const [isPaused, setPaused] = useState(false);
    const [refreshSec, setRefreshSec] = useState(() =>
        Math.max(0, Math.floor(intervalMs / 1000))
    );
    const [expr, setExpr] = useState(() =>
        toExpression(value.start, value.end)
    );

    const isInvalidRange =
        tempStart && tempEnd && tempStart.getTime() > tempEnd.getTime();

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isPaused || refreshSec <= 0 || !onRefresh) return;
        const id = setInterval(() => onRefresh(), refreshSec * 1000);
        return () => clearInterval(id);
    }, [isPaused, refreshSec, onRefresh]);


    useClickOutside(ref, () => {
        setShowRelative(false);
        setShowStartPopover(false);
        setShowEndPopover(false);
    });

    const applyRange = () => {
        if (tempStart && tempEnd) {
            onChange({ start: tempStart, end: tempEnd });
            addRecentlyUsed(tempStart, tempEnd);
            setDirty(false);
        }
    };

    const addRecentlyUsed = (start: Date, end: Date) => {
        setRecentlyUsed(prev => {
            const uniq = prev.filter(
                r => r.start.getTime() !== start.getTime() || r.end.getTime() !== end.getTime()
            );
            uniq.unshift({ start: new Date(start), end: new Date(end) }); // клон, чтобы не мутировать
            return uniq.slice(0, 10);
        });
    };

    return (
        <div ref={ref} className={styles.container}>
            <div className={styles.buttonsRow}>
                {/* Кнопка быстрого выбора */}
                <button
                    onClick={() => {
                        setShowRelative(prev => !prev);
                        setShowStartPopover(false);
                        setShowEndPopover(false);
                    }}
                    className={styles.toggleButton}
                    style={{ background: '#ccc' }}
                    aria-label={"Quick select"}
                    title={"Quick select"}
                >
                    <FaRegCalendarAlt />
                </button>

                {!showTime && !isQuickSelectOnly ? (
                    <button
                        onClick={() => {
                            setShowRelative(false);
                            setShowStartPopover(true);
                            setShowTime(true);
                        }}
                        className={styles.toggleButton}
                        style={{ width: '270px' }}
                    >
                        {label}
                    </button>
                ) : (
                    !isQuickSelectOnly && (
                    <div className={styles.dateRangeRow}>
                        <button
                            onClick={() => {
                                setShowStartPopover(p => !p);
                                setShowRelative(false);
                                setShowEndPopover(false);
                            }}
                            className={styles.dateInputBtn}
                        >
                            {formatDate(tempStart)}
                        </button>

                        <span className={styles.arrow}> → </span>

                        <button
                            onClick={() => {
                                setShowEndPopover(p => !p);
                                setShowRelative(false);
                                setShowStartPopover(false);
                            }}
                            className={styles.dateInputBtn}
                        >
                            {formatDate(tempEnd)}
                        </button>
                    </div>
                ))}

                {/* Кнопка Update показывается, если есть несохранённые правки */}
                {dirty && showUpdateButton !== 'off' && (
                    <button
                        className={styles.applyBtn}
                        onClick={applyRange}
                        aria-label="Apply time range"
                        title="Apply time range"
                    >
                        {showUpdateButton === 'iconOnly' ? <FaCheck /> : 'Update'}
                    </button>
                )}
            </div>

            <div className={styles.refreshPanel}>
                <label>Refresh every&nbsp;</label>
                <input
                    type="number"
                    min={0}
                    value={refreshSec}
                    onChange={e => setRefreshSec(Number(e.target.value))}
                    className={styles.refreshInput}
                />
                <span>&nbsp;sec&nbsp;</span>

                <button
                    className={styles.refreshToggle}
                    onClick={() => setPaused(p => !p)}
                    aria-label={isPaused ? 'Resume auto-refresh' : 'Pause auto-refresh'}
                    title={isPaused ? 'Resume auto-refresh' : 'Pause auto-refresh'}
                >
                    {isPaused ? '▶' : '⏸'}
                </button>
            </div>

            {recentlyUsed.length > 0 && (
                <div className={styles.recentlyUsed}>
                    <h4>Recently used ranges</h4>
                    <ul>
                        {recentlyUsed.map((r, i) => (
                            <li key={i}>
                                <button
                                    onClick={() => {
                                        setTempStart(new Date(r.start));
                                        setTempEnd(new Date(r.end));
                                        setShowTime(true);
                                        setDirty(false);
                                        addRecentlyUsed(r.start, r.end);
                                        onChange({ start: r.start, end: r.end });
                                    }}
                                >
                                    {formatDate(r.start)} → {formatDate(r.end)}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {isInvalidRange && (
                <div className={styles.error}>Start date must be before End date</div>
            )}

            {/* поповеры */}
            {showRelative && (
                <RelativeSelector
                    onApply={(start, end, newLabel) => {
                        setTempStart(start);
                        setTempEnd(end);
                        setLabel(newLabel);
                        setDirty(true);
                    }}
                    setShowTime={setShowTime}
                    recentlyUsed={recentlyUsed}
                    onClose={() => setShowRelative(false)}
                />

            )}

            {/* панель быстрого доступа к шаблонам */}
            {customQuickSelectPanels.map((panel, i) => (
                <React.Fragment key={i}>{panel}</React.Fragment>
            ))}

            {showStartPopover && (
                <DatePopover
                    dateType="start"
                    value={tempStart!}
                    onChange={date => {
                        setTempStart(date);
                        setDirty(true);
                    }}
                    onClose={() => setShowStartPopover(false)}
                    minDate={minDate}
                    maxDate={maxDate}
                    locale={locale}
                />
            )}

            {showEndPopover && (
                <DatePopover
                    dateType="end"
                    value={tempEnd!}
                    onChange={date => {
                        setTempEnd(date);
                        setDirty(true);
                    }}
                    onClose={() => setShowEndPopover(false)}
                    minDate={minDate}
                    maxDate={maxDate}
                    locale={locale}
                />
            )}
        </div>
    );
};
