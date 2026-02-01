import React, { useState, useEffect, useMemo } from 'react';
import {
    Grid,
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
} from '@mui/material';
import {
    MilitaryTech as CompetitionIcon,
    EmojiEvents as TableIcon,
    SportsSoccer as KnockoutIcon,
} from '@mui/icons-material';

import {
    CompetitionClubs,
    CompetitionTable,
    CompetitionKnockout,
} from '../../services/api';
import { getCompetitionClubs, getCompetitionTable, getCompetitionKnockout } from '../../services/api';

/** Format season ID (e.g. "2024") to display label "24/25" */
function formatSeasonLabel(seasonId: string | undefined): string {
    if (!seasonId || !/^\d{4}$/.test(seasonId)) return seasonId ?? '—';
    const y = parseInt(seasonId, 10);
    const short = (y % 100).toString().padStart(2, '0');
    const nextShort = ((y + 1) % 100).toString().padStart(2, '0');
    return `${short}/${nextShort}`;
}

/** Build list of season IDs (current year down, e.g. 2025, 2024, 2023...) */
function getSeasonOptions(count = 15): string[] {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: count }, (_, i) => String(currentYear - i));
}

interface CompetitionDialogProps {
    details: {
        clubs: CompetitionClubs;
        table?: CompetitionTable;
        knockout?: CompetitionKnockout;
    };
    onClubClick: (id: string) => void;
}

const CompetitionDialog: React.FC<CompetitionDialogProps> = ({ details, onClubClick }) => {
    const competitionId = details.clubs.id;
    const initialSeason =
        (details.clubs as { seasonId?: string; season_id?: string }).seasonId
        || (details.clubs as { seasonId?: string; season_id?: string }).season_id
        || String(new Date().getFullYear());

    const [selectedSeasonId, setSelectedSeasonId] = useState(initialSeason);
    const [localDetails, setLocalDetails] = useState(details);
    const [seasonLoading, setSeasonLoading] = useState(false);

    const seasonOptions = useMemo(() => getSeasonOptions(), []);

    // When dialog opens with a new competition, sync season and data from parent
    useEffect(() => {
        setSelectedSeasonId(initialSeason);
        setLocalDetails(details);
    }, [competitionId, initialSeason, details.clubs.id, details.clubs.name]);

    // When user changes season: use parent data if back to initial season, else fetch
    useEffect(() => {
        if (selectedSeasonId === initialSeason) {
            setLocalDetails(details);
            return;
        }
        let cancelled = false;
        setSeasonLoading(true);
        (async () => {
            try {
                const clubs = await getCompetitionClubs(competitionId, selectedSeasonId);
                const seasonId =
                    (clubs as { seasonId?: string; season_id?: string }).seasonId
                    || (clubs as { seasonId?: string; season_id?: string }).season_id;
                const [table, knockout] = await Promise.all([
                    getCompetitionTable(competitionId, seasonId).catch(() => ({ id: competitionId, table: [] })),
                    getCompetitionKnockout(competitionId, seasonId).catch(() => ({ id: competitionId, rounds: [] })),
                ]);
                if (!cancelled) setLocalDetails({ clubs, table, knockout });
            } catch (err) {
                if (!cancelled) setLocalDetails(prev => prev);
            } finally {
                if (!cancelled) setSeasonLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [selectedSeasonId, competitionId, initialSeason, details]);

    const clubs = localDetails.clubs;
    const table = localDetails.table;
    const knockout = localDetails.knockout;

    const hasTable = table?.table && table.table.length > 0;
    const hasKnockout = knockout?.rounds && knockout.rounds.length > 0;

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
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>{clubs.name}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel id="competition-season-label">Season</InputLabel>
                        <Select
                            labelId="competition-season-label"
                            value={selectedSeasonId}
                            label="Season"
                            onChange={(e) => setSelectedSeasonId(e.target.value)}
                            disabled={seasonLoading}
                        >
                            {seasonOptions.map((id) => (
                                <MenuItem key={id} value={id}>
                                    {formatSeasonLabel(id)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {seasonLoading && <CircularProgress size={20} />}
                </Box>

                {/* League Table - show when available */}
                {hasTable && (
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TableIcon color="primary" /> League Table
                        </Typography>
                        <TableContainer component={Paper} elevation={0} sx={{ bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 3, mb: 4 }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Club</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 700 }}>P</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 700 }}>W</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 700 }}>D</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 700 }}>L</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 700 }}>GF:GA</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 700 }}>+/-</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 700 }}>Pts</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {table.table.map((row) => (
                                        <TableRow
                                            key={row.rank}
                                            onClick={() => onClubClick(row.clubId)}
                                            sx={{
                                                cursor: 'pointer',
                                                '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
                                            }}
                                        >
                                            <TableCell>{row.rank}</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>{row.clubName}</TableCell>
                                            <TableCell align="right">{row.matches}</TableCell>
                                            <TableCell align="right">{row.wins}</TableCell>
                                            <TableCell align="right">{row.draws}</TableCell>
                                            <TableCell align="right">{row.losses}</TableCell>
                                            <TableCell align="right">{row.goalsForAgainst}</TableCell>
                                            <TableCell align="right">{row.goalDifference}</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 700 }}>{row.points}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}

                {/* Knockout Stages - show when available */}
                {hasKnockout && (
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <KnockoutIcon color="primary" /> Knockout Stages
                        </Typography>
                        {knockout.rounds.map((round, ridx) => (
                            <Box key={ridx} sx={{ mb: 3 }}>
                                <Typography variant="subtitle2" color="primary" sx={{ mb: 1, fontWeight: 600 }}>
                                    {round.roundName}
                                </Typography>
                                {round.matches.map((match, midx) => (
                                    <Box
                                        key={midx}
                                        sx={{
                                            p: 2,
                                            bgcolor: 'rgba(255,255,255,0.03)',
                                            borderRadius: 2,
                                            mb: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <Typography variant="body2">{match.homeTeam}</Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                            {match.homeScore != null && match.awayScore != null
                                                ? `${match.homeScore} - ${match.awayScore}`
                                                : 'vs'}
                                        </Typography>
                                        <Typography variant="body2">{match.awayTeam}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        ))}
                    </Box>
                )}
            </Grid>
        </Grid>
    );
};

export default CompetitionDialog;
