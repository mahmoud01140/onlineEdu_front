import React, { useState, useEffect, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useExamStore from '../stores/useExamStore';
import {
  Play,
  CheckCircle,
  Clock,
  BookOpen,
  Award,
  ChevronRight,
  ChevronLeft,
  Calendar,
  User,
  BarChart3,
  Lock,
  Unlock,
  Video,
  ExternalLink,
  Copy,
  AlertCircle,
  Users,
  Target,
  Clock as ClockIcon
} from 'lucide-react';
import useStudyStore from '../stores/useStudyStore';
import ExamView from '../components/ExamViewer';
const StudyPage = () => {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { fetchUserLessons, isLoading, lessons } = useStudyStore();
  
  useEffect(() => {
    fetchUserLessons();
  }, [fetchUserLessons]);

  // تحديث الوقت الحالي كل دقيقة
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // دالة للحصول على معلومات المجموعة من الدروس
  const getGroupInfo = () => {
    if (!lessons || lessons.length === 0) return null;
    // العثور على أول درس يحتوي على معلومات المجموعة
    const lessonWithGroup = lessons.find(lesson => lesson.group);
    return lessonWithGroup?.group || null;
  };

  const group = getGroupInfo();

  // دالة لعرض جدول المجموعة
  const formatSchedule = (group) => {
    if (!group?.schedule) return 'غير محدد';
    
    const { days, time, duration } = group.schedule;
    if (!days || days.length === 0 || !time) return 'غير محدد';
    
    return `${days.join('، ')} - الساعة ${time} (${duration} دقيقة)`;
  };

  // دالة للتحقق إذا كان موعد الدرس قد حان
  const isLessonTime = (lesson) => {
    if (!lesson.date) return false;
    
    const lessonDateTime = new Date(lesson.date);
    const now = currentTime;
    
    const fifteenMinutesBefore = new Date(lessonDateTime.getTime() - 15 * 60000);
    const twoHoursAfter = new Date(lessonDateTime.getTime() + 120 * 60000);
    
    return now >= fifteenMinutesBefore && now <= twoHoursAfter;
  };

  // دالة للتحقق إذا كان الدرس قريباً
  const isLessonUpcoming = (lesson) => {
    if (!lesson.date) return false;
    
    const lessonDateTime = new Date(lesson.date);
    const now = currentTime;
    const twentyFourHoursBefore = new Date(lessonDateTime.getTime() - 24 * 60 * 60000);
    
    return now >= twentyFourHoursBefore && now < lessonDateTime;
  };

  // دالة للتحقق إذا كان الدرس قد انتهى
  const isLessonPast = (lesson) => {
    if (!lesson.date) return false;
    const lessonDateTime = new Date(lesson.date);
    const now = currentTime;
    const twoHoursAfter = new Date(lessonDateTime.getTime() + 120 * 60000);
    
    return now > twoHoursAfter;
  };

  // تصنيف الدروس بناءً على الوقت
  const currentLessons = lessons?.filter(lesson => isLessonTime(lesson)) || [];
  const upcomingLessons = lessons?.filter(lesson => isLessonUpcoming(lesson) && !isLessonTime(lesson)) || [];
  const pastLessons = lessons?.filter(lesson => isLessonPast(lesson)) || [];
  const futureLessons = lessons?.filter(lesson => {
    if (!lesson.date) return false;
    const lessonDateTime = new Date(lesson.date);
    const twentyFourHoursBefore = new Date(lessonDateTime.getTime() - 24 * 60 * 60000);
    return currentTime < twentyFourHoursBefore;
  }) || [];

  const toggleLessonCompletion = (lessonId) => {
    if (completedLessons?.includes(lessonId)) {
      setCompletedLessons(completedLessons.filter(id => id !== lessonId));
    } else {
      setCompletedLessons([...completedLessons, lessonId]);
    }
  };

  const isLessonCompleted = (lessonId) => completedLessons.includes(lessonId);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  // دالة لتهيئة الوقت لعرضه
  const formatLessonTime = (lesson) => {
    if (!lesson.date) return 'غير محدد';
    
    const lessonDate = new Date(lesson.date);
    return lessonDate.toLocaleString('ar-SA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // دالة للحصول على الوقت فقط
  const getLessonTime = (lesson) => {
    if (!lesson.date) return 'غير محدد';
    const lessonDate = new Date(lesson.date);
    return lessonDate.toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // دالة للحصول على التاريخ فقط
  const getLessonDate = (lesson) => {
    if (!lesson.date) return 'غير محدد';
    const lessonDate = new Date(lesson.date);
    return lessonDate.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* العنوان الرئيسي مع معلومات المجموعة */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {group?.title || 'منصة الدراسة'}
          </h1>
          <p className="text-gray-600">
            {group ? `مجموعة ${group.level} - ${group.title}` : 'تابع تقدمك في دورة تجويد القرآن الكريم'}
          </p>
          
          {/* معلومات المجموعة */}
          {group && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <div className="flex items-center justify-center">
                  <Target className="h-4 w-4 ml-1 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">المستوى:</span>
                </div>
                <p className="text-gray-900 font-medium mt-1">{group.level}</p>
              </div>
              
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <div className="flex items-center justify-center">
                  <Users className="h-4 w-4 ml-1 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">الطلاب:</span>
                </div>
                <p className="text-gray-900 font-medium mt-1">
                  {group?.students?.length}/{group?.maxStudents}
                </p>
              </div>
              
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <div className="flex items-center justify-center">
                  <ClockIcon className="h-4 w-4 ml-1 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">الجدول:</span>
                </div>
                <p className="text-gray-900 font-medium mt-1 text-sm">
                  {formatSchedule(group)}
                </p>
              </div>
            </div>
          )}
          
          <p className="text-sm text-gray-500 mt-2">
            التوقيت الحالي: {currentTime.toLocaleString('ar-SA', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </motion.div>

        {/* إشعارات الدروس الجاهزة */}
        <AnimatePresence>
          {currentLessons.map(lesson => (
            <motion.div
              key={lesson._id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded-lg mb-6 flex items-center"
            >
              <Video className="h-5 w-5 ml-2" />
              <div className="flex-1">
                <p className="font-medium">درس {lesson.title} جاهز الآن على Zoom</p>
                <p className="text-sm">انضم إلى الجلسة الآن</p>
              </div>
              {lesson.zoomLink && (
                <a
                  href={lesson.zoomLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-success ml-2"
                >
                  انضم الآن
                </a>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* العمود الأيسر: الدروس المكتملة */}
          <div className="lg:col-span-1">
            <PreviousLessons 
              lessons={pastLessons} 
              onSelectLesson={setSelectedLesson}
              isCompleted={isLessonCompleted}
              isLessonTime={isLessonTime}
              formatLessonTime={formatLessonTime}
            />
          </div>

          {/* العمود الأوسط: الدروس الحالية */}
          <div className="lg:col-span-1">
            <CurrentLessons 
              lessons={currentLessons}
              onToggleCompletion={toggleLessonCompletion}
              isCompleted={isLessonCompleted}
              isLessonTime={isLessonTime}
              isLessonUpcoming={isLessonUpcoming}
              currentTime={currentTime}
              copyToClipboard={copyToClipboard}
              formatLessonTime={formatLessonTime}
              getLessonTime={getLessonTime}
              getLessonDate={getLessonDate}
            />
          </div>

          {/* العمود الأيمن: الدروس القادمة */}
          <div className="lg:col-span-1">
            <UpcomingLessons 
              lessons={upcomingLessons}
              futureLessons={futureLessons}
              onSelectLesson={setSelectedLesson}
              isLessonTime={isLessonTime}
              isLessonUpcoming={isLessonUpcoming}
              formatLessonTime={formatLessonTime}
            />
          </div>
        </div>

        {/* جدول جميع الدروس */}
        <div className="mt-8">
          <AllLessonsTable 
            lessons={lessons} 
            onSelectLesson={setSelectedLesson}
            isCompleted={isLessonCompleted}
            isLessonTime={isLessonTime}
            isLessonUpcoming={isLessonUpcoming}
            isLessonPast={isLessonPast}
            currentTime={currentTime}
            formatLessonTime={formatLessonTime}
            getLessonTime={getLessonTime}
          />
        </div>

        {/* تفاصيل الدرس المحدد */}
        <AnimatePresence>
          {selectedLesson && (
            <LessonDetail 
              lesson={selectedLesson} 
              onClose={() => setSelectedLesson(null)}
              isCompleted={isLessonCompleted(selectedLesson._id)}
              onToggleCompletion={toggleLessonCompletion}
              isLessonTime={isLessonTime}
              isLessonUpcoming={isLessonUpcoming}
              currentTime={currentTime}
              copyToClipboard={copyToClipboard}
              formatLessonTime={formatLessonTime}
              getLessonTime={getLessonTime}
              getLessonDate={getLessonDate}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// مكون الدروس السابقة (يظل كما هو)
const PreviousLessons = ({ lessons, onSelectLesson, isCompleted, isLessonTime, formatLessonTime }) => {
  if (lessons?.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl shadow-sm p-6 text-center"
      >
        <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-600">لا توجد دروس منتهية بعد</h3>
        <p className="text-gray-500 mt-1">سيظهر هنا الدروس المنتهية</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-xl shadow-sm p-6"
    >
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
        <CheckCircle className="h-5 w-5 ml-2 text-green-500" />
        الدروس المنتهية
      </h2>
      
      <div className="space-y-3">
        {lessons?.slice(0, 5).map((lesson) => (
          <motion.div
            key={lesson._id}
            whileHover={{ x: 5 }}
            className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors relative"
            onClick={() => onSelectLesson(lesson)}
          >
            {isLessonTime(lesson) && (
              <span className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                <Video className="h-3 w-3" />
              </span>
            )}
            <div className="flex items-center">
              <div className="bg-green-100 p-2 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div className="mr-3">
                <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                <p className="text-sm text-gray-500">{formatLessonTime(lesson)}</p>
              </div>
            </div>
            <span className="badge badge-sm badge-outline">منتهي</span>
          </motion.div>
        ))}
      </div>

      {lessons?.length > 5 && (
        <button className="btn btn-ghost btn-sm w-full mt-4">
          عرض جميع الدروس المنتهية ({lessons?.length})
        </button>
      )}
    </motion.div>
  );
};

// مكون الدروس الحالية (يظل كما هو)
const CurrentLessons = ({ lessons, onToggleCompletion, isCompleted, isLessonTime, isLessonUpcoming, currentTime, copyToClipboard, formatLessonTime, getLessonTime, getLessonDate }) => {
  if (lessons?.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm p-6 text-center"
      >
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen className="h-8 w-8 text-white" />
        </div>
        <span className="badge badge-primary mb-2">لا توجد دروس حالية</span>
        <h2 className="text-xl font-bold text-gray-900 mt-2">لا توجد دروس حالية</h2>
        <p className="text-gray-600">تحقق من الدروس القادمة</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {lessons.map((lesson, index) => (
        <motion.div
          key={lesson._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <span className="badge badge-primary mb-2">درس حالى</span>
            <h2 className="text-xl font-bold text-gray-900 mt-2">{lesson.title}</h2>
            <p className="text-gray-600">انضم إلى الجلسة الآن</p>
          </div>

          {/* معلومات موعد الدرس */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 ml-2 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">موعد الدرس</span>
              </div>
              <span className="badge badge-success badge-sm">مباشر الآن</span>
            </div>
            <p className="text-gray-800 font-medium">
              {getLessonDate(lesson)}
            </p>
            <p className="text-gray-600">الساعة: {getLessonTime(lesson)}</p>
          </div>

          {/* رابط Zoom */}
          {lesson.zoomLink && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center mb-3">
                <Video className="h-5 w-5 ml-2 text-blue-600" />
                <h3 className="text-lg font-medium text-blue-800">انضم إلى جلسة Zoom</h3>
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-blue-700">رابط الجلسة:</span>
                  <button 
                    onClick={() => copyToClipboard(lesson.zoomLink)}
                    className="btn btn-xs btn-ghost"
                  >
                    <Copy className="h-3 w-3 ml-1" />
                    نسخ
                  </button>
                </div>
                <a 
                  href={lesson.zoomLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm break-all hover:underline flex items-center"
                >
                  {lesson.zoomLink}
                  <ExternalLink className="h-3 w-3 mr-1" />
                </a>
              </div>
              
              {lesson.zoomPassword && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-blue-700">كلمة المرور:</span>
                    <button 
                      onClick={() => copyToClipboard(lesson.zoomPassword)}
                      className="btn btn-xs btn-ghost"
                    >
                      <Copy className="h-3 w-3 ml-1" />
                      نسخ
                    </button>
                  </div>
                  <p className="text-blue-800 font-medium">{lesson.zoomPassword}</p>
                </div>
              )}
              
              <a
                href={lesson.zoomLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-success w-full mt-3 gap-2"
              >
                <Video className="h-4 w-4" />
                انضم إلى الجلسة
              </a>
            </div>
          )}

          {/* أزرار الإجراء */}
          <div className="space-y-3">
            {lesson.zoomLink ? (
              <a
                href={lesson.zoomLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary w-full gap-2"
              >
                <Video className="h-4 w-4" />
                انضم إلى الجلسة
              </a>
            ) : (
              <button className="btn btn-primary w-full gap-2">
                <Play className="h-4 w-4" />
                بدء الدراسة
              </button>
            )}
            
            <button
              onClick={() => onToggleCompletion(lesson._id)}
              className={`btn w-full gap-2 ${isCompleted(lesson._id) ? 'btn-success' : 'btn-outline'}`}
            >
              <CheckCircle className="h-4 w-4" />
              {isCompleted(lesson._id) ? 'تم الإكمال' : 'تمم الدرس'}
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// مكون الدروس القادمة (يظل كما هو)
const UpcomingLessons = ({ lessons, futureLessons, onSelectLesson, isLessonTime, isLessonUpcoming, formatLessonTime }) => {
  const allUpcomingLessons = [...lessons, ...futureLessons];

  if (allUpcomingLessons.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm p-6 text-center"
      >
        <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-600">لا توجد دروس قادمة</h3>
        <p className="text-gray-500 mt-1">سيظهر هنا الدروس القادمة</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-xl shadow-sm p-6"
    >
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
        <ChevronRight className="h-5 w-5 ml-2 text-blue-500" />
        الدروس القادمة
      </h2>
      
      <div className="space-y-3">
        {allUpcomingLessons.slice(0, 10).map((lesson) => (
          <motion.div
            key={lesson._id}
            whileHover={{ x: 5 }}
            className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors relative"
            onClick={() => onSelectLesson(lesson)}
          >
            {isLessonTime(lesson) && (
              <span className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                <Video className="h-3 w-3" />
              </span>
            )}
            {isLessonUpcoming(lesson) && (
              <span className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full p-1">
                <Clock className="h-3 w-3" />
              </span>
            )}
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-lg">
                <BookOpen className="h-4 w-4 text-blue-600" />
              </div>
              <div className="mr-3">
                <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                <p className="text-sm text-gray-500">{formatLessonTime(lesson)}</p>
              </div>
            </div>
            <span className="badge badge-sm badge-outline">
              {isLessonUpcoming(lesson) ? 'قريباً' : 'مستقبلي'}
            </span>
          </motion.div>
        ))}
      </div>

      {allUpcomingLessons.length > 10 && (
        <button className="btn btn-ghost btn-sm w-full mt-4">
          عرض جميع الدروس القادمة ({allUpcomingLessons.length})
        </button>
      )}
    </motion.div>
  );
};

// جدول جميع الدروس (يظل كما هو)
const AllLessonsTable = ({ lessons, onSelectLesson, isCompleted, isLessonTime, isLessonUpcoming, isLessonPast, currentTime, formatLessonTime, getLessonTime }) => {
  if (!lessons || lessons.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl shadow-sm p-6 text-center"
      >
        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-600">لا توجد دروس متاحة</h3>
        <p className="text-gray-500 mt-1">سيظهر هنا الدروس عند إضافتها</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-white rounded-xl shadow-sm overflow-hidden"
    >
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-gray-900">جميع الدروس</h2>
        <p className="text-gray-600">نظرة عامة على خطة الدراسة الكاملة</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>الحالة</th>
              <th>اسم الدرس</th>
              <th>الموعد</th>
              <th>الوقت</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {lessons?.map((lesson) => {
              return (
                <motion.tr
                  key={lesson._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: lesson.id * 0.1 }}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => onSelectLesson(lesson)}
                >
                  <td>
                    {isCompleted(lesson._id) ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : isLessonTime(lesson) ? (
                      <Video className="h-5 w-5 text-green-500" />
                    ) : isLessonUpcoming(lesson) ? (
                      <Clock className="h-5 w-5 text-yellow-500" />
                    ) : isLessonPast(lesson) ? (
                      <CheckCircle className="h-5 w-5 text-gray-400" />
                    ) : (
                      <BookOpen className="h-5 w-5 text-blue-500" />
                    )}
                  </td>
                  <td>
                    <div className="font-medium">{lesson.title}</div>
                    <div className="text-sm text-gray-500">{lesson.description?.substring(0, 50)}...</div>
                  </td>
                  <td>
                    {lesson.date ? (
                      <div className="text-sm">
                        {new Date(lesson.date).toLocaleDateString('ar-SA')}
                      </div>
                    ) : (
                      <span className="text-gray-400">غير محدد</span>
                    )}
                  </td>
                  <td>
                    {lesson.date ? (
                      <div className="text-sm">
                        {getLessonTime(lesson)}
                      </div>
                    ) : (
                      <span className="text-gray-400">غير محدد</span>
                    )}
                  </td>
                  <td>
                    {isLessonTime(lesson) && lesson.zoomLink ? (
                      <a
                        href={lesson.zoomLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-success"
                      >
                        انضم الآن
                      </a>
                    ) : (
                      <button className="btn btn-sm btn-outline">
                        {isLessonPast(lesson) ? 'عرض' : 'عرض التفاصيل'}
                      </button>
                    )}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};


// تفاصيل الدرس (محدث لعرض الموارد والامتحان)
const LessonDetail = ({ lesson, onClose, isCompleted, onToggleCompletion, isLessonTime, isLessonUpcoming, currentTime, copyToClipboard, formatLessonTime, getLessonTime, getLessonDate }) => {
  const { lessonExams, fetchLessonExams } = useExamStore();
   // Add exam store functions
     const [showExam, setShowExam] = useState(null);
     console.log(showExam)
  useEffect(() => {
    fetchLessonExams(lesson._id);
  }, [lesson._id]);
  //
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* رأس النافذة */}
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">{lesson.title}</h2>
          <button onClick={onClose} className="btn btn-ghost btn-circle">
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>

        {/* محتوى النافذة */}
        {showExam ? (
          <ExamView examData={showExam} onClose={() => setShowExam(null)} />
        ) : (

        <div className="p-6">
          {/* معلومات الموعد والحالة */}
          {lesson.date && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 ml-2 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">موعد الدرس</span>
                </div>
                {isLessonUpcoming(lesson) && (
                  <span className="badge badge-warning badge-sm">قريباً</span>
                )}
                {isLessonTime(lesson) && (
                  <span className="badge badge-success badge-sm">مباشر الآن</span>
                )}
                {!isLessonTime(lesson) && !isLessonUpcoming(lesson) && (
                  <span className="badge badge-gray badge-sm">منتهي</span>
                )}
              </div>
              <p className="text-gray-800 font-medium">
                {getLessonDate(lesson)}
              </p>
              <p className="text-gray-600">الساعة: {getLessonTime(lesson)}</p>
            </div>
          )}

          {/* رابط Zoom إذا كان وقت الدرس */}
          {isLessonTime(lesson) && lesson.zoomLink && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center mb-3">
                <Video className="h-5 w-5 ml-2 text-blue-600" />
                <h3 className="text-lg font-medium text-blue-800">انضم إلى جلسة Zoom</h3>
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-blue-700">رابط الجلسة:</span>
                  <button 
                    onClick={() => copyToClipboard(lesson.zoomLink)}
                    className="btn btn-xs btn-ghost"
                  >
                    <Copy className="h-3 w-3 ml-1" />
                    نسخ
                  </button>
                </div>
                <a 
                  href={lesson.zoomLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm break-all hover:underline flex items-center"
                >
                  {lesson.zoomLink}
                  <ExternalLink className="h-3 w-3 mr-1" />
                </a>
              </div>
              
              {lesson.zoomPassword && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-blue-700">كلمة المرور:</span>
                    <button 
                      onClick={() => copyToClipboard(lesson.zoomPassword)}
                      className="btn btn-xs btn-ghost"
                    >
                      <Copy className="h-3 w-3 ml-1" />
                      نسخ
                    </button>
                  </div>
                  <p className="text-blue-800 font-medium">{lesson.zoomPassword}</p>
                </div>
              )}
              
              <a
                href={lesson.zoomLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-success w-full mt-3 gap-2"
              >
                <Video className="h-4 w-4" />
                انضم إلى الجلسة
              </a>
            </div>
          )}

          {/* وصف الدرس */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-2">وصف الدرس</h3>
            <p className="text-gray-700">
              {lesson.description || "هذا الدرس يغطي أهم قواعد التجويد في القرآن الكريم."}
            </p>
          </div>

          {/* الموارد التعليمية */}
          {lesson.resources && lesson.resources.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                <BookOpen className="h-5 w-5 ml-2 text-green-600" />
                الموارد التعليمية
              </h3>
              <div className="space-y-3">
                {lesson.resources.map((resource, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-green-200 rounded-lg bg-green-50">
                    <div className="flex items-center flex-1">
                      <div className="bg-green-100 p-2 rounded-lg mr-3">
                        <span className="text-green-700 font-medium">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <span className="font-medium text-gray-900 block">
                          {resource.title || `المورد ${index + 1}`}
                        </span>
                        {resource.description && (
                          <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                        )}
                        {resource.type && (
                          <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full mt-1 inline-block">
                            {resource.type}
                          </span>
                        )}
                      </div>
                    </div>
                    {resource.url && (
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-success gap-2"
                      >
                        <ExternalLink className="h-3 w-3" />
                        فتح
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* الامتحان */}
          {lessonExams.map((exam) => (
            <div key={exam._id} className="mb-6" onClick={() => setShowExam(exam)}>
              <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                <Award className="h-5 w-5 ml-2 text-yellow-600" />
                الامتحان
              </h3>
              <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                <p className="text-yellow-700 font-medium">
                  {exam?.title || "امتحان"}
                </p>

                <div className="flex justify-between items-center mt-3">
                  <span className="text-sm text-yellow-700">
                    {exam?.questions.length} سؤال
                  </span>
                  <span className="text-sm text-yellow-700">
                    {exam?.passingScore} درجة مطلوبة
                  </span>
                </div>
              </div>
            </div>
          ))}


          {/* أزرار الإجراء */}
          <div className="flex space-x-3">
            {isLessonTime(lesson) && lesson.zoomLink ? (
              <a
                href={lesson.zoomLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary flex-1 gap-2"
              >
                <Video className="h-4 w-4" />
                انضم إلى الجلسة
              </a>
            ) : (
              <button className="btn btn-primary flex-1 gap-2">
                <Play className="h-4 w-4" />
                عرض التفاصيل
              </button>
            )}
            <button
              onClick={() => onToggleCompletion(lesson._id)}
              className={`btn flex-1 gap-2 ${isCompleted ? 'btn-success' : 'btn-outline'}`}
            >
              <CheckCircle className="h-4 w-4" />
              {isCompleted ? 'تم الإكمال' : 'تمم الدرس'}
            </button>
          </div>
        </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default StudyPage;