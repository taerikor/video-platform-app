import React, { useState } from 'react'
import { Comment, Avatar, Button, Input } from 'antd';
import { useSelector } from 'react-redux';
import Axios from 'axios';
import LikeDislike from './LikeDislike'

const { TextArea } = Input;

function SingleComment({postId,comment,refreshComponent}) {
    const [openReply,setOpenReply] = useState(false)
    const [commentValue,setCommentValue] = useState('')

    const user = useSelector(state => state.user)

    const onChange = (e) => {
        const {target:{value}} = e;
        setCommentValue(value)
    }

    const onSubmit = e => {
        e.preventDefault();

        const variable = {
            content: commentValue ,
            writer: user.userData._id,
            postId,
            responseTo: comment._id
        }

        Axios.post('/api/comment/saveComment', variable)
        .then(res => {
            if(res.data.success){
              refreshComponent(res.data.result)
                setCommentValue('')
                setOpenReply(false)
            }else{
                alert('Failed Save')
            }
        })
    }

    const onReplyClick = () => {
        setOpenReply(rev => !rev)
    }
    const actions = [<LikeDislike  userId={localStorage.getItem('userId')} commentId={comment._id} />,
        <span onClick={onReplyClick} key='comment-basic-reply-to'> Reply to </span>
    ]
    return (
        <div>
             <Comment
                actions={actions}
                author={comment.writer.name}
                avatar={
                    <Avatar
                        src={comment.writer.image}
                        alt="image"
                    />
                }
                content={
                    <p>
                        {comment.content}
                    </p>
                }
            ></Comment>
            {openReply && <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                    <TextArea
                        style={{ width: '100%', borderRadius: '5px' }}
                        onChange={onChange}
                        value = {commentValue}
                        placeholder="write some comments"
                    />
                    <br />
                    <Button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>Submit</Button>
                </form>}


        </div>
    )
}

export default SingleComment
