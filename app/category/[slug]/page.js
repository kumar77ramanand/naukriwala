import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default async function CategoryPage({ params }) {
  const { slug } = await params

  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  const { data: jobs } = await supabase
    .from('jobs')
    .select('*, categories(name)')
    .eq('category_id', category?.id)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-blue-700 text-white py-4 px-4 shadow">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">🧑‍💼 Naukri Wala</h1>
          <span className="text-sm bg-blue-500 px-3 py-1 rounded-full">
            Bihar ka No.1 Job Portal
          </span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <Link href="/" className="text-blue-700 text-sm mb-4 inline-block">
          ← Wapas jao
        </Link>

        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {category?.name} Jobs ({jobs?.length || 0})
        </h2>

        <div className="space-y-3">
          {jobs?.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-4xl mb-2">📋</p>
              <p>Is category mein abhi koi job nahi hai</p>
            </div>
          )}

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