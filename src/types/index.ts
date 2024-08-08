import { z } from "zod";

export const DataSchema = z.object({
  roomId: z.string().min(1, {
    message: "Room ID is required",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
});

export type Data = z.infer<typeof DataSchema>;

export type CustomFormData<T> = {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  showErrors?: boolean;
  areErrors?: boolean;
};
