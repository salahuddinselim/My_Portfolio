#!/usr/bin/env node

/**
 * News Blog Automator for DevPort
 * 
 * This script:
 * 1. Fetches top tech news from multiple sources
 * 2. Synthesizes content into a blog post
 * 3. Finds appropriate images (Unsplash)
 * 4. Inserts directly into Supabase blogs table
 * 
 * Usage: node scripts/automate-blog.js [--publish]
 * --publish: Set published=true (default: false/draft)
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing Supabase credentials. Check .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// News sources to fetch
const NEWS_SOURCES = [
  { name: 'Ars Technica', url: 'https://arstechnica.com/' },
  { name: 'Hacker News', url: 'https://news.ycombinator.com/' },
  { name: 'TechCrunch', url: 'https://techcrunch.com/' },
  { name: 'The Verge', url: 'https://www.theverge.com/' },
];

// Simple fetch wrapper (using native fetch in Node 18+)
async function fetchNews(url, maxLength = 8000) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const text = await response.text();
    return text.slice(0, maxLength);
  } catch (error) {
    console.warn(`⚠️  Failed to fetch ${url}: ${error.message}`);
    return null;
  }
}

// Extract story headlines and links from HTML (simplified parsing)
function extractStories(html, source) {
  const stories = [];
  if (!html) return stories;

  // Extract links with context
  const linkRegex = /<a[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/gi;
  let match;
  while ((match = linkRegex.exec(html)) !== null) {
    const href = match[1];
    const text = match[2].trim();
    
    // Filter for meaningful headlines
    if (text.length > 20 && text.length < 200 && !text.includes('Subscribe')) {
      stories.push({
        title: text,
        url: href.startsWith('http') ? href : new URL(href, source).href,
        source: source.name,
      });
    }
  }
  
  return stories.slice(0, 10); // Top 10 per source
}

// Generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Generate today's date string
function getTodayDate() {
  const now = new Date();
  return now.toISOString().split('T')[0]; // YYYY-MM-DD
}

// Main automation function
async function automateBlog(publish = false) {
  console.log('🚀 Starting News Blog Automation...\n');
  
  // Step 1: Fetch news from multiple sources
  console.log('📰 Fetching news from sources...');
  const sourceData = await Promise.all(
    NEWS_SOURCES.map(async (source) => {
      const html = await fetchNews(source.url);
      return { source, html };
    })
  );
  
  // Step 2: Extract and rank stories
  console.log('🔍 Extracting top stories...');
  const allStories = sourceData.flatMap(({ source, html }) => 
    extractStories(html, source)
  );
  
  // Deduplicate by title similarity
  const uniqueStories = allStories.filter((story, index, self) => 
    index === self.findIndex(s => s.title.includes(story.title.slice(0, 30)))
  );
  
  console.log(`✅ Found ${uniqueStories.length} unique stories\n`);
  
  // Step 3: Select top 3-5 stories for the blog post
  const selectedStories = uniqueStories.slice(0, 5);
  
  if (selectedStories.length === 0) {
    console.error('❌ No stories found. Check network or sources.');
    process.exit(1);
  }
  
  // Step 4: Generate blog content
  console.log('✍️  Generating blog content...');
  const today = getTodayDate();
  const title = `Tech News Roundup: ${today}`;
  
  // Create excerpt from first few stories
  const excerpt = `Today's top tech stories include ${selectedStories.slice(0, 3).map(s => s.title.split(':').shift()).join(', ')} and more.`;
  
  // Generate content
  let content = `## Top Tech News - ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}\n\n`;
  content += `Here are today's most important developments in technology, AI, and innovation:\n\n`;
  content += `---\n\n`;
  
  selectedStories.forEach((story, index) => {
    content += `### ${index + 1}. ${story.title}\n\n`;
    content += `**Source:** ${story.source}\n\n`;
    content += `[Read full story →](${story.url})\n\n`;
    content += `---\n\n`;
  });
  
  content += `## Summary\n\n`;
  content += `Stay tuned for more updates. This post aggregates information from external sources. All trademarks and content belong to their respective owners.\n\n`;
  content += `**Tags:** #Tech #News #AI #Innovation #${today.replace(/-/g, '')}\n`;
  
  // Step 5: Find a cover image from Unsplash
  console.log('🖼️  Sourcing cover image...');
  const coverImage = await findUnsplashImage(['technology', 'news', 'digital']);
  
  // Step 6: Prepare blog post data
  const blogData = {
    title: title,
    slug: generateSlug(title) + '-' + today,
    content: content,
    excerpt: excerpt,
    cover_image: coverImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200',
    tags: ['tech', 'news', 'AI', 'innovation', today],
    published: publish,
  };
  
  console.log('\n📝 Blog Post Preview:');
  console.log(`   Title: ${blogData.title}`);
  console.log(`   Slug: ${blogData.slug}`);
  console.log(`   Status: ${publish ? '✅ Published' : '📝 Draft'}`);
  console.log(`   Cover: ${blogData.cover_image}`);
  
  // Step 7: Insert into Supabase
  console.log('\n💾 Saving to Supabase...');
  const { data, error } = await supabase
    .from('blogs')
    .insert(blogData)
    .select()
    .single();
  
  if (error) {
    console.error('❌ Error saving to Supabase:', error.message);
    process.exit(1);
  }
  
  console.log('\n✅ Success! Blog post created.');
  console.log(`   ID: ${data.id}`);
  console.log(`   URL: ${process.env.NEXT_PUBLIC_BASE_URL || 'https://your-site.com'}/blog/${data.slug}`);
  console.log(`\n👉 Login to your admin panel at /admin/blogs to review and publish.`);
  
  return data;
}

// Find image from Unsplash source page (simplified)
async function findUnsplashImage(keywords) {
  // Unsplash source URLs with curated tech images
  const imageUrls = [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200', // Tech chip
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200', // Coding
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200', // News
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200', // Cybersecurity
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200', // Matrix/digital
  ];
  
  // Return random image from curated list
  return imageUrls[Math.floor(Math.random() * imageUrls.length)];
}

// Run automation
const shouldPublish = process.argv.includes('--publish');
automateBlog(shouldPublish)
  .then(() => {
    console.log('\n🎉 Automation complete!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Automation failed:', error.message);
    process.exit(1);
  });
