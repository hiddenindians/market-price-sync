"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOptions = exports.FetchProductsAndPricesService = void 0;
// This is a skeleton for a custom service class. Remove or add the methods you need here
class FetchProductsAndPricesService {
    constructor(options) {
        this.options = options;
    }
    async find(_params) {
        return [];
    }
    async get(id, _params) {
        return {
            id: 0,
            text: `A new message with ID: ${id}!`
        };
    }
    async create(data, params) {
        if (Array.isArray(data)) {
            return Promise.all(data.map((current) => this.create(current, params)));
        }
        return {
            id: 0,
            ...data
        };
    }
    // This method has to be added to the 'methods' option to make it available to clients
    async update(id, data, _params) {
        return {
            id: 0,
            ...data
        };
    }
    async patch(id, data, _params) {
        return {
            id: 0,
            text: `Fallback for ${id}`,
            ...data
        };
    }
    async remove(id, _params) {
        return {
            id: 0,
            text: 'removed'
        };
    }
}
exports.FetchProductsAndPricesService = FetchProductsAndPricesService;
const getOptions = (app) => {
    return { app };
};
exports.getOptions = getOptions;
//# sourceMappingURL=fetch-products-and-prices.class.js.map