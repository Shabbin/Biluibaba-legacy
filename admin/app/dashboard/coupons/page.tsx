"use client";

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";

import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Ticket,
  Copy,
  Calendar,
  Percent,
  BadgeDollarSign,
} from "lucide-react";

import { toast } from "@/hooks/use-toast";
import axios from "@/lib/axios";
import { formatCurrency } from "@/lib/currency";

interface Coupon {
  _id: string;
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderAmount: number;
  maxDiscount: number | null;
  usageLimit: number | null;
  usedCount: number;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
}

const defaultForm = {
  code: "",
  description: "",
  discountType: "percentage" as "percentage" | "fixed",
  discountValue: 0,
  minOrderAmount: 0,
  maxDiscount: "",
  usageLimit: "",
  expiresAt: "",
  isActive: true,
};

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);

  const fetchCoupons = async () => {
    try {
      const { data } = await axios.get("/api/admin/coupons");
      if (data.success) setCoupons(data.coupons);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to fetch coupons",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const resetForm = () => {
    setForm(defaultForm);
    setEditingId(null);
  };

  const openCreate = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (coupon: Coupon) => {
    setEditingId(coupon._id);
    setForm({
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderAmount: coupon.minOrderAmount,
      maxDiscount: coupon.maxDiscount ? String(coupon.maxDiscount) : "",
      usageLimit: coupon.usageLimit ? String(coupon.usageLimit) : "",
      expiresAt: coupon.expiresAt
        ? new Date(coupon.expiresAt).toISOString().split("T")[0]
        : "",
      isActive: coupon.isActive,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.code || !form.discountValue) {
      return toast({
        title: "Error",
        description: "Code and discount value are required",
        variant: "destructive",
      });
    }

    setSaving(true);
    try {
      const payload = {
        code: form.code,
        description: form.description,
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        minOrderAmount: Number(form.minOrderAmount) || 0,
        maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
        expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
        isActive: form.isActive,
      };

      if (editingId) {
        const { data } = await axios.put(`/api/admin/coupons/${editingId}`, payload);
        if (data.success) {
          toast({ title: "Success", description: "Coupon updated successfully" });
          fetchCoupons();
        }
      } else {
        const { data } = await axios.post("/api/admin/coupons/create", payload);
        if (data.success) {
          toast({ title: "Success", description: "Coupon created successfully" });
          fetchCoupons();
        }
      }

      setDialogOpen(false);
      resetForm();
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error",
        description:
          error.response?.data?.error || "Failed to save coupon",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      const { data } = await axios.delete(`/api/admin/coupons/${id}`);
      if (data.success) {
        toast({ title: "Success", description: "Coupon deleted successfully" });
        fetchCoupons();
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to delete coupon",
        variant: "destructive",
      });
    } finally {
      setDeleting(null);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: "Copied!", description: `${code} copied to clipboard` });
  };

  return (
    <div className="p-6">
      <div className="page-header">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold tracking-tight">Coupons</h2>
          <p className="text-sm text-muted-foreground">
            Create and manage discount coupons for your store
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Create Coupon
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Coupon" : "Create Coupon"}
              </DialogTitle>
              <DialogDescription>
                {editingId
                  ? "Update coupon details below"
                  : "Fill in the details to create a new coupon"}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="code">Coupon Code *</Label>
                <Input
                  id="code"
                  placeholder="e.g. SAVE20"
                  value={form.code}
                  onChange={(e) =>
                    setForm({ ...form, code: e.target.value.toUpperCase() })
                  }
                  className="uppercase"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="e.g. Get 20% off on all products"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Discount Type *</Label>
                  <Select
                    value={form.discountType}
                    onValueChange={(v) =>
                      setForm({
                        ...form,
                        discountType: v as "percentage" | "fixed",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed Amount (৳)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="discountValue">
                    Discount Value *{" "}
                    {form.discountType === "percentage" ? "(%)" : "(৳)"}
                  </Label>
                  <Input
                    id="discountValue"
                    type="number"
                    min={0}
                    max={form.discountType === "percentage" ? 100 : undefined}
                    value={form.discountValue}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        discountValue: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="minOrderAmount">Min Order Amount (৳)</Label>
                  <Input
                    id="minOrderAmount"
                    type="number"
                    min={0}
                    value={form.minOrderAmount}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        minOrderAmount: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="maxDiscount">Max Discount (৳)</Label>
                  <Input
                    id="maxDiscount"
                    type="number"
                    min={0}
                    placeholder="No limit"
                    value={form.maxDiscount}
                    onChange={(e) =>
                      setForm({ ...form, maxDiscount: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="usageLimit">Usage Limit</Label>
                  <Input
                    id="usageLimit"
                    type="number"
                    min={0}
                    placeholder="Unlimited"
                    value={form.usageLimit}
                    onChange={(e) =>
                      setForm({ ...form, usageLimit: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="expiresAt">Expiry Date</Label>
                  <Input
                    id="expiresAt"
                    type="date"
                    value={form.expiresAt}
                    onChange={(e) =>
                      setForm({ ...form, expiresAt: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  role="switch"
                  aria-checked={form.isActive}
                  onClick={() => setForm({ ...form, isActive: !form.isActive })}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors ${
                    form.isActive ? "bg-primary" : "bg-input"
                  }`}
                >
                  <span
                    className={`pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform ${
                      form.isActive ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setDialogOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={saving}>
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editingId ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : coupons.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Ticket className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground">
            No coupons yet
          </h3>
          <p className="text-sm text-muted-foreground/70 mb-4">
            Create your first coupon to offer discounts to customers
          </p>
          <Button onClick={openCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Create Coupon
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border bg-card mt-6 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Min Order</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.map((coupon) => {
                const isExpired =
                  coupon.expiresAt && new Date(coupon.expiresAt) < new Date();
                const isOverLimit =
                  coupon.usageLimit !== null &&
                  coupon.usedCount >= coupon.usageLimit;

                return (
                  <TableRow key={coupon._id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="bg-muted px-2 py-1 rounded text-sm font-mono font-semibold">
                          {coupon.code}
                        </code>
                        <button
                          onClick={() => copyCode(coupon.code)}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {coupon.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {coupon.description}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {coupon.discountType === "percentage" ? (
                          <>
                            <Percent className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="font-semibold">
                              {coupon.discountValue}%
                            </span>
                            {coupon.maxDiscount && (
                              <span className="text-xs text-muted-foreground">
                                (max ৳{formatCurrency(coupon.maxDiscount)})
                              </span>
                            )}
                          </>
                        ) : (
                          <>
                            <BadgeDollarSign className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="font-semibold">
                              ৳{formatCurrency(coupon.discountValue)}
                            </span>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {coupon.minOrderAmount > 0
                        ? `৳${formatCurrency(coupon.minOrderAmount)}`
                        : "None"}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{coupon.usedCount}</span>
                      {coupon.usageLimit !== null && (
                        <span className="text-muted-foreground">
                          /{coupon.usageLimit}
                        </span>
                      )}
                      {coupon.usageLimit === null && (
                        <span className="text-xs text-muted-foreground ml-1">
                          (unlimited)
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {coupon.expiresAt ? (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                          <span
                            className={
                              isExpired ? "text-red-500" : "text-foreground"
                            }
                          >
                            {new Date(coupon.expiresAt).toLocaleDateString(
                              "en-GB"
                            )}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          No expiry
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {!coupon.isActive ? (
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-700">
                          Inactive
                        </span>
                      ) : isExpired ? (
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-red-50 text-red-700">
                          Expired
                        </span>
                      ) : isOverLimit ? (
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-amber-50 text-amber-700">
                          Limit Reached
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-50 text-green-700">
                          Active
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(coupon)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(coupon._id)}
                          disabled={deleting === coupon._id}
                        >
                          {deleting === coupon._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
