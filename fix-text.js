import fs from 'fs'
import path from 'path'

const dir = path.join(process.cwd(), 'src', 'components', 'landing')
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'))

for (const file of files) {
  const filePath = path.join(dir, file)
  let content = fs.readFileSync(filePath, 'utf8')
  
  // Add whitespace-pre-line to subtitles
  content = content.replace(
    /<p className="text-lg text-gray-500">\{section\.subtitle\}<\/p>/g,
    '<p className="text-lg text-gray-500 whitespace-pre-line">{section.subtitle}</p>'
  )
  
  // Add whitespace-pre-line and text-start to contents
  content = content.replace(
    /<p className="mt-4 text-gray-600">\{section\.content\}<\/p>/g,
    '<p className="mt-4 text-gray-600 whitespace-pre-line text-start">{section.content}</p>'
  )
  content = content.replace(
    /<p className="mt-4 text-gray-600 max-w-2xl mx-auto">\{section\.content\}<\/p>/g,
    '<p className="mt-4 text-gray-600 max-w-2xl mx-auto whitespace-pre-line text-start">{section.content}</p>'
  )
  content = content.replace(
    /<div className="mt-12 bg-primary\/5 p-6 rounded-2xl text-center max-w-3xl mx-auto text-gray-600">/g,
    '<div className="mt-12 bg-primary/5 p-6 rounded-2xl text-start max-w-3xl mx-auto text-gray-600 whitespace-pre-line">'
  )

  // Testimonials comments
  content = content.replace(
    /<p className="text-gray-700 italic mb-4">"\{t\.comment\}"<\/p>/g,
    '<p className="text-gray-700 italic mb-4 whitespace-pre-line text-start">"{t.comment}"</p>'
  )

  // FAQ answers
  content = content.replace(
    /<p className="text-gray-600 mt-4 leading-relaxed">/g,
    '<p className="text-gray-600 mt-4 leading-relaxed whitespace-pre-line text-start">'
  )

  // Offers description
  content = content.replace(
    /<p className="text-gray-500 mb-6 min-h-\[48px\]">\{offer\.short_description\}<\/p>/g,
    '<p className="text-gray-500 mb-6 min-h-[48px] whitespace-pre-line text-start">{offer.short_description}</p>'
  )

  // Benefits paragraph
  content = content.replace(
    /<p className="whitespace-pre-line text-gray-700 text-lg leading-relaxed">/g,
    '<p className="whitespace-pre-line text-gray-700 text-lg leading-relaxed text-start">'
  )

  // Hero section specific
  content = content.replace(
    /<p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">/g,
    '<p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed whitespace-pre-line text-start">'
  )

  fs.writeFileSync(filePath, content, 'utf8')
}

// Update page.tsx
const pagePath = path.join(process.cwd(), 'src', 'app', 'page.tsx')
let pageContent = fs.readFileSync(pagePath, 'utf8')

pageContent = pageContent.replace(
  /<p className="text-lg text-gray-500">\{sectionMap\['product'\]\.subtitle\}<\/p>/g,
  '<p className="text-lg text-gray-500 whitespace-pre-line">{sectionMap[\'product\'].subtitle}</p>'
)

pageContent = pageContent.replace(
  /<p className="mt-4 text-gray-600">\{sectionMap\['product'\]\.content\}<\/p>/g,
  '<p className="mt-4 text-gray-600 whitespace-pre-line text-start">{sectionMap[\'product\'].content}</p>'
)

pageContent = pageContent.replace(
  /<div className="prose prose-lg max-w-4xl mx-auto text-gray-600 whitespace-pre-line text-center">/g,
  '<div className="prose prose-lg max-w-4xl mx-auto text-gray-600 whitespace-pre-line text-start">'
)

fs.writeFileSync(pagePath, pageContent, 'utf8')

console.log('Fixed alignments and whitespace')
