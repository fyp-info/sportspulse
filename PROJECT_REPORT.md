# SportsPulse — Project Report

A full-stack sports news and live-data platform with a secure, role-based
administration dashboard.

---

## 1. Problem Statement

Sports fans today are scattered across many different websites and apps just to
follow the games they love. To check a football score they open one site, for
cricket standings another, and for Formula-1 race results yet another. On top of
that, most of these sites mix **real news** with **clutter, pop-ups, and
fragmented information**, and they rarely give a single, clean place to read
expert analysis, see live scores, and follow tournaments at the same time.

From the **business/operator side**, running such a website is even harder:

- Someone needs to **publish news articles**, but not everyone on the team
  should have the same powers — a junior writer shouldn't be able to delete the
  boss's article or ban users.
- The **live sports data** (scores, standings, fixtures, brackets) needs to be
  **edited and updated constantly**, and those edits must appear on the public
  website instantly — without a developer redeploying code each time.
- The platform handles **user accounts and personal data**, so it must be
  **secure**: protected against hackers guessing passwords, stealing login
  sessions, or sneaking into admin areas.
- Administrators need **visibility and control** — who signed up, where they're
  logging in from, who tried to break in, and the ability to take the site
  offline for maintenance.

**In short:** there was no single, secure, easy-to-manage platform that combined
multi-sport live data, a professional blog, and a powerful but safe
administration system where different staff members have exactly the right level
of access — no more, no less.

---

## 2. Explanation

This section explains, in plain language, *what* SportsPulse is, *what tools*
were used to build it, *how* those tools were used, and *how the whole thing
works* — from the smallest detail to the big picture.

### 2.1 What SportsPulse Is (The Big Picture)

SportsPulse is a website with **two faces**:

1. **The public website** — what ordinary visitors and registered members see:
   the home page, live scores for Football/Cricket/Formula-1, standings,
   tournament brackets, a blog with articles, and personal features like
   bookmarking articles.

2. **The staff dashboard** — a private, password-protected control panel where
   the team manages everything: writing articles, updating sports data, managing
   other staff, monitoring security, and configuring the site.

Think of it like a restaurant: the public website is the **dining area** that
customers enjoy, and the dashboard is the **kitchen and manager's office** where
the staff do the work that makes the dining experience possible.

### 2.2 The Technology Stack (The Building Materials)

Every house is built from materials — bricks, cement, wood. A web app is built
from software libraries. Here are the main ones SportsPulse uses and what each
one does, explained simply:

| Tool | What it is | Why we used it |
| --- | --- | --- |
| **Next.js 16** (with React 19) | The main framework — the "skeleton" of the whole app | Lets us build both the website pages *and* the server logic in one project |
| **TypeScript** | A safer version of JavaScript that catches mistakes early | Prevents many bugs before the app even runs |
| **Prisma 7 + PostgreSQL** | The database and the tool to talk to it | Permanently stores users, articles, comments, sports data, etc. |
| **Neon** | A cloud-hosted PostgreSQL database | The actual place all the data physically lives |
| **Tailwind CSS** | A styling system | Makes everything look clean and modern without writing tons of CSS |
| **Radix UI + lucide-react** | Pre-built buttons, dropdowns, icons | Professional, accessible UI pieces |
| **Zustand** | A small "memory" for the browser | Remembers who is logged in while you browse |
| **jose** | A library for secure login tokens (JWT) | Keeps you logged in safely |
| **bcrypt** | A password-scrambling tool | Stores passwords so even we can't read them |
| **Zod** | An input checker | Makes sure data is valid before saving it |
| **Nodemailer (Gmail)** | An email sender | Sends verification codes and notifications |
| **Cloudinary** | An image hosting service | Stores uploaded photos (avatars, article covers, banners) |
| **ip-api.com** | A location lookup service | Turns an IP address into a country/city/network |
| **Vercel** | The hosting platform | Where the finished website lives on the internet |
| **framer-motion** | An animation library | Smooth motion effects (e.g., the hero banner) |
| **react-hook-form** | A form helper | Makes login/registration forms behave nicely |

