export const isWithinDateRange = (date: Date, range: string) => {
    const now = new Date();

    switch (range) {
        case "today": {
            const start = new Date();
            start.setHours(0, 0, 0, 0);
            return date >= start;
        }

        case "last7": {
            const start = new Date();
            start.setDate(now.getDate() - 7);
            return date >= start;
        }

        case "last30": {
            const start = new Date();
            start.setDate(now.getDate() - 30);
            return date >= start;
        }

        case "thisMonth": {
            const start = new Date(now.getFullYear(), now.getMonth(), 1);
            return date >= start;
        }

        case "lastMonth": {
            const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const end = new Date(now.getFullYear(), now.getMonth(), 0);
            return date >= start && date <= end;
        }

        default:
            return true;
    }
};
