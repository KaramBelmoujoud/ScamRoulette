'use client';
import { useState, useEffect } from 'react';
import Roulette from './Roulette';
import teams from '@/data/teams';
import { useRouter } from 'next/navigation';

export default function ClientPage() {
  const [mounted, setMounted] = useState(false);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [teamAssignments, setTeamAssignments] = useState({});
  const [displayedAssignments, setDisplayedAssignments] = useState({});
  const [peopleQueue, setPeopleQueue] = useState([]);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const uploadedPeople = localStorage.getItem('uploadedPeople');
    if (!uploadedPeople) {
      router.push('/upload');
      return;
    }

    const savedAssignments = localStorage.getItem('teamAssignments');
    if (savedAssignments) {
      const assignments = JSON.parse(savedAssignments);
      setTeamAssignments(assignments);
      
      const emptyAssignments = teams.reduce((acc, team) => {
        acc[team.id] = [];
        return acc;
      }, {});
      setDisplayedAssignments(emptyAssignments);

      const queue = [];
      Object.entries(assignments).forEach(([teamId, members]) => {
        members.forEach(member => {
          queue.push({ person: member, teamId: parseInt(teamId) });
        });
      });
      
      for (let i = queue.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [queue[i], queue[j]] = [queue[j], queue[i]];
      }
      
      setPeopleQueue(queue);
    }
  }, [router]);

  const spinRoulette = () => {
    if (!isSpinning && peopleQueue.length > 0) {
      setIsSpinning(true);
      const nextAssignment = peopleQueue[0];
      setCurrentTeam(nextAssignment);
    }
  };

  const handleStopSpinning = () => {
    setIsSpinning(false);
    
    const nextAssignment = peopleQueue[0];
    if (nextAssignment) {
      setDisplayedAssignments(prev => ({
        ...prev,
        [nextAssignment.teamId]: [
          ...(prev[nextAssignment.teamId] || []),
          nextAssignment.person
        ]
      }));
      setPeopleQueue(prev => prev.slice(1));
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen p-8 flex flex-col bg-white text-black items-center gap-8">
      <h1 className="text-3xl font-bold">Team Assignment Roulette</h1>
      
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Remaining Assignments:</h2>
        <div className="text-lg">{peopleQueue.length} people left</div>
      </div>

      <Roulette 
        selectedpeople={currentTeam?.person} 
        isSpinning={isSpinning} 
        assignedPeople={Object.values(displayedAssignments).flat()}
        onStopSpinning={handleStopSpinning}
      />
      
      <button
        onClick={spinRoulette}
        disabled={isSpinning || peopleQueue.length === 0}
        className="px-6 py-3 bg-blue-500 text-white rounded-full disabled:bg-gray-400"
      >
        {isSpinning ? 'Spinning...' : peopleQueue.length === 0 ? 'All Assigned!' : 'Spin!'}
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-6xl">
        {teams.map(team => (
          <div key={team.id} className="border rounded-lg p-4 bg-white shadow">
            <h3 className="font-bold text-lg mb-3 text-center">{team.name}</h3>
            <ul className="space-y-2">
              {displayedAssignments[team.id]?.map((person, index) => (
                <li 
                  key={person.id}
                  className="px-3 py-2 bg-gray-50 rounded text-sm animate-fade-in"
                >
                  {person.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
} 