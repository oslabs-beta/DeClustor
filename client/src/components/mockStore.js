import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store'; // Import the mock store
import { createStore } from 'redux';
import rootReducer from '../redux/rootReducer'; // Adjust the path

const mockStore = configureStore([]);

export const renderWithRouterAndRedux = (
  ui,
  { route = '/', initialState = {} } = {}
) => {
  window.history.pushState({}, 'Test page', route);

  const store = mockStore(initialState); // Create a mock store with initial state

  return render(
    <Provider store={store}>
      <Router>{ui}</Router>
    </Provider>
  );
};
