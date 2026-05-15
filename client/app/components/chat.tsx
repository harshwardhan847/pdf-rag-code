"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, SendHorizontal } from "lucide-react";
import * as React from "react";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

interface Doc {
  pageContent?: string;
  metadata?: {
    loc?: {
      pageNumber?: number;
    };
    source?: string;
  };
}
interface IMessage {
  role: "assistant" | "user";
  content?: string;
  documents?: Doc[];
}

const ChatComponent: React.FC = () => {
  const [message, setMessage] = React.useState<string>("");
  const [messages, setMessages] = React.useState<IMessage[]>([]);
  const [isSending, setIsSending] = React.useState<boolean>(false);

  const scrollAreaRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendChatMessage = async () => {
    const userMessage = message.trim();
    if (!userMessage || isSending) {
      return;
    }

    setIsSending(true);
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setMessage("");

    try {
      const res = await fetch(
        `http://localhost:8000/chat?message=${encodeURIComponent(userMessage)}`,
      );
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data?.message ?? "No response received.",
          documents: data?.docs,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong while fetching a response.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex h-full min-h-[28rem] flex-col rounded-3xl border border-border/70 bg-card p-4 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.18)] md:p-6">
      <div className="mb-4 flex items-center justify-between border-b border-border pb-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Assistant
          </p>
          <h2 className="mt-1 text-xl font-semibold text-foreground md:text-2xl">
            Ask About Your PDF
          </h2>
        </div>
      </div>

      <div
        ref={scrollAreaRef}
        className="flex-1 space-y-4 overflow-y-auto rounded-2xl bg-secondary p-3 md:p-4"
      >
        {messages.length === 0 ? (
          <div className="flex h-full min-h-52 items-center justify-center rounded-xl border border-dashed border-border bg-background/70 p-6 text-center text-sm text-muted-foreground">
            Upload a document, then ask a question to start the conversation.
          </div>
        ) : null}

        {messages.map((message, index) => (
          <article
            key={index}
            className={`max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-relaxed md:max-w-[80%] ${
              message.role === "user"
                ? "ml-auto bg-primary text-primary-foreground"
                : "mr-auto bg-background text-foreground"
            }`}
          >
            {message.role === "assistant" ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSanitize]}

                // className="chat-markdown"
              >
                {message.content ?? ""}
              </ReactMarkdown>
            ) : (
              <p className="whitespace-pre-wrap">{message.content}</p>
            )}

            {message.role === "assistant" && message.documents?.length ? (
              <div className="mt-3 border-t border-border pt-3">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  Retrieved Context
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {message.documents.slice(0, 3).map((doc, docIndex) => (
                    <span
                      key={`${doc.metadata?.source ?? "source"}-${docIndex}`}
                      className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground"
                    >
                      {doc.metadata?.source
                        ? doc.metadata.source.split("/").pop()
                        : "Document"}
                      {doc.metadata?.loc?.pageNumber
                        ? ` • Page ${doc.metadata.loc.pageNumber}`
                        : ""}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </article>
        ))}

        {isSending ? (
          <div className="mr-auto inline-flex items-center gap-2 rounded-2xl bg-background px-4 py-3 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Thinking...
          </div>
        ) : null}
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask a question about the uploaded PDF..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendChatMessage();
            }
          }}
          disabled={isSending}
        />
        <Button
          onClick={handleSendChatMessage}
          disabled={!message.trim() || isSending}
          className="sm:w-auto"
        >
          {isSending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending
            </>
          ) : (
            <>
              <SendHorizontal className="h-4 w-4" />
              Send
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
export default ChatComponent;
