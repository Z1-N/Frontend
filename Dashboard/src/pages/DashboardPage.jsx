import React from 'react';
import Card from '../Components/ui/Card';
import CardHeader from '../Components/ui/Card';
import CardTitle from '../Components/ui/Card';
import CardDescription from '../Components/ui/Card';
import CardContent from '../Components/ui/Card';
import CardFooter from '../Components/ui/Card';
import {Button} from '../Components/ui/Button';
import {StarIcon} from '../Components/icons/StarIcon';
import {AwardIcon} from '../Components/icons/AwardIcon';


function DashboardPage({ contestants, navigate }) {
    const getTotalPoints = (pointsHistory) => {
        return pointsHistory.reduce((sum, entry) => sum + entry.points, 0);
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">المشاركون في البرنامج</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contestants.map(c => (
                    <Card key={c.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle>{c.name}</CardTitle>
                                    <CardDescription>{c.batch}</CardDescription>
                                </div>
                                <div className="flex items-center space-x-1 space-x-reverse">
                                    {c.badges.starOfCreativity && <StarIcon className="w-5 h-5 text-yellow-400" title="نجمة الإبداع" />}
                                    {c.badges.medalOfParticipation && <AwardIcon className="w-5 h-5 text-green-500" title="وسام المشاركة" />}
                                    {c.badges.medalOfCreativity && <AwardIcon className="w-5 h-5 text-blue-500" title="وسام الإبداع" />}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-center text-slate-700">{getTotalPoints(c.pointsHistory)}</p>
                            <p className="text-sm text-center text-gray-500">نقطة</p>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" onClick={() => navigate('contestantDetails', { id: c.id })}>
                                عرض التفاصيل
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export { DashboardPage };