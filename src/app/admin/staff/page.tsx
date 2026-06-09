'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Mail,
  Phone,
  Briefcase,
  Building2,
  BadgeCheck,
  CalendarDays,
  MapPin,
  X,
  Save,
  Loader2,
  Plus,
  Upload
} from 'lucide-react';
import Image from 'next/image';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  phone: string;
  email: string;
  status: string;
  address?: string;
  joinedDate?: string;
  emergencyContact?: string;
  photo?: string;
}

const emptyStaff: StaffMember = {
  id: '', name: '', role: '', department: '', phone: '', email: '',
  status: 'Active', address: '', joinedDate: '', emergencyContact: '', photo: '',
};

const defaultStaff: StaffMember[] = [
  { id: 'EMP-001', name: 'Dr. Hasan Mahmud', role: 'Principal', department: 'Administration', phone: '+880 1711-000001', email: 'principal@genschool.edu.bd', status: 'Active', address: '12 College Road, Dhaka', joinedDate: '2018-01-15', emergencyContact: '+880 1711-999001' },
  { id: 'EMP-012', name: 'Farhana Yeasmin', role: 'Senior Teacher', department: 'Science', phone: '+880 1711-000012', email: 'farhana@genschool.edu.bd', status: 'Active', address: '45 Lake View, Chittagong', joinedDate: '2019-03-10', emergencyContact: '+880 1711-999012' },
  { id: 'EMP-045', name: 'Abdul Karim', role: 'Teacher', department: 'Mathematics', phone: '+880 1711-000045', email: 'akarim@genschool.edu.bd', status: 'On Leave', address: '78 New Market, Rajshahi', joinedDate: '2020-06-22', emergencyContact: '+880 1711-999045' },
  { id: 'EMP-088', name: 'Sanjida Akter', role: 'Accountant', department: 'Finance', phone: '+880 1711-000088', email: 'accounts@genschool.edu.bd', status: 'Active', address: '34 Gulshan Ave, Dhaka', joinedDate: '2021-02-01', emergencyContact: '+880 1711-999088' },
  { id: 'EMP-102', name: 'Jamal Uddin', role: 'Librarian', department: 'Library', phone: '+880 1711-000102', email: 'library@genschool.edu.bd', status: 'Active', address: '56 Station Road, Sylhet', joinedDate: '2022-09-14', emergencyContact: '+880 1711-999102' },
];

const departmentOptions = [...new Set(defaultStaff.map(s => s.department))].sort();

const FORM_FIELDS: [keyof StaffMember, string, boolean, 'text' | 'email' | 'select' | 'tel'][] = [
  ['name', 'Full Name', true, 'text'],
  ['role', 'Role', true, 'text'],
  ['department', 'Department', true, 'text'],
  ['phone', 'Phone', true, 'tel'],
  ['email', 'Email', true, 'email'],
  ['address', 'Address', false, 'text'],
  ['emergencyContact', 'Emergency Contact', false, 'text'],
  ['status', 'Status', true, 'select'],
];

function validateStaff(data: StaffMember): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!data.name.trim()) errors.name = 'Full name is required';
  if (!data.role.trim()) errors.role = 'Role is required';
  if (!data.department.trim()) errors.department = 'Department is required';
  if (!data.phone.trim()) errors.phone = 'Phone number is required';
  if (!data.email.trim()) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Invalid email format';
  return errors;
}

