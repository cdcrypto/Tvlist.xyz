import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Minimize2 } from 'lucide-react';
import Image from 'next/image';

interface FakeSupportChatProps {
  isDarkMode: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const FakeSupportChat: React.FC<FakeSupportChatProps> = ({ isDarkMode, isOpen, onClose }) => {
  const [message, setMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentAgent, setCurrentAgent] = useState({ name: '', image: '/images/ellison.png' });

  const funnyMessages = [
    "Hodling your request... can i suck you in the meantime?! 🚀",
    "Mining your data... No rugs were made in the process.",
    "Encrypting your download with FTX level security.",
    "Forking me daddy, your download is preparing.",
    "Consulting with Sam, please be patient'.",
    "Frontrunning your orders.. please stand by!",
    "Sending your request through a series of complex trading strategies",
    "While i prepare your order, would you like to have an orgy?.",
    "Applying advanced quant trading methods to your order",
    "Checking if your request can be fullfilled... dont panic."
  ];

  const agents = [
    { name: 'Agent Ellison', image: '/images/ellison.png' },
    { name: 'Agent Matty', image: '/images/matty.png' },
    { name: 'Agent Sam', image: '/images/sam.png' },
  ];

  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        const randomAgent = agents[Math.floor(Math.random() * agents.length)];
        const randomMessage = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
        setMessage(randomMessage);
        setCurrentAgent(randomAgent);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const bgColor = isDarkMode ? 'bg-ftx-dark-blue-light' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-ftx-dark-blue';
  const borderColor = isDarkMode ? 'border-ftx-teal' : 'border-ftx-light-gray';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className={`fixed bottom-4 right-4 z-50 ${isMinimized ? 'w-20 h-20' : 'w-[400px] h-[600px]'}`}
        >
          {isMinimized ? (
            <button
              onClick={() => setIsMinimized(false)}
              className={`w-full h-full rounded-full ${bgColor} ${borderColor} border shadow-lg flex items-center justify-center`}
            >
              <MessageCircle size={36} className={textColor} />
            </button>
          ) : (
            <div className={`${bgColor} ${textColor} ${borderColor} border rounded-lg shadow-lg overflow-hidden flex flex-col h-full`}>
              <div className="flex justify-between items-center p-4 bg-ftx-teal text-white">
                <h3 className="text-xl font-bold">Customer Support</h3>
                <div className="flex items-center space-x-2">
                  <button onClick={() => setIsMinimized(true)} className="focus:outline-none hover:bg-opacity-20 hover:bg-black rounded-full p-1 transition-colors duration-200">
                    <Minimize2 size={20} />
                  </button>
                  <button onClick={onClose} className="focus:outline-none hover:bg-opacity-20 hover:bg-black rounded-full p-1 transition-colors duration-200">
                    <X size={20} />
                  </button>
                </div>
              </div>
              <div className="p-4 flex flex-col items-center flex-grow overflow-y-auto">
                <div className="mb-4 flex-shrink-0">
                  <Image
                    src={currentAgent.image}
                    alt="Customer Support Agent"
                    width={250}
                    height={250}
                    className="rounded-full"
                  />
                </div>
                <div className="text-center">
                  <p className="text-xl font-semibold mb-2">{currentAgent.name}</p>
                  <p className="text-lg">{message}</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FakeSupportChat;