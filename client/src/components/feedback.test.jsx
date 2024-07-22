import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Feedback from './Feedback';

describe('Feedback component', () => {
  test('renders the feedback button', () => {
    render(<Feedback />);
    const feedbackButton = screen.getByRole('button', {
      name: /Give Feedback/i,
    });
    expect(feedbackButton).toBeInTheDocument();
  });

  test('opens the drawer when the feedback button is clicked', () => {
    render(<Feedback />);

    // Click the feedback button to open the drawer
    const feedbackButton = screen.getByRole('button', {
      name: /Give Feedback/i,
    });
    fireEvent.click(feedbackButton);

    // Check if the drawer is open by looking for an element inside the drawer
    const drawerTitle = screen.getByText(/Feedback/i);
    expect(drawerTitle).toBeInTheDocument();
  });

  test('closes the drawer when the close button is clicked', () => {
    render(<Feedback />);

    // Open the drawer first
    const feedbackButton = screen.getByRole('button', {
      name: /Give Feedback/i,
    });
    fireEvent.click(feedbackButton);

    // Click the close button inside the drawer
    const closeButton = screen.getByTestId('CloseIcon'); // Use data-testid instead
    fireEvent.click(closeButton);

    // Check if the drawer is closed by confirming the absence of the drawer title
    expect(screen.queryByText(/Feedback/i)).not.toBeInTheDocument();
  });

  test('submits the form and closes the drawer', () => {
    render(<Feedback />);

    // Open the drawer
    const feedbackButton = screen.getByRole('button', {
      name: /Give Feedback/i,
    });
    fireEvent.click(feedbackButton);

    // Fill out and submit the form
    const textField = screen.getByLabelText(/Your Feedback/i);
    fireEvent.change(textField, { target: { value: 'This is my feedback.' } });
    const submitButton = screen.getByRole('button', { name: /Submit/i });
    fireEvent.click(submitButton);

    // Check if the drawer is closed after form submission
    expect(screen.queryByText(/Feedback/i)).not.toBeInTheDocument();
  });
});
