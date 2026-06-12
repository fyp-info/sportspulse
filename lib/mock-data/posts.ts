export type Sport = 'Football' | 'Basketball' | 'Formula-1' | 'Cricket'
export type PostStatus = 'published' | 'draft' | 'scheduled'

export interface Post {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  sport: Sport
  category: string
  author: string
  authorEmail: string
  publishedAt: string
  image: string
  views: number
  likes: number
  shares: number
  status: PostStatus
  featured: boolean
  tags: string[]
}

export interface Comment {
  id: string
  postId: string
  author: string
  content: string
  date: string
  status: 'approved' | 'pending' | 'rejected'
  reported: boolean
}

export const mockPosts: Post[] = [
  {
    id: '1',
    slug: 'ucl-final-preview-real-madrid-vs-bayern',
    title: 'UCL Final Preview: Real Madrid vs Bayern Munich — The Clash of Titans',
    excerpt: 'Two of European football\'s giants face off in a historic Champions League final. Here\'s everything you need to know.',
    content: `The UEFA Champions League final is set to deliver one of the most anticipated clashes in recent memory as Real Madrid face Bayern Munich at the Allianz Arena in Munich.\n\nReal Madrid, 15-time European champions, come into this final riding high on the back of a dominant La Liga campaign. Their attack, led by Kylian Mbappé and Vinicius Jr., has been unstoppable this season.\n\nBayern Munich, making their first UCL final since 2001, have been electrifying under Jürgen Klopp. Robert Lewandowski and Kingsley Coman have been the creative heartbeat of a team that has grown into genuine European contenders.\n\nThis clash promises tactics, passion, and world-class football. Don't miss it.`,
    sport: 'Football',
    category: 'Champions League',
    author: 'sarah_editor',
    authorEmail: 'sarah@sportspulse.com',
    publishedAt: '2026-06-10',
    image: '/madrid-bayern.jpg',
    views: 24500,
    likes: 1820,
    shares: 430,
    status: 'published',
    featured: true,
    tags: ['UCL', 'Real Madrid', 'Arsenal', 'Final'],
  },
  {
    id: '2',
    slug: 'verstappen-wins-monaco-gp',
    title: 'Verstappen Storms to Monaco GP Victory in Dominant Display',
    excerpt: 'Max Verstappen delivered a masterclass around the streets of Monaco to claim his third consecutive Monaco Grand Prix victory.',
    content: `Max Verstappen put on a typically dominant display at the Circuit de Monaco on Sunday, leading from pole position to take a commanding victory and extend his Formula 1 championship lead.\n\nLando Norris made it a McLaren 1-2 on the road but was handed a five-second penalty for a pit lane infringement, dropping him to fourth. Charles Leclerc finished second for Ferrari, while Carlos Sainz completed the podium in third.\n\nThe result extends Verstappen's championship lead to 45 points over Norris with eight races remaining in the season.`,
    sport: 'Formula-1',
    category: 'Race Results',
    author: 'sarah_editor',
    authorEmail: 'sarah@sportspulse.com',
    publishedAt: '2026-06-09',
    image: '/verstappen.jpg',
    views: 18300,
    likes: 1240,
    shares: 280,
    status: 'published',
    featured: true,
    tags: ['F1', 'Monaco', 'Verstappen', 'Race Results'],
  },
  {
    id: '3',
    slug: 'boston-celtics-nba-finals-game-1',
    title: 'Celtics Edge Nuggets in Thrilling NBA Finals Game 1',
    excerpt: 'Jayson Tatum delivered a 38-point masterpiece as the Boston Celtics survived a Denver comeback to win Game 1.',
    content: `Jayson Tatum was nothing short of spectacular as the Boston Celtics defeated the Denver Nuggets 112-104 in a pulsating NBA Finals opener at TD Garden.\n\nTatum finished with 38 points, 9 rebounds, and 8 assists, repeatedly rising to the challenge when Denver threatened to wrestle control. Jaylen Brown added 22 points in a crucial supporting role.\n\nNikola Jokić was outstanding for Denver with a 31-point triple-double but it wasn't enough as the Celtics' depth ultimately proved decisive in the fourth quarter.`,
    sport: 'Basketball',
    category: 'NBA Finals',
    author: 'sarah_editor',
    authorEmail: 'sarah@sportspulse.com',
    publishedAt: '2026-06-08',
    image: '/Celtics.jfif',
    views: 15600,
    likes: 980,
    shares: 215,
    status: 'published',
    featured: true,
    tags: ['NBA', 'Finals', 'Celtics', 'Nuggets'],
  },
  {
    id: '4',
    slug: 'india-england-lords-test-day-3',
    title: 'India Take Control at Lord\'s: Kohli\'s Century Sets Up Victory Push',
    excerpt: 'Virat Kohli\'s majestic 127 put India firmly in command on Day 3 of the second Test at Lord\'s Cricket Ground.',
    content: `Virat Kohli turned back the clock with a stunning century at the Home of Cricket on Day 3 of the second Test between India and England.\n\nKohli, batting with his trademark elegance and intensity, crafted a chanceless 127 that saw India extend their first-innings lead to 287 runs. His partnership with Shubman Gill (89) was the cornerstone of India's dominance.\n\nJasprit Bumrah had earlier taken 5/42 to bowl England out for 234, and with two days remaining, India are strong favourites to level the series.`,
    sport: 'Cricket',
    category: 'Test Series',
    author: 'sarah_editor',
    authorEmail: 'sarah@sportspulse.com',
    publishedAt: '2026-06-11',
    image: '/kholi.jpg',
    views: 12400,
    likes: 760,
    shares: 180,
    status: 'published',
    featured: true,
    tags: ['Cricket', 'India', 'England', 'Test', "Lord's"],
  },
  {
    id: '5',
    slug: 'premier-league-title-race-analysis',
    title: 'Premier League Title Race: Who Will Lift the Trophy?',
    excerpt: 'With four games to go, three clubs are separated by just four points. Our analysts break down every scenario.',
    content: `The Premier League title race has reached its dramatic climax with Manchester City, Arsenal, and Liverpool all locked in a three-way battle with just four matches remaining.\n\nCity sit at the summit with 71 points, ahead of Arsenal on 67 and Liverpool on 66. Every game is a potential title-decider, and the run-ins could scarcely be more different.\n\nCity face two of the bottom six clubs but also travel to fourth-placed Aston Villa. Arsenal have a tough trip to Chelsea before a home game that could define their season. Liverpool, the dark horses, have perhaps the most favourable run-in of all three.`,
    sport: 'Football',
    category: 'Premier League',
    author: 'sarah_editor',
    authorEmail: 'sarah@sportspulse.com',
    publishedAt: '2026-06-07',
    image: '',
    views: 31200,
    likes: 2150,
    shares: 520,
    status: 'published',
    featured: false,
    tags: ['Premier League', 'Title Race', 'Man City', 'Arsenal', 'Liverpool'],
  },
  {
    id: '6',
    slug: 'f1-season-preview-2027',
    title: '2027 F1 Season Preview: New Regulations, New Battles',
    excerpt: 'With major regulation changes on the horizon, we preview what to expect from the upcoming Formula 1 season.',
    content: `The 2027 Formula 1 season promises to be a watershed moment for the sport as new technical regulations come into force, reshaping the competitive order for years to come.\n\nThe switch to new power unit regulations, combined with revised aerodynamic rules, could shake up the grid in ways not seen since 2022. Red Bull, Ferrari, and Mercedes are all expected to be genuine title contenders.`,
    sport: 'Formula-1',
    category: 'Season Preview',
    author: 'sarah_editor',
    authorEmail: 'sarah@sportspulse.com',
    publishedAt: '2026-06-05',
    image: '',
    views: 9800,
    likes: 620,
    shares: 140,
    status: 'draft',
    featured: false,
    tags: ['F1', '2027', 'Season Preview', 'Regulations'],
  },
]

export const mockComments: Comment[] = [
  { id: '1', postId: '1', author: 'john_doe', content: 'What a match this is going to be! COYG! 🔴', date: '2026-06-10', status: 'approved', reported: false },
  { id: '2', postId: '1', author: 'footyfan22', content: 'Real Madrid will destroy them lol, 3-0 easy.', date: '2026-06-10', status: 'approved', reported: false },
  { id: '3', postId: '1', author: 'spam_account', content: 'Check out this betting site!!! FREE MONEY', date: '2026-06-10', status: 'pending', reported: true },
  { id: '4', postId: '2', author: 'f1fanatic', content: 'Verstappen is just on another level right now.', date: '2026-06-09', status: 'approved', reported: false },
  { id: '5', postId: '3', author: 'hoopshead', content: 'Tatum for Finals MVP! Let\'s go Celtics!', date: '2026-06-08', status: 'approved', reported: false },
  { id: '6', postId: '4', author: 'cricketlover', content: 'King Kohli back to his best! Magnificent innings.', date: '2026-06-11', status: 'pending', reported: false },
]