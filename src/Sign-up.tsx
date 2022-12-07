import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "./login"

export function Signup() {
    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const passwordConfirmRef = useRef<HTMLInputElement>(null)
    const { signup } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
  
    async function handleSubmit(e: { preventDefault: () => void }) {
      e.preventDefault()
  
      if (passwordRef.current?.value !== passwordConfirmRef.current?.value) {
        return setError('Passwords do not match')
      }
  
      try {
        setError('')
        setLoading(true)
        await signup(emailRef.current?.value, passwordRef.current?.value)
        navigate('/')
      } catch {
        setError('Failed to create an account')
      }
  
      setLoading(false)
    } 
    return(

    )
  }