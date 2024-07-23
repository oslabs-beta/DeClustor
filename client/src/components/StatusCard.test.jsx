import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { ThemeProvider } from '@emotion/react';
import StatusCard from './StatusCard';

const mockStore = configureStore([]);

// Mock theme
const theme = {
  palette: {
    neutral: {
      300: '#f5f5f5',
      700: '#555555',
    },
    secondary: {
      700: '#ff4081',
    },
    primary: {
      300: '#64b5f6',
    },
    mode: 'light', // Added this to avoid undefined palette.mode
  },
};

describe('StatusCard Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      user: {
        userId: '123',
        serviceName: 'service2',
      },
    });
  });

  it('renders correctly and matches the snapshot', () => {
    const { container } = render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <StatusCard />
        </ThemeProvider>
      </Provider>
    );
    expect(container).toMatchSnapshot();
  });

  it('displays the correct task status based on userId and serviceName', () => {
    const { getByText } = render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <StatusCard />
        </ThemeProvider>
      </Provider>
    );
    expect(getByText('Task Status : RUNNING')).toBeInTheDocument();
  });

  it('displays the correct image and alt text', () => {
    const { getByAltText } = render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <StatusCard />
        </ThemeProvider>
      </Provider>
    );
    const imgElement = getByAltText('docker container');
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute(
      'src',
      'https://cdn.dribbble.com/users/1008970/screenshots/6140230/blog_post_docker.gif'
    );
  });

  it('renders the Refresh button with correct styles', () => {
    const { getByText } = render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <StatusCard />
        </ThemeProvider>
      </Provider>
    );
    const buttonElement = getByText('Refresh');
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveStyle('color: #555555');
    expect(buttonElement).toHaveStyle('background-color: #64b5f6'); // Note: Changed `backgroundColor` to `background-color`
  });
});
