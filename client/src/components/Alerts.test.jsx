// src/components/Alerts.test.jsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Alerts from './Alerts'; // Adjust import based on your file structure

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

console.log(mockStore);

describe('Alerts Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      notifications: {
        // initial state for your notifications
        notificationCount: 5,
      },
    });

    // Mock necessary actions if needed
    store.dispatch = jest.fn();
  });

  test('renders the alert when open is true', () => {
    render(
      <Provider store={store}>
        <Alerts notificationCount={5} onAlertClick={() => {}} />
      </Provider>
    );

    // Assuming that Alerts renders something based on notificationCount
    // Check if the alert is rendered based on props
    expect(screen.getByText('5 Notifications')).toBeInTheDocument();
  });

  // Add more tests as needed
});
