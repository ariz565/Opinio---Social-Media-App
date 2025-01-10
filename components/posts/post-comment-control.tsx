'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { MessageSquare, Users } from 'lucide-react';

interface PostCommentControlProps {
  value: string;
  onChange: (value: 'everyone' | 'connections') => void;
}

export function PostCommentControl({ value, onChange }: PostCommentControlProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="everyone">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>Everyone can comment</span>
          </div>
        </SelectItem>
        <SelectItem value="connections">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Connections only</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}