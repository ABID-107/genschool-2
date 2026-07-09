import { useState } from "react";

export function Attendance() {
  const [attendanceData, setAttendanceData] = useState([
    { id: 1, name: "Student A", roll: 101, status: "present" },
    { id: 2, name: "Student B", roll: 102, status: "present" },
    { id: 3, name: "Student C", roll: 103, status: "absent" },
  ]);

  const toggleStatus = (id: number, status: string) => {
    setAttendanceData(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200">
      <h2 className="text-xl font-bold mb-4">Class Attendance</h2>
      <div className="space-y-4">
        {attendanceData.map(student => (
          <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
            <span>{student.name} (Roll: {student.roll})</span>
            <div className="flex gap-2">
              {['present', 'absent', 'late', 'leave'].map(status => (
                <button
                  key={status}
                  onClick={() => toggleStatus(student.id, status)}
                  className={`px-3 py-1 rounded text-xs capitalize ${student.status === status ? 'bg-[var(--brand-primary)] text-white' : 'bg-slate-100'}`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button className="mt-6 bg-[var(--brand-primary)] text-white px-6 py-2 rounded-lg font-bold">Submit Attendance</button>
    </div>
  );
}

