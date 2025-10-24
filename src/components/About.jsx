import { motion } from "framer-motion";
import { Quote, BookOpen, Users, Award, CheckCircle } from "lucide-react";
import PersonImage from "../assets/images/person.jpg"
const About = () => {
  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section dir="rtl" className="py-16 px-4 sm:px-6 lg:px-8 border-t-2 " id= "about">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl p-6 shadow-lg">
              <div className="bg-white rounded-xl overflow-hidden shadow-md">
                <img
                  src={PersonImage}
                  alt="الشيخ المحاضر"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 bg-green-500 text-white p-3 rounded-lg shadow-lg">
              <BookOpen className="h-6 w-6" />
            </div>
            
            <div className="absolute -bottom-4 -right-4 bg-blue-500 text-white p-3 rounded-lg shadow-lg">
              <Users className="h-6 w-6" />
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6 text-right"
          >
            <motion.h2 
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold text-blue-300"
            >
              عن الشيخ المحاضر
            </motion.h2>
            
            <motion.p 
              variants={itemVariants}
              className="text-lg leading-relaxed"
            >
              يُشرف على التدريس في أكاديمية ابو يوسف  Online فضيلة الشيخ ابوزيد جمال، وهو أحد المشايخ المتخصصين في تعليم القرآن الكريم وعلومه، والحاصل على إجازات معتبرة في القراءات والتجويد من مشايخ موثوقين.
            </motion.p>
            
            <motion.p 
              variants={itemVariants}
              className="text-lg leading-relaxed"
            >
              يمتاز الشيخ بخبرة طويلة في تحفيظ القرآن الكريم وتعليم التجويد، حيث قام بتدريس طلاب من مختلف الأعمار (رجال – نساء – أطفال)، كما جمع بين المنهجية التقليدية الأصيلة والوسائل التعليمية الحديثة عبر التعليم عن بعد، مما ساعد على تيسير الحفظ والفهم ومتابعة الطلاب بشكل فردي.
            </motion.p>
            
            <motion.div
              variants={itemVariants}
              className="bg-blue-50 p-6 rounded-xl border-r-4 border-blue-500"
            >
              <div className="flex items-start">
                <Quote className="h-8 w-8 text-blue-600 ml-3 flex-shrink-0" />
                <p className="text-lg italic text-gray-800">
                  وقد تخرّج على يديه – بفضل الله – عدد كبير من الحفاظ والحافظات، إضافةً إلى طلاب تمكنوا من تحسين تلاوتهم وضبط أحكام التجويد.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              variants={itemVariants}
              className="pt-4"
            >
              <h3 className="text-xl font-semibold text-green-600 mb-4">رسالتُه هي:</h3>
              <div className="bg-green-50 p-5 rounded-xl">
                <p className="text-lg text-gray-800 font-medium">
                  "تربية جيل قرآني متين العقيدة، سليم التلاوة، متأصل في فهم معاني كلام الله، مستخدمًا أحدث أساليب التعليم والتقنية لتيسير الوصول لكل طالب."
                </p>
              </div>
            </motion.div>
            
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 gap-4 pt-6"
            >
              <div className="flex items-center justify-end">
                <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
                <span className="">إجازات معتمدة</span>
              </div>
              <div className="flex items-center justify-end">
                <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
                <span className="">خبرة طويلة</span>
              </div>
              <div className="flex items-center justify-end">
                <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
                <span className="">منهجية متطورة</span>
              </div>
              <div className="flex items-center justify-end">
                <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
                <span className="">نتائج ملموسة</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;