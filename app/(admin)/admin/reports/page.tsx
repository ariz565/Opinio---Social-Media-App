'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, AlertTriangle } from 'lucide-react';

const reports = [
  {
    id: '1',
    type: 'Guidelines violation',
    content: 'Inappropriate comments on user profile',
    reporter: 'Demo Test',
    reported: 'User123',
    status: 'Open',
    priority: 'High',
    timestamp: '2024-03-15 14:30',
  },
  {
    id: '2',
    type: 'Spam',
    content: 'Multiple promotional posts',
    reporter: 'Sarah Smith',
    reported: 'SpamBot42',
    status: 'Resolved',
    priority: 'Medium',
    timestamp: '2024-03-15 12:15',
  },
];

export default function ReportsPage() {
  const [search, setSearch] = useState('');

  return (
    <main className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
        <div className="flex space-x-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reports</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="investigating">Investigating</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
          <Button>Export</Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reports..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>Reporter</TableHead>
              <TableHead>Reported User</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    {report.type}
                  </div>
                </TableCell>
                <TableCell>{report.content}</TableCell>
                <TableCell>{report.reporter}</TableCell>
                <TableCell>{report.reported}</TableCell>
                <TableCell>
                  <Badge
                    variant={report.status === 'Open' ? 'destructive' : 'secondary'}
                  >
                    {report.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      report.priority === 'High'
                        ? 'destructive'
                        : report.priority === 'Medium'
                        ? 'default'
                        : 'secondary'
                    }
                  >
                    {report.priority}
                  </Badge>
                </TableCell>
                <TableCell>{report.timestamp}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}