'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Globe, Users, Lock } from 'lucide-react';

interface PostPrivacySelectProps {
  value: string;
  onChange: (value: 'public' | 'connections' | 'private') => void;
}

export function PostPrivacySelect({ value, onChange }: PostPrivacySelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="public">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span>Anyone</span>
          </div>
        </SelectItem>
        <SelectItem value="connections">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Connections only</span>
          </div>
        </SelectItem>
        <SelectItem value="private">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span>Only me</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}