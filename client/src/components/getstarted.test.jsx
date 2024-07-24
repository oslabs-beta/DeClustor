// GetStarted.test.js
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import GetStarted from './GetStarted';

test('renders GetStarted component with correct text', () => {
  const { getByText } = render(<GetStarted />);

  // Check if the text "Instructions Page" is rendered
  const textElement = getByText('Instructions Page');
  expect(textElement).toBeInTheDocument();
});
