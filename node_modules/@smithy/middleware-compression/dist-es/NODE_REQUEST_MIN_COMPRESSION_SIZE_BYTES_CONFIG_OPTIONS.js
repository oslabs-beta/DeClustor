import { numberSelector, SelectorType } from "@smithy/util-config-provider";
export const NODE_REQUEST_MIN_COMPRESSION_SIZE_BYTES_ENV_NAME = "AWS_REQUEST_MIN_COMPRESSION_SIZE_BYTES";
export const NODE_REQUEST_MIN_COMPRESSION_SIZE_BYTES_INI_NAME = "request_min_compression_size_bytes";
export const DEFAULT_NODE_REQUEST_MIN_COMPRESSION_SIZE_BYTES = 10240;
export const NODE_REQUEST_MIN_COMPRESSION_SIZE_BYTES_CONFIG_OPTIONS = {
    environmentVariableSelector: (env) => numberSelector(env, NODE_REQUEST_MIN_COMPRESSION_SIZE_BYTES_ENV_NAME, SelectorType.ENV),
    configFileSelector: (profile) => numberSelector(profile, NODE_REQUEST_MIN_COMPRESSION_SIZE_BYTES_INI_NAME, SelectorType.CONFIG),
    default: DEFAULT_NODE_REQUEST_MIN_COMPRESSION_SIZE_BYTES,
};
