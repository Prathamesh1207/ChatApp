import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import React from 'react'
import { useState } from 'react'
import { ChatState } from '../../context/chatProvider'
import axios from 'axios'
import UserListItem from '../userAvatar/userListItem'
import UserbadgeItem from '../userAvatar/userbadgeItem'

const GroupChatModal = ({children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName,setGroupChatName]=useState();
    const [selectedUser,setSelectedUser]=useState([]);
    const [search,setSearch]=useState();
    const [searchResult,seteSearchResult]=useState();
    const [loading,setLoding]=useState(false);

    const toast = useToast();
    const{user,chats,setChats}=ChatState();

    const handleSearch=async(query)=>{
        setSearch(query);
        if(!query){
            return;
        }

        try {
            setLoding(true);
            const config={
                 headers:{
                    "Content-type":"application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const {data}= await axios.get(`/api/user?search=${search}`,config);
            setLoding(false);
            seteSearchResult(data);
        } catch (error) {   
            toast({
                 title: 'Error occured',
                 description:"failed to load user",
                 status: 'error',
                 duration: 5000,
                 isClosable: true,
                 position:"bottom-left",
            });
            
        }
    };

    const handleSubmit=async()=>{
                 if(!groupChatName || !selectedUser){
            toast({
                 title: 'Please fill all the field',
                 status: 'warning',
                 duration: 5000,
                 isClosable: true,
                 position:"top",
            });
            return;
        }

        try {
            const config={
                 headers:{
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const {data}=await axios.post(`/api/chat/group`,{
                name:groupChatName,
                users:JSON.stringify(selectedUser.map((u)=>u._id))
            },config);
            setChats([data,...chats]);
            onClose();
            toast({
                 title: 'New Group Chat Created',
                 status: 'success',
                 duration: 5000,
                 isClosable: true,
                 position:"bottom",
            });
        } catch (error) {
            toast({
                 title: 'Failed to Create the Chat!',
                 description:error.responce.data,
                 status: 'success',
                 duration: 5000,
                 isClosable: true,
                 position:"bottom",
            });
        }


    };








    
    const handleGroup=(userToAdd)=>{
        if(selectedUser.includes(userToAdd)){
            toast({
                 title: 'Error occured',
                 description:"failed to load user",
                 status: 'error',
                 duration: 5000,
                 isClosable: true,
                 position:"bottom-left",
            });
            return;
        }
        setSelectedUser([...selectedUser,userToAdd])
    };

    const handleDelete=(deleteuser)=>{
        setSelectedUser(selectedUser.filter((sel)=>sel._id!==deleteuser._id))
    };


    




  return (
    <>
      <Button onClick={onOpen}>{children}</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="30px" fontFamily="work Sans" display="flex" justifyContent="center">Create Group Chat </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDirection="column" alignItems="center">
            <FormControl>
                <Input placeholder="Chat Name" mb={3}
                    onChange={(e)=>setGroupChatName(e.target.value)}
                />
            </FormControl>
            <FormControl>
                <Input placeholder="Add users" mb={1}
                    onChange={(e)=>handleSearch(e.target.value)}
                />
            </FormControl>
            
            <Box width="100%" display="flex" flexWrap="wrap">
            {selectedUser.map(user=>(<UserbadgeItem key={user._id} user={user} handleFunction={()=>handleDelete(user)} />))}
            </Box>

           
            {loading?(<div>..loading</div>):(
                searchResult?.slice(0,4).map((user)=>(<UserListItem key={user._id} user={user} handleFunction={()=>handleGroup(user)}/>))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>

  )
}
export default GroupChatModal








