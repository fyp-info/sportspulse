export type NotifCategory = 'sports' | 'blog' | 'legal' | 'system'

export interface Notification {
  id: string
  category: NotifCategory
  title: string
  body: string
  time: string
  href: string
  read: boolean
}

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    category: 'legal',
    title: 'Privacy Policy Updated',
    body: 'New sections on data retention and session cookies were added.',
    time: '2 min ago',
    href: '/privacy',
    read: false,
  },
  {
    id: 'n2',
    category: 'legal',
    title: 'Terms of Service Updated',
    body: 'Section 3 (Acceptable Use) was revised with clearer language.',
    time: '18 min ago',
    href: '/terms',
    read: false,
  },
  {
    id: 'n3',
    category: 'blog',
    title: 'New Article Published',
    body: '"Hamilton\'s Comeback: Mercedes Fires Back in Monaco" is now live.',
    time: '1 hour ago',
    href: '/blog',
    read: false,
  },
  {
    id: 'n4',
    category: 'sports',
    title: 'F1 Race Result: Monaco GP',
    body: 'Lewis Hamilton wins the Monaco Grand Prix ahead of Verstappen.',
    time: '3 hours ago',
    href: '/sports/formula-1',
    read: false,
  },
  {
    id: 'n5',
    category: 'sports',
    title: 'Premier League Standings Updated',
    body: 'Manchester City reclaims top spot after a 3–1 win over Arsenal.',
    time: '5 hours ago',
    href: '/sports/football',
    read: false,
  },
  {
    id: 'n6',
    category: 'blog',
    title: 'New Article Published',
    body: '"India\'s T20 World Cup Squad: Who Makes the Cut?" is now live.',
    time: '8 hours ago',
    href: '/blog',
    read: true,
  },
  {
    id: 'n7',
    category: 'sports',
    title: 'Cricket: ICC Rankings Updated',
    body: 'India moves to #1 in Test rankings after a series win over Australia.',
    time: '1 day ago',
    href: '/sports/cricket',
    read: true,
  },
  {
    id: 'n8',
    category: 'sports',
    title: 'F1 Driver Standings Updated',
    body: 'Max Verstappen extends championship lead after the Spanish GP.',
    time: '1 day ago',
    href: '/sports/formula-1',
    read: true,
  },
  {
    id: 'n9',
    category: 'blog',
    title: 'New Article Published',
    body: '"Premier League Top Scorers: Mid-Season Review" is now live.',
    time: '2 days ago',
    href: '/blog',
    read: true,
  },
  {
    id: 'n10',
    category: 'system',
    title: 'Security Alert',
    body: '3 new suspicious IP addresses have been flagged for review.',
    time: '2 days ago',
    href: '/dashboard/superadmin/suspicious-ips',
    read: true,
  },
]
