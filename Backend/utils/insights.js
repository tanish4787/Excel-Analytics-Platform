export const generateInsights = (data) => {
    if (!Array.isArray(data) || data.length === 0) return {};

    const keys = Object.keys(data[0]);
    const totalRows = data.length;
    const columnStats = {};

    for (const key of keys) {
        const values = data.map(row => row[key]);
        const numericValues = values.filter(v => typeof v === 'number' && !isNaN(v));
        const nullCount = values.filter(v => v === null || v === '' || v === undefined).length;

        columnStats[key] = {
            type: typeof values.find(v => v != null),
            nullCount,
            uniqueValues: new Set(values).size,
        };

        if (numericValues.length > 0) {
            const sorted = [...numericValues].sort((a, b) => a - b);
            const sum = numericValues.reduce((a, b) => a + b, 0);
            columnStats[key].min = sorted[0];
            columnStats[key].max = sorted[sorted.length - 1];
            columnStats[key].mean = +(sum / numericValues.length).toFixed(2);
            columnStats[key].median = sorted[Math.floor(sorted.length / 2)];
        }
    }

    return {
        totalRows,
        totalColumns: keys.length,
        columns: columnStats,
    };
};
