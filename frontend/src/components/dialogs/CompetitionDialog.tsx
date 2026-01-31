import React from 'react';
import {
    Grid,
    Box,
    Typography,
    Paper,
} from '@mui/material';
import {
    Groups as GroupsIcon,
    MilitaryTech as CompetitionIcon,
} from '@mui/icons-material';

import { CompetitionClubs, CompetitionClub } from '../../services/api';

interface CompetitionDialogProps {
    details: {
        clubs: CompetitionClubs;
    };
}

const CompetitionDialog: React.FC<CompetitionDialogProps> = ({ details }) => {
    return (
        <Grid container>
            {/* Left Sidebar */}
            <Grid size={{ xs: 12, md: 4 }} sx={{ bgcolor: 'rgba(255,255,255,0.02)', p: 4, borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                <Paper elevation={0} sx={{ borderRadius: 6, overflow: 'hidden', mb: 4, aspectRatio: '3/4', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(255,255,255,0.05)' }}>
                    <Box sx={{ opacity: 0.3 }}>
                        <CompetitionIcon sx={{ fontSize: 120 }} />
                    </Box>
                </Paper>
            </Grid>

            {/* Right Content */}
            <Grid size={{ xs: 12, md: 8 }} sx={{ p: 6 }}>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 4 }}>Competition Clubs</Typography>
                <Grid container spacing={2}>
                    {details.clubs.clubs?.map((club: CompetitionClub, idx: number) => (
                        <Grid size={{ xs: 6 }} key={idx}>
                            <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 3, display: 'flex', alignItems: 'center' }}>
                                <GroupsIcon sx={{ mr: 2, color: 'primary.main' }} />
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>{club.name}</Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </Grid>
    );
};

export default CompetitionDialog;