### 2.3 How the App Is Organized (The Floor Plan)

The project is split into clear sections, like rooms in a building:

- **`app/(public)/`** — all the public pages (home, blog, sports, settings,
  bookmarks, etc.). These are grouped so we can apply shared rules to all of
  them at once (for example, the maintenance-mode screen).
- **`app/(auth)/`** — login, register, verify-email, forgot/reset password.
- **`app/dashboard/`** — the staff control panel, split by role
  (`editor`, `moderator`, `admin`, `superadmin`).
- **`app/pulsekk97G18-7-0-9P2-adminn/`** — the **secret staff login doors**.
  These URLs are deliberately strange and unguessable so that ordinary visitors
  (and bots) never stumble onto the staff login page.
- **`app/api/`** — the **server logic**. Every time the website needs to read or
  save data, it talks to one of these "API routes" (think of them as the
  waiters carrying orders between the dining area and the kitchen).
- **`lib/`** — shared helper code (security, database connection, email, etc.).
- **`components/`** — reusable visual pieces (navbar, footer, cards, tables).
- **`prisma/`** — the database blueprint (`schema.prisma`) and seed data.

### 2.4 How Data Is Stored (The Filing Cabinet)

All permanent information lives in a **PostgreSQL database**, organized into
tables (like spreadsheets). The main ones:

- **User** — every account: name, username, email, scrambled password, role,
  avatar, etc.
- **Post** — blog articles, with views, likes, tags, and which user wrote them.
- **Comment** — reader comments on articles (which a moderator must approve).
- **Bookmark** — which user saved which article.
- **SportsData** — the live sports content. This is clever: it stores one row
  per *(sport, league, tab)* combination — for example
  *(football, Premier League, standings)* — each holding a chunk of data.
- **HomeBanner / SiteConfig / RolePermission** — site configuration that admins
  can change (the home page banner, maintenance switch, and the permission
  matrix).
- **AuditLog** — a permanent diary of every important security event.
- **LoginHistory, FailedLogin, BlockedIp, SuspiciousIp** — security records.
- **VerificationToken / RevokedToken** — for login codes and session security.

We use **Prisma** to talk to this database. Instead of writing raw, error-prone
database commands, we write simple, safe code like
`prisma.post.findMany(...)`, and Prisma translates it. This also automatically
protects us from a famous hacking technique called **SQL injection** (explained
later).

### 2.5 How Sports Data Works (Editable Without a Developer)

This is one of the most important features. Originally the sports scores were
"hard-coded" — to change a score, a developer had to edit the code and
re-publish the whole site. That's slow and impractical.

Now, the sports data is **stored in the database** and **edited from the
dashboard**:

1. A staff member opens **Dashboard → Sports → Football → Premier League** and
   sees editable tables for **Scores, Standings, Players, Schedule, and
   Tournament**.
2. When they change a score and hit **Save**, the dashboard sends that one
   specific slice — *(football, Premier League, scores)* — to the server.
3. The server saves it to the **SportsData** table.
4. The public Football page reads from the database, so the change appears
   **immediately** on the live site.

**Why this design is smart:** because each league and tab is stored as its *own
separate row*, editing the Premier League scores can **never accidentally
affect** La Liga, or cricket, or anything else. The isolation is built into the
structure, not left to careful coding. If the database is ever missing a piece,
the site falls back to sensible default data so nothing ever looks broken.

The public match pages (e.g., a specific football match) merge two things:
the **live editable data** from the database (scores, status, venue) and
**rich supplementary details** (goals, line-ups, statistics) — so admin edits
show instantly while the page still feels detailed.

### 2.6 The Blog System

Staff can write, edit, and publish news articles with a cover image, tags, a
category, and a "featured" flag. Key behaviors:

- Articles are written in a dashboard editor with a **live preview** that shows
  exactly how the article card will look.
- On the public site, articles show the author's **full name** (not their
  username) and a real, **live view count** that increases each time someone
  actually opens the article.
- Readers can **bookmark** articles (a bookmark icon with a live count); their
  saved articles appear on a personal **Bookmarks** page.
