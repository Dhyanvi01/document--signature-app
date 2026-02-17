import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function Login() {
  const navigate = useNavigate();
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");

  const handleLogin=async()=>{
    const form=new URLSearchParams();
    form.append("username",email);
    form.append("password",password);

    try{
      const res=await api.post("/auth/login",form,{
        headers:{ "Content-Type":"application/x-www-form-urlencoded" }
      });

      localStorage.setItem("token",res.data.access_token);
      navigate("/dashboard");
    }catch(e:any){
      alert(e?.response?.data?.detail||"Login failed");
    }
  };

  return(
    <div className="h-screen flex justify-center items-center">
      <div className="bg-white shadow p-6 rounded w-80">
        <h2 className="text-xl font-bold mb-4">Login</h2>

        <input className="border p-2 w-full mb-2" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />

        <input type="password" className="border p-2 w-full mb-3" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />

        <button onClick={handleLogin} className="bg-blue-600 text-white w-full p-2 rounded">
          Login
        </button>

        <p className="mt-3 text-sm">
          <Link to="/register" className="text-blue-600">Register</Link>
        </p>
      </div>
    </div>
  );
}
