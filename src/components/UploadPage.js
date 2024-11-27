'use client';
import { useState } from 'react';
import { read, utils } from 'xlsx';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const [error, setError] = useState('');
  const router = useRouter();

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
    try {
      const data = await file.arrayBuffer();
      const workbook = read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = utils.sheet_to_json(worksheet);

      // Transform data to match our people structure
      const people = jsonData.map((row, index) => ({
        id: index + 1,
        name: row.Name || row.name // Adjust based on your Excel column name
      }));

      // Store in localStorage
      localStorage.setItem('uploadedPeople', JSON.stringify(people));
      router.push('/admin');
    } catch (err) {
      setError('Error processing file. Please ensure it\'s a valid Excel file.');
    }
  };

  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center bg-white text-black">
      <h1 className="text-3xl font-bold mb-8">Upload Team Members</h1>
      
      <div className="w-full max-w-md p-6 border rounded-lg shadow-lg">
        <label className="block mb-4">
          <span className="text-gray-700">Upload Excel File</span>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </label>

        {error && (
          <p className="text-red-500 text-sm mt-2">{error}</p>
        )}

        <div className="mt-4 text-sm text-gray-600">
          <p>Excel file should have a column named &quot;Name&quot; with team member names.</p>
        </div>
      </div>
    </div>
  );
} 