'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function AdminPage() {
  const [jobs, setJobs] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('add')
  const [form, setForm] = useState({
    title: '',
    category_id: '',
    state: 'Bihar',
    total_posts: '',
    last_date: '',
    description: '',
    apply_link: '',
  })

  useEffect(() => {
    fetchCategories()
    fetchJobs()
  }, [])

  async function fetchCategories() {
    const { data } = await supabase.from('categories').select('*')
    setCategories(data || [])
  }

  async function fetchJobs() {
    const { data } = await supabase
      .from('jobs')
      .select('*, categories(name)')
      .order('created_at', { ascending: false })
    setJobs(data || [])
  }

  async function addJob() {
    if (!form.title || !form.category_id) {
      alert('Title aur Category zaroori hai!')
      return
    }
    setLoading(true)
    await supabase.from('jobs').insert([{ ...form, is_approved: true }])
    setForm({
      title: '',
      category_id: '',
      state: 'Bihar',
      total_posts: '',
      last_date: '',
      description: '',
      apply_link: '',
    })
    fetchJobs()
    setActiveTab('jobs')
    setLoading(false)
    alert('✅ Job add ho gayi!')
  }

  async function deleteJob(id) {
    if (!confirm('Pakka delete karna hai?')) return
    await supabase.from('jobs').delete().eq('id', id)
    fetchJobs()
  }

  async function toggleApprove(id, current) {
    await supabase.from('jobs').update({ is_approved: !current }).eq('id', id)
    fetchJobs()
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-700 text-white py-4 px-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">🔐 Naukri Wala — Admin Panel</h1>
          <Link href="/" className="text-sm bg-blue-500 px-3 py-1 rounded-full">
            Home dekho →
          </Link>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-4 mt-4">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('add')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              activeTab === 'add'
                ? 'bg-blue-700 text-white'
                : 'bg-white text-blue-700 border border-blue-700'
            }`}>
            ➕ Job Add Karo
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              activeTab === 'jobs'
                ? 'bg-blue-700 text-white'
                : 'bg-white text-blue-700 border border-blue-700'
            }`}>
            📋 All Jobs ({jobs.length})
          </button>
        </div>

        {/* Add Job Form */}
        {activeTab === 'add' && (
          <div className="bg-white rounded-xl shadow p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-700">Nayi Job Add Karo</h2>

            <div>
              <label className="text-sm text-gray-600">Job Title *</label>
              <input
                className="w-full border rounded-lg px-3 py-2 mt-1"
                placeholder="e.g. BPSC 70th Vacancy 2024"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Category *</label>
              <select
                className="w-full border rounded-lg px-3 py-2 mt-1"
                value={form.category_id}
                onChange={e => setForm({ ...form, category_id: e.target.value })}>
                <option value="">-- Select Category --</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">State</label>
                <input
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                  placeholder="Bihar"
                  value={form.state}
                  onChange={e => setForm({ ...form, state: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Total Posts</label>
                <input
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                  placeholder="e.g. 1500"
                  value={form.total_posts}
                  onChange={e => setForm({ ...form, total_posts: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600">Last Date</label>
              <input
                className="w-full border rounded-lg px-3 py-2 mt-1"
                placeholder="e.g. 31 July 2024"
                value={form.last_date}
                onChange={e => setForm({ ...form, last_date: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Description</label>
              <textarea
                className="w-full border rounded-lg px-3 py-2 mt-1"
                rows={3}
                placeholder="Job ke baare mein likhو..."
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Apply Link</label>
              <input
                className="w-full border rounded-lg px-3 py-2 mt-1"
                placeholder="https://..."
                value={form.apply_link}
                onChange={e => setForm({ ...form, apply_link: e.target.value })}
              />
            </div>

            <button
              onClick={addJob}
              disabled={loading}
              className="w-full bg-blue-700 text-white py-3 rounded-xl font-bold hover:bg-blue-800 disabled:opacity-50">
              {loading ? 'Adding...' : '✅ Job Add Karo'}
            </button>
          </div>
        )}

        {/* Jobs List */}
        {activeTab === 'jobs' && (
          <div className="space-y-3">
            {jobs.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <p className="text-4xl mb-2">📋</p>
                <p>Koi job nahi hai abhi</p>
              </div>
            )}
            {jobs.map(job => (
              <div key={job.id} className="bg-white rounded-xl shadow p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      {job.categories?.name}
                    </span>
                    <h4 className="font-bold text-gray-800 mt-1">{job.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      📌 {job.total_posts} Posts • 📍 {job.state} • ⏰ {job.last_date}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => toggleApprove(job.id, job.is_approved)}
                      className={`text-xs px-3 py-1 rounded-full ${
                        job.is_approved
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                      {job.is_approved ? '✅ Live' : '⏳ Pending'}
                    </button>
                    <button
                      onClick={() => deleteJob(job.id)}
                      className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-full">
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}