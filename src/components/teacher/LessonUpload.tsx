import { useState, ChangeEvent, DragEvent } from "react";
import Image from "next/image";
import { motion } from "framer-motion";


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
    <div className="bg-[var(--bg-tertiary)] backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-[var(--border-color)]/50 shadow-sm">
      <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-6 font-heading tracking-tight">Upload New Lesson</h3>
      
      {uploadingState === 'success' && (
        <div className="mb-6 p-4 bg-[var(--color-success-bg)] border border-[var(--color-success)]/20 rounded-xl flex items-center gap-3 text-[var(--color-success)]">
          <span className="material-symbols-outlined">check_circle</span>
          <p className="font-semibold text-sm">Lesson uploaded successfully!</p>
        </div>
      )}

      {uploadingState === 'error' && (
        <div className="mb-6 p-4 bg-[var(--color-error-bg)] border border-[var(--color-error)]/20 rounded-xl flex items-center gap-3 text-[var(--color-error)]">
          <span className="material-symbols-outlined">error</span>
          <p className="font-semibold text-sm">{errorMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-5">
            <div className="space-y-1.5">
                <label className="text-sm font-bold text-[var(--text-secondary)] ml-1">Lesson Title <span className="text-[var(--color-error)]">*</span></label>
                <input
                type="text"
                placeholder="e.g., Introduction to CSS Grid"
                className="w-full border border-[var(--border-color)]/80 rounded-xl focus:ring-2 focus:ring-[var(--brand-primary)]/20 focus:border-[var(--brand-primary)] p-3.5 outline-none bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            
            <div className="space-y-1.5">
                <label className="text-sm font-bold text-[var(--text-secondary)] ml-1">Description <span className="text-xs font-normal text-[var(--text-muted)]">(Optional)</span></label>
                <textarea
                placeholder="Brief description of the lesson content..."
                rows={4}
                className="w-full border border-[var(--border-color)]/80 rounded-xl focus:ring-2 focus:ring-[var(--brand-primary)]/20 focus:border-[var(--brand-primary)] p-3.5 outline-none bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                ></textarea>
            </div>
        </div>

        <div className="space-y-5">
            <div className="space-y-1.5">
                <label className="text-sm font-bold text-[var(--text-secondary)] ml-1">Thumbnail Image <span className="text-xs font-normal text-[var(--text-muted)]">(Optional)</span></label>
                <div className="flex items-center gap-4">
                    {thumbnail ? (
                        <div className="relative">
                            <Image src={thumbnail} alt="Thumbnail Preview" width={80} height={80} className="w-20 h-20 object-cover rounded-xl border border-[var(--border-color)] shadow-sm" unoptimized />
                            <button onClick={() => setThumbnail(null)} className="absolute -top-2 -right-2 bg-[var(--color-error-bg)] text-[var(--color-error)] rounded-full p-1 hover:bg-rose-200 transition-colors shadow-sm">
                                <span className="material-symbols-outlined text-[14px]">close</span>
                            </button>
                        </div>
                    ) : (
                        <div className="w-20 h-20 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl flex items-center justify-center text-[var(--text-muted)]">
                            <span className="material-symbols-outlined text-2xl">image</span>
                        </div>
                    )}
                    <label className="cursor-pointer bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-secondary)] font-semibold px-4 py-2 rounded-lg text-sm hover:bg-[var(--bg-secondary)] transition-colors inline-block shadow-sm">
                        Upload Image
                        <input type="file" accept="image/*" onChange={handleThumbnailUpload} className="hidden" />
                    </label>
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-sm font-bold text-[var(--text-secondary)] ml-1">Lesson File <span className="text-[var(--color-error)]">*</span></label>
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
                    className="border-2 border-dashed border-[var(--border-color)] rounded-xl p-8 flex flex-col items-center text-center hover:border-[var(--green-300)] transition-colors bg-[var(--bg-secondary)]"
                >
                    <span className="material-symbols-outlined text-[var(--text-muted)] text-3xl mb-2">upload_file</span>
                    <p className="text-sm font-semibold text-[var(--text-secondary)]">Drag & Drop file here or</p>
                    <label className="text-[var(--brand-primary)] font-bold text-sm cursor-pointer hover:underline mt-1">
                        browse files
                        <input type="file" className="hidden" onChange={handleFileChange} />
                    </label>
                    {file && <p className="text-xs text-[var(--brand-primary)] font-medium mt-2">Selected: {file.name}</p>}
                </div>
            </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-[var(--border-light)] flex justify-end">
        <button
            onClick={submitUpload}
            disabled={uploadingState === 'uploading'}
            className="bg-[var(--brand-primary)] text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-[var(--brand-primary)]/20 hover:bg-[var(--brand-deep)] transition-all active:scale-95 disabled:opacity-50"
        >
            {uploadingState === 'uploading' ? `Uploading ${progress}%` : 'Upload Lesson'}
        </button>
      </div>
    </div>
  );
}

