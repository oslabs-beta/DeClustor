import React from 'react';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const BreadcrumbsNav = ({ breadcrumbs, currentPath }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPathname = location.pathname;

  return (
    <Breadcrumbs
      aria-label='breadcrumb'
      separator='>'
      sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        margin: 0,
        padding: 0,
      }}
    >
      {breadcrumbs.map((breadcrumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        const isActive = breadcrumb.path === currentPathname;
        return isLast ? (
          <Typography
            color={isActive ? 'primary.main' : 'text.primary'}
            key={breadcrumb.path}
          >
            {breadcrumb.name}
          </Typography>
        ) : (
          <Link
            color={isActive ? 'primary.main' : 'inherit'}
            onClick={() => navigate(breadcrumb.path)}
            key={breadcrumb.path}
          >
            {breadcrumb.name}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

export default BreadcrumbsNav;
