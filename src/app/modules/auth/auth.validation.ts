import { z } from "zod";

const loginZodSchema = z.object({
  body: z.object({
    password: z.string({
      required_error: "Password is required",
    }),
    email: z.string({
      required_error: "Email is required",
    }),
  }),
});

const refreshTokenZodSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: "Refresh Token is required",
    }),
  }),
});

const changePasswordZodSchema = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: "Old password  is required",
    }),
    newPassword: z.string({
      required_error: "New password  is required",
    }),
  }),
});

const changePasswordBYAdmin = z.object({
  body: z.object({
    id: z.string({
      required_error: "id is required",
    }),
    password: z.string({
      required_error: " password  is required",
    }),
  }),
});
export const AuthValidation = {
  loginZodSchema,
  refreshTokenZodSchema,
  changePasswordZodSchema,
  changePasswordBYAdmin,
};
