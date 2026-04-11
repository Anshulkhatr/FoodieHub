import React from 'react';
import { CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import Button from './Button';

const DeliveryPrompt = ({ onConfirm, onCancel, aiMessage }) => {
  return (
    <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-start gap-4">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <Sparkles size={24} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-text-primary mb-1">AI Delivery Check</h3>
          <p className="text-sm text-text-muted mb-4 italic">
            "{aiMessage || "It's been 16 minutes since you ordered! Has your meal arrived yet?"}"
          </p>
          <div className="flex gap-3">
            <Button 
              onClick={onConfirm} 
              className="px-4 py-2 text-xs flex items-center gap-2"
            >
              <CheckCircle2 size={14} /> Yes, Delivered
            </Button>
            <Button 
              variant="secondary" 
              onClick={onCancel} 
              className="px-4 py-2 text-xs flex items-center gap-2"
            >
              <XCircle size={14} /> Not yet
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryPrompt;
