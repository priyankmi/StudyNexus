import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';
import axiosInstance from '../services/axiosInstance';
import CommentCard from '../components/CommentCard'; 
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSave, faTimes, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';

const ThreadDetailPage = () => {
  const { threadId } = useParams();
  const [thread, setThread] = useState(null);
  const [newCommentContent, setNewCommentContent] = useState('');
  const [comments, setComments] = useState([]);
  const [replyContent, setReplyContent] = useState({} );
  const [replyingTo, setReplyingTo] = useState(null); // State to manage the reply box visibility
  const [currentUser, setCurrentUser] = useState(null); // State to store currentUser
  const [isEditing, setIsEditing] = useState(false);
  const [editThreadTitle, setEditThreadTitle] = useState('');
  const [editThreadDescription, setEditThreadDescription] = useState('');
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [isDownvoted, setIsDownvoted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchThread = async () => {
      try {
        const response = await axiosInstance.get(`/discuss/mainThread/${threadId}`);
        setThread(response.data);
        setComments(response.data.comments);
        setEditThreadTitle(response.data.title);
        setEditThreadDescription(response.data.description);

        setIsUpvoted(response.data.upvotes.includes(currentUser));
        setIsDownvoted(response.data.downvotes.includes(currentUser));
      } catch (error) {
        console.error('Error fetching thread:', error);
      }
    };

    fetchThread();
  }, [threadId, currentUser]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.get('/dashboard/getProfile'); // Replace with your actual profile route
        setCurrentUser(response.data.id); // Assuming currentUser is returned in profileResponse
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []); // Empty dependency array ensures this effect runs only once on component mount

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(`/discuss/comment/${threadId}`, {
        content: newCommentContent
      });
      const newComment = response.data;
      setComments(prevComments => [...prevComments, newComment]);
      setNewCommentContent('');
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  const handleReplySubmit = async (e, parentCommentId, replyContent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(`/discuss/reply/${parentCommentId}/${threadId}`, {
        content: replyContent[parentCommentId]
      });
  
      const newReply = response.data; // Assuming the response contains the newly added reply object
  
      // Update replies array for the parent comment
      setComments(prevComments =>
        prevComments.map(comment =>
          comment._id === parentCommentId
            ? { ...comment, replies: [...comment.replies, newReply] }
            : comment
        )
      );
  
      // Clear reply content for this comment
      setReplyContent(prevState => ({
        ...prevState,
        [parentCommentId]: '',
      }));
  
    } catch (error) {
      console.error('Error replying to comment:', error);
    }
  };

  const handleEditThreadToggle = () => {
    setIsEditing(!isEditing);
  };
  
  const handleEditThreadSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedThread = {
        title: editThreadTitle,
        description: editThreadDescription,
      };
  
      // Send PUT request to update thread with updated title and description
      await axiosInstance.put(`/discuss/mainThread/${thread._id}`, updatedThread);
  
      // Update thread state with the edited content
      setThread(prevThread => ({
        ...prevThread,
        title: editThreadTitle,
        description: editThreadDescription,
      }));
  
      // Exit edit mode
      setIsEditing(false);
    } catch (error) {
      console.error('Error editing thread:', error);
    }
  };
  

  const handleDeleteThread = async () => {
    try {
      await axiosInstance.delete(`/discuss/mainThread/${thread._id}`);
      navigate('/discuss');

    } catch (error) {
      console.error('Error deleting thread:', error);

    }
  };

  const handleThreadUpvote = async () => {
    try {
      await axiosInstance.put(`/discuss/mainThread/${thread._id}/upvote`);
  
      setThread(prevThread => {
        const isCurrentlyUpvoted = isUpvoted;
  
        return {
          ...prevThread,
          upvotes: isCurrentlyUpvoted
            ? prevThread.upvotes.filter(id => id !== currentUser) // Remove upvote
            : [...prevThread.upvotes, currentUser], // Add upvote
          downvotes: prevThread.downvotes.filter(id => id !== currentUser) // Always remove downvote
        };
      });
  
      setIsUpvoted(!isUpvoted); // Toggle upvote state
      setIsDownvoted(false); // Reset downvote state
    } catch (error) {
      console.error('Error upvoting thread:', error);
    }
  };
  
  const handleThreadDownvote = async () => {
    try {
      await axiosInstance.put(`/discuss/mainThread/${thread._id}/downvote`);
  
      setThread(prevThread => {
        const isCurrentlyDownvoted = isDownvoted;
  
        return {
          ...prevThread,
          upvotes: prevThread.upvotes.filter(id => id !== currentUser), // Always remove upvote
          downvotes: isCurrentlyDownvoted
            ? prevThread.downvotes.filter(id => id !== currentUser) // Remove downvote
            : [...prevThread.downvotes, currentUser] // Add downvote
        };
      });
  
      setIsDownvoted(!isDownvoted); // Toggle downvote state
      setIsUpvoted(false); // Reset upvote state
    } catch (error) {
      console.error('Error downvoting thread:', error);
    }
  };

  const handleEditComment = async (commentId, newContent) => {
    try {
      await axiosInstance.put(`/discuss/comment/${commentId}`, {
        content: newContent,
      });
      setComments(prevComments =>
        prevComments.map(comment =>
          comment._id === commentId ? { ...comment, content: newContent } : comment
        )
      );
    } catch (error) {
      console.error('Error editing comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axiosInstance.delete(`/discuss/comment/${commentId}/${threadId}`);
      setComments(prevComments =>
        prevComments.filter(comment => comment._id !== commentId)
      );
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleDeleteReply = async (replyId, parentCommentId) => {
    try {
      await axiosInstance.delete(`/discuss/reply/${replyId}`);
      setComments(prevComments =>
        prevComments.map(comment =>
          comment._id === parentCommentId
            ? { ...comment, replies: comment.replies.filter(reply => reply._id !== replyId) }
            : comment
        )
      );
    } catch (error) {
      console.error('Error deleting reply:', error);
    }
  };

  if (!thread) {
    return <p>Loading thread...</p>;
  }


  const canEditOrDeleteThread = currentUser && currentUser === thread.createdBy;
  return (
    <Container className="py-4 mt-3">
      <div className='border border-dark p-4 mb-4'>
      {isEditing ? (
  <Form onSubmit={handleEditThreadSubmit}>
    <Form.Group controlId={`edit-${thread._id}`}>
      <Form.Label>Title</Form.Label>
      <Form.Control
        type="text"
        value={editThreadTitle}
        onChange={(e) => setEditThreadTitle(e.target.value)}
        required
      />
      <Form.Label>Description</Form.Label>
      <Form.Control
        as="textarea"
        rows={3}
        value={editThreadDescription}
        onChange={(e) => setEditThreadDescription(e.target.value)}
        required
      />
    </Form.Group>
    <Button variant="success" type="submit" disabled={!canEditOrDeleteThread}>
      <FontAwesomeIcon icon={faSave} /> Save
    </Button>
    <Button variant="secondary" onClick={handleEditThreadToggle}>
      <FontAwesomeIcon icon={faTimes} /> Cancel
    </Button>
  </Form>
) : (
          <>
            <h2 className='mb-3'>{thread.title}</h2>
            <p>{thread.description}</p>
            <div>
              <Button
                variant={isUpvoted ? "success" : "outline-success"}
                onClick={handleThreadUpvote}
              >
                <FontAwesomeIcon icon={faThumbsUp} />({thread.upvotes.length})
              </Button>
              <Button
                variant={isDownvoted ? "danger" : "outline-danger"}
                onClick={handleThreadDownvote}
              >
                <FontAwesomeIcon icon={faThumbsDown} />  ({thread.downvotes.length})
              </Button>
              {canEditOrDeleteThread && (
                <>
                  <Button variant="link" className="text-success" onClick={handleEditThreadToggle}>
                    <FontAwesomeIcon icon={faEdit} /> Edit
                  </Button>
                  <Button variant="link" className="text-danger" onClick={handleDeleteThread}>
                    <FontAwesomeIcon icon={faTrash} /> Delete
                  </Button>
                </>
              )}
            </div>
          </>
        )}
      </div>
     
      <Form onSubmit={handleCommentSubmit} className="mb-4">
        <Form.Group controlId="newComment">
          <Form.Control
            as="textarea"
            rows={3}
            value={newCommentContent}
            onChange={(e) => setNewCommentContent(e.target.value)}
            placeholder="Write your comment..."
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" className='mt-1'>
          Post Comment
        </Button>
      </Form>

      <div className="comments">
        {comments.map(commentId => (
          <CommentCard
            key={commentId}
            commentId={commentId}
            onReplySubmit={handleReplySubmit}
            replyContent={replyContent}
            setReplyContent={setReplyContent}
            onEditComment={handleEditComment}
            onDeleteComment={handleDeleteComment}
            onDeleteReply={handleDeleteReply}
            setReplyingTo={setReplyingTo} // Pass setter function to manage reply box visibility
            replyingTo={replyingTo}
            currentUser={currentUser}
          />
        ))}
      </div>
    </Container>
  );
};

export default ThreadDetailPage;
