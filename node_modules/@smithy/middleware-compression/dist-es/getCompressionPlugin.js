import { compressionMiddleware, compressionMiddlewareOptions, } from "./compressionMiddleware";
export const getCompressionPlugin = (config, middlewareConfig) => ({
    applyToStack: (clientStack) => {
        clientStack.add(compressionMiddleware(config, middlewareConfig), compressionMiddlewareOptions);
    },
});
