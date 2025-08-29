// import { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Button } from '@/components/ui/button';
// import { useAuth } from '@/context/AuthContext';
// import { useTheme } from '@/hooks/useTheme';

// const SunIcon = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <circle cx="12" cy="12" r="5" />
//     <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
//   </svg>
// );

// const MoonIcon = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
//   </svg>
// );

// const MenuIcon = () => (
//   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <line x1="4" x2="20" y1="12" y2="12" />
//     <line x1="4" x2="20" y1="6" y2="6" />
//     <line x1="4" x2="20" y1="18" y2="18" />
//   </svg>
// );

// const XIcon = () => (
//   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M18 6 6 18" />
//     <path d="m6 6 12 12" />
//   </svg>
// );

// export default function Header() {
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const { resolvedTheme, toggleTheme } = useTheme();
//   const { isAuthenticated, } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 10);
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   const handleAuthAction = () => {
//     if (isAuthenticated) {
//       navigate('/dashboard');
//     } else {
//       navigate('/login');
//     }
//     setIsMobileMenuOpen(false);
//   };

//   return (
//     <motion.header
//       initial={{ y: -100 }}
//       animate={{ y: 0 }}
//       transition={{ duration: 0.6 }}
//       className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
//         ? 'bg-background/95 backdrop-blur-md shadow-medium border-b border-border/50'
//         : 'bg-transparent'
//         }`}
//     >
//       <div className="container mx-auto px-4 lg:px-6">
//         <div className="flex items-center justify-between h-16 lg:h-20">
//           {/* Logo */}
//           <motion.div
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             <Link
//               to="/"
//               className="flex items-center space-x-2 font-bold text-xl text-foreground hover:text-primary transition-colors"
//             >
//               <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
//                 <span className="text-white font-bold text-sm">GS</span>
//               </div>
//               <span className="hidden sm:block">SuveyMappingTool</span>
//             </Link>
//           </motion.div>

//           {/* Desktop Actions */}
//           <div className="hidden md:flex items-center space-x-4">
//             <motion.div
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//             >
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={toggleTheme}
//                 aria-label="Toggle theme"
//                 className="w-9 h-9 rounded-lg"
//               >
//                 <AnimatePresence mode="wait" initial={false}>
//                   <motion.div
//                     key={resolvedTheme}
//                     initial={{ y: -20, opacity: 0 }}
//                     animate={{ y: 0, opacity: 1 }}
//                     exit={{ y: 20, opacity: 0 }}
//                     transition={{ duration: 0.2 }}
//                   >
//                     {resolvedTheme === 'light' ? <MoonIcon /> : <SunIcon />}
//                   </motion.div>
//                 </AnimatePresence>
//               </Button>
//             </motion.div>

//             {!isAuthenticated ? (
//               <>
//                 <motion.div
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   <Button
//                     variant="outline"
//                     onClick={() => navigate('/login')}
//                     className="font-medium"
//                   >
//                     Login
//                   </Button>
//                 </motion.div>
//                 <motion.div
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   <Button
//                     onClick={() => navigate('/signup')}
//                     className="gradient-primary text-white font-medium hover:shadow-glow transition-all duration-300"
//                   >
//                     Sign Up Free
//                   </Button>
//                 </motion.div>
//               </>
//             ) : (
//               <motion.div
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <Button
//                   onClick={() => navigate('/dashboard')}
//                   className="gradient-primary text-white font-medium hover:shadow-glow transition-all duration-300"
//                 >
//                   Dashboard
//                 </Button>
//               </motion.div>
//             )}
//           </div>

//           {/* Mobile Menu Button */}
//           <div className="flex md:hidden items-center space-x-2">
//             <motion.div
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//             >
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={toggleTheme}
//                 aria-label="Toggle theme"
//                 className="w-9 h-9 rounded-lg"
//               >
//                 <AnimatePresence mode="wait" initial={false}>
//                   <motion.div
//                     key={resolvedTheme}
//                     initial={{ rotate: -180, opacity: 0 }}
//                     animate={{ rotate: 0, opacity: 1 }}
//                     exit={{ rotate: 180, opacity: 0 }}
//                     transition={{ duration: 0.2 }}
//                   >
//                     {resolvedTheme === 'light' ? <MoonIcon /> : <SunIcon />}
//                   </motion.div>
//                 </AnimatePresence>
//               </Button>
//             </motion.div>
//             <motion.div
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//             >
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//                 aria-label="Toggle menu"
//                 className="w-9 h-9 rounded-lg"
//               >
//                 <AnimatePresence mode="wait" initial={false}>
//                   <motion.div
//                     key={isMobileMenuOpen ? 'close' : 'menu'}
//                     initial={{ rotate: -180, opacity: 0 }}
//                     animate={{ rotate: 0, opacity: 1 }}
//                     exit={{ rotate: 180, opacity: 0 }}
//                     transition={{ duration: 0.2 }}
//                   >
//                     {isMobileMenuOpen ? <XIcon /> : <MenuIcon />}
//                   </motion.div>
//                 </AnimatePresence>
//               </Button>
//             </motion.div>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         <AnimatePresence>
//           {isMobileMenuOpen && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: 'auto' }}
//               exit={{ opacity: 0, height: 0 }}
//               transition={{ duration: 0.3 }}
//               className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-md overflow-hidden"
//             >
//               <nav className="py-4 space-y-4">
//                 <div className="flex flex-col space-y-2 px-4 pt-4 border-t border-border/50">
//                   {!isAuthenticated ? (
//                     <>
//                       <motion.div
//                         initial={{ x: -20, opacity: 0 }}
//                         animate={{ x: 0, opacity: 1 }}
//                         transition={{ delay: 0.3 }}
//                       >
//                         <Button
//                           variant="outline"
//                           onClick={() => {
//                             navigate('/login');
//                             setIsMobileMenuOpen(false);
//                           }}
//                           className="font-medium w-full"
//                         >
//                           Login
//                         </Button>
//                       </motion.div>
//                       <motion.div
//                         initial={{ x: -20, opacity: 0 }}
//                         animate={{ x: 0, opacity: 1 }}
//                         transition={{ delay: 0.35 }}
//                       >
//                         <Button
//                           onClick={() => {
//                             navigate('/signup');
//                             setIsMobileMenuOpen(false);
//                           }}
//                           className="gradient-primary text-white font-medium w-full"
//                         >
//                           Sign Up Free
//                         </Button>
//                       </motion.div>
//                     </>
//                   ) : (
//                     <motion.div
//                       initial={{ x: -20, opacity: 0 }}
//                       animate={{ x: 0, opacity: 1 }}
//                       transition={{ delay: 0.3 }}
//                     >
//                       <Button
//                         onClick={handleAuthAction}
//                         className="gradient-primary text-white font-medium w-full"
//                       >
//                         Dashboard
//                       </Button>
//                     </motion.div>
//                   )}
//                 </div>
//               </nav>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </motion.header>
//   );
// }