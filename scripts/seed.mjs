import { pool, query, queryOne } from '../lib/db.js';
import { slugify } from '../lib/slugs.js';

const inDays = (days, hour = 10, minute = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
};

const PROGRAMS = [
  {
    title: 'Sunday Church Service',
    slug: 'sunday-worship',
    summary: 'Worship, biblical teaching, prayer and fellowship for the whole family.',
    body: 'Our Sunday gathering includes worship, the Word, prayer and time together afterwards.',
    category: 'service',
    icon: 'church',
    meeting_day: 'Sunday',
    meeting_time: '8:00 AM — 12:00 PM',
    sort_order: 10,
  },
  {
    title: 'Evening Service',
    slug: 'evening-service',
    summary: "A midweek service of worship and God's Word.",
    body: 'Worship, teaching and prayer in the middle of the week. Bring your Bible and a friend.',
    category: 'service',
    icon: 'auto_stories',
    meeting_day: 'Wednesday',
    meeting_time: '6:00 PM — 8:00 PM',
    sort_order: 20,
  },
  {
    title: 'Kharis Night',
    slug: 'kharis-night',
    summary: 'A practical worship service — worship that trains us to worship.',
    body: 'An evening given to worship, teaching and ministry. Come expectant.',
    category: 'service',
    icon: 'local_fire_department',
    meeting_day: 'Thursday',
    meeting_time: '6:00 PM — 8:30 PM',
    sort_order: 30,
  },
  {
    title: 'Morning Glory',
    slug: 'morning-glory',
    summary: 'A short Saturday morning service to start the weekend on the right note.',
    body: 'One hour of worship and the Word before the weekend gets going.',
    category: 'service',
    icon: 'wb_sunny',
    meeting_day: 'Saturday',
    meeting_time: '6:00 AM — 7:00 AM',
    sort_order: 40,
  },
  {
    title: 'Youth Ministry',
    summary: 'A place for young people to grow in faith, build friendships and discover purpose.',
    body: 'Weekly meetings for teenagers with worship, teaching, mentoring and activities.',
    category: 'ministry',
    icon: 'diversity_3',
    sort_order: 50,
  },
  {
    title: "Children's Ministry",
    summary: "Helping children learn about God's Word in a safe, joyful and engaging environment.",
    body: 'Sunday school classes with Bible stories, memory verses and craft time.',
    category: 'ministry',
    icon: 'school',
    sort_order: 60,
  },
  {
    title: 'Community Outreach',
    summary: 'Serving our community and sharing the love of Christ through practical action.',
    body: 'Food support, visits to the sick and neighbourhood projects through the year.',
    category: 'outreach',
    icon: 'volunteer_activism',
    sort_order: 70,
  },
  {
    title: 'Small Groups',
    summary: 'Smaller communities where people can connect, study Scripture and grow together.',
    body: 'Home and workplace groups meeting through the week. Ask the pastoral team to be placed in one.',
    category: 'group',
    icon: 'groups',
    sort_order: 80,
  },
];

const EVENTS = [
  {
    title: 'Thanksgiving & Praise Night',
    summary: 'An evening of worship and thanksgiving for the whole church family.',
    body: 'Bring a friend. Worship, prayer and ministry time.',
    starts_at: inDays(14, 18),
    ends_at: inDays(14, 20, 30),
    venue: 'Church Auditorium',
    featured: true,
  },
  {
    title: 'Family & Community Day',
    summary: 'Open day for the neighbourhood with food, games and music.',
    body: 'Families from the community are welcome for games, meals and a short programme.',
    starts_at: inDays(30, 12),
    ends_at: inDays(30, 17),
    venue: 'Church Grounds',
  },
  {
    title: 'Youth Conference',
    summary: 'A weekend of teaching, worship and mentoring for young believers.',
    body: 'Guest speakers, workshops and evening sessions. Registration opens at the welcome desk.',
    starts_at: inDays(60, 9),
    ends_at: inDays(62, 16),
    venue: 'Church Auditorium',
    featured: true,
  },
  {
    title: 'Special Worship Service',
    summary: 'A gathering of worship and communion.',
    body: 'Held earlier this year; notes from the message are in the content section.',
    starts_at: inDays(-21, 10),
    ends_at: inDays(-21, 12),
    venue: 'Church Auditorium',
  },
];

