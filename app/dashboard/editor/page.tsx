'use client'

import { FileText, Eye, Heart, PlusCircle } from 'lucide-react'
import StatCard from '@/components/dashboard/StatCard'
import PostsTable from '@/components/dashboard/PostsTable'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { mockPosts } from '@/lib/mock-data/posts'
import { useAuthStore } from '@/lib/store/auth-store'

export default function EditorDashboard() {
  const { user } = useAuthStore()
  const published = mockPosts.filter((p) => p.status === 'published').length
  const drafts = mockPosts.filter((p) => p.status === 'draft').length
  const totalViews = mockPosts.reduce((a, p) => a + p.views, 0)
  const totalLikes = mockPosts.reduce((a, p) => a + p.likes, 0)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Editor Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your content and track performance</p>
        </div>
        <Button variant="primary">
          <PlusCircle className="h-4 w-4" /> Create New Post
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Published" value={published} icon={FileText} change={2} changeLabel="this week" color="text-green-600" />
        <StatCard title="Drafts" value={drafts} icon={FileText} color="text-yellow-500" />
        <StatCard title="Total Views" value={totalViews.toLocaleString()} icon={Eye} change={18} changeLabel="this month" />
        <StatCard title="Total Likes" value={totalLikes.toLocaleString()} icon={Heart} change={12} changeLabel="this month" color="text-pink-500" />
      </div>

      {/* Post Analytics */}
      <div className="grid sm:grid-cols-3 gap-4">
        {mockPosts.slice(0, 3).map((post) => (
          <div key={post.id} className="rounded-2xl border border-gray-100 bg-white shadow-sm p-4">
            <p className="text-sm font-medium text-gray-800 line-clamp-2 mb-3">{post.title}</p>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center rounded-xl bg-gray-50 p-2">
                <p className="text-sm font-bold text-gray-900">{(post.views / 1000).toFixed(1)}K</p>
                <p className="text-[10px] text-gray-400">Views</p>
              </div>
              <div className="text-center rounded-xl bg-gray-50 p-2">
                <p className="text-sm font-bold text-gray-900">{post.likes}</p>
                <p className="text-[10px] text-gray-400">Likes</p>
              </div>
              <div className="text-center rounded-xl bg-gray-50 p-2">
                <p className="text-sm font-bold text-gray-900">{post.shares}</p>
                <p className="text-[10px] text-gray-400">Shares</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Posts Table */}
      <Tabs defaultValue="all">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="all">All Posts</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="all"><PostsTable /></TabsContent>
        <TabsContent value="published"><PostsTable /></TabsContent>
        <TabsContent value="drafts"><PostsTable /></TabsContent>
      </Tabs>
    </div>
  )
}
