import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import requestIp from "request-ip"

export default async function myRoute(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const detectedIp = requestIp.getClientIp(req)
  // console.log(detectedIp)
  res.status(201).json(detectedIp)
}
