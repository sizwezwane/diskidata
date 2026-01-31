import React from 'react';
import {
    Grid,
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';
import {
    Groups as GroupsIcon,
    LocationCity as CityIcon,
} from '@mui/icons-material';

const categorizePosition = (position) => {
    const pos = position?.toLowerCase() || '';
    if (pos.includes('goalkeeper')) return 'Goalkeepers';
    if (pos.includes('back') || pos.includes('defender')) return 'Defenders';
    if (pos.includes('midfield')) return 'Midfielders';
    if (pos.includes('forward') || pos.includes('winger') || pos.includes('striker')) return 'Forwards';
    return 'Other';
};

const ClubDialog = ({ details }) => {
    return (
        <Grid container>
            {/* Left Sidebar */}
            <Grid item xs={12} md={4} sx={{ bgcolor: 'rgba(255,255,255,0.02)', p: 4, borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                <Paper elevation={0} sx={{ borderRadius: 6, overflow: 'hidden', mb: 4, aspectRatio: '3/4', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(255,255,255,0.05)' }}>
                    <Box sx={{ opacity: 0.3 }}>
                        <GroupsIcon sx={{ fontSize: 120 }} />
                    </Box>
                </Paper>

                <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>Total Value</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>
                        {details.profile.totalMarketValue || 'N/A'}
                    </Typography>
                </Box>
            </Grid>

            {/* Right Content */}
            <Grid item xs={12} md={8} sx={{ p: 6 }}>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>{details.profile.name}</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    <CityIcon sx={{ fontSize: 18, mr: 1, color: 'primary.main', verticalAlign: 'middle' }} />
                    {details.profile.league?.name || 'Top Division'} • {details.profile.country || 'N/A'}
                </Typography>

                <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>Current Squad</Typography>
                {['Goalkeepers', 'Defenders', 'Midfielders', 'Forwards', 'Other'].map(cat => {
                    const players = details.players.players?.filter(p => categorizePosition(p.position) === cat);
                    if (!players || players.length === 0) return null;
                    return (
                        <Box key={cat} sx={{ mb: 4 }}>
                            <Typography variant="subtitle2" color="primary" sx={{ mb: 1, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>
                                {cat}
                            </Typography>
                            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, bgcolor: 'transparent', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <Table size="small">
                                    <TableHead sx={{ bgcolor: 'rgba(255,255,255,0.02)' }}>
                                        <TableRow>
                                            <TableCell sx={{ py: 1, fontWeight: 700 }}>Player</TableCell>
                                            <TableCell align="center" sx={{ py: 1, fontWeight: 700 }}>Pos</TableCell>
                                            <TableCell align="center" sx={{ py: 1, fontWeight: 700 }}>Age</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {players.map((p, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell sx={{ py: 1, fontWeight: 600 }}>{p.name}</TableCell>
                                                <TableCell align="center" sx={{ py: 1 }}>{p.position}</TableCell>
                                                <TableCell align="center" sx={{ py: 1 }}>{p.age}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    );
                })}
            </Grid>
        </Grid>
    );
};

export default ClubDialog;
