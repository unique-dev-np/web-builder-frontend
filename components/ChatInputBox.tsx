"use client";

import { FaPaperPlane, FaSpinner } from "react-icons/fa";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { ChatInputBoxProps } from "../types";
import { useState } from "react";

function ChatInputBox({ onSubmit, className }: ChatInputBoxProps) {
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (isSubmitting || !message.trim()) return;

    setIsSubmitting(true);
    onSubmit?.(message);
    setMessage("");

    // Add 500ms delay before allowing next submission
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSubmitting(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto bg-foreground/10 backdrop-brightness-0 rounded-t-md absolute z-50 bottom-0 left-0 right-0">
      <Textarea
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Give anything to build..."
        className="resize-none max-h-[20vh] rounded-none appearance-none outline-none border-none focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      <div className="actions flex justify-between">
        <div className="left"></div>
        <div className="right">
          <Button
            variant="outline"
            className="h-[50px] aspect-square rounded-full"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <FaSpinner className="size-5 animate-spin" />
            ) : (
              <FaPaperPlane className="size-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ChatInputBox;
