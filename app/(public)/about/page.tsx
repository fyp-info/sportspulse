import { Zap, Target, Users, Globe } from 'lucide-react'

const team = [
  { name: 'Alexandra Chen', role: 'CEO & Co-Founder', bio: 'Sports media veteran with 15 years of experience at global publications.' },
  { name: 'Marcus Rodriguez', role: 'Head of Content', bio: 'Former sports journalist, lifelong football and cricket enthusiast.' },
  { name: 'Priya Sharma', role: 'Lead Developer', bio: 'Full-stack engineer passionate about building great sports fan experiences.' },
  { name: 'James Williams', role: 'Sports Editor', bio: 'F1 and basketball specialist with a knack for sharp analysis.' },
]

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-10 w-10 rounded-xl bg-orange-500 flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">SportsPulse</span>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">About Us</h1>
          <p className="text-gray-500 text-lg leading-relaxed max-w-2xl mx-auto">
            SportsPulse was born from a simple belief: sports fans deserve a single destination that covers everything
            — from Premier League drama to Formula-1 glory, from cricket Test battles to NBA Finals magic.
          </p>
        </div>

        {/* Values */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: Target, title: 'Our Mission', desc: 'Deliver fast, accurate, and engaging sports content to fans worldwide, 24 hours a day.' },
            { icon: Users, title: 'Our Community', desc: 'Half a million readers who share a passion for sport and respectful fan culture.' },
            { icon: Globe, title: 'Our Vision', desc: 'To become the most trusted multi-sport digital media platform on the internet.' },
          ].map((item) => {
            const Icon = item.icon
            return (
              <div key={item.title} className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6">
                <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-orange-500" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            )
          })}
        </div>

        {/* History */}
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            SportsPulse launched in 2022 as a small football news blog run by two friends in a spare room. Within six months
            we had expanded to cover cricket and Formula-1, driven by growing demand from our readers. By 2024 we had added
            basketball and grown to a team of 12 full-time staff plus a network of 30+ freelance contributors.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Today, SportsPulse serves over 500,000 monthly readers across 180 countries. We remain committed to the values
            that got us here: fast, accurate reporting, deep analysis, and a genuine love of the game.
          </p>
        </div>

        {/* Team */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Meet the Team</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {team.map((member) => (
            <div key={member.name} className="flex gap-4 rounded-2xl border border-gray-100 bg-white shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-full bg-orange-100 text-orange-600 font-bold text-sm flex items-center justify-center shrink-0">
                {member.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <div className="font-semibold text-gray-900">{member.name}</div>
                <div className="text-xs text-orange-500 mb-2">{member.role}</div>
                <p className="text-sm text-gray-500">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
