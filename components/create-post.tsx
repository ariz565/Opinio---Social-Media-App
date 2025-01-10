// 'use client';

// import { useState } from 'react';
// import { Button } from './ui/button';
// import { Card, CardContent, CardFooter } from './ui/card';
// import { Textarea } from './ui/textarea';
// import { ImagePlus, Loader2 } from 'lucide-react';
// import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

// export function CreatePost() {
//   const [content, setContent] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async () => {
//     setIsLoading(true);
//     // TODO: Implement post creation
//     setTimeout(() => setIsLoading(false), 1000);
//   };

//   return (
//     <Card className="border-0 border-b rounded-none">
//       <CardContent className="pt-6">
//         <div className="flex gap-4">
//           <Avatar>
//             <AvatarImage src="https://github.com/shadcn.png" />
//             <AvatarFallback>CN</AvatarFallback>
//           </Avatar>
//           <Textarea
//             placeholder="What's on your mind?"
//             value={content}
//             onChange={(e) => setContent(e.target.value)}
//             className="resize-none"
//             maxLength={500}
//           />
//         </div>
//       </CardContent>
//       <CardFooter className="flex justify-between">
//         <Button variant="ghost" size="icon">
//           <ImagePlus className="h-5 w-5" />
//         </Button>
//         <div className="flex items-center gap-4">
//           <span className="text-sm text-muted-foreground">
//             {content.length}/500
//           </span>
//           <Button onClick={handleSubmit} disabled={isLoading}>
//             {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//             Post
//           </Button>
//         </div>
//       </CardFooter>
//     </Card>
//   );
// }