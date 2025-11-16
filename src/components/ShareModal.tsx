import React from 'react';
import { Button } from './ui/button';
import { X, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, productName }) => {
  const [copied, setCopied] = useState(false);
  const currentUrl = window.location.href;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = currentUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#121212]/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#181818] border border-[#1c1c1c] rounded-2xl p-6 w-full max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#f0f0f0] flex items-center">
            <span className="mr-2">🔗</span>
            Поделиться товаром
          </h2>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-[#a0a0a0] hover:text-[#f0f0f0] hover:bg-[#1c1c1c]"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Product Info */}
        <div className="bg-[#1c1c1c] rounded-xl p-4 mb-6 border border-[#1c1c1c]">
          <h3 className="text-lg font-semibold text-[#f0f0f0] mb-2">{productName}</h3>
          <p className="text-[#a0a0a0] text-sm">Скопируйте ссылку и отправьте друзьям</p>
        </div>

        {/* URL Display */}
        <div className="bg-[#1c1c1c] rounded-xl p-4 mb-6 border border-[#1c1c1c]">
          <p className="text-[#a0a0a0] text-sm mb-2">Ссылка на товар:</p>
          <div className="bg-[#121212] rounded-lg p-3 border border-[#1c1c1c]">
            <p className="text-[#FFD700] text-sm break-all font-mono">{currentUrl}</p>
          </div>
        </div>

        {/* Copy Button */}
        <Button
          onClick={handleCopy}
          className="w-full bg-[#FFD700] hover:bg-[#FFC107] text-[#121212] hover-lift font-bold py-3 rounded-xl transition-all duration-300 hover:scale-105"
        >
          {copied ? (
            <>
              <Check className="w-5 h-5 mr-2" />
              Скопировано!
            </>
          ) : (
            <>
              <Copy className="w-5 h-5 mr-2" />
              Скопировать ссылку
            </>
          )}
        </Button>

        {/* Additional Info */}
        <div className="mt-4 text-center">
          <p className="text-gray-400 text-xs">
            Поделитесь этим товаром с друзьями!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
