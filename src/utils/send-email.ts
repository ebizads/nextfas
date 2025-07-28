const getBaseUrl = () => {
  if (typeof window !== "undefined") return "" // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}` // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}` // dev SSR should use localhost
}

export async function sendForgotEmail(data: {
  sendTo: string
  name: string
  code: string
  date: Date
  baseUrl: string
}) {
  const apiEndpoint = `${getBaseUrl()}/api/sendForgotEmail`

  try {
    const res = await fetch(apiEndpoint, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })

    const response = await res.json()
    return response // ✅ RETURN THE PARSED RESPONSE
  } catch (err) {
    throw err
  }
}
