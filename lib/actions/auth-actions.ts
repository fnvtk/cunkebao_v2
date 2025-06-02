"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

const schema = z.object({
  account: z.string().min(1, { message: "账号不能为空" }),
  password: z.string().min(1, { message: "密码不能为空" }),
})

export async function authenticate(prevState: any, formData: FormData) {
  const validatedFields = schema.safeParse({
    account: formData.get("account"),
    password: formData.get("password"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Login.",
    }
  }

  const { account, password } = validatedFields.data

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ account: account, password: password, typeId: 1 }),
    })

    const data = await response.json()

    if (data.code === 10000) {
      cookies().set("token", data.data.token)
      revalidatePath("/profile")
      return { success: true }
    } else {
      return { error: data.message }
    }
  } catch (error: any) {
    console.error("Authentication error:", error)
    return { error: error.message || "Something went wrong!" }
  }
}
