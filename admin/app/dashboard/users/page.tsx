"use client";

import { useState, useEffect } from "react";

import axios from "@/lib/axios";
import { formatDate } from "@/lib/time";

import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableCaption,
  TableHeader,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
} from "@/components/ui/table";
import { AlertDialogBox } from "@/components/alert-dialog";

import { Loader2 } from "lucide-react";

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
      <h2 className="text-4xl">Registered users</h2>

      {users?.length > 0 ? (
        <Table className="my-5">
          <TableCaption>List of all regsitered users</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user._id}</TableCell>
                <TableCell className="flex flex-row items-center gap-2">
                  <img
                    src={user.avatar}
                    className="w-8 h-8 rounded-full"
                    alt={user.name}
                  />
                  <div>{user.name}</div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
                <Button>View</Button>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="font-bold my-5 text-center">No users</div>
      )}
    </div>
  );
}
