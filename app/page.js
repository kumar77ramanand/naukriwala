import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default async function Home() {
  const { data: jobs } = await supabase
    .from('jobs')
    .select('*, categories(name)')
    .eq('is_approved', true)
    .order('created_at', { ascending: false })
    .limit(20)

  const { data: categories } = await supabase
    .from('categories')
    .select('*')

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-700 text-white py-4 px-4 shadow">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">🧑‍💼 Naukri Wala</h1>
          <span className="text-sm bg-blue-500 px-3 py-1 rounded-full">
            Bihar ka No.1 Job Portal
          </span>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-blue-600 text-white text-center py-8 px-4">
        <h2 className="text-2xl font-bold mb-2">सरकारी नौकरी अलर्ट</h2>
        <p className="text-blue-100">BPSC • Railway • SSC • Police • Bank</p>
      </div>

      {/* Categories */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Link href="/"
            className="bg-blue-700 text-white px-4 py-2 rounded-full text-sm whitespace-nowrap">
            All Jobs
          </Link>
          {categories?.map(cat => (
            <Link key={cat.id} href={`/category/${cat.slug}`}
              className="bg-white text-blue-700 border border-blue-700 px-4 py-2 rounded-full text-sm whitespace-nowrap hover:bg-blue-50">
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Jobs List */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <h3 className="text-lg font-bold text-gray-700 mb-3">
          Latest Jobs ({jobs?.length || 0})
        </h3>

        {jobs?.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-2">📋</p>
            <p>Abhi koi job nahi hai — jaldi aayegi!</p>
          </div>
        )}

        <div className="space-y-3">
          {jobs?.map(job => (
            <Link key={job.id} href={`/jobs/${job.id}`}>
              <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      {job.categories?.name}
                    </span>
                    <h4 className="font-bold text-gray-800 mt-2">{job.title}</h4>
                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                      {job.total_posts && (
                        <span>📌 {job.total_posts} Posts</span>
                      )}
                      {job.state && (
                        <span>📍 {job.state}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    {job.last_date && (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                        Last: {job.last_date}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}