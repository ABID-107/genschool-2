import { useState, ChangeEvent, DragEvent } from "react";
import { motion } from "framer-motion";
<<<<<<< HEAD
import Image from "next/image";
=======
>>>>>>> 8415be89a19eb0a8cc90a95ab8737463a8d29928

interface LessonUploadProps {
  onUploadSuccess: (lesson: any) => void;
}

export function LessonUpload({ onUploadSuccess }: LessonUploadProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [uploadingState, setUploadingState] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 500 * 1024 * 1024) {
        setErrorMessage("File exceeds 500MB limit.");
        setUploadingState("error");
        return;
      }
      setFile(selectedFile);
      setUploadingState("idle");
    }
  };

  const handleThumbnailUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnail(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const submitUpload = () => {
    if (!title) {
      setErrorMessage("Lesson title is required.");
      setUploadingState("error");
      return;
    }
    if (!file) {
      setErrorMessage("Please upload a lesson file.");
      setUploadingState("error");
      return;
    }

    setUploadingState("uploading");
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setUploadingState("success");
      
      onUploadSuccess({
        id: `upl-${Date.now()}`,
        title,
        description,
        filename: file.name,
        size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        type: file.type.includes('video') ? 'video' : file.type.includes('pdf') ? 'pdf' : 'doc'
      });

      setTitle("");
      setDescription("");
      setFile(null);
      setThumbnail(null);

      setTimeout(() => {
        setUploadingState("idle");
        setProgress(0);
      }, 3000);
    }, 2500);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-slate-200/50 shadow-sm">
      <h3 className="text-2xl font-bold text-slate-900 mb-6 font-bricolage tracking-tight">Upload New Lesson</h3>
      
      {uploadingState === 'success' && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-700">
          <span className="material-symbols-outlined">check_circle</span>
          <p className="font-semibold text-sm">Lesson uploaded successfully!</p>
        </div>
      )}

      {uploadingState === 'error' && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-700">
          <span className="material-symbols-outlined">error</span>
          <p className="font-semibold text-sm">{errorMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-5">
            <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 ml-1">Lesson Title <span className="text-rose-500">*</span></label>
                <input
                type="text"
                placeholder="e.g., Introduction to CSS Grid"
                className="w-full border border-slate-200/80 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 p-3.5 outline-none bg-slate-50/50 hover:bg-white transition-colors"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            
            <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 ml-1">Description <span className="text-xs font-normal text-slate-400">(Optional)</span></label>
                <textarea
                placeholder="Brief description of the lesson content..."
                rows={4}
                className="w-full border border-slate-200/80 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 p-3.5 outline-none bg-slate-50/50 hover:bg-white transition-colors resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                ></textarea>
            </div>
        </div>

        <div className="space-y-5">
            <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 ml-1">Thumbnail Image <span className="text-xs font-normal text-slate-400">(Optional)</span></label>
                <div className="flex items-center gap-4">
                    {thumbnail ? (
                        <div className="relative">
<<<<<<< HEAD
                            <Image src={thumbnail} alt="Thumbnail Preview" width={80} height={80} className="w-20 h-20 object-cover rounded-xl border border-slate-200 shadow-sm" unoptimized />
=======
                            <img src={thumbnail} alt="Thumbnail Preview" className="w-20 h-20 object-cover rounded-xl border border-slate-200 shadow-sm" />
>>>>>>> 8415be89a19eb0a8cc90a95ab8737463a8d29928
                            <button onClick={() => setThumbnail(null)} className="absolute -top-2 -right-2 bg-rose-100 text-rose-600 rounded-full p-1 hover:bg-rose-200 transition-colors shadow-sm">
                                <span className="material-symbols-outlined text-[14px]">close</span>
                            </button>
                        </div>
                    ) : (
                        <div className="w-20 h-20 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400">
                            <span className="material-symbols-outlined text-2xl">image</span>
                        </div>
                    )}
                    <label className="cursor-pointer bg-white border border-slate-200 text-slate-600 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-slate-50 transition-colors inline-block shadow-sm">
                        Upload Image
                        <input type="file" accept="image/*" onChange={handleThumbnailUpload} className="hidden" />
                    </label>
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 ml-1">Lesson File <span className="text-rose-500">*</span></label>
                <div 
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e: DragEvent) => {
                        e.preventDefault();
                        const selectedFile = e.dataTransfer.files?.[0];
                        if (selectedFile) {
                            if (selectedFile.size > 500 * 1024 * 1024) {
                                setErrorMessage("File exceeds 500MB limit.");
                                setUploadingState("error");
                                return;
                            }
                            setFile(selectedFile);
                            setUploadingState("idle");
                        }
                    }}
                    className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center text-center hover:border-indigo-300 transition-colors bg-slate-50/50"
                >
                    <span className="material-symbols-outlined text-slate-400 text-3xl mb-2">upload_file</span>
                    <p className="text-sm font-semibold text-slate-600">Drag & Drop file here or</p>
                    <label className="text-indigo-600 font-bold text-sm cursor-pointer hover:underline mt-1">
                        browse files
                        <input type="file" className="hidden" onChange={handleFileChange} />
                    </label>
                    {file && <p className="text-xs text-indigo-600 font-medium mt-2">Selected: {file.name}</p>}
                </div>
            </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
        <button
            onClick={submitUpload}
            disabled={uploadingState === 'uploading'}
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
        >
            {uploadingState === 'uploading' ? `Uploading ${progress}%` : 'Upload Lesson'}
        </button>
      </div>
    </div>
  );
}

