import React, { useState } from 'react';
import {
    Container,
    Box,
    Typography,
    TextField,
    InputAdornment,
    IconButton,
    Grid,
    Card,
    CardContent,
    CircularProgress,
    Dialog,
    DialogContent,
    Avatar,
    Chip,
} from '@mui/material';
import {
    Search as SearchIcon,
    ArrowForward as ArrowForwardIcon,
    Close as CloseIcon,
    TrendingUp as TrendIcon,
    Groups as GroupsIcon,
    MilitaryTech as CompetitionIcon,
    CompareArrows as CompareArrowsIcon,
} from '@mui/icons-material';
import Fab from '@mui/material/Fab';
import Badge from '@mui/material/Badge';
import {
    searchPlayers, getPlayerProfile, getPlayerMarketValue, getPlayerStats,
    searchClubs, getClubProfile, getClubPlayers,
    searchCompetitions, getCompetitionClubs, getCompetitionTable, getCompetitionKnockout,
    getCompetitionFixtures, getCompetitionScorers
} from '../services/api';
import PlayerDialog from '../components/dialogs/PlayerDialog';
import ClubDialog from '../components/dialogs/ClubDialog';
import CompetitionDialog from '../components/dialogs/CompetitionDialog';
import ComparisonView from '../components/ComparisonView';

import { SearchResultItem } from '../services/api';

const formatMarketValue = (val: string | number | undefined) => {
    if (!val) return 'N/A';
    if (typeof val === 'number') {
        if (val >= 1000000) return `€${(val / 1000000).toFixed(2)}M`;
        if (val >= 1000) return `€${(val / 1000).toFixed(0)}K`;
    }
    return `€${val}`;
};

// Helper to safely render object or string values
const safeRender = (value: string | { name: string } | undefined) => {
    if (!value) return 'N/A';
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && value.name) return value.name;
    return 'N/A';
};

const getIcon = (type: string) => {
    switch (type) {
        case 'players': return <TrendIcon />;
        case 'clubs': return <GroupsIcon />;
        case 'competitions': return <CompetitionIcon />;
        default: return <SearchIcon />;
    }
};

interface SearchPageProps {
    searchType: 'players' | 'clubs' | 'competitions';
}

