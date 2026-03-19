"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserRole = 'Admin' | 'Visitor'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  isBlocked: boolean
}

export interface VisitRecord {
  id: string
  timestamp: string
  userEmail: string
  userName: string
  department: string
  reasonForVisit: string
}

interface LibreState {
  currentUser: User | null
  users: User[]
  visits: VisitRecord[]
  login: (email: string) => void
  logout: () => void
  addVisit: (visit: Omit<VisitRecord, 'id' | 'timestamp' | 'userEmail' | 'userName'>) => void
  toggleBlockUser: (userId: string) => void
}

const DEFAULT_USERS: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@neu.edu', role: 'Admin', isBlocked: false },
  { id: '2', name: 'John Doe', email: 'j.doe@neu.edu', role: 'Visitor', isBlocked: false },
  { id: '3', name: 'Jane Smith', email: 'j.smith@neu.edu', role: 'Visitor', isBlocked: false },
]

export const useStore = create<LibreState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: DEFAULT_USERS,
      visits: [],
      login: (email: string) => {
        const user = get().users.find(u => u.email === email)
        if (user) {
          if (user.isBlocked) {
            throw new Error('This account has been blocked.')
          }
          set({ currentUser: user })
        } else {
          // If user doesn't exist, create a new visitor
          const newUser: User = {
            id: Math.random().toString(36).substr(2, 9),
            name: email.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
            email,
            role: 'Visitor',
            isBlocked: false
          }
          set(state => ({
            users: [...state.users, newUser],
            currentUser: newUser
          }))
        }
      },
      logout: () => set({ currentUser: null }),
      addVisit: (visit) => set(state => {
        if (!state.currentUser) return state
        const newVisit: VisitRecord = {
          ...visit,
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString(),
          userEmail: state.currentUser.email,
          userName: state.currentUser.name
        }
        return { visits: [newVisit, ...state.visits] }
      }),
      toggleBlockUser: (userId) => set(state => ({
        users: state.users.map(u => u.id === userId ? { ...u, isBlocked: !u.isBlocked } : u)
      }))
    }),
    {
      name: 'libre-connect-storage',
    }
  )
)
