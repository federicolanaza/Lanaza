
"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserRole = 'Admin' | 'Visitor'

export interface User {
  id: string
  name: string
  email: string
  studentId?: string
  role: UserRole
  isBlocked: boolean
}

export interface VisitRecord {
  id: string
  timestamp: string
  userEmail: string
  userName: string
  studentId?: string
  department: string
  reasonForVisit: string
}

interface VirtuLibState {
  currentUser: User | null
  users: User[]
  visits: VisitRecord[]
  login: (email: string, name?: string, studentId?: string) => void
  logout: () => void
  addVisit: (visit: Omit<VisitRecord, 'id' | 'timestamp' | 'userEmail' | 'userName' | 'studentId'>) => void
  toggleBlockUser: (userId: string) => void
}

const DEFAULT_USERS: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@neu.edu.ph', role: 'Admin', isBlocked: false },
]

export const useStore = create<VirtuLibState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: DEFAULT_USERS,
      visits: [],
      login: (email: string, name?: string, studentId?: string) => {
        const user = get().users.find(u => u.email === email)
        if (user) {
          if (user.isBlocked) {
            throw new Error('This account has been blocked.')
          }
          set({ currentUser: user })
        } else {
          // If user doesn't exist, create a new visitor with the provided info
          const newUser: User = {
            id: Math.random().toString(36).substr(2, 9),
            name: name || email.split('@')[0],
            email,
            studentId: studentId || 'N/A',
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
          userName: state.currentUser.name,
          studentId: state.currentUser.studentId
        }
        return { visits: [newVisit, ...state.visits] }
      }),
      toggleBlockUser: (userId) => set(state => ({
        users: state.users.map(u => u.id === userId ? { ...u, isBlocked: !u.isBlocked } : u)
      }))
    }),
    {
      name: 'virtulib-storage',
    }
  )
)
