"use client"

import { useState } from 'react'
import { User, useStore } from '@/lib/store'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, UserX, UserCheck, ShieldAlert } from 'lucide-react'

export function UserTable() {
  const { users, toggleBlockUser, currentUser } = useStore()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 max-w-md bg-card rounded-lg px-3 py-2 border shadow-sm">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search users by name or email..." 
          className="border-none shadow-none focus-visible:ring-0 h-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-semibold">User</TableHead>
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="font-semibold">Role</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'} className="rounded-md font-normal">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.isBlocked ? (
                      <Badge variant="destructive" className="rounded-md flex w-fit items-center gap-1">
                        <ShieldAlert className="h-3 w-3" />
                        Blocked
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="rounded-md text-green-600 border-green-200 bg-green-50 font-normal">
                        Active
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {user.id !== currentUser?.id && user.role !== 'Admin' ? (
                      <Button 
                        variant={user.isBlocked ? "outline" : "destructive"} 
                        size="sm"
                        onClick={() => toggleBlockUser(user.id)}
                        className="h-8"
                      >
                        {user.isBlocked ? (
                          <>
                            <UserCheck className="mr-2 h-4 w-4" />
                            Unblock
                          </>
                        ) : (
                          <>
                            <UserX className="mr-2 h-4 w-4" />
                            Block
                          </>
                        )}
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">System Protected</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No users found matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
