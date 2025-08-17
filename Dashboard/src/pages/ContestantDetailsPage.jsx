// src/Pages/ContestantDetailsPage.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { format, parseISO } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent } from '../Components/ui/Card';
import { FancyCard } from '../Components/ui/FancyCard';
import { Button } from '../Components/ui/Button';
import { Dialog } from '../Components/ui/Dialog';
import { Input } from '../Components/ui/Input';
import { Label } from '../Components/ui/Label';
import { AwardDisplay } from '../Components/ui/AwardDisplay';
import { StarIcon } from '../Components/icons/StarIcon';
import { AwardIcon } from '../Components/icons/AwardIcon';
import { PlusCircleIcon } from '../Components/icons/PlusCircleIcon';
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
        const safeTs = (d) => {
            if (!d) return null;
            try {
                const parsed = parseISO(d);
                if (!isNaN(parsed)) return parsed.getTime();
            } catch (_) {}
            const t = new Date(d).getTime();
            return Number.isFinite(t) ? t : null;
        };

        const pointsLog = (details.startResponse || []).map((entry, index) => ({
            type: 'point',
            date: entry.dateTime,
            ts: safeTs(entry.dateTime),
            value: `+${entry.number}`,
            reason: entry.reason,
            key: `point-${entry.id || index}`
        }));
    const accoladesLog = (details.accolade || []).map((entry, index) => {
            const fullAccolade = availableAccolades.find(acc => acc.name === entry.name);
            return {
                type: 'accolade',
                date: entry.dateTime || null,
                ts: safeTs(entry.dateTime),
                value: fullAccolade ? fullAccolade.description : entry.name,
        reason: entry.reason || '—',
                key: `accolade-${entry.id || index}`,
                iconType: entry.name
            };
        });
        const log = [...pointsLog, ...accoladesLog];
        log.sort((a, b) => {
            if (a.ts === null && b.ts === null) return 0;
            if (a.ts === null) return 1;
            if (b.ts === null) return -1;
            return b.ts - a.ts;
        });
        return log;
    }, [details, availableAccolades]);

    // 🔽 تعريف الأعمدة للجدول المتقدم (نفس أسلوب صفحة النتائج)
    const columns = useMemo(() => [
        {
            accessorKey: 'type',
            header: 'النوع',
            cell: info => {
                const t = info.row.original.type;
                if (t === 'point') {
                    return (
                        <span className="inline-flex items-center gap-1 text-green-700">
                            <PlusCircleIcon className="w-4 h-4" />
                            <span>نقاط</span>
                        </span>
                    );
                }
                return (
                    <span className="inline-flex items-center gap-1 text-yellow-700">
                        <AwardIcon className="w-4 h-4" />
                        <span>وسام</span>
                    </span>
                );
            }
        },
        {
            accessorKey: 'value',
            header: 'الحدث',
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
            header: 'السبب',
        },
        {
            accessorKey: 'date',
            header: 'التاريخ',
            cell: ({ getValue }) => {
                const v = getValue();
                if (!v) return '—';
                let d;
                try { d = parseISO(v); } catch (e) { return '—'; }
                return isNaN(d) ? '—' : format(d, 'yyyy/MM/dd');
            },
            sortingFn: (rowA, rowB) => {
                const a = rowA.original.ts ?? -Infinity;
                const b = rowB.original.ts ?? -Infinity;
                return a === b ? 0 : a > b ? 1 : -1;
            },
        }
    ], []);

    if (isLoading) return <div className="text-center p-8">Loading Details...</div>;
    if (error) return <div className="text-center p-8 text-red-500">{error}</div>;
    if (!contestant || !details) return <div className="text-center p-8"><h2 className="text-2xl font-bold">Contestant Not Found</h2></div>;

    return (
    <div className="space-y-8 max-w-5xl mx-auto py-6 px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
                <div className="mb-6 md:mb-0">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2 tracking-tight break-words">{details.name}</h2>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed break-words">{details.description}</p>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 w-full md:w-auto">
            <Button variant="outline" className="w-full md:w-auto px-5 py-2 rounded-lg border-2 border-indigo-200 hover:border-indigo-400 transition text-sm" onClick={() => setBadgeModalOpen(true)}>
                        <span className="font-semibold text-indigo-700">Grant Award</span>
                    </Button>
            <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white w-full md:w-auto px-5 py-2 rounded-lg shadow-md font-semibold transition text-sm" onClick={() => setPointsModalOpen(true)}>
                        Add Points
                    </Button>
            <Button variant="destructive" className="w-full md:w-auto px-5 py-2 rounded-lg font-semibold text-sm" onClick={() => setDeleteModalOpen(true)}>
                        Delete
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <FancyCard wrapperClassName="md:col-span-1">
                    <CardHeader className="p-4 pb-1"><CardTitle className="text-lg font-bold text-slate-800">Total Points</CardTitle></CardHeader>
                    <CardContent className="p-4 pt-2">
                        <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-gradient-to-b from-slate-50 to-white p-4 text-center">
                            <div className="absolute -right-10 -top-10 h-20 w-20 rounded-full bg-indigo-100 blur-2xl group-hover:bg-indigo-200 transition-colors" />
                            <div className="absolute -left-10 -bottom-10 h-20 w-20 rounded-full bg-purple-100 blur-2xl group-hover:bg-purple-200 transition-colors" />
                            <p className="relative z-10 text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm">{details.totalOfStars}</p>
                        </div>
                    </CardContent>
                </FancyCard>
                <FancyCard wrapperClassName="md:col-span-2">
                    <CardHeader className="p-4 pb-1"><CardTitle className="text-lg font-bold text-slate-800">Awards Received</CardTitle></CardHeader>
                    <CardContent className="p-4 pt-2">
                        <div className="flex items-center gap-3 sm:gap-4 flex-wrap text-sm">
                            <AwardDisplay icon={<StarIcon />} count={countAwards(details.accolade, 'starOfCreativity')} title="Star of Creativity" colorClass="text-red-400" />
                            <AwardDisplay icon={<StarIcon />} count={countAwards(details.accolade, 'starOfParticipation')} title="Star of Participation" colorClass="text-yellow-400" />
                            <AwardDisplay icon={<AwardIcon />} count={countAwards(details.accolade, 'medalOfCreativity')} title="Medal of Creativity" colorClass="text-red-400" />
                            <AwardDisplay icon={<AwardIcon />} count={countAwards(details.accolade, 'medalOfParticipation')} title="Medal of Participation" colorClass="text-yellow-500" />
                            {(details.accolade || []).length === 0 && <p className="text-slate-400 italic">No awards yet.</p>}
                        </div>
                    </CardContent>
                </FancyCard>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white/80 backdrop-blur-sm shadow-md p-4">
                                <EnhancedTable
                                    data={combinedLog}
                                    columns={columns}
                                    enableExport={true}
                                    exportFileName={`سجل-${(details?.name || 'المتسابق')}-${new Date().toISOString().slice(0,10)}.xlsx`}
                                />
            </div>

            <Dialog isOpen={isPointsModalOpen} onClose={() => setPointsModalOpen(false)} title="Add New Points">
                <div className="grid gap-6 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="points" className="font-semibold text-slate-700">Number of Points</Label>
                        <Input id="points" type="number" value={points} onChange={e => setPoints(e.target.value)} placeholder="e.g., 10" className="rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="reason" className="font-semibold text-slate-700">Reason for Awarding</Label>
                        <Input id="reason" value={reason} onChange={e => setReason(e.target.value)} placeholder="e.g., Active participation" className="rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500" />
                    </div>
                    <Button onClick={handleAddPoints} className="w-full mt-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg font-semibold shadow-md transition">Add</Button>
                </div>
            </Dialog>

            <Dialog isOpen={isBadgeModalOpen} onClose={() => setBadgeModalOpen(false)} title="Grant an Award">
                 <div className="grid gap-6 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="awardReason" className="font-semibold text-slate-700">Reason (Optional)</Label>
                        <Input id="awardReason" value={awardReason} onChange={e => setAwardReason(e.target.value)} placeholder="e.g., For his great initiative" className="rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500" />
                    </div>
                    <div className="border-t pt-6 mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {(availableAccolades || []).map(acc => (
                            <Button key={acc.id} variant="outline" className="w-full px-4 py-2 rounded-lg border-2 border-indigo-200 hover:border-indigo-400 font-semibold text-indigo-700 transition" onClick={() => handleAwardBadge(acc.id)}>
                                {acc.description || acc.name}
                            </Button>
                        ))}
                         {(availableAccolades || []).length === 0 && <p className="text-slate-400 col-span-2 text-center italic">No accolades available.</p>}
                    </div>
                </div>
            </Dialog>

            <Dialog isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Confirm Deletion">
                <div className="py-4">
                    <p className="text-lg font-semibold text-slate-800">Are you sure you want to delete <span className="font-bold text-red-600">{contestant?.name}</span>?</p>
                    <p className="text-sm text-slate-500 mt-2">All their points and awards will be permanently deleted. This action cannot be undone.</p>
                </div>
                <div className="flex flex-col sm:flex-row justify-end pt-4 gap-2 border-t">
                    <Button variant="outline" className="w-full sm:w-auto px-6 py-2 rounded-lg font-semibold" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
                    <Button variant="destructive" className="w-full sm:w-auto px-6 py-2 rounded-lg font-semibold" onClick={handleDelete}>Yes, Delete</Button>
                </div>
            </Dialog>
        </div>
    );
}
