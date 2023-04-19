import { z } from "zod"

export const AddLocationDetails = z.object({
    building: z.string().optional().nullish(),
    floor: z.string().optional().nullish(),
    room: z.string().optional().nullish(),
  })


  export const UpdateLocationDetails = z.object({
    building: z.string().optional().nullish(),
    floor: z.string().optional().nullish(),
    room: z.string().optional().nullish(),
  })

