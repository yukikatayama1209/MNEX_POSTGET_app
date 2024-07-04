import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Login: React.FC = () => {
  const [isNewUser, setIsNewUser] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  })
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:8000/token', new URLSearchParams({
        username: formData.username,
        password: formData.password
      }))
      localStorage.setItem('token', response.data.access_token)
      navigate('/home')
    } catch (error) {
      console.error(error)
      alert('Login failed')
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }
    try {
      const response = await axios.post('http://localhost:8000/register', {
        username: formData.username,
        password: formData.password
      })
      if (response.data.success) {
        handleLogin(e)  // Registration successful, proceed to login
      } else {
        alert('Registration failed')
      }
    } catch (error) {
      console.error(error)
      alert('Registration failed')
    }
  }

  return (
    <div>
      {isNewUser ? (
        <form onSubmit={handleRegister}>
          <h2>Register</h2>
          <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} />
          <button type="submit">Register</button>
          <button type="button" onClick={() => setIsNewUser(false)}>Already have an account? Login</button>
        </form>
      ) : (
        <form onSubmit={handleLogin}>
          <h2>Login</h2>
          <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
          <button type="submit">Login</button>
          <button type="button" onClick={() => setIsNewUser(true)}>New user? Register</button>
        </form>
      )}
    </div>
  )
}

export default Login
