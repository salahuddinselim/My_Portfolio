# 📰 News Blog Automation System

Automated news aggregation and blog posting system for DevPort.

## 🚀 Quick Start

### Daily Blog Post Creation

**Option 1: Create as Draft (Recommended)**
```bash
node scripts/automate-blog.js
```

**Option 2: Create and Publish Immediately**
```bash
node scripts/automate-blog.js --publish
```

## 📋 What It Does

1. **Fetches News** from multiple sources:
   - Ars Technica
   - Hacker News
   - TechCrunch
   - The Verge

2. **Extracts Top Stories** (5-6 stories per run)

3. **Generates Blog Content** with:
   - Auto-generated title with today's date
   - Curated story list with sources
   - Direct links to original articles
   - Tags and metadata

4. **Sources Cover Image** from Unsplash (tech-themed)

5. **Saves to Supabase** blogs table

6. **Ready for Review** in your admin panel

## 🔐 Authentication Required

Before running, ensure you're logged into Supabase:

1. The script uses credentials from `.env.local`
2. Make sure these are set:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   ```

## 📝 Workflow

### Daily Routine (5 minutes)

1. **Run the script:**
   ```bash
   node scripts/automate-blog.js
   ```

2. **Login to admin panel:**
   - Go to `https://selimsalahuddin.vercel.app/admin/login`
   - Enter your credentials

3. **Review the draft:**
   - Navigate to `/admin/blogs`
   - Find today's post (marked as "Draft")
   - Click "Edit"

4. **Edit if needed:**
   - Add personal commentary
   - Adjust formatting
   - Change cover image if desired

5. **Publish:**
   - Check the "Published" checkbox
   - Save

## 🛠️ Customization

### Change News Sources

Edit `scripts/automate-blog.js`:

```javascript
const NEWS_SOURCES = [
  { name: 'Ars Technica', url: 'https://arstechnica.com/' },
  { name: 'Hacker News', url: 'https://news.ycombinator.com/' },
  { name: 'TechCrunch', url: 'https://techcrunch.com/' },
  { name: 'The Verge', url: 'https://www.theverge.com/' },
  // Add more sources here
];
```

### Change Cover Images

Edit the `findUnsplashImage()` function:

```javascript
const imageUrls = [
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200',
  // Add your preferred images
];
```

### Adjust Number of Stories

Change this line in `automateBlog()`:

```javascript
const selectedStories = uniqueStories.slice(0, 5); // Change 5 to any number
```

## 📊 Output Format

Each automated post includes:

- **Title:** `Tech News Roundup: YYYY-MM-DD`
- **Slug:** `tech-news-roundup-yyyy-mm-dd-yyyy-mm-dd`
- **Content:** Markdown-formatted story list
- **Excerpt:** Auto-generated summary
- **Cover Image:** Random tech image from Unsplash
- **Tags:** `tech`, `news`, `AI`, `innovation`, `[date]`
- **Status:** Draft (unless `--publish` flag used)

## 🔧 Troubleshooting

### "Missing Supabase credentials"
- Check `.env.local` exists with correct values
- Run `npm install dotenv` if needed

### "No stories found"
- Check internet connection
- Some sources may be temporarily unavailable
- Try running again in a few minutes

### "Error saving to Supabase"
- Verify Supabase project is active
- Check `blogs` table exists in Supabase dashboard
- Ensure RLS policies allow authenticated inserts

### Cover image not loading
- Unsplash URLs may change
- Replace with your own hosted images if needed
- Or use Supabase Storage for image uploads

## 📈 Advanced Usage

### Scheduled Automation (Optional)

Set up a cron job to run daily:

**Windows Task Scheduler:**
1. Create basic task
2. Trigger: Daily at 9:00 AM
3. Action: Start a program
   - Program: `node.exe`
   - Arguments: `C:\Users\User\Desktop\dev-port\scripts\automate-blog.js`
   - Start in: `C:\Users\User\Desktop\dev-port`

**macOS/Linux (crontab):**
```bash
0 9 * * * cd /path/to/dev-port && node scripts/automate-blog.js
```

### Add More Topics

The script currently uses `technology` as default topic. To customize:

```javascript
const TOPIC_MAP = {
  'AI': 'artificial-intelligence',
  'Space': 'science',
  'Security': 'technology',
  // Add more mappings
};
```

## 🎯 Best Practices

1. **Always review before publishing** - Automated content may need human touch
2. **Add personal insights** - Make it uniquely yours
3. **Check links** - Ensure all source links work
4. **Vary cover images** - Keep visual content fresh
5. **Monitor performance** - Track which posts get most engagement

## 📝 Example Output

```markdown
## Top Tech News - April 20, 2026

Here are today's most important developments in technology, AI, and innovation:

---

### 1. GitHub's Fake Star Economy Exposed

**Source:** Hacker News

[Read full story →](https://awesomeagents.ai/news/github-fake-stars-investigation/)

---

### 2. Blue Origin's Mixed Rocket Results

**Source:** Ars Technica

[Read full story →](https://arstechnica.com/space/...)

---
```

## 🆘 Support

If you encounter issues:

1. Check Supabase dashboard for table schema
2. Verify `.env.local` credentials
3. Test internet connectivity
4. Review console error messages

## 📄 License

Part of DevPort project. See main repository for license details.

---

**Created:** April 20, 2026  
**Version:** 1.0.0  
**Maintained by:** DevPort Team
