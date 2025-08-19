import React, { useState, useCallback } from 'react';
import ChatBot from './ChatBot';
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
import { FiFile, FiX, FiShield, FiCpu, FiActivity } from 'react-icons/fi';

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

  const handleFileUpload = (selectedFile) => {
    setFile(selectedFile);
    setDiscImages([]); // Clear old disc images
    setPreview(null); // Clear old preview image
    setLoading(true); // Start loading animation
  
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result); // Set temporary preview
    };
    reader.readAsDataURL(selectedFile);
  
    // Upload file to backend
    const formData = new FormData();
    formData.append('file', selectedFile);
  
    fetch('http://127.0.0.1:5000/upload', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.output_image_url) {
          toast({
            title: "Processing Successful",
            description: "The image has been processed.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
  
          // Set new preview and disc images
          setPreview(`http://127.0.0.1:5000${data.output_image_url}`);
          setDiscImages(
            data.disc_images.map((disc) => ({
              url: `http://127.0.0.1:5000${disc.url}`,
              message: disc.message,
            }))
          );
        } else {
          toast({
            title: "Processing Failed",
            description: "The server could not process the image.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
        toast({
          title: "Upload Failed",
          description: "There was an error uploading the image.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      })
      .finally(() => {
        setLoading(false); // Stop loading animation
      });
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
                color="#5A6F6A"
                fontSize="2xl"
                textAlign="center"
                maxW="800px"
                fontWeight="medium"
                animation={`${fadeIn} 1s ease-out`}
              >
                Advanced Medical Image Analysis Powered by Artificial Intelligence
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
                              height="300px" // Ensure it has a fixed height for vertical centering
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
                                  Processed Image
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
                            <Heading size="md" color="#1a365d" textAlign="center" mb={4}>
                              Extracted Disc Images
                            </Heading>
                            <Grid templateColumns="repeat(auto-fit, minmax(150px, 1fr))" gap={4}>
                            {discImages.map((disc, index) => (
                              <Flex
                                key={index}
                                direction="column"
                                align="center"
                                justify="center"
                                textAlign="center"
                                p={4}
                                borderRadius="md"
                                boxShadow="lg"
                                bg="white"
                              >
                                <Image
                                  src={disc.url}
                                  alt={`Disc Image ${index + 1}`}
                                  maxH="150px"
                                  objectFit="contain"
                                  borderRadius="lg"
                                  boxShadow="lg"
                                  mb={4} // Add space between the image and text
                                />
                                <Text color="gray.500" fontSize="sm" textAlign="center">
                                  {disc.message.split('\n').map((line, i) => (
                                    <span key={i}>
                                      {line}
                                      <br />
                                    </span>
                                  ))}
                                </Text>
                              </Flex>
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

      {/* Features Section */}
      <Box bg="white" py={20}>
        <Container maxW="container.xl">
          <VStack spacing={16}>
            <VStack spacing={4}>
              <Heading color="#1a365d" size="xl">
                Why Choose MedVisor?
              </Heading>
              <Text color="#5A6F6A" fontSize="lg" textAlign="center" maxW="600px">
                Advanced technology meets medical expertise for precise diagnosis
              </Text>
            </VStack>

            <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={8}>
              <GridItem>
                <FeatureCard
                  icon={FiShield}
                  title="Secure Analysis"
                  description="Your medical data is protected with enterprise-grade security and encryption"
                />
              </GridItem>
              <GridItem>
                <FeatureCard
                  icon={FiCpu}
                  title="AI-Powered"
                  description="State-of-the-art artificial intelligence for accurate medical image analysis"
                />
              </GridItem>
              <GridItem>
                <FeatureCard
                  icon={FiActivity}
                  title="Real-time Results"
                  description="Get instant insights and detailed analysis of your medical images"
                />
              </GridItem>
            </Grid>
          </VStack>
        </Container>
      </Box>

      <Box bg="gray.50" py={20}>
  <Container maxW="container.xl">
    <VStack spacing={12}>
      {/* Section heading with decorative element */}
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
          Trusted by Healthcare Professionals
        </Heading>
        <Text 
          color="gray.600" 
          textAlign="center" 
          maxW="2xl"
          fontSize="lg"
        >
          See what medical experts are saying about our platform
        </Text>
      </VStack>

      {/* Testimonial grid */}
      <Grid
        templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
        gap={{ base: 8, md: 10 }}
        px={{ base: 4, md: 0 }}
      >
        <Testimonial
          text="As a radiologist, I'm amazed by how this platform has enhanced our diagnostic capabilities. The accuracy and speed are remarkable."
          author="Dr. Sarah Chen"
          role="Radiologist"
        />
        <Testimonial
          text="This system has transformed our workflow. We can now provide faster and more accurate diagnoses to our patients."
          author="Dr. James Wilson"
          role="Medical Director"
        />
        <Testimonial
          text="The intuitive interface and reliable results make this an essential tool in our daily practice. Highly recommended."
          author="Dr. Maria Garcia"
          role="Chief Radiologist"
        />
      </Grid>
    </VStack>
  </Container>
</Box>

      {/* Stats Section */}
      <Box bg="#f8fafc" py={16}>
        <Container maxW="container.xl">
          <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={8} textAlign="center">
            <VStack>
              <Text color="#1a365d" fontSize="4xl" fontWeight="bold">99.9%</Text>
              <Text color="#5A6F6A" fontSize="lg">Accuracy Rate</Text>
            </VStack>
            <VStack>
              <Text color="#1a365d" fontSize="4xl" fontWeight="bold">1M+</Text>
              <Text color="#5A6F6A" fontSize="lg">Images Analyzed</Text>
            </VStack>
            <VStack>
              <Text color="#1a365d" fontSize="4xl" fontWeight="bold">24/7</Text>
              <Text color="#5A6F6A" fontSize="lg">Support Available</Text>
            </VStack>
          </Grid>
        </Container>
      </Box>
      <ChatBot />
    </Box>
  );
};

export default HomePage;
