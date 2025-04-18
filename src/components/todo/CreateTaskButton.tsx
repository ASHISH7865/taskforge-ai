import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import AICreateTask from './AICreateTask';

interface CreateTaskButtonProps {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showIcon?: boolean;
}

const CreateTaskButton: React.FC<CreateTaskButtonProps> = ({
  variant = 'default',
  size = 'sm',
  className = '',
  showIcon = true
}) => {
  const [showDialog, setShowDialog] = useState(false);

  const openDialog = () => setShowDialog(true);
  const closeDialog = () => setShowDialog(false);

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={openDialog}
        className={className}
      >
        {showIcon && <Sparkles />}
        Create Smart Task
      </Button>

      <AICreateTask
        open={showDialog}
        onClose={closeDialog}
      />
    </>
  );
};

export default CreateTaskButton;