export default function StaffManagementPage() {
  const [staffList, setStaffList] = useState<StaffMember[]>(defaultStaff);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<StaffMember | null>(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState<StaffMember>({ ...emptyStaff });
  const [addSaving, setAddSaving] = useState(false);
  const [addErrors, setAddErrors] = useState<Record<string, string>>({});
  const addFileRef = useRef<HTMLInputElement>(null);

  const editFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('staff');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setStaffList(prev => {
            const existingIds = new Set(prev.map(s => s.id));
            const newOnes = parsed.filter((s: any) => !existingIds.has(s.id));
            return newOnes.length > 0 ? [...newOnes, ...prev] : prev;
          });
        }
      } catch {}
    }
  }, []);

  const filteredStaff = useMemo(() => {
    return staffList.filter(s => {
      const q = searchTerm.toLowerCase();
      return (!searchTerm
        || s.name.toLowerCase().includes(q)
        || s.id.toLowerCase().includes(q)
        || s.department.toLowerCase().includes(q)
        || s.role.toLowerCase().includes(q)
        || s.email.toLowerCase().includes(q))
        && (!departmentFilter || s.department === departmentFilter);
    });
  }, [staffList, searchTerm, departmentFilter]);

  const persistStaff = (list: StaffMember[]) => {
    localStorage.setItem('staff', JSON.stringify(list));
  };

  const openProfile = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setIsEditing(false);
    setEditForm(null);
    setErrors({});
  };

  const closeProfile = () => {
    setSelectedStaff(null);
    setIsEditing(false);
    setEditForm(null);
    setErrors({});
  };

  const startEditing = () => {
    if (!selectedStaff) return;
    setEditForm({ ...selectedStaff });
    setErrors({});
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setEditForm(null);
    setIsEditing(false);
    setErrors({});
  };

  const handleEditField = (field: keyof StaffMember, value: string) => {
    if (!editForm) return;
    setEditForm({ ...editForm, [field]: value });
    if (errors[field]) setErrors(prev => { const next = { ...prev }; delete next[field]; return next; });
  };

  const handleEditPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editForm) return;
    if (file.size > 2 * 1024 * 1024) { alert('File size must be under 2MB.'); return; }
    const reader = new FileReader();
    reader.onload = () => setEditForm({ ...editForm, photo: reader.result as string });
    reader.readAsDataURL(file);
  };

  const saveChanges = () => {
    if (!editForm) return;
    const validationErrors = validateStaff(editForm);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSaving(true);
    setTimeout(() => {
      const updated = staffList.map(s => s.id === editForm.id ? editForm : s);
      setStaffList(updated);
      setSelectedStaff(editForm);
      setIsEditing(false);
      setEditForm(null);
      setErrors({});
      setSaving(false);
      persistStaff(updated);
    }, 400);
  };

  const openAddModal = () => {
    setAddForm({ ...emptyStaff });
    setAddErrors({});
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setAddForm({ ...emptyStaff });
    setAddErrors({});
  };

  const handleAddField = (field: keyof StaffMember, value: string) => {
    setAddForm(prev => ({ ...prev, [field]: value }));
    if (addErrors[field]) setAddErrors(prev => { const next = { ...prev }; delete next[field]; return next; });
  };

  const handleAddPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert('File size must be under 2MB.'); return; }
    const reader = new FileReader();
    reader.onload = () => setAddForm(prev => ({ ...prev, photo: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const submitAddStaff = () => {
    const validationErrors = validateStaff(addForm);
    setAddErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setAddSaving(true);
    setTimeout(() => {
      const id = `EMP-${String(staffList.length + 1).padStart(3, '0')}`;
      const today = new Date().toISOString().split('T')[0];
      const newStaff: StaffMember = { ...addForm, id, joinedDate: today };
      const updated = [...staffList, newStaff];
      setStaffList(updated);
      persistStaff(updated);
      setAddSaving(false);
      closeAddModal();
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Staff Directory</h1>
          <p className="text-sm text-slate-500 mt-1">Manage teachers, administrators, and support staff.</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
        >
          <Plus size={16} />
          Add New Staff
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search by name, ID, department, or role..."
            className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">All Departments</option>
            {departmentOptions.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* Staff Grid */}
      {filteredStaff.length === 0 ? (
        <div className="text-center py-16 text-sm text-slate-400 bg-white rounded-2xl border border-slate-200 shadow-sm">
          No staff members match your search criteria.
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-x-4 gap-y-6">
          {filteredStaff.map((staff, i) => (
            <motion.button
              key={staff.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => openProfile(staff)}
              className="flex flex-col items-center text-center focus:outline-none cursor-pointer"
            >
              {staff.photo ? (
                <Image src={staff.photo} alt="" width={64} height={64} className="w-14 h-14 rounded-full object-cover mb-2" unoptimized />
              ) : (
                <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-lg mb-2">
                  {staff.name.charAt(0)}
                </div>
              )}
              <h3 className="text-slate-700 text-xs leading-snug">{staff.name}</h3>
            </motion.button>
          ))}
        </div>
      )}

      {/* Add New Staff Modal */}
      <AnimatePresence>
        {showAddModal && (
          <StaffFormModal
            title="Add New Staff"
            data={addForm}
            errors={addErrors}
            saving={addSaving}
            onFieldChange={handleAddField}
            onPhotoChange={handleAddPhoto}
            onSave={submitAddStaff}
            onClose={closeAddModal}
            fileInputRef={addFileRef}
            saveLabel={addSaving ? 'Adding...' : 'Add Staff'}
          />
        )}
      </AnimatePresence>

      {/* Detail / Edit Modal */}
      <AnimatePresence>
        {selectedStaff && !showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
              onClick={closeProfile}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg max-h-[90vh] overflow-y-auto z-10"
            >
              <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-slate-100 flex items-center justify-between rounded-t-2xl">
                <h3 className="font-bold text-slate-800 text-lg">
                  {isEditing ? 'Edit Staff' : 'Staff Profile'}
                </h3>
                <button onClick={closeProfile} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6">
                {isEditing && editForm ? (
                  /* EDIT MODE */
                  <StaffFormModal
                    title=""
                    data={editForm}
                    errors={errors}
                    saving={saving}
                    onFieldChange={handleEditField}
                    onPhotoChange={handleEditPhoto}
                    onSave={saveChanges}
                    onClose={cancelEditing}
                    fileInputRef={editFileRef}
                    saveLabel={saving ? 'Saving...' : 'Save Changes'}
                    hideTitle
                  />
                ) : selectedStaff ? (
                  /* VIEW MODE */
                  <div>
                    <div className="flex flex-col items-center mb-6">
                      {selectedStaff.photo ? (
                        <Image src={selectedStaff.photo} alt="" width={80} height={80} className="w-20 h-20 rounded-full object-cover mb-3" unoptimized />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-2xl mb-3">
                          {selectedStaff.name.charAt(0)}
                        </div>
                      )}
                      <h2 className="text-xl font-bold text-slate-800">{selectedStaff.name}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-medium text-blue-600">{selectedStaff.role}</span>
                        <span className="text-slate-300">•</span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          selectedStaff.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {selectedStaff.status}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <DetailRow icon={Building2} label="Department" value={selectedStaff.department} />
                      <DetailRow icon={Briefcase} label="Employee ID" value={selectedStaff.id} />
                      <DetailRow icon={Phone} label="Phone" value={selectedStaff.phone} />
                      <DetailRow icon={Mail} label="Email" value={selectedStaff.email} />
                      {selectedStaff.address && <DetailRow icon={MapPin} label="Address" value={selectedStaff.address} />}
                      {selectedStaff.joinedDate && <DetailRow icon={CalendarDays} label="Joined" value={selectedStaff.joinedDate} />}
                      {selectedStaff.emergencyContact && <DetailRow icon={BadgeCheck} label="Emergency Contact" value={selectedStaff.emergencyContact} />}
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100">
                      <button onClick={startEditing} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm shadow-blue-500/20">
                        Edit Profile
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* Shared form modal used for Add and Edit */
function StaffFormModal({
  title, data, errors, saving, onFieldChange, onPhotoChange, onSave, onClose, fileInputRef, saveLabel, hideTitle,
}: {
  title: string; data: StaffMember; errors: Record<string, string>; saving: boolean;
  onFieldChange: (f: keyof StaffMember, v: string) => void;
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void; onClose: () => void; fileInputRef: React.RefObject<HTMLInputElement | null>;
  saveLabel: string; hideTitle?: boolean;
}) {
  const currentPhoto = data.photo;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg max-h-[90vh] overflow-y-auto z-10"
      >
        {!hideTitle && (
          <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-slate-100 flex items-center justify-between rounded-t-2xl">
            <h3 className="font-bold text-slate-800 text-lg">{title}</h3>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
              <X size={20} />
            </button>
          </div>
        )}

        <div className="p-6 space-y-4">
          {/* Photo upload area */}
          <div className="flex flex-col items-center mb-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative w-20 h-20 rounded-full bg-slate-50 border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors overflow-hidden group"
            >
              {currentPhoto ? (
                <Image src={currentPhoto} alt="" width={80} height={80} className="w-full h-full object-cover" unoptimized />
              ) : (
                <div className="flex flex-col items-center text-slate-400">
                  <Upload size={20} className="group-hover:-translate-y-0.5 transition-transform" />
                  <span className="text-[10px] font-medium mt-0.5">Photo</span>
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png" className="hidden" onChange={onPhotoChange} />
            <p className="text-xs text-slate-400 mt-1.5">JPG / PNG, max 2MB</p>
          </div>

          {FORM_FIELDS.map(([field, label, required, type]) => (
            <div key={field} className="space-y-1">
              <label className="text-sm font-medium text-slate-700">
                {label} {required && <span className="text-rose-500">*</span>}
              </label>
              {type === 'select' ? (
                <select
                  value={String(data[field] || '')}
                  onChange={e => onFieldChange(field, e.target.value)}
                  className={`w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white ${errors[field] ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200'}`}
                >
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Inactive">Inactive</option>
                </select>
              ) : (
                <input
                  type={type}
                  value={String(data[field] || '')}
                  onChange={e => onFieldChange(field, e.target.value)}
                  className={`w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${errors[field] ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200'}`}
                />
              )}
              {errors[field] && <p className="text-xs text-rose-500 mt-0.5">{errors[field]}</p>}
            </div>
          ))}

          <div className="flex gap-3 pt-4 border-t border-slate-100 mt-6">
            <button onClick={onClose} className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition-colors">
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={saving}
              className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors flex items-center justify-center gap-2 ${
                saving ? 'bg-blue-400 cursor-wait' : 'bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/20'
              }`}
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {saveLabel}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
        <Icon size={16} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="font-medium text-slate-800 truncate">{value}</p>
      </div>
    </div>
  );
}
