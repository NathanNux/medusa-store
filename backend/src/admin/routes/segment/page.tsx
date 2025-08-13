import { defineRouteConfig } from "@medusajs/admin-sdk";
import Segment from "../../../icons/segment-icon";
import {
  Button,
  Container,
  Heading,
} from "@medusajs/ui";

const SanityRoute = () => {
  return (
    <>
      <Container className="flex flex-col p-0 overflow-hidden">
        <div className="p-6 flex justify-between">
          <Heading className="font-sans font-medium h1-core">
            Segment Analytics
          </Heading>
          <div className="flex items-center gap-2">
            <a href="https://app.segment.com/matej-forejt/home"
              // WIP: update latter with the actual URL of the Segment account used in the project
                target="_blank"
                rel="noopener noreferrer"
            >
              <Button variant="secondary" size="small">
                Otevřít Segment
              </Button>
            </a>
          </div>
        </div>
      </Container>
    </>
  );
};

export const config = defineRouteConfig({
  label: "Segment Analytics",
  icon: Segment,
});

export default SanityRoute;
