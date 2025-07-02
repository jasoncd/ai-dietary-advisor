import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Reply, Send } from "lucide-react";

interface ReplyFormProps {
  commentAuthorName: string;
  onSubmit: (content: string, authorName: string) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const ReplyForm = React.memo(({ commentAuthorName, onSubmit, onCancel, isSubmitting }: ReplyFormProps) => {
  const [replyContent, setReplyContent] = useState("");
  const [replyAuthorName, setReplyAuthorName] = useState("");

  const handleSubmit = () => {
    if (replyContent.trim() && replyAuthorName.trim()) {
      onSubmit(replyContent.trim(), replyAuthorName.trim());
      setReplyContent("");
      setReplyAuthorName("");
    }
  };

  const handleCancel = () => {
    setReplyContent("");
    setReplyAuthorName("");
    onCancel();
  };

  return (
    <Card className="mt-4 border-2 border-blue-200 bg-blue-50/50">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-sm text-blue-600">
            <Reply className="h-4 w-4" />
            <span>Replying to {commentAuthorName}</span>
          </div>
          
          <Input
            placeholder="Your name"
            value={replyAuthorName}
            onChange={(e) => setReplyAuthorName(e.target.value)}
            className="max-w-xs bg-white"
            autoComplete="off"
          />
          
          <Textarea
            placeholder="Write your reply..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            rows={2}
            className="bg-white"
            autoComplete="off"
          />
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !replyContent.trim() || !replyAuthorName.trim()}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Posting...' : 'Save Reply'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

ReplyForm.displayName = "ReplyForm";