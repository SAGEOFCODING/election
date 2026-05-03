const express = require('express');
const router = express.Router();

/**
 * Local election news and resource database
 * Provides real, curated election education content without external API
 * @type {Array<{title: string, snippet: string, link: string, source: string, category: string[]}>}
 */
const ELECTION_DATA = [
  {
    title: 'Voter Registration Deadlines by State — 2024 Guide',
    snippet: 'Complete state-by-state guide to voter registration deadlines. Some states offer same-day registration, while others require registration 30 days before Election Day. Find your deadline and register today.',
    link: 'https://www.vote.org/voter-registration-deadlines/',
    source: 'vote.org',
    category: ['all', 'Voting Rights', 'registration']
  },
  {
    title: 'How the Electoral College Works — A Complete Explainer',
    snippet: 'The Electoral College consists of 538 electors. To win the presidency, a candidate must receive at least 270 electoral votes. Learn how electors are chosen, how they vote, and what happens if no candidate reaches 270.',
    link: 'https://www.archives.gov/electoral-college/about',
    source: 'archives.gov',
    category: ['all', 'electoral college']
  },
  {
    title: 'Find Your Polling Place — Official Locator Tool',
    snippet: 'Enter your address to find your designated polling location, including hours of operation, accessibility information, and what to bring on Election Day.',
    link: 'https://www.vote.org/polling-place-locator/',
    source: 'vote.org',
    category: ['all', 'Polling Places']
  },
  {
    title: 'Understanding Mail-In and Absentee Voting',
    snippet: 'Learn the difference between mail-in and absentee voting, how to request a ballot, key deadlines, and how to track your ballot status. Available in all 50 states with varying rules.',
    link: 'https://www.usa.gov/absentee-voting',
    source: 'usa.gov',
    category: ['all', 'Voting Rights', 'mail-in']
  },
  {
    title: 'Voter ID Requirements — What You Need to Vote',
    snippet: 'Voter ID laws vary significantly by state. Some require photo identification, others accept non-photo ID, and several states have no ID requirement at all. Check your state requirements here.',
    link: 'https://www.vote.org/voter-id-laws/',
    source: 'vote.org',
    category: ['all', 'Voting Rights', 'id']
  },
  {
    title: 'Sample Ballot Lookup — See What\'s on Your Ballot',
    snippet: 'Preview your personalized ballot before Election Day. See every race, candidate, and ballot measure you\'ll be voting on, from federal offices to local school board positions.',
    link: 'https://ballotpedia.org/Sample_Ballot_Lookup',
    source: 'ballotpedia.org',
    category: ['all', 'Ballot Measures', 'Candidates']
  },
  {
    title: '2024 Congressional Races — Key Senate and House Contests',
    snippet: 'Track competitive Senate and House races across the country. See candidate profiles, campaign finance data, polling averages, and key issues in the most closely watched districts.',
    link: 'https://ballotpedia.org/United_States_Congress_elections,_2024',
    source: 'ballotpedia.org',
    category: ['all', 'Candidates']
  },
  {
    title: 'Early Voting Dates and Locations by State',
    snippet: '47 states and D.C. offer early voting. Find your state\'s early voting period, hours, and locations. Early voting reduces wait times and gives you flexibility to vote on your schedule.',
    link: 'https://www.vote.org/early-voting-calendar/',
    source: 'vote.org',
    category: ['all', 'Polling Places', 'early voting']
  },
  {
    title: 'Understanding Ballot Measures and Propositions',
    snippet: 'Ballot measures let voters decide on state and local laws directly. Learn how to research propositions, understand ballot language, and make informed decisions on each measure.',
    link: 'https://ballotpedia.org/Ballot_measures',
    source: 'ballotpedia.org',
    category: ['all', 'Ballot Measures']
  },
  {
    title: 'Voting Rights Act — History and Current Protections',
    snippet: 'The Voting Rights Act of 1965 prohibits racial discrimination in voting. Learn about its key provisions, landmark Supreme Court cases, and how it continues to shape election law today.',
    link: 'https://www.justice.gov/crt/history-federal-voting-rights-laws',
    source: 'justice.gov',
    category: ['all', 'Voting Rights']
  },
  {
    title: 'How to Become a Poll Worker — Serve Your Community',
    snippet: 'Poll workers are essential to running elections. Most jurisdictions pay poll workers and provide training. Learn how to sign up, what the job involves, and why it matters.',
    link: 'https://www.eac.gov/voters/become-poll-worker',
    source: 'eac.gov',
    category: ['all', 'Polling Places', 'volunteer']
  },
  {
    title: 'Presidential Primary Calendar — Dates and Delegate Counts',
    snippet: 'Complete schedule of presidential primaries and caucuses for all 50 states. Track delegate allocations, understand threshold rules, and see how candidates accumulate delegates.',
    link: 'https://ballotpedia.org/Presidential_election,_2024',
    source: 'ballotpedia.org',
    category: ['all', 'Candidates', 'primary']
  },
  {
    title: 'Voting with a Disability — Your Rights and Accommodations',
    snippet: 'Federal law guarantees accessible voting for all citizens with disabilities. Learn about accommodations including curbside voting, audio ballots, accessible machines, and how to request assistance.',
    link: 'https://www.eac.gov/voters/voters-with-disabilities',
    source: 'eac.gov',
    category: ['all', 'Voting Rights', 'accessibility']
  },
  {
    title: 'Campaign Finance — How Political Campaigns Are Funded',
    snippet: 'Understand where campaign money comes from, contribution limits, the role of PACs and Super PACs, and how to look up who is donating to candidates in your district.',
    link: 'https://www.fec.gov/introduction-campaign-finance/',
    source: 'fec.gov',
    category: ['all', 'Candidates', 'finance']
  },
  {
    title: 'Gerrymandering and Redistricting — How Districts Are Drawn',
    snippet: 'After each Census, congressional districts are redrawn. Learn how redistricting works, what gerrymandering means, and how it affects representation and election outcomes in your state.',
    link: 'https://ballotpedia.org/Redistricting',
    source: 'ballotpedia.org',
    category: ['all', 'Ballot Measures', 'redistricting']
  },
  {
    title: 'Election Security — How Your Vote Is Protected',
    snippet: 'Elections use multiple layers of security including paper trails, audits, bipartisan observers, and cybersecurity measures. Learn how election officials ensure the integrity of every vote.',
    link: 'https://www.cisa.gov/election-security',
    source: 'cisa.gov',
    category: ['all', 'Voting Rights', 'security']
  },
  {
    title: 'Overseas and Military Voting — How to Vote from Abroad',
    snippet: 'U.S. citizens abroad and active military members can vote using the Federal Post Card Application. Register, request your absentee ballot, and return it before deadlines.',
    link: 'https://www.fvap.gov/',
    source: 'fvap.gov',
    category: ['all', 'Voting Rights', 'military']
  },
  {
    title: 'State and Local Elections — Why Down-Ballot Races Matter',
    snippet: 'State legislators, governors, mayors, school board members, and judges directly impact your daily life. Learn why these races are important and how to research local candidates.',
    link: 'https://ballotpedia.org/State_legislative_elections',
    source: 'ballotpedia.org',
    category: ['all', 'Candidates', 'local']
  }
];

