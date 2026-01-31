import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Grid,
    Typography,
    Box,
    Avatar,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Paper,
    Divider,
    Checkbox,
    ListItemText
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { getPlayerStats, getPlayerProfile, PlayerStats, PlayerProfile } from '../services/api';

interface ComparedPlayerData {
    id: string;
    profile: PlayerProfile;
    stats: PlayerStats;
}

interface ComparisonViewProps {
    playerIds: string[];
    open: boolean;
    onClose: () => void;
}

const ComparisonView: React.FC<ComparisonViewProps> = ({ playerIds, open, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<ComparedPlayerData[]>([]);
    const [selectedSeasons, setSelectedSeasons] = useState<Record<string, string[]>>({});

    useEffect(() => {
        if (open && playerIds.length > 0) {
            fetchData();
        }
    }, [open, playerIds]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const promises = playerIds.map(async (id) => {
                const [stats, profile] = await Promise.all([
                    getPlayerStats(id),
                    getPlayerProfile(id)
                ]);
                return { id, stats, profile };
            });

            const results = await Promise.all(promises);
            setData(results);

            const initialSelections: Record<string, string[]> = {};
            results.forEach(p => {
                const uniqueSeasons = Array.from(new Set(p.stats.stats.map(s => s.seasonId))).sort().reverse();
                initialSelections[p.id] = uniqueSeasons.slice(0, 3);
            });

            setSelectedSeasons(initialSelections);
            setData(results);
        } catch (error) {
            console.error("Failed to fetch comparison data", error);
        } finally {
            setLoading(false);
        }
    };

    const getAggregatedStats = (playerIdx: number) => {
        const player = data[playerIdx];
        if (!player) return null;

        const currentFilters = selectedSeasons[player.id] || [];
        const filteredStats = player.stats.stats.filter(s =>
            currentFilters.length === 0 || currentFilters.includes(s.seasonId)
        );

        const totalApps = filteredStats.reduce((sum, s) => sum + (s.appearances || 0), 0);
        const totalGoals = filteredStats.reduce((sum, s) => sum + (s.goals || 0), 0);
        const totalAssists = filteredStats.reduce((sum, s) => sum + (s.assists || 0), 0);
        const totalMinutes = filteredStats.reduce((sum, s) => sum + (s.minutesPlayed || 0), 0);
        const totalYellows = filteredStats.reduce((sum, s) => sum + (s.yellowCards || 0), 0);
        const totalSecondYellows = filteredStats.reduce((sum, s) => sum + (s.secondYellowCards || 0), 0);
        const totalReds = filteredStats.reduce((sum, s) => sum + (s.redCards || 0), 0);
        const totalCleanSheets = filteredStats.reduce((sum, s) => sum + (s.cleanSheets || 0), 0);
        const totalConceded = filteredStats.reduce((sum, s) => sum + (s.goalsConceded || 0), 0);
        const totalSubsOn = filteredStats.reduce((sum, s) => sum + (s.substitutionsOn || 0), 0);
        const totalSubsOff = filteredStats.reduce((sum, s) => sum + (s.substitutionsOff || 0), 0);

        // Calculate Per 90s
        const goalsPer90 = totalMinutes > 0 ? (totalGoals / totalMinutes * 90).toFixed(2) : '0.00';
        const assistsPer90 = totalMinutes > 0 ? (totalAssists / totalMinutes * 90).toFixed(2) : '0.00';
        const gaPer90 = totalMinutes > 0 ? ((totalGoals + totalAssists) / totalMinutes * 90).toFixed(2) : '0.00';

        // Calculate weighted PPG
        let ppgNumerator = 0;
        let ppgDenominator = 0;
        filteredStats.forEach(s => {
            const apps = s.appearances || 0;
            const ppg = parseFloat(s.pointsPerMatch || '0');
            if (!isNaN(ppg)) {
                ppgNumerator += ppg * apps;
                ppgDenominator += apps;
            }
        });
        const avgPPG = ppgDenominator > 0 ? (ppgNumerator / ppgDenominator).toFixed(2) : 'N/A';

        return {
            totalApps,
            totalGoals,
            totalAssists,
            totalMinutes,
            totalYellows,
            totalSecondYellows,
            totalReds,
            totalCleanSheets,
            totalConceded,
            totalSubsOn,
            totalSubsOff,
            avgPPG,
            goalsPer90,
            assistsPer90,
            gaPer90,
            minsPerGoal: totalGoals > 0 ? Math.round(totalMinutes / totalGoals) : 0,
            goalInvolvement: totalGoals + totalAssists
        };
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            PaperProps={{ sx: { borderRadius: 4, bgcolor: 'background.default', height: '90vh' } }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CompareArrowsIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                    <Typography variant="h5" fontWeight={800}>Player Comparison</Typography>
                </Box>
                <IconButton onClick={onClose}><CloseIcon /></IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 4 }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 20 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container spacing={4} sx={{ height: '100%' }}>


                        {/* Players Grid */}
                        <Grid size={{ xs: 12 }}>
                            <Grid container spacing={4}>
                                {data.map((player, idx) => {
                                    const stats = getAggregatedStats(idx);
                                    if (!stats) return null;

                                    return (
                                        <Grid size={{ xs: 12, md: 12 / data.length }} key={player.id}>
                                            <Paper
                                                elevation={0}
                                                sx={{
                                                    p: 4,
                                                    borderRadius: 4,
                                                    height: '100%',
                                                    bgcolor: 'rgba(255,255,255,0.02)',
                                                    border: '1px solid rgba(255,255,255,0.05)',
                                                    transition: 'transform 0.3s',
                                                    '&:hover': { transform: 'translateY(-4px)' }
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                                                    <Avatar
                                                        src={player.profile.imageUrl}
                                                        sx={{ width: 120, height: 120, mb: 2, boxShadow: 6 }}
                                                    />
                                                    <Typography variant="h5" fontWeight={800} textAlign="center">
                                                        {player.profile.name}
                                                    </Typography>
                                                    <Typography variant="body1" color="text.secondary">
                                                        {player.profile.currentClub}
                                                    </Typography>
                                                    <Chip
                                                        label={typeof player.profile.position === 'object' ? (player.profile.position as any).main : player.profile.position}
                                                        color="primary"
                                                        size="small"
                                                        sx={{ mt: 2 }}
                                                    />
                                                </Box>

                                                <FormControl fullWidth size="small" sx={{ mb: 3 }}>
                                                    <InputLabel>Filter Seasons</InputLabel>
                                                    <Select
                                                        multiple
                                                        value={selectedSeasons[player.id] || []}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            const newSelections = typeof val === 'string' ? val.split(',') : val;
                                                            setSelectedSeasons(prev => ({ ...prev, [player.id]: newSelections }));
                                                        }}
                                                        renderValue={(selected) => (
                                                            <Typography variant="body2" noWrap>{selected.length} seasons selected</Typography>
                                                        )}
                                                        MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
                                                        label="Filter Seasons"
                                                    >
                                                        {Array.from(new Set(player.stats.stats.map(s => s.seasonId))).sort().reverse().map((season) => (
                                                            <MenuItem key={season} value={season}>
                                                                <Checkbox checked={(selectedSeasons[player.id] || []).includes(season)} />
                                                                <ListItemText primary={`Season ${season}`} />
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>

                                                <Divider sx={{ mb: 4 }} />

                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                                    <StatRow label="Appearances" value={stats.totalApps} />
                                                    <StatRow label="Goals" value={stats.totalGoals} highlight />
                                                    <StatRow label="Assists" value={stats.totalAssists} />
                                                    <StatRow label="Goal Involvements" value={stats.goalInvolvement} />

                                                    <Divider sx={{ my: 1 }} />
                                                    <StatRow label="Goals per 90" value={stats.goalsPer90} />
                                                    <StatRow label="Assists per 90" value={stats.assistsPer90} />
                                                    <StatRow label="G/A per 90" value={stats.gaPer90} />
                                                    <StatRow label="Mins per Goal" value={stats.minsPerGoal ? `${stats.minsPerGoal}'` : '-'} />

                                                    <Divider sx={{ my: 1 }} />
                                                    <StatRow label="Minutes Played" value={stats.totalMinutes} />
                                                    <StatRow label="PPG" value={stats.avgPPG} />
                                                    <StatRow label="Substituted On" value={stats.totalSubsOn} />
                                                    <StatRow label="Substituted Off" value={stats.totalSubsOff} />

                                                    <Divider sx={{ my: 1 }} />
                                                    <StatRow label="Yellow Cards" value={stats.totalYellows} />
                                                    <StatRow label="2nd Yellows" value={stats.totalSecondYellows} />
                                                    <StatRow label="Red Cards" value={stats.totalReds} />
                                                    {stats.totalCleanSheets > 0 && (
                                                        <>
                                                            <Divider sx={{ my: 1 }} />
                                                            <StatRow label="Clean Sheets" value={stats.totalCleanSheets} />
                                                            <StatRow label="Goals Conceded" value={stats.totalConceded} />
                                                        </>
                                                    )}
                                                </Box>
                                            </Paper>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </Grid>
                    </Grid>
                )}
            </DialogContent>
        </Dialog>
    );
};

const StatRow = ({ label, value, highlight = false }: { label: string, value: string | number, highlight?: boolean }) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography color="text.secondary" fontWeight={500}>{label}</Typography>
        <Typography
            variant="h6"
            fontWeight={highlight ? 800 : 600}
            color={highlight ? 'primary.main' : 'text.primary'}
        >
            {value}
        </Typography>
    </Box>
);

export default ComparisonView;
