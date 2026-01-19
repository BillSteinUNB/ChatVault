import React, { useState } from 'react';
import { Shield, Copy, Download, RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from './ui/Button';

interface BackupCodesProps {
  codes: string[];
  onRegenerate?: () => void;
  className?: string;
}

export const BackupCodes: React.FC<BackupCodesProps> = ({
  codes,
  onRegenerate,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleCopyAllCodes = () => {
    const text = codes.join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCodes = () => {
    const text = `ChatVault Backup Codes\nGenerated: ${new Date().toISOString()}\n\n${codes.join('\n')}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chatvault-backup-codes-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleRegenerate = async () => {
    if (!onRegenerate) return;

    setIsRegenerating(true);
    try {
      await onRegenerate();
    } finally {
      setIsRegenerating(false);
    }
  };

  if (codes.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <Shield className="text-neutral-500 mx-auto mb-3" size={40} />
        <p className="text-neutral-400">No backup codes available</p>
        {onRegenerate && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="mt-4"
          >
            {isRegenerating ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw size={16} />
                Generate Codes
              </>
            )}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Backup Codes</h3>
          <p className="text-sm text-neutral-400">
            Save these codes in a safe place. Use them to access your account if you lose your authenticator device.
          </p>
        </div>
        {onRegenerate && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRegenerate}
            disabled={isRegenerating}
            title="Generate new codes (this will invalidate your old codes)"
          >
            {isRegenerating ? (
              <RefreshCw size={16} className="animate-spin" />
            ) : (
              <RefreshCw size={16} />
            )}
          </Button>
        )}
      </div>

      {/* Warning */}
      <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-2">
        <AlertTriangle size={16} className="text-yellow-500 flex-shrink-0 mt-0.5" />
        <p className="text-yellow-400 text-sm">
          <strong>Important:</strong> Store these codes securely. Each code can only be used once. Keep them somewhere safe and private.
        </p>
      </div>

      {/* Codes Grid */}
      <div className="bg-neutral-800 border border-white/10 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
          {codes.map((code, index) => (
            <code
              key={index}
              className="text-sm font-mono text-neutral-300 bg-neutral-900 px-3 py-2 rounded text-center select-all"
            >
              {code}
            </code>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          variant="secondary"
          onClick={handleCopyAllCodes}
          className="flex-1"
        >
          {copied ? (
            <>
              <Copy size={16} />
              Copied!
            </>
          ) : (
            <>
              <Copy size={16} />
              Copy All
            </>
          )}
        </Button>
        <Button
          variant="secondary"
          onClick={handleDownloadCodes}
          className="flex-1"
        >
          <Download size={16} />
          Download
        </Button>
      </div>
    </div>
  );
};
