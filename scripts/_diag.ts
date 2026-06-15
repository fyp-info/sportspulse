try { (process as any).loadEnvFile() } catch {}
import('../lib/prisma').then(async ({ prisma }) => {
  const users = await prisma.user.findMany({
    where: { role: 'user' },
    select: { username: true, email: true, emailVerified: true, isActive: true },
  })
  console.log('user-role accounts:')
  for (const u of users) console.log('  ', u.username, '| verified:', u.emailVerified, '| active:', u.isActive, '|', u.email)
  await prisma.$disconnect()
}).catch((e) => { console.error('ERR:', e.message); process.exit(1) })
