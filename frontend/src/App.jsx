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
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  ArrowForward as ArrowForwardIcon,
  EmojiEvents as TrophyIcon,
  Close as CloseIcon,
  TrendingUp as TrendIcon,
  Groups as GroupsIcon,
  MilitaryTech as CompetitionIcon,
} from '@mui/icons-material';
import { Tabs, Tab } from '@mui/material';
import {
  searchPlayers, getPlayerProfile, getPlayerMarketValue, getPlayerStats,
  searchClubs, getClubProfile, getClubPlayers,
  searchCompetitions, getCompetitionClubs
} from './services/api';
import PlayerDialog from './components/dialogs/PlayerDialog';
import ClubDialog from './components/dialogs/ClubDialog';
import CompetitionDialog from './components/dialogs/CompetitionDialog';

const formatMarketValue = (val) => {
  if (!val) return 'N/A';
  if (val >= 1000000) return `€${(val / 1000000).toFixed(2)}M`;
  if (val >= 1000) return `€${(val / 1000).toFixed(0)}K`;
  return `€${val}`;
};

function App() {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('players');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [details, setDetails] = useState(null);

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

  const handleViewDetails = async (id) => {
    setSelectedItem({ id, type: searchType });
    setModalLoading(true);
    setDetails(null);
    try {
      let data;
      if (searchType === 'players') {
        const [profile, market, stats] = await Promise.all([
          getPlayerProfile(id),
          getPlayerMarketValue(id),
          getPlayerStats(id)
        ]);
        data = { profile, market, stats };
      } else if (searchType === 'clubs') {
        const [profile, players] = await Promise.all([
          getClubProfile(id),
          getClubPlayers(id)
        ]);
        data = { profile, players };
      } else {
        const clubs = await getCompetitionClubs(id);
        data = { clubs };
      }
      setDetails(data);
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

          <Tabs
            value={searchType}
            onChange={(e, v) => { setSearchType(v); setResults([]); }}
            centered
            sx={{ mb: 4 }}
          >
            <Tab icon={<TrendIcon />} label="Players" value="players" />
            <Tab icon={<GroupsIcon />} label="Clubs" value="clubs" />
            <Tab icon={<CompetitionIcon />} label="Competitions" value="competitions" />
          </Tabs>

          {/* Search Bar */}
          <Box sx={{ maxWidth: 600, mx: 'auto' }}>
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
            <Typography sx={{ mt: 3, color: 'text.secondary' }}>Syncing with Transfermarkt...</Typography>
          </Box>
        )}

        {!loading && results.length > 0 && (
          <Grid container spacing={4} justifyContent="center">
            {results.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card
                  onClick={() => handleViewDetails(item.id)}
                  sx={{
                    cursor: 'pointer',
                    height: '100%',
                    borderRadius: 4,
                    transition: '0.3s',
                    '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 12px 24px rgba(251, 191, 36, 0.1)' }
                  }}
                >
                  <Box sx={{ position: 'relative', pt: '75%', bgcolor: 'rgba(255,255,255,0.02)' }}>
                    <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {searchType === 'players' ? (
                        <Avatar src={item.image} variant="square" sx={{ width: '100%', height: '100%', opacity: 0.8 }} />
                      ) : (
                        <Box sx={{ p: 4, opacity: 0.5 }}>
                          {searchType === 'clubs' ? <GroupsIcon sx={{ fontSize: 80 }} /> : <CompetitionIcon sx={{ fontSize: 80 }} />}
                        </Box>
                      )}
                    </Box>
                    {searchType === 'players' && (
                      <Chip
                        label={`Age: ${item.age || 'N/A'}`}
                        size="small"
                        sx={{ position: 'absolute', top: 16, right: 16, bgcolor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
                      />
                    )}
                  </Box>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" noWrap sx={{ fontWeight: 700 }}>{item.name}</Typography>

                    {searchType === 'players' && (
                      <>
                        <Typography variant="body2" color="primary" sx={{ fontWeight: 600, mb: 2 }}>{item.position || 'Professional'}</Typography>
                        <Divider sx={{ mb: 2, opacity: 0.1 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="caption" color="text.secondary">Market Value</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 700, color: 'primary.main' }}>{formatMarketValue(item.marketValue)}</Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                          {item.club?.name || 'No Club'}
                        </Typography>
                      </>
                    )}

                    {searchType === 'clubs' && (
                      <>
                        <Typography variant="body2" color="primary" sx={{ fontWeight: 600, mb: 1 }}>{item.country || 'International'}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          Squad size: {item.squadSize || 'N/A'}
                        </Typography>
                      </>
                    )}

                    {searchType === 'competitions' && (
                      <>
                        <Typography variant="body2" color="primary" sx={{ fontWeight: 600, mb: 1 }}>{item.continent || 'Global'}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          Clubs: {item.numberOfClubs || 'N/A'}
                        </Typography>
                      </>
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
                {selectedItem.type === 'competitions' && <CompetitionDialog details={details} />}
              </>
            )}
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
}

export default App;
