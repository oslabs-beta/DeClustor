// LineChart.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LineChart from './LineChart';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { useTheme } from '@mui/material';
import { connectWebSocketToLineChart } from '../webService/connectWebSocketToLineChart';

// Mock the useTheme hook
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  useTheme: jest.fn(),
}));

// Mock the WebSocket connection
jest.mock('../webService/connectWebSocketToLineChart');

const mockStore = configureStore([]);

describe('LineChart Component', () => {
  let store;
  let theme;

  beforeEach(() => {
    store = mockStore({
      user: { userId: 'testUser', serviceName: 'testService' },
    });

    theme = {
      palette: {
        text: { primary: '#000' },
        secondary: { 400: '#ccc' },
      },
    };

    useTheme.mockReturnValue(theme);
    connectWebSocketToLineChart.mockImplementation(
      (userId, serviceName, metricNames, onData, onError, onClose) => {
        // Simulate WebSocket connection and data reception
        setTimeout(() => {
          onData([
            {
              Timestamp: '2024-01-01T00:00:00.000Z',
              Average: 5,
              Minimum: 1,
              Maximum: 10,
            },
          ]);
        }, 100);
        return { close: jest.fn() };
      }
    );
  });

  test('renders LineChart component with data', async () => {
    render(
      <Provider store={store}>
        <LineChart metricNames={['metric1', 'metric2']} />
      </Provider>
    );

    // Check if loading text is rendered initially
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Wait for the data to be loaded
    const dataElement = await screen.findByText('Instructions Page');
    expect(dataElement).toBeInTheDocument();
  });

  test('displays error message on WebSocket error', async () => {
    connectWebSocketToLineChart.mockImplementationOnce(
      (userId, serviceName, metricNames, onData, onError, onClose) => {
        setTimeout(() => {
          onError(new Error('WebSocket error'));
        }, 100);
        return { close: jest.fn() };
      }
    );

    render(
      <Provider store={store}>
        <LineChart metricNames={['metric1', 'metric2']} />
      </Provider>
    );

    // Check if loading text is rendered initially
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Wait for the error message to be displayed
    const errorElement = await screen.findByText('Error: WebSocket error');
    expect(errorElement).toBeInTheDocument();
  });
});
