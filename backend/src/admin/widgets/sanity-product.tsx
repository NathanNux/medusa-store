import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { AdminProduct, DetailWidgetProps } from "@medusajs/types"
import { ArrowUpRightOnBox } from "@medusajs/icons";
import { Button, CodeBlock, Container, StatusBadge, toast } from "@medusajs/ui";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useSanityDocument,
  useTriggerSanityProductSync,
} from "../hooks/sanity";

const queryClientProvider = new QueryClient();

const ProductWidget = ({ data }: DetailWidgetProps<AdminProduct>) => {
  const { mutateAsync, isPending } = useTriggerSanityProductSync(data.id);
  const { sanity_document, studio_url, isLoading } = useSanityDocument(data.id);
  const [showCodeBlock, setShowCodeBlock] = useState(false);

  const handleSync = async () => {
    try {
      await mutateAsync(undefined);
      toast.success(`Sync triggered.`);
    } catch (err) {
      toast.error(`Couldn't trigger sync: ${
        (err as Record<string, unknown>).message
      }`);
    }
  };

  return (
    <QueryClientProvider client={queryClientProvider}>
      <Container>
        <div className="flex justify-between w-full items-center">
          <div className="flex gap-2 items-center">
            <h2>Sanity Status</h2>
            <div>
              {isLoading ? (
                "Loading..."
              ) : sanity_document?.title === data.title ? (
                <StatusBadge color="green">Synchronizováno</StatusBadge>
              ) : (
                <StatusBadge color="red">Nesynchronizováno</StatusBadge>
              )}
            </div>
          </div>
          <Button
            size="small"
            variant="secondary"
            onClick={handleSync}
            disabled={isPending}
          >
            Synchronizovat
          </Button>
        </div>
        <div className="mt-6">
          <div className="mb-4 flex gap-4">
            <Button
              size="small"
              variant="secondary"
              onClick={() => setShowCodeBlock(!showCodeBlock)}
            >
              {showCodeBlock ? "Hide" : "Show"} Sanity Dokument
            </Button>
            {studio_url && (
              <a href={studio_url} target="_blank" rel="noreferrer">
                <Button variant="transparent">
                  <ArrowUpRightOnBox /> Sanity Studio
                </Button>
              </a>
            )}
          </div>
          {!isLoading && showCodeBlock && (
            <CodeBlock
              className="dark"
              snippets={[
                {
                  language: "json",
                  label: "Sanity Document",
                  code: JSON.stringify(sanity_document, null, 2),
                },
              ]}
            >
              <CodeBlock.Body />
            </CodeBlock>
          )}
        </div>
      </Container>
    </QueryClientProvider>
  );
};

// The widget's configurations
export const config = defineWidgetConfig({
  zone: "product.details.after",
});

export default ProductWidget;
