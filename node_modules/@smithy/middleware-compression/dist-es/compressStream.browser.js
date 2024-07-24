import { AsyncGzip } from "fflate";
export const compressStream = async (body) => {
    let endCallback;
    const asyncGzip = new AsyncGzip();
    const compressionStream = new TransformStream({
        start(controller) {
            asyncGzip.ondata = (err, data, final) => {
                if (err) {
                    controller.error(err);
                }
                else {
                    controller.enqueue(data);
                    if (final) {
                        if (endCallback)
                            endCallback();
                        else
                            controller.terminate();
                    }
                }
            };
        },
        transform(chunk) {
            asyncGzip.push(chunk);
        },
        flush() {
            return new Promise((resolve) => {
                endCallback = resolve;
                asyncGzip.push(new Uint8Array(0), true);
            });
        },
    });
    return body.pipeThrough(compressionStream);
};
