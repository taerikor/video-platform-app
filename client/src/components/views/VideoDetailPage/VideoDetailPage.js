import React, { useEffect, useState } from 'react'
import { List, Avatar, Row, Col } from 'antd';
import Axios from 'axios';
import SideVideo from './Sections/SideVideo';
import Subscribe from './Sections/Subscribe';
import Comment from './Sections/Comment';
import LikeDislike from './Sections/LikeDislike';

function VideoDetailPage(props) {
    const [Video,setVideo] = useState([])
    const [comments,setComments] = useState([])

    const {match:{params:{videoId}}} = props

    useEffect(()=> {
        const variable = {
            videoId
        }
        Axios.post('/api/video/getVideoDetail', variable)
        .then(res => {
            if(res.data.success){
                setVideo(res.data.video)
            }else{
                alert('Failed to get video Info')
            }
        })

        Axios.post('/api/comment/getComments',variable)
        .then(res => {
            if(res.data.success){
                setComments(res.data.comments)
            }else{
                alert('Failed to get comment ')
            }
        })
    },[])

    const refreshComponent = (comment) => {
        setComments(comments.concat(comment))
    }

    
    if (Video.writer) {
    return (
        <Row>
        <Col lg={18} xs={24}>
            <div className="postPage" style={{ width: '100%', padding: '3rem 4em' }}>
                <video style={{ width: '100%' }} src={`http://localhost:5000/${Video.filePath}`} controls></video>

                <List.Item
                    actions={[<LikeDislike video userId={localStorage.getItem('userId')} videoId={videoId} /> ,  <Subscribe userTo={Video.writer._id} />]}
                >
                    <List.Item.Meta
                        avatar={<Avatar src={Video.writer && Video.writer.image} />}
                        title={<a href="https://ant.design">{Video.title}</a>}
                        description={Video.description}
                    />
                </List.Item>

                <Comment refreshComponent={refreshComponent} commentList={comments} postId={videoId}/>

            </div>
        </Col>
        <Col lg={6} xs={24}>
           <SideVideo />
        </Col>
    </Row>
    )
    }else {
        return <h1>Loading...</h1>
    }
}

export default VideoDetailPage
