import Parser from 'rss-parser'
import { supabase } from '@/lib/supabase'

const parser = new Parser()

const RSS_FEEDS = [
  {
    url: 'https://www.sarkariresult.com/feed/',
    category_slug: 'all-india'
  },
  {
    url: 'https://rojgarresult.com/feed/',
    category_slug: 'all-india'
  }
]

export async function GET(request) {
  // Secret key check karo
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.RSS_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    let totalAdded = 0

    for (const feed of RSS_FEEDS) {
      // Category ID dhundho
      const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', feed.category_slug)
        .single()

      if (!category) continue

      // RSS feed parse karo
      const parsedFeed = await parser.parseURL(feed.url)

      for (const item of parsedFeed.items.slice(0, 10)) {
        // Check karo ki job pehle se hai ya nahi
        const { data: existing } = await supabase
          .from('jobs')
          .select('id')
          .eq('source_link', item.link)
          .single()

        if (existing) continue

        // Nayi job add karo
        await supabase.from('jobs').insert([{
          title: item.title,
          category_id: category.id,
          description: item.contentSnippet || item.content || '',
          source_link: item.link,
          state: 'All India',
          is_approved: false
        }])

        totalAdded++
      }
    }

    return Response.json({
      success: true,
      message: `${totalAdded} nayi jobs add hui!`
    })

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}