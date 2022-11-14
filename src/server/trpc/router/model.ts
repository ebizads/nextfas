import { ModelCreateInput, ModelEditInput } from "../../schemas/model"
import { authedProcedure, t } from "../trpc"

export const modelRouter = t.router({
  create: authedProcedure
    .input(ModelCreateInput)
    .mutation(async ({ ctx, input }) => {
      const {
        asset_class,
        asset_category,
        asset_type,
        assetCategoryId,
        assetClassId,
        assetTypeId,
        ...rest
      } = input
      const model = await ctx.prisma.model.create({
        data: {
          ...rest,
          class: {
            connectOrCreate: {
              where: {
                id: assetClassId,
              },
              create: { name: asset_class?.name ?? "" },
            },
          },
          category: {
            connectOrCreate: {
              where: {
                id: assetCategoryId,
              },
              create: { name: asset_category?.name ?? "" },
            },
          },
          type: {
            connectOrCreate: {
              where: {
                id: assetTypeId,
              },
              create: { name: asset_type?.name ?? "" },
            },
          },
        },
      })
      return model
    }),
  edit: authedProcedure
    .input(ModelEditInput)
    .mutation(async ({ ctx, input }) => {
      const {
        asset_class,
        asset_category,
        asset_type,
        assetCategoryId,
        assetClassId,
        assetTypeId,
        ...rest
      } = input
      const model = await ctx.prisma.model.update({
        where: { id: input.id },
        data: {
          ...rest,
          class: {
            connectOrCreate: {
              where: {
                id: assetClassId,
              },
              create: { name: asset_class?.name ?? "" },
            },
          },
          category: {
            connectOrCreate: {
              where: {
                id: assetCategoryId,
              },
              create: { name: asset_category?.name ?? "" },
            },
          },
          type: {
            connectOrCreate: {
              where: {
                id: assetTypeId,
              },
              create: { name: asset_type?.name ?? "" },
            },
          },
        },
      })
      return model
    }),
})
