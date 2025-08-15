import { useState } from 'react';
import { Button } from '../Components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../Components/ui/Card';
import { Dialog } from '../Components/ui/Dialog';
import { Label } from '../Components/ui/Label';
import { Input } from '../Components/ui/Input';
import { StarIcon } from '../Components/icons/StarIcon';
import { AwardIcon } from '../Components/icons/AwardIcon';

export function ContestantDetailsPage({ contestant, onAddPoints, onAwardBadge, navigate }) {
    const [isPointsModalOpen, setPointsModalOpen] = useState(false);
    const [isBadgeModalOpen, setBadgeModalOpen] = useState(false);
    const [points, setPoints] = useState('');
    const [reason, setReason] = useState('');

    if (!contestant) {
        return (
            <div className="text-center">
                <p>لم يتم العثور على المتسابق. الرجاء العودة.</p>
                <Button onClick={() => navigate('dashboard')}>العودة للوحة التحكم</Button>
            </div>
        );
    }
    
    const getTotalPoints = (pointsHistory) => {
        return pointsHistory.reduce((sum, entry) => sum + entry.points, 0);
    };

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
        setBadgeModalOpen(false);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">{contestant.name}</h2>
                    <p className="text-gray-500">{contestant.batch}</p>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                    <Button onClick={() => setPointsModalOpen(true)}>إضافة نقاط</Button>
                    <Button variant="outline" onClick={() => setBadgeModalOpen(true)}>منح وسام</Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle>إجمالي النقاط</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold text-slate-800">{getTotalPoints(contestant.pointsHistory)}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>الأوسمة</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center space-x-4 space-x-reverse">
                        {contestant.badges.starOfCreativity && <div title="نجمة الإبداع"><StarIcon className="w-8 h-8 text-yellow-400" /></div>}
                        {contestant.badges.medalOfParticipation && <div title="وسام المشاركة"><AwardIcon className="w-8 h-8 text-green-500" /></div>}
                        {contestant.badges.medalOfCreativity && <div title="وسام الإبداع"><AwardIcon className="w-8 h-8 text-blue-500" /></div>}
                        {!Object.values(contestant.badges).some(b => b) && <p className="text-gray-500">لا يوجد أوسمة بعد</p>}
                    </CardContent>
                </Card>
            </div>

            {/* Points History Table */}
            <Card>
                <CardHeader>
                    <CardTitle>سجل النقاط</CardTitle>
                </CardHeader>
                <CardContent>
                    <table className="w-full text-sm text-right text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">النقاط</th>
                                <th scope="col" className="px-6 py-3">السبب</th>
                                <th scope="col" className="px-6 py-3">التاريخ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contestant.pointsHistory.slice().reverse().map((entry, index) => (
                                <tr key={index} className="bg-white border-b">
                                    <td className="px-6 py-4 font-medium text-gray-900">{entry.points}</td>
                                    <td className="px-6 py-4">{entry.reason}</td>
                                    <td className="px-6 py-4">{entry.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            {/* Add Points Modal */}
            <Dialog isOpen={isPointsModalOpen} onClose={() => setPointsModalOpen(false)} title="إضافة نقاط جديدة">
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="points">عدد النقاط</Label>
                        <Input id="points" type="number" value={points} onChange={e => setPoints(e.target.value)} placeholder="مثال: 10" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="reason">سبب الإضافة</Label>
                        <Input id="reason" value={reason} onChange={e => setReason(e.target.value)} placeholder="مثال: مشاركة فعالة" />
                    </div>
                    <Button onClick={handleAddPoints} className="w-full">إضافة</Button>
                </div>
            </Dialog>

            {/* Award Badge Modal */}
            <Dialog isOpen={isBadgeModalOpen} onClose={() => setBadgeModalOpen(false)} title="منح وسام أو نجمة">
                <div className="grid gap-3">
                    <Button variant="outline" onClick={() => handleAwardBadge('starOfCreativity')} disabled={contestant.badges.starOfCreativity}>
                        <StarIcon className="w-5 h-5 ml-2 text-yellow-400" /> نجمة الإبداع
                    </Button>
                    <Button variant="outline" onClick={() => handleAwardBadge('medalOfParticipation')} disabled={contestant.badges.medalOfParticipation}>
                        <AwardIcon className="w-5 h-5 ml-2 text-green-500" /> وسام المشاركة
                    </Button>
                    <Button variant="outline" onClick={() => handleAwardBadge('medalOfCreativity')} disabled={contestant.badges.medalOfCreativity}>
                        <AwardIcon className="w-5 h-5 ml-2 text-blue-500" /> وسام الإبداع
                    </Button>
                </div>
            </Dialog>
        </div>
    );
}
