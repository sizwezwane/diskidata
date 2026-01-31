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
  CardMedia,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  ArrowForward as ArrowForwardIcon,
  EmojiEvents as TrophyIcon,
  Close as CloseIcon,
  CalendarToday as CalendarIcon,
  Public as FlagIcon,
  Straighten as HeightIcon,
  MonitorWeight as FootIcon,
  Numbers as JerseyIcon,
  TrendingUp as TrendIcon
} from '@mui/icons-material';
import { searchPlayers, getPlayerProfile, getPlayerMarketValue, getPlayerStats } from './services/api';

const formatMarketValue = (val) => {
  if (!val) return 'N/A';
  if (val >= 1000000) return `€${(val / 1000000).toFixed(2)}M`;
  if (val >= 1000) return `€${(val / 1000).toFixed(0)}K`;
  return `€${val}`;
};

function App() {
  const [query, setQuery] = useState('');
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [playerDetails, setPlayerDetails] = useState(null);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setPlayers([]);
    try {
      const data = await searchPlayers(query);
      setPlayers(data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewPlayer = async (id) => {
    setSelectedPlayer(id);
    setModalLoading(true);
    setPlayerDetails(null);
    try {
      const [profile, market, stats] = await Promise.all([
        getPlayerProfile(id),
        getPlayerMarketValue(id),
        getPlayerStats(id)
      ]);
      setPlayerDetails({ profile, market, stats });
    } catch (err) {
      console.error(err);
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', py: 8 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Box sx={{ display: 'inline-flex', p: 1, bgcolor: 'primary.main', borderRadius: 2, mb: 2 }}>
            <TrophyIcon sx={{ color: 'secondary.main' }} />
          </Box>
          <Typography variant="h2" component="h1" gutterBottom sx={{ letterSpacing: '-0.05em' }}>
            Diski<Box component="span" sx={{ color: 'primary.main' }}>Data</Box>
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.2rem', mb: 6 }}>
            Premium Football Scouting & Performance Analytics
          </Typography>

          {/* Search Bar */}
          <Box sx={{ maxWidth: 600, mx: 'auto' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search for a player..."
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
                ),
                sx: {
                  borderRadius: 4,
                  bgcolor: 'background.paper',
                  fontSize: '1.1rem',
                  py: 1
                }
              }}
            />
          </Box>
        </Box>

        {/* Results */}
        {loading && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10 }}>
            <CircularProgress color="primary" size={60} thickness={4} />
            <Typography sx={{ mt: 3, color: 'text.secondary' }}>Scanning global databases...</Typography>
          </Box>
        )}

        {!loading && players.length > 0 && (
          <Grid container spacing={4}>
            {players.map((player) => (
              <Grid item xs={12} sm={6} md={4} key={player.id}>
                <Card
                  onClick={() => handleViewPlayer(player.id)}
                  sx={{
                    cursor: 'pointer',
                    height: '100%',
                    borderRadius: 4,
                    transition: '0.3s',
                    '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 12px 24px rgba(251, 191, 36, 0.1)' }
                  }}
                >
                  <Box sx={{ position: 'relative', pt: '75%', bgcolor: 'rgba(255,255,255,0.02)' }}>
                    <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
                      <Avatar
                        src={player.image}
                        variant="square"
                        sx={{ width: '100%', height: '100%', opacity: 0.8 }}
                      />
                    </Box>
                    <Chip
                      label={`Age: ${player.age || 'N/A'}`}
                      size="small"
                      sx={{ position: 'absolute', top: 16, right: 16, bgcolor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
                    />
                  </Box>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" noWrap sx={{ fontWeight: 700 }}>{player.name}</Typography>
                    <Typography variant="body2" color="primary" sx={{ fontWeight: 600, mb: 2 }}>{player.position || 'Professional'}</Typography>

                    <Divider sx={{ mb: 2, opacity: 0.1 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="caption" color="text.secondary">Market Value</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 700, color: 'primary.main' }}>{formatMarketValue(player.marketValue)}</Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                      {player.club?.name || 'No Club'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Modal */}
        <Dialog
          open={!!selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
          maxWidth="md"
          fullWidth
          PaperProps={{ sx: { borderRadius: 6, backgroundImage: 'none', bgcolor: 'background.default' } }}
        >
          <IconButton
            onClick={() => setSelectedPlayer(null)}
            sx={{ position: 'absolute', right: 16, top: 16, zIndex: 1, color: 'text.secondary' }}
          >
            <CloseIcon />
          </IconButton>

          <DialogContent sx={{ p: 0 }}>
            {modalLoading ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 20 }}>
                <CircularProgress color="primary" />
                <Typography sx={{ mt: 2, color: 'text.secondary' }}>Compiling scouting report...</Typography>
              </Box>
            ) : playerDetails && (
              <Grid container>
                {/* Left Sidebar */}
                <Grid item xs={12} md={4} sx={{ bgcolor: 'rgba(255,255,255,0.02)', p: 4, borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                  <Paper elevation={0} sx={{ borderRadius: 6, overflow: 'hidden', mb: 4, aspectRatio: '3/4' }}>
                    <img
                      src={playerDetails.profile.imageUrl || 'https://via.placeholder.com/400x500'}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Paper>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>Valuation</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>
                      {formatMarketValue(playerDetails.market.marketValue || playerDetails.profile.marketValue)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>Club</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>{playerDetails.profile.club?.name || playerDetails.profile.currentClub || 'N/A'}</Typography>
                  </Box>
                </Grid>

                {/* Right Content */}
                <Grid item xs={12} md={8} sx={{ p: 6 }}>
                  <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.03em' }}>{playerDetails.profile.name}</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 6 }}>
                    <Box component="span" sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', fontSize: '0.9rem' }}>
                      <CalendarIcon sx={{ fontSize: 18, mr: 1, color: 'primary.main' }} /> {playerDetails.profile.age} years
                    </Box>
                    <Box component="span" sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', fontSize: '0.9rem' }}>
                      <FlagIcon sx={{ fontSize: 18, mr: 1, color: 'primary.main' }} /> {playerDetails.profile.citizenship?.join(', ') || 'Global'}
                    </Box>
                    <Box component="span" sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', fontSize: '0.9rem' }}>
                      <TrendIcon sx={{ fontSize: 18, mr: 1, color: 'primary.main' }} /> {playerDetails.profile.position?.main || 'Player'}
                    </Box>
                  </Box>

                  <Grid container spacing={2} sx={{ mb: 6 }}>
                    {[
                      { label: 'Height', val: playerDetails.profile.height ? `${playerDetails.profile.height} cm` : 'N/A', icon: <HeightIcon /> },
                      { label: 'Foot', val: playerDetails.profile.foot || 'Both', icon: <FootIcon /> },
                      { label: 'Jersey', val: playerDetails.profile.shirtNumber || 'N/A', icon: <JerseyIcon /> },
                      { label: 'Expires', val: playerDetails.profile.club?.contractExpires || 'N/A', icon: <CalendarIcon /> }
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
                          <TableCell align="center" sx={{ py: 2, fontWeight: 700 }}>Assists</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {playerDetails.stats.stats?.length > 0 ? playerDetails.stats.stats.slice(0, 5).map((row, idx) => (
                          <TableRow key={idx}>
                            <TableCell sx={{ py: 2 }}>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>{row.competitionName}</Typography>
                              <Typography variant="caption" color="text.secondary">{row.seasonId}</Typography>
                            </TableCell>
                            <TableCell align="center">{row.appearances || 0}</TableCell>
                            <TableCell align="center" sx={{ color: 'primary.main', fontWeight: 700 }}>{row.goals || 0}</TableCell>
                            <TableCell align="center">{row.assists || 0}</TableCell>
                          </TableRow>
                        )) : (
                          <TableRow>
                            <TableCell colSpan={4} align="center" sx={{ py: 4, color: 'text.secondary', fontStyle: 'italic' }}>
                              No detailed performance data found.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            )}
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
}

export default App;