const SearchPage: React.FC<SearchPageProps> = ({ searchType }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResultItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState<{ id: string; type: string } | null>(null);
    const [modalLoading, setModalLoading] = useState(false);
    const [details, setDetails] = useState<any>(null);
    const [compareList, setCompareList] = useState<string[]>([]);
    const [comparisonOpen, setComparisonOpen] = useState(false);

    const handleSearch = async () => {
        if (!query) return;
        setLoading(true);
        setResults([]);
        try {
            let data;
            if (searchType === 'players') {
                data = await searchPlayers(query);
            } else if (searchType === 'clubs') {
                data = await searchClubs(query);
            } else {
                data = await searchCompetitions(query);
            }
            setResults(data.results || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = async (id: string, typeOverride?: string) => {
        const type = typeOverride || searchType;
        setSelectedItem({ id, type });
        setModalLoading(true);
        setDetails(null);
        try {
            let data;
            if (type === 'players') {
                const [profile, market, stats] = await Promise.all([
                    getPlayerProfile(id),
                    getPlayerMarketValue(id),
                    getPlayerStats(id)
                ]);
                data = { profile, market, stats };
            } else if (type === 'clubs') {
                const [profile, players] = await Promise.all([
                    getClubProfile(id),
                    getClubPlayers(id)
                ]);
                data = { profile, players };
            } else {
                const clubs = await getCompetitionClubs(id);
                const seasonId = (clubs as { seasonId?: string; season_id?: string }).seasonId
                    || (clubs as { seasonId?: string; season_id?: string }).season_id;
                const [table, knockout, fixtures, scorers] = await Promise.all([
                    getCompetitionTable(id, seasonId).catch(() => ({ id, table: [] })),
                    getCompetitionKnockout(id, seasonId).catch(() => ({ id, rounds: [] })),
                    getCompetitionFixtures(id, seasonId).catch(() => ({ id, fixtures: [] })),
                    getCompetitionScorers(id, seasonId).catch(() => ({ id, scorers: [] })),
                ]);
                data = { clubs, table, knockout, fixtures, scorers };
            }
            setDetails(data);
        } catch (err) {
            console.error(err);
        } finally {
            setModalLoading(false);
        }
    };

    const toggleCompare = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setCompareList(prev => {
            if (prev.includes(id)) return prev.filter(pid => pid !== id);
            if (prev.length >= 3) return prev;
            return [...prev, id];
        });
    };

    return (
        <Container maxWidth="lg">
            {/* Search Bar */}
            <Box sx={{ maxWidth: 600, mx: 'auto', mb: 6 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder={`Search for a ${searchType.slice(0, -1)}...`}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={handleSearch} sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' }, color: 'secondary.main', borderRadius: 2 }}>
                                    <ArrowForwardIcon />
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            bgcolor: 'background.paper',
                            pr: 1,
                            '& fieldset': {
                                borderWidth: 2
                            }
                        }
                    }}
                />
            </Box>

            {/* Loading */}
            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                    <CircularProgress size={60} />
                </Box>
            )}

            {/* Results */}
            {!loading && results.length > 0 && (
                <Grid container spacing={4} justifyContent="center">
                    {results.map((item) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
                            <Card
                                onClick={() => handleViewDetails(item.id)}
                                sx={{
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    borderRadius: 4,
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: 6
                                    }
                                }}
                            >
                                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                                    <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: 'primary.main' }}>
                                        {getIcon(searchType)}
                                    </Avatar>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                                        {item.name}
                                    </Typography>
                                    {searchType === 'players' && (
                                        <>
                                            <IconButton
                                                onClick={(e) => toggleCompare(item.id, e)}
                                                sx={{
                                                    position: 'absolute',
                                                    top: 8,
                                                    right: 8,
                                                    bgcolor: compareList.includes(item.id) ? 'primary.main' : 'rgba(0,0,0,0.05)',
                                                    color: compareList.includes(item.id) ? 'white' : 'action.active',
                                                    '&:hover': { bgcolor: compareList.includes(item.id) ? 'primary.dark' : 'rgba(0,0,0,0.1)' }
                                                }}
                                                size="small"
                                            >
                                                <CompareArrowsIcon fontSize="small" />
                                            </IconButton>
                                            <Chip label={item.position} size="small" sx={{ mb: 1 }} />
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                {safeRender(item.club)} • Age {item.age}
                                            </Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 700, color: 'primary.main' }}>{formatMarketValue(item.marketValue)}</Typography>
                                        </>
                                    )}
                                    {searchType === 'clubs' && (
                                        <Typography variant="body2" color="text.secondary">
                                            {safeRender(item.country)}
                                        </Typography>
                                    )}
                                    {searchType === 'competitions' && (
                                        <Typography variant="body2" color="text.secondary">
                                            {safeRender(item.country)}
                                        </Typography>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Modal */}
            <Dialog
                open={!!selectedItem}
                onClose={() => setSelectedItem(null)}
                maxWidth="md"
                fullWidth
                PaperProps={{ sx: { borderRadius: 6, backgroundImage: 'none', bgcolor: 'background.default' } }}
            >
                <IconButton
                    onClick={() => setSelectedItem(null)}
                    sx={{ position: 'absolute', right: 16, top: 16, zIndex: 1, color: 'text.secondary' }}
                >
                    <CloseIcon />
                </IconButton>

                <DialogContent sx={{ p: 0 }}>
                    {modalLoading ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 20 }}>
                            <CircularProgress color="primary" />
                            <Typography sx={{ mt: 2, color: 'text.secondary' }}>Compiling intelligence report...</Typography>
                        </Box>
                    ) : details && selectedItem && (
                        <>
                            {selectedItem.type === 'players' && <PlayerDialog details={details} />}
                            {selectedItem.type === 'clubs' && <ClubDialog details={details} />}
                            {selectedItem.type === 'competitions' && (
                                <CompetitionDialog
                                    details={details}
                                    onClubClick={(id) => handleViewDetails(id, 'clubs')}
                                    onPlayerClick={(id) => handleViewDetails(id, 'players')}
                                />
                            )}
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Comparison FAB */}
            {compareList.length > 0 && (
                <Box sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1000 }}>
                    <Badge badgeContent={compareList.length} color="secondary">
                        <Fab
                            color="primary"
                            variant="extended"
                            onClick={() => setComparisonOpen(true)}
                            sx={{ fontWeight: 700 }}
                        >
                            <CompareArrowsIcon sx={{ mr: 1 }} />
                            Compare Players
                        </Fab>
                    </Badge>
                </Box>
            )}

            <ComparisonView
                open={comparisonOpen}
                onClose={() => setComparisonOpen(false)}
                playerIds={compareList}
            />
        </Container>
    );
};

export default SearchPage;
