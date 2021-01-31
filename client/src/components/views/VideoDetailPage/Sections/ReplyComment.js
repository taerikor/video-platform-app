import React, { useEffect, useState } from 'react'
import SingleComment from './SingleComment'

function ReplyComment({commentList,postId,refreshComponent,parentCommentId,filterState}) {
    const [childCommentNumber, setChildCommentNumber] = useState(0)
    const [OpenReplyComments, setOpenReplyComments] = useState(false)


    useEffect(()=>{

        let commentNumber = 0;

        commentList.map((comment) => {

            if (comment.responseTo === parentCommentId) {
                commentNumber++
            }
        })

        setChildCommentNumber(commentNumber)

    },[commentList,parentCommentId])

    let renderReplyComment = (parentCommentId) => 
        commentList.map((comment, index) => (
            <React.Fragment key={index}>
          {  comment.responseTo === parentCommentId &&
            <div  style={{ width: '80%', marginLeft: '40px' }}>
            <SingleComment refreshComponent={refreshComponent} key={index} comment={comment} postId={postId} filterState={filterState}/>
            <ReplyComment parentCommentId={comment._id} postId={postId} refreshComponent={refreshComponent} commentList={commentList} filterState={filterState}/>
            </div>
        }
        </React.Fragment>
        ))
    

    const onClick = () => {
        setOpenReplyComments(!OpenReplyComments)
    }

    return (
        <div>
            {childCommentNumber > 0 &&
                <p style={{ fontSize: '14px', margin: 0, color: 'gray' }}
                    onClick={onClick} >
                    View {childCommentNumber} more comment(s)
             </p>
            }

            
          {OpenReplyComments &&
                renderReplyComment(parentCommentId)
          }

        </div>
    )
}

export default ReplyComment
