import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

type Doc={
  id:number;
  title?:string;
  original_filename?:string;
  created_at?:string;
};

export default function Dashboard(){

  const navigate = useNavigate();

  const [docs,setDocs]=useState<Doc[]>([]);
  const [loading,setLoading]=useState(true);
  const [file,setFile]=useState<File|null>(null);
  const [title,setTitle]=useState("");
  const [preview,setPreview]=useState<string|null>(null);
  const [searchId,setSearchId]=useState("");

  const loadDocs=()=>{
    setLoading(true);
    api.get("/documents/")
      .then(res=>setDocs(res.data||[]))
      .catch(()=>setDocs([]))
      .finally(()=>setLoading(false));
  };

  useEffect(()=>{ loadDocs(); },[]);

  const upload=async()=>{
    if(!file){
      alert("Select a PDF first");
      return;
    }

    const form=new FormData();
    form.append("file",file);

    if(title.trim()){
      form.append("title",title);
    }

    try{
      await api.post("/documents/upload",form);
      alert("Upload successful");
      setFile(null);
      setTitle("");
      loadDocs();
    }catch(e:any){
      console.error(e.response?.data);
      alert(e.response?.data?.detail || "Upload failed");
    }
  };

  const findById=async()=>{
    if(!searchId) return;

    try{
      const res=await api.get(`/documents/${searchId}`);
      alert(JSON.stringify(res.data,null,2));
    }catch{
      alert("Document not found");
    }
  };

  const openPreview=async(id:number)=>{
    try{
      const res=await api.get(`/documents/${id}/preview`,{responseType:"blob"});
      const url=URL.createObjectURL(res.data);
      setPreview(url);
    }catch{
      alert("Preview failed");
    }
  };

  const openSign=(id:number)=>{
    navigate(`/sign/${id}`);
  };

  const logout=()=>{
    localStorage.removeItem("token");
    navigate("/");
  };

  return(
    <div className="p-8">

      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Document Dashboard</h1>
        <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded">
          Logout
        </button>
      </div>

      <div className="mb-6">
        <input
          className="border p-1 mr-2"
          placeholder="Document title"
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
        />

        <input
          type="file"
          accept="application/pdf"
          onChange={(e)=>setFile(e.target.files?.[0]||null)}
        />

        <button onClick={upload} className="ml-2 bg-blue-600 text-white px-3 py-1 rounded">
          Upload
        </button>
      </div>

      <div className="mb-6">
        <input
          className="border p-1"
          placeholder="Document ID"
          value={searchId}
          onChange={(e)=>setSearchId(e.target.value)}
        />
        <button onClick={findById} className="ml-2 bg-gray-700 text-white px-3 py-1 rounded">
          Find
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {!loading && docs.length===0 && <p>No documents uploaded yet.</p>}

      {!loading && docs.map(d=>(
        <div key={d.id} className="border p-3 rounded mb-2 bg-white shadow">

          <div className="font-semibold">
            {d.title || d.original_filename}
          </div>

          <div className="mt-2 flex gap-2">

            <button
              onClick={()=>openPreview(d.id)}
              className="bg-green-600 text-white px-2 py-1 rounded"
            >
              Preview
            </button>

            <button
              onClick={()=>openSign(d.id)}
              className="bg-blue-600 text-white px-2 py-1 rounded"
            >
              Sign
            </button>

          </div>

        </div>
      ))}

      {preview && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white p-4">
            <iframe src={preview} width="600" height="800"></iframe>
            <button onClick={()=>setPreview(null)} className="block mt-2 bg-red-500 text-white px-2 py-1 rounded">
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
