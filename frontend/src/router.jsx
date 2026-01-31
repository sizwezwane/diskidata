import React from 'react';
import { createRootRoute, createRoute, createRouter, redirect, Outlet } from '@tanstack/react-router';
import { Box } from '@mui/material';
import Navigation from './components/Navigation';
import PlayersPage from './pages/PlayersPage';
import ClubsPage from './pages/ClubsPage';
import CompetitionsPage from './pages/CompetitionsPage';

// Root route with layout
const rootRoute = createRootRoute({
    component: () => (
        <Box sx={{ minHeight: '100vh', py: 4 }}>
            <Navigation />
            <Box sx={{ py: 4 }}>
                <Outlet />
            </Box>
        </Box>
    ),
});

// Index route - redirects to /players
const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    beforeLoad: () => {
        throw redirect({ to: '/players' });
    },
});

// Players route
const playersRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/players',
    component: PlayersPage,
});

// Clubs route
const clubsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/clubs',
    component: ClubsPage,
});

// Competitions route
const competitionsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/competitions',
    component: CompetitionsPage,
});

// Create the route tree
const routeTree = rootRoute.addChildren([
    indexRoute,
    playersRoute,
    clubsRoute,
    competitionsRoute,
]);

// Create and export the router
export const router = createRouter({ routeTree });
