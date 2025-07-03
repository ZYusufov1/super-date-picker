export function toExpression(date: Date): string {
    console.log(date)
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (Math.abs(diff) < 1000) return 'now';

    const abs = Math.abs(diff);
    const suffix = diff > 0 ? '-' : '+';

    const units = [
        { label: 'd', ms: 86400000 },
        { label: 'h', ms: 3600000 },
        { label: 'm', ms: 60000 },
        { label: 's', ms: 1000 },
    ];

    for (const u of units) {
        const amount = Math.round(abs / u.ms);
        if (amount >= 1 && amount <= 90) {
            return `now${suffix}${amount}${u.label}`;
        }
    }

    return date.toISOString();
}
