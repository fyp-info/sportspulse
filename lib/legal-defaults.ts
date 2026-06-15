// Shared legal content model + defaults, used by the editor, the API, and the
// public /privacy and /terms pages so they always agree on shape.

export type LegalItem = { id: string; label: string; text: string }
export type LegalSection = { id: string; title: string; intro: string; items: LegalItem[] }
export type LegalContent = { heroDescription: string; commitment: string; sections: LegalSection[] }

export type LegalType = 'privacy' | 'terms'

export const PRIVACY_DEFAULT: LegalContent = {
  heroDescription: "We only collect what we need, we protect it carefully, and we never sell it. Here's the full picture.",
  commitment: 'SportsPulse is a sports news and statistics platform. This policy explains what personal information we collect when you register, sign in, or contact us — and exactly how that information is used and protected. We do not sell, rent, or trade your data to third parties.',
  sections: [
    {
      id: 'p1', title: '1. What We Collect',
      intro: 'We collect three categories of information depending on how you interact with the platform.',
      items: [
        { id: 'p1i1', label: 'Account information', text: 'When you register, we collect your username, email address, and password (stored as a cryptographic hash — never plain text). You may optionally add a bio and avatar to your profile.' },
        { id: 'p1i2', label: 'Security & session data', text: 'To protect your account we log each sign-in attempt with a timestamp, IP address, approximate location, and device / browser type. This history is visible to you on your Profile page and is used to detect unauthorised access. IP addresses that show repeated suspicious behaviour are flagged for review by our security team.' },
        { id: 'p1i3', label: 'Contact & newsletter', text: 'If you submit the contact form we collect your name, email, subject, and message so our team can respond. If you subscribe to the newsletter we store your email address for that purpose only.' },
      ],
    },
    {
      id: 'p2', title: '2. How We Use Your Data',
      intro: 'Your data is used only for the purposes listed below.',
      items: [
        { id: 'p2i1', label: 'Providing the service', text: 'Your username and email are used to create and identify your account, display your profile, and let you sign in.' },
        { id: 'p2i2', label: 'Security monitoring', text: 'Login history and IP data help us detect suspicious activity, enforce account lockout policies, and protect the platform from abuse.' },
        { id: 'p2i3', label: 'Two-factor authentication', text: 'If you enable 2FA, we email a one-time code to verify your identity when you sign in.' },
        { id: 'p2i4', label: 'Responding to enquiries', text: 'Contact form submissions are used solely to reply to your message. They are not used for marketing without your consent.' },
        { id: 'p2i5', label: 'Newsletter', text: 'Your email is used to send the newsletter you subscribed to. You can unsubscribe at any time.' },
        { id: 'p2i6', label: 'Platform improvement', text: 'Aggregated, anonymised usage patterns may be reviewed to improve features. This data cannot be traced back to individuals.' },
      ],
    },
    {
      id: 'p3', title: '3. How We Protect Your Data',
      intro: 'Security is built into every layer of the platform — not added as an afterthought.',
      items: [
        { id: 'p3i1', label: 'Passwords never stored in plain text', text: 'Your password is transformed into an irreversible cryptographic hash with a unique per-user salt before it is saved.' },
        { id: 'p3i2', label: 'Signed & expiring session tokens', text: 'Sessions are backed by cryptographically signed tokens with a built-in expiry. Tokens are revoked immediately on logout.' },
        { id: 'p3i3', label: 'Account lockout', text: 'Repeated failed login attempts are recorded and flagged to protect your account from brute-force access.' },
        { id: 'p3i4', label: 'Role-based access control', text: 'Staff roles (Editor, Moderator, Admin, Super Admin) each carry strictly limited permissions. No role can access data beyond its defined scope.' },
        { id: 'p3i5', label: 'Input validation', text: 'All user input is validated and sanitised before it reaches our data layer to prevent injection-based attacks.' },
        { id: 'p3i6', label: 'Audit logging', text: 'Privileged actions are recorded with a timestamp so unusual activity can be investigated.' },
      ],
    },
    {
      id: 'p4', title: '4. Sessions & Cookies',
      intro: 'We use cookies only for essential platform operation.',
      items: [
        { id: 'p4i1', label: '', text: 'SportsPulse uses a session cookie to keep you signed in between page loads. This cookie holds your signed authentication token and is cleared when you log out or your session expires.' },
        { id: 'p4i2', label: '', text: 'We do not use advertising cookies, tracking pixels, or third-party analytics cookies. No cookie data is shared with advertisers or data brokers.' },
      ],
    },
    {
      id: 'p5', title: '5. Your Rights & Choices',
      intro: 'You are in control of your data.',
      items: [
        { id: 'p5i1', label: 'View & update your data', text: 'You can review and edit your username, email, and bio at any time from your Profile page.' },
        { id: 'p5i2', label: 'Review login history', text: 'Your full sign-in history — including IP addresses and devices — is visible on your Profile page under "Login History".' },
        { id: 'p5i3', label: 'Unsubscribe from the newsletter', text: 'Every newsletter email includes an unsubscribe link. You can also contact us directly to be removed.' },
      ],
    },
    {
      id: 'p6', title: '6. Data Retention',
      intro: 'We keep your data only for as long as it is needed.',
      items: [
        { id: 'p6i1', label: '', text: 'Account information is retained for as long as your account is active. Login history and security logs are retained for up to 12 months to support incident investigation, after which they are purged.' },
        { id: 'p6i2', label: '', text: 'When you delete your account, your profile, login history, and personal information are permanently removed. Contact form messages may be retained for up to 90 days for correspondence purposes.' },
      ],
    },
    {
      id: 'p7', title: "7. Children's Privacy",
      intro: 'SportsPulse is not directed at children under 13.',
      items: [
        { id: 'p7i1', label: '', text: 'You must be at least 13 years old to create an account. We do not knowingly collect personal information from anyone under 13. If we become aware that an account belongs to a child under 13, we will delete it promptly.' },
      ],
    },
    {
      id: 'p8', title: '8. Changes to This Policy',
      intro: 'We will tell you when this policy changes.',
      items: [
        { id: 'p8i1', label: '', text: 'We may update this Privacy Policy from time to time. When we do, the "Last updated" date at the top of this page will change. If the changes are significant, we will notify signed-in users.' },
      ],
    },
  ],
}

