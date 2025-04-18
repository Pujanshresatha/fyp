import React, { useState, useEffect } from 'react';
import { setloginStatus } from '../../Redux/login/isLogin';
import { useDispatch } from 'react-redux';
import baseurl from '../../utils/baseurl';
import { useForm } from 'react-hook-form';
import { EnvelopeIcon, EyeIcon, EyeSlashIcon, KeyIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const Auth = () => {
  const [isLoginPage, setisLoginPage] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [eyePassword, seteyePassword] = useState(false);
  const [eyeConfirmPassword, seteyeConfirmPassword] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    defaultValues: {
      btnOption: isLoginPage ? 'LOGIN' : 'REGISTER',
      email: '',
      password: '',
      cpassword: '',
    },
  });

  // Update btnOption when isLoginPage changes
  useEffect(() => {
    setValue('btnOption', isLoginPage ? 'LOGIN' : 'REGISTER');
  }, [isLoginPage, setValue]);

  const validateEmail = (email) => {
    if (!email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      return 'Invalid email format';
    }
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':",.<>/?]).{8,}$/;
    if (!regex.test(password)) {
      return 'Password must be at least 8 characters, include uppercase, lowercase, number, and special character.';
    }
  };

  const loginUser = async (obj) => {
    console.log('baseurl:', baseurl);
    console.log('Request payload:', obj);
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(obj),
      credentials: 'include',
    };

    try {
      const response = await fetch(`${baseurl}/login`, requestOptions);
      console.log('Response status:', response.status);
      console.log('Response headers:', [...response.headers]);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status} ${response.statusText}`);
      }
      const result = await response.json();
      console.log('Response data:', result);
      if (result.status) {
        dispatch(setloginStatus(true));
        toast.success('Login success');
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        toast.error(result.message || 'Invalid credentials');
        console.error('Error::Auth::loginUser::result', result.message);
      }
    } catch (error) {
      console.error('Error::Auth::loginUser', error);
      if (error.message.includes('Failed to fetch')) {
        toast.error('Unable to connect to the server. Check CORS settings (ensure backend allows http://localhost:5173), backend status, or browser extensions.');
      } else {
        toast.error(`Login failed: ${error.message}`);
      }
    }
  };

  const registerUser = async (obj) => {
    console.log('baseurl:', baseurl);
    console.log('Request payload:', obj);
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(obj),
      credentials: 'include',
    };

    try {
      const response = await fetch(`${baseurl}/register`, requestOptions);
      console.log('Response status:', response.status);
      console.log('Response headers:', [...response.headers]);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status} ${response.statusText}`);
      }
      const result = await response.json();
      console.log('Response data:', result);
      if (result.status) {
        toast.success('Registration success! Login to account');
        setisLoginPage(true);
        reset();
      } else {
        toast.error(result.message || 'Registration failed');
        console.error('Error::Auth::registerUser::result', result.message);
      }
    } catch (error) {
      console.error('Error::Auth::registerUser', error);
      if (error.message.includes('Failed to fetch')) {
        toast.error('Unable to connect to the server. Check CORS settings (ensure backend allows http://localhost:5173), backend status, or browser extensions.');
      } else {
        toast.error(`Registration failed: ${error.message}`);
      }
    }
  };

  const onSubmit = (data) => {
    console.log('Form data:', data);
    if (data.btnOption === 'REGISTER') {
      if (data.password !== data.cpassword) {
        toast.error('Passwords do not match!');
        return;
      }
      const { email, password, cpassword, btnOption } = data;
      registerUser({ email, password, cpassword, btnOption });
    } else {
      const { email, password, btnOption } = data;
      loginUser({ email, password, btnOption });
    }
  };

  return (
    <main className="px-4 md:w-2/3 md:mx-auto">
      <div className="h2 text-center text-xl font-bold">{isLoginPage ? 'Login into Account' : 'Register Account'}</div>
      <div className="flex justify-center mx-auto mt-4">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full lg:max-w-xs" autoComplete="off" noValidate>
          {/* Email */}
          <label className={`input input-bordered flex items-center gap-2 rounded-lg ${errors.email ? 'input-error' : 'input-success'}`}>
            <EnvelopeIcon className="h-4 w-4 opacity-70" />
            <input
              type="text"
              name="email"
              className="grow bg-transparent"
              placeholder="Email"
              {...register('email', { validate: validateEmail })}
            />
          </label>
          <div className="label-text text-xs text-error h-8 pt-2">{errors.email && <p>{errors.email.message}</p>}</div>

          {/* Password */}
          <label className={`input input-bordered flex items-center gap-2 rounded-lg ${errors.password ? 'input-error' : 'input-success'}`}>
            <KeyIcon className="h-4 w-4 opacity-70" />
            <input
              type={eyePassword ? 'text' : 'password'}
              name="password"
              className="grow bg-transparent"
              placeholder="Password"
              {...register('password', { validate: validatePassword })}
            />
            {eyePassword ? (
              <EyeIcon className="h-4 w-4 opacity-70" onClick={() => seteyePassword(!eyePassword)} />
            ) : (
              <EyeSlashIcon className="h-4 w-4 opacity-70" onClick={() => seteyePassword(!eyePassword)} />
            )}
          </label>
          <div className="label-text text-xs text-error h-8 pt-2">{errors.password && <p>{errors.password.message}</p>}</div>
          <div className="label">
            <span className="label-text text-xs text-gray-500">
              Min 8 chars, including uppercase, lowercase, number, and special character.
            </span>
          </div>

          {/* Confirm Password (only for register) */}
          {!isLoginPage && (
            <>
              <label
                className={`input input-bordered flex items-center gap-2 rounded-lg ${errors.cpassword ? 'input-error' : 'input-success'}`}
              >
                <KeyIcon className="h-4 w-4 opacity-70" />
                <input
                  type={eyeConfirmPassword ? 'text' : 'password'}
                  name="cpassword"
                  className="grow bg-transparent"
                  placeholder="Confirm password"
                  {...register('cpassword', { validate: validatePassword })}
                />
                {eyeConfirmPassword ? (
                  <EyeIcon className="h-4 w-4 opacity-70" onClick={() => seteyeConfirmPassword(!eyeConfirmPassword)} />
                ) : (
                  <EyeSlashIcon className="h-4 w-4 opacity-70" onClick={() => seteyeConfirmPassword(!eyeConfirmPassword)} />
                )}
              </label>
              <div className="label-text text-xs text-error h-8 pt-2">{errors.cpassword && <p>{errors.cpassword.message}</p>}</div>
            </>
          )}

          <input type="hidden" {...register('btnOption')} />

          {isLoginPage ? (
            <input type="submit" className="btn w-full lg:max-w-xs btn-primary mt-4" value="Login" />
          ) : (
            <input type="submit" className="btn w-full lg:max-w-xs btn-primary mt-4" value="Register" />
          )}
        </form>
      </div>

      <div className="more text-center mt-4">
        <h5>OR</h5>
        {isLoginPage ? (
          <div>
            Do not have an account?{' '}
            <span className="underline cursor-pointer" onClick={() => setisLoginPage(false)}>
              Register
            </span>
          </div>
        ) : (
          <div>
            Already have an account?{' '}
            <span className="underline cursor-pointer" onClick={() => setisLoginPage(true)}>
              Login
            </span>
          </div>
        )}
      </div>

      <Toaster />
    </main>
  );
};

export default Auth;