import { z } from "zod"
import { router, publicProcedure } from "../trpc" // Replace 'protectedProcedure' with 'publicProcedure' if applicable

export const dashboardRouter = router({
  getStats: protectedProcedure
    .query(async ({ ctx }) => {
      // Replace with your actual data fetching logic
      const totalItems = await ctx.prisma.asset.count()
      const totalFirearmsIn = await ctx.prisma.asset.count({
        where: { status: 'IN' } // Adjust based on your schema
      })
      const totalFirearmsIssued = await ctx.prisma.asset.count({
        where: { status: 'ISSUED' } // Adjust based on your schema
      })

      return {
        totalItems,
        totalFirearmsIn,
        totalFirearmsIssued,
      }
    }),
})