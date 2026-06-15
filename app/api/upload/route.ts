import { NextResponse } from 'next/server'
import { authorize } from '@/lib/auth/api'
import { uploadImage } from '@/lib/cloudinary'

const MAX_BYTES = 5 * 1024 * 1024 // 5 MB
const ALLOWED = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']
const FOLDERS = ['avatars', 'blog', 'banner'] as const

export async function POST(request: Request) {
  const { error } = await authorize('user')
  if (error) return error

  const form = await request.formData().catch(() => null)
  const file = form?.get('file')
  const folderRaw = String(form?.get('folder') ?? 'blog')
  const folder = (FOLDERS as readonly string[]).includes(folderRaw) ? folderRaw : 'blog'

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: 'Unsupported image type' }, { status: 400 })
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'Image must be 5 MB or smaller' }, { status: 413 })
  }

  const bytes = Buffer.from(await file.arrayBuffer())
  const dataUri = `data:${file.type};base64,${bytes.toString('base64')}`

  try {
    const { url } = await uploadImage(dataUri, folder)
    return NextResponse.json({ url })
  } catch (err) {
    console.error('[upload] cloudinary error:', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 502 })
  }
}
