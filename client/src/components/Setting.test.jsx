// src/components/Setting.test.jsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk'; // for async actions
import Setting from './Setting';
import '@testing-library/jest-dom';

// Create a mock store with thunk middleware
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const initialState = {
  user: {
    userId: 'testUserId',
  },
  notification: {
    clusters: 'allClusters',
    services: 'allServices',
    notifications: [],
    clusterOptions: [],
    serviceOptions: [],
  },
};

describe('Setting Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore(initialState);

    // Mock fetch API
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(['Service1', 'Service2']),
      })
    );
  });

  test('renders Setting component and opens dialog', () => {
    render(
      <Provider store={store}>
        <Setting />
      </Provider>
    );

    // Check if the IconButton is rendered
    expect(screen.getByRole('button')).toBeInTheDocument();

    // Open the dialog
    fireEvent.click(screen.getByRole('button'));

    // Check if the Dialog is visible
    expect(screen.getByText('Notification Settings')).toBeInTheDocument();
  });

  test('fetches service names and updates Redux state', async () => {
    render(
      <Provider store={store}>
        <Setting />
      </Provider>
    );

    // Open the dialog
    fireEvent.click(screen.getByRole('button'));

    // Wait for the service names to be rendered in the dropdown
    await waitFor(() => {
      expect(screen.getByText('Service1')).toBeInTheDocument();
      expect(screen.getByText('Service2')).toBeInTheDocument();
    });
  });

  test('handles save button click', async () => {
    render(
      <Provider store={store}>
        <Setting />
      </Provider>
    );

    // Open the dialog
    fireEvent.click(screen.getByRole('button'));

    // Click save button
    fireEvent.click(screen.getByText('Save'));

    // Wait for Snackbar alert
    await waitFor(() => {
      expect(
        screen.getByText('Notification settings have been set successfully!')
      ).toBeInTheDocument();
    });
  });

  // Optionally test other interactions and edge cases
});
