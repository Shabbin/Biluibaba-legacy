# Migration Guide: Converting Existing Pages to shadcn/ui

## Overview

This guide helps you migrate existing pages from the old custom UI components to the new shadcn/ui components. All existing pages continue to work with backward compatibility, but you can gradually migrate them for a better developer experience.

## ✅ What's Already Working

- **All existing pages** continue to work without changes
- **Old component API** is preserved through legacy wrappers
- **No breaking changes** - migration is optional and incremental

## 🔄 Migration Patterns

### Pattern 1: Simple Button Migration

**Before:**
```jsx
import Button from "@/src/components/ui/button";

<Button 
  text="Click Me" 
  type="default" 
  onClick={handleClick}
  icon={<Icon />}
  disabled={loading}
/>
```

**After:**
```jsx
import { Button } from "@/src/components/ui/button";

<Button 
  variant="default" 
  onClick={handleClick}
  disabled={loading}
>
  Click Me
  <Icon className="ml-2" />
</Button>
```

### Pattern 2: Input Migration

**Before:**
```jsx
import Input from "@/src/components/ui/input";

<Input
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="Email"
  error={errors.email}
/>
```

**After (with React Hook Form):**
```jsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/src/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";

const schema = z.object({
  email: z.string().email("Invalid email"),
});

const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: { email: "" },
});

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input type="email" placeholder="Email" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </form>
</Form>
```

### Pattern 3: Form with Multiple Fields

**Before:**
```jsx
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [errors, setErrors] = useState({});

const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Manual validation
  const newErrors = {};
  if (!name) newErrors.name = "Name required";
  if (!email) newErrors.email = "Email required";
  if (password.length < 8) newErrors.password = "Password too short";
  
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }
  
  // Submit
  await submitForm({ name, email, password });
};

<form onSubmit={handleSubmit}>
  <Input
    value={name}
    onChange={(e) => setName(e.target.value)}
    placeholder="Name"
  />
  {errors.name && <span className="text-red-500">{errors.name}</span>}
  
  <Input
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    placeholder="Email"
  />
  {errors.email && <span className="text-red-500">{errors.email}</span>}
  
  <Input
    type="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder="Password"
  />
  {errors.password && <span className="text-red-500">{errors.password}</span>}
  
  <Button text="Submit" type="default" />
</form>
```

**After:**
```jsx
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

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const form = useForm({
  resolver: zodResolver(formSchema),
  defaultValues: {
    name: "",
    email: "",
    password: "",
  },
});

const onSubmit = async (data) => {
  // Data is already validated!
  await submitForm(data);
};

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input placeholder="Your name" {...field} />
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
            <Input type="email" placeholder="you@example.com" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Password</FormLabel>
          <FormControl>
            <Input type="password" placeholder="••••••••" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    <Button type="submit">Submit</Button>
  </form>
</Form>
```

### Pattern 4: Toast Notifications

**Before:**
```jsx
import { toast } from "react-hot-toast";

toast.success("Success!");
toast.error("Error!");
```

**After (both work!):**
```jsx
import { toast } from "react-hot-toast"; // Old way - still works
import { toast as shadcnToast } from "@/src/hooks/use-toast"; // New way

// Old way
toast.success("Success!");
toast.error("Error!");

// New way (more customizable)
shadcnToast({
  title: "Success!",
  description: "Your action was completed.",
});

shadcnToast({
  title: "Error",
  description: "Something went wrong.",
  variant: "destructive",
});
```

## 📝 Example: Migrating the Signup Page

### Before: `src/app/signin/page.jsx`

```jsx
"use client";
import { useState } from "react";
import Button from "@/src/components/ui/button";
import Input from "@/src/components/ui/input";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Submit logic
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input 
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <Input 
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <Input 
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <Button text="Sign Up" type="default" />
    </form>
  );
}
```

### After: Modern Version

```jsx
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { toast } from "@/src/hooks/use-toast";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain uppercase letter")
    .regex(/[a-z]/, "Must contain lowercase letter")
    .regex(/[0-9]/, "Must contain number"),
});

export default function Signup() {
  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      // Submit logic - data is already validated!
      await createAccount(data);
      
      toast({
        title: "Account created!",
        description: "Welcome to Biluibaba.",
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
    <div className="min-h-screen bg-petzy-blue-light flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl">Create Account</CardTitle>
          <CardDescription>Sign up to get started</CardDescription>
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
                      <Input placeholder="Your name" {...field} />
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
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Sign Up
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
```

## 🎯 Benefits of Migration

### Before (Old Approach)
- ❌ Manual validation logic
- ❌ Manual error state management
- ❌ Inconsistent error display
- ❌ More boilerplate code
- ❌ Less accessible

### After (New Approach)
- ✅ Automatic validation with Zod
- ✅ Built-in error handling
- ✅ Consistent error display
- ✅ Less boilerplate code
- ✅ ARIA labels automatically added
- ✅ Keyboard navigation works
- ✅ Type-safe (when using TypeScript)

## 📋 Migration Checklist

When migrating a page:

- [ ] Install form dependencies if not already installed
- [ ] Create Zod schema for validation
- [ ] Replace `useState` with `useForm`
- [ ] Wrap inputs with `<FormField>` components
- [ ] Update button imports and usage
- [ ] Replace toast calls (optional)
- [ ] Add loading states with form submission
- [ ] Test all validation rules
- [ ] Test keyboard navigation
- [ ] Test screen reader compatibility

## 🚀 Incremental Migration Strategy

You don't have to migrate everything at once! Here's a suggested order:

### Phase 1: New Pages Only (✅ Already Done)
- Forgot Password page
- Reset Password page

### Phase 2: High-Impact Pages (Suggested Next)
1. Login page (`/login`)
2. Signup page (`/signin`)
3. Profile/Account page (`/my-account`)

### Phase 3: Form-Heavy Pages
1. Checkout pages
2. Become Seller/Vet pages
3. Contact form

### Phase 4: Product Pages
1. Product detail pages
2. Review forms
3. Filter components

### Phase 5: Everything Else
- Remaining pages as needed
- Or leave them with backward compatibility

## 💡 Tips for Successful Migration

1. **Test as you go** - Migrate one page at a time and test thoroughly
2. **Keep both systems** - Don't remove old components until all pages are migrated
3. **Use TypeScript** - Consider converting to `.tsx` for better type safety
4. **Leverage Zod** - It's more powerful than manual validation
5. **Check accessibility** - Test with keyboard and screen reader
6. **Mobile first** - Test responsive design on mobile devices

## 📚 Resources

- [React Hook Form - Get Started](https://react-hook-form.com/get-started)
- [Zod - Type-safe Schema Validation](https://zod.dev/)
- [shadcn/ui - Components](https://ui.shadcn.com/docs/components)
- [Radix UI - Accessibility](https://www.radix-ui.com/primitives/docs/overview/accessibility)

## ⚠️ Important Notes

1. **Backward Compatibility**: All old pages continue to work. Migration is optional.
2. **No Rush**: Migrate incrementally as you update features or fix bugs.
3. **Testing**: Always test migrated pages thoroughly before deploying.
4. **Documentation**: Keep this guide handy for reference during migration.

## 🎉 Success Criteria

A page is successfully migrated when:
- ✅ All form validations work correctly
- ✅ Error messages display properly
- ✅ Submission handling works
- ✅ Loading states are shown
- ✅ Toast notifications appear
- ✅ Keyboard navigation works
- ✅ Mobile responsive
- ✅ No console errors
- ✅ User experience is smooth

Happy migrating! 🚀
