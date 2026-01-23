"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyProductFilters = void 0;
const coerceArray = (value) => {
    if (Array.isArray(value)) {
        return value.map((item) => item?.toString() ?? '').filter(Boolean);
    }
    if (value === undefined || value === null || value === '') {
        return [];
    }
    return [value.toString()];
};
const toBoolean = (value) => {
    if (typeof value === 'string') {
        return value.toLowerCase() === 'true';
    }
    return Boolean(value);
};
const toNumber = (value) => {
    if (value === undefined || value === null || value === '') {
        return null;
    }
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : null;
};
const applyProductFilters = async (context) => {
    const { query } = context.params;
    if (!query) {
        return context;
    }
    const { rarities, prints, finishes, events, excludeEvents, onlyEvents, excludePromo, onlyPromo, minPrice, maxPrice } = query;
    if (rarities !== undefined) {
        const values = coerceArray(rarities);
        if (values.length > 0) {
            query.rarity = { $in: values };
        }
        delete query.rarities;
    }
    if (prints !== undefined) {
        const values = coerceArray(prints);
        if (values.length > 0) {
            query.print = { $in: values };
        }
        delete query.prints;
    }
    if (finishes !== undefined) {
        const values = coerceArray(finishes);
        if (values.length > 0) {
            query.finish = { $in: values };
        }
        delete query.finishes;
    }
    const andConditions = [];
    const excludeEventCards = excludeEvents !== undefined ? toBoolean(excludeEvents) : false;
    const requireEventCards = onlyEvents !== undefined ? toBoolean(onlyEvents) : false;
    const excludePromoCards = excludePromo !== undefined ? toBoolean(excludePromo) : false;
    const requirePromoCards = onlyPromo !== undefined ? toBoolean(onlyPromo) : false;
    if (excludeEventCards) {
        andConditions.push({
            $or: [{ event_types: { $exists: false } }, { event_types: { $size: 0 } }]
        });
    }
    else if (events !== undefined) {
        const values = coerceArray(events);
        if (values.length > 0) {
            query.event_types = { $in: values };
        }
    }
    if (requireEventCards && !excludeEventCards) {
        andConditions.push({ event_types: { $exists: true, $not: { $size: 0 } } });
    }
    if (excludePromoCards) {
        andConditions.push({ event_types: { $not: { $elemMatch: { $eq: 'promo' } } } });
    }
    else if (requirePromoCards && !excludeEventCards) {
        andConditions.push({ event_types: { $elemMatch: { $eq: 'promo' } } });
    }
    delete query.events;
    delete query.excludeEvents;
    delete query.onlyEvents;
    delete query.excludePromo;
    delete query.onlyPromo;
    delete query.finishes;
    const minPriceValue = toNumber(minPrice);
    const maxPriceValue = toNumber(maxPrice);
    if (minPriceValue !== null || maxPriceValue !== null) {
        let lowerBound = minPriceValue;
        let upperBound = maxPriceValue;
        if (lowerBound !== null && upperBound !== null && lowerBound > upperBound) {
            ;
            [lowerBound, upperBound] = [upperBound, lowerBound];
        }
        const priceCondition = {};
        if (lowerBound !== null) {
            priceCondition.$gte = lowerBound;
        }
        else if (upperBound !== null) {
            priceCondition.$gte = 0;
        }
        if (upperBound !== null) {
            priceCondition.$lte = upperBound;
        }
        if (Object.keys(priceCondition).length > 0) {
            if (query.market_price &&
                typeof query.market_price === 'object' &&
                !Array.isArray(query.market_price)) {
                query.market_price = { ...query.market_price, ...priceCondition };
            }
            else {
                query.market_price = priceCondition;
            }
        }
    }
    delete query.minPrice;
    delete query.maxPrice;
    if (andConditions.length > 0) {
        if (Array.isArray(query.$and)) {
            query.$and = [...query.$and, ...andConditions];
        }
        else if (query.$and) {
            query.$and = [query.$and, ...andConditions];
        }
        else {
            query.$and = andConditions;
        }
    }
    return context;
};
exports.applyProductFilters = applyProductFilters;
//# sourceMappingURL=apply-product-filters.js.map