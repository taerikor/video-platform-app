import axios from 'axios'
import React from 'react'
import { message } from 'antd';
import { withRouter } from 'react-router-dom';

function DeleteMovie({videoId,history,video,comment,commentId,filterState}) {
    
    const onDeleteClick = () => {
        let variable
        if(video){
            variable = {
                videoId
            }
            axios.post('/api/video/deleteVideo',variable)
            .then(res=>{
                if(res.data.success){
                    message.success('Delete Video Success')
                    setTimeout(()=>{
                        history.push('/')
                    },1000)
                    
                }else{
                    alert('failed to delete')
                }
            })
        }else if (comment){
            variable = {
                commentId
            }
            axios.post('/api/comment/deleteComment',variable)
            .then(res=>{
                if(res.data.success){
                    message.success('Delete Comment Success')
                    filterState(res.data.comment)
                }else{
                    alert('failed to delete')
                }
            })
        }
    }
    return (
        <span onClick={onDeleteClick} style={{cursor:'pointer'}}>
            DEL
        </span>
    )
}

export default withRouter(DeleteMovie)
