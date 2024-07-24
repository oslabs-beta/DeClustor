import React from 'react';
import { render } from '@testing-library/react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Footer from './Footer';

test('renders Footer component with correct styles and content', () => {
  const theme = createTheme({
    palette: {
      primary: {
        main: '#3f51b5', // Ensure the correct format for primary color
      },
      secondary: {
        main: '#f50057', // Ensure the correct format for secondary color
      },
    },
  });

  const { asFragment, getByText } = render(
    <ThemeProvider theme={theme}>
      <Footer />
    </ThemeProvider>
  );

  // Check if the Footer contains the correct text
  expect(getByText(/DeClustor ©/)).toBeInTheDocument();

  // Use snapshot testing to check rendered output
  expect(asFragment()).toMatchSnapshot();
});
