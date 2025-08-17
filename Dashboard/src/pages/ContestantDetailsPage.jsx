// src/Pages/ContestantDetailsPage.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { format, parseISO } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent } from '../Components/ui/Card';
import { Button } from '../Components/ui/Button';
import { Dialog } from '../Components/ui/Dialog';
import { Input } from '../Components/ui/Input';
import { Label } from '../Components/ui/Label';
import { AwardDisplay } from '../Components/ui/AwardDisplay';
import { StarIcon } from '../Components/icons/StarIcon';
import { AwardIcon } from '../Components/icons/AwardIcon';
import { getContestantDetails } from '../services/api';
import { EnhancedTable } from '../Components/ui/EnhancedTable'; // 🔽 استيراد الجدول المتقدم

const AccoladeIcon = ({ type }) => {
    switch (type) {
        case 'starOfCreativity':
            return <StarIcon className="w-5 h-5 text-red-400" />;
        case 'starOfParticipation':
            return <StarIcon className="w-5 h-5 text-yellow-400" />;
        case 'medalOfCreativity':
            return <AwardIcon className="w-5 h-5 text-red-400" />;
        case 'medalOfParticipation':
            return <AwardIcon className="w-5 h-5 text-yellow-500" />;
        default:
            return <AwardIcon className="w-5 h-5 text-slate-400" />;
    }
};

