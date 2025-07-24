// pages/api/download_template_asset.js or .ts

import { NextApiRequest, NextApiResponse } from "next"
import * as XLSX from "xlsx"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { data } = req.body

  const ws = XLSX.utils.json_to_sheet(
    data !== null && data !== undefined ? data : []
  )

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, "Assets")

  const buffer = XLSX.write(wb, { bookType: "xlsx", type: "buffer" })

  res.setHeader(
    "Content-Disposition",
    "attachment; filename=Asset_Template.xlsx"
  )
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  )
  res.status(200).send(buffer)
}
