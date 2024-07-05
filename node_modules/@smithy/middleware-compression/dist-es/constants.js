export var CompressionAlgorithm;
(function (CompressionAlgorithm) {
    CompressionAlgorithm["GZIP"] = "gzip";
})(CompressionAlgorithm || (CompressionAlgorithm = {}));
export const CLIENT_SUPPORTED_ALGORITHMS = [CompressionAlgorithm.GZIP];
