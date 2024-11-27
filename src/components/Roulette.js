'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Wheel } from 'react-custom-roulette';

const Roulette = ({ selectedpeople, isSpinning, assignedPeople, onStopSpinning }) => {
  const [mounted, setMounted] = useState(false);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [availablePeople, setAvailablePeople] = useState([]);

  useEffect(() => {
    setMounted(true);
    // Get uploaded people from localStorage
    const uploadedPeople = localStorage.getItem('uploadedPeople');
    if (uploadedPeople) {
      const people = JSON.parse(uploadedPeople);
      setAvailablePeople(people);
    }
  }, []);

  useEffect(() => {
    if (selectedpeople) {
      // Find the index in the filtered list of unassigned people
      const unassignedPeople = availablePeople.filter(person => 
        !assignedPeople.some(assigned => assigned.id === person.id)
      );
      const availableIndex = unassignedPeople.findIndex(p => p.id === selectedpeople.id);
      setPrizeNumber(availableIndex >= 0 ? availableIndex : 0);
    }
    setMustSpin(isSpinning);
  }, [isSpinning, selectedpeople, assignedPeople, availablePeople]);

  // Filter out assigned people from the wheel
  const unassignedPeople = availablePeople.filter(person => 
    !assignedPeople.some(assigned => assigned.id === person.id)
  );

  const data = unassignedPeople.map(person => ({
    option: person.name,
    style: { 
      backgroundColor: '#ffffff',
      textColor: '#000000'
    }
  }));

  const handleStopSpinning = () => {
    setMustSpin(false);
    onStopSpinning && onStopSpinning();
  };

  if (!mounted || data.length === 0) return null;

  return (
    <div className="relative">
      <Wheel
        mustStartSpinning={mustSpin}
        prizeNumber={prizeNumber}
        data={data}
        onStopSpinning={handleStopSpinning}
        backgroundColors={['#ffffff']}
        textColors={['#000000']}
        outerBorderColor="#ccc"
        outerBorderWidth={4}
        innerRadius={0}
        radiusLineColor="#ccc"
        radiusLineWidth={1}
        fontSize={16}
        spinDuration={0.4}
      />
    </div>
  );
};

export default dynamic(() => Promise.resolve(Roulette), {
  ssr: false
}); 