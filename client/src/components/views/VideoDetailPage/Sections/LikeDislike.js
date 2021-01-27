import React, { useEffect, useState } from 'react'
import { Tooltip, Icon } from 'antd';
import Axios from 'axios';

function LikeDislike({video,userId,videoId,commentId}) {
    const [Likes, setLikes] = useState(0)
    const [Dislikes, setDislikes] = useState(0)
    const [LikeAction, setLikeAction] = useState(null)
    const [DislikeAction, setDislikeAction] = useState(null)

    let variable = {};

    if(video) {
        variable = { videoId , userId }
    }else {
        variable = { commentId , userId }
    }


    useEffect(()=>{
        Axios.post('/api/like/getLikes',variable)
        .then(res=> {
            if(res.data.success){
                setLikes(res.data.likes.length)
                res.data.likes.map(like => {
                    if(like.userId === userId)
                    setLikeAction('liked')
                }) 
            }else{
                alert('fail to get likes')
            }
        })

        Axios.post('/api/like/getDislikes',variable)
        .then(res=> {
            if(res.data.success){
                setDislikes(res.data.dislikes.length)
                res.data.dislikes.map(dislike => {
                    if(dislike.userId === userId)
                    setDislikeAction('disliked')
                }) 
            }else{
                alert('fail to get dislikes')
            }
        })


    },[])

    const onLikeClick = () => {
        
        if(LikeAction === null){
            Axios.post('/api/like/upLike', variable)
            .then(res=> {
                if(res.data.success){
                    setLikes(Likes + 1)
                    setLikeAction('liked')
                    if(DislikeAction !== null ){
                        setDislikes(Dislikes - 1)
                        setDislikeAction(null)
                    }
                }else{
                    alert('failed uplike')
                }
            })
        }else{

            Axios.post('/api/like/unLike', variable)
            .then(res=> {
                if(res.data.success){
                    setLikes(Likes - 1)
                    setLikeAction(null)
                }else{
                    alert('failed unlike')
                }
            })
        }
    }

    const onDislikeClick = () => {

        if(DislikeAction === null){
            Axios.post('/api/like/upDislike', variable)
            .then(res=> {
                if(res.data.success){
                    setDislikes(Dislikes + 1)
                    setDislikeAction('disliked')
                    if(LikeAction !== null ){
                        setLikes(Likes - 1)
                        setLikeAction(null)
                    }
                }else{
                    alert('failed updislike')
                }
            })
        }else {
            Axios.post('/api/like/unDislike', variable)
            .then(res=> {
                if(res.data.success){
                    setDislikes(Dislikes - 1)
                    setDislikeAction(null)
                }else{
                    alert('failed undislike')
                }
            })
        }
    }

    return (
        <React.Fragment>
        <span key="comment-basic-like">
            <Tooltip title="Like">
                <Icon type="like"
                    theme={LikeAction === 'liked' ? 'filled' : 'outlined'}
                    onClick={onLikeClick} />
            </Tooltip>
            <span style={{ paddingLeft: '8px', cursor: 'auto' }}>{Likes}</span>
        </span>&nbsp;&nbsp;
        <span key="comment-basic-dislike">
            <Tooltip title="Dislike">
                <Icon
                    type="dislike"
                    theme={DislikeAction === 'disliked' ? 'filled' : 'outlined'}
                    onClick={onDislikeClick}
                />
            </Tooltip>
            <span style={{ paddingLeft: '8px', cursor: 'auto' }}>{Dislikes}</span>
        </span>
    </React.Fragment>
    )
}

export default LikeDislike
