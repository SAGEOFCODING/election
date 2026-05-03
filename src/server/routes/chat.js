const express = require('express');
const router = express.Router();
const { MAX_MESSAGE_LENGTH } = require('../utils/constants');

/**
 * Election knowledge base with comprehensive, factual, non-partisan answers
 * @type {Array<{keywords: string[], response: string}>}
 */
const KNOWLEDGE_BASE = [
  {
    keywords: ['register', 'registration', 'sign up', 'how to register'],
    response: 'To register to vote, visit vote.gov and select your state. Most states allow online registration. You typically need a valid ID, proof of residency, and must be at least 18 by Election Day. Registration deadlines vary by state — some allow same-day registration, while others require registration 15-30 days before an election.'
  },
  {
    keywords: ['election day', 'when is', 'date', 'next election', 'when do'],
    response: 'Federal general elections are held on the first Tuesday after the first Monday in November of even-numbered years. The next presidential election is November 5, 2024. Midterm elections occur in even years between presidential elections. Many states also hold primary elections earlier in the year, typically between February and June.'
  },
  {
    keywords: ['electoral college', 'how does electoral', 'electors'],
    response: 'The Electoral College consists of 538 electors. A candidate needs 270 electoral votes to win the presidency. Each state gets electors equal to its total congressional delegation (House + Senate). Most states use a winner-take-all system. Electors formally cast their votes in December after the general election, and Congress certifies the results in January.'
  },
  {
    keywords: ['id', 'identification', 'what id', 'voter id', 'need to bring', 'documents'],
    response: 'Voter ID requirements vary by state. Some states require photo ID (driver\'s license, passport), others accept non-photo ID (utility bill, bank statement), and some states have no ID requirement. Check your state\'s specific requirements at vote.org/voter-id-laws. If you lack required ID, most states offer provisional ballots.'
  },
  {
    keywords: ['absentee', 'mail', 'mail-in', 'vote by mail', 'postal'],
    response: 'Most states allow absentee or mail-in voting. Some states (like Oregon, Washington, and Colorado) conduct elections entirely by mail. In other states, you may need to request an absentee ballot in advance — deadlines vary. Mail your completed ballot early to ensure it arrives on time, or drop it at an official drop box.'
  },
  {
    keywords: ['early voting', 'vote early', 'before election day'],
    response: 'Early voting allows you to cast your ballot in person before Election Day. Currently, 47 states and D.C. offer some form of early voting. Early voting periods vary by state, typically starting 10-45 days before Election Day. Check your state\'s election office website for exact dates, hours, and locations.'
  },
  {
    keywords: ['polling', 'polling place', 'where to vote', 'location', 'where do i vote'],
    response: 'You can find your polling place by visiting vote.org/polling-place-locator or contacting your local election office. Your polling location is based on your registered address. Polls are typically open from 6-7 AM to 7-8 PM, though hours vary by state. You have the right to vote if you\'re in line when polls close.'
  },
  {
    keywords: ['ballot', 'what is on', 'whats on the ballot', 'races', 'measures'],
    response: 'A typical ballot includes federal races (President, Senate, House), state races (Governor, legislature), local offices (mayor, council, school board), ballot measures (propositions, referendums), and sometimes judicial retention votes. You can preview your specific ballot at ballotpedia.org by entering your address.'
  },
  {
    keywords: ['count', 'counted', 'how are votes', 'results', 'certification'],
    response: 'After polls close, election officials count ballots using a combination of electronic scanners and hand counting. Results are reported on election night but are unofficial. The official canvass process takes days to weeks, including counting provisional and late-arriving mail ballots. States certify final results, typically within 2-4 weeks after Election Day.'
  },
  {
    keywords: ['primary', 'primaries', 'caucus', 'caucuses', 'primary election'],
    response: 'Primary elections determine each party\'s candidates for the general election. There are open primaries (any voter can participate), closed primaries (only registered party members), and semi-open primaries. Caucuses are local meetings where voters discuss and vote for candidates. Primary dates vary by state, usually between February and June.'
  },
  {
    keywords: ['swing state', 'battleground', 'competitive'],
    response: 'Swing states (or battleground states) are states where either major party candidate has a reasonable chance of winning. These states often receive the most campaign attention and advertising. Historically, states like Ohio, Florida, Pennsylvania, Michigan, Wisconsin, Arizona, Georgia, and Nevada have been considered swing states, though this can change over time.'
  },
  {
    keywords: ['congress', 'senate', 'house', 'representative', 'senator'],
    response: 'Congress consists of two chambers: the Senate (100 members, 2 per state, 6-year terms) and the House of Representatives (435 members, proportional to population, 2-year terms). All House seats are up for election every 2 years. Senate seats are staggered so roughly one-third are elected every 2 years.'
  },
  {
    keywords: ['amendment', 'constitutional', 'constitution'],
    response: 'The U.S. Constitution can be amended through a process requiring two-thirds approval by both chambers of Congress, followed by ratification by three-fourths of state legislatures (38 states). There are currently 27 amendments. Several amendments directly relate to voting rights, including the 15th (race), 19th (sex), and 26th (age 18+).'
  },
  {
    keywords: ['volunteer', 'poll worker', 'help', 'get involved', 'campaign'],
    response: 'You can get involved by becoming a poll worker (contact your local election office), volunteering for voter registration drives, or serving as an election observer. Nonpartisan organizations like the League of Women Voters and Rock the Vote always welcome volunteers. Being a poll worker is a paid position in most jurisdictions.'
  },
  {
    keywords: ['gerrymandering', 'redistricting', 'districts'],
    response: 'Redistricting occurs every 10 years after the Census to redraw congressional and state legislative district boundaries. Gerrymandering is the manipulation of these boundaries to favor a particular party or group. Some states use independent commissions to draw districts, while others leave it to state legislatures.'
  },
  {
    keywords: ['rights', 'voter rights', 'suppression', 'intimidation'],
    response: 'Every eligible citizen has the right to vote free from intimidation or discrimination. Federal laws like the Voting Rights Act protect these rights. If you face issues at the polls, you can request a provisional ballot, contact the Election Protection Hotline (866-OUR-VOTE), or report problems to your state\'s Secretary of State office.'
  },
  {
    keywords: ['felony', 'felon', 'criminal record', 'incarcerated'],
    response: 'Voting rights for people with felony convictions vary significantly by state. In Maine and Vermont, people can vote even while incarcerated. Most states restore voting rights after completing a sentence. Some states require additional steps to restore rights. Check your state\'s specific laws at restoreyourvote.org.'
  },
  {
    keywords: ['age', 'how old', 'minimum age', 'young', 'youth'],
    response: 'You must be 18 years old by Election Day to vote in federal elections. However, many states allow 17-year-olds to vote in primaries if they will be 18 by the general election. Some localities allow 16 or 17-year-olds to vote in local elections. You can often pre-register to vote before turning 18.'
  },
  {
    keywords: ['overseas', 'military', 'abroad', 'uocava', 'foreign'],
    response: 'U.S. citizens living abroad and military personnel can vote using the Federal Post Card Application (FPCA) to request an absentee ballot. Register and request your ballot at FVAP.gov. The Uniformed and Overseas Citizens Absentee Voting Act (UOCAVA) protects your right to vote from anywhere in the world.'
  },
  {
    keywords: ['disability', 'accessible', 'accessibility', 'wheelchair', 'blind'],
    response: 'Federal law requires polling places to be accessible to voters with disabilities. Accommodations include wheelchair-accessible voting booths, audio ballots for visually impaired voters, and curbside voting. Many states also offer accessible absentee voting options. Contact your local election office in advance to arrange specific accommodations.'
  },
  {
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'sup', 'yo'],
    response: 'Hello! I\'m ElectionIQ, your election education assistant. I can help you with voter registration, election dates, polling locations, how the Electoral College works, mail-in voting, and much more. What would you like to know?'
  },
  {
    keywords: ['thank', 'thanks', 'appreciate'],
    response: 'You\'re welcome! Remember, every vote counts. If you have more questions about elections or voting, feel free to ask anytime. Stay informed and make your voice heard!'
  },
  {
    keywords: ['who should i vote for', 'which party', 'democrat', 'republican', 'best candidate'],
    response: 'As a non-partisan election education assistant, I don\'t recommend specific candidates or parties. I encourage you to research candidates\' positions on issues important to you. Visit ballotpedia.org to see who\'s on your ballot and compare their platforms. Making an informed choice is what matters most!'
  }
];

