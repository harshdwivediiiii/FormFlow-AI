'use client';

import { motion } from 'framer-motion';
import { AtomIcon, Edit, Share2, Sparkles, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { TypeAnimation } from 'react-type-animation';
import { useUser  } from '@clerk/nextjs'; // Import useUser  hook
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import { useEffect, useState } from 'react'; // Import useEffect and useState

const Hero = () => {
  const { isSignedIn } = useUser (); // Get the user's sign-in status
  const [isMounted, setIsMounted] = useState(false); // State to check if component is mounted
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    setIsMounted(true); // Set isMounted to true when component is mounted
  }, []);

  if (!isMounted) {
    return null; // Render nothing if component is not mounted
  }

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const handleButtonClick = (path) => {
    if (isSignedIn) {
      router.push(path);
    } else {
      router.push('/sign-in');
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1707343843437-caacff5cfa74?q=80&w=2940')] bg-cover bg-center opacity-5 dark:opacity-10" />
      
      {/* Hero Content */}
      <div className="relative mx-auto max-w-screen-xl px-4 pt-20 lg:pt-32">
        <motion.div 
          initial="initial"
          animate="animate"
          variants={stagger}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.div 
            variants={fadeIn}
            className="inline-flex items-center rounded-full bg-gray-300 px-4 py-1 text-gray-800 mb-8 dark:bg-gray-700 dark:text-gray-300"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">AI-Powered Form Builder</span>
          </motion.div>

          <motion.h1 
            variants={fadeIn}
            className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl dark:text-gray-100"
          >
            Create Forms for
            <span className="relative whitespace-nowrap text-black block mt-2 dark:text-white">
              <svg
                aria-hidden="true"
                viewBox="0 0 418 42"
                className="absolute left-0 top-2/3 h-[0.58em] w-full fill-gray-300 dark:fill-gray-600"
                preserveAspectRatio="none"
              >
                <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
              </svg>
              <TypeAnimation
                sequence={[
                  'Customer Feedback',
                  2000,
                  'Job Applications',
                  2000,
                  'Event Registration',
                  2000,
                  'Market Research',
                  2000,
                  'Lead Generation',
                  2000,
                ]}
                wrapper="span"
                speed={50}
                className="relative"
                repeat={Infinity}
              />
            </span>
          </motion.h1>

          <motion.p 
            variants={fadeIn}
            className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300"
          >
            Transform your ideas into professional forms instantly. Our AI understands your needs and creates the perfect form in seconds, not hours.
          </motion.p>

          <motion.div 
            variants={fadeIn}
            className="mt-10 flex items-center justify-center gap-x-6"
          >
            <button
              onClick={() => handleButtonClick('/dashboard')} // Change to your desired path
              className="group relative inline-flex items-center gap-x-2 rounded-full bg-gray-800 px-8 py-4 text-white hover:bg-gray-700 transition dark:bg-gray-600 dark:hover:bg-gray-500"
            >
              Create Your Form
              <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => handleButtonClick('/learn-more')} // Change to your desired path
              className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-800 transition dark:text-gray-100 dark:hover:text-gray-400"
            >
              Learn more <span aria-hidden="true">→</span>
            </button>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-20"
        >
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-gray-600 to-gray-800 opacity-25 blur transition group-hover:opacity-75 dark:opacity-50" />
              <div className="relative rounded-lg bg-white p-8 shadow-xl dark:bg-gray-900">
                <AtomIcon className="h-10 w-10 text-gray-800 dark:text-gray-400" />
                <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-gray-100">AI-Powered Creation</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  Describe your form in plain English, and watch as AI creates the perfect structure instantly.
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-gray-600 to-gray-800 opacity-25 blur transition group-hover:opacity-75 dark:opacity-50" />
              <div className="relative rounded-lg bg-white p-8 shadow-xl dark:bg-gray-900">
                <Edit className="h-10 w-10 text-gray-800 dark:text-gray-400" />
                <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-gray-100">Smart Customization</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  Fine-tune your form with our intuitive editor. Add, remove, or modify fields effortlessly.
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-gray-600 to-gray-800 opacity-25 blur transition group-hover:opacity-75 dark:opacity-50" />
              <div className="relative rounded-lg bg-white p-8 shadow-xl dark:bg-gray-900">
                <Share2 className="h-10 w-10 text-gray-800 dark:text-gray-400" />
                <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-gray-100">Instant Sharing</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  Share your form with a single click and start collecting responses immediately.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Social Proof */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-20 text-center"
        >
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Trusted by innovative teams worldwide</p>
          <div className="mt-6 flex justify-center gap-x-8 grayscale opacity-50">
            <Image height={32} width={158} className="h-8" src="https://tailwindui.com/img/logos/tuple-logo-gray-900.svg" alt="Company name" />
            <Image height={32} width={158} className="h-8" src="https://tailwindui.com/img/logos/reform-logo-gray-900.svg" alt="Company name" />
            <Image height={32} width={158} className="h-8" src="https://tailwindui.com/img/logos/savvycal-logo-gray-900.svg" alt="Company name" />
          </div>
        </motion.div>
      </div>
      
    </section>
  );
};

export default Hero;