- The **dashboard blog list shows every article from every staff member**, but
  the Edit/Delete buttons follow a strict seniority rule (explained in 2.8).

### 2.7 Accounts, Login, and Email Verification (The Front Door)

When a new person **registers**, here's what happens behind the scenes:

1. They enter a username, email, and password.
2. The password is immediately **scrambled with bcrypt** before being saved — we
   never store the actual password.
3. A **6-digit verification code** is emailed to them.
4. They type the code into a box that appears right on the page. Once correct,
   they're verified and automatically logged in, landing on their profile.

When **logging in**:

- If the email isn't verified yet, a fresh code is sent and they must confirm it
  (no clicking links — just a clean code box).
- If they enabled **Two-Factor Authentication (2FA)**, a code is emailed and
  required. To avoid annoyance, after one successful 2FA the next **3 logins
  skip the code**, then it asks again.
- The **superadmin** always uses a code on **every** login — maximum security
  for the most powerful account.

### 2.8 Roles and Permissions (Who Can Do What)

SportsPulse has five levels of users, like ranks in an organization:

1. **User** — a normal member (reads, comments, bookmarks).
2. **Editor** — can write and manage their own articles.
3. **Moderator** — editor powers + approve/reject comments + manage sports data.
4. **Admin** — moderator powers + manage editors and moderators + legal pages.
5. **Superadmin** — total control over everything.

**The golden rule (seniority):** you can only manage people *below* your rank,
never your peers or seniors. For example:

- An **admin** can edit or delete articles written by editors and moderators —
  but **not** other admins or the superadmin.
- An **editor** can only touch **their own** articles.
- An admin **cannot create another admin** — only the superadmin can.

This rule is enforced in **two places at once**: the buttons are hidden in the
interface *and* the server double-checks every request. So even a tech-savvy
user who tries to bypass the screen and call the server directly is still
blocked.

The superadmin can also fine-tune a **Permission Matrix** — a grid of "who can
access what" (Blog, Sports, Home Banner, Contact Inbox, Legal Pages, Suspicious
IPs, etc.). When the superadmin grants or revokes a permission, lower roles only
see what they've been given, and the rules are checked live as people use the
site.

### 2.9 The Admin Dashboard Features

The dashboard gives staff a full control center, including:

- **Home Banner editor** — change the big banner on the home page (headline,
  text, buttons, and a drag-and-drop background image upload), with a live
  preview. The "Blogs / Readers / Sports" numbers on the banner are **counted
  automatically** from the database.
- **Sports manager** — edit all the live sports data described in 2.5.
- **Blog editor** — write and manage articles.
- **Role Management** — create staff accounts (which emails them their login
  details) and see the permission matrix.
- **Registered Users** — a list of everyone who signed up, with their **real IP
  address, last-seen date, and geolocation (country, city, network)**.
- **Comments moderation**, **Contact Inbox**, **Legal Pages** (privacy/terms
  editors), **Audit Logs**, and **Suspicious IPs**.
- **Maintenance Mode** — a single switch on the Security page that takes the
  **entire public website offline** (showing a friendly "we'll be right back"
  card), while the dashboard stays fully usable so the team can keep working and
  switch it back on.

### 2.10 Security — The Working Principle in Detail

Security is a major focus. Here is how SportsPulse protects itself, in simple
terms:

- **Password scrambling (bcrypt):** passwords are turned into unreadable
  scrambled text using a "work factor" that makes them slow and expensive to
  crack. Each password also gets a unique random "salt" so two people with the
  same password still get different scrambled results.
- **Login sessions (JWT):** when you log in, you get a digitally **signed token**
  stored in a secure, hidden browser cookie that JavaScript can't read. The
  signature uses **HMAC-SHA256**, so the token can't be forged or tampered with —
  any altered token is instantly rejected.
- **Two separate sessions:** the public site and the dashboard use **completely
  independent** login sessions, so they never interfere or leak into each other.
- **Session expiry:** sessions last 7 days, but the clock resets each time you're
  active — so 7 days of inactivity logs you out automatically.
- **Logout that actually works:** when you log out, your token is added to a
  server **denylist** — so even if someone copied your token, it stops working
  the instant you log out.