/**
 * Finds the best matching response from the knowledge base
 * @param {string} query - The user's question
 * @returns {string} The best matching response
 */
const findBestResponse = (query) => {
  const lowerQuery = query.toLowerCase();
  let bestMatch = null;
  let bestScore = 0;

  for (const entry of KNOWLEDGE_BASE) {
    let score = 0;
    for (const keyword of entry.keywords) {
      if (lowerQuery.includes(keyword.toLowerCase())) {
        score += keyword.length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  if (bestMatch && bestScore > 0) {
    return bestMatch.response;
  }

  return 'That\'s a great question! While I may not have the specific answer, I recommend checking vote.gov for official voter registration info, ballotpedia.org for ballot details, or contacting your local election office. Is there something else about elections I can help with?';
};

/**
 * @route POST /api/chat
 * @desc Smart election assistant using local knowledge base
 * @access Public
 */
router.post('/', async (req, res, next) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      const error = new Error('messages array is required');
      error.status = 400;
      throw error;
    }

    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
    if (!lastUserMessage || !lastUserMessage.content) {
      const error = new Error('No user message found');
      error.status = 400;
      throw error;
    }

    const query = String(lastUserMessage.content).slice(0, MAX_MESSAGE_LENGTH).trim();
    const reply = findBestResponse(query);

    res.json({ reply });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
