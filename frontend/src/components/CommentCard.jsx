    import React, { useState, useEffect } from 'react';
    import { Card, Form, Button } from 'react-bootstrap';
    import axiosInstance from '../services/axiosInstance';
    import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
    import { faEdit, faTrash, faSave, faTimes, faReply, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';

    const CommentCard = ({ commentId, onReplySubmit, replyContent, setReplyContent, onEditComment, onDeleteComment, onDeleteReply, setReplyingTo, replyingTo, currentUser }) => {
    const [comment, setComment] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState('');
    const [isUpvoted, setIsUpvoted] = useState(false);
    const [isDownvoted, setIsDownvoted] = useState(false);

    useEffect(() => {
        const fetchComment = async () => {
        try {
            const response = await axiosInstance.get(`/discuss/comment/${commentId}`);
            setComment(response.data);
            setEditContent(response.data.content);
            setIsUpvoted(response.data.upvotes.includes(currentUser));
            setIsDownvoted(response.data.downvotes.includes(currentUser));
        } catch (error) {
            console.error('Error fetching comment:', error);
        }
        };

        fetchComment();
    }, [commentId, currentUser]);

    const handleUpvote = async () => {
        try {
        await axiosInstance.put(`/discuss/comment/${comment._id}/upvote`);
    
        setComment(prevComment => {
            const isCurrentlyUpvoted = isUpvoted;
    
            return {
            ...prevComment,
            upvotes: isCurrentlyUpvoted
                ? prevComment.upvotes.filter(id => id !== currentUser) // Remove upvote
                : [...prevComment.upvotes, currentUser], // Add upvote
            downvotes: prevComment.downvotes.filter(id => id !== currentUser) // Always remove downvote
            };
        });
    
        setIsUpvoted(!isUpvoted); // Toggle upvote state
        setIsDownvoted(false); // Reset downvote state
        } catch (error) {
        console.error('Error upvoting comment:', error);
        }
    };
    
    const handleDownvote = async () => {
        try {
        await axiosInstance.put(`/discuss/comment/${comment._id}/downvote`);
    
        setComment(prevComment => {
            const isCurrentlyDownvoted = isDownvoted;
    
            return {
            ...prevComment,
            upvotes: prevComment.upvotes.filter(id => id !== currentUser), // Always remove upvote
            downvotes: isCurrentlyDownvoted
                ? prevComment.downvotes.filter(id => id !== currentUser) // Remove downvote
                : [...prevComment.downvotes, currentUser] // Add downvote
            };
        });
    
        setIsDownvoted(!isDownvoted); // Toggle downvote state
        setIsUpvoted(false); // Reset upvote state
        } catch (error) {
        console.error('Error downvoting comment:', error);
        }
    };
    

    const handleReplyContentChange = (e, commentId) => {
        const value = e.target.value;
        setReplyContent(prevState => ({
        ...prevState,
        [commentId]: value,
        }));
    };

    const handleReplySubmit = (e) => {
        e.preventDefault();
        onReplySubmit(e, comment._id, replyContent);
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        onEditComment(comment._id, editContent);
        setIsEditing(false);
    };

    const handleDelete = () => {
        onDeleteComment(comment._id);
    };

    if (!comment) {
        return <div>Loading...</div>;
    }

    const canEditOrDelete = currentUser && currentUser === comment.createdBy;

    return (
        <Card className="mb-3">
        <Card.Body>
            {isEditing ? (
            <Form onSubmit={handleEditSubmit}>
                <Form.Group controlId={`edit-${comment._id}`}>
                <Form.Control
                    as="textarea"
                    rows={3}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    required
                />
                </Form.Group>
                <Button variant="success" type="submit" disabled={!canEditOrDelete}>
                <FontAwesomeIcon icon={faSave} />
                </Button>
                <Button variant="secondary" onClick={handleEditToggle}>
                <FontAwesomeIcon icon={faTimes} />
                </Button>
            </Form>
            ) : (
            <>
                <Card.Text>{comment.content}</Card.Text>
                <div>
                    <Button
                        variant={isUpvoted ? "success" : "outline-success"}
                        onClick={handleUpvote}
                    >
                        <FontAwesomeIcon icon={faThumbsUp} />({comment.upvotes.length})
                    </Button>
                    <Button
                        variant={isDownvoted ? "danger" : "outline-danger"}
                        onClick={handleDownvote}
                    >
                        <FontAwesomeIcon icon={faThumbsDown} />  ({comment.downvotes.length})
                    </Button>
                    {canEditOrDelete && (
                        <>
                        <Button variant="link" className="text-success" onClick={handleEditToggle}>
                            <FontAwesomeIcon icon={faEdit} /> Edit
                        </Button>
                        <Button variant="link" className="text-danger" onClick={handleDelete}>
                            <FontAwesomeIcon icon={faTrash} /> Delete
                        </Button>
                        </>
                    )}
                <Button variant="link" className="text-primary" onClick={() => setReplyingTo(comment._id)}>
                    <FontAwesomeIcon icon={faReply} /> Reply
                </Button>
                </div>
            </>
            )}
            {comment.replies.length > 0 && (
            <div className="ml-4">
                {comment.replies.map((replyId) => (
                <CommentCard
                    key={replyId}
                    commentId={replyId}
                    onReplySubmit={onReplySubmit}
                    replyContent={replyContent}
                    setReplyContent={setReplyContent}
                    onEditComment={onEditComment}
                    onDeleteComment={onDeleteComment}
                    onDeleteReply={onDeleteReply}
                    setReplyingTo={setReplyingTo}
                    replyingTo={replyingTo}
                    currentUser={currentUser}
                />
                ))}
            </div>
            )}
            {replyingTo === comment._id && (
            <Form onSubmit={handleReplySubmit}>
                <Form.Group controlId={`reply-${comment._id}`}>
                <Form.Control
                    as="textarea"
                    rows={1}
                    value={replyContent[comment._id] || ''}
                    onChange={(e) => handleReplyContentChange(e, comment._id)}
                    placeholder="Write a reply..."
                    required
                />
                </Form.Group>
                <Button variant="primary" type="submit">
                Reply
                </Button>
            </Form>
            )}
        </Card.Body>
        </Card>
    );
    };

    export default CommentCard;
