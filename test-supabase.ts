import { createClient } from '@supabase/supabase-js'
import dns from 'dns'

// Force IPv4 first
dns.setDefaultResultOrder('ipv4first')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  console.log('Testing Supabase queries with IPv4 forced...')
  console.time('fetch sections')
  const { data: sections, error: err1 } = await supabase.from('landing_sections').select('*')
  console.timeEnd('fetch sections')
  console.log('Sections:', sections?.length, 'Error:', err1?.message)
}

test()
