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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { CopyIcon, RefreshCcwIcon } from "lucide-react";
import { tools } from "@/agent/tools";

export function Chat() {
  const [input, setInput] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL!;

  const { messages, sendMessage, isLoading, addToolApprovalResponse } = useChat({
    connection: fetchServerSentEvents(`${apiUrl}/api/chat`),
    tools,
  });

  function handleSubmit(message: PromptInputMessage) {
    if (message.text) {
      sendMessage(message.text);
      setInput("");
    }
  }

  const status = isLoading ? "streaming" : undefined;

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
                            <div className="text-muted-foreground">
                              Thinking: {part.content}
                            </div>
                          </MessageContent>
                        </Message>
                      );

                    case "tool-call":
                      if (part.state === "approval-requested") {
                        return (
                          <Message key={part.id} from={message.role}>
                            <MessageContent>
                              <Card className="m-0.5">
                                <CardHeader>
                                  <CardTitle>Approve: {part.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <Field>
                                    <Label>Arguments</Label>
                                    <pre className="text-xs bg-background rounded p-2 border overflow-x-auto"><code>{JSON.stringify(part.arguments, null, 2)}</code></pre>
                                  </Field>
                                  <div className="flex gap-3 mt-5">
                                    <Button
                                      variant="default"
                                      onClick={() =>
                                        addToolApprovalResponse({
                                          id: part.approval.id,
                                          approved: true,
                                        })
                                      }
                                    >
                                      Approve
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      onClick={() =>
                                        addToolApprovalResponse({
                                          id: part.approval.id,
                                          approved: false,
                                        })
                                      }
                                    >
                                      Deny
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            </MessageContent>
                          </Message>
                        );
                      }

                      return (
                        <Message key={part.id} from={message.role}>
                          <MessageContent>
                            <div className="rounded-lg px-3 py-1 mb-2 bg-muted">
                              <div className="font-medium">{part.name}</div>
                            </div>
                          </MessageContent>
                        </Message>
                      );

                    case "tool-result":
                      return (
                        <Message key={part.toolCallId} from={message.role}>
                          <MessageContent>
                            <div className="rounded-lg px-3 py-1 mb-2 bg-muted">
                              {part.state === "complete" && (
                                <div className="text-green-600">
                                  Completed
                                </div>
                              )}
                              {part.state === "error" && (
                                <div className="text-red-600">
                                  Error: {part.error}
                                </div>
                              )}
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
