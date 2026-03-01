"use client";

import { useState, useEffect } from "react";

import axios from "@/lib/axios";
import { formatDate } from "@/lib/time";

import { toast } from "@/hooks/use-toast";
import {
  Table,
  TableCaption,
  TableHeader,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
} from "@/components/ui/table";

import { Loader2, Users } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function Page() {
  const [loading, setLoading] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);

  const [users, setUsers] = useState<any[]>([]);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`/api/admin/users?count=${count}`);

      if (data.success) setUsers(data.users);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error fetching users",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchUsers();
  }, [count]);

  return (
    <div className="py-5">
      <div className="page-header">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Registered Users</h2>
          <p className="text-muted-foreground mt-1">
            View and manage all registered customer accounts.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : users?.length > 0 ? (
        <div className="rounded-xl border bg-card overflow-hidden">
          <Table>
            <TableCaption className="pb-4">
              List of all registered users
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {user._id}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8 ring-2 ring-primary/10">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-gradient-to-br from-[#FF8A80] to-[#FF6B61] text-white text-xs font-bold">
                          {user.name?.charAt(0)?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(user.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="empty-state">
          <Users className="h-12 w-12 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold">No users found</h3>
          <p className="text-muted-foreground text-sm">
            There are no registered users yet.
          </p>
        </div>
      )}
    </div>
  );
}
