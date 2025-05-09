'use client';

import { motion } from 'framer-motion';

const FooterNav = () => {
  const navItems = [
    { label: 'Export to CSV', action: () => console.log('Export clicked') },
    { label: 'Support', action: () => console.log('Support clicked') },
    { label: 'Documentation', action: () => console.log('Documentation clicked') },
    { label: 'Settings', action: () => console.log('Settings clicked') },
  ];

  return (
    <motion.nav 
      className="w-full h-full bg-white/80 backdrop-blur-sm border-t border-black/5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 3 }}
    >
      <div className="h-full container mx-auto px-20">
        <div className="h-full flex items-center justify-between">
          <div className="flex items-center gap-12">
            {navItems.map((item) => (
              <motion.button 
                key={item.label}
                onClick={item.action}
                className="text-black/70 hover:text-black transition-colors text-sm font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
              </motion.button>
            ))}
          </div>
          
          <div className="flex items-center gap-8">
            <motion.button
              className="text-black/70 hover:text-black transition-colors text-sm font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => console.log('Contact clicked')}
            >
              Admin
            </motion.button>
            <motion.button
              className="px-6 py-2 bg-black text-white rounded-full text-sm font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => console.log('Log Out clicked')}
            >
              Log Out
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default FooterNav; 