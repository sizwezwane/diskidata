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
    CalendarToday as CalendarIcon,
    Public as FlagIcon,
    Straighten as HeightIcon,
    MonitorWeight as FootIcon,
    Numbers as JerseyIcon,
} from '@mui/icons-material';
import { PlayerProfile, PlayerMarketValue, PlayerStats } from '../../services/api';

const formatMarketValue = (val: string | number | undefined) => {
    if (!val) return 'N/A';
    if (typeof val === 'number') {
        if (val >= 1000000) return `€${(val / 1000000).toFixed(2)}M`;
        if (val >= 1000) return `€${(val / 1000).toFixed(0)}K`;
    }
    return `€${val}`;
};

interface PlayerDialogProps {
    details: {
        profile: PlayerProfile;
        market: PlayerMarketValue;
        stats: PlayerStats;
    };
}

const PlayerDialog: React.FC<PlayerDialogProps> = ({ details }) => {
    return (
        <Grid container>
            {/* Left Sidebar */}
            <Grid size={{ xs: 12, md: 4 }} sx={{ bgcolor: 'rgba(255,255,255,0.02)', p: 4, borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                <Paper elevation={0} sx={{ borderRadius: 6, overflow: 'hidden', mb: 4, aspectRatio: '3/4', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(255,255,255,0.05)' }}>
                    <img
                        src={details.profile.imageUrl || 'https://via.placeholder.com/400x500'}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        alt={details.profile.name}
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
            <Grid size={{ xs: 12, md: 8 }} sx={{ p: 6 }}>
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
                        <Grid size={{ xs: 6 }} key={idx}>
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

                {Object.entries(
                    (details.stats.stats || []).reduce((acc: any, stat) => {
                        const season = stat.seasonId;
                        if (!acc[season]) acc[season] = [];
                        acc[season].push(stat);
                        return acc;
                    }, {})
                ).sort((a: any, b: any) => b[0].localeCompare(a[0])).map(([season, stats]: any) => (
                    <Box key={season} sx={{ mb: 4 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, color: 'primary.main', fontWeight: 800, letterSpacing: 1 }}>SEASON {season}</Typography>
                        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, bgcolor: 'transparent', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <Table size="small">
                                <TableHead sx={{ bgcolor: 'rgba(255,255,255,0.02)' }}>
                                    <TableRow>
                                        <TableCell sx={{ py: 1.5, fontWeight: 700, fontSize: '0.75rem', color: 'text.secondary' }}>COMPETITION</TableCell>
                                        <TableCell sx={{ py: 1.5, fontWeight: 700, fontSize: '0.75rem', color: 'text.secondary' }}>CLUB</TableCell>
                                        <TableCell align="center" sx={{ py: 1.5, fontWeight: 700, fontSize: '0.75rem', color: 'text.secondary' }}>APPS</TableCell>
                                        <TableCell align="center" sx={{ py: 1.5, fontWeight: 700, fontSize: '0.75rem', color: 'text.secondary' }}>GOALS</TableCell>
                                        <TableCell align="center" sx={{ py: 1.5, fontWeight: 700, fontSize: '0.75rem', color: 'text.secondary' }}>ASSISTS</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {stats.map((row: any, idx: number) => (
                                        <TableRow key={idx} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <TableCell sx={{ py: 1.5 }}>
                                                {row.competitionName || row.competition || 'N/A'}
                                            </TableCell>
                                            <TableCell sx={{ py: 1.5, fontWeight: 600 }}>{row.clubName || 'N/A'}</TableCell>
                                            <TableCell align="center" sx={{ py: 1.5 }}>{row.appearances || '-'}</TableCell>
                                            <TableCell align="center" sx={{ py: 1.5, color: row.goals > 0 ? 'primary.main' : 'inherit', fontWeight: row.goals > 0 ? 700 : 400 }}>{row.goals || '-'}</TableCell>
                                            <TableCell align="center" sx={{ py: 1.5 }}>{row.assists || '-'}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                ))}
            </Grid>
        </Grid>
    );
};

export default PlayerDialog;