export const TERMS_DEFAULT: LegalContent = {
  heroDescription: 'The ground rules for using SportsPulse. Please read them carefully — using the platform means you agree to them.',
  commitment: 'These terms govern your use of SportsPulse. By accessing or using the platform you agree to them. If you have questions about anything here, our team is happy to help.',
  sections: [
    {
      id: 't1', title: '1. Acceptance of Terms', intro: '',
      items: [
        { id: 't1i1', label: '', text: 'By accessing or using SportsPulse, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree with any part of these terms, please do not use the platform.' },
        { id: 't1i2', label: '', text: 'We may update these terms from time to time. Continued use of SportsPulse after changes are posted constitutes your acceptance of the revised terms.' },
      ],
    },
    {
      id: 't2', title: '2. Using Your Account', intro: '',
      items: [
        { id: 't2i1', label: '', text: 'You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account.' },
        { id: 't2i2', label: '', text: 'You agree to provide accurate information when registering and to keep it up to date. Accounts may be suspended after repeated failed login attempts as a security precaution.' },
        { id: 't2i3', label: '', text: 'You must be at least 13 years old to create an account on SportsPulse.' },
      ],
    },
    {
      id: 't3', title: '3. Acceptable Use', intro: '',
      items: [
        { id: 't3i1', label: '', text: 'You agree not to misuse the platform — including attempting unauthorized access, probing for security vulnerabilities, scraping content at scale, or interfering with normal operation.' },
        { id: 't3i2', label: '', text: 'Any attempt at privilege escalation, authentication bypass, or tampering with session tokens is strictly prohibited and may result in immediate account termination and legal action.' },
        { id: 't3i3', label: '', text: 'Content you post must not be unlawful, abusive, defamatory, or infringe the rights of others.' },
      ],
    },
    {
      id: 't4', title: '4. Intellectual Property', intro: '',
      items: [
        { id: 't4i1', label: '', text: 'All content on SportsPulse — including articles, statistics, graphics, and the SportsPulse name and logo — is owned by or licensed to us and protected by intellectual property laws.' },
        { id: 't4i2', label: '', text: 'You may view and share content for personal, non-commercial use. Reproducing or redistributing content for commercial purposes without permission is not allowed.' },
      ],
    },
    {
      id: 't5', title: '5. Content & Accuracy', intro: '',
      items: [
        { id: 't5i1', label: '', text: 'Scores, standings, and statistics are provided for informational purposes. While we strive for accuracy, we do not guarantee that all data is error-free or up to the minute.' },
        { id: 't5i2', label: '', text: 'SportsPulse is not responsible for decisions made based on the information presented on the platform.' },
      ],
    },
    {
      id: 't6', title: '6. Limitation of Liability', intro: '',
      items: [
        { id: 't6i1', label: '', text: 'SportsPulse is provided on an "as is" and "as available" basis. To the fullest extent permitted by law, we disclaim all warranties, express or implied.' },
        { id: 't6i2', label: '', text: 'We are not liable for any indirect, incidental, or consequential damages arising from your use of, or inability to use, the platform.' },
      ],
    },
    {
      id: 't7', title: '7. Changes to the Service', intro: '',
      items: [
        { id: 't7i1', label: '', text: 'We may add, modify, or remove features at any time without prior notice. We may also suspend or discontinue the platform, in whole or in part, at our discretion.' },
      ],
    },
  ],
}

export function legalDefault(type: LegalType): LegalContent {
  return type === 'privacy' ? PRIVACY_DEFAULT : TERMS_DEFAULT
}

/** Use saved content when it has real sections, otherwise fall back to defaults. */
export function resolveLegalContent(type: LegalType, saved: unknown): LegalContent {
  const c = saved as LegalContent | null | undefined
  if (c && Array.isArray(c.sections) && c.sections.length > 0) return c
  return legalDefault(type)
}
