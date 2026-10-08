import fs from 'fs'
import path from 'path'

const dir = path.join(process.cwd(), 'src', 'components', 'landing')
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'))

for (const file of files) {
  const filePath = path.join(dir, file)
  let content = fs.readFileSync(filePath, 'utf8')
  
  content = content.replace(/bg-blue-600/g, 'bg-primary')
  content = content.replace(/text-blue-600/g, 'text-primary')
  content = content.replace(/shadow-blue-600/g, 'shadow-primary')
  content = content.replace(/ring-blue-600/g, 'ring-primary')
  content = content.replace(/focus:ring-blue-600/g, 'focus:ring-primary')
  content = content.replace(/from-blue-600/g, 'from-primary')
  content = content.replace(/to-indigo-600/g, 'to-secondary')
  
  content = content.replace(/text-blue-500/g, 'text-secondary')
  content = content.replace(/bg-blue-50/g, 'bg-primary/5')
  content = content.replace(/bg-blue-100/g, 'bg-primary/10')
  content = content.replace(/bg-indigo-100/g, 'bg-secondary/10')
  content = content.replace(/from-blue-100/g, 'from-primary/10')
  content = content.replace(/to-indigo-100/g, 'to-secondary/10')
  content = content.replace(/from-blue-50/g, 'from-primary/5')
  content = content.replace(/to-indigo-50/g, 'to-secondary/5')
  content = content.replace(/bg-blue-700/g, 'bg-[var(--primary-color)] brightness-90')
  content = content.replace(/from-blue-700/g, 'from-[var(--primary-color)] brightness-90')
  content = content.replace(/to-indigo-700/g, 'to-[var(--secondary-color)] brightness-90')

  fs.writeFileSync(filePath, content, 'utf8')
}

// Also update page.tsx
const pagePath = path.join(process.cwd(), 'src', 'app', 'page.tsx')
let pageContent = fs.readFileSync(pagePath, 'utf8')
pageContent = pageContent.replace(/bg-blue-600/g, 'bg-primary')
fs.writeFileSync(pagePath, pageContent, 'utf8')

console.log('Replaced colors')
