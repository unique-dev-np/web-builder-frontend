"use client";

import { useEffect, useRef } from "react";
import {
  Conversation,
  UserMessageProps,
  ServerMessageProps,
  MessageStream,
} from "../types";

function ChatBox({ conversation }: { conversation: Conversation }) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation.history]); // Scroll when history changes

  return (
    <div className="px-[10vw] mx-auto h-full pt-10 pb-96 overflow-y-auto overflow-x-hidden">
      {conversation.history.map((msg) =>
        msg.role === "user" ? (
          <UserMessage key={msg.id} content={msg.content} />
        ) : (
          <ServerMessageStream key={msg.id} contents={msg.responseStream} />
        )
      )}
      {/* Scroll anchor */}
      <div ref={messagesEndRef} className="float-right clear-both" />
    </div>
  );
}

function UserMessage({ content }: UserMessageProps) {
  return (
    <div className="float-right clear-both py-4 px-4 bg-foreground/10 rounded-md my-2 max-w-[40%] text-sm">
      {content}
    </div>
  );
}

function ServerMessageStream({ contents }: ServerMessageProps) {
  function isStreamCompleted(contents: MessageStream[]): boolean {
    return contents.some((content) => content.status === "completed");
  }

  // If stream is completed, show only the final message
  if (isStreamCompleted(contents)) {
    const completedContent = contents.find(
      (content) => content.status === "completed"
    );
    if (!completedContent) return null;

    return (
      <div className="z-0 float-left clear-both my-6 p-4 bg-gray-800 rounded-md max-w-[40%] text-sm ">
        <div className="flex items-start gap-2">
          <div className="text-green-500">✓</div>
          <div className="flex flex-col">
            {completedContent.artifact.title && (
              <div className="text-gray-400 mb-1">
                {completedContent.artifact.title}
              </div>
            )}
            <div className="whitespace-pre-wrap">
              {completedContent.artifact.response}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="z-0 float-left clear-both my-6 p-4 bg-gray-800 rounded-md max-w-[60%] text-sm">
      {contents.map((content, index) => {
        if (content.status === "update") {
          return (
            <div key={index} className="flex items-start gap-2 mb-2">
              <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent" />
              <div className="flex flex-col">
                <div className="text-gray-400">{content.type}</div>
                {content.action && (
                  <div className="text-gray-300">{content.action}</div>
                )}
                {content.filePath && (
                  <div className="text-blue-400">{content.filePath}</div>
                )}
              </div>
            </div>
          );
        } else if (content.status === "completed") {
          return (
            <div key={index} className="flex items-start gap-2">
              <div className="text-green-500">✓</div>
              <div className="flex flex-col">
                {content.artifact.title && (
                  <div className="text-gray-400 mb-1">
                    {content.artifact.title}
                  </div>
                )}
                <div className="whitespace-pre-wrap">
                  {content.artifact.response}
                </div>
              </div>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

export default ChatBox;
