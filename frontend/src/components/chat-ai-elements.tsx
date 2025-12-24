import { useState } from "react";
import { useChat, fetchServerSentEvents } from "@tanstack/ai-react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
  MessageActions,
  MessageAction,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTools,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { CopyIcon, RefreshCcwIcon } from "lucide-react";

export function Chat() {
  const [input, setInput] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL!;

  const { messages, sendMessage, isLoading } = useChat({
    connection: fetchServerSentEvents(`${apiUrl}/api/chat`),
  });

  function handleSubmit(message: PromptInputMessage) {
    if (message.text) {
      sendMessage(message.text);
      setInput("");
    }
  }

  const status = isLoading ? "submitted" : "idle";

  return (
    <div className="max-w-4xl mx-auto relative size-full h-screen">
      <div className="flex flex-col h-full">
        <Conversation className="h-full">
          <ConversationContent>
            {messages.map((message) => (
              <div key={message.id}>
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case "text":
                      return (
                        <Message key={`${message.id}-${i}`} from={message.role}>
                          <MessageContent>
                            <MessageResponse>{part.content}</MessageResponse>
                          </MessageContent>
                          {message.role === "assistant" && (
                            <MessageActions>
                              <MessageAction
                                onClick={() => {
                                  // Regenerate functionality could be added here
                                  console.log("Regenerate not yet implemented");
                                }}
                                label="Retry"
                                tooltip="Retry"
                              >
                                <RefreshCcwIcon className="size-3" />
                              </MessageAction>
                              <MessageAction
                                onClick={() =>
                                  navigator.clipboard.writeText(part.content)
                                }
                                label="Copy"
                                tooltip="Copy"
                              >
                                <CopyIcon className="size-3" />
                              </MessageAction>
                            </MessageActions>
                          )}
                        </Message>
                      );
                    case "thinking":
                      return (
                        <Message key={`${message.id}-${i}`} from={message.role}>
                          <MessageContent>
                            <div className="text-sm text-muted-foreground italic">
                              💭 Thinking: {part.content}
                            </div>
                          </MessageContent>
                        </Message>
                      );
                    default:
                      return null;
                  }
                })}
              </div>
            ))}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <PromptInput onSubmit={handleSubmit} className="mb-4">
          <PromptInputBody>
            <PromptInputTextarea
              onChange={(e) => setInput(e.target.value)}
              value={input}
              placeholder="Type a message..."
            />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools>{/* Add tools here if needed */}</PromptInputTools>
            <PromptInputSubmit disabled={!input && !status} status={status} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}