- **Brute-force protection:** after **5 wrong password attempts**, that
  visitor's IP address is **blocked**. The same 5-try limit applies to the
  emailed codes, so nobody can sit there guessing a 6-digit code.
- **SQL injection prevention:** because we use Prisma (never raw database text),
  malicious input can't trick the database into running harmful commands.
- **Input validation + sanitization:** every form submission is checked for the
  right format (Zod) and then **cleaned** of any hidden code or script tags
  before being stored — protecting against another attack called cross-site
  scripting (XSS).
- **Audit logging:** every login, logout, failed attempt, and access-denial is
  recorded with a timestamp, who did it, and from which IP — both in the
  database and as structured log lines for monitoring.
- **Security testing harness:** the project ships with a ready-to-run OWASP ZAP
  scan and a documented Burp Suite test plan in `SECURITY.md`.

### 2.11 Supporting Services (Email, Images, Location)

- **Email (Nodemailer + Gmail):** sends verification codes, login codes,
  password resets, and staff welcome emails. If email isn't configured during
  development, the codes are safely printed to the server log instead.
- **Images (Cloudinary):** when staff upload an avatar, an article cover, or a
  banner, the file is sent to Cloudinary (a cloud image service) and only the
  resulting web link is stored — keeping the app fast and the database light.
- **Geolocation (ip-api.com):** turns a visitor's IP address into a real
  country, city, and network name for the security and registered-users pages.
  Results are cached for an hour so it stays fast.

### 2.12 How It All Runs Together (The Flow)

A simple example — a fan reading an article:

1. The fan visits the home page. Next.js builds the page on the server, asking
   the database for the latest articles, scores, and the banner.
2. They click an article. The page loads from the database, the view count
   ticks up, and they bookmark it (saved to the Bookmark table).
3. Meanwhile, an editor in the dashboard publishes a new article — it instantly
   appears on the public blog.
4. The superadmin notices unusual activity, opens the Security page, sees a
   blocked IP, and flips on Maintenance Mode while investigating.

Every one of these actions flows through the same pattern: **page or button →
API route → security check → database → response → screen update.**

### 2.13 Deployment (Going Live)

The finished app is hosted on **Vercel**. Each time the code is updated, Vercel
automatically rebuilds and re-checks the entire project (including a full
type-check and generating the database client) before publishing. **Vercel Web
Analytics** is included to measure real visitor traffic once live.

---

## 3. Solution Statement

SportsPulse solves the problems identified above by delivering **one unified,
secure, and self-manageable sports platform**:

1. **One place for everything sports.** Football, Cricket, and Formula-1 — live
   scores, standings, fixtures, tournament brackets, and expert blog articles —
   all under a single clean, modern, fast website, plus personal features like
   bookmarks and notifications.

2. **Content the team controls themselves — no developer needed.** Through the
   dashboard, staff edit live sports data and publish articles, and those
   changes appear on the public site immediately. The data is structured so that
   editing one league or article can never break another.

3. **A safe, layered staff hierarchy.** Five clearly defined roles, with a strict
   seniority rule enforced both in the interface and on the server, mean every
   team member has exactly the right powers — a junior can't undo a senior's
   work, and only the superadmin holds the master keys. A configurable
   permission matrix lets the superadmin tune access at runtime.

4. **Strong, modern security by design.** Scrambled passwords, forgery-proof
   login tokens, instant logout invalidation, brute-force lockouts on both
   passwords and codes, email-based verification and 2FA, SQL-injection-proof
   database access, input sanitization, full audit logging, and a documented
   security-testing process — together protecting both user data and the
   platform itself.

5. **Full operational visibility and control.** Admins can see who registered
   and from where (real IP and geolocation), monitor failed logins and
   suspicious IPs, review a complete audit trail, manage user accounts, and take
   the public site offline with a single maintenance switch while continuing to
   work behind the scenes.

The result is a **production-ready, deployable platform** (live on Vercel) that
is enjoyable for fans, effortless for the content team, and trustworthy from a
security standpoint — turning a fragmented, hard-to-manage problem into a single,
polished, and safe product.
