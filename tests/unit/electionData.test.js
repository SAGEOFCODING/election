const { buildTimeline } = require('../../src/server/services/electionData');

describe('Election Data Service', () => {
  describe('buildTimeline - comprehensive', () => {
    test('returns exactly 8 phases', async () => {
      const timeline = await buildTimeline();
      expect(timeline.events).toHaveLength(8);
    });
    
    test('each phase has required keys', async () => {
      const timeline = await buildTimeline();
      timeline.events.forEach((phase) => {
        expect(phase).toHaveProperty('id');
        expect(phase).toHaveProperty('title');
        expect(phase).toHaveProperty('description');
        expect(phase).toHaveProperty('date');
        expect(phase).toHaveProperty('formattedDate');
      });
    });
    
    test('phases are in chronological order', async () => {
      const timeline = await buildTimeline();
      const eventsWithDates = timeline.events.filter(e => !e.date.includes('Ongoing'));
      for (let i = 1; i < eventsWithDates.length; i++) {
        const dateA = new Date(eventsWithDates[i - 1].date).getTime();
        const dateB = new Date(eventsWithDates[i].date).getTime();
        expect(dateB).toBeGreaterThanOrEqual(dateA);
      }
    });
    
    test('no phase has empty title', async () => {
      const timeline = await buildTimeline();
      timeline.events.forEach((p) => expect(p.title.length).toBeGreaterThan(0));
    });
    
    test('no phase has empty description', async () => {
      const timeline = await buildTimeline();
      timeline.events.forEach((p) => expect(p.description.length).toBeGreaterThan(0));
    });
  });
});
