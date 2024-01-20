'use client'
import Button from '@/app/components/Button'
import Input from '@/app/components/Input'
import Loading from '@/app/components/Loading'
import ShakeCard from '@/app/components/ShakeCard'
import { SIGN_IN } from '@/app/graphql/mutations/UserMutations'
import { useTrigger } from '@/app/hooks/useTrigger'
import { SignInValidation } from '@/app/validations/SignInValidation'
import { useMutation } from '@apollo/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type FormEvent, useRef, useState, useEffect } from 'react'

export default function Content() {
  const router = useRouter()
  const [signIn, { data }] = useMutation(SIGN_IN)
  const formRef = useRef<HTMLFormElement>(null)
  const [errorTrigger, setErrorTrigger] = useTrigger()
  const [errors, setErrors] = useState<string[]>([])
  const validation = new SignInValidation()
  const [loading, setLoading] = useState(false)

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (formRef.current !== null) {
      const formData = new FormData(formRef.current)
      const errorList = validation.validate(formData)
      setErrors(errorList)
      if (errorList.length > 0) {
        setErrorTrigger(true)
        return
      }
      try {
        setLoading(true)
        await signIn({
          variables: {
            username: formData.get('username'),
            password: formData.get('password'),
          },
        })
        setLoading(false)
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message)
          setErrors(['server:' + error.message])
          setErrorTrigger(true)
          setLoading(false)
        }
      }
    }
  }

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (data) {
      const {
        signIn: { token },
      } = data
      localStorage.setItem('token', token as string)
      router.push('/home')
    }
  }, [data, router])

  return (
    <div className="sign-in flex flex-col gap-4">
      <Loading open={loading} />
      <ShakeCard trigger={errorTrigger}>
        <h1>Sign In</h1>
        <form
          ref={formRef}
          onSubmit={async (e) => {
            await handleSignUp(e)
          }}
          className="flex flex-col gap-4"
        >
          <Input name="username" label="Username" />
          <Input name="password" label="Password" type="password" />
          <Button type="submit" delay={0.5}>
            Sign In
          </Button>
        </form>
      </ShakeCard>
      <p className=" text-red-500">{validation.convertToMessage(errors[0])}</p>
      <Link href="/sign-up"> I Don&apos;t Have An Account</Link>
    </div>
  )
}
