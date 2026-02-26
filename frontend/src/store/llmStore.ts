import { create } from 'zustand'
import type { ChatResponse, ChatRequest, Suggestion } from '../types/api'

interface LlmState {
  messages: ChatMessage[]
  currentSuggestion: Suggestion | null
  isLoading: boolean
  error: string | null
  
  addMessage: (role: 'user' | 'assistant', content: string) => void
  setSuggestions: (suggestions: Suggestion[]) => void
  clearTimeout: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearChat: () => void
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export const useLlmStore = create<LlmState>((set) => ({
  messages: [],
  currentSuggestion: null,
  isLoading: false,
  error: null,
  
  addMessage: (role, content) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: Date.now().toString(),
          role,
          content,
          timestamp: Date.now(),
        },
      ],
    })),
  
  setSuggestions: (suggestions) => {
    if (suggestions.length > 0) {
      set({ currentSuggestion: suggestions[0] })
    }
  },
  
  clearTimeout: () =>
    set({ currentSuggestion: null }),
  
  setLoading: (loading) =>
    set({ isLoading: loading }),
  
  setError: (error) =>
    set({ error }),
  
  clearChat: () =>
    set({ messages: [], currentSuggestion: null, error: null }),
}))
