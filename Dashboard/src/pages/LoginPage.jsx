import React from 'react';
import { Button } from '../Components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../Components/ui/Card';
import { Input } from '../Components/ui/Input';
import { Label } from '../Components/ui/Label';

export function LoginPage({ onLogin }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">تسجيل الدخول</CardTitle>
          <CardDescription>أدخل بياناتك للوصول إلى لوحة التحكم</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input id="email" type="email" placeholder="name@example.com" defaultValue="admin@example.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">كلمة المرور</Label>
            <Input id="password" type="password" defaultValue="password" />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={() => onLogin('dashboard')}>دخول</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
