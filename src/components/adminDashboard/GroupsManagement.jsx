import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  UserPlus,
  UserMinus,
} from "lucide-react";
import useGroupStore from "../../stores/useGroupStore";
import GroupForm from "./GroupForm";

const GroupsManagement = () => {
  const {
    groups,
    isLoading,
    error,
    filters,
    pagination,
    fetchGroups,
    deleteGroup,
    applyFilters,
    clearSearch,
  } = useGroupStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters({ search: searchTerm });
  };

  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من أنك تريد حذف هذه المجموعة؟")) {
      try {
        await deleteGroup(id);
      } catch (error) {
        console.error("Failed to delete group:", error);
      }
    }
  };

  const handleEdit = (group) => {
    setEditingGroup(group);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingGroup(null);
    setIsFormOpen(true);
  };

  if (isFormOpen) {
    return (
      <GroupForm
        groupData={editingGroup}
        onClose={() => {
          setIsFormOpen(false);
          setEditingGroup(null);
        }}
        onSave={() => {
          setIsFormOpen(false);
          setEditingGroup(null);
          fetchGroups();
        }}
      />
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* العنوان وأزرار التحكم */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            إدارة المجموعات
          </h1>
          <p className="text-gray-600 mt-1">
            إدارة مجموعات الطلاب في الأكاديمية
          </p>
        </div>

        <button className="btn btn-primary gap-2" onClick={handleCreate}>
          <Plus size={20} />
          مجموعة جديدة
        </button>
      </div>

      {/* أدوات البحث والتصفية */}
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* شريط البحث */}
          <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
            <Search
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="ابحث عن مجموعة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered w-full pl-4 pr-10"
            />
          </form>

          {/* أزرار التصفية */}
          <div className="flex flex-wrap gap-2">
            <select
              value={filters.level}
              onChange={(e) => applyFilters({ level: e.target.value })}
              className="select select-bordered select-sm"
            >
              <option value="">جميع المستويات</option>
              <option value="تاسيس">تأسيس</option>
              <option value="حفظ">حفظ</option>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stats bg-white shadow">
          <div className="stat">
            <div className="stat-figure text-primary">
              <Users size={32} />
            </div>
            <div className="stat-title">إجمالي المجموعات</div>
            <div className="stat-value text-primary">{pagination.total}</div>
          </div>
        </div>

        <div className="stats bg-white shadow">
          <div className="stat">
            <div className="stat-figure text-secondary">
              <Users size={32} />
            </div>
            <div className="stat-title">مجموعات التأسيس</div>
            <div className="stat-value text-secondary">
              {groups.filter((g) => g.level === "تاسيس").length}
            </div>
          </div>
        </div>

        <div className="stats bg-white shadow">
          <div className="stat">
            <div className="stat-figure text-accent">
              <Users size={32} />
            </div>
            <div className="stat-title">مجموعات الحفظ</div>
            <div className="stat-value text-accent">
              {groups.filter((g) => g.level === "حفظ").length}
            </div>
          </div>
        </div>
      </div>

      {/* نتائج البحث */}
      {filters.search && (
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            عرض {groups.length} نتيجة بحث عن "{filters.search}"
          </p>
        </div>
      )}

      {/* عرض المجموعات */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : error ? (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      ) : groups.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <Users size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-600">لا توجد مجموعات</h3>
          <p className="text-gray-500 mt-1">
            {filters.search
              ? "لم يتم العثور على مجموعات تطابق بحثك"
              : "ابدأ بإنشاء مجموعات جديدة"}
          </p>
          <button className="btn btn-primary mt-4" onClick={handleCreate}>
            إنشاء مجموعة جديدة
          </button>
        </div>
      ) : (
        <>
          {/* شبكة المجموعات */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <GroupCard
                key={group._id}
                group={group}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* التقسيم إلى صفحات */}
          {pagination.pages > 1 && (
            <div className="flex justify-center mt-8">
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
        </>
      )}
    </div>
  );
};

// بطاقة المجموعة
const GroupCard = ({ group, onEdit, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100"
    >
      <div className="p-5">
        {/* العنوان والمستوى */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900">{group.title}</h3>
          <span
            className={`badge ${
              group.level === "تاسيس" ? "badge-primary" : "badge-secondary"
            } badge-sm`}
          >
            {group.level}
          </span>
        </div>

        {/* الوصف */}
        <p className="text-gray-600 mb-4 line-clamp-2">{group.description}</p>

        {/* المعلومات الإضافية */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm text-gray-600">
            <span>عدد الطلاب:</span>
            <span className="font-medium">{group.students?.length || 0}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>مدرس المجموعة:</span>
            <span className="font-medium">{group.insturctor?.name || "غير متوفر"}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>تاريخ الإنشاء:</span>
            <span className="font-medium">
              {new Date(group.createdAt).toLocaleDateString("ar-SA")}
            </span>
          </div>
        </div>

        {/* أزرار الإجراءات */}
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(group)}
            className="btn btn-warning btn-sm flex-1 gap-2"
          >
            <Edit3 size={16} />
            تعديل
          </button>

          <button
            onClick={() => onDelete(group._id)}
            className="btn btn-error btn-sm flex-1 gap-2"
          >
            <Trash2 size={16} />
            حذف
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default GroupsManagement;
