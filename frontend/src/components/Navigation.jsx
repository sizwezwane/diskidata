import React from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { Box, Button, Container, Typography } from '@mui/material';
import {
    TrendingUp as TrendIcon,
    Groups as GroupsIcon,
    MilitaryTech as CompetitionIcon,
    EmojiEvents as TrophyIcon,
} from '@mui/icons-material';

const Navigation = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    const navItems = [
        { path: '/players', label: 'Players', icon: <TrendIcon /> },
        { path: '/clubs', label: 'Clubs', icon: <GroupsIcon /> },
        { path: '/competitions', label: 'Competitions', icon: <CompetitionIcon /> },
    ];

    return (
        <Box sx={{ py: 4, mb: 4 }}>
            <Container maxWidth="lg">
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Box sx={{ display: 'inline-flex', p: 1, bgcolor: 'primary.main', borderRadius: 2, mb: 2 }}>
                        <TrophyIcon sx={{ color: 'secondary.main' }} />
                    </Box>
                    <Typography variant="h2" component="h1" gutterBottom sx={{ letterSpacing: '-0.05em' }}>
                        Diski<Box component="span" sx={{ color: 'primary.main' }}>Data</Box>
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.2rem', mb: 4 }}>
                        Premium Football Intelligence Platform
                    </Typography>
                </Box>

                {/* Navigation */}
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                    {navItems.map((item) => (
                        <Link key={item.path} to={item.path} style={{ textDecoration: 'none' }}>
                            <Button
                                variant={currentPath === item.path ? 'contained' : 'outlined'}
                                startIcon={item.icon}
                                sx={{
                                    px: 4,
                                    py: 1.5,
                                    borderRadius: 3,
                                    fontWeight: 700,
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    borderWidth: 2,
                                    '&:hover': {
                                        borderWidth: 2,
                                    }
                                }}
                            >
                                {item.label}
                            </Button>
                        </Link>
                    ))}
                </Box>
            </Container>
        </Box>
    );
};

export default Navigation;
