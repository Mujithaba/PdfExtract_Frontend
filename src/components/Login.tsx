import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginUser } from '../api/userApi';
import { setCredential } from '../redux/slice/authSlice';
import { RootState } from '../redux/store';
import { useSelector } from 'react-redux';

export default function Login() {


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {userInfo}= useSelector((state:RootState)=>state.auth)

    
  
    useEffect(()=>{
      if (userInfo) {
        navigate('/pdfExtractor')
      }
    },[userInfo])
  
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const newErrors: { [key: string]: string } = {};
  
      // Basic validation
      if (!email) newErrors.email = 'Email is required';
      if (!password) newErrors.password = 'Password is required';
  
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
  
      // Reset errors and handle form submission (you can replace this with actual logic)
      setErrors({});
      handleLogin();
      console.log('Login submitted:', { email, password });
      // Here you would typically send the data to your backend for authentication
    };


    const handleLogin =async()=>{
        try {
            const userData ={
                email,
                password
            }

            const response = await loginUser(userData)
            console.log(response,"loginUser");
            if (response.status == 200) {
                toast.success("SuccessFully Logged")
                localStorage.setItem("token", response.token);
                dispatch(setCredential(response.user))
                navigate('/pdfExtractor')
            }
            
        } catch (error) {
            console.log(error,"ooo");
        
           
          }
    }


    return (
        <div className="max-w-md mx-auto mt-10">
          <h2 className="text-2xl font-bold text-center mb-5">Login</h2>
          <form onSubmit={handleSubmit} className="bg-gray-300 shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
            </div>
    
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter your password"
              />
              {errors.password && <p className="text-red-500 text-xs italic">{errors.password}</p>}
            </div>
    
            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="bg-green-950 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Login
              </button>
            </div>
            <div className='flex m-3 justify-center'>
            <p className='font-sans text-sm mr-2'>Don't have an account..! </p> 
            <button className='text-blue-600 underline text-sm' onClick={()=>navigate('/register')}>Register</button>
          </div>
          </form>
        </div>
      );
}