const POSTS = [
  {
    title: 'Order of service for Thanksgiving & Praise Night',
    excerpt: 'What to expect on the evening and how to prepare.',
    kind: 'announcement',
    body:
      '## Programme\n\n- 6:00 PM — Welcome and worship\n- 6:45 PM — Message\n- 7:30 PM — Prayer and ministry\n- 8:15 PM — Fellowship\n\nDoors open at 5:30 PM. Child dedication requests should be sent to the pastoral team beforehand.',
  },
  {
    title: 'Sermon notes: walking in purpose',
    excerpt: 'A short summary of the message from our last special worship service.',
    kind: 'sermon',
    series: 'Walking in Purpose',
    speaker: 'Teaching team',
    body:
      'We looked at how faith grows through community.\n\n> We are a family rooted in Christ and growing together.\n\nThree takeaways:\n\n1. Keep gathering\n2. Keep praying\n3. Keep serving',
  },
  {
    title: 'Sermon notes: the God who gathers',
    excerpt: 'First message in the Walking in Purpose series.',
    kind: 'sermon',
    series: 'Walking in Purpose',
    speaker: 'Teaching team',
    body:
      'Before purpose there is belonging. We looked at Psalm 68:6 and what it means that God sets the solitary in families.',
  },
  {
    title: 'Weekly prayer list',
    excerpt: 'Requests the church is lifting up this week.',
    kind: 'devotional',
    body: 'Pray for the sick, for families in the neighbourhood, for the youth conference, and for our outreach partners.',
  },
];

const MEDIA = [
  { url: '/images/img-1.jpg', alt: 'Worship at church', caption: 'Worship', album: 'worship', sort_order: 10 },
  { url: '/images/img-2.jpg', alt: 'Church family', caption: 'Church Family', album: 'family', sort_order: 20 },
  { url: '/images/img-3.jpg', alt: 'Church logo', caption: 'Logo', album: 'general', sort_order: 90 },
];

const insert = async (table, row) => {
  const needsSlug = ['events', 'programs', 'posts'].includes(table) && !row.slug;
  const data = needsSlug ? { ...row, slug: slugify(row.title) } : row;
  const columns = Object.keys(data);
  const placeholders = columns.map((_, index) => `$${index + 1}`).join(', ');
  const conflict = table === 'media' ? null : 'slug';
  await query(
    `insert into ${table} (${columns.join(', ')}) values (${placeholders})
     ${conflict ? `on conflict (${conflict}) do nothing` : ''}`,
    columns.map((name) => data[name]),
  );
};

const programCount = await queryOne('select count(*)::int as total from programs');
if (programCount.total > 0) {
  console.log('Content already present — seeding skipped.');
} else {
  for (const program of PROGRAMS) await insert('programs', program);

  for (const event of EVENTS) await insert('events', event);

  const thanksgiving = await queryOne("select id::int as id from events where title = $1", [
    'Thanksgiving & Praise Night',
  ]);
  const pastEvent = await queryOne('select id::int as id from events where title = $1', [
    'Special Worship Service',
  ]);

  await insert('posts', { ...POSTS[0], slug: 'order-of-service-thanksgiving-praise-night', event_id: thanksgiving?.id ?? null, published_at: inDays(10, 9) });
  await insert('posts', { ...POSTS[1], slug: 'sermon-notes-walking-in-purpose', event_id: pastEvent?.id ?? null, published_at: inDays(-21, 13) });
  await insert('posts', { ...POSTS[2], slug: 'sermon-notes-the-god-who-gathers', event_id: pastEvent?.id ?? null, published_at: inDays(-28, 13) });
  await insert('posts', { ...POSTS[3], slug: 'weekly-prayer-list', published_at: inDays(2, 8) });

  for (const item of MEDIA) await insert('media', item);

  console.log('Seeded programs, events, content and gallery.');
}

await pool.end();
