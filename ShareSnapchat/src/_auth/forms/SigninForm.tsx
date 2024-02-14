import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from '@/components/ui/button'
import {Link,useNavigate} from 'react-router-dom'
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {  Signinvalidation } from "@/lib/validation"
import { z } from "zod"
import Loader from "@/components/shared/Loader"
import {  useToast } from "@/components/ui/use-toast"
import {  useSignInAccount } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"


function SigninForm() {
  const {toast}=useToast();
  const {checkAuthUser,isLoading:isUserLoading}=useUserContext();
  const navigate=useNavigate()

  //Queries
   const {mutateAsync:signInAccount}=
   useSignInAccount();


  // 1. Define your form.
  const form = useForm<z.infer<typeof Signinvalidation>>({
    resolver: zodResolver(Signinvalidation),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof Signinvalidation>) {

    const session=await signInAccount({
      email: values.email,
      password: values.password,
    });

    if(!session)
    {
      return toast({title:'Sign in failed. Please try again.'})
    }
       
     const isLoggedIn=await checkAuthUser();
     if(isLoggedIn)
     {
      form.reset();
      
      navigate("/");

     }
     else{
      return toast({title:'Sign up Failed. Please try again.'})
     }
  };
  return (
    <Form {...form} >
      <div className="sm:w-60  flex-center flex-col mt-2 ">

        <img src="/assets/images/logo.svg" alt="logo" />
        <h2 className="h2-bold md:h3-bold pt-2 sm:pt-8 py-1 text-2xl sm:text-base">Log in account</h2>
        <p className="text-light-3 w-full md:base-regular mt-1 text-center sm:text-left ">Welcome back!</p>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3 w-full ">
        
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

          <Button type="submit" className="shad-button_primary flex-center mt-2" >
            {isUserLoading ? (
              <div className="flex-center gap-5">
                <Loader />Loading...
              </div>
            ) :
              "Sign-in"
            }
          </Button>
          <p className="text-small-regular text-light-2">
              Don't have an Account?
             <Link to="/sign-up" className="text-primary-500 text-small-semibold ml-1">Sign-up</Link>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SigninForm