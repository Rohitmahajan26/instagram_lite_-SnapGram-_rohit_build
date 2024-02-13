import * as z from "zod"

export const Signupvalidation = z.object({
    name:z.string().min(2,{message:"this is worng input"}),
    username: z.string().min(2,{message:"to short"}),
    email:z.string().email(),
    password:z.string().min(8,{message:'Password must be at list 8 Character '})
})

export const Signinvalidation = z.object({
    email:z.string().email(),
    password:z.string().min(8,{message:'Password must be at list 8 Character '})
})

export const PostValidation = z.object({
    caption:z.string().min(5).max(2200),
    file:z.custom<File[]>(),
    location:z.string().min(2).max(100),
    tags:z.string(),
})

// profile validation


export const ProfileValidation = z.object({
    file: z.custom<File[]>(),
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    username: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email(),
    bio: z.string(),
  });