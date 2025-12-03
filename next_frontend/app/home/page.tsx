"use client";

import React, { useRef, useState } from "react";

const TOOLS = [
  { id: "summarizer", label: "Summarizer" },
  { id: "codegen", label: "Code Generator" },
  { id: "translator", label: "Translator" },
  { id: "image", label: "Image Analyzer" },
  { id: "qa", label: "Q & A" },
];

const page = () => {
const [query, setQuery] = useState("");
const [tool, setTool] = useState(TOOLS[0].id);
const [file, setFile] = useState<File | null>(null);

const handlesubmit = (e: React.FormEvent) => {
  e.preventDefault()
  console.log('variables query isss: ', query)
  console.log('variables tool isss: ', tool)
  console.log('variables file isss: ', file)
}

  return (
    <div>
      <form onSubmit={(e) => { handlesubmit(e) }} className="flex flex-col gap-3">
        <select
          name="tools"
          id="tools"
          value={tool}
          onChange={(e)=>{setTool(e.target.value)}}
        >
          {
            TOOLS.map((tool, index) => (
              <option value={tool.id} key={index}>{tool.label}</option>
            ))
          }
        </select>
        <input
          type="text"
          placeholder="enter query.."
          value={query}
          onChange={(e) => { setQuery(e.target.value) }}
        />
        <input
          type="file"
          onChange={(e)=>{setFile(e.target.files?.[0] ?? null)}} />
        <button type="submit">submit</button>
      </form>
    </div>
  )
}

export default page



// export default function HomePage(){
//   const [query, setQuery] = useState("");
//   const [tool, setTool] = useState(TOOLS[0].id);
//   const [file, setFile] = useState<File | null>(null);
//   const fileInputRef = useRef<HTMLInputElement | null>(null);

//   function handleSubmit(e?: React.FormEvent) {
//     if (e) e.preventDefault();
//     if (!query && !file) return;

//     // Replace with actual API call
//     console.log({ query, tool, file });

//     setQuery("");
//   }

//   function handleFileChange(e: React.ChangeEvent<HTMLInputElement> | null) {
//     const f = e?.target?.files?.[0] ?? null;
//     if (f) setFile(f);
//   }

//   function removeFile() {
//     setFile(null);
//     // if (fileInputRef.current) fileInputRef.current.value = "";
//   }

//   return (
//     <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
//       <div className="w-full max-w-xl bg-gray-800 border border-gray-700 rounded-lg p-6">
//         <h1 className="text-xl font-medium mb-4">AI Assistant</h1>

//         <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
//           <div>
//             <label htmlFor="tool" className="block text-sm text-gray-300 mb-1">Tool</label>
//             <select
//               id="tool"
//               value={tool}
//               onChange={(e) => setTool(e.target.value)}
//               className="w-full bg-gray-900 text-white border border-gray-700 rounded px-3 py-2"
//             >
//               {TOOLS.map((t) => (
//                 <option key={t.id} value={t.id} className="bg-gray-900 text-white">
//                   {t.label}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label htmlFor="query" className="block text-sm text-gray-300 mb-1">Input</label>
//             <input
//               id="query"
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               placeholder="Type your request..."
//               className="w-full bg-gray-900 text-white border border-gray-700 rounded px-3 py-2"
//             />
//           </div>

//           <div>
//             <label className="block text-sm text-gray-300 mb-1">Attach file (optional)</label>
//             <div className="flex gap-2">
//               <label className="flex-1 bg-gray-900 text-white border border-gray-700 rounded px-3 py-2 text-sm text-left cursor-pointer">
//                 <input ref={fileInputRef} type="file" onChange={(e) => handleFileChange(e)} className="hidden" />
//                 {file ? file.name : "Choose file..."}
//               </label>

//               {file && (
//                 <button type="button" onClick={removeFile} className="px-3 py-2 bg-gray-700 border border-gray-600 rounded">
//                   Remove
//                 </button>
//               )}
//             </div>
//           </div>

//           <div className="text-right">
//             <button type="submit" className="bg-white text-black px-4 py-2 rounded">Send</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
