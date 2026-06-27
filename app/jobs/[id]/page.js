import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default async function JobDetail({ params }) {
  const { id } = await params
  const { data: job } = await supabase
    .from('jobs')
    .select('*, categories(name)')
    .eq('id', id)
    .single()

  if (!job) {
    return (
      <div>
        <Link href="/">Wapas jao</Link>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-blue-700 text-white py-4 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold">Naukri Wala</h1>
        </div>
      </header>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Link href="/" className="text-blue-700 text-sm mb-4 inline-block">
          Wapas jao
        </Link>
        <div className="bg-white rounded-xl shadow p-6 mt-2">
          <h2 className="text-2xl font-bold text-gray-800 mt-3">
            {job.title}
          </h2>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-xs text-gray-500">Total Posts</p>
              <p className="text-xl font-bold text-blue-700">{job.total_posts || 'NA'}</p>
            </div>
            <div className="bg-red-50 rounded-xl p-4">
              <p className="text-xs text-gray-500">Last Date</p>
              <p className="text-xl font-bold text-red-600">{job.last_date || 'NA'}</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <p className="text-xs text-gray-500">State</p>
              <p className="text-xl font-bold text-green-700">{job.state || 'NA'}</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4">
              <p className="text-xs text-gray-500">Category</p>
              <p className="text-xl font-bold text-purple-700">{job.categories?.name || 'NA'}</p>
            </div>
          </div>
          {job.description && (
            <div className="mt-6">
              <p className="text-gray-600">{job.description}</p>
            </div>
          )}
          <div className="mt-6 bg-gray-100 rounded-xl p-4 text-center text-gray-400 text-sm">
            Advertisement
          </div>
          <div className="mt-6">
            <Link href={job.apply_link || '/'} className="w-full bg-blue-700 text-white py-4 rounded-xl font-bold text-center block">
              Abhi Apply Karo
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
