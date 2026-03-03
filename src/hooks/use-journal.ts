import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface PinItem {
  id: string;
  type: "note" | "photo" | "mood" | "moment";
  content: string;
  caption?: string;
  tags: string[];
  checklist?: { text: string; checked: boolean }[];
  mood?: string;
  createdAt: number;
  archived: boolean;
  visibility: "public" | "private";
}

export interface ChatMessage {
  id: string;
  name: string;
  message: string;
  createdAt: number;
  isOwner?: boolean;
}

export function useJournalEntries() {
  const [pins, setPins] = useState<PinItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPins = useCallback(async () => {
    const { data, error } = await supabase
      .from("journal_entries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching journal entries:", error);
      return;
    }

    const mapped: PinItem[] = (data || []).map((row: any) => ({
      id: row.id,
      type: row.type,
      content: row.content,
      caption: row.caption,
      tags: row.tags || [],
      checklist: row.checklist as any,
      mood: row.mood,
      createdAt: new Date(row.created_at).getTime(),
      archived: row.archived,
      visibility: row.visibility,
    }));

    setPins(mapped);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPins();
  }, [fetchPins]);

  const addPin = useCallback(async (pin: Omit<PinItem, "id" | "createdAt">) => {
    const { data, error } = await supabase
      .from("journal_entries")
      .insert({
        type: pin.type,
        content: pin.content,
        caption: pin.caption || null,
        tags: pin.tags,
        checklist: pin.checklist as any || null,
        mood: pin.mood || null,
        visibility: pin.visibility,
        archived: pin.archived,
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding journal entry:", error);
      return;
    }

    if (data) {
      const newPin: PinItem = {
        id: data.id,
        type: data.type as PinItem["type"],
        content: data.content,
        caption: data.caption || undefined,
        tags: data.tags || [],
        checklist: data.checklist as any,
        mood: data.mood || undefined,
        createdAt: new Date(data.created_at).getTime(),
        archived: data.archived,
        visibility: data.visibility as PinItem["visibility"],
      };
      setPins((prev) => [newPin, ...prev]);
    }
  }, []);

  const updatePin = useCallback(async (id: string, updates: Partial<PinItem>) => {
    const dbUpdates: any = {};
    if (updates.content !== undefined) dbUpdates.content = updates.content;
    if (updates.caption !== undefined) dbUpdates.caption = updates.caption;
    if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
    if (updates.checklist !== undefined) dbUpdates.checklist = updates.checklist;
    if (updates.archived !== undefined) dbUpdates.archived = updates.archived;
    if (updates.visibility !== undefined) dbUpdates.visibility = updates.visibility;

    const { error } = await supabase
      .from("journal_entries")
      .update(dbUpdates)
      .eq("id", id);

    if (error) {
      console.error("Error updating journal entry:", error);
      return;
    }

    setPins((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  }, []);

  const deletePin = useCallback(async (id: string) => {
    const { error } = await supabase
      .from("journal_entries")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting journal entry:", error);
      return;
    }

    setPins((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return { pins, setPins, loading, addPin, updatePin, deletePin, refetch: fetchPins };
}

export function useChatMessages() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching chat messages:", error);
      return;
    }

    const mapped: ChatMessage[] = (data || []).map((row: any) => ({
      id: row.id,
      name: row.name,
      message: row.message,
      createdAt: new Date(row.created_at).getTime(),
      isOwner: row.is_owner,
    }));

    setChatMessages(mapped);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const sendMessage = useCallback(async (name: string, message: string, isOwner = false) => {
    const { data, error } = await supabase
      .from("chat_messages")
      .insert({ name, message, is_owner: isOwner })
      .select()
      .single();

    if (error) {
      console.error("Error sending chat message:", error);
      return;
    }

    if (data) {
      const newMsg: ChatMessage = {
        id: data.id,
        name: data.name,
        message: data.message,
        createdAt: new Date(data.created_at).getTime(),
        isOwner: data.is_owner,
      };
      setChatMessages((prev) => [...prev, newMsg]);
    }
  }, []);

  return { chatMessages, loading, sendMessage, refetch: fetchMessages };
}
