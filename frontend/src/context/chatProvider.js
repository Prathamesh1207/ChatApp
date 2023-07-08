import {createContext, useContext, useEffect, useState} from 'react';
// // import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useHistory,withRouter} from 'react-router-dom'

const ChatContext=createContext()

const ChatProvider =({children})=>{
    const [user,setUser]=useState()
    const [selectedChat,setSelectedChat]=useState()
    const [chats,setChats]=useState([])
    const [notification,setNotification]=useState([])

    const history=useHistory();

    //as we are store the login ad signup data to local storage so fetch local storage
    useEffect(()=>{
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);
        //remove
        if(!userInfo){
            history.push('/');
            
        }//remove

    },[history]);
    




    return <ChatContext.Provider value={{user,setUser,selectedChat,setSelectedChat,chats,setChats,notification,setNotification}}>
        {children}
    </ChatContext.Provider>
};

export const ChatState=()=>{
    return useContext(ChatContext);
}


export default ChatProvider;