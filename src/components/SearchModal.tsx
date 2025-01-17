// src/components/SearchModal.tsx
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const modalVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -50 },
};

const SearchModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={modalVariants}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6"
      >
        <DialogHeader>
          <DialogTitle>Search Properties</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Location Filter */}
          <Input placeholder="Enter location" />

          {/* Property Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Property Type</label>
            <select className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
              <option>Apartment</option>
              <option>House</option>
              <option>Villa</option>
            </select>
          </div>

          {/* Price Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Price Range</label>
            <div className="flex space-x-2">
              <Input type="number" placeholder="Min" />
              <Input type="number" placeholder="Max" />
            </div>
          </div>

          {/* Apply Filters Button */}
          <Button onClick={onClose} className="w-full">
            Apply Filters
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SearchModal;
