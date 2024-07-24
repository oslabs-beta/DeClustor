import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from './Sidebar';

import { renderWithRouterAndRedux } from './mockStore.js';
// Mock theme
const theme = createTheme({
  palette: {
    secondary: {
      200: '#9e9e9e',
      100: '#f5f5f5',
      300: '#e0e0e0',
      400: '#bdbdbd',
      main: '#ff4081',
    },
    background: {
      alt: '#f5f5f5',
    },
    main: {
      400: '#42a5f5',
      600: '#1e88e5',
    },
    mode: 'light', // Ensure mode is set
  },
  transitions: {
    duration: {
      enteringScreen: 225,
      leavingScreen: 195,
    },
  },
});

const mockStore = configureStore([]);

const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);

  return render(ui, { wrapper: Router });
};

describe('Sidebar Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      user: {
        username: 'John Doe',
      },
    });
  });

  it('renders correctly and matches the snapshot', () => {
    const { container } = render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router>
            <Sidebar
              isNonMobile={true}
              drawerWidth={240}
              isSidebarOpen={true}
              setIsSidebarOpen={jest.fn()}
            />
          </Router>
        </ThemeProvider>
      </Provider>
    );
    expect(container).toMatchSnapshot();
  });

  it('displays the correct user information', () => {
    const { getByText } = render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router>
            <Sidebar
              isNonMobile={true}
              drawerWidth={240}
              isSidebarOpen={true}
              setIsSidebarOpen={jest.fn()}
            />
          </Router>
        </ThemeProvider>
      </Provider>
    );
    expect(getByText('John Doe')).toBeInTheDocument();
  });

  it('navigates correctly when a nav item is clicked', () => {
    const { getByText } = render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router>
            <Sidebar
              isNonMobile={true}
              drawerWidth={240}
              isSidebarOpen={true}
              setIsSidebarOpen={jest.fn()}
            />
          </Router>
        </ThemeProvider>
      </Provider>
    );

    const dashboardLink = getByText('Dashboard');
    fireEvent.click(dashboardLink);
    expect(dashboardLink).toHaveStyle(`color: ${theme.palette.primary[600]}`);
  });

  // test('toggles sidebar when the close button is clicked', () => {
  //   const setIsSidebarOpenMock = jest.fn();
  //   const initialState = {
  //     user: {
  //       /* Mock user data */
  //     },
  //   };

  //   const { getByTestId } = renderWithRouterAndRedux(
  //     <Sidebar isOpen={true} onClose={setIsSidebarOpenMock} />,
  //     { initialState }
  //   );

  //   const closeButton = getByTestId('close-sidebar-button');
  //   fireEvent.click(closeButton);

  //   expect(setIsSidebarOpenMock).toHaveBeenCalledWith(false);
  // });
});
