import React, { ReactNode } from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface SheetUploadProps {
  title: string;
  open: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: ReactNode;
}

export function SheetUpload({
  open,
  setIsOpen,
  title,
  children,
}: SheetUploadProps) {
  return (
    <Sheet open={open} onOpenChange={(open) => setIsOpen(open)}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <SheetDescription>{children}</SheetDescription>
      </SheetContent>
    </Sheet>
  );
}
