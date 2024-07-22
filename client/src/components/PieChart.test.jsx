// PieChart.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PieChart from './PieChart';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { useTheme } from '@mui/material';
import { connectWebSocketToPieChart } from '../webService/connectWebSocketToPieChart';

// Mock the useTheme hook
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  useTheme: jest.fn(),
}));

// Mock the connectWebSocketToPieChart function
jest.mock('../webService/connectWebSocketToPieChart', () => ({
  connectWebSocketToPieChart: jest.fn(),
}));

const mockStore = configureStore([]);

describe('PieChart Component', () => {
  let store;
  let theme;

  beforeEach(() => {
    store = mockStore({
      user: { userId: 'testUser', serviceName: 'testService' },
    });

    theme = {
      palette: {
        text: {
          primary: '#000',
          secondary: '#666',
        },
        secondary: {
          400: '#ccc',
        },
      },
    };

    useTheme.mockReturnValue(theme);
    connectWebSocketToPieChart.mockImplementation(
      (userId, serviceName, onData, onError, onClose) => {
        const ws = {
          close: jest.fn(),
        };
        // Simulate receiving data
        setTimeout(() => {
          onData({
            totalTasks: 10,
            runningTasks: 5,
            pendingTasks: 3,
            stoppedTasks: 2,
          });
        }, 100);
        return ws;
      }
    );
  });

  test('renders loading state initially', () => {
    render(
      <Provider store={store}>
        <PieChart />
      </Provider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders pie chart data correctly after loading', async () => {
    render(
      <Provider store={store}>
        <PieChart />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      expect(screen.getByText('Total Tasks')).toBeInTheDocument();
      expect(screen.getByText('Running Tasks')).toBeInTheDocument();
      expect(screen.getByText('Pending Tasks')).toBeInTheDocument();
      expect(screen.getByText('Stopped Tasks')).toBeInTheDocument();
    });
  });

  test('renders error state when there is an error', async () => {
    connectWebSocketToPieChart.mockImplementationOnce(
      (userId, serviceName, onData, onError, onClose) => {
        const ws = {
          close: jest.fn(),
        };
        // Simulate an error
        setTimeout(() => {
          onError(new Error('Test error'));
        }, 100);
        return ws;
      }
    );

    render(
      <Provider store={store}>
        <PieChart />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Error: Test error')).toBeInTheDocument();
    });
  });

  test('closes WebSocket on component unmount', async () => {
    const { unmount } = render(
      <Provider store={store}>
        <PieChart />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    const ws = connectWebSocketToPieChart.mock.results[0].value;
    unmount();
    expect(ws.close).toHaveBeenCalled();
  });
});