export function ContestantDetailsPage({ contestant, availableAccolades, onAddPoints, onAwardBadge, onDeleteContestant, navigate }) {
    const [details, setDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [isPointsModalOpen, setPointsModalOpen] = useState(false);
    const [isBadgeModalOpen, setBadgeModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    
    const [points, setPoints] = useState('');
    const [reason, setReason] = useState('');
    const [awardReason, setAwardReason] = useState('');

    const fetchDetails = useCallback(async () => {
        if (!contestant?.name) {
            setIsLoading(false);
            return;
        }
        try {
            setIsLoading(true);
            const response = await getContestantDetails(contestant.name);
            if (response.data && response.data.length > 0) {
                setDetails(response.data[0]);
            } else {
                setError("Contestant details not found.");
            }
        } catch (err) {
            setError("Failed to fetch contestant details.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [contestant]);

    useEffect(() => {
        fetchDetails();
    }, [fetchDetails]);

    const countAwards = (accolades = [], type) => {
        return accolades.filter(a => a.name === type).length;
    };

    const handleAddPoints = async () => {
        const pointsNum = parseInt(points, 10);
        if (pointsNum > 0 && reason) {
            try {
                await onAddPoints(contestant.id, pointsNum, reason);
                await fetchDetails();
            } catch (err) {
                alert("Failed to add points.");
            } finally {
                setPointsModalOpen(false);
                setPoints('');
                setReason('');
            }
        } else {
            alert("Please enter a valid number of points and a reason.");
        }
    };

    const handleAwardBadge = async (accoladeId) => {
        try {
            await onAwardBadge(contestant.id, accoladeId, awardReason);
            await fetchDetails();
        } catch (err) {
            alert("Failed to grant award.");
        } finally {
            setBadgeModalOpen(false);
            setAwardReason('');
        }
    };

    const handleDelete = async () => {
        await onDeleteContestant(contestant.id);
        setDeleteModalOpen(false);
        navigate('dashboard');
    };

    const combinedLog = useMemo(() => {
        if (!details) return [];
        const pointsLog = (details.startResponse || []).map((entry, index) => ({
            type: 'point', date: entry.dateTime, value: `+${entry.number}`, reason: entry.reason, key: `point-${entry.id || index}`
        }));
        const accoladesLog = (details.accolade || []).map((entry, index) => {
            const fullAccolade = availableAccolades.find(acc => acc.name === entry.name);
            return {
                type: 'accolade', date: entry.dateTime || new Date().toISOString(), value: fullAccolade ? fullAccolade.description : entry.name, reason: entry.reason || 'Granted', key: `accolade-${entry.id || index}`, iconType: entry.name
            };
        });
        const log = [...pointsLog, ...accoladesLog];
        log.sort((a, b) => new Date(b.date) - new Date(a.date));
        return log;
    }, [details, availableAccolades]);

    // 🔽 تعريف الأعمدة للجدول المتقدم
    const columns = useMemo(() => [
        {
            accessorKey: 'value',
            header: 'Event',
            cell: ({ row }) => {
                const entry = row.original;
                if (entry.type === 'point') {
                    return <span className="font-bold text-green-600">{entry.value}</span>;
                }
                return (
                    <span className="flex items-center justify-end gap-2">
                        <span className="font-medium text-slate-800">{entry.value}</span>
                        <AccoladeIcon type={entry.iconType} />
                    </span>
                );
            }
        },
        {
            accessorKey: 'reason',
            header: 'Reason',
        },
        {
            accessorKey: 'date',
            header: 'Date',
            cell: ({ getValue }) => format(parseISO(getValue()), 'yyyy/MM/dd'),
        }
    ], []);

    if (isLoading) return <div className="text-center p-8">Loading Details...</div>;
    if (error) return <div className="text-center p-8 text-red-500">{error}</div>;
    if (!contestant || !details) return <div className="text-center p-8"><h2 className="text-2xl font-bold">Contestant Not Found</h2></div>;

    return (
        <div className="space-y-8 max-w-6xl mx-auto py-8 px-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h2 className="text-4xl font-bold text-slate-900">{details.name}</h2>
                    <p className="text-slate-500 mt-1 text-lg">{details.description}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => setBadgeModalOpen(true)}>Grant Award</Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => setPointsModalOpen(true)}>Add Points</Button>
                    <Button variant="destructive" onClick={() => setDeleteModalOpen(true)}>Delete</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1">
                    <CardHeader><CardTitle className="text-lg font-semibold">Total Points</CardTitle></CardHeader>
                    <CardContent><p className="text-5xl font-bold text-slate-800">{details.totalOfStars}</p></CardContent>
                </Card>
                <Card className="md:col-span-2">
                    <CardHeader><CardTitle className="text-lg font-semibold">Awards Received</CardTitle></CardHeader>
                    <CardContent className="flex items-center gap-6 flex-wrap">
                        <AwardDisplay icon={<StarIcon />} count={countAwards(details.accolade, 'starOfCreativity')} title="Star of Creativity" colorClass="text-red-400" />
                        <AwardDisplay icon={<StarIcon />} count={countAwards(details.accolade, 'starOfParticipation')} title="Star of Participation" colorClass="text-yellow-400" />
                        <AwardDisplay icon={<AwardIcon />} count={countAwards(details.accolade, 'medalOfCreativity')} title="Medal of Creativity" colorClass="text-red-400" />
                        <AwardDisplay icon={<AwardIcon />} count={countAwards(details.accolade, 'medalOfParticipation')} title="Medal of Participation" colorClass="text-yellow-500" />
                        {(details.accolade || []).length === 0 && <p className="text-slate-500">No awards yet.</p>}
                    </CardContent>
                </Card>
            </div>

            {/* 🔽 استخدام الجدول المتقدم بدلاً من الجدول البسيط */}
            <EnhancedTable data={combinedLog} columns={columns} />

            <Dialog isOpen={isPointsModalOpen} onClose={() => setPointsModalOpen(false)} title="Add New Points">
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2"><Label htmlFor="points">Number of Points</Label><Input id="points" type="number" value={points} onChange={e => setPoints(e.target.value)} placeholder="e.g., 10" /></div>
                    <div className="grid gap-2"><Label htmlFor="reason">Reason for Awarding</Label><Input id="reason" value={reason} onChange={e => setReason(e.target.value)} placeholder="e.g., Active participation" /></div>
                    <Button onClick={handleAddPoints} className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white">Add</Button>
                </div>
            </Dialog>

            <Dialog isOpen={isBadgeModalOpen} onClose={() => setBadgeModalOpen(false)} title="Grant an Award">
                 <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="awardReason">Reason (Optional)</Label>
                        <Input id="awardReason" value={awardReason} onChange={e => setAwardReason(e.target.value)} placeholder="e.g., For his great initiative" />
                    </div>
                    <div className="border-t pt-4 mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {(availableAccolades || []).map(acc => (
                            <Button key={acc.id} variant="outline" onClick={() => handleAwardBadge(acc.id)}>
                                {acc.description || acc.name}
                            </Button>
                        ))}
                         {(availableAccolades || []).length === 0 && <p className="text-slate-500 col-span-2 text-center">No accolades available.</p>}
                    </div>
                </div>
            </Dialog>

            <Dialog isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Confirm Deletion">
                <div className="py-4">
                    <p className="text-lg">Are you sure you want to delete <span className="font-bold">{contestant?.name}</span>?</p>
                    <p className="text-sm text-slate-500 mt-2">All their points and awards will be permanently deleted. This action cannot be undone.</p>
                </div>
                <div className="flex justify-end pt-4 gap-2 border-t">
                    <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={handleDelete}>Yes, Delete</Button>
                </div>
            </Dialog>
        </div>
    );
}
