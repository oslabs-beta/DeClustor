// style component to reuse styles css
const { styled } = require('@mui/system');
const { Box } = require('@mui/material');

const FlexBetween = styled(Box)({
// insert Box from mui material ui
// css property
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
});

export default FlexBetween;