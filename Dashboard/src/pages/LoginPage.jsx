import React from 'react';
import { Button } from '../Components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../Components/ui/Card';
import { FancyCard } from '../Components/ui/FancyCard';
import { Input } from '../Components/ui/Input';
import { Label } from '../Components/ui/Label';

export function LoginPage({ onLogin }) {
  const [username, setUsername] = React.useState('admin');
  const [password, setPassword] = React.useState('admin');
  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{
        backgroundColor: '#0f172a',
        backgroundImage:
          "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(168,85,247,0.25)), url('/images/login-pattern.svg')",
        backgroundSize: 'cover, 40px 40px',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center, top left',
      }}
    >
      <div className="w-full max-w-sm">
  <FancyCard>
          <CardHeader>
            <CardTitle className="text-xl">تسجيل الدخول</CardTitle>
            <CardDescription className="text-sm">أدخل بياناتك للوصول إلى لوحة التحكم</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm">
            <div className="grid gap-1.5">
              <Label htmlFor="username">اسم المستخدم</Label>
              <Input id="username" type="text" placeholder="admin" value={username} onChange={e => setUsername(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm py-2.5" onClick={() => onLogin('dashboard', { username, password })}>دخول</Button>
          </CardFooter>
        </FancyCard>
      </div>
    </div>
  );
}
