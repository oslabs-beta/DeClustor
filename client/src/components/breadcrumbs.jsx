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
        marginBottom: '20px', 
      }}
    >
      {/* check if the current path? */}
      {breadcrumbs.map((breadcrumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        const isActive = breadcrumb.path === currentPathname;
        return isLast ? (
          <Typography
            sx={{ color: isActive ? 'rgb(29, 99, 237)' : 'text.primary' }}
            key={breadcrumb.path}
          >
            {breadcrumb.name}
          </Typography>
        ) : (
          <Link
            sx={{ color: isActive ? 'rgb(29, 99, 237)' : 'inherit', cursor: 'pointer' }} 
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
