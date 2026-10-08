import dns from 'dns'
dns.setDefaultResultOrder('ipv4first')

async function test() {
  try {
    const res = await fetch('https://aikbpjspogpsxufixrsn.supabase.co/rest/v1/', {
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`
      }
    })
    console.log('Status:', res.status)
  } catch (e: any) {
    console.error('Fetch error:', e.message)
    console.error('Cause:', e.cause)
  }
}

test()
