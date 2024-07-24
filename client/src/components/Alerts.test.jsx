// src/components/Alerts.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Alerts from './Alerts'; // Adjust the path to your Alerts component
import { BrowserRouter as Router } from 'react-router-dom';

const mockStore = configureStore([]);

describe('Alerts Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      notifications: {
        notificationCount: 5, // Set this to a positive number to test the "You have notifications!" message
      },
    });
  });

  // test('renders "You have notifications!" when notificationCount is greater than 0', () => {
  //   render(
  //     <Provider store={store}>
  //       <Router>
  //         <Alerts />
  //       </Router>
  //     </Provider>
  //   );

  //   // Check if the alert with the text "You have notifications!" is present
  //   expect(screen.getByText('You have notifications!')).toBeInTheDocument();
  // });

  test('renders "You have no notifications" when notificationCount is 0', () => {
    store = mockStore({
      notifications: {
        notificationCount: 0, // Set this to 0 to test the "You have no notifications" message
      },
    });

    render(
      <Provider store={store}>
        <Router>
          <Alerts />
        </Router>
      </Provider>
    );

    // Check if the alert with the text "You have no notifications" is present
    expect(screen.getByText('You have no notifications')).toBeInTheDocument();
  });

  // test('clicking the alert link dispatches the correct action', () => {
  //   render(
  //     <Provider store={store}>
  //       <Router>
  //         <Alerts />
  //       </Router>
  //     </Provider>
  //   );

  //   const alertLink = screen.getByText('You have notifications!');
  //   fireEvent.click(alertLink);

  //   const actions = store.getActions();
  //   expect(actions).toContainEqual({ type: 'HIDE_ALERT' });
  // });
});
