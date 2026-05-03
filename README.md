# ElectionIQ — Interactive Election Education Assistant

## Chosen Vertical
Civic Education & Voter Empowerment

## Approach & Logic
ElectionIQ is designed with a modular architecture separating the Express.js backend from the Vanilla JS/CSS frontend. The UI focuses on premium Gen-Z aesthetics, featuring dark mode, glassmorphism, and responsive CSS variables. Accessibility is a first-class citizen, strictly adhering to WCAG 2.1 AA standards with semantic HTML, ARIA labels, and keyboard navigability. The logic relies on Google Services to provide reliable mapping, search, authentication, and personalized calendar reminders, while Firebase Firestore stores persistent user state and generic election content.

## How It Works
1. **Sign In**: Users click "Sign in with Google" to authenticate via Firebase. Their session token is securely passed to the backend.
2. **Explore Timeline**: An interactive timeline highlights the current phase of the election based on the current date, with an option to add phases to Google Calendar.
3. **Chat Assistant**: A chat widget provides rule-based (mocked LLM) responses to quick questions, demonstrating persistent messaging UI.
4. **Quiz**: Users test their knowledge in a timed interactive quiz, viewing immediate feedback and saving their score.
5. **Find Polling Place**: Entering an address utilizes the Google Maps component.
6. **Sync Calendar**: Registration deadlines and election days are synced seamlessly to the user's Google Calendar.

## Google Services Used
1. **Firebase Authentication**: Secure Google Sign-In and JWT verification.
2. **Firebase Firestore**: Persistent data storage for user profiles, timelines, and quizzes.
3. **Google Maps JavaScript API**: Polling place locator map embeds.
4. **Google Calendar API**: Election date reminders.
5. **Google Custom Search JSON API**: Election news queries.
6. **Google Analytics 4**: Usage tracking for quizzes, searches, and calendar interactions.

## Setup Instructions

### Environment Variables
Copy `.env.example` to `.env` and fill out the details:
```bash
cp .env.example .env
```

### Installation & Running
```bash
npm install
npm run seed
npm run dev
```
Access the application at `http://localhost:3000`.

### Testing
```bash
npm test
npm run test:e2e
```

## Assumptions
- The "LLM Chat Assistant" logic currently uses a mock delay and rule-based parsing due to lack of a provided LLM API key.
- Google Maps and Calendar operations default to a mocked success state if no valid API keys are supplied in the `.env` file, ensuring the app runs flawlessly for demonstration.
- Mock initial data is populated via `npm run seed`.
