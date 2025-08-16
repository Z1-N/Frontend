// src/pages/DashboardPage.jsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../Components/ui/Card';
import { Button } from '../Components/ui/Button';
import { AwardDisplay } from '../Components/ui/AwardDisplay';
import { StarIcon } from '../Components/icons/StarIcon';
import { AwardIcon } from '../Components/icons/AwardIcon';

export function DashboardPage({ contestants, navigate }) {
    // دالة آمنة لعد الأوسمة، تتعامل مع الحالات التي تكون فيها البيانات غير موجودة
    const countAwards = (accolades = [], type) => accolades.filter(a => a === type).length;

    return (
        <div>
            <h2 className="text-4xl font-bold mb-8 text-slate-900">المشاركون في البرنامج</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {contestants.map(c => (
                    <Card key={c.id} className="transition-all hover:shadow-lg hover:-translate-y-1">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-xl font-bold">{c.name}</CardTitle>
                                    <CardDescription className="text-md">{c.description}</CardDescription>
                                </div>
                                <div className="flex items-center space-x-2 space-x-reverse">
                                    <AwardDisplay icon={<StarIcon />} count={countAwards(c.racerAccolade, 'starOfCreativity')} title="نجمة الإبداع" colorClass="text-yellow-400" />
                                    <AwardDisplay icon={<AwardIcon />} count={countAwards(c.racerAccolade, 'medalOfParticipation')} title="وسام المشاركة" colorClass="text-green-500" />
                                    <AwardDisplay icon={<AwardIcon />} count={countAwards(c.racerAccolade, 'medalOfCreativity')} title="وسام الإبداع" colorClass="text-blue-500" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="text-5xl font-bold text-slate-800">{c.totalOfStart}</p>
                            <p className="text-md text-slate-500 mt-1">نقطة</p>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-lg py-2.5" onClick={() => navigate('contestantDetails', { id: c.id })}>
                                عرض التفاصيل
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
