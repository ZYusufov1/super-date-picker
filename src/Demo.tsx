import {useEffect, useState} from 'react';
import { SuperDatePicker } from './components/SuperDatePicker/SuperDatePicker';
import type { DateRange } from './types';
import {ExpressionInput} from "./components/ExpressionInput/ExpressionInput.tsx";
import {BlockExpressionInput} from "./components/ExpressionInput/BlockExpressionInput.tsx";

const now = new Date();

export const Demo = () => {
    const [range, setRange] = useState<DateRange>({
        start: new Date(now.getTime() - 60 * 60 * 1000),
        end: now,
    });

    const handleRefresh = () => {
        console.log('Refreshed at', new Date().toLocaleTimeString());
    };

    useEffect(() => {
        console.log(range);
    },[range])

    return (
        <div style={{ padding: 32 }}>
            <BlockExpressionInput value={range} onChange={setRange}/>

            <SuperDatePicker
                value={range}
                onChange={setRange}
                refreshInterval={10000}
                onRefresh={handleRefresh}
            />
        </div>
    );
};
