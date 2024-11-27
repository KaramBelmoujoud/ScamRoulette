'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import teams from '@/data/teams';

export default function AdminPage() {
  const [mounted, setMounted] = useState(false);
  const [teamAssignments, setTeamAssignments] = useState({});
  const [unassignedPeople, setUnassignedPeople] = useState([]);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    // Check for uploaded people data
    const uploadedPeople = localStorage.getItem('uploadedPeople');
    if (!uploadedPeople) {
      router.push('/upload');
      return;
    }

    // Initialize states
    const people = JSON.parse(uploadedPeople);
    setUnassignedPeople(people);
    
    const initialAssignments = teams.reduce((acc, team) => {
      acc[team.id] = [];
      return acc;
    }, {});
    setTeamAssignments(initialAssignments);
  }, [router]);

  const handleDragStart = (e, personId) => {
    e.dataTransfer.setData('personId', personId);
  };

  const handleDrop = (e, teamId) => {
    e.preventDefault();
    const personId = parseInt(e.dataTransfer.getData('personId'));
    const person = unassignedPeople.find(p => p.id === personId);

    // Remove person from previous team if they were assigned
    const newAssignments = { ...teamAssignments };
    Object.keys(newAssignments).forEach(tid => {
      newAssignments[tid] = newAssignments[tid].filter(p => p.id !== personId);
    });

    // Add person to new team
    newAssignments[teamId] = [...newAssignments[teamId], person];
    setTeamAssignments(newAssignments);

    // Update unassigned people
    setUnassignedPeople(unassignedPeople.filter(p => p.id !== personId));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const saveAssignments = () => {
    localStorage.setItem('teamAssignments', JSON.stringify(teamAssignments));
    alert('Team assignments saved!');
  };

  const handleReset = () => {
    const uploadedPeople = localStorage.getItem('uploadedPeople');
    if (uploadedPeople) {
      const people = JSON.parse(uploadedPeople);
      setUnassignedPeople(people);
      const initialAssignments = teams.reduce((acc, team) => {
        acc[team.id] = [];
        return acc;
      }, {});
      setTeamAssignments(initialAssignments);
    }
  };

  const handleUploadNew = () => {
    router.push('/upload');
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen p-8 max-w-6xl bg-white text-black mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Team Assignment Control</h1>
        <div className="space-x-4">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Reset Assignments
          </button>
          <button
            onClick={handleUploadNew}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Upload New Names
          </button>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Unassigned People</h2>
        <div className="flex flex-wrap gap-2 p-4 border rounded bg-gray-50">
          {unassignedPeople.map(person => (
            <div
              key={person.id}
              draggable
              onDragStart={(e) => handleDragStart(e, person.id)}
              className="px-3 py-2 bg-white border rounded shadow cursor-move hover:bg-blue-50"
            >
              {person.name}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        {teams.map(team => (
          <div
            key={team.id}
            onDrop={(e) => handleDrop(e, team.id)}
            onDragOver={handleDragOver}
            className="border rounded p-4 bg-white min-h-[200px]"
          >
            <h3 className="font-semibold mb-3">{team.name}</h3>
            <div className="space-y-2">
              {teamAssignments[team.id]?.map(person => (
                <div
                  key={person.id}
                  className="px-3 py-2 bg-gray-100 rounded"
                >
                  {person.name}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex space-x-4">
        <button
          onClick={saveAssignments}
          className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Save Assignments
        </button>
      </div>
    </div>
  );
} 