import React,{ useState } from 'react'
import { Typography, Button, Form, message, Input, Icon } from 'antd';
import Dropzone from 'react-dropzone'
import Axios from 'axios';
import { useSelector } from 'react-redux';

const { Title } = Typography;
const { TextArea } = Input;

const PrivateOptions = [
    { value: 0 , label: 'Private'},
    { value: 1 , label: 'Public'},
]
const CategoryOptions = [
    { value: 0 , label: 'Film & Anime'},
    { value: 1 , label: 'Autos & Vehicles'},
    { value: 2 , label: 'Music'},
    { value: 3 , label: 'Pets & Animals'},
]

function VideoUploadPage(props) {
    const user = useSelector(state => state.user)

    const [videoTitle,setVideoTitle] = useState('');
    const [description,setDescription] = useState('');
    const [priv,setPriv] = useState(0);
    const [category,setCategory] = useState('Film & Anime')
    const [filePath, setFilePath] = useState('')
    const [duration, setDuration] = useState('')
    const [thumbnail, setThumbnail] = useState('')

    const onTitleChange = (e) => {
        const {target:{value}} = e;
        setVideoTitle(value)
    }
    const onDescChange = (e) => {
        const {target:{value}} = e;
        setDescription(value)
    }
    const onPrivateChange = (e) => {
        const {target:{value}} = e;
        setPriv(value)
    }
    const onCategoryChange = (e) => {
        const {target:{value}} = e;
        setCategory(value)
    }
    const onDrop = (files) => {
        let formData = new FormData;
        const config = {
            header: {'content-type': 'multipart/form-data'}
        }
        formData.append('file', files[0])
        Axios.post('/api/video/uploadfiles', formData, config)
        .then(res => {
            if(res.data.success) {
                let varialbe = {
                    filePath: res.data.filePath,
                    fileName: res.data.fileName
                }
                setFilePath(res.data.filePath)
                Axios.post('/api/video/thumbnail', varialbe)
                .then(res => {
                    if(res.data.success){
                        setDuration(res.data.fileDuration)
                        setThumbnail(res.data.thumbsFilePath)

                    }else {
                        alert('Failed Image Upload.') 
                    }
                })

            } else{
               alert('Failed Video Upload.') 
            }
        })
    }
    const onSubmit = (e) => {
        e.preventDefault();
        const varialbe = {
            writer: user.userData._id,
            title: videoTitle,
            description: description,
            privacy: priv,
            filePath: filePath,
            category: category,
            duration: duration,
            thumbnail: thumbnail,
        }

        Axios.post('/api/video/uploadVideo', varialbe)
        .then(res => {
            if(res.data.success){
               message.success('Success Upload!')
                setTimeout(()=> {
                    props.history.push('/')
                },2000)
            }else {
                alert('Failed Upload.') 
            }
        })
    }

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Title level={2} > Upload Video</Title>
        </div>

        <Form onSubmit={onSubmit}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Dropzone
                        onDrop={onDrop}
                        multiple={false}
                        maxSize={1000000000}>
                        {({ getRootProps, getInputProps }) => (
                            <div style={{ width: '300px', height: '240px', border: '1px solid lightgray', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                {...getRootProps()}
                            >
                                <input {...getInputProps()} />
                                <Icon type="plus" style={{ fontSize: '3rem' }} />

                            </div>
                        )}
                    </Dropzone>
                    {thumbnail &&  <div>
                        <img src={`http://localhost:5000/${thumbnail}`} alt="haha" />
                    </div> }
            </div>

            <br /><br />
            <label>Title</label>
            <Input
                onChange={onTitleChange}
                value={videoTitle}
            />
            <br /><br />
            <label>Description</label>
            <TextArea
                onChange={onDescChange}
                value={description}
            />
            <br /><br />

            <select onChange={onPrivateChange}>
                {PrivateOptions.map((option,index) => (
                    <option key={index} value={option.value} >{option.label}</option>
                 ))}
            </select>
            <br /><br />

            <select onChange={onCategoryChange}>
            {CategoryOptions.map((option,index) => (
                    <option key={index} value={option.value} >{option.label}</option>
                 ))}
            </select>
            <br /><br />

            <Button type="primary" size="large" onClick={onSubmit}>
                Submit
        </Button>
        </Form>
    </div>
    )
}

export default VideoUploadPage
