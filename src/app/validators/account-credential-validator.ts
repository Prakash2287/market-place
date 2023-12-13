import { z } from "zod";
export const schemaValidationForAuthentication = z.object({
    email: z.string().email(),
    password: z.string().min(8, {
      message: "Password must be atleast 8 characters long",
    }),
  });

  export type TschemaValidationForAuthentication = z.infer<
    typeof schemaValidationForAuthentication
  >;
  