/**
 * Searches the local election data with keyword matching and category filtering
 * @param {string} query - Search query string
 * @param {string} filter - Category filter
 * @returns {Array} Matching search results
 */
function searchLocalData(query, filter) {
  const lowerQuery = query.toLowerCase();
  const keywords = lowerQuery.split(/\s+/).filter(w => w.length > 1);

  let results = ELECTION_DATA.filter(item => {
    const matchesFilter = !filter || filter === 'all' || 
      item.category.some(c => c.toLowerCase() === filter.toLowerCase());
    
    if (!matchesFilter) return false;

    const searchText = `${item.title} ${item.snippet} ${item.category.join(' ')}`.toLowerCase();
    return keywords.some(kw => searchText.includes(kw));
  });

  /* Sort by relevance: more keyword hits = higher rank */
  results.sort((a, b) => {
    const textA = `${a.title} ${a.snippet}`.toLowerCase();
    const textB = `${b.title} ${b.snippet}`.toLowerCase();
    const scoreA = keywords.reduce((s, kw) => s + (textA.includes(kw) ? 1 : 0), 0);
    const scoreB = keywords.reduce((s, kw) => s + (textB.includes(kw) ? 1 : 0), 0);
    return scoreB - scoreA;
  });

  return results.slice(0, 8).map(item => ({
    title: item.title,
    snippet: item.snippet,
    link: item.link,
    source: item.source,
    thumbnail: null
  }));
}

/**
 * GET /api/search
 * Searches election resources using local data (no API key required)
 * @param {string} req.query.q - Search query
 * @param {string} req.query.filter - Category filter
 * @returns {Object} { items: Array }
 */
router.get('/', async (req, res) => {
  try {
    const { q, filter } = req.query;
    if (!q || q.trim().length < 2) {
      return res.status(400).json({ error: 'Query too short' });
    }

    const items = searchLocalData(q.trim(), filter);
    res.json({ items });
  } catch (err) {
    console.error('Search error:', err.message);
    res.status(500).json({ error: 'Search unavailable', items: [] });
  }
});

module.exports = router;
