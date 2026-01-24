"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnOnlyId = void 0;
const returnOnlyId = async (context) => {
    console.log(`Running hook returnOnlyId on ${context.path}.${context.method}`);
    if (Array.isArray(context.result)) {
        context.result = context.result.map((item) => ({ _id: item._id }));
    }
    else {
        context.result = { _id: context.result._id };
    }
    return context;
};
exports.returnOnlyId = returnOnlyId;
//# sourceMappingURL=return-only-id.js.map