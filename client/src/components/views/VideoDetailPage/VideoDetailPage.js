import React, { useEffect, useState } from 'react'
import { List, Avatar, Row, Col } from 'antd';
import Axios from 'axios';
import SideVideo from './Sections/SideVideo';

function VideoDetailPage(props) {
    const [Video,setVideo] = useState([])

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
    },[])
    return (
        <Row>
        <Col lg={18} xs={24}>
            <div className="postPage" style={{ width: '100%', padding: '3rem 4em' }}>
                <video style={{ width: '100%' }} src={`http://localhost:5000/${Video.filePath}`} controls></video>

                <List.Item
                    // actions={[<LikeDislikes video videoId={videoId} userId={localStorage.getItem('userId')}  />, <Subscriber userTo={Video.writer._id} userFrom={localStorage.getItem('userId')} />]}
                >
                    <List.Item.Meta
                        avatar={<Avatar src={Video.writer && Video.writer.image} />}
                        title={<a href="https://ant.design">{Video.title}</a>}
                        description={Video.description}
                    />
                </List.Item>

                {/* <Comments CommentLists={CommentLists} postId={Video._id} refreshFunction={updateComment} /> */}

            </div>
        </Col>
        <Col lg={6} xs={24}>
           <SideVideo />
        </Col>
    </Row>
    )
}

export default VideoDetailPage
