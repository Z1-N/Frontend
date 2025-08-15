import { useState } from 'react';
import Card from '../Components/ui/Card'; 
import CardContent from '../Components/ui/Card';
import CardFooter from '../Components/ui/Card';
import { Button } from '../Components/ui/Button';
import { Input } from '../Components/ui/Input';
import { Label } from '../Components/ui/Label';


function AddContestantPage({ onAddContestant, navigate }) {
  const [name, setName] = useState('');
  const [batch, setBatch] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !batch) {
        alert("الرجاء ملء جميع الحقول");
        return;
    }
    onAddContestant({ name, batch });
    navigate('dashboard');
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-gray-800">إضافة متسابق جديد</h2>
      <Card className="max-w-lg mx-auto">
        <form onSubmit={handleSubmit}>
          <CardContent className="pt-6 grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">اسم المتسابق</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: أحمد علي" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="batch">اسم الدفعة</Label>
              <Input id="batch" value={batch} onChange={(e) => setBatch(e.target.value)} placeholder="مثال: دفعة الأمل" required />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">إضافة المتسابق</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export { AddContestantPage };