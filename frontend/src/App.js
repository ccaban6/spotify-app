import React, { useState, useEffect } from "react";
import { ChakraProvider, Card, CardBody, Heading, Text, VStack, Image, Box, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";

function App() {
  const [data, setData] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/recents');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();
        setData(responseData);
      } catch (error) {
        console.error('Error fetching recent data:', error);
      }
    };

    fetchData();
  }, []);

  const handleCardClick = async (cardId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/recommendations/${cardId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log(responseData);
      setRecommendations(responseData);
      setSelectedCard(cardId);
    } catch (error) {
      console.error('Error fetching recommendation data:', error);
    }
  };

  const getTabContent = (tabIndex, recommendations) => {
    // Replace this with your logic to fetch content based on the selected card
    // For now, it just displays a placeholder message
    const selectedRecommendation = recommendations[tabIndex];
    return (
      <Box p={4}>
        {selectedCard && selectedRecommendation ? (
          <>
            <Card 
                colorScheme="green"
                direction={{ base: 'column', sm: 'row' }}
                _hover={{
                  background: 'gray.50'
                }}
                overflow='hidden'
                textOverflow="ellipsis"
                className="recommend-card"
            >
              <Image
                  src={selectedRecommendation.album.images[0].url}
                  maxW={{ base: '100%', sm: '200px' }}
                  objectFit='cover'
                  alt='Album Cover'
                />

                <CardBody>
                  <Heading size='xs' textTransform='uppercase'>
                    Artist
                  </Heading>
                  <Text overflow="hidden" textOverflow="ellipsis">
                    {selectedRecommendation.artists[0].name}
                  </Text>
                  <Heading size='xs' textTransform='uppercase' pt={3}>
                    Song
                  </Heading>
                  <Text overflow="hidden" textOverflow="ellipsis">
                    {selectedRecommendation.name}
                  </Text>
                </CardBody>
            </Card>
          </>
        ) : (
          <Text>Select a card to view content.</Text>
        )}
      </Box>
    );
  };

  return (
    <ChakraProvider>
      <div className="container">
        <div className="LeftPanel">
          <VStack pt="20px" pb="20px">
            {data.map(item => (
              <Card
                key={item.id}
                colorScheme="green"
                direction={{ base: 'column', sm: 'row' }}
                _hover={{
                  background: 'gray.50'
                }}
                overflow='hidden'
                textOverflow="ellipsis"
                className="recent-card"
                onClick={() => handleCardClick(item.id)}
              >
                <Image
                  src={item.album.images[0].url}
                  maxW={{ base: '100%', sm: '200px' }}
                  objectFit='cover'
                  alt='Album Cover'
                />

                <CardBody>
                  <Heading size='xs' textTransform='uppercase'>
                    Artist
                  </Heading>
                  <Text overflow="hidden" textOverflow="ellipsis">
                    {item.artists[0].name}
                  </Text>
                  <Heading size='xs' textTransform='uppercase' pt={3}>
                    Song
                  </Heading>
                  <Text overflow="hidden" textOverflow="ellipsis">
                    {item.name}
                  </Text>
                </CardBody>
              </Card>
            ))}
          </VStack>
          
        </div>
        <div className="Frame2">
                  <div className="recentlyPlayed">RECENTLY PLAYED</div>
                </div>
        <div className="RightPanel">
          <div className="RecommendedTracks">RECOMMENDED TRACKS</div>
          <Tabs isFitted variant="enclosed" colorScheme="teal" className="tabs">
            <TabList>
              <Tab>Tab 1</Tab>
              <Tab>Tab 2</Tab>
              <Tab>Tab 3</Tab>
              <Tab>Tab 4</Tab>
              <Tab>Tab 5</Tab>
            </TabList>
            <TabPanels>
              {[0, 1, 2, 3, 4].map((tabIndex) => (
              <TabPanel key={tabIndex}>{getTabContent(tabIndex, recommendations)}</TabPanel>
              ))}
          </TabPanels>
          </Tabs>
        </div>
      </div>
    </ChakraProvider>
  );
}

export default App;
