import React, { useState, useCallback } from 'react';
import ChatBot from './ChatBot';
import spacesAPI from '../utils/api';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Image,
  useToast,
  Card,
  CardBody,
  Icon,
  Center,
  Button,
  Spinner,
  Flex,
  Grid,
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { FiFile, FiX, FiActivity, FiLinkedin } from 'react-icons/fi';

// Animation keyframes
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const MedicalUploadIcon = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
    <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
    <path d="M11.993 16.75l2.747 -2.815a1.9 1.9 0 0 0 0 -2.632a1.775 1.775 0 0 0 -2.56 0l-.183 .188l-.183 -.189a1.775 1.775 0 0 0 -2.56 0a1.899 1.899 0 0 0 0 2.632l2.738 2.825z" />
  </Icon>
);

const HomePage = () => {
  const [loading, setLoading] = useState(false);
  const [discImages, setDiscImages] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const toast = useToast();

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile && droppedFile.type.startsWith('image/')) {
        handleFileUpload(droppedFile);
      } else {
        toast({
          title: 'Invalid file type',
          description: 'Please upload an image file',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    },
    [toast]
  );

  const handleFileUpload = async (selectedFile) => {
    if (!selectedFile || !(selectedFile instanceof File)) {
      toast({
        title: 'Invalid File',
        description: 'Please select a valid image file.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setFile(selectedFile);
    setDiscImages([]);
    setPreview(null);
    setLoading(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);

    try {
      const result = await spacesAPI.processImageWithDiscDetection(selectedFile);
      if (result && result.data && result.data.length >= 2) {
        const processedImageData = result.data[0];
        const analysisResultsJSON = result.data[1];

        let processedImageSrc = null;
        if (typeof processedImageData === 'string') {
          processedImageSrc = processedImageData;
        } else if (processedImageData?.image) {
          processedImageSrc = processedImageData.image;
        } else if (processedImageData?.url) {
          processedImageSrc = processedImageData.url;
        }
        if (processedImageSrc) setPreview(processedImageSrc);

        if (analysisResultsJSON && typeof analysisResultsJSON === 'string') {
          try {
            const parsedResults = JSON.parse(analysisResultsJSON);
            if (Array.isArray(parsedResults)) {
              setDiscImages(parsedResults);
            }
          } catch (err) {
            console.error('Parse error:', err);
          }
        }
      }
    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        title: 'Processing Failed',
        description: 'There was an error processing the image.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    setDiscImages([]);
  };

  const formatPredictionValue = (value, isInteger = false) => {
    if (isInteger) return Math.round(value);
    return typeof value === 'number' ? value.toFixed(3) : value;
  };

  const TeamMember = ({ name, linkedin }) => (
    <Box
      bg="white"
      p={6}
      borderRadius="xl"
      boxShadow="sm"
      textAlign="center"
    >
      <VStack spacing={3} mb={4}>
        <Text fontWeight="bold" color="#1a365d" fontSize="xl">
          {name}
        </Text>
      </VStack>
      <HStack spacing={3} justify="center">
        {linkedin && (
          <Button
            as="a"
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            size="sm"
            colorScheme="blue"
            variant="ghost"
            leftIcon={<FiLinkedin />}
          >
            LinkedIn
          </Button>
        )}
      </HStack>
    </Box>
  );

  return (
    <Box bg="#1a365d" minH="100vh">
      {/* Hero Section */}
      <Box w="full" pb={20} pt={10} animation={`${fadeIn} 0.5s ease-out`}>
        <Container maxW="container.xl">
          <VStack spacing={8} align="center">
            <Heading size="2xl" color="white" textAlign="center">
              MedVisor AI
            </Heading>
            <Text color="white" fontSize="2xl" textAlign="center" maxW="800px">
              Medical Image Analysis Powered by Artificial Intelligence
            </Text>

            {/* Upload Card */}
            <Card bg="white" w="full" maxW="800px" borderRadius="2xl" boxShadow="2xl">
              <CardBody p={8}>
                <VStack spacing={6}>
                  {!file ? (
                    <Box
                      w="100%"
                      h="300px"
                      border="3px dashed"
                      borderColor={isDragging ? '#5A6F6A' : 'gray.200'}
                      borderRadius="xl"
                      bg={isDragging ? '#f0f4f4' : 'white'}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <Center h="100%" flexDirection="column" p={4}>
                        <Icon
                          as={MedicalUploadIcon}
                          w={20}
                          h={20}
                          color="#5A6F6A"
                          mb={6}
                          animation={`${pulse} 2s infinite`}
                        />
                        <VStack spacing={4}>
                          <Text fontSize="2xl" fontWeight="medium" color="#1a365d">
                            Upload Your Medical Image
                          </Text>
                          <Text color="gray.500">Drag and drop here or</Text>
                          <Button as="label" htmlFor="file-upload" bg="#1a365d" color="white">
                            Select File
                            <input
                              id="file-upload"
                              type="file"
                              accept="image/*"
                              onChange={handleFileSelect}
                              style={{ display: 'none' }}
                            />
                          </Button>
                        </VStack>
                      </Center>
                    </Box>
                  ) : (
                    <Box w="100%">
                      <VStack spacing={4}>
                        <HStack justify="space-between" w="full">
                          <HStack spacing={4}>
                            <Icon as={FiFile} />
                            <Text>{file.name}</Text>
                          </HStack>
                          <Button size="sm" variant="ghost" onClick={removeFile} colorScheme="red">
                            <Icon as={FiX} />
                          </Button>
                        </HStack>

                        <Center>
                          {loading ? (
                            <Flex direction="column" align="center" h="300px">
                              <Spinner size="xl" color="blue.500" />
                              <Text mt={4}>Processing your image...</Text>
                            </Flex>
                          ) : (
                            preview && (
                              <Box mt={6} textAlign="center">
                                <Heading size="md" color="#1a365d" mb={4}>
                                  Processed Image
                                </Heading>
                                <Image
                                  src={preview}
                                  alt="Processed Output"
                                  maxH="400px"
                                  mx="auto"
                                  borderRadius="lg"
                                />
                              </Box>
                            )
                          )}
                        </Center>

                        {/* Simplified Results */}
                        {discImages.length > 0 && (
                          <Box mt={8} w="full">
                            <Heading size="md" color="#1a365d" textAlign="center" mb={6}>
                              Analysis Results ({discImages.length} discs)
                            </Heading>

                            <Flex wrap="wrap" justify="center" gap={6}>
                              {discImages.map((disc, index) => (
                                <Card
                                  key={index}
                                  w="260px"
                                  borderRadius="lg"
                                  border="1px solid"
                                  borderColor="gray.200"
                                  boxShadow="md"
                                  bg="white"
                                  textAlign="center"
                                >
                                  <CardBody>
                                    <Heading size="sm" color="#1a365d" mb={3}>
                                      Disc {disc.disc_number}
                                    </Heading>
                                    {disc.disc_image ? (
                                      <Image
                                        src={disc.disc_image}
                                        alt={`Disc ${disc.disc_number}`}
                                        maxH="140px"
                                        mx="auto"
                                        mb={4}
                                        objectFit="contain"
                                        borderRadius="md"
                                      />
                                    ) : (
                                      <Center h="140px" mb={4}>
                                        <Icon as={FiActivity} w={10} h={10} color="gray.400" />
                                      </Center>
                                    )}
                                    <VStack spacing={2}>
                                      <Text fontSize="sm">
                                        <b>Pfirrman:</b>{' '}
                                        {formatPredictionValue(disc.predictions?.pfirrman_grade, true) ||
                                          'N/A'}
                                      </Text>
                                      <Text fontSize="sm">
                                        <b>Modic:</b>{' '}
                                        {formatPredictionValue(disc.predictions?.modic, true) || 'N/A'}
                                      </Text>
                                      <Text fontSize="sm">
                                        <b>Herniation:</b>{' '}
                                        {formatPredictionValue(disc.predictions?.disc_herniation) ||
                                          'N/A'}
                                      </Text>
                                      <Text fontSize="sm">
                                        <b>Narrowing:</b>{' '}
                                        {formatPredictionValue(disc.predictions?.disc_narrowing) ||
                                          'N/A'}
                                      </Text>
                                      <Text fontSize="sm">
                                        <b>Bulging:</b>{' '}
                                        {formatPredictionValue(disc.predictions?.disc_bulging) ||
                                          'N/A'}
                                      </Text>
                                      <Text fontSize="sm">
                                        <b>Spondylolisthesis:</b>{' '}
                                        {formatPredictionValue(disc.predictions?.spondylilisthesis) ||
                                          'N/A'}
                                      </Text>
                                      <Text fontSize="sm">
                                        <b>Endplate (Upper):</b>{' '}
                                        {formatPredictionValue(disc.predictions?.up_endplate) ||
                                          'N/A'}
                                      </Text>
                                      <Text fontSize="sm">
                                        <b>Endplate (Lower):</b>{' '}
                                        {formatPredictionValue(disc.predictions?.low_endplate) ||
                                          'N/A'}
                                      </Text>
                                    </VStack>
                                  </CardBody>
                                </Card>
                              ))}
                            </Flex>
                          </Box>
                        )}
                      </VStack>
                    </Box>
                  )}
                </VStack>
              </CardBody>
            </Card>
          </VStack>
        </Container>
      </Box>

      {/* Team Credits Section */}
      <Box bg="white" py={20}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <Heading color="#1a365d" size="xl" textAlign="center">
              Meet Our Team
            </Heading>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={8}>
              <TeamMember 
                name="Love Bhusal" 
                linkedin="https://www.linkedin.com/in/love-bhusal/" />
              <TeamMember 
                name="Tu Dao" 
                linkedin="https://www.linkedin.com/in/tudao02/" />
              <TeamMember
                name="Elden Delguia"
                linkedin="https://www.linkedin.com/in/elden-deguia-84a68b325/"
              />
              <TeamMember 
                name="Riley Mckinney" 
                linkedin="https://www.linkedin.com/in/riley-mckinney/" />
              <TeamMember 
                name="Sai Peram" 
                linkedin="https://www.linkedin.com/in/sai-peram/" />
              <TeamMember
                name="Rishil Uppaluru"
                linkedin="https://www.linkedin.com/in/rishiluppaluru/"
              />
            </Grid>
          </VStack>
        </Container>
      </Box>

      <ChatBot />
    </Box>
  );
};

export default HomePage;
