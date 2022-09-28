import { z } from "zod";

export const AssetCreateInput = z.object({
  name: z.string(),
  number: z.string(),
  description: z.string().nullish(),
  serial_no: z.string().nullish(),
  project: z.string().nullish(),
  original_cost: z.number().nullish(),
  current_cost: z.number().nullish(),
  residual_value: z.number().nullish(),
  residual_value_percentage: z.number().nullish(),
  status: z.string().nullish(),
  lifetime: z.number().nullish(),
  netbook_value: z.number().nullish(),
  typeId: z.number().nullish(),
  categoryId: z.number().nullish(),
  userId: z.number().nullish(),
  model: z
    .object({
      name: z.string(),
      number: z.string().nullish(),
      brand: z.string().nullish(),
    })
    .nullish(),
  location: z
    .object({
      department: z.string().nullish(),
      floor: z.string().nullish(),
      class: z.string().nullish(),
    })
    .nullish(),
  manufacturerId: z.number().nullish(),
  supplierId: z.number().nullish(),
});

export const AssetEditInput = z.object({
  id: z.number(),
  name: z.string().optional(),
  number: z.string().optional(),
  description: z.string().optional(),
  serial_no: z.string().optional(),
  project: z.string().optional(),
  original_cost: z.number().optional(),
  current_cost: z.number().optional(),
  residual_value: z.number().optional(),
  residual_value_percentage: z.number().optional(),
  status: z.string().optional(),
  lifetime: z.number().optional(),
  netbook_value: z.number().optional(),
  typeId: z.number().optional(),
  categoryId: z.number().optional(),
  userId: z.number().optional(),
  model: z
    .object({
      name: z.string(),
      number: z.string().optional(),
      brand: z.string().optional(),
    })
    .optional(),
  location: z
    .object({
      department: z.string().optional(),
      floor: z.string().optional(),
      class: z.string().optional(),
    })
    .optional(),
  manufacturerId: z.number().optional(),
  supplierId: z.number().optional(),
});
