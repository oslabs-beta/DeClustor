// FlexBetween.test.js
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import FlexBetween from './FlexBetween';

test('renders FlexBetween component with correct styles', () => {
  const { container } = render(<FlexBetween />);

  const flexBetweenElement = container.firstChild;

  // Check if the element is a div (Box from MUI renders as a div by default)
  expect(flexBetweenElement.tagName).toBe('DIV');

  // Check if the styles are applied correctly
  expect(flexBetweenElement).toHaveStyle('display: flex');
  expect(flexBetweenElement).toHaveStyle('justify-content: space-between');
  expect(flexBetweenElement).toHaveStyle('align-items: center');
});
