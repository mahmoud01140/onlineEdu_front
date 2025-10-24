import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import photo1 from "../assets/images/gallery1.jpg"
import photo10 from "../assets/images/gallery10.jpg"
import photo9 from "../assets/images/gallery9.jpg"
import photo8 from "../assets/images/gallery8.jpg"
import photo7 from "../assets/images/gallery7.jpg"
import photo11 from "../assets/images/gallery11.jpg"
const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Sample images - replace with your actual images
  const images = [
    {
      id: 1,
      src: photo1,
      alt: "طلاب يدرسون القرآن معاً",
      category: "فصول دراسية"
    },
    {
      id: 2,
      src: photo7,
      alt: "جلسة حفظ جماعية",
      category: "أنشطة"
    },
    {
      id: 3,
      src: photo8,
      alt: "مناقشة علمية",
      category: "ندوات"
    },
    {
      id: 4,
      src: photo11,
      alt: "شهادات تقدير",
      category: "مرافق"
    },
    {
      id: 5,
      src: photo9,
      alt: "حفل تخرج",
      category: "فعاليات"
    },
    {
      id: 6,
      src: photo10,
      alt: "طالبات في محاضرة",
      category: "فصول دراسية"
    }
  ];

  const openLightbox = (image, index) => {
    setSelectedImage(image);
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const goToPrevious = () => {
    setLightboxIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setLightboxIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <section dir="rtl" className="py-16 px-4 sm:px-6 lg:px-8 border-t-2">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center text-base-content mb-4"
        >
          معرض الصور
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-lg text-center mb-12 max-w-3xl mx-auto"
        >
          استكشف لحظات من الحياة في أكاديمية أبو يوسف عبر معرض الصور الخاص بنا
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="overflow-hidden rounded-xl shadow-lg bg-white group cursor-pointer"
              onClick={() => openLightbox(image, index)}
            >
              <div className="relative overflow-hidden">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-end">
                  <div className="p-4 text-white transform translate-y-5 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="font-bold">{image.alt}</p>
                    <span className="text-sm bg-green-500 inline-block px-2 py-1 rounded-full mt-2">
                      {image.category}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
              onClick={closeLightbox}
            >
              <div className="relative max-w-4xl w-full max-h-full">
                <button
                  onClick={closeLightbox}
                  className="absolute -top-12 left-0 text-white hover:text-green-400 z-10"
                >
                  <X className="h-8 w-8" />
                </button>
                
                <button
                  onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-green-400 z-10 bg-black bg-opacity-50 rounded-full p-2"
                >
                  <ChevronRight className="h-8 w-8" />
                </button>
                
                <button
                  onClick={(e) => { e.stopPropagation(); goToNext(); }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-green-400 z-10 bg-black bg-opacity-50 rounded-full p-2"
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>
                
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-lg overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={images[lightboxIndex].src}
                    alt={images[lightboxIndex].alt}
                    className="w-full h-auto max-h-[70vh] object-contain"
                  />
                  <div className="p-4 text-center">
                    <p className="text-xl font-bold text-gray-900">{images[lightboxIndex].alt}</p>
                    <p className="text-green-600">{images[lightboxIndex].category}</p>
                    <p className="text-gray-600 mt-2">{lightboxIndex + 1} / {images.length}</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Gallery;