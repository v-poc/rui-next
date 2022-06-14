import { useState } from 'react';
import {
  Code as IconCode,
  Copy as IconCopy,
  Check as IconCheck,
} from '../Icons';
import { copyToClipboard } from '../../utils';
import './style.css';

export interface DemoProps {
  code: string;
  codeHtml: string;
  meta?: Record<string, any>;
  language?: string;
  children?: React.ReactNode;
}

export const Demo: React.FC<DemoProps> = ({ code, codeHtml, children }) => {
  const [showCode, setShowCode] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleActionBarClick = (ev: React.SyntheticEvent) => {
    if (ev.target !== ev.currentTarget) {
      return;
    }
    setShowCode(prev => !prev);
  };

  const handleCopy = async () => {
    if (copySuccess) {
      return;
    }

    await copyToClipboard(code);

    setCopySuccess(true);
    setTimeout(() => {
      setCopySuccess(false);
    }, 1000);
  };

  return (
    <div className="my-5 border border-c-border-1 rounded-md divide-y divide-c-border-1 overflow-hidden">
      <div className="px-5 py-4">{children}</div>
      <div
        className="flex items-center px-2 h-8 cursor-pointer"
        onClick={handleActionBarClick}
      >
        <button
          className={`btn-text h-full px-3 ${showCode ? 'text-c-brand' : ''}`}
          onClick={() => setShowCode(prev => !prev)}
        >
          <IconCode />
        </button>
        <button
          className={`btn-text h-full px-3 ${
            copySuccess ? 'text-c-brand' : ''
          }`}
          onClick={handleCopy}
        >
          {copySuccess ? <IconCheck /> : <IconCopy />}
        </button>
      </div>
      {showCode && (
        <div
          className="py-demo-code-wrapper"
          dangerouslySetInnerHTML={{ __html: codeHtml }}
        ></div>
      )}
    </div>
  );
};
