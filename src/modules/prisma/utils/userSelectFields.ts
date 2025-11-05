import { Prisma } from '@prisma/client';

export const userSelectFields: Prisma.UserSelect = {
  id: true,
  name: true,
  email: true,
  password: false,
  role: true,
  createdAt: true,
  updatedAt: false,
};
