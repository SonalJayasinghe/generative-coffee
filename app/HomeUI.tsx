"use client";

import { useEffect, useRef, useState } from "react";
import { AI, ClientMessage } from "./actions";
import { useActions, useUIState } from "ai/rsc";
import { nanoid } from "nanoid";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import ChatBubble from "@/components/chat-bubble";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function HomeUI() {
  const [input, setInput] = useState<string>("");
  const [conversation, setConversation] = useUIState();
  const { continueConversation } = useActions();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation]);

  return (
    <>
      <div className="flex items-center justify-center text-lg font-medium"> Sonal&apos;s Cafe</div>
      <div className="flex items-center justify-center p-4">
        <div className="border rounded-3xl w-full md:w-[850px]">
          <div
            ref={scrollRef}
            className="flex flex-col min-h-[600px] max-h-[600px] overflow-scroll pb-3"
          >
            {conversation.map((message: any) => (
              <div
                key={message.id}
                className={`flex w-full ${
                  message.role === "user" ? "justify-end" : ""
                }`}
              >
                <ChatBubble
                  key={message.id}
                  message={message.display}
                  sender={message.role}
                />
              </div>
            ))}
          </div>
        </div>

        <div
          className="fixed bottom-0 left-0 right-0 flex justify-center p-3"
          style={{ background: "white" }}
        >
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setInput("");
              setConversation((currentConversation: ClientMessage[]) => [
                ...currentConversation,
                { id: nanoid(), role: "user", display: input },
              ]);

              const message = await continueConversation(input);

              setConversation((currentConversation: ClientMessage[]) => [
                ...currentConversation,
                message,
              ]);
            }}
            className=" md:w-[850px] flex overflow-hidden border rounded-3xl bg-background"
          >
            <Label htmlFor="message" className="sr-only">
              Message
            </Label>
            <Textarea
              id="message"
              placeholder="Type your message here..."
              className="min-h-12 p-3 resize-none border-0 shadow-none focus-visible:ring-0"
              value={input}
              onChange={(event) => {
                setInput(event.target.value);
              }}
            />
            <div className="flex items-center pt-3 p-3">
              <Button
                type="submit"
                size="sm"
                className="ml-auto gap-1.5 rounded-3xl bg-green-900"
              >
                Send Message
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
