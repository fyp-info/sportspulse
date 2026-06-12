'use client'

import { useState } from 'react'
import { Edit, Trash2, Eye, PlusCircle } from 'lucide-react'
import { mockPosts } from '@/lib/mock-data/posts'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'

const statusVariant: Record<string, 'success' | 'warning' | 'secondary'> = {
  published: 'success',
  draft: 'warning',
  scheduled: 'secondary',
}

export default function PostsTable() {
  const [posts, setPosts] = useState(mockPosts)

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">{posts.length} total posts</p>
        <Button variant="primary" size="sm">
          <PlusCircle className="h-4 w-4" /> Create New Post
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {['Title', 'Sport', 'Status', 'Views', 'Likes', 'Published', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-3 max-w-52">
                  <p className="font-medium text-gray-800 truncate">{post.title}</p>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={post.sport === 'Football' ? 'football' : post.sport === 'Basketball' ? 'basketball' : post.sport === 'Formula-1' ? 'formula-1' : 'cricket'}>
                    {post.sport}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={statusVariant[post.status]} className="capitalize">{post.status}</Badge>
                </td>
                <td className="px-4 py-3 text-gray-500">{post.views.toLocaleString()}</td>
                <td className="px-4 py-3 text-gray-500">{post.likes.toLocaleString()}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">{formatDate(post.publishedAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-gray-700">
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-blue-500 hover:text-blue-600 hover:bg-blue-50">
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400 hover:text-red-600 hover:bg-red-50">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
