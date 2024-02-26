/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import confetti from "canvas-confetti";
import * as icons from "react-icons/gi";
import { Box, Button, Flex, Grid, Text } from "@chakra-ui/react";
import { Tile } from "./Tile";

export const possibleTileContents = [
  icons.GiHearts,
  icons.GiWaterDrop,
  icons.GiDiceSixFacesFive,
  icons.GiUmbrella,
  icons.GiCube,
  icons.GiBeachBall,
  icons.GiDragonfly,
  icons.GiHummingbird,
  icons.GiFlowerEmblem,
  icons.GiOpenBook,
];

export function StartScreen({ start }) {
  return (
    <Flex justify="center" align="center" fontSize={"2xl"} h={"100vh"}>
      <Flex
        bg={"teal.50"}
        color={"teal.500"}
        direction={"column"}
        gap={8}
        textAlign={"center"}
        fontSize={"xl"}
        rounded={"2xl"}
        px={24}
        py={40}
      >
        <Text fontWeight="bold" fontSize={"4xl"}>
          Memory
        </Text>
        <Text>Flip over tiles looking for pairs</Text>
        <Button
          onClick={start}
          bg={"teal.500"}
          color={"white"}
          fontWeight={"medium"}
          width={"fit-content"}
          margin={"auto"}
          fontSize={"xl"}
          px={14}
          py={6}
          mt={4}
          rounded={"3xl"}
          _hover={{ bg: "teal.400" }}
        >
          Play
        </Button>
      </Flex>
    </Flex>
  );
}

export function PlayScreen({ end }) {
  const [tiles, setTiles] = useState(null);
  const [tryCount, setTryCount] = useState(0);

  const getTiles = (tileCount) => {
    // Throw error if count is not even.
    if (tileCount % 2 !== 0) {
      throw new Error("The number of tiles must be even.");
    }

    // Use the existing list if it exists.
    if (tiles) return tiles;

    const pairCount = tileCount / 2;

    // Take only the items we need from the list of possibilities.
    const usedTileContents = possibleTileContents.slice(0, pairCount);

    // Double the array and shuffle it.
    const shuffledContents = usedTileContents
      .concat(usedTileContents)
      .sort(() => Math.random() - 0.5)
      .map((content) => ({ content, state: "start" }));

    setTiles(shuffledContents);
    return shuffledContents;
  };

  const flip = (i) => {
    // Is the tile already flipped? We don’t allow flipping it back.
    if (tiles[i].state === "flipped") return;

    // How many tiles are currently flipped?
    const flippedTiles = tiles.filter((tile) => tile.state === "flipped");
    const flippedCount = flippedTiles.length;

    // Don't allow more than 2 tiles to be flipped at once.
    if (flippedCount === 2) return;

    // On the second flip, check if the tiles match.
    if (flippedCount === 1) {
      setTryCount((c) => c + 1);

      const alreadyFlippedTile = flippedTiles[0];
      const justFlippedTile = tiles[i];

      let newState = "start";

      if (alreadyFlippedTile.content === justFlippedTile.content) {
        confetti();
        newState = "matched";
      }

      // After a delay, either flip the tiles back or mark them as matched.
      setTimeout(() => {
        setTiles((prevTiles) => {
          const newTiles = prevTiles.map((tile) => ({
            ...tile,
            state: tile.state === "flipped" ? newState : tile.state,
          }));

          // If all tiles are matched, the game is over.
          if (newTiles.every((tile) => tile.state === "matched")) {
            setTimeout(end, 0);
          }

          return newTiles;
        });
      }, 1000);
    }

    setTiles((prevTiles) => {
      return prevTiles.map((tile, index) => ({
        ...tile,
        state: i === index ? "flipped" : tile.state,
      }));
    });
  };

  return (
    <Flex direction={"column"} justify="center" align="center" h={"100vh"} gap={16}>
      <Text color={'green.500'}
        display={'flex'}
        gap={2}
        fontSize={'2xl'}
        fontWeight={'medium'}
      >
        Tries{' '}
        <Box bg={'green.200'} px={4} py={0} textAlign={'center'} rounded={'md'}>{tryCount}</Box>
      </Text>
      <Box bg={'gray.100'} p={4} rounded={'lg'}>
        <Grid templateColumns='repeat(4, 1fr)' gap={4}>
          {getTiles(16).map((tile, i) => (
            <Tile key={i} flip={() => flip(i)} {...tile} />
          ))}
        </Grid>
      </Box>
    </Flex>
  );
}
