import { useEffect, useRef, useState, useMemo } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useParams } from "react-router-dom";
import api from "../api/axios";

pdfjs.GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function SignDocument() {

  const { id } = useParams();

  const [buffer, setBuffer] = useState<Uint8Array | null>(null);
  const [loading, setLoading] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);

  const [sig, setSig] = useState<{x:number,y:number,page:number}|null>(null);
  const [sigImage,setSigImage]=useState<string|null>(null);

  const file = useMemo(
    () => buffer ? { data: buffer } : null,
    [buffer]
  );

  // LOAD PDF + existing signature
  useEffect(() => {

    if (!id) return;

    setLoading(true);

    api.get(`/documents/${id}/preview`,{
      responseType:"arraybuffer",
      headers:{ Authorization:`Bearer ${localStorage.getItem("token")}` }
    })
    .then(res=>{
      setBuffer(new Uint8Array(res.data));
    })
    .catch(()=>{
      alert("Failed to load PDF file.");
    })
    .finally(()=>setLoading(false));

  },[id]);


  // UPLOAD SIGNATURE IMAGE
  const uploadSignatureImage = async (e:React.ChangeEvent<HTMLInputElement>)=>{

    if(!e.target.files?.[0]) return;

    const form=new FormData();
    form.append("file",e.target.files[0]);

    const res=await api.post("/signatures/upload-image",form,{
      headers:{
        Authorization:`Bearer ${localStorage.getItem("token")}`,
        "Content-Type":"multipart/form-data"
      }
    });

    const fullUrl=`http://localhost:8000/${res.data.image_path}`;
    console.log("Image URL:",fullUrl);

    setSigImage(fullUrl);
  };


  // CLICK PLACE SIGNATURE
  const handleClick=(e:React.MouseEvent)=>{

    if(!containerRef.current) return;

    const rect=containerRef.current.getBoundingClientRect();

    const x=(e.clientX-rect.left)/rect.width;
    const y=(e.clientY-rect.top)/rect.height;

    setSig({x,y,page:1});
  };


  // DRAG SIGNATURE
  const handleDrag=(e:React.MouseEvent)=>{

    if(!sig || !containerRef.current || e.buttons!==1) return;

    const rect=containerRef.current.getBoundingClientRect();

    const x=(e.clientX-rect.left)/rect.width;
    const y=(e.clientY-rect.top)/rect.height;

    setSig({...sig,x,y});
  };


  // SAVE POSITION
  const saveSignature = async () => {

    if(!sig || !id) return;

    await api.post(`/signatures/`,{
      document_id:Number(id),
      x:sig.x,
      y:sig.y,
      page:sig.page,
      image_path:sigImage
    },{
      headers:{
        Authorization:`Bearer ${localStorage.getItem("token")}`
      }
    });

    alert("Signature saved!");
  };


  return(
    <div className="p-6">

      <h1 className="text-xl font-bold mb-4">Sign Document</h1>

      {/* ⭐ IMAGE UPLOAD INPUT */}
      <input
        type="file"
        accept="image/*"
        onChange={uploadSignatureImage}
        className="mb-4"
      />

      {loading && <p>Loading PDF...</p>}

      {!loading && file && (

        <>
        <div
          ref={containerRef}
          onClick={handleClick}
          className="relative inline-block border"
        >

          <Document file={file}>
            <Page pageNumber={1}/>
          </Document>

          {sig && (
            <div
              onMouseMove={handleDrag}
              className="absolute cursor-move select-none"
              style={{
                left:`${sig.x*100}%`,
                top:`${sig.y*100}%`,
                width:140,
                height:60,
                transform:"translate(-50%,-50%)"
              }}
            >
              {sigImage
                ? <img src={sigImage} className="w-full h-full object-contain pointer-events-none"/>
                : <div className="border-2 border-blue-600 bg-blue-200/40 w-full h-full flex items-center justify-center">
                    Sign Here
                  </div>
              }
            </div>
          )}

        </div>

        {sig && (
          <button
            onClick={saveSignature}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save Signature Position
          </button>
        )}

        </>
      )}

    </div>
  );
}
