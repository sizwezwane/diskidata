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
    Avatar
} from '@mui/material';
import {
    CalendarToday as CalendarIcon,
    Public as FlagIcon,
    Straighten as HeightIcon,
    MonitorWeight as FootIcon,
    Numbers as JerseyIcon,
} from '@mui/icons-material';

const formatMarketValue = (val) => {
    if (!val) return 'N/A';
    if (val >= 1000000) return `€${(val / 1000000).toFixed(2)}M`;
    if (val >= 1000) return `€${(val / 1000).toFixed(0)}K`;
    return `€${val}`;
};

const PlayerDialog = ({ details }) => {
    return (
        <Grid container>
            {/* Left Sidebar */}
            <Grid item xs={12} md={4} sx={{ bgcolor: 'rgba(255,255,255,0.02)', p: 4, borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                <Paper elevation={0} sx={{ borderRadius: 6, overflow: 'hidden', mb: 4, aspectRatio: '3/4', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(255,255,255,0.05)' }}>
                    <img
                        src={details.profile.imageUrl || 'https://via.placeholder.com/400x500'}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </Paper>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>Valuation</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>
                        {formatMarketValue(details.market.marketValue || details.profile.marketValue)}
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>Club</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>{details.profile.club?.name || details.profile.currentClub || 'N/A'}</Typography>
                </Box>
            </Grid>

            {/* Right Content */}
            <Grid item xs={12} md={8} sx={{ p: 6 }}>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.03em' }}>{details.profile.name}</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 6 }}>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                        <CalendarIcon sx={{ fontSize: 18, mr: 1, color: 'primary.main' }} /> {details.profile.age} years
                    </Typography>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                        <FlagIcon sx={{ fontSize: 18, mr: 1, color: 'primary.main' }} /> {details.profile.citizenship?.join(', ') || 'Global'}
                    </Typography>
                </Box>

                <Grid container spacing={2} sx={{ mb: 4 }}>
                    {[
                        { label: 'Height', val: details.profile.height ? `${details.profile.height} cm` : 'N/A', icon: <HeightIcon /> },
                        { label: 'Foot', val: details.profile.foot || 'Both', icon: <FootIcon /> },
                        { label: 'Jersey', val: details.profile.shirtNumber || 'N/A', icon: <JerseyIcon /> },
                        { label: 'Expires', val: details.profile.club?.contractExpires || 'N/A', icon: <CalendarIcon /> }
                    ].map((item, idx) => (
                        <Grid item xs={6} key={idx}>
                            <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 3, display: 'flex', alignItems: 'center' }}>
                                <Box sx={{ mr: 2, color: 'primary.main', opacity: 0.8 }}>{item.icon}</Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>{item.label}</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{item.val}</Typography>
                                </Box>
                            </Box>
                        </Grid>
                    ))}
                </Grid>

                <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>Performance History</Typography>
                <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, bgcolor: 'transparent', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <Table size="small">
                        <TableHead sx={{ bgcolor: 'rgba(255,255,255,0.02)' }}>
                            <TableRow>
                                <TableCell sx={{ py: 2, fontWeight: 700 }}>Competition</TableCell>
                                <TableCell align="center" sx={{ py: 2, fontWeight: 700 }}>Apps</TableCell>
                                <TableCell align="center" sx={{ py: 2, fontWeight: 700 }}>Goals</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {details.stats.stats?.slice(0, 5).map((row, idx) => (
                                <TableRow key={idx}>
                                    <TableCell sx={{ py: 2 }}>{row.competitionName}</TableCell>
                                    <TableCell align="center">{row.appearances || 0}</TableCell>
                                    <TableCell align="center" sx={{ color: 'primary.main', fontWeight: 700 }}>{row.goals || 0}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
    );
};

export default PlayerDialog;
