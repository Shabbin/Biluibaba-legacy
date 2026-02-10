# Quick Start Guide - Client App with shadcn/ui

## 🚀 Running the Application

### Start the Development Servers

```bash
# Terminal 1 - Start the server
cd server
nodemon server.js

# Terminal 2 - Start the client
cd client
yarn dev
```

**URLs:**
- Client: http://localhost:3000
- Server: http://localhost:5000
- API Docs: http://localhost:5000/api-docs

## 🔐 Testing Forgot Password Feature

### 1. Access the Forgot Password Page
Navigate to: http://localhost:3000/forgot-password

### 2. Request a Password Reset
- Enter your email address
- Click "Send Reset Link"
- Check your email inbox (configured in server/.env)

### 3. Reset Your Password
- Click the link in the email (or manually navigate to /reset-password?token=xxx)
- Enter a new password meeting the requirements:
  - At least 8 characters
  - One uppercase letter
  - One lowercase letter
  - One number
- Confirm the password
- Submit

### 4. Login with New Password
- You'll be redirected to /login
- Use your email and new password

## 🎨 Using shadcn Components in New Pages

### Example: Create a New Form Page

```jsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { toast } from "@/src/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

export default function MyPage() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      // Your API call here
      toast({
        title: "Success!",
        description: "Form submitted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-petzy-blue-light p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>My Form</CardTitle>
          <CardDescription>Fill out the form below</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
```

## 🎯 Component Variants

### Button Variants
```jsx
import { Button } from "@/src/components/ui/button";

<Button variant="default">Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="destructive">Delete</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>
```

### Toast Variants
```jsx
import { toast } from "@/src/hooks/use-toast";

// Success (default)
toast({
  title: "Success!",
  description: "Your action was completed.",
});

// Error
toast({
  title: "Error",
  description: "Something went wrong.",
  variant: "destructive",
});

// With action button
toast({
  title: "Are you sure?",
  description: "This action cannot be undone.",
  action: (
    <Button variant="outline" size="sm" onClick={() => console.log("Undo")}>
      Undo
    </Button>
  ),
});
```

### Card Components
```jsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

## 🔄 Backward Compatibility

Existing pages will continue to work with the legacy component API:

```jsx
import Button from "@/src/components/ui/button";
import Input from "@/src/components/ui/input";

// Old API - still works!
<Button 
  text="Click Me" 
  type="default" 
  onClick={handleClick}
/>

<Input
  type="email"
  value={email}
  onChange={handleChange}
  placeholder="Email"
/>
```

## 🎨 Using Petzy Theme Colors

```jsx
// Background colors
<div className="bg-petzy-blue-light">Light blue background</div>
<div className="bg-petzy-mint-light">Light mint background</div>

// Text colors
<h1 className="text-petzy-coral">Coral heading</h1>
<p className="text-petzy-slate">Slate text</p>
<p className="text-petzy-slate-light">Light slate text</p>

// Hover effects
<button className="text-petzy-coral hover:text-petzy-coral-dark">
  Hover me
</button>

// Shadows
<div className="shadow-soft">Soft shadow</div>
<div className="shadow-soft-lg">Large soft shadow</div>

// Border radius
<div className="rounded-pill">Pill shaped</div>
<div className="rounded-3xl">Extra large rounded</div>
```

## 📝 Form Validation with Zod

```jsx
import * as z from "zod";

// Define schema
const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be 8+ characters"),
  age: z.number().min(18, "Must be 18 or older"),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must accept terms",
  }),
});

// Use in form
const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: {
    email: "",
    password: "",
    age: 0,
    terms: false,
  },
});
```

## 🐛 Common Issues & Solutions

### Issue: Import errors for UI components
**Solution:** Make sure you're importing from the correct path:
```jsx
import { Button } from "@/src/components/ui/button"; // ✅ Correct
import Button from "@/src/components/ui/button";     // ✅ Also works (legacy)
```

### Issue: Toast not appearing
**Solution:** Ensure `<Toaster />` is in your layout:
```jsx
// src/app/layout.js
import { Toaster } from "@/src/components/ui/toaster";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster /> {/* Add this */}
      </body>
    </html>
  );
}
```

### Issue: Form validation not working
**Solution:** Make sure you're passing the form instance to `<Form>`:
```jsx
const form = useForm({ ... });

return (
  <Form {...form}> {/* Don't forget to spread form */}
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* fields */}
    </form>
  </Form>
);
```

## 📚 Additional Resources

- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)
- [Radix UI Primitives](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)

## ✅ Pre-flight Checklist

Before deploying to production:

- [ ] Test forgot password flow with real email
- [ ] Verify all form validations
- [ ] Check responsive design on mobile
- [ ] Test with slow network (3G)
- [ ] Verify toast notifications
- [ ] Test keyboard navigation
- [ ] Check accessibility (ARIA labels)
- [ ] Update environment variables for production
- [ ] Configure email service (SMTP) properly
- [ ] Set FRONTEND_URL to production domain

## 🎉 You're All Set!

The client app is now modernized with:
- ✅ shadcn/ui design system
- ✅ Fully functional forgot password
- ✅ Backward compatibility
- ✅ Type-safe form validation
- ✅ Accessible components
- ✅ Unified design language

Happy coding! 🚀
