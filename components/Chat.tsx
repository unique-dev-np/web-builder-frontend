"use client";

import {
  Conversation,
  Message,
  MessageStream,
  ServerMessageType,
  UserMessageType,
} from "@/types";
import ChatBox from "./ChatBox";
import ChatInputBox from "./ChatInputBox";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

function Chat() {
  const [conversation, setConversation] = useState<Conversation>({
    id: null,
    history: [],
    title: null,
  });

  console.log(conversation);

  // const handleSubmit = async (message: string) => {
  //   try {
  //     // Create a new message ID
  //     const messageId = `msg${conversation.history.length + 1}`;

  //     // Add user message to conversation
  //     const userMessage: Message = {
  //       id: messageId,
  //       role: "user",
  //       content: message,
  //     };

  //     // Add user message to conversation
  //     setConversation((prev) => ({
  //       ...prev,
  //       history: [...prev.history, userMessage],
  //     }));

  //     // Start the EventSource connection

  //     const eventSource = new EventSource(
  //       `${process.env.NEXT_PUBLIC_API_URL}/generate?${new URLSearchParams({
  //         prompt: message,
  //         conversationId: conversation.id || "",
  //         history: JSON.stringify(conversation.history),
  //         title: conversation.title || "",
  //       })}`
  //     );

  //     // Add initial server message
  //     const initialServerMessage: Message = {
  //       id: `${messageId}-response`,
  //       role: "assistant",
  //       content: "",
  //       responseStream: [
  //         {
  //           type: "stream",
  //           status: "generating",
  //           content: "",
  //         },
  //       ],
  //     };

  //     setConversation((prev) => ({
  //       ...prev,
  //       history: [...prev.history, initialServerMessage],
  //     }));

  //     // Handle incoming stream events
  //     eventSource.onmessage = (event) => {
  //       const data = JSON.parse(event.data);

  //       if (data.status === "update") {
  //         console.log(data);

  //         const updatedStream: MessageStream = {
  //           type: "stream",
  //           status: "generating",
  //           content: data.content,
  //         };

  //         setConversation((prev) => ({
  //           ...prev,
  //           history: prev.history.map((msg) =>
  //             msg.id === `${messageId}-response`
  //               ? {
  //                   ...msg,
  //                   content: [updatedStream],
  //                 }
  //               : msg
  //           ) as Message[],
  //         }));
  //       } else if (data.status === "completed") {
  //         console.log(data);

  //         const completedStream: MessageStream = {
  //           type: "stream",
  //           status: "completed",
  //           content: data.artifact.response,
  //         };

  //         setConversation((prev) => ({
  //           ...prev,
  //           id: data.artifact.id,
  //           title: data.artifact.title,
  //           history: prev.history.map((msg) =>
  //             msg.id === `${messageId}-response`
  //               ? {
  //                   ...msg,
  //                   content: completedStream,
  //                 }
  //               : msg
  //           ) as Message[],
  //         }));
  //         eventSource.close();
  //       } else if (data.status === "error") {
  //         console.error("Stream error:", data.error);
  //         eventSource.close();
  //       }
  //     };

  //     eventSource.onerror = (error) => {
  //       console.error("EventSource error:", error);
  //       eventSource.close();
  //     };
  //   } catch (error) {
  //     console.error("Failed to send message:", error);
  //   }
  // };

  const handleSubmit = async (message: string) => {
    try {
      // Create a new message ID
      const messageId = uuidv4();

      // Add user message to conversation
      setConversation((prev) => ({
        ...prev,
        history: [
          ...prev.history,
          {
            id: messageId,
            role: "user",
            content: message,
          } as UserMessageType,
          {
            id: `${messageId}-response`,
            role: "assistant",
            content: "",
            responseStream: [],
          } as ServerMessageType,
        ],
      }));

      // Server readable conversation
      const serverReadableConversation = {
        history: conversation.history.map((msg) => {
          if (msg.content === "") {
            return null;
          }
          return {
            role: msg.role,
            parts: [{ text: msg.content }],
          };
        }),
        title: conversation.title,
        id: conversation.id,
      };

      serverReadableConversation.history =
        serverReadableConversation.history.filter(
          (msg) => msg?.parts[0].text !== null
        );

      // Make POST request to generate endpoint
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Transfer-Encoding": "chunked",
          },
          body: JSON.stringify({
            prompt: message,
            conversation: serverReadableConversation,
          }),
        }
      );

      // Create reader from response body stream
      const reader = response.body?.getReader();
      if (!reader) throw new Error("Failed to create stream reader");

      // Read stream chunks
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Convert chunk to text
        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split("\n");

        // Process each line
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = JSON.parse(line.slice(5));

            if (data.status === "update") {
              const updatedStream: MessageStream = {
                type: "stream",
                status: "update",
                ...data,
              };

              setConversation((prev) => ({
                ...prev,
                history: prev.history.map((msg) =>
                  msg.id === `${messageId}-response` && msg.role === "assistant"
                    ? {
                        ...msg,
                        responseStream: [...msg.responseStream, updatedStream],
                      }
                    : msg
                ) as Message[],
              }));
            } else if (data.status === "completed") {
              const completedStream: MessageStream = {
                type: "stream",
                status: "completed",
                artifact: data.artifact,
              };

              setConversation((prev) => ({
                ...prev,
                id: data.artifact.id,
                title: data.artifact.title,
                history: prev.history.map((msg) =>
                  msg.id === `${messageId}-response` && msg.role === "assistant"
                    ? {
                        ...msg,
                        responseStream: [
                          ...msg.responseStream,
                          completedStream,
                        ],
                      }
                    : msg
                ) as Message[],
              }));
              break;
            } else if (data.type === "error") {
              console.error("Stream error:", data.error);
              break;
            }
          }
        }
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <>
      <ChatBox conversation={conversation} />
      <ChatInputBox onSubmit={handleSubmit} />
    </>
  );
}

export default Chat;
