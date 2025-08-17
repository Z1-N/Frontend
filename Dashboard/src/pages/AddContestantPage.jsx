import { useState, useMemo } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '../Components/ui/Card';
import { FancyCard } from '../Components/ui/FancyCard';
import { Button } from '../Components/ui/Button';
import { Input } from '../Components/ui/Input';
import { Label } from '../Components/ui/Label';
import { UsersIcon } from '../Components/icons/UserIcon';
import { HomeIcon } from '../Components/icons/HomeIcon';


function AddContestantPage({ onAddContestant, navigate }) {
  const [name, setName] = useState('');
  const [batch, setBatch] = useState('');

  const initials = useMemo(() => {
    const n = (name || '').trim();
    if (!n) return '•';
    const parts = n.split(/\s+/).slice(0, 2);
    return parts.map(p => p[0]).join('');
  }, [name]);

  const canSubmit = name.trim().length >= 2 && batch.trim().length >= 2;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) {
      alert('الرجاء إدخال اسم ودفعة صالحين');
      return;
    }
    onAddContestant({ name: name.trim(), batch: batch.trim() });
    navigate('dashboard');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          إضافة متسابق جديد
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-600">
          أدخل البيانات ثم راجع المعاينة المباشرة قبل الإضافة.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <FancyCard>
          <CardHeader className="p-5 pb-2">
            <CardTitle className="text-lg font-bold text-slate-800">بيانات المتسابق</CardTitle>
            <CardDescription className="text-xs text-slate-500">لنأخذ المعلومات الأساسية</CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-2">
            <form onSubmit={handleSubmit} className="grid gap-4 text-sm">
              <div className="grid gap-1.5">
                <Label htmlFor="name">اسم المتسابق</Label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                    <UsersIcon className="w-4 h-4" />
                  </span>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: أحمد علي"
                    required
                    className="pl-9"
                  />
                </div>
                <p className="text-[11px] text-slate-500">يفضل اسم ثنائي لعرض الأحرف الأولى بشكل جميل.</p>
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="description">اسم الدفعة</Label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                    <HomeIcon className="w-4 h-4" />
                  </span>
                  <Input
                    id="description"
                    value={batch}
                    onChange={(e) => setBatch(e.target.value)}
                    placeholder="مثال: دفعة الأمل"
                    required
                    className="pl-9"
                  />
                </div>
                <p className="text-[11px] text-slate-500">أدخل الاسم الذي يظهر للدفعة في لوحة التحكم.</p>
              </div>

              <Button
                type="submit"
                disabled={!canSubmit}
                className="mt-1 w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-60 text-white text-sm py-2.5 rounded-xl"
              >
                إضافة المتسابق
              </Button>
            </form>
          </CardContent>
        </FancyCard>

        {/* Live Preview */}
        <FancyCard hover={false}>
          <CardHeader className="p-5 pb-2">
            <CardTitle className="text-lg font-bold text-slate-800">معاينة المتسابق</CardTitle>
            <CardDescription className="text-xs text-slate-500">هكذا سيظهر في لوحة التحكم</CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-3">
            <div className="group relative rounded-3xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 p-[1px]">
              <Card className="p-0 rounded-3xl bg-white/80 backdrop-blur-sm shadow-md">
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-base font-bold shadow-sm">
                        {initials}
                      </div>
                      <span className="pointer-events-none absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-indigo-500/0 to-purple-600/0 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-40" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-lg font-extrabold text-slate-900 leading-tight break-words">{name || 'اسم المتسابق'}</div>
                      <div className="text-xs text-slate-500 break-words">{batch || 'اسم الدفعة'}</div>
                    </div>
                  </div>
                  <div className="mt-4 relative overflow-hidden rounded-2xl border border-slate-100 bg-gradient-to-b from-slate-50 to-white p-4 text-center">
                    <p className="relative z-10 text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm">
                      0
                    </p>
                    <p className="relative z-10 mt-1 text-[11px] md:text-sm font-medium text-slate-500">نقطة</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </FancyCard>
      </div>
    </div>
  );
}

export { AddContestantPage };