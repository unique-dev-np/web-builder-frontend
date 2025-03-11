import { ReactNode } from "react";

export interface ProjectMeta {
  id: string;
  name: string;
}

export interface SidebarActionItemsProps {
  type: "create-conversation" | "settings";
  className?: string;
}

export interface SidebarProjectItemsProps {
  projectMetas: ProjectMeta[];
  className?: string;
}

// Chat types
export interface UserMessageType {
  id: string;
  role: "user";
  content: string;
}

export type MessageStream = ServerStreamCompleted | ServerStreamUpdate;

export interface ServerStreamCompleted {
  type: "stream";
  status: "completed";
  artifact: Artifact;
}

export interface ServerStreamUpdate {
  type: string;
  status: "update";
  action?: string;
  filePath?: string;
}

export interface Artifact {
  title: string | null;
  id: string;
  response: string;
}

export interface ServerMessageType {
  id: string;
  role: "assistant";
  content: string;
  responseStream: MessageStream[];
}

export type Message = UserMessageType | ServerMessageType;

export interface Conversation {
  id: string | null;
  title: string | null;
  history: Message[];
}

export interface UserMessageProps {
  content: string;
}

export interface ServerMessageProps {
  contents: MessageStream[];
}

// Common props that can be shared across components
export interface BaseProps {
  className?: string;
  children?: ReactNode;
}

export interface ChatInputBoxProps extends BaseProps {
  onSubmit?: (message: string) => void;
}
