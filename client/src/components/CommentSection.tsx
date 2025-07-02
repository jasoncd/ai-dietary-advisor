import { useState, useCallback } from "react";
import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ReplyForm } from "./ReplyForm";
import { 
  MessageCircle, 
  Reply, 
  Send, 
  User as UserIcon,
  Calendar
} from "lucide-react";

interface Comment {
  id: number;
  healthProfileId: number;
  parentCommentId?: number;
  authorName: string;
  content: string;
  createdAt: string;
}

interface CommentSectionProps {
  healthProfileId: number;
}

export function CommentSection({ healthProfileId }: CommentSectionProps) {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [replyToComment, setReplyToComment] = useState<number | null>(null);
  const [newComment, setNewComment] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [replyAuthorName, setReplyAuthorName] = useState("");
  const [expandedReplies, setExpandedReplies] = useState<Set<number>>(new Set());
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch comments for this health profile
  const { data: comments = [], isLoading } = useQuery({
    queryKey: [`/api/health-profiles/${healthProfileId}/comments`],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/health-profiles/${healthProfileId}/comments`);
      return response.json();
    },
  });

  // Fetch replies for a specific comment
  const fetchReplies = (commentId: number) => {
    return useQuery({
      queryKey: [`/api/comments/${commentId}/replies`],
      queryFn: async () => {
        const response = await apiRequest("GET", `/api/comments/${commentId}/replies`);
        return response.json();
      },
      enabled: true, // Always fetch replies to show reply count
      staleTime: 30000, // Cache for 30 seconds
      refetchOnWindowFocus: false, // Prevent unnecessary refetches
    });
  };

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: async (commentData: { content: string; authorName: string; parentCommentId?: number }) => {
      const response = await apiRequest("POST", `/api/health-profiles/${healthProfileId}/comments`, {
        ...commentData,
        parentCommentId: commentData.parentCommentId || undefined
      });
      return response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/health-profiles/${healthProfileId}/comments`] });
      if (variables.parentCommentId) {
        queryClient.invalidateQueries({ queryKey: [`/api/comments/${variables.parentCommentId}/replies`] });
        // Auto-expand the parent comment to show new reply
        setExpandedReplies(prev => new Set(Array.from(prev).concat([variables.parentCommentId!])));
      }
      setNewComment("");
      setAuthorName("");
      setReplyContent("");
      setReplyAuthorName("");
      setShowCommentForm(false);
      setReplyToComment(null);
      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmitComment = useCallback(() => {
    if (!newComment.trim() || !authorName.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in both your name and comment.",
        variant: "destructive",
      });
      return;
    }

    addCommentMutation.mutate({
      content: newComment.trim(),
      authorName: authorName.trim(),
      parentCommentId: replyToComment || undefined
    });
  }, [newComment, authorName, replyToComment, addCommentMutation, toast]);

  const handleSubmitReply = useCallback((parentCommentId: number) => {
    if (!replyContent.trim() || !replyAuthorName.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in both your name and reply.",
        variant: "destructive",
      });
      return;
    }

    addCommentMutation.mutate({
      content: replyContent.trim(),
      authorName: replyAuthorName.trim(),
      parentCommentId: parentCommentId
    });
  }, [replyContent, replyAuthorName, addCommentMutation, toast]);

  const cancelReply = useCallback(() => {
    setReplyToComment(null);
    setReplyContent("");
    setReplyAuthorName("");
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return 'Recently';
    }
  };

  const toggleReplies = useCallback((commentId: number) => {
    setExpandedReplies(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(commentId)) {
        newExpanded.delete(commentId);
      } else {
        newExpanded.add(commentId);
      }
      return newExpanded;
    });
  }, []);

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => {
    const repliesQuery = fetchReplies(comment.id);
    const replies = repliesQuery.data || [];
    const hasReplies = replies.length > 0;
    const showReplies = expandedReplies.has(comment.id);
    const isReplyingToThis = replyToComment === comment.id;
    
    // Always show reply count, but only show replies when expanded
    const shouldShowRepliesSection = showReplies && hasReplies;

    return (
      <Card className={`${isReply ? 'ml-4 bg-gray-50' : 'bg-white'} border-l-4 border-l-secondary`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="bg-secondary/10 p-2 rounded-full">
                <UserIcon className="h-4 w-4 text-secondary" />
              </div>
              <div>
                <span className="font-semibold text-gray-900">{comment.authorName}</span>
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(comment.createdAt)}
                </div>
              </div>
            </div>
            {!isReply && (
              <Badge variant="outline" className="text-xs">
                Comment #{comment.id}
              </Badge>
            )}
          </div>
          
          <p className="text-gray-800 mb-3 leading-relaxed">{comment.content}</p>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setReplyToComment(comment.id);
                setShowCommentForm(false);
              }}
              className="text-secondary hover:text-secondary/80"
            >
              <Reply className="h-4 w-4 mr-1" />
              Reply
            </Button>
            
            {hasReplies && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleReplies(comment.id)}
                className="text-blue-600 hover:text-blue-700"
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                {expandedReplies.has(comment.id) ? 'Hide' : 'Show'} {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
              </Button>
            )}
          </div>

          {/* Reply Form */}
          {isReplyingToThis && (
            <ReplyForm
              commentAuthorName={comment.authorName}
              onSubmit={(content, authorName) => {
                addCommentMutation.mutate({
                  content,
                  authorName,
                  parentCommentId: comment.id
                });
              }}
              onCancel={cancelReply}
              isSubmitting={addCommentMutation.isPending}
            />
          )}

          {/* Replies */}
          {!isReply && shouldShowRepliesSection && (
            <div className="mt-4 space-y-3">
              {replies.map((reply: Comment) => (
                <CommentItem key={reply.id} comment={reply} isReply={true} />
              ))}
            </div>
          )}
          
          {/* Nested Replies for Reply Comments */}
          {isReply && shouldShowRepliesSection && (
            <div className="mt-3 ml-4 space-y-3 border-l-2 border-gray-200 pl-4">
              {replies.map((reply: Comment) => (
                <CommentItem key={reply.id} comment={reply} isReply={true} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-secondary mr-2"></div>
        <span className="text-gray-600">Loading comments...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <MessageCircle className="h-5 w-5 mr-2 text-secondary" />
          Community Comments ({comments.length})
        </h3>
        <Button
          onClick={() => {
            setShowCommentForm(!showCommentForm);
            setReplyToComment(null);
            setReplyContent("");
            setReplyAuthorName("");
          }}
          variant="outline"
          size="sm"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Add Comment
        </Button>
      </div>

      {/* Comment Form */}
      {showCommentForm && (
        <Card className="border-2 border-secondary/20 bg-secondary/5">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MessageCircle className="h-4 w-4" />
                <span>
                  {replyToComment 
                    ? `Replying to comment #${replyToComment}` 
                    : 'Add a new comment to this health profile'
                  }
                </span>
              </div>
              
              <Input
                placeholder="Your name"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="max-w-xs"
                autoComplete="off"
                autoFocus={false}
              />
              
              <Textarea
                placeholder="Share your thoughts, advice, or experience..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                autoComplete="off"
                autoFocus={false}
              />
              
              <div className="flex items-center space-x-2">
                <Button
                  onClick={handleSubmitComment}
                  disabled={addCommentMutation.isPending}
                  size="sm"
                  className="bg-secondary hover:bg-secondary/90"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {addCommentMutation.isPending ? 'Posting...' : 'Save Comment'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowCommentForm(false);
                    setReplyToComment(null);
                    setNewComment("");
                    setAuthorName("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comments List */}
      {comments.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No comments yet</h4>
            <p className="text-gray-600 mb-4">
              Be the first to share your thoughts on this health profile and dietary advice.
            </p>
            <Button
              onClick={() => setShowCommentForm(true)}
              variant="outline"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Start the conversation
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {comments
            .filter((comment: Comment) => !comment.parentCommentId) // Only show top-level comments
            .map((comment: Comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
        </div>
      )}
    </div>
  );
}