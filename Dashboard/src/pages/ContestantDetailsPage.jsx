// src/pages/ContestantDetailsPage.jsx
import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent } from '../Components/ui/Card';
import { Button } from '../Components/ui/Button';
import { Dialog } from '../Components/ui/Dialog';
import { Input } from '../Components/ui/Input';
import { Label } from '../Components/ui/Label';
import { AwardDisplay } from '../Components/ui/AwardDisplay';
import { StarIcon } from '../Components/icons/StarIcon';
import { AwardIcon } from '../Components/icons/AwardIcon';

export function ContestantDetailsPage({ contestant, onAddPoints, onAwardBadge, navigate , onDeleteContestant}) {
    const [isPointsModalOpen, setPointsModalOpen] = useState(false);
    const [isBadgeModalOpen, setBadgeModalOpen] = useState(false);
    const [points, setPoints] = useState('');
    const [reason, setReason] = useState('');
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

    if (!contestant) {
        return (
            <div className="text-center p-8">
                <h2 className="text-2xl font-bold text-slate-700">لم يتم العثور على المتسابق</h2>
                <p className="text-slate-500 mt-2">قد يكون قد تم حذفه أو أن الرابط غير صحيح.</p>
                <Button className="mt-6" onClick={() => navigate('dashboard')}>العودة للوحة التحكم</Button>
            </div>
        );
    }
    const handleDelete = async () => {
        await onDeleteContestant(contestant.id);
        setDeleteModalOpen(false); // Close the dialog
        navigate('dashboard'); // Navigate back to the main dashboard
    };
    const countAwards = (accolades = [], type) => accolades.filter(a => a === type).length;

    const handleAddPoints = () => {
        const pointsNum = parseInt(points, 10);
        if (pointsNum > 0 && reason) {
            onAddPoints(contestant.id, pointsNum, reason);
            setPoints('');
            setReason('');
            setPointsModalOpen(false);
        } else {
            alert("الرجاء إدخال عدد نقاط صحيح وسبب للإضافة.");
        }
    };

    const handleAwardBadge = (badgeName) => {
        onAwardBadge(contestant.id, badgeName);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h2 className="text-4xl font-bold text-slate-900">{contestant.name}</h2>
                    <p className="text-slate-500 mt-1 text-lg">{contestant.description}</p>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                    <Button variant="outline" onClick={() => setBadgeModalOpen(true)}>منح وسام</Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setPointsModalOpen(true)}>إضافة نقاط</Button>
                     <Button variant="destructive" onClick={() => setDeleteModalOpen(true)}>حذف</Button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1">
                    <CardHeader><CardTitle className="text-xl">إجمالي النقاط</CardTitle></CardHeader>
                    <CardContent><p className="text-6xl font-bold text-slate-800">{contestant.totalOfStart}</p></CardContent>
                </Card>
                <Card className="lg:col-span-2">
                    <CardHeader><CardTitle className="text-xl">الأوسمة الحاصل عليها</CardTitle></CardHeader>
                    <CardContent className="flex items-center space-x-6 space-x-reverse">
                        <AwardDisplay icon={<StarIcon />} count={countAwards(contestant.racerAccolade, 'starOfCreativity')} title="نجمة الإبداع" colorClass="text-yellow-400" />
                        <AwardDisplay icon={<AwardIcon />} count={countAwards(contestant.racerAccolade, 'medalOfParticipation')} title="وسام المشاركة" colorClass="text-green-500" />
                        <AwardDisplay icon={<AwardIcon />} count={countAwards(contestant.racerAccolade, 'medalOfCreativity')} title="وسام الإبداع" colorClass="text-blue-500" />
                        {(contestant.racerAccolade || []).length === 0 && <p className="text-slate-500">لا يوجد أوسمة بعد.</p>}
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader><CardTitle className="text-xl">سجل النقاط</CardTitle></CardHeader>
                <CardContent>
                    <table className="w-full text-md text-right text-slate-500">
                        <thead className="text-sm text-slate-700 uppercase bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">النقاط</th>
                                <th scope="col" className="px-6 py-3">السبب</th>
                                <th scope="col" className="px-6 py-3">التاريخ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(contestant.racerStatrs || []).slice().reverse().map((entry) => (
                                <tr key={entry.id} className="bg-white border-b border-slate-200">
                                    <td className="px-6 py-4 font-bold text-green-600">+{entry.number}</td>
                                    <td className="px-6 py-4 text-slate-800">{entry.reason}</td>
                                    <td className="px-6 py-4">{format(parseISO(entry.dateTime), 'yyyy/MM/dd')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            <Dialog isOpen={isPointsModalOpen} onClose={() => setPointsModalOpen(false)} title="إضافة نقاط جديدة">
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2"><Label htmlFor="points">عدد النقاط</Label><Input id="points" type="number" value={points} onChange={e => setPoints(e.target.value)} placeholder="مثال: 10" /></div>
                    <div className="grid gap-2"><Label htmlFor="reason">سبب الإضافة</Label><Input id="reason" value={reason} onChange={e => setReason(e.target.value)} placeholder="مثال: مشاركة فعالة" /></div>
                    <Button onClick={handleAddPoints} className="w-full mt-2">إضافة</Button>
                </div>
            </Dialog>
            <Dialog isOpen={isBadgeModalOpen} onClose={() => setBadgeModalOpen(false)} title="منح وسام">
                 <div className="grid gap-3 py-4">
                    <Button variant="outline" onClick={() => handleAwardBadge('starOfCreativity')}><StarIcon className="w-5 h-5 ml-2 text-yellow-400" /> نجمة الإبداع</Button>
                    <Button variant="outline" onClick={() => handleAwardBadge('medalOfParticipation')}><AwardIcon className="w-5 h-5 ml-2 text-green-500" /> وسام المشاركة</Button>
                    <Button variant="outline" onClick={() => handleAwardBadge('medalOfCreativity')}><AwardIcon className="w-5 h-5 ml-2 text-blue-500" /> وسام الإبداع</Button>
                </div>
            </Dialog>
            <Dialog isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="تأكيد الحذف">
                <div className="py-4">
                    <p className="text-lg">
                        هل أنت متأكد أنك تريد حذف المتسابق <span className="font-bold">{contestant?.name}</span>؟
                    </p>
                    <p className="text-sm text-slate-500 mt-2">
                        سيتم حذف جميع نقاطه وأوسمته بشكل دائم. لا يمكن التراجع عن هذا الإجراء.
                    </p>
                </div>
                <div className="flex justify-end pt-4 space-x-2 space-x-reverse border-t">
                    <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>إلغاء</Button>
                    <Button variant="destructive" onClick={handleDelete}>نعم، قم بالحذف</Button>
                </div>
            </Dialog>
        </div>
    );
}
