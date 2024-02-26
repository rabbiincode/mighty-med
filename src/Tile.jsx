/* eslint-disable react/prop-types */
import { Box } from "@chakra-ui/react";

export function Tile({ content: Content, flip, state }) {
  switch (state) {
    case "start":
      return (
        <Box
          onClick={flip}
          display="inline-block"
          width={24}
          height={24}
          textAlign="center"
          bg="green.300"
          rounded={"2xl"}
        >
          {/* ? */}
        </Box>
      );
    case "flipped":
      return (
        <Box
          display="inline-block"
          width={24}
          height={24}
          textAlign="center"
          bg="green.500"
          color={'white'}
          rounded={'2xl'}
          p={3}
        >
          <Content
            style={{
              display: "inline-block",
              width: "100%",
              height: "100%",
              verticalAlign: "top",
            }}
          />
        </Box>
      );
    case "matched":
      return (
        <Box
          display="inline-block"
          width={24}
          height={24}
          textAlign="center"
          color="green.100"
          rounded={'2xl'}
        >
          <Content
            style={{
              display: "inline-block",
              width: "100%",
              height: "100%",
              verticalAlign: "top",
            }}
          />
        </Box>
      );
    default:
      throw new Error("Invalid state " + state);
  }
}
