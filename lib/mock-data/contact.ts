export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  date: string
  read: boolean
  replied: boolean
  replyText?: string
}

export const mockContacts: ContactMessage[] = [
  {
    id: '1',
    name: 'Daniel Carter',
    email: 'daniel.carter@gmail.com',
    subject: 'Partnership enquiry',
    message: "Hi team, we run a sports apparel brand and would love to explore a sponsorship partnership with SportsPulse. Who is the best person to talk to?",
    date: '2026-06-11 09:20',
    read: false,
    replied: false,
  },
  {
    id: '2',
    name: 'Aisha Khan',
    email: 'aisha.k@outlook.com',
    subject: 'Story tip: local cricket academy',
    message: "There's an amazing youth cricket academy in Lahore producing national-level talent. I think it would make a great feature story. Happy to share contacts.",
    date: '2026-06-11 08:05',
    read: false,
    replied: false,
  },
  {
    id: '3',
    name: 'Marco Rossi',
    email: 'marco.rossi@libero.it',
    subject: 'Bug on the F1 standings page',
    message: "The 2025 constructor standings table isn't sorting correctly on mobile. Just wanted to flag it. Love the site otherwise!",
    date: '2026-06-10 17:42',
    read: true,
    replied: true,
  },
  {
    id: '4',
    name: 'Sophie Bennett',
    email: 'sophie.bennett@yahoo.com',
    subject: 'Press accreditation request',
    message: "I'm a freelance journalist covering the upcoming UCL Final. Could you advise on how to apply for press accreditation through SportsPulse?",
    date: '2026-06-10 14:10',
    read: true,
    replied: false,
  },
  {
    id: '5',
    name: 'James O’Connor',
    email: 'james.oconnor@gmail.com',
    subject: 'Feedback on newsletter',
    message: "The weekly football digest is fantastic. Any chance of adding a dedicated cricket edition too? Would subscribe instantly.",
    date: '2026-06-09 20:33',
    read: false,
    replied: false,
  },
  {
    id: '6',
    name: 'Lena Müller',
    email: 'lena.mueller@web.de',
    subject: 'Advertising rates',
    message: "Could you send over your current advertising rate card and audience demographics? Looking to run a campaign next quarter.",
    date: '2026-06-09 11:15',
    read: true,
    replied: true,
  },
]
