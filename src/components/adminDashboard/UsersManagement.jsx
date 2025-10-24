import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Mail,
  Phone,
  GraduationCap,
  UserCheck,
  UserX,
  Shield,
  BookOpen,
  Save,
  X,
  Eye,
  EyeOff,
  BarChart3,
  FileText,
} from "lucide-react";
import useUserStore from "../../stores/useUserStore";
import useGroupStore from "../../stores/useGroupStore";
import useExamStore from "../../stores/useExamStore";

const UsersManagement = () => {
  const {
    users,
    isLoading,
    error,
    filters,
    pagination,
    fetchUsers,
    updateUser,
    deleteUser,
    toggleUserStatus,
    applyFilters,
    clearSearch,
    addUserToGroup,
    removeUserFromGroup,
  } = useUserStore();

  const { groups, fetchGroups } = useGroupStore();
  const { examResults, fetchExamResults } = useExamStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [expandedUser, setExpandedUser] = useState(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showExamResults, setShowExamResults] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchGroups();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters({ search: searchTerm });
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowUserForm(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm("هل أنت متأكد من أنك تريد حذف هذا المستخدم؟")) {
      try {
        await deleteUser(userId);
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      await toggleUserStatus(userId);
    } catch (error) {
      console.error("Failed to toggle user status:", error);
    }
  };

  const handleUpdateUser = async (userData) => {
    try {
      await updateUser(editingUser._id, userData);
      setEditingUser(null);
      setShowUserForm(false);
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const handleAddToGroup = async (userId, groupId) => {
    try {
      await addUserToGroup(userId, groupId);
    } catch (error) {
      console.error("Failed to add user to group:", error);
    }
  };

  const handleRemoveFromGroup = async (userId, groupId) => {
    try {
      await removeUserFromGroup(userId, groupId);
    } catch (error) {
      console.error("Failed to remove user from group:", error);
    }
  };

  const handleShowExamResults = (user) => {
    setShowExamResults(user);
  };

  const handleCloseExamResults = () => {
    setShowExamResults(null);
  };

  const getRoleBadge = (role) => {
    const roles = {
      admin: { label: "مشرف", color: "badge-error" },
      teacher: { label: "معلم", color: "badge-warning" },
      student: { label: "طالب", color: "badge-primary" },
      elder: { label: "كبار", color: "badge-success" },
    };
    return roles[role] || { label: role, color: "badge-outline" };
  };

  const getLevelBadge = (level) => {
    const levels = {
      مبتدئ: "badge-success",
      متوسط: "badge-warning",
      متقدم: "badge-error",
    };
    return levels[level] || "badge-outline";
  };

  if (showUserForm && editingUser) {
    return (
      <UserEditForm
        user={editingUser}
        onSave={handleUpdateUser}
        onCancel={() => {
          setShowUserForm(false);
          setEditingUser(null);
        }}
        groups={groups}
      />
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* العنوان وأزرار التحكم */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            إدارة المستخدمين
          </h1>
          <p className="text-gray-600 mt-1">
            إدارة مستخدمي النظام والصلاحيات والمجموعات
          </p>
        </div>

        <div className="flex gap-2">
          <button
            className="btn btn-primary gap-2"
            onClick={() => setShowUserForm(true)}
          >
            <Plus size={20} />
            مستخدم جديد
          </button>
        </div>
      </div>

      {/* أدوات البحث والتصفية */}
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
            <Search
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="ابحث عن مستخدم بالاسم أو البريد..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered w-full pl-4 pr-10"
            />
          </form>

          <div className="flex flex-wrap gap-2">
            <select
              value={filters.role}
              onChange={(e) => applyFilters({ role: e.target.value })}
              className="select select-bordered select-sm"
            >
              <option value="">جميع الأدوار</option>
              <option value="student">طالب</option>
              <option value="teacher">معلم</option>
              <option value="admin">مشرف</option>
            </select>

            <select
              value={filters.level}
              onChange={(e) => applyFilters({ level: e.target.value })}
              className="select select-bordered select-sm"
            >
              <option value="">جميع المستويات</option>
              <option value="مبتدئ">مبتدئ</option>
              <option value="متوسط">متوسط</option>
              <option value="متقدم">متقدم</option>
            </select>

            <select
              value={filters.isActive}
              onChange={(e) => applyFilters({ isActive: e.target.value })}
              className="select select-bordered select-sm"
            >
              <option value="">جميع الحالات</option>
              <option value="true">نشط</option>
              <option value="false">غير نشط</option>
            </select>

            <select
              value={filters.isPassLiveEx}
              onChange={(e) => applyFilters({ isPassLiveEx: e.target.value })}
              className="select select-bordered select-sm"
            >
              <option value=""> الامتحان الشفهى</option>
              <option value="true"> اجتازه الامتحان </option>
              <option value="false">لم يجتاز الامتحان</option>
            </select>

            {filters.search && (
              <button onClick={clearSearch} className="btn btn-ghost btn-sm">
                مسح البحث
              </button>
            )}
          </div>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stats bg-white shadow">
          <div className="stat">
            <div className="stat-figure text-primary">
              <Users size={32} />
            </div>
            <div className="stat-title">إجمالي المستخدمين</div>
            <div className="stat-value text-primary">{pagination.total}</div>
          </div>
        </div>

        <div className="stats bg-white shadow">
          <div className="stat">
            <div className="stat-figure text-secondary">
              <UserCheck size={32} />
            </div>
            <div className="stat-title">طلاب</div>
            <div className="stat-value text-secondary">
              {users.filter((u) => u.role === "student").length}
            </div>
          </div>
        </div>

        <div className="stats bg-white shadow">
          <div className="stat">
            <div className="stat-figure text-accent">
              <GraduationCap size={32} />
            </div>
            <div className="stat-title">معلمين</div>
            <div className="stat-value text-accent">
              {users.filter((u) => u.role === "teacher").length}
            </div>
          </div>
        </div>

        <div className="stats bg-white shadow">
          <div className="stat">
            <div className="stat-figure text-info">
              <Shield size={32} />
            </div>
            <div className="stat-title">مشرفين</div>
            <div className="stat-value text-info">
              {users.filter((u) => u.role === "admin").length}
            </div>
          </div>
        </div>
      </div>

      {/* جدول المستخدمين */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : error ? (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <Users size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-600">
            لا توجد مستخدمين
          </h3>
          <button
            className="btn btn-primary mt-4"
            onClick={() => setShowUserForm(true)}
          >
            إضافة مستخدم جديد
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>المستخدم</th>
                  <th>معلومات الاتصال</th>
                  <th>الدور</th>
                  <th>المستوى</th>
                  <th>نتيجة امتحان المستوى</th>
                  <th> الامتحان الشفهى</th>
                  <th>الحالة</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <UserRow
                    key={user._id}
                    user={user}
                    groups={groups}
                    exams={user.exams}
                    isExpanded={expandedUser === user._id}
                    onToggleExpand={setExpandedUser}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleStatus={handleToggleStatus}
                    onAddToGroup={handleAddToGroup}
                    onRemoveFromGroup={handleRemoveFromGroup}
                    onShowExamResults={handleShowExamResults}
                    getRoleBadge={getRoleBadge}
                    getLevelBadge={getLevelBadge}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* التقسيم إلى صفحات */}
          {pagination.pages > 1 && (
            <div className="flex justify-center p-4 border-t">
              <div className="join">
                <button
                  className="join-item btn"
                  disabled={pagination.currentPage === 1}
                  onClick={() =>
                    applyFilters({ page: pagination.currentPage - 1 })
                  }
                >
                  السابق
                </button>

                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      className={`join-item btn ${
                        pagination.currentPage === page ? "btn-active" : ""
                      }`}
                      onClick={() => applyFilters({ page })}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  className="join-item btn"
                  disabled={pagination.currentPage === pagination.pages}
                  onClick={() =>
                    applyFilters({ page: pagination.currentPage + 1 })
                  }
                >
                  التالي
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Exam Results Modal */}
      {showExamResults && (
        <ExamResultsModal
          user={showExamResults}
          onClose={handleCloseExamResults}
        />
      )}
    </div>
  );
};

// صف المستخدم مع التفاصيل القابلة للتوسيع
const UserRow = ({
  user,
  groups,
  exams,
  isExpanded,
  onToggleExpand,
  onEdit,
  onDelete,
  onToggleStatus,
  onAddToGroup,
  onRemoveFromGroup,
  onShowExamResults,
  getRoleBadge,
  getLevelBadge,
}) => {
  const roleInfo = getRoleBadge(user.role);
  const levelBadge = getLevelBadge(user.level);

  return (
    <>
      <tr
        className="hover:bg-gray-50 cursor-pointer"
        onClick={() => onToggleExpand(isExpanded ? null : user._id)}
      >
        <td>
          <div className="flex items-center space-x-3">
            <div className="">
              <div className="w-12 h-12 rounded-full bg-primary text-white font-bold flex items-center justify-center">
                <span> {user.name?.charAt(0) || "U"}</span>
              </div>
            </div>
            <div>
              <div className="font-bold">{user.name}</div>
              {user.age && (
                <div className="text-sm text-gray-500">العمر: {user.age}</div>
              )}
            </div>
          </div>
        </td>
        <td>
          <div className="text-sm">
            <div className="flex items-center gap-1">
              <Mail size={14} />
              <span>{user.email}</span>
            </div>
            {user.phone && (
              <div className="flex items-center gap-1 mt-1">
                <Phone size={14} />
                <span>{user.phone}</span>
              </div>
            )}
          </div>
        </td>
        <td>
          <span className={`badge ${roleInfo.color} badge-sm`}>
            {roleInfo.label}
          </span>
        </td>
        <td>
          {user.level && (
            <span className={`badge ${levelBadge} badge-sm`}>{user.level}</span>
          )}
        </td>
        <td>
          {user?.exams.map((exam) =>
            exam?.exam?.examType === user.role ? (
              <div className="text-center">
                <span className="font-medium">
                  {exam?.examResult}/{exam?.exam?.questions?.length}
                </span>
                <div className="text-xs text-gray-500">
                  {(
                    (Number(exam?.examResult) / exam?.exam?.questions?.length) *
                    100
                  ).toFixed(1)}
                  %{exam.title}
                </div>
              </div>
            ) : (
              <span>----</span>
            )
          )}
        </td>
        <td>
          <span
            className={`badge ${
              user.isPassLiveEx ? "badge-success" : "badge-error"
            } badge-sm`}
          >
            {user.isPassLiveEx ? "تم" : "غير متاح"}
          </span>
        </td>

        <td>
          <span
            className={`badge ${
              user.isActive ? "badge-success" : "badge-error"
            } badge-sm`}
          >
            {user.isActive ? "نشط" : "غير نشط"}
          </span>
        </td>
        <td>
          <div className="flex space-x-1">
            {user.exams && user.exams.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShowExamResults(user);
                }}
                className="btn btn-info btn-xs gap-1"
                title="عرض نتائج الامتحانات"
              >
                <BarChart3 size={12} />
                النتائج
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(user);
              }}
              className="btn btn-warning btn-xs gap-1"
            >
              <Edit3 size={12} />
              تعديل
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStatus(user._id);
              }}
              className={`btn btn-xs gap-1 ${
                user.isActive ? "btn-error" : "btn-success"
              }`}
            >
              {user.isActive ? <UserX size={12} /> : <UserCheck size={12} />}
            </button>
          </div>
        </td>
      </tr>

      {/* التفاصيل الموسعة */}
      {isExpanded && (
        <tr>
          <td colSpan="7" className="bg-gray-50 p-4">
            <UserExpandedDetails
              user={user}
              groups={groups}
              exams={exams}
              onAddToGroup={onAddToGroup}
              onRemoveFromGroup={onRemoveFromGroup}
              onEdit={onEdit}
              onDelete={onDelete}
              onShowExamResults={onShowExamResults}
            />
          </td>
        </tr>
      )}
    </>
  );
};

