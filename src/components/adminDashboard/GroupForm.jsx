
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, X, Users, Calendar, Video, Search, UserMinus, UserPlus} from 'lucide-react';
import useGroupStore from '../../stores/useGroupStore';
import useUserStore from '../../stores/useUserStore';
const GroupForm = ({ groupData, onClose, onSave }) => {
  const { createGroup, updateGroup, addStudentToGroup, removeStudentFromGroup, isLoading } = useGroupStore();
  const { users, fetchUsers } = useUserStore();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    level: 'تاسيس',
    students: [],
    schedule: {
      days: [],
      time: '',
      duration: 60
    },
    maxStudents: 20,
    isActive: true
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [availableStudents, setAvailableStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  // أيام الأسبوع
  const weekDays = ["السبت", "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];

  // تهيئة البيانات إذا كان هناك groupData (وضع التعديل)
  useEffect(() => {
    if (groupData) {
      setFormData({
        title: groupData.title || '',
        description: groupData.description || '',
        level: groupData.level || 'تاسيس',
        students: groupData.students || [],
        schedule: groupData.schedule || { days: [], time: '', duration: 60 },
        maxStudents: groupData.maxStudents || 20,
        zoomLink: groupData.zoomLink || '',
        zoomPassword: groupData.zoomPassword || '',
        isActive: groupData.isActive !== undefined ? groupData.isActive : true
      });
      setSelectedStudents(groupData.students || []);
    }
  }, [groupData]);

  // جلب المستخدمين المتاحين
  useEffect(() => {
    fetchUsers();
  }, []);

  // تصفية الطلاب المتاحين
  useEffect(() => {
    if (users) {
      const filtered = users.filter(user => 
        user.role === 'student' &&
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !selectedStudents.some(selected => selected._id === user._id)
      );
      setAvailableStudents(filtered);
    }
  }, [users, searchTerm, selectedStudents]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('schedule.')) {
      const scheduleField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        schedule: {
          ...prev.schedule,
          [scheduleField]: type === 'number' ? parseInt(value) : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleDayToggle = (day) => {
    setFormData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        days: prev.schedule.days.includes(day)
          ? prev.schedule.days.filter(d => d !== day)
          : [...prev.schedule.days, day]
      }
    }));
  };

  const handleAddStudent = (student) => {
    if (selectedStudents.length < formData.maxStudents) {
      setSelectedStudents(prev => [...prev, student]);
      setSearchTerm('');
    } else {
      alert(`لا يمكن إضافة أكثر من ${formData.maxStudents} طالب`);
    }
  };

  const handleRemoveStudent = (studentId) => {
    setSelectedStudents(prev => prev.filter(student => student._id !== studentId));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // يمكن إضافة toast notification هنا
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const submitData = {
        ...formData,
        students: selectedStudents.map(student => student._id)
      };

      if (groupData) {
        await updateGroup(groupData._id, submitData);
      } else {
        await createGroup(submitData);
      }
      onSave();
    } catch (error) {
      console.error('Failed to save group:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-4 md:p-6 bg-base-100 rounded-lg"
    >
      {/* الرأس */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {groupData ? 'تعديل المجموعة' : 'إنشاء مجموعة جديدة'}
            </h1>
            <p className="text-gray-600">أدخل تفاصيل المجموعة الدراسية</p>
          </div>
        </div>
        <button onClick={onClose} className="btn btn-ghost btn-circle">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* المعلومات الأساسية */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text">عنوان المجموعة *</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="مثال: مجموعة التأسيس المتقدم"
              className="input input-bordered"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">المستوى *</span>
            </label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="select select-bordered"
              required
            >
              <option value="تاسيس">تأسيس</option>
              <option value="حفظ">حفظ</option>
            </select>
          </div>
        </div>

        {/* الوصف */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">وصف المجموعة *</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="وصف مختصر عن أهداف المجموعة ومحتواها الدراسي"
            className="textarea textarea-bordered h-24"
            required
          />
        </div>

        {/* الجدول الزمني */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Calendar className="h-5 w-5 ml-2" />
            الجدول الزمني
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* أيام الدراسة */}
            <div>
              <label className="label">
                <span className="label-text">أيام الدراسة *</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {weekDays.map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayToggle(day)}
                    className={`btn btn-sm ${
                      formData.schedule.days.includes(day) 
                        ? 'btn-primary' 
                        : 'btn-outline'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* الوقت والمدة */}
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">وقت البدء *</span>
                </label>
                <input
                  type="time"
                  name="schedule.time"
                  value={formData.schedule.time}
                  onChange={handleChange}
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">مدة الحصة (دقيقة) *</span>
                </label>
                <input
                  type="number"
                  name="schedule.duration"
                  value={formData.schedule.duration}
                  onChange={handleChange}
                  min="30"
                  max="180"
                  className="input input-bordered"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* إعدادات Zoom */}
        {/* <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Video className="h-5 w-5 ml-2" />
            إعدادات Zoom
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">رابط Zoom</span>
              </label>
              <div className="relative">
                <input
                  type="url"
                  name="zoomLink"
                  value={formData.zoomLink}
                  onChange={handleChange}
                  placeholder="https://zoom.us/j/..."
                  className="input input-bordered w-full pr-10"
                />
                {formData.zoomLink && (
                  <button
                    type="button"
                    onClick={() => copyToClipboard(formData.zoomLink)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <Copy className="h-4 w-4 text-gray-500" />
                  </button>
                )}
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">كلمة مرور Zoom</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="zoomPassword"
                  value={formData.zoomPassword}
                  onChange={handleChange}
                  placeholder="كلمة المرور"
                  className="input input-bordered w-full pr-10"
                />
                {formData.zoomPassword && (
                  <button
                    type="button"
                    onClick={() => copyToClipboard(formData.zoomPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <Copy className="h-4 w-4 text-gray-500" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div> */}

        {/* إدارة الطلاب */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Users className="h-5 w-5 ml-2" />
            إدارة الطلاب
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* الحد الأقصى للطلاب */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">الحد الأقصى للطلاب</span>
              </label>
              <input
                type="number"
                name="maxStudents"
                value={formData.maxStudents}
                onChange={handleChange}
                min="1"
                max="50"
                className="input input-bordered"
              />
              <div className="text-sm text-gray-500 mt-1">
                {selectedStudents.length} / {formData.maxStudents} طالب
              </div>
            </div>

            {/* بحث الطلاب */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">إضافة طلاب</span>
              </label>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ابحث عن طالب..."
                  className="input input-bordered w-full pl-4 pr-10"
                />
              </div>
            </div>
          </div>

          {/* قائمة الطلاب المتاحين */}
          {searchTerm && availableStudents.length > 0 && (
            <div className="mt-4 max-h-40 overflow-y-auto">
              <div className="space-y-2">
                {availableStudents.map(student => (
                  <div key={student._id} className="flex items-center justify-between p-2 bg-white rounded border">
                    <div>
                      <div className="font-medium">{student.name}</div>
                      <div className="text-sm text-gray-500">{student.email}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddStudent(student)}
                      className="btn btn-sm btn-primary"
                      disabled={selectedStudents.length >= formData.maxStudents}
                    >
                      <UserPlus size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* الطلاب المضافين */}
          <div className="mt-4">
            <h4 className="font-medium mb-2">الطلاب المضافين ({selectedStudents.length})</h4>
            {selectedStudents.length === 0 ? (
              <p className="text-gray-500 text-center py-4">لم يتم إضافة أي طلاب بعد</p>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedStudents.map(student => (
                  <div key={student._id} className="flex items-center justify-between p-2 bg-white rounded border">
                    <div>
                      <div className="font-medium">{student.name}</div>
                      <div className="text-sm text-gray-500">{student.email}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveStudent(student._id)}
                      className="btn btn-sm btn-error"
                    >
                      <UserMinus size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* الحالة */}
        <div className="form-control">
          <label className="cursor-pointer label justify-start">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="checkbox checkbox-primary ml-2"
            />
            <span className="label-text">المجموعة نشطة</span>
          </label>
        </div>

        {/* أزرار الحفظ */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <button type="button" onClick={onClose} className="btn btn-outline">
            إلغاء
          </button>
          <button 
            type="submit" 
            className="btn btn-primary gap-2"
            disabled={isLoading}
          >
            <Save size={20} />
            {isLoading ? 'جاري الحفظ...' : (groupData ? 'تحديث المجموعة' : 'إنشاء المجموعة')}
          </button>
        </div>
      </form>
    </motion.div>
  );
};
export default GroupForm