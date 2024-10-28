
export function isNullOrEmpty(obj: any) {
    return obj === null || obj === undefined || (typeof obj === 'string' && obj.trim() === '');
}