// التفاصيل الموسعة للمستخدم
const UserExpandedDetails = ({
  user,
  groups,
  exams,
  onAddToGroup,
  onRemoveFromGroup,
  onEdit,
  onDelete,
  onShowExamResults,
}) => {
  const [selectedGroup, setSelectedGroup] = useState("");

  const userGroups = groups.filter((group) =>
    group.students?.some((student) => student._id === user._id)
  );

  const availableGroups = groups.filter(
    (group) => !group.students?.some((student) => student._id === user._id)
  );

  const handleAddToGroup = () => {
    if (selectedGroup) {
      onAddToGroup(user._id, selectedGroup);
      setSelectedGroup("");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* المعلومات الأساسية */}
      <div>
        <h4 className="font-semibold mb-3">المعلومات الشخصية</h4>
        <div className="space-y-2 text-sm">
          <div>
            <strong>الاسم:</strong> {user.name}
          </div>
          <div>
            <strong>البريد:</strong> {user.email}
          </div>
          <div>
            <strong>الهاتف:</strong> {user.phone || "---"}
          </div>
          <div>
            <strong>العمر:</strong> {user.age || "---"}
          </div>
          <div>
            <strong>المدرسة:</strong> {user.schoolType || "---"}
          </div>
          <div>
            <strong>الصف:</strong> {user.grade || "---"}
          </div>
        </div>
      </div>

      {/* نتائج الامتحان */}
      <div>
        <h4 className="font-semibold mb-3">الامتحانات</h4>
        {exams && exams.length > 0 ? (
          <div className="space-y-3">
            <div className="text-sm">
              <strong>عدد الامتحانات:</strong> {exams.length}
            </div>
            <button
              onClick={() => onShowExamResults(user)}
              className="btn btn-info btn-sm gap-2"
            >
              <BarChart3 size={16} />
              عرض جميع النتائج
            </button>
          </div>
        ) : (
          <p className="text-gray-500">لم يتم أداء أي امتحانات بعد</p>
        )}
      </div>

      {/* إدارة المجموعات */}
      <div className="md:col-span-2">
        <h4 className="font-semibold mb-3">المجموعات</h4>
        <div className="space-y-3">
          {/* المجموعات الحالية */}
          {userGroups.length > 0 ? (
            <div>
              <h5 className="font-medium mb-2">المجموعات المنضم لها:</h5>
              <div className="flex flex-wrap gap-2">
                {userGroups.map((group) => (
                  <span
                    key={group._id}
                    className="badge badge-outline badge-lg"
                  >
                    {group.title}
                    <button
                      onClick={() => onRemoveFromGroup(user._id, group._id)}
                      className="mr-1 text-error hover:text-error-focus"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">لم ينضم لأي مجموعة بعد</p>
          )}

          {/* إضافة إلى مجموعة جديدة */}
          {availableGroups.length > 0 && (
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <label className="label">
                  <span className="label-text">إضافة إلى مجموعة جديدة</span>
                </label>
                <select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="select select-bordered w-full"
                >
                  <option value="">اختر مجموعة</option>
                  {availableGroups.map((group) => (
                    <option key={group._id} value={group._id}>
                      {group.title} - {group.level}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleAddToGroup}
                disabled={!selectedGroup}
                className="btn btn-primary btn-sm"
              >
                إضافة
              </button>
            </div>
          )}
        </div>
      </div>

      {/* أزرار الإجراءات */}
      <div className="md:col-span-2 flex justify-end space-x-2 pt-4 border-t">
        {exams && exams.length > 0 && (
          <button
            onClick={() => onShowExamResults(user)}
            className="btn btn-info btn-sm gap-2"
          >
            <BarChart3 size={16} />
            عرض نتائج الامتحانات
          </button>
        )}
        <button
          onClick={() => onEdit(user)}
          className="btn btn-warning btn-sm gap-2"
        >
          <Edit3 size={16} />
          تعديل البيانات
        </button>
        <button
          onClick={() => onDelete(user._id)}
          className="btn btn-error btn-sm gap-2"
        >
          <Trash2 size={16} />
          حذف المستخدم
        </button>
      </div>
    </div>
  );
};

// نموذج تعديل المستخدم
const UserEditForm = ({ user, onSave, onCancel, groups }) => {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    age: user?.age || "",
    level: user?.level || "مبتدئ",
    role: user?.role || "student",
    schoolType: user?.schoolType || "عام",
    grade: user?.grade || "",
    isActive: user?.isActive !== undefined ? user.isActive : true,
    isPassLiveEx: user?.isPassLiveEx !== undefined ? user.isPassLiveEx : false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-6 bg-base-100 rounded-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">تعديل بيانات المستخدم</h2>
        <button onClick={onCancel} className="btn btn-ghost btn-circle">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">الاسم الكامل</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input input-bordered"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">البريد الإلكتروني</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input input-bordered"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">رقم الهاتف</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="input input-bordered"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">العمر</span>
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="input input-bordered"
              min="3"
              max="100"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">المستوى</span>
            </label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="select select-bordered"
            >
              <option value="مبتدئ">مبتدئ</option>
              <option value="متوسط">متوسط</option>
              <option value="متقدم">متقدم</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">الدور</span>
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="select select-bordered"
            >
              <option value="student">طالب</option>
              <option value="teacher">معلم</option>
              <option value="admin">مشرف</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">نوع المدرسة</span>
            </label>
            <select
              name="schoolType"
              value={formData.schoolType}
              onChange={handleChange}
              className="select select-bordered"
            >
              <option value="عام">عام</option>
              <option value="ازهري">أزهري</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">الصف الدراسي</span>
            </label>
            <input
              type="text"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              className="input input-bordered"
              placeholder="مثال: الصف الأول الإعدادي"
            />
          </div>
        </div>

        <div className="form-control">
          <label className="cursor-pointer label justify-start">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="checkbox checkbox-primary ml-2"
            />
            <span className="label-text">الحساب نشط</span>
          </label>
        </div>

        <div className="form-control">
          <label className="cursor-pointer label justify-start">
            <input
              type="checkbox"
              name="isPassLiveEx"
              checked={formData.isPassLiveEx}
              onChange={handleChange}
              className="checkbox checkbox-primary ml-2"
            />
            <span className="label-text">الامتحان الشفهى</span>
          </label>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button type="button" onClick={onCancel} className="btn btn-outline">
            إلغاء
          </button>
          <button type="submit" className="btn btn-primary gap-2">
            <Save size={20} />
            حفظ التعديلات
          </button>
        </div>
      </form>
    </motion.div>
  );
};

// مكون عرض نتائج الامتحانات
const ExamResultsModal = ({ user, onClose }) => {
  if (!user || !user.exams) return null;

  const getExamTypeLabel = (examType) => {
    const types = {
      student: "امتحان الطالب",
      teacher: "امتحان المعلم",
      elder: "امتحان الكبار",
      lesson: "امتحان الدرس",
    };
    return types[examType] || examType;
  };

  const getPassStatus = (examResult, totalQuestions, passingScore) => {
    const score = Number(examResult);
    const percentage = (score / totalQuestions) * 100;
    const isPassed = score >= passingScore;

    return {
      isPassed,
      percentage: percentage.toFixed(1),
      badgeClass: isPassed ? "badge-success" : "badge-error",
      statusText: isPassed ? "ناجح" : "راسب",
    };
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">نتائج امتحانات {user.name}</h2>
            <p className="text-gray-600 mt-1">
              عرض جميع نتائج الامتحانات للمستخدم
            </p>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-circle">
            <X size={24} />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[60vh]">
          {user.exams.length === 0 ? (
            <div className="text-center py-8">
              <FileText size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-600">
                لا توجد نتائج امتحانات
              </h3>
              <p className="text-gray-500 mt-2">
                لم يقم المستخدم بأداء أي امتحانات بعد
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {user.exams.map(
                (examResult, index) =>(
                    <div
                      key={examResult._id || index}
                      className="bg-gray-50 rounded-lg p-4 border"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="font-semibold text-lg mb-2">
                            {examResult.exam?.title || "امتحان غير معروف"}
                          </h4>
                          <div className="space-y-1 text-sm">
                            <div>
                              <strong>نوع الامتحان:</strong>{" "}
                              <span className="badge badge-outline badge-sm">
                                {getExamTypeLabel(examResult.exam?.examType)}
                              </span>
                            </div>
                            <div>
                              <strong>عدد الأسئلة:</strong>{" "}
                              {examResult.exam?.questions?.length ||
                                "غير معروف"}
                            </div>
                            <div>
                              <strong>درجة النجاح:</strong>{" "}
                              {examResult.exam?.passingScore || "غير معروف"}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-center justify-center">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-primary mb-1">
                              {examResult.examResult}
                              <span className="text-lg text-gray-600">
                                /{examResult.exam?.questions?.length}
                              </span>
                            </div>
                            <div className="text-lg font-medium">
                              {examResult.exam?.questions?.length
                                ? (
                                    (Number(examResult.examResult) /
                                      examResult.exam.questions.length) *
                                    100
                                  ).toFixed(1)
                                : "0"}
                              %
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end justify-center space-y-2">
                          {examResult.exam?.questions?.length &&
                            examResult.exam?.passingScore && (
                              <>
                                <span
                                  className={`badge ${
                                    getPassStatus(
                                      examResult.examResult,
                                      examResult.exam.questions.length,
                                      examResult.exam.passingScore
                                    ).badgeClass
                                  } badge-lg`}
                                >
                                  {
                                    getPassStatus(
                                      examResult.examResult,
                                      examResult.exam.questions.length,
                                      examResult.exam.passingScore
                                    ).statusText
                                  }
                                </span>
                                <div className="text-sm text-gray-600">
                                  النجاح: {examResult.exam.passingScore}+
                                </div>
                              </>
                            )}
                        </div>
                      </div>

                      {/* Progress Bar */}
                      {examResult.exam?.questions?.length && (
                        <div className="mt-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>التقدم</span>
                            <span>
                              {examResult.examResult} /{" "}
                              {examResult.exam.questions.length}
                            </span>
                          </div>
                          <progress
                            className="progress progress-primary w-full"
                            value={examResult.examResult}
                            max={examResult.exam.questions.length}
                          ></progress>
                        </div>
                      )}
                    </div>
                  )
              )}
            </div>
          )}
        </div>

        <div className="modal-action">
          <button onClick={onClose} className="btn btn-primary">
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsersManagement;
