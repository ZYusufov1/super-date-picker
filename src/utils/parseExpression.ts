export function parseExpression(input: string): Date | null {
    const now = new Date();

    if (input === 'now') return now;

    const match = input.match(/^now([+-])(\d+)([smhd])$/);
    if (match) {
        const [, sign, amountStr, unit] = match;
        const amount = parseInt(amountStr, 10);
        const msMap = {
            s: 1000,
            m: 60 * 1000,
            h: 60 * 60 * 1000,
            d: 24 * 60 * 60 * 1000,
        };
        const delta = amount * msMap[unit as keyof typeof msMap];
        return new Date(sign === '+' ? now.getTime() + delta : now.getTime() - delta);
    }

    const parsed = new Date(input);
    return isNaN(parsed.getTime()) ? null : parsed;
}
