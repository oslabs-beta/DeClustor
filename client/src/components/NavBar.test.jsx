// Navbar.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navbar from './Navbar';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { useTheme } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import { setMode } from '../redux/globalSlice';

// Mock the useTheme hook
jest.mock('@emotion/react', () => ({
  ...jest.requireActual('@emotion/react'),
  useTheme: jest.fn(),
}));

// Mock the useNavigate function
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

// Mock the redux setMode action
jest.mock('../redux/globalSlice', () => ({
  setMode: jest.fn(),
}));

const mockStore = configureStore([]);

describe('Navbar Component', () => {
  let store;
  let theme;
  let navigate;

  beforeEach(() => {
    store = mockStore({
      user: { userId: 'testUser', serviceName: 'testService' },
    });

    theme = {
      palette: {
        mode: 'light',
        background: { alt: '#f0f0f0' },
        primary: { 400: '#000' },
        secondary: { 100: '#fff', 400: '#ccc' },
      },
    };

    useTheme.mockReturnValue(theme);
    navigate = jest.fn();
    useNavigate.mockReturnValue(navigate);
  });

  test('renders Navbar component with all buttons', () => {
    render(
      <Provider store={store}>
        <Navbar
          isSidebarOpen={false}
          setIsSidebarOpen={jest.fn()}
          showSidebar={true}
          showSearch={true}
          showNotification={true}
          showUser={true}
        />
      </Provider>
    );

    // Check if all buttons and elements are rendered
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /light mode/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /notifications/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /profile/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  test('toggles sidebar on menu button click', () => {
    const setIsSidebarOpen = jest.fn();

    render(
      <Provider store={store}>
        <Navbar
          isSidebarOpen={false}
          setIsSidebarOpen={setIsSidebarOpen}
          showSidebar={true}
          showSearch={true}
          showNotification={true}
          showUser={true}
        />
      </Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: /menu/i }));
    expect(setIsSidebarOpen).toHaveBeenCalled();
  });

  test('dispatches setMode action on mode button click', () => {
    render(
      <Provider store={store}>
        <Navbar
          isSidebarOpen={false}
          setIsSidebarOpen={jest.fn()}
          showSidebar={true}
          showSearch={true}
          showNotification={true}
          showUser={true}
        />
      </Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: /light mode/i }));
    expect(setMode).toHaveBeenCalled();
  });

  test('navigates to profile on profile button click', () => {
    render(
      <Provider store={store}>
        <Navbar
          isSidebarOpen={false}
          setIsSidebarOpen={jest.fn()}
          showSidebar={true}
          showSearch={true}
          showNotification={true}
          showUser={true}
        />
      </Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: /profile/i }));
    expect(navigate).toHaveBeenCalledWith('/userprofile');
  });

  test('shows notification popover on notification button click', () => {
    render(
      <Provider store={store}>
        <Navbar
          isSidebarOpen={false}
          setIsSidebarOpen={jest.fn()}
          showSidebar={true}
          showSearch={true}
          showNotification={true}
          showUser={true}
        />
      </Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: /notifications/i }));
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });

  test('navigates to home on logout button click', () => {
    render(
      <Provider store={store}>
        <Navbar
          isSidebarOpen={false}
          setIsSidebarOpen={jest.fn()}
          showSidebar={true}
          showSearch={true}
          showNotification={true}
          showUser={true}
        />
      </Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: /logout/i }));
    expect(navigate).toHaveBeenCalledWith('/');
  });
});
