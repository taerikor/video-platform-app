import Axios from 'axios';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import ReplyComment from './ReplyComment';
import SingleComment from './SingleComment';

function Comment({postId,commentList,refreshComponent}) {
    const [comment,setComment] = useState('')

    const user = useSelector(state => state.user)


    const onChange = (e) => {
        const {target:{value}} = e;
        setComment(value)
    }

    const onSubmit = (e) => {
        e.preventDefault();

        const variable = {
            content: comment ,
            writer: user.userData._id,
            postId,
        }

        Axios.post('/api/comment/saveComment', variable)
        .then(res => {
            if(res.data.success){
                console.log('comment: ',res.data.result)
                refreshComponent(res.data.result)
                setComment('')
            }else{
                alert('Failed Save')
            }
        })
    }
    return (
        <div>
            <br />
            <p> Replies </p>
            <hr />

     {/* commnet list */}
     {commentList && commentList.map((comment,index)=>(
         (!comment.responseTo &&
            <>
            <SingleComment refreshComponent={refreshComponent} key={index} comment={comment} postId={postId}/>
            <ReplyComment parentCommentId={comment._id} postId={postId} refreshComponent={refreshComponent} commentList={commentList} />
            </>
            )
     ))}
     {/* Root comment form*/}

     <form style={{display:'flex' }} onSubmit={onSubmit} >
        <textarea 
            style={{ width:'100%', borderRadius: '5px'}}
            onChange={onChange}
            value={comment}
            placeholder='Type Comment'

            />
            <br/>
            <button style={{width: '20%', height: '52px' }}
            onClick={onSubmit}
            >Submit</button>
            </form>
        </div>
    )
}

export default Comment
