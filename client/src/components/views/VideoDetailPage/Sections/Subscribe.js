import Axios from 'axios'
import React, { useEffect, useState } from 'react'

function Subscribe(props) {
    const [Subscribed,SetSubscribe] = useState(false)
    const [SubscribeNumber,SetSubscribeNumber] = useState(0)


    useEffect(()=> {
        let subscribeNumberVariable = { userTo: props.userTo}

       Axios.post('/api/subscribe/subscribeNumber', subscribeNumberVariable )
       .then( res => {
           if(res.data.success){
            SetSubscribeNumber(res.data.subscribeNumber)
           }else {
               alert('fail to get Subcribe Number')
           }
       })

       let subscribedVariable = { userTo: props.userTo, userFrom:localStorage.getItem('userId')}

       Axios.post('/api/subscribe/subscribed',subscribedVariable)
       .then(res => {
           if(res.data.success){
               SetSubscribe(res.data.subscribed)
           }else {
            alert('fail to get Subcribe Info')
           }
       })
    },[])

    const onSubscribeClick = () => {


        let toggleSubscribeVariable = {
            userTo : props.userTo,
            userFrom : localStorage.getItem('userId')
        }

        if(Subscribed){

            Axios.post('/api/subscribe/unsubscribe', toggleSubscribeVariable)
            .then(res => {
                if(res.data.success){
                    SetSubscribeNumber(SubscribeNumber - 1)
                    SetSubscribe(!Subscribed)
                }else{
                    alert('failed Unsubscribe ')
            }
        })

        }else{
            Axios.post('/api/subscribe/onsubscribe', toggleSubscribeVariable)
            .then(res => {
                if(res.data.success){
                    SetSubscribeNumber(SubscribeNumber + 1)
                    SetSubscribe(!Subscribed)
                }else{
                    alert('failed Onsubscribe ')
            }
        })


        }
    }
    return (
        <div>
        <button 
        onClick={onSubscribeClick}
        style={{
            backgroundColor: `${Subscribed ? '#AAAAAA' : '#CC0000'}`,
            borderRadius: '4px', color: 'white',
            padding: '10px 16px', fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase'
        }}>
            {SubscribeNumber} {Subscribed ? 'Subscribed' : 'Subscribe'}
        </button>
    </div>
    )
}

export default Subscribe
