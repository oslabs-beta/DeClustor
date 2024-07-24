import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Tutorial from './Tutorial';
import DashDemo from '../assets/dashboard.gif';

// Mock the image import
jest.mock('../assets/dashboard.gif', () => 'dashboard.gif');

describe('Tutorial Component', () => {
  it('renders correctly and matches the snapshot', () => {
    const { container } = render(<Tutorial />);
    expect(container).toMatchSnapshot();
  });

  it('renders the image with correct src and alt attributes', () => {
    const { getByAltText } = render(<Tutorial />);
    const imgElement = getByAltText('Tutorial');
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('src', 'dashboard.gif');
  });

  it('renders the Container and Box components with correct styles', () => {
    const { getByAltText, container } = render(<Tutorial />);
    const imgElement = getByAltText('Tutorial');
    const boxElement = imgElement.closest('div');
    expect(boxElement).toHaveStyle('display: flex');
    expect(boxElement).toHaveStyle('flexDirection: column');
    expect(boxElement).toHaveStyle('alignItems: center');
    expect(boxElement).toHaveStyle('marginTop: 8');
  });
});
