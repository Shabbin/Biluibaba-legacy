"use client";

import { useState, useEffect } from "react";
import { Loader2, Plus, Pencil, Trash2, ImageOff, ToggleLeft, ToggleRight } from "lucide-react";
import Image from "next/image";

import { toast } from "@/hooks/use-toast";
import axios from "@/lib/axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { AlertDialogBox } from "@/components/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Testimonial {
  _id: string;
  name: string;
  role: string;
  quote_title: string;
  review: string;
  image: { filename: string; path: string };
  display_order: number;
  is_active: boolean;
}

const emptyForm = {
  name: "",
  role: "",
  quote_title: "",
  review: "",
  display_order: "0",
  is_active: true,
};

export default function TestimonialsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const apiBase = process.env.NEXT_PUBLIC_API_URL;

  const fetchTestimonials = async () => {
    try {
      const { data } = await axios.get("/api/admin/testimonials");
      if (data.success) setTestimonials(data.testimonials);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load testimonials.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview(null);
    setSheetOpen(true);
  };

  const openEdit = (t: Testimonial) => {
    setEditingId(t._id);
    setForm({
      name: t.name,
      role: t.role,
      quote_title: t.quote_title,
      review: t.review,
      display_order: String(t.display_order),
      is_active: t.is_active,
    });
    setImageFile(null);
    setImagePreview(
      t.image?.filename ? `${apiBase}/uploads/testimonials/${t.image.filename}` : null
    );
    setSheetOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.role || !form.quote_title || !form.review) {
      toast({
        title: "Validation Error",
        description: "Name, role, quote title and review are required.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("role", form.role);
      formData.append("quote_title", form.quote_title);
      formData.append("review", form.review);
      formData.append("display_order", form.display_order);
      formData.append("is_active", String(form.is_active));
      if (imageFile) formData.append("image", imageFile);

      const url = editingId
        ? `/api/admin/testimonials/${editingId}`
        : "/api/admin/testimonials/create";
      const method = editingId ? "put" : "post";

      const { data } = await axios[method](url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        toast({
          title: editingId ? "Testimonial updated" : "Testimonial created",
          description: editingId
            ? "Changes saved successfully."
            : "New testimonial added successfully.",
        });
        setSheetOpen(false);
        fetchTestimonials();
      }
    } catch {
      toast({
        title: "Server Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (id: string) => {
    setDeletingId(id);
    setAlertOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setSaving(true);
    try {
      const { data } = await axios.delete(`/api/admin/testimonials/${deletingId}`);
      if (data.success) {
        toast({ title: "Deleted", description: "Testimonial removed." });
        fetchTestimonials();
      }
    } catch {
      toast({
        title: "Error",
        description: "Could not delete testimonial.",
        variant: "destructive",
      });
    } finally {
      setAlertOpen(false);
      setDeletingId(null);
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Testimonials</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage customer testimonials displayed on the homepage.
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Testimonial
        </Button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-7 h-7 animate-spin text-muted-foreground" />
        </div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          No testimonials yet. Click &quot;Add Testimonial&quot; to create one.
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Image</TableHead>
                <TableHead>Name / Role</TableHead>
                <TableHead>Quote Title</TableHead>
                <TableHead className="w-24">Order</TableHead>
                <TableHead className="w-24">Status</TableHead>
                <TableHead className="w-28 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testimonials.map((t) => (
                <TableRow key={t._id}>
                  <TableCell>
                    {t.image?.filename ? (
                      <div className="relative w-10 h-10 rounded-md overflow-hidden bg-muted">
                        <Image
                          src={`${apiBase}/uploads/testimonials/${t.image.filename}`}
                          alt={t.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center">
                        <ImageOff className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{t.name}</p>
                    <p className="text-muted-foreground text-xs">{t.role}</p>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="truncate text-sm">{t.quote_title}</p>
                  </TableCell>
                  <TableCell className="text-center">{t.display_order}</TableCell>
                  <TableCell>
                    <Badge variant={t.is_active ? "default" : "secondary"}>
                      {t.is_active ? "Active" : "Hidden"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(t)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => confirmDelete(t._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add / Edit Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {editingId ? "Edit Testimonial" : "Add Testimonial"}
            </SheetTitle>
            <SheetDescription>
              Fill in the details below. The image will be displayed at the
              bottom of the testimonial card.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-5 py-6">
            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="name">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g. Sarah Jenkins"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            {/* Role */}
            <div className="space-y-1.5">
              <Label htmlFor="role">
                Role <span className="text-destructive">*</span>
              </Label>
              <Input
                id="role"
                placeholder="e.g. Cat Mom"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              />
            </div>

            {/* Quote Title */}
            <div className="space-y-1.5">
              <Label htmlFor="quote_title">
                Quote Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="quote_title"
                placeholder="e.g. I'm in love with this service."
                value={form.quote_title}
                onChange={(e) =>
                  setForm({ ...form, quote_title: e.target.value })
                }
              />
            </div>

            {/* Review */}
            <div className="space-y-1.5">
              <Label htmlFor="review">
                Review <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="review"
                placeholder="The full review text..."
                rows={4}
                value={form.review}
                onChange={(e) => setForm({ ...form, review: e.target.value })}
              />
            </div>

            {/* Display Order */}
            <div className="space-y-1.5">
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                type="number"
                min={0}
                placeholder="0"
                value={form.display_order}
                onChange={(e) =>
                  setForm({ ...form, display_order: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground">
                Lower numbers appear first. Cards cycle through 4 pastel colors
                by index.
              </p>
            </div>

            {/* Is Active */}
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label htmlFor="is_active" className="cursor-pointer">
                  Visible on homepage
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Toggle off to hide this testimonial without deleting it.
                </p>
              </div>
              <Switch
                id="is_active"
                checked={form.is_active}
                onCheckedChange={(checked) =>
                  setForm({ ...form, is_active: checked })
                }
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Pet / Customer Photo</Label>
              {imagePreview && (
                <div className="relative w-full aspect-square rounded-lg overflow-hidden border bg-muted">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-1 text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
              <Input
                type="file"
                accept="image/png, image/jpg, image/jpeg"
                onChange={handleImageChange}
              />
              <p className="text-xs text-muted-foreground">
                Accepted: JPG, JPEG, PNG. Recommended aspect ratio: 1:1.
              </p>
            </div>
          </div>

          <SheetFooter>
            <Button
              variant="outline"
              onClick={() => setSheetOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={saving} className="gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {editingId ? "Save Changes" : "Create Testimonial"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation */}
      <AlertDialogBox
        open={alertOpen}
        onOpenChange={setAlertOpen}
        title="Delete Testimonial"
        description="This will permanently remove the testimonial and its image. This action cannot be undone."
        onConfirm={handleDelete}
      />
    </div>
  );
}
