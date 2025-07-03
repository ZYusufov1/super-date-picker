import type {Locale} from "date-fns";

export interface DateRange {
    start: Date | null;
    end: Date | null;
}

export interface PresetRange {
    label: string;
    getRange: () => DateRange;
}

export interface SuperDatePickerProps {
    value: DateRange;
    onChange: (range: { start: Date; end: Date }) => void;

    refreshInterval?: number;
    onRefresh?: () => void;

    minDate?: Date;
    maxDate?: Date;
    locale?: Locale;
    compressed?: boolean;                  // компактный вид
    isQuickSelectOnly?: boolean;           // скрыть поля дат

    /** "full" | "iconOnly" | "off" (default "full") */
    showUpdateButton?: 'full' | 'iconOnly' | 'off';
    customQuickSelectPanels?: React.ReactNode[];
}
