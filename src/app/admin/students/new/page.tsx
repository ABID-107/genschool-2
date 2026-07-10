'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  BookOpen, 
  Users, 
  ArrowRight, 
  ArrowLeft, 
  Save, 
  Upload,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const TABS = [
  { id: 'identity', label: 'Identity Information', icon: User },
  { id: 'academic', label: 'Academic Details', icon: BookOpen },
  { id: 'guardian', label: 'Guardian Information', icon: Users },
];

interface StudentFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  religion: string;
  admissionDate: string;
  academicYear: string;
  className: string;
  section: string;
  guardianName: string;
  relationship: string;
  mobile: string;
  email: string;
  address: string;
}

const initialFormData: StudentFormData = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: '',
  bloodGroup: '',
  religion: '',
  admissionDate: '',
  academicYear: '2026-2027',
  className: '',
  section: '',
  guardianName: '',
  relationship: 'Father',
  mobile: '',
  email: '',
  address: '',
};

function validateForm(data: StudentFormData): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!data.firstName.trim()) errors.firstName = 'First name is required';
  if (!data.lastName.trim()) errors.lastName = 'Last name is required';
  if (!data.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
  if (!data.gender) errors.gender = 'Gender is required';
  if (!data.admissionDate) errors.admissionDate = 'Admission date is required';
  if (!data.className) errors.className = 'Class is required';
  if (!data.section) errors.section = 'Section is required';
  if (!data.guardianName.trim()) errors.guardianName = 'Guardian name is required';
  if (!data.mobile.trim()) errors.mobile = 'Mobile number is required';
  if (!data.address.trim()) errors.address = 'Address is required';
  return errors;
}

