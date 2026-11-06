import React, { useState, useEffect } from 'react';
import { X, UserPlus, GraduationCap, Building2, School, Mail, Phone, Calendar, Check } from 'lucide-react';
import { api } from '../api/client';

export default function AddStudentModal({ isOpen, onClose, onStudentAdded, departments, classes }) {
  const [formData, setFormData] = useState({
    roll_number: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    gender: 'Male',
    dob: '2004-05-15',
    department_id: '',
    class_id: '',
    address: '',
    status: 'Active'
  });

  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Set default department & class when lists load
  useEffect(() => {
    if (departments?.length > 0 && !formData.department_id) {
      const defaultDept = departments[0].id;
      setFormData(prev => ({
        ...prev,
        department_id: defaultDept
      }));
    }
  }, [departments]);

  useEffect(() => {
    if (formData.department_id) {
      // Filter matching classes
      const matchingClasses = classes.filter(c => c.department_id == formData.department_id);
      if (matchingClasses.length > 0) {
        setFormData(prev => ({ ...prev, class_id: matchingClasses[0].id }));
      } else {
        setFormData(prev => ({ ...prev, class_id: '' }));
      }

      // Fetch subjects for this department
      api.getSubjects({ department_id: formData.department_id })
        .then((res) => {
          setAvailableSubjects(res.data);
          setSelectedSubjects(res.data.map(s => s.id)); // select all by default
        })
        .catch(console.error);

      // Auto generate suggested roll number
      const deptCode = departments.find(d => d.id == formData.department_id)?.code || 'UNI';
      const randomNum = Math.floor(100 + Math.random() * 900);
      setFormData(prev => ({
        ...prev,
        roll_number: `${deptCode}-2025-${randomNum}`
      }));
    }
  }, [formData.department_id, classes, departments]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleSubject = (subjId) => {
    setSelectedSubjects(prev => 
      prev.includes(subjId) ? prev.filter(id => id !== subjId) : [...prev, subjId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await api.createStudent({
        ...formData,
        subject_ids: selectedSubjects
      });
      onStudentAdded();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredClasses = classes.filter(c => c.department_id == formData.department_id);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Enroll New Student</h2>
              <p className="text-xs text-indigo-100">Register student details, class allotment, and subjects</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Roll Number *
              </label>
              <input
                type="text"
                name="roll_number"
                value={formData.roll_number}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-sm font-mono border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="Active">Active</option>
                <option value="Graduated">Graduated</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                First Name *
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                placeholder="e.g. Liam"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Last Name *
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                placeholder="e.g. Vance"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="student@apex.edu"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Department *
              </label>
              <select
                name="department_id"
                value={formData.department_id}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Class / Section *
              </label>
              <select
                name="class_id"
                value={formData.class_id}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                {filteredClasses.length === 0 ? (
                  <option value="">No classes found for this department</option>
                ) : (
                  filteredClasses.map(c => (
                    <option key={c.id} value={c.id}>{c.name} - {c.semester}</option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Address / Campus Residence
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="e.g. 104 West Hall Dormitory"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Subject Enrollment Selection */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Subjects & Assigned Teachers to Enroll
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto border border-slate-200 rounded-xl p-3 bg-slate-50">
              {availableSubjects.length === 0 ? (
                <p className="text-xs text-slate-500">No subjects currently available in this department.</p>
              ) : (
                availableSubjects.map((sub) => {
                  const isChecked = selectedSubjects.includes(sub.id);
                  return (
                    <label 
                      key={sub.id} 
                      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer border text-xs transition-colors ${
                        isChecked ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSubject(sub.id)}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="font-bold text-slate-900">{sub.code}: {sub.name}</span>
                        <span className="text-slate-400">({sub.credits} credits)</span>
                      </div>
                      <span className="text-[11px] text-indigo-700 font-medium">
                        Instructor: {sub.teacher_name || 'TBA'}
                      </span>
                    </label>
                  );
                })
              )}
            </div>
          </div>

          {/* Submit buttons */}
          <div className="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-200 transition-all"
            >
              {submitting ? 'Registering...' : 'Enroll Student'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

