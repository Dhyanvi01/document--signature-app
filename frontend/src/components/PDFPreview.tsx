import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import api from "../api/axios";

pdfjs.GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type Props = {
  documentId: string;
  onClose: () => void;
};

const PDFPreview = ({ documentId, onClose }: Props) => {

  const fileUrl = `http://localhost:8000/documents/${documentId}/preview`;

  const [sig,setSig]=useState<any|null>(null);

  // ⭐ LOAD SIGNATURE FOR THIS DOCUMENT
  useEffect(()=>{

    api.get(`/signatures/?document_id=${documentId}`,{
      headers:{
        Authorization:`Bearer ${localStorage.getItem("token")}`
      }
    })
    .then(res=>{
      if(res.data?.length){
        setSig(res.data[0]);   // first signature
      }
    })
    .catch(()=>{});

  },[documentId]);


  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">

      <div className="bg-white w-[90%] h-[90%] rounded-lg p-4 overflow-auto">

        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold">PDF Preview</h2>
          <button
            onClick={onClose}
            className="text-red-600 font-bold text-lg"
          >
            ✕
          </button>
        </div>

        {/* ⭐ wrapper must be relative for overlay */}
        <div className="relative inline-block">

          <Document
            file={{
              url: fileUrl,
              httpHeaders:{
                Authorization:`Bearer ${localStorage.getItem("token")}`
              },
            } as any}
          >
            <Page pageNumber={1}/>
          </Document>

          {/* ⭐ SIGNATURE IMAGE OVERLAY */}
          {sig?.image_path && (
            <img
              src={`http://localhost:8000/${sig.image_path}`}
              className="absolute pointer-events-none"
              style={{
                left:`${sig.x*100}%`,
                top:`${sig.y*100}%`,
                width:140,
                height:60,
                transform:"translate(-50%,-50%)"
              }}
            />
          )}

        </div>

      </div>
    </div>
  );
};

export default PDFPreview;