export default function NewStudentPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('identity');
  const [formData, setFormData] = useState<StudentFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [admissionNumber] = useState(() => `ADM-2026-${Math.floor(Math.random() * 9000) + 1000}`);
  const [academicClasses, setAcademicClasses] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('academic_classes');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setAcademicClasses(parsed);
      } catch {}
    }
  }, []);

  const currentIndex = TABS.findIndex(t => t.id === activeTab);

  const updateField = <K extends keyof StudentFormData>(field: K, value: StudentFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => { const next = { ...prev }; delete next[field]; return next; });
  };

  const handleNext = () => {
    if (currentIndex < TABS.length - 1) setActiveTab(TABS[currentIndex + 1].id);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setActiveTab(TABS[currentIndex - 1].id);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be under 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSaving(true);

    // Build the student record
    const studentRecord = {
      ...formData,
      id: `STU-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      name: `${formData.firstName} ${formData.lastName}`,
      class: formData.className,
      roll: String(Math.floor(Math.random() * 60) + 1),
      status: 'Active',
      guardian: formData.guardianName,
      photo: photoPreview,
      createdAt: new Date().toISOString(),
    };

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Persist to localStorage so the list page stays in sync
    const existing = JSON.parse(localStorage.getItem('students') || '[]');
    existing.push(studentRecord);
    localStorage.setItem('students', JSON.stringify(existing));

    setSaving(false);
    setSaved(true);
    setTimeout(() => router.push('/admin/students'), 1500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Enroll New Student</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Fill in the details to register a new student.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/students">
            <button className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] bg-[var(--bg-secondary)] border-[var(--border-light)] rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors shadow-sm">
              Cancel
            </button>
          </Link>
          <button
            onClick={handleSubmit}
            disabled={saving || saved}
            className={`px-4 py-2 text-sm font-medium text-white rounded-xl transition-colors shadow-md flex items-center gap-2 ${
              saved
                ? 'bg-[var(--brand-primary)] cursor-default'
                : saving
                  ? 'bg-brand-mid cursor-wait'
                  : 'bg-brand-primary hover:bg-brand-mid shadow-brand-primary/20'
            }`}
          >
            {saved ? (
              <><CheckCircle2 size={16} /> Saved</>
            ) : saving ? (
              <><Loader2 size={16} className="animate-spin" /> Saving...</>
            ) : (
              <><Save size={16} /> Save Student</>
            )}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-[var(--bg-secondary)] rounded-2xl border-[var(--border-light)] shadow-sm overflow-hidden book-page">
          {/* Tabs */}
          <div className="flex border-b border-[var(--border-light)] bg-[var(--bg-tertiary)]/50">
            {TABS.map((tab, index) => (
              <button
                type="button"
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors relative ${
                  activeTab === tab.id ? 'text-brand-primary' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  activeTab === tab.id ? 'bg-[var(--bg-tertiary)] text-brand-primary' : 
                  index < currentIndex ? 'bg-[var(--green-100)] text-[var(--green-800)]' : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)]'
                }`}>
                  {index < currentIndex ? '✓' : index + 1}
                </div>
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" 
                  />
                )}
              </button>
            ))}
          </div>

          {/* Form Content */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              {activeTab === 'identity' && (
                <motion.div
                  key="identity"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-6 pb-6 border-b border-[var(--border-light)]">
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className={`w-24 h-24 rounded-full border-2 border-dashed flex flex-col items-center justify-center transition-colors cursor-pointer group overflow-hidden ${
                        photoPreview
                          ? 'border-brand-primary'
                          : 'border-[var(--border-light)] bg-[var(--bg-tertiary)] hover:border-brand-primary hover:bg-[var(--bg-tertiary)] hover:text-brand-primary'
                      }`}
                    >
                      {photoPreview ? (
                        <Image src={photoPreview} alt="Preview" width={96} height={96} className="w-full h-full object-cover" unoptimized />
                      ) : (
                        <>
                          <Upload size={24} className="mb-1 text-[var(--text-muted)] group-hover:-translate-y-1 transition-transform" />
                          <span className="text-xs font-medium text-[var(--text-muted)]">Upload Photo</span>
                        </>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png"
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                    <div>
                      <h3 className="font-semibold text-[var(--text-primary)]">Student Photo</h3>
                      <p className="text-sm text-[var(--text-muted)]">Allowed formats: JPG, PNG. Max size: 2MB.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[var(--text-primary)]">First Name <span className="text-[var(--color-error)]">*</span></label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={e => updateField('firstName', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors ${
                          errors.firstName ? 'border-[var(--color-error)]/20 bg-[var(--color-error-bg)]/30' : 'border-[var(--border-light)]'
                        }`}
                        placeholder="e.g. Aarav"
                      />
                      {errors.firstName && <p className="text-xs text-[var(--color-error)] mt-0.5">{errors.firstName}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[var(--text-primary)]">Last Name <span className="text-[var(--color-error)]">*</span></label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={e => updateField('lastName', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors ${
                          errors.lastName ? 'border-[var(--color-error)]/20 bg-[var(--color-error-bg)]/30' : 'border-[var(--border-light)]'
                        }`}
                        placeholder="e.g. Rahman"
                      />
                      {errors.lastName && <p className="text-xs text-[var(--color-error)] mt-0.5">{errors.lastName}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[var(--text-primary)]">Date of Birth <span className="text-[var(--color-error)]">*</span></label>
                      <input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={e => updateField('dateOfBirth', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors text-[var(--text-secondary)] ${
                          errors.dateOfBirth ? 'border-[var(--color-error)]/20 bg-[var(--color-error-bg)]/30' : 'border-[var(--border-light)]'
                        }`}
                      />
                      {errors.dateOfBirth && <p className="text-xs text-[var(--color-error)] mt-0.5">{errors.dateOfBirth}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[var(--text-primary)]">Gender <span className="text-[var(--color-error)]">*</span></label>
                      <select
                        value={formData.gender}
                        onChange={e => updateField('gender', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors text-[var(--text-secondary)] bg-[var(--bg-secondary)] ${
                          errors.gender ? 'border-[var(--color-error)]/20 bg-[var(--color-error-bg)]/30' : 'border-[var(--border-light)]'
                        }`}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.gender && <p className="text-xs text-[var(--color-error)] mt-0.5">{errors.gender}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[var(--text-primary)]">Blood Group</label>
                      <select
                        value={formData.bloodGroup}
                        onChange={e => updateField('bloodGroup', e.target.value)}
                        className="w-full px-4 py-2 border-[var(--border-light)] rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors text-[var(--text-secondary)] bg-[var(--bg-secondary)]"
                      >
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option><option value="A-">A-</option>
                        <option value="B+">B+</option><option value="B-">B-</option>
                        <option value="O+">O+</option><option value="O-">O-</option>
                        <option value="AB+">AB+</option><option value="AB-">AB-</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[var(--text-primary)]">Religion</label>
                      <select
                        value={formData.religion}
                        onChange={e => updateField('religion', e.target.value)}
                        className="w-full px-4 py-2 border-[var(--border-light)] rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors text-[var(--text-secondary)] bg-[var(--bg-secondary)]"
                      >
                        <option value="">Select Religion</option>
                        <option value="Islam">Islam</option>
                        <option value="Hinduism">Hinduism</option>
                        <option value="Christianity">Christianity</option>
                        <option value="Buddhism">Buddhism</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'academic' && (
                <motion.div
                  key="academic"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-sm font-medium text-[var(--text-primary)]">Admission Number (Auto-generated)</label>
                      <input
                        type="text"
                        disabled
                        className="w-full px-4 py-2 border-[var(--border-light)] rounded-xl bg-[var(--bg-tertiary)] text-[var(--text-muted)]"
                        value={admissionNumber}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[var(--text-primary)]">Admission Date <span className="text-[var(--color-error)]">*</span></label>
                      <input
                        type="date"
                        value={formData.admissionDate}
                        onChange={e => updateField('admissionDate', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors text-[var(--text-secondary)] ${
                          errors.admissionDate ? 'border-[var(--color-error)]/20 bg-[var(--color-error-bg)]/30' : 'border-[var(--border-light)]'
                        }`}
                      />
                      {errors.admissionDate && <p className="text-xs text-[var(--color-error)] mt-0.5">{errors.admissionDate}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[var(--text-primary)]">Academic Year <span className="text-[var(--color-error)]">*</span></label>
                      <select
                        value={formData.academicYear}
                        onChange={e => updateField('academicYear', e.target.value)}
                        className="w-full px-4 py-2 border-[var(--border-light)] rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors text-[var(--text-secondary)] bg-[var(--bg-secondary)]"
                      >
                        <option value="2026-2027">2026-2027</option>
                        <option value="2025-2026">2025-2026</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[var(--text-primary)]">Class <span className="text-[var(--color-error)]">*</span></label>
                      <select
                        value={formData.className}
                        onChange={e => updateField('className', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors text-[var(--text-secondary)] bg-[var(--bg-secondary)] ${
                          errors.className ? 'border-[var(--color-error)]/20 bg-[var(--color-error-bg)]/30' : 'border-[var(--border-light)]'
                        }`}
                      >
                        <option value="">Select Class</option>
                        {academicClasses.map(c => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                      {errors.className && <p className="text-xs text-[var(--color-error)] mt-0.5">{errors.className}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[var(--text-primary)]">Section <span className="text-[var(--color-error)]">*</span></label>
                      <select
                        value={formData.section}
                        onChange={e => updateField('section', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors text-[var(--text-secondary)] bg-[var(--bg-secondary)] ${
                          errors.section ? 'border-[var(--color-error)]/20 bg-[var(--color-error-bg)]/30' : 'border-[var(--border-light)]'
                        }`}
                      >
                        <option value="">Select Section</option>
                        <option value="A (Science)">A (Science)</option>
                        <option value="B (Business Studies)">B (Business Studies)</option>
                        <option value="C (Humanities)">C (Humanities)</option>
                      </select>
                      {errors.section && <p className="text-xs text-[var(--color-error)] mt-0.5">{errors.section}</p>}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'guardian' && (
                <motion.div
                  key="guardian"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[var(--text-primary)]">Guardian Name <span className="text-[var(--color-error)]">*</span></label>
                      <input
                        type="text"
                        value={formData.guardianName}
                        onChange={e => updateField('guardianName', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors ${
                          errors.guardianName ? 'border-[var(--color-error)]/20 bg-[var(--color-error-bg)]/30' : 'border-[var(--border-light)]'
                        }`}
                        placeholder="Full Name"
                      />
                      {errors.guardianName && <p className="text-xs text-[var(--color-error)] mt-0.5">{errors.guardianName}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[var(--text-primary)]">Relationship <span className="text-[var(--color-error)]">*</span></label>
                      <select
                        value={formData.relationship}
                        onChange={e => updateField('relationship', e.target.value)}
                        className="w-full px-4 py-2 border-[var(--border-light)] rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors text-[var(--text-secondary)] bg-[var(--bg-secondary)]"
                      >
                        <option value="Father">Father</option>
                        <option value="Mother">Mother</option>
                        <option value="Uncle">Uncle</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[var(--text-primary)]">Mobile Number (For SMS) <span className="text-[var(--color-error)]">*</span></label>
                      <input
                        type="tel"
                        value={formData.mobile}
                        onChange={e => updateField('mobile', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors ${
                          errors.mobile ? 'border-[var(--color-error)]/20 bg-[var(--color-error-bg)]/30' : 'border-[var(--border-light)]'
                        }`}
                        placeholder="+880 1XXX-XXXXXX"
                      />
                      {errors.mobile && <p className="text-xs text-[var(--color-error)] mt-0.5">{errors.mobile}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[var(--text-primary)]">Email Address</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={e => updateField('email', e.target.value)}
                        className="w-full px-4 py-2 border-[var(--border-light)] rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors"
                        placeholder="email@example.com"
                      />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-sm font-medium text-[var(--text-primary)]">Present Address <span className="text-[var(--color-error)]">*</span></label>
                      <textarea
                        value={formData.address}
                        onChange={e => updateField('address', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors min-h-[100px] ${
                          errors.address ? 'border-[var(--color-error)]/20 bg-[var(--color-error-bg)]/30' : 'border-[var(--border-light)]'
                        }`}
                        placeholder="Full present address..."
                      />
                      {errors.address && <p className="text-xs text-[var(--color-error)] mt-0.5">{errors.address}</p>}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--border-light)]">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  currentIndex === 0 ? 'text-[var(--border-light)] cursor-not-allowed' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] border-[var(--border-light)]'
                }`}
              >
                <ArrowLeft size={16} />
                Previous Step
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={currentIndex === TABS.length - 1}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  currentIndex === TABS.length - 1 ? 'opacity-0 pointer-events-none' : 'text-white bg-[var(--text-primary)] hover:bg-[var(--text-primary)] shadow-md'
                }`}
              >
                Next Step
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
