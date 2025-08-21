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
  Progress,
  Badge,
  Flex,
  Divider,
  Grid,
  GridItem,
  Spinner,
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { FiFile, FiX, FiShield, FiCpu, FiActivity, FiLinkedin } from 'react-icons/fi';

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

const FeatureCard = ({ icon, title, description }) => (
  <Card
    bg="white"
    p={6}
    borderRadius="xl"
    boxShadow="lg"
    transition="all 0.3s ease"
    _hover={{ transform: 'translateY(-5px)', boxShadow: 'xl' }}
    h="full"
  >
    <VStack spacing={4} align="flex-start">
      <Icon as={icon} w={8} h={8} color="#5A6F6A" />
      <Heading size="md" color="#1a365d">
        {title}
      </Heading>
      <Text color="gray.600">{description}</Text>
    </VStack>
  </Card>
);

const HomePage = () => {
  const [loading, setLoading] = useState(false);
  const [discImages, setDiscImages] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const toast = useToast();

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const simulateUploadProgress = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => setUploadProgress(0), 1000);
      }
    }, 100);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      handleFileUpload(droppedFile);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [toast]);

  const handleFileUpload = async (selectedFile) => {
    // Validate file
    if (!selectedFile || !(selectedFile instanceof File)) {
      toast({
        title: "Invalid File",
        description: "Please select a valid image file.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // Additional file validation
    if (selectedFile.size === 0) {
      toast({
        title: "Empty File",
        description: "The selected file is empty. Please choose a different file.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // Check file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 10MB.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // Validate file type
    if (!selectedFile.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file (JPEG, PNG, etc.).",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setFile(selectedFile);
    setDiscImages([]); // Clear old disc images
    setPreview(null); // Clear old preview image
    setLoading(true); // Start loading animation
  
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result); // Set temporary preview
    };
    reader.readAsDataURL(selectedFile);
  
    try {
      console.log('Uploading file:', selectedFile.name, 'Size:', selectedFile.size);
      
      // Process image using Hugging Face Spaces backend
      const result = await spacesAPI.processImageWithDiscDetection(selectedFile);
      
      console.log('Full API Response:', result);
      
      if (result && result.data && result.data.length >= 2) {
        console.log("Processing Successful");
        toast({
          title: "Processing Successful",
          description: "The image has been processed and discs detected.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        // Extract processed image and analysis results
        const processedImage = result.data[0]; // First element is the processed image
        const analysisResultsJSON = result.data[1]; // Second element is the JSON string
        
        console.log('Processed Image:', processedImage);
        console.log('Analysis Results JSON:', analysisResultsJSON);
        
        // Set the processed image
        if (processedImage && processedImage.image) {
          setPreview(processedImage.image);
        }
        
        // Parse the JSON analysis results
        if (analysisResultsJSON && typeof analysisResultsJSON === 'string') {
          try {
            const parsedResults = JSON.parse(analysisResultsJSON);
            console.log('Parsed Results:', parsedResults);
            
            if (Array.isArray(parsedResults)) {
              setDiscImages(parsedResults);
            } else {
              console.error('Expected array but got:', typeof parsedResults);
              toast({
                title: "Data Format Error",
                description: "Unexpected data format received from server.",
                status: "error",
                duration: 3000,
                isClosable: true,
              });
            }
          } catch (parseError) {
            console.error('Error parsing JSON results:', parseError);
            toast({
              title: "Data Parse Error",
              description: "Could not parse analysis results from server.",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          }
        }
      } else {
        console.log('Unexpected response format:', result);
        toast({
          title: "Processing Failed",
          description: "The server could not process the image properly.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error processing image:", error);
      toast({
        title: "Processing Failed",
        description: "There was an error processing the image. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false); // Stop loading animation
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
    setUploadProgress(0);
    setDiscImages([]);
  };

  const formatPredictionValue = (value, isInteger = false) => {
    if (isInteger) {
      return Math.round(value);
    }
    return typeof value === 'number' ? value.toFixed(3) : value;
  };

  const Testimonial = ({ text, author, role }) => (
    <Box
      bg="white"
      p={8}
      borderRadius="xl"
      boxShadow="0 4px 6px rgba(0, 0, 0, 0.05)"
      maxW="sm"
      position="relative"
      transition="all 0.3s ease"
      _hover={{
        transform: 'translateY(-8px)',
        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Decorative quote mark */}
      <Box
        position="absolute"
        top={4}
        left={4}
        fontSize="6xl"
        color="#90CDF4"
        opacity={0.3}
        lineHeight="1"
        fontFamily="Georgia, serif"
      >
        "
      </Box>
  
      {/* Testimonial text */}
      <Text
        mt={8}
        mb={6}
        fontSize="md"
        lineHeight="1.7"
        color="gray.700"
        fontStyle="italic"
        position="relative"
        zIndex="1"
      >
        {text}
      </Text>
  
      {/* Divider */}
      <Box
        w="40px"
        h="2px"
        bg="blue.100"
        mb={4}
      />
  
      {/* Author info */}
      <VStack align="flex-start" spacing={1}>
        <Text
          fontWeight="bold"
          color="#1a365d"
          fontSize="md"
        >
          {author}
        </Text>
        <Text
          color="gray.500"
          fontSize="sm"
        >
          {role}
        </Text>
      </VStack>
    </Box>
  );

  const TeamMember = ({ name, linkedin }) => (
    <Box
      bg="white"
      p={6}
      borderRadius="xl"
      boxShadow="0 4px 6px rgba(0, 0, 0, 0.05)"
      maxW="sm"
      transition="all 0.3s ease"
      _hover={{
        transform: 'translateY(-5px)',
        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
      }}
      textAlign="center"
    >
      {/* Name */}
      <VStack spacing={3} mb={4}>
        <Text
          fontWeight="bold"
          color="#1a365d"
          fontSize="xl"
        >
          {name}
        </Text>
      </VStack>

      {/* Social links */}
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
            _hover={{ bg: 'blue.50' }}
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
      <Box 
        w="full" 
        position="relative" 
        overflow="hidden"
        pb={20}
        pt={10}
        animation={`${fadeIn} 0.5s ease-out`}
      >
        <Container maxW="container.xl">
          <VStack spacing={8} align="center">
            <VStack spacing={4}>
              <Heading
                size="2xl"
                color="white"
                textAlign="center"
                fontWeight="bold"
                animation={`${fadeIn} 0.8s ease-out`}
                _hover={{ transform: 'scale(1.02)', transition: 'transform 0.3s' }}
              >
                MedVisor AI
              </Heading>
              <Text
                color="#FFFFFF"
                fontSize="2xl"
                textAlign="center"
                maxW="800px"
                fontWeight="medium"
                animation={`${fadeIn} 1s ease-out`}
              >
                Medical Image Analysis Powered by Artificial Intelligence
              </Text>
            </VStack>

            {/* Upload Card */}
            <Card
              bg="white"
              w="full"
              maxW="800px"
              borderRadius="2xl"
              boxShadow="2xl"
              overflow="hidden"
              animation={`${fadeIn} 1.2s ease-out`}
              transition="all 0.3s ease"
              _hover={{ transform: 'translateY(-2px)' }}
            >
              <CardBody p={8}>
                <VStack spacing={6}>
                  {!file ? (
                    <Box
                      w="100%"
                      h="300px"
                      border="3px dashed"
                      borderColor={isDragging ? "#5A6F6A" : "gray.200"}
                      borderRadius="xl"
                      transition="all 0.3s ease"
                      bg={isDragging ? "#f0f4f4" : "white"}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      _hover={{ 
                        borderColor: "#5A6F6A", 
                        bg: "#f0f4f4",
                        transform: 'scale(1.01)'
                      }}
                    >
                      <Center h="100%" flexDirection="column" p={4}>
                        <Icon 
                          as={MedicalUploadIcon} 
                          w={20} 
                          h={20} 
                          color="#5A6F6A"
                          stroke="currentColor"
                          strokeWidth={1.5}
                          fill="none"
                          mb={6}
                          animation={`${pulse} 2s infinite`}
                        />
                        <VStack spacing={4}>
                          <Text 
                            fontSize="2xl" 
                            fontWeight="medium" 
                            color="#1a365d"
                          >
                            Upload Your Medical Image
                          </Text>
                          <Text color="gray.500" fontSize="lg">
                            Drag and drop here or
                          </Text>
                          <Button
                            as="label"
                            htmlFor="file-upload"
                            bg="#1a365d"
                            color="white"
                            size="lg"
                            px={8}
                            height="56px"
                            fontSize="lg"
                            cursor="pointer"
                            transition="all 0.3s ease"
                            _hover={{ 
                              bg: "#2a4365",
                              transform: 'translateY(-2px)',
                              boxShadow: 'lg'
                            }}
                          >
                            Select File
                            <input
                              id="file-upload"
                              type="file"
                              accept="image/*"
                              onChange={handleFileSelect}
                              style={{ display: 'none' }}
                            />
                          </Button>
                          <Text 
                            fontSize="sm" 
                            color="gray.500" 
                            textAlign="center"
                          >
                            Supported formats: JPEG, PNG, DICOM
                          </Text>
                        </VStack>
                      </Center>
                    </Box>
                  ) : (
                    <Box w="100%">
                      <VStack spacing={4} align="stretch">
                        <HStack justify="space-between" align="center">
                          <HStack spacing={4}>
                            <Icon as={FiFile} w={6} h={6} color="#5A6F6A" />
                            <Text color="#1a365d" fontWeight="medium">
                              {file.name}
                            </Text>
                          </HStack>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={removeFile}
                            colorScheme="red"
                          >
                            <Icon as={FiX} />
                          </Button>
                        </HStack>
                        
                        <Center>
                          {loading ? (
                            <Flex
                              direction="column"
                              align="center"
                              justify="center"
                              height="300px"
                            >
                              <Spinner
                                thickness="4px"
                                speed="0.65s"
                                emptyColor="gray.200"
                                color="blue.500"
                                size="xl"
                              />
                              <Text mt={4} color="gray.500" fontSize="md">
                                Processing your image...
                              </Text>
                            </Flex>
                          ) : (
                            preview && (
                              <Box mt={8}>
                                <Heading size="md" color="#1a365d" textAlign="center" mb={4}>
                                  Processed Image with Detected Discs
                                </Heading>
                                <Image
                                  src={preview}
                                  alt="Processed Output"
                                  maxH="400px"
                                  objectFit="contain"
                                  borderRadius="lg"
                                  boxShadow="lg"
                                />
                              </Box>
                            )
                          )}
                        </Center>

                        {discImages.length > 0 && (
                          <Box mt={8}>
                            <Heading size="md" color="#1a365d" textAlign="center" mb={6}>
                              Individual Disc Analysis Results ({discImages.length} discs detected)
                            </Heading>
                            <Grid templateColumns="repeat(auto-fit, minmax(400px, 1fr))" gap={6}>
                              {discImages.map((disc, index) => (
                                <Card
                                  key={index}
                                  p={6}
                                  borderRadius="lg"
                                  boxShadow="md"
                                  bg="gray.50"
                                  transition="all 0.3s ease"
                                  _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                                >
                                  <VStack spacing={4} align="stretch">
                                    <Heading size="sm" color="#1a365d" textAlign="center">
                                      Disc {disc.disc_number}
                                    </Heading>
                                    
                                    {/* Individual disc image */}
                                    {disc.disc_image && (
                                      <Center>
                                        <Image
                                          src={disc.disc_image}
                                          alt={`Disc ${disc.disc_number}`}
                                          maxH="150px"
                                          objectFit="contain"
                                          borderRadius="md"
                                          border="2px solid"
                                          borderColor="gray.200"
                                        />
                                      </Center>
                                    )}
                                    
                                    {/* Predictions */}
                                    {disc.predictions && (
                                      <VStack spacing={2} align="stretch">
                                        <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                                          <Box>
                                            <Text fontSize="sm" fontWeight="bold" color="blue.600">
                                              Pfirrman Grade:
                                            </Text>
                                            <Badge colorScheme="blue" fontSize="sm">
                                              {formatPredictionValue(disc.predictions.pfirrman_grade, true)}
                                            </Badge>
                                          </Box>
                                          
                                          <Box>
                                            <Text fontSize="sm" fontWeight="bold" color="purple.600">
                                              Modic Changes:
                                            </Text>
                                            <Badge colorScheme="purple" fontSize="sm">
                                              {formatPredictionValue(disc.predictions.modic, true)}
                                            </Badge>
                                          </Box>
                                        </Grid>
                                        
                                        <Divider />
                                        
                                        <Text fontSize="sm" fontWeight="bold" color="gray.700">
                                          Pathology Scores:
                                        </Text>
                                        
                                        <Grid templateColumns="repeat(2, 1fr)" gap={2} fontSize="xs">
                                          <Text>
                                            <strong>Up Endplate:</strong> {formatPredictionValue(disc.predictions.up_endplate)}
                                          </Text>
                                          <Text>
                                            <strong>Low Endplate:</strong> {formatPredictionValue(disc.predictions.low_endplate)}
                                          </Text>
                                          <Text>
                                            <strong>Herniation:</strong> {formatPredictionValue(disc.predictions.disc_herniation)}
                                          </Text>
                                          <Text>
                                            <strong>Narrowing:</strong> {formatPredictionValue(disc.predictions.disc_narrowing)}
                                          </Text>
                                          <Text>
                                            <strong>Bulging:</strong> {formatPredictionValue(disc.predictions.disc_bulging)}
                                          </Text>
                                          <Text>
                                            <strong>Spondylolisthesis:</strong> {formatPredictionValue(disc.predictions.spondylilisthesis)}
                                          </Text>
                                        </Grid>
                                      </VStack>
                                    )}
                                  </VStack>
                                </Card>
                              ))}
                            </Grid>
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
            <VStack spacing={4}>
              <Heading 
                color="#1a365d" 
                size="xl" 
                textAlign="center"
                position="relative"
                _after={{
                  content: '""',
                  display: 'block',
                  width: '60px',
                  height: '4px',
                  background: 'linear-gradient(90deg, #90CDF4, #1a365d)',
                  margin: '0 auto',
                  marginTop: '20px',
                  borderRadius: 'full',
                }}
              >
                Meet Our Team
              </Heading>
            </VStack>

            {/* Team members grid */}
            <Grid
              templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
              gap={{ base: 8, md: 10 }}
              px={{ base: 4, md: 0 }}
            >
              <TeamMember
                name="Love Bhusal"
                linkedin="https://www.linkedin.com/in/love-bhusal/"
              />
              <TeamMember
                name="Tu Dao"
                linkedin="https://www.linkedin.com/in/tudao02/"
              />
              <TeamMember
                name="Elden Delguia"
                linkedin="https://www.linkedin.com/in/elden-deguia-84a68b325/"
              />
              <TeamMember
                name="Riley Mckinney"
                linkedin="https://www.linkedin.com/in/riley-mckinney/"
              />
              <TeamMember
                name="Sai Peram"
                linkedin="https://www.linkedin.com/in/sai-peram/"
              />
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