import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function Register(){
  const navigate=useNavigate();
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");

  const handleRegister=async()=>{
    try{
      await api.post("/auth/register",{name,email,password});
      navigate("/");
    }catch(e:any){
      alert(e?.response?.data?.detail||"Register failed");
    }
  };

  return(
    <div className="h-screen flex justify-center items-center">
      <div className="bg-white shadow p-6 rounded w-80">
        <h2 className="text-xl font-bold mb-4">Register</h2>

        <input className="border p-2 w-full mb-2" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} />

        <input className="border p-2 w-full mb-2" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />

        <input type="password" className="border p-2 w-full mb-3" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />

        <button onClick={handleRegister} className="bg-green-600 text-white w-full p-2 rounded">
          Register
        </button>

        <p className="mt-3 text-sm">
          <Link to="/" className="text-blue-600">Login</Link>
        </p>
      </div>
    </div>
  );
}
