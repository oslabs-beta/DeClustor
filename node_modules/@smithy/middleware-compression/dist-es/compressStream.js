import { createGzip } from "zlib";
export const compressStream = async (body) => body.pipe(createGzip());
