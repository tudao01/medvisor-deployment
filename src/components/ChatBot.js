import React, { useState } from 'react';
import {
  Box,
  IconButton,
  VStack,
  Input,
  Button,
  Text,
  CloseButton,
  useColorModeValue,
  Flex,
  Icon,
  Slide,
} from '@chakra-ui/react';
import { FiMessageSquare, FiSend } from 'react-icons/fi';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      setMessages([...messages, { text: inputMessage, sender: 'user' }]);
      setInputMessage('');
  
      try {
        // Send POST request to the Flask backend
        const response = await fetch(`https://medvisor-backend-production.up.railway.app/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: inputMessage }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch response from server.');
        }
  
        const data = await response.json();
        
        setMessages((prev) => [
          ...prev,
          { text: data.response, sender: 'bot' },
        ]);
      } catch (error) {
        console.error('Error fetching chatbot response:', error);
        setMessages((prev) => [
          ...prev,
          { text: 'Error: Unable to fetch response from the server.', sender: 'bot' },
        ]);
      }
    }
  };

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box position="fixed" bottom="4" right="4" zIndex="overlay">
      {!isOpen ? (
        <IconButton
          icon={<Icon as={FiMessageSquare} w={6} h={6} />}
          colorScheme="blue"
          rounded="full"
          size="lg"
          shadow="lg"
          onClick={() => setIsOpen(true)}
          _hover={{
            transform: 'scale(1.1)',
          }}
          transition="all 0.2s"
        />
      ) : (
        <Slide direction="bottom" in={isOpen} style={{ position: 'relative' }}>
          <Box
            w="300px"
            h="400px"
            bg={bgColor}
            borderRadius="lg"
            shadow="xl"
            border="1px"
            borderColor={borderColor}
          >
            {/* Chat Header */}
            <Flex
              p={4}
              borderBottom="1px"
              borderColor={borderColor}
              justify="space-between"
              align="center"
            >
              <Text fontWeight="bold">Lumby :</Text>
              <CloseButton onClick={() => setIsOpen(false)} />
            </Flex>

            {/* Chat Messages */}
            <VStack
              h="280px"
              overflowY="auto"
              p={4}
              spacing={4}
              align="stretch"
              css={{
                '&::-webkit-scrollbar': {
                  width: '4px',
                },
                '&::-webkit-scrollbar-track': {
                  width: '6px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#cbd5e0',
                  borderRadius: '24px',
                },
              }}
            >
              {messages.map((message, index) => (
                <Box
                  key={index}
                  alignSelf={message.sender === 'user' ? 'flex-end' : 'flex-start'}
                  bg={message.sender === 'user' ? 'blue.500' : 'gray.100'}
                  color={message.sender === 'user' ? 'white' : 'black'}
                  py={2}
                  px={4}
                  borderRadius="lg"
                  maxW="80%"
                >
                  <Text fontSize="sm">{message.text}</Text>
                </Box>
              ))}
            </VStack>

            {/* Chat Input */}
            <Flex p={4} borderTop="1px" borderColor={borderColor}>
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type a message..."
                mr={2}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
              />
              <IconButton
                icon={<FiSend />}
                colorScheme="blue"
                onClick={handleSendMessage}
              />
            </Flex>
          </Box>
        </Slide>
      )}
    </Box>
  );
};

export default ChatBot;
