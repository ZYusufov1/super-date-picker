import React, {useState} from 'react';
import {DayPicker} from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import styles from './SuperDatePicker.module.css';
import {formatDate} from "../../utils/dateHelpers.ts";
import type {Locale} from "date-fns";

interface DatePopoverProps {
    value: Date,
    onChange: (newDate: Date) => void,
    onClose: () => void,
    dateType: "start" | "end",
    minDate?: Date,
    maxDate?: Date,
    locale?: Locale,
}

const UNITS = ['seconds', 'minutes', 'hours', 'days', 'weeks', 'months', 'years'] as const;
type Unit = typeof UNITS[number];

export const DatePopover: React.FC<DatePopoverProps> = ({
    value,
    onChange,
    onClose,
    dateType,
    locale,
    minDate,
    maxDate
}) => {
    const [tab, setTab] = useState<'absolute' | 'relative' | 'now'>('absolute');

    // Absolute
    const [selectedDate, setSelectedDate] = useState<Date>(value);
    const [hour, setHour] = useState(value.getHours());
    const [minute, setMinute] = useState(value.getMinutes());

    //Relative
    const [relativeAmount, setRelativeAmount] = useState(5);
    const [relativeUnit, setRelativeUnit] = useState<Unit>('minutes');
    const [relativeDirection, setRelativeDirection] = useState<'past' | 'future'>('past');
    const [roundToDay, setRoundToDay] = useState(false);

    const calcRelativeDate = (): Date => {
        const base = new Date();
        const msMap: Record<Unit, number> = {
            seconds: 1000,
            minutes: 60 * 1000,
            hours: 60 * 60 * 1000,
            days: 24 * 60 * 60 * 1000,
            weeks: 7 * 24 * 60 * 60 * 1000,
            months: 30 * 24 * 60 * 60 * 1000,
            years: 365 * 24 * 60 * 60 * 1000,
        };

        const delta = relativeAmount * msMap[relativeUnit];
        const time = relativeDirection === 'past'
            ? base.getTime() - delta
            : base.getTime() + delta;

        const result = new Date(time);

        if (roundToDay) {
            result.setHours(0, 0, 0, 0);
        }

        return result;
    };

    const applyAbsolute = () => {
        const updated = new Date(selectedDate);
        updated.setHours(hour);
        updated.setMinutes(minute);
        updated.setSeconds(0);
        updated.setMilliseconds(0);
        onChange(updated);
        onClose();
    };

    const setNow = () => {
        const now = new Date();
        onChange(now);
        onClose();
    };

    return (
        <div className={
              `${dateType === "start" ? styles.dateStartPopover : styles.dateEndPopover} ${styles.popover}`
        }>
            {/* Tabs */}
            <div className={styles.tabs}>
                {['absolute', 'relative', 'now'].map((t) => (
                    <button
                        key={t}
                        className={tab === t ? styles.activeTab : ''}
                        onClick={() => setTab(t as any)}
                    >
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                ))}
            </div>

            {/* Absolute */}
            {tab === 'absolute' && (
                <>
                    <DayPicker
                        mode="single"
                        locale={locale}
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                        defaultMonth={selectedDate}
                        startMonth={minDate}
                        endMonth={maxDate}
                    />

                    <div className={styles.timeRow}>
                        <div className={styles.selectors}>
                            <select value={hour} onChange={(e) => setHour(Number(e.target.value))}>
                                {Array.from({length: 24}, (_, i) => (
                                    <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                                ))}
                            </select>
                            :
                            <select value={minute} onChange={(e) => setMinute(Number(e.target.value))}>
                                {Array.from({length: 60}, (_, i) => (
                                    <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                                ))}
                            </select>
                        </div>

                        <button className={styles.applyBtn} onClick={applyAbsolute}>Apply</button>
                    </div>
                </>
            )}

            {/* Now */}
            {tab === 'now' && (
                <div className={styles.nowBlock}>
                    <p>
                        Setting the time to <b>"now"</b> means that on every refresh this time will be set to the time
                        of the refresh.
                    </p>
                    <button className={styles.applyBtn} onClick={setNow}>Set start date and time to now</button>
                </div>
            )}

            {/* Relative */}
            {tab === 'relative' && (
                <>
                    <div className={styles.relativeRow}>
                        <input
                            type="number"
                            min={1}
                            value={relativeAmount}
                            onChange={(e) => setRelativeAmount(Number(e.target.value))}
                        />

                        <select
                            value={relativeUnit}
                            onChange={(e) => setRelativeUnit(e.target.value as Unit)}
                        >
                            {UNITS.map((u) => (
                                <option key={u}>{u}</option>
                            ))}
                        </select>

                        <select
                            value={relativeDirection}
                            onChange={(e) => setRelativeDirection(e.target.value as 'past' | 'future')}
                        >
                            <option value="past">ago</option>
                            <option value="future">from now</option>
                        </select>
                    </div>

                    <div className={styles.previewRow}>
                        Start date: {formatDate(calcRelativeDate())}
                    </div>

                    <label className={styles.roundRow}>
                        <div className={styles.toggle}>
                            <input
                                type="checkbox"
                                checked={roundToDay}
                                onChange={() => setRoundToDay(!roundToDay)}
                            />
                            Round to the day
                        </div>


                        <button className={styles.applyBtn} onClick={() => {
                            const newDate = calcRelativeDate();
                            onChange(newDate);
                            onClose();
                        }}>
                            Apply
                        </button>
                    </label>

                </>
            )}
        </div>
    );
};
