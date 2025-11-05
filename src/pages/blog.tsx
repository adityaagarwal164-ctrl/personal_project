import Link from 'next/link'
import SEO from '@/components/SEO'

const blogPosts = [
  {
    id: 1,
    title: "Top 10 Project Management Tools for Remote Teams in 2024",
    excerpt: "Discover the best project management software that helps remote teams stay organized, collaborate effectively, and deliver projects on time.",
    author: "Sarah Johnson",
    date: "November 3, 2024",
    readTime: "8 min read",
    category: "Project Management",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80",
    content: `
      <p>Managing remote teams has become the new normal, and having the right project management tool can make all the difference. After testing dozens of platforms, here are our top picks:</p>
      
      <h2>1. Notion - The All-in-One Workspace</h2>
      <p>Notion combines notes, tasks, wikis, and databases in one flexible platform. Perfect for teams that want customization and don't mind a learning curve.</p>
      <p><strong>Best for:</strong> Small to medium teams who value flexibility</p>
      <p><strong>Pricing:</strong> Free for personal use, $10/month for teams</p>
      
      <h2>2. Asana - Enterprise-Ready Task Management</h2>
      <p>Asana excels at breaking down complex projects into manageable tasks with clear dependencies and timelines. The timeline view is particularly useful for project planning.</p>
      <p><strong>Best for:</strong> Marketing and creative teams</p>
      <p><strong>Pricing:</strong> Free for basic features, Premium from $13.49/user</p>
      
      <h2>3. Monday.com - Visual Work Operating System</h2>
      <p>With its colorful, intuitive interface, Monday.com makes project tracking actually enjoyable. The automation features save hours of manual work.</p>
      <p><strong>Best for:</strong> Teams that want visual workflows</p>
      <p><strong>Pricing:</strong> From $9/seat/month</p>
      
      <h2>4. ClickUp - Feature-Packed Alternative</h2>
      <p>ClickUp tries to replace all your productivity tools with one app. It's incredibly powerful but can feel overwhelming at first.</p>
      <p><strong>Best for:</strong> Power users who want everything in one place</p>
      <p><strong>Pricing:</strong> Free forever plan available, Unlimited $7/month</p>
      
      <h2>5. Trello - Simple Kanban Boards</h2>
      <p>Trello's simplicity is its strength. If you need straightforward kanban boards without the bells and whistles, Trello is perfect.</p>
      <p><strong>Best for:</strong> Small teams and simple projects</p>
      <p><strong>Pricing:</strong> Free, Standard $6/user/month</p>
      
      <h2>Key Takeaways</h2>
      <ul>
        <li>Choose tools based on your team size and complexity needs</li>
        <li>Most tools offer free trials - test before committing</li>
        <li>Integration with existing tools is crucial</li>
        <li>Don't over-complicate - simpler is often better</li>
      </ul>
      
      <p>The right project management tool can transform how your remote team works. Start with a free trial and see which one fits your workflow best.</p>
    `
  },
  {
    id: 2,
    title: "How to Choose the Right CRM for Your Startup",
    excerpt: "A comprehensive guide to selecting a CRM that grows with your business, from free options to enterprise solutions.",
    author: "Michael Chen",
    date: "November 1, 2024",
    readTime: "10 min read",
    category: "Sales",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    content: `
      <p>Choosing your first CRM is a big decision. Here's everything you need to know to make the right choice for your startup.</p>
      
      <h2>Why Your Startup Needs a CRM</h2>
      <p>As your customer base grows, spreadsheets become unmanageable. A CRM helps you:</p>
      <ul>
        <li>Track every customer interaction</li>
        <li>Automate follow-ups and reminders</li>
        <li>Analyze sales performance</li>
        <li>Scale your sales process</li>
      </ul>
      
      <h2>Key Features to Look For</h2>
      <p><strong>1. Contact Management:</strong> Easy way to store and organize customer information</p>
      <p><strong>2. Pipeline Visualization:</strong> See where each deal stands at a glance</p>
      <p><strong>3. Email Integration:</strong> Track all communications in one place</p>
      <p><strong>4. Automation:</strong> Save time on repetitive tasks</p>
      <p><strong>5. Reporting:</strong> Understand what's working and what's not</p>
      
      <h2>Top CRM Options for Startups</h2>
      
      <h3>HubSpot CRM (Free)</h3>
      <p>HubSpot offers a genuinely free CRM with unlimited users. Perfect for bootstrapped startups. The paid tiers add marketing automation and advanced features.</p>
      
      <h3>Pipedrive ($14.90/user/month)</h3>
      <p>Built by salespeople for salespeople. The visual pipeline makes it easy to see your sales funnel at a glance.</p>
      
      <h3>Salesforce (From $25/user/month)</h3>
      <p>The industry standard, but can be overkill (and expensive) for early-stage startups. Consider it when you have a dedicated sales team.</p>
      
      <h2>Common Mistakes to Avoid</h2>
      <ul>
        <li>Choosing based on features you don't need yet</li>
        <li>Not considering integration with your existing tools</li>
        <li>Ignoring the learning curve for your team</li>
        <li>Forgetting to factor in long-term costs as you scale</li>
      </ul>
      
      <h2>Final Recommendation</h2>
      <p>Start with HubSpot's free CRM if you're pre-revenue or very early stage. Upgrade to Pipedrive when you have a small sales team. Move to Salesforce only when you need enterprise features.</p>
    `
  },
  {
    id: 3,
    title: "Design Tools Comparison: Figma vs Adobe XD vs Sketch",
    excerpt: "An in-depth comparison of the three leading UI/UX design tools to help you choose the right one for your team.",
    author: "Emily Rodriguez",
    date: "October 28, 2024",
    readTime: "12 min read",
    category: "Design",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
    content: `
      <p>The battle between design tools is heating up. Let's compare the three major players and help you decide which is right for your team.</p>
      
      <h2>Figma - The Collaboration Champion</h2>
      <p>Figma has taken the design world by storm with its browser-based, real-time collaboration features.</p>
      
      <h3>Pros:</h3>
      <ul>
        <li>✓ Real-time collaboration (like Google Docs for design)</li>
        <li>✓ Browser-based - works on any OS</li>
        <li>✓ Free for individuals</li>
        <li>✓ Excellent component system</li>
        <li>✓ Growing plugin ecosystem</li>
      </ul>
      
      <h3>Cons:</h3>
      <ul>
        <li>✗ Requires stable internet connection</li>
        <li>✗ Can be slow with very large files</li>
        <li>✗ Limited offline functionality</li>
      </ul>
      
      <p><strong>Best for:</strong> Remote teams, agencies, and collaborative environments</p>
      
      <h2>Adobe XD - The Adobe Suite Integration</h2>
      <p>Adobe XD is Adobe's answer to Figma, with tight integration into the Creative Cloud ecosystem.</p>
      
      <h3>Pros:</h3>
      <ul>
        <li>✓ Seamless Adobe ecosystem integration</li>
        <li>✓ Fast performance</li>
        <li>✓ Good prototyping features</li>
        <li>✓ Free starter plan</li>
      </ul>
      
      <h3>Cons:</h3>
      <ul>
        <li>✗ Being discontinued (Adobe shifting focus to Figma)</li>
        <li>✗ Smaller community than Figma</li>
        <li>✗ Limited third-party plugins</li>
      </ul>
      
      <p><strong>Best for:</strong> Teams already using Adobe Creative Cloud (but consider Figma for the future)</p>
      
      <h2>Sketch - The Mac-Only Pioneer</h2>
      <p>Sketch pioneered modern UI design tools but has been losing ground to Figma.</p>
      
      <h3>Pros:</h3>
      <ul>
        <li>✓ Mature, stable platform</li>
        <li>✓ Extensive plugin ecosystem</li>
        <li>✓ One-time purchase option</li>
        <li>✓ Excellent Mac performance</li>
      </ul>
      
      <h3>Cons:</h3>
      <ul>
        <li>✗ Mac-only (deal-breaker for many teams)</li>
        <li>✗ Collaboration requires additional tools</li>
        <li>✗ File format compatibility issues</li>
        <li>✗ Losing market share to Figma</li>
      </ul>
      
      <p><strong>Best for:</strong> Solo Mac designers or small Mac-only teams</p>
      
      <h2>Feature Comparison Table</h2>
      <table>
        <tr>
          <th>Feature</th>
          <th>Figma</th>
          <th>Adobe XD</th>
          <th>Sketch</th>
        </tr>
        <tr>
          <td>Real-time Collaboration</td>
          <td>✓ Excellent</td>
          <td>✓ Good</td>
          <td>✗ Limited</td>
        </tr>
        <tr>
          <td>Cross-platform</td>
          <td>✓ Yes</td>
          <td>✓ Yes</td>
          <td>✗ Mac only</td>
        </tr>
        <tr>
          <td>Free Plan</td>
          <td>✓ Yes</td>
          <td>✓ Yes</td>
          <td>✗ No</td>
        </tr>
        <tr>
          <td>Prototyping</td>
          <td>✓ Excellent</td>
          <td>✓ Good</td>
          <td>✓ Good</td>
        </tr>
      </table>
      
      <h2>Our Recommendation</h2>
      <p><strong>Go with Figma</strong> unless you have a specific reason not to. It's the clear winner for most teams in 2024.</p>
      
      <p>Choose Adobe XD only if you're heavily invested in Adobe Creative Cloud, but be aware it's being phased out.</p>
      
      <p>Choose Sketch only if you're a solo Mac designer who values offline work and doesn't need collaboration.</p>
    `
  }
]

export default function Blog() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <SEO title="SaaS Blog - Insights, Reviews & Guides" description="Latest SaaS insights, tool reviews, and guides to help you choose the right software for your business." />
      
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500 via-blue-600 via-indigo-600 to-blue-800 animate-gradient py-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">SaaS Insights & Reviews</h1>
          <p className="text-xl text-blue-100">Expert guides, comparisons, and tips to help you choose the right tools</p>
        </div>
      </div>

      {/* Blog Posts */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map(post => (
            <article key={post.id} className="group rounded-2xl bg-white border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 transition-all duration-300">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                    {post.category}
                  </span>
                  <span className="text-sm text-slate-500">{post.readTime}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
                <p className="text-slate-600 mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="text-sm">
                    <div className="font-semibold text-slate-900">{post.author}</div>
                    <div className="text-slate-500">{post.date}</div>
                  </div>
                  <Link 
                    href={`/blog/${post.id}`}
                    className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all"
                  >
                    Read More
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
