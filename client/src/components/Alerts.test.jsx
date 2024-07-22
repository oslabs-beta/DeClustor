import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Alerts from './Alerts'; // Adjust the import path based on your file structure

describe('Alerts component', () => {
  test('renders nothing when open is false', () => {
    render(<Alerts open={false} />, { wrapper: MemoryRouter });
    const alertElement = screen.queryByText(/You have notifications!/i);
    expect(alertElement).toBeNull();
  });

  test('renders the alert when open is true', () => {
    render(<Alerts open={true} />, { wrapper: MemoryRouter });
    const alertElement = screen.getByText(/You have notifications!/i);
    expect(alertElement).toBeInTheDocument();
    expect(alertElement.closest('a')).toHaveAttribute('href', '/logs');
  });
});
