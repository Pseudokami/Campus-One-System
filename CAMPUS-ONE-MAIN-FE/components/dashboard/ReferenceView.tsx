"use client";

import React, { useState, useEffect } from "react";
import { Plus, Users, BookOpen, AlertCircle, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReferenceViewProps {
  parent: "Classes" | "Subjects" | "Students" | "Employees" | "Fees" | "Attendance";
  activeSubtab: string;
}

export function ReferenceView({ parent, activeSubtab }: ReferenceViewProps) {
  if (parent === "Classes") {
    if (activeSubtab === "All Classes") return <AllClassesGrid />;
    if (activeSubtab === "New Class") return <NewClassForm />;
  }

  if (parent === "Subjects") {
    if (activeSubtab === "Classes With Subjects") return <ClassesWithSubjectsList />;
    if (activeSubtab === "Assign Subjects") return <AssignSubjectsForm />;
  }

  if (parent === "Students") {
    if (activeSubtab === "All Students") return <AllStudentsGrid />;
    if (activeSubtab === "Add New") return <AdmissionForm />;
    if (activeSubtab === "Admission Letter") return <AdmissionLetterView />;
    if (activeSubtab === "Student ID Cards") return <StudentIDCardsView />;
    if (activeSubtab === "Print Basic List") return <PrintBasicListView />;
    if (activeSubtab === "Manage Login") return <ManageLoginView />;
  }

  if (parent === "Employees") {
    if (activeSubtab === "All Employees") return <AllEmployeesGrid />;
    if (activeSubtab === "Add New") return <NewEmployeeForm />;
    if (activeSubtab === "Job Letter") return <JobLetterView />;
    if (activeSubtab === "Manage Login") return <StaffLoginView />;
  }

  if (parent === "Fees") {
    if (activeSubtab === "Generate Fees Invoice") return <GenerateFeesInvoiceView />;
    if (activeSubtab === "Collect Fees") return <CollectFeesView />;
    if (activeSubtab === "Fees Paid Slip") return <FeesPaidSlipView />;
    if (activeSubtab === "Fees Defaulters") return <FeesDefaultersView />;
  }

  if (parent === "Attendance") {
    if (activeSubtab === "Students Attendance") return <StudentsAttendanceView />;
    if (activeSubtab === "Employees Attendance") return <EmployeesAttendanceView />;
    if (activeSubtab === "Class wise Report") return <ClassWiseReportView />;
    if (activeSubtab === "Students Attendance Report") return <StudentsAttendanceReportView />;
    if (activeSubtab === "Employees Attendance Report") return <EmployeesAttendanceReportView />;
  }

  return (
    <div className="p-8 text-center text-gray-500 border border-dashed border-gray-200 rounded-2xl">
      Content for {parent} / {activeSubtab} is under development to match the reference.
    </div>
  );
}

function AllStudentsGrid() {
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/students")
      .then((res) => res.json())
      .then((data) => setStudents(data));
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <button className="flex flex-col items-center justify-center gap-3 h-40 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-all group">
        <div className="p-3 rounded-full bg-primary/20 text-primary group-hover:scale-110 transition-transform">
          <Plus className="w-8 h-8" />
        </div>
        <span className="font-bold text-primary">Add New</span>
      </button>

      {students.map((student) => (
        <div key={student.id} className="flex flex-col p-6 rounded-2xl border border-gray-200 bg-white hover:border-primary/50 transition-colors shadow-sm">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <span className={cn(
              "px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
              student.status === "Enrolled" ? "bg-green-500/10 text-green-500" : "bg-primary/10 text-primary"
            )}>
              {student.status}
            </span>
          </div>
          <h3 className="mt-4 font-bold text-lg text-gray-900">{student.name}</h3>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">ID</span>
              <span className="font-semibold text-gray-900">{student.id}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Level</span>
              <span className="font-semibold text-gray-900">{student.level}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AdmissionForm() {
  const [showAlert, setShowAlert] = useState(false);
  const [classCount, setClassCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/classes")
      .then((res) => res.json())
      .then((data: any[]) => {
        setClassCount(data.length);
        if (data.length === 0) setShowAlert(true);
      });
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {showAlert && classCount === 0 && (
        <div className="rounded-xl overflow-hidden border border-primary/20 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-primary px-4 py-2 flex items-center justify-between">
            <span className="text-[11px] font-black text-white uppercase tracking-tighter">Campus One</span>
            <button onClick={() => setShowAlert(false)} className="text-[#111] hover:bg-gray-100 rounded-md p-1 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="bg-white p-6 flex flex-col items-center text-center gap-4">
            <div className="flex items-center gap-2 text-gray-900 font-bold">
              <AlertCircle className="w-5 h-5 text-primary" />
              <span>Alert</span>
            </div>
            <p className="text-sm text-gray-500 font-medium">No Class has been found. Please add at least one Class before to access this feature.</p>
            <button className="mt-2 bg-primary/10 hover:bg-primary/20 text-primary px-6 py-2 rounded-lg text-xs font-bold transition-colors">
              Ok, Add Class
            </button>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Admission Form</h2>
          <div className="mt-2 flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-primary"></div> Required*</span>
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-muted-foreground"></div> Optional</span>
          </div>
        </div>

        <form className="space-y-12">
          {/* Section 1 */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-black text-sm">1</div>
              <h3 className="text-lg font-bold text-gray-900">Student Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Student Name*</label>
                <input type="text" placeholder="Name Of Student" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Last Registration: None</label>
                <input type="text" placeholder="Registration No" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Select Class*</label>
                <select className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all appearance-none"><option>Select*</option></select>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-black text-sm">2</div>
              <h3 className="text-lg font-bold text-gray-900">Other Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Date Of Birth</label>
                <input type="date" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Student Birth Form ID / NIC</label>
                <input type="text" placeholder="Student Birth Form ID / NIC" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Orphan Student</label>
                <select className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all appearance-none"><option>Select</option></select>
              </div>
            </div>
          </div>

          <button className="w-full mt-4 bg-primary text-white font-black py-4 rounded-full hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
            <Plus className="w-5 h-5" />
            Submit Admission
          </button>
        </form>
      </div>
    </div>
  );
}

function AdmissionLetterView() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 flex flex-col items-center justify-center gap-6 shadow-sm min-h-[400px]">
        <div className="relative w-full max-w-md">
          <input 
            type="text" 
            placeholder="Search Student" 
            className="w-full h-14 rounded-full border border-gray-200 bg-white pl-6 pr-12 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all"
          />
          <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-50 transition-colors">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </button>
        </div>
        <p className="text-gray-500 text-sm font-medium">Search for a student to generate their admission letter.</p>
      </div>
    </div>
  );
}

function StudentIDCardsView() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-wrap items-center gap-3">
        {["Default", "Style 1", "Style 2", "Style 3", "Style 4"].map((style, i) => (
          <button 
            key={style}
            className={cn(
              "px-6 py-2 rounded-lg text-xs font-bold transition-all border",
              i === 0 ? "bg-primary text-white border-primary" : "bg-white text-gray-500 border-gray-200 hover:border-primary/50"
            )}
          >
            {style}
          </button>
        ))}
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-12 flex flex-col items-center justify-center text-center gap-4 min-h-[400px]">
        <div className="p-4 rounded-full bg-primary/5 border border-dashed border-primary/20">
          <Users className="w-12 h-12 text-primary opacity-20" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Student ID Preview</h3>
        <p className="text-gray-500 text-sm max-w-xs">Select a style and class to preview student ID cards for printing.</p>
      </div>
    </div>
  );
}

function PrintBasicListView() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
      <div className="p-8 space-y-8">
        <div className="max-w-md">
          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Select Class*</label>
          <select className="mt-2 w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all appearance-none">
            <option>Select*</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {["Copy", "CSV", "Excel", "PDF", "Print"].map(tool => (
              <button key={tool} className="px-4 py-2 bg-white/5 border border-gray-200 rounded-lg text-xs font-bold text-gray-900 hover:bg-white/10 transition-all">{tool}</button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Search:</span>
            <input type="text" className="h-10 rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-primary/80 text-white font-black uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Sr</th>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Father</th>
                <th className="px-6 py-4">Class</th>
                <th className="px-6 py-4">Fee Remainings</th>
                <th className="px-6 py-4">Phone</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-gray-500 italic bg-gray-50">
                  No data available in table
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between text-xs font-medium text-gray-500 px-2">
          <span>Showing 0 to 0 of 0 entries</span>
          <div className="flex gap-4">
            <button className="hover:text-gray-900 transition-colors">Previous</button>
            <button className="hover:text-gray-900 transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AllClassesGrid() {
  const [classes, setClasses] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/classes")
      .then((res) => res.json())
      .then((data) => setClasses(data));
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <button className="flex flex-col items-center justify-center gap-3 h-40 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-all group">
        <div className="p-3 rounded-full bg-primary/20 text-primary group-hover:scale-110 transition-transform">
          <Plus className="w-8 h-8" />
        </div>
        <span className="font-bold text-primary">Add New</span>
      </button>

      {classes.map((cls) => (
        <div key={cls.id} className="flex flex-col p-6 rounded-2xl border border-gray-200 bg-white hover:border-primary/50 transition-colors shadow-sm">
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <Users className="w-6 h-6" />
            </div>
            <span className={cn(
              "px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
              cls.status === "Ready" ? "bg-green-500/10 text-green-500" : "bg-primary/10 text-primary"
            )}>
              {cls.status}
            </span>
          </div>
          <h3 className="mt-4 font-bold text-lg text-gray-900">{cls.name}</h3>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Adviser</span>
              <span className="font-semibold text-gray-900">{cls.adviser}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Students</span>
              <span className="font-semibold text-gray-900">{cls.students}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function NewClassForm() {
  const [showAlert, setShowAlert] = useState(false);
  const [employeeCount, setEmployeeCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/employees")
      .then((res) => res.json())
      .then((data: any[]) => {
        setEmployeeCount(data.length);
        if (data.length === 0) setShowAlert(true);
      });
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {showAlert && employeeCount === 0 && (
        <div className="rounded-xl overflow-hidden border border-primary/20 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-primary px-4 py-2 flex items-center justify-between">
            <span className="text-[11px] font-black text-white uppercase tracking-tighter">Campus One</span>
            <button onClick={() => setShowAlert(false)} className="text-[#111] hover:bg-gray-100 rounded-md p-1 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="bg-white p-6 flex flex-col items-center text-center gap-4">
            <div className="flex items-center gap-2 text-gray-900 font-bold">
              <AlertCircle className="w-5 h-5 text-primary" />
              <span>Alert</span>
            </div>
            <p className="text-sm text-gray-500 font-medium">0 Teachers | Please add a Teacher first.</p>
            <button className="mt-2 bg-primary/10 hover:bg-primary/20 text-primary px-6 py-2 rounded-lg text-xs font-bold transition-colors">
              Ok, Add Teacher
            </button>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Add New Class</h2>
          <div className="mt-2 flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-primary"></div> Required*</span>
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-muted-foreground"></div> Optional</span>
          </div>
        </div>

        <form className="space-y-6">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Class Name*</label>
            <input 
              type="text" 
              placeholder="Name Of Class"
              className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Monthly Tuition Fees*</label>
            <input 
              type="number" 
              placeholder="Monthly Tuition Fees"
              className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Select Class Teacher*</label>
            <select className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all appearance-none">
              <option>Select*</option>
            </select>
          </div>
          <button className="w-full mt-4 bg-primary text-white font-black py-4 rounded-full hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" />
            Create
          </button>
        </form>
      </div>
    </div>
  );
}

function ClassesWithSubjectsList() {
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/classes").then((res) => res.json()),
      fetch("/api/subjects").then((res) => res.json()),
    ]).then(([classData, subjectData]) => {
      setClasses(classData);
      setSubjects(subjectData);
    });
  }, []);

  function subjectCountForClass(cls: any) {
    return subjects.filter((s) => cls.name && s.level && cls.name.includes(s.level)).length;
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-bold text-gray-900 tracking-tight">Classes With Subjects</h2>
        <p className="text-xs text-gray-500 font-medium mt-1">List of classes and their assigned subject counts.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-[11px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200">
            <tr>
              <th className="px-8 py-4">#</th>
              <th className="px-8 py-4">Class Name</th>
              <th className="px-8 py-4">Subjects Count</th>
              <th className="px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {classes.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-8 py-10 text-center text-gray-500 italic bg-gray-50">No classes found</td>
              </tr>
            ) : (
              classes.map((cls, index) => (
                <tr key={cls.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-4 text-gray-500 font-mono">{index + 1}</td>
                  <td className="px-8 py-4 font-bold text-gray-900">{cls.name}</td>
                  <td className="px-8 py-4">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[11px] font-black">{subjectCountForClass(cls)} Subjects</span>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <button className="text-primary hover:underline text-xs font-bold">Manage Subjects</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AssignSubjectsForm() {
  const [showAlert, setShowAlert] = useState(false);
  const [classCount, setClassCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/classes")
      .then((res) => res.json())
      .then((data: any[]) => {
        setClassCount(data.length);
        if (data.length === 0) setShowAlert(true);
      });
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {showAlert && classCount === 0 && (
        <div className="rounded-xl overflow-hidden border border-primary/20 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-primary px-4 py-2 flex items-center justify-between">
            <span className="text-[11px] font-black text-white uppercase tracking-tighter">Campus One</span>
            <button onClick={() => setShowAlert(false)} className="text-[#111] hover:bg-gray-100 rounded-md p-1 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="bg-white p-6 flex flex-col items-center text-center gap-4">
            <div className="flex items-center gap-2 text-gray-900 font-bold">
              <AlertCircle className="w-5 h-5 text-primary" />
              <span>Alert</span>
            </div>
            <p className="text-sm text-gray-500 font-medium">No Class has been found. Please add at least one Class before to access this feature.</p>
            <button className="mt-2 bg-primary/10 hover:bg-primary/20 text-primary px-6 py-2 rounded-lg text-xs font-bold transition-colors">
              Ok, Add Class
            </button>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Create Subjects</h2>
          <div className="mt-2 flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-primary"></div> Required*</span>
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-muted-foreground"></div> Optional</span>
          </div>
        </div>

        <form className="space-y-6">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Select Class*</label>
            <select className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all appearance-none">
              <option>Select*</option>
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Subject Name*</label>
              <input 
                type="text" 
                placeholder="Name Of Subject"
                className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Marks*</label>
              <input 
                type="number" 
                placeholder="Total Exam Marks"
                className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button type="button" className="bg-primary/10 text-primary px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border border-primary/20">+ Add More</button>
            <button type="button" className="bg-red-500/10 text-red-500 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border border-red-500/20">- Remove</button>
          </div>

          <button className="w-full mt-4 bg-primary text-white font-black py-4 rounded-full hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" />
            Assign Subjects
          </button>
        </form>
      </div>
    </div>
  );
}

function ManageLoginView() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_2fr] gap-6 items-start">
      {/* Search Sidebar */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm space-y-8">
        <div className="flex flex-col items-center text-center gap-2">
          <div className="flex items-center gap-2 text-gray-900 font-black text-xl">
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            Search
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 bg-white px-2 relative z-10 -mb-2 w-fit">Search Student*</label>
            <input 
              type="text" 
              placeholder="Search Student" 
              className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 bg-white px-2 relative z-10 -mb-2 w-fit">Select Class*</label>
            <select className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all appearance-none">
              <option>Select*</option>
            </select>
          </div>
          <div className="text-center">
            <button className="text-primary hover:underline text-xs font-bold uppercase tracking-widest">or, Reload All</button>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
        <div className="p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {["Copy", "CSV", "Excel", "PDF", "Print"].map(tool => (
                <button key={tool} className="px-4 py-2 bg-white/5 border border-gray-200 rounded-lg text-xs font-bold text-gray-900 hover:bg-white/10 transition-all">{tool}</button>
              ))}
              <button className="px-4 py-2 bg-white/5 border border-gray-200 rounded-lg text-xs font-bold text-gray-900 hover:bg-white/10 transition-all flex items-center gap-2">
                Column visibility <ChevronDown className="w-3 h-3" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">Search:</span>
              <input type="text" className="h-10 rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Student Name</th>
                  <th className="px-6 py-4">Class</th>
                  <th className="px-6 py-4">Username</th>
                  <th className="px-6 py-4">Password</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 italic bg-gray-50">
                    No data available in table
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between text-xs font-medium text-gray-500 px-2">
            <span>Showing 0 to 0 of 0 entries</span>
            <div className="flex gap-4">
              <button className="hover:text-gray-900 transition-colors">Previous</button>
              <button className="hover:text-gray-900 transition-colors">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



function AllEmployeesGrid() {
  const [employees, setEmployees] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/employees")
      .then((res) => res.json())
      .then((data) => setEmployees(data));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-end items-center gap-4">
        <div className="relative w-full max-w-sm">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 bg-white px-2 relative z-10 -mb-2 w-fit">Search Employee*</label>
          <input type="text" placeholder="Search Employee" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
        </div>
        <button className="bg-primary px-6 h-12 rounded-xl text-white font-bold flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
          All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <button className="flex flex-col items-center justify-center gap-3 h-40 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-all group">
          <div className="p-3 rounded-full bg-primary/20 text-primary group-hover:scale-110 transition-transform">
            <Plus className="w-8 h-8" />
          </div>
          <span className="font-bold text-primary">Add New</span>
        </button>

        {employees.map((emp) => (
          <div key={emp.id} className="flex flex-col p-6 rounded-2xl border border-gray-200 bg-white hover:border-primary/50 transition-colors shadow-sm">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary">
                {emp.status}
              </span>
            </div>
            <h3 className="mt-4 font-bold text-lg text-gray-900">{emp.name}</h3>
            <p className="text-primary text-xs font-bold mt-1 uppercase tracking-wider">{emp.role}</p>
            <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-xs">
              <span className="text-gray-500">{emp.department}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NewEmployeeForm() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="text-center mb-10 relative">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Employee Form</h2>
          <div className="mt-2 flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-primary"></div> Required*</span>
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-muted-foreground"></div> Optional</span>
          </div>
          <button className="absolute right-0 top-0 bg-red-500/10 text-red-500 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border border-red-500/20 flex items-center gap-2">
            <X className="w-3.5 h-3.5" /> Customize
          </button>
        </div>

        <form className="space-y-12">
          {/* Section 1 */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-black text-sm">1</div>
              <h3 className="text-lg font-bold text-gray-900">Basic Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Employee Name*</label>
                <input type="text" placeholder="Name of Employee" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Mobile No for SMS/WhatsApp</label>
                <input type="text" placeholder="e.g +44xxxxxxxxxx" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Employee Role*</label>
                <select className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all appearance-none"><option>Select*</option></select>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-end">
            <button type="reset" className="px-8 py-3 rounded-xl bg-white/5 text-gray-900 font-bold hover:bg-white/10 transition-all flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              Reset
            </button>
            <button type="submit" className="px-12 py-3 rounded-xl bg-primary text-white font-black hover:scale-[1.02] transition-all flex items-center gap-2 shadow-lg shadow-primary/20">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function JobLetterView() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 flex flex-col items-center justify-center gap-6 shadow-sm min-h-[400px]">
        <div className="relative w-full max-w-md">
          <input 
            type="text" 
            placeholder="Search Employee" 
            className="w-full h-14 rounded-full border border-gray-200 bg-white pl-6 pr-12 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all"
          />
          <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-50 transition-colors">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </button>
        </div>
        <p className="text-gray-500 text-sm font-medium">Search for an employee to generate their job letter.</p>
      </div>
    </div>
  );
}

function StaffLoginView() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_2fr] gap-6 items-start">
      {/* Search Sidebar */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm space-y-8">
        <div className="flex flex-col items-center text-center gap-2">
          <div className="flex items-center gap-2 text-gray-900 font-black text-xl">
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            Search
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 bg-white px-2 relative z-10 -mb-2 w-fit">Search Employee*</label>
            <input 
              type="text" 
              placeholder="Search Employee" 
              className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 bg-white px-2 relative z-10 -mb-2 w-fit">Select Role*</label>
            <select className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all appearance-none">
              <option>Select*</option>
            </select>
          </div>
          <div className="text-center">
            <button className="text-primary hover:underline text-xs font-bold uppercase tracking-widest">or, Reload All</button>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
        <div className="p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {["Copy", "CSV", "Excel", "PDF", "Print"].map(tool => (
                <button key={tool} className="px-4 py-2 bg-white/5 border border-gray-200 rounded-lg text-xs font-bold text-gray-900 hover:bg-white/10 transition-all">{tool}</button>
              ))}
              <button className="px-4 py-2 bg-white/5 border border-gray-200 rounded-lg text-xs font-bold text-gray-900 hover:bg-white/10 transition-all flex items-center gap-2">
                Column visibility <ChevronDown className="w-3 h-3" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">Search:</span>
              <input type="text" className="h-10 rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Staff Name</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Username</th>
                  <th className="px-6 py-4">Password</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 italic bg-gray-50">
                    No data available in table
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between text-xs font-medium text-gray-500 px-2">
            <span>Showing 0 to 0 of 0 entries</span>
            <div className="flex gap-4">
              <button className="hover:text-gray-900 transition-colors">Previous</button>
              <button className="hover:text-gray-900 transition-colors">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GenerateFeesInvoiceView() {
  const [className, setClassName] = useState("");
  const [month, setMonth] = useState("");
  const [hasBankAccount, setHasBankAccount] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setHasBankAccount(!!localStorage.getItem("campus_fees_account"));
  }, []);

  function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (!className.trim() || !month) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!hasBankAccount) {
      setError("Please configure your bank account info under General Settings → Accounts For Fees Invoice first.");
      return;
    }
    setSuccess(true);
  }

  if (hasBankAccount === null) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {!hasBankAccount && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 font-medium">
            Bank account information is required before generating invoices.{" "}
            <a href="/general-settings?tab=accounts-fees-invoice" className="font-bold underline hover:text-amber-900">
              Configure it in General Settings
            </a>
            .
          </p>
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white p-8 flex flex-col items-center gap-6 shadow-sm">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-bold text-gray-900">Generate Fees Invoice</h3>
          <p className="text-gray-500 text-sm">Enter a class and select a month to generate invoices for all students.</p>
        </div>

        <form onSubmit={handleGenerate} className="w-full max-w-lg space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative w-full">
              <span className="absolute -top-2 left-3 z-10 bg-white px-1 text-[10px] font-bold text-primary uppercase tracking-widest">
                Class <span className="text-red-500">*</span>
              </span>
              <input
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="e.g. Grade 10 - Section A"
                className="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 pt-2 text-sm text-gray-800 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 placeholder:text-gray-400"
              />
            </div>

            <div className="relative w-full">
              <span className="absolute -top-2 left-3 z-10 bg-white px-1 text-[10px] font-bold text-primary uppercase tracking-widest">
                Month <span className="text-red-500">*</span>
              </span>
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 pt-2 text-sm text-gray-800 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-500 font-medium text-center">{error}</p>}
          {success && <p className="text-sm text-green-600 font-bold text-center">Invoice generated successfully!</p>}

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={!hasBankAccount}
              className="bg-primary text-white font-black px-12 py-4 rounded-full hover:scale-[1.02] transition-all shadow-lg shadow-primary/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Generate Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CollectFeesView() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 flex flex-col items-center justify-center gap-6 shadow-sm min-h-[400px]">
        <div className="relative w-full max-w-md">
          <input 
            type="text" 
            placeholder="Search Student by ID or Name" 
            className="w-full h-14 rounded-full border border-gray-200 bg-white pl-6 pr-12 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all"
          />
          <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-50 transition-colors">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </button>
        </div>
        <p className="text-gray-500 text-sm font-medium">Search for a student to collect fees.</p>
      </div>
    </div>
  );
}

function FeesPaidSlipView() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 flex flex-col items-center justify-center gap-6 shadow-sm min-h-[400px]">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-bold text-gray-900">Fees Paid Slips</h3>
          <p className="text-gray-500 text-sm">View and print payment slips for students.</p>
        </div>
        <div className="relative w-full max-w-md">
          <input 
            type="text" 
            placeholder="Search Student" 
            className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all"
          />
        </div>
      </div>
    </div>
  );
}

function FeesDefaultersView() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Fees Defaulters List</h3>
          <button className="bg-red-500/10 text-red-500 px-4 py-2 rounded-lg text-xs font-bold border border-red-500/20">Print List</button>
        </div>
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Class</th>
                <th className="px-6 py-4">Pending Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic bg-gray-50">
                  No defaulters found
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StudentsAttendanceView() {
  const [activeTab, setActiveTab] = useState("Manual Attendance");
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-center gap-1 bg-white/5 p-1 rounded-xl w-fit mx-auto">
        {["Manual Attendance", "Card Scanning"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-6 py-2 rounded-lg text-xs font-bold transition-all",
              activeTab === tab ? "bg-white text-black shadow-lg" : "text-gray-500 hover:text-gray-900"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-12 shadow-sm flex flex-col items-center text-center space-y-8">
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-gray-900">Add/update attendance</h3>
          <div className="flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-primary"></div> Required*</span>
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-muted-foreground"></div> Optional</span>
          </div>
        </div>

        <form className="w-full max-w-lg space-y-6">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 bg-white px-2 relative z-10 -mb-2 w-fit">Date*</label>
            <input type="date" defaultValue={today} className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 bg-white px-2 relative z-10 -mb-2 w-fit">Search Class*</label>
            <select className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all appearance-none"><option>Select Class</option></select>
          </div>
          <button className="bg-primary text-white font-black px-12 py-3 rounded-full hover:scale-[1.02] transition-all flex items-center gap-2 mx-auto">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

function EmployeesAttendanceView() {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-center gap-1 bg-white/5 p-1 rounded-xl w-fit mx-auto">
        <button className="bg-white text-black px-6 py-2 rounded-lg text-xs font-bold shadow-lg">Manual Attendance</button>
        <button className="text-gray-500 hover:text-gray-900 px-6 py-2 rounded-lg text-xs font-bold">Card Scanning</button>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-12 shadow-sm flex flex-col items-center text-center space-y-8">
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-gray-900">Add/update attendance</h3>
          <div className="flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-primary"></div> Required*</span>
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-muted-foreground"></div> Optional</span>
          </div>
        </div>

        <form className="w-full max-w-lg space-y-6">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 bg-white px-2 relative z-10 -mb-2 w-fit">Date*</label>
            <input type="date" defaultValue={today} className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
          </div>
          <button className="bg-primary text-white font-black px-12 py-3 rounded-full hover:scale-[1.02] transition-all flex items-center gap-2 mx-auto">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

function ClassWiseReportView() {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="max-w-xs">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 bg-white px-2 relative z-10 -mb-2 w-fit">Date*</label>
          <input type="date" defaultValue={today} className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
        </div>
      </div>
    </div>
  );
}

function StudentsAttendanceReportView() {
  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const dateRangeLabel = `${firstOfMonth.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} - ${now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
      <div className="p-8 space-y-8">
        <div className="flex items-center gap-4">
          <button className="bg-primary text-white px-6 py-2.5 rounded-lg text-xs font-black flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            {dateRangeLabel}
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {["Copy", "CSV", "Excel", "PDF", "Print"].map(tool => (
              <button key={tool} className="px-4 py-2 bg-white/5 border border-gray-200 rounded-lg text-xs font-bold text-gray-900 hover:bg-white/10 transition-all">{tool}</button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Search:</span>
            <input type="text" className="h-10 rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">DATE</th>
                <th className="px-6 py-4">DAY</th>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">NAME</th>
                <th className="px-6 py-4">CLASS</th>
                <th className="px-6 py-4">STATUS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500 italic bg-gray-50">
                  No data available in table
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function EmployeesAttendanceReportView() {
  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const dateRangeLabel = `${firstOfMonth.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} - ${now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
      <div className="p-8 space-y-8">
        <div className="flex items-center gap-4">
          <button className="bg-primary text-white px-6 py-2.5 rounded-lg text-xs font-black flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            {dateRangeLabel}
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {["Copy", "CSV", "Excel", "PDF", "Print"].map(tool => (
              <button key={tool} className="px-4 py-2 bg-white/5 border border-gray-200 rounded-lg text-xs font-bold text-gray-900 hover:bg-white/10 transition-all">{tool}</button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Search:</span>
            <input type="text" className="h-10 rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-900 focus:border-[#F59E0B] outline-none transition-all" />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">DATE</th>
                <th className="px-6 py-4">DAY</th>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">NAME</th>
                <th className="px-6 py-4">TYPE</th>
                <th className="px-6 py-4">STATUS</th>
                <th className="px-6 py-4">TIME <span className="text-[10px] font-normal italic">[Card Scanning]</span></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500 italic bg-gray-50">
                  No data available in table
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
