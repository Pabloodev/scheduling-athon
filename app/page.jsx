"use client"

import Image from 'next/image';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { FileSpreadsheet, Copy, CheckCircle2, ChevronLeft } from 'lucide-react';

export default function Page() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [region, setRegion] = useState('SBC');
  const [copyMessage, setCopyMessage] = useState('');

  const filterDataByRegion = useCallback((data, region) => {
    return data.filter(
      (row) =>
        (row.Diagnóstico === 'CLIENTE AUSENTE' && row.Setor === region) ||
        (row.Diagnóstico === 'ENDEREÇO NÃO LOCALIZADO ' && row.Setor === region)
    );
  }, []);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
          alert('Por favor, selecione um arquivo Excel.');
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const binaryStr = e.target?.result;

          try {
            const workBook = XLSX.read(binaryStr, { type: 'binary' });
            const worksheet = workBook.Sheets[workBook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            setData(jsonData);
            const filteredOS = filterDataByRegion(jsonData, region);
            setFilteredData(filteredOS);
          } catch (error) {
            console.error('Erro ao ler o arquivo Excel:', error);
            alert('Erro ao processar o arquivo Excel.');
          }
        };
        reader.readAsBinaryString(file);
      }
    },
    [filterDataByRegion, region]
  );

  const handleCopy = () => {
    const text = filteredData
      .map((row) => `- ${row.Cliente} - ${row.Assunto.substring(2)}\n`)
      .join('');
    navigator.clipboard.writeText(text);
    setCopyMessage('Copiado!');

    setTimeout(() => {
      setCopyMessage('');
    }, 2000);
  };

  const handleRegionChange = useCallback(
    (selectedRegion) => {
      setCopyMessage('');
      setRegion(selectedRegion);
      const filteredOS = filterDataByRegion(data, selectedRegion);
      setFilteredData(filteredOS);
    },
    [data, filterDataByRegion]
  );

  const handleReset = () => {
    setData([]);
    setFilteredData([]);
    setRegion('SBC');
    setCopyMessage('');
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
  });

  return (
    <div className="min-h-screen text-white">

      <div className='flex items-center justify-center relative'>
        <div className='flex items-center gap-3 justify-center mt-10'>
          <Image src={"/athonfav.png"} width={30} height={30} alt='Icon Athon Telecom' />
          <h1 className='text-xl'>Reagendamento Ausentes</h1>
        </div>
      </div>

      {/* File Upload Area */}
      <div
        {...getRootProps()}
        className={`
            mt-8 mb-10 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-all duration-200 ease-in-out
            ${isDragActive ? 'border-cyan-400 bg-blue-800/50' : 'border-white/30 hover:border-white/50'}
          `}
      >
        <input {...getInputProps()} />
        <FileSpreadsheet className="w-10 h-10 mx-auto mb-4" />
        <p className="text-base">
          {isDragActive
            ? 'Solte o arquivo aqui...'
            : 'Arraste e solte o arquivo Excel aqui ou clique para selecionar'}
        </p>
      </div>

      {/* Region Buttons */}
      <div className="flex space-x-4 items-center justify-center mb-8">
        {['SBC', 'GRAJAÚ', 'FRANCO'].map((regionName) => (
          <button
            key={regionName}
            onClick={() => handleRegionChange(regionName)}
            className={`
                px-6 py-2 rounded-full transition-all cursor-pointer duration-200 text-sm
                ${region === regionName
                ? 'bg-zinc-800'
                : 'bg-zinc-900/50'
              }
              `}
          >
            {regionName}
          </button>
        ))}
      </div>

      {/* Results Area */}
      <div className="max-w-2xl mx-auto">
        {filteredData.length > 0 ? (
          <div className="rounded-lg p-6">
            <ul className="flex flex-col items-center text-start space-y-1 mb-6">
              {filteredData.map((row, index) => (
                <li
                  key={index}
                  className={`
                      p-1 rounded text-sm
                      ${row.Diagnóstico === 'ENDEREÇO NÃO LOCALIZADO '
                      ? 'text-orange-400'
                      : ''
                    }
                    `}
                >
                  <strong>{row.Cliente}</strong> - {row.Assunto.substring(2)}
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-6 py-2 bg-zinc-900 hover:bg-zinc-700 rounded-full transition-colors cursor-pointer"
              >
                <Copy className="w-4 h-4" />
                Copiar Lista
              </button>
              {copyMessage && (
                <span className="flex items-center gap-2 text-green-300">
                  <CheckCircle2 className="w-4 h-4" />
                  {copyMessage}
                </span>
              )}
            </div>
          </div>
        ) : (
          <p className="text-center text-base text-orange-300">
            Nenhum dado para exibir. Importe o arquivo de ordens de serviço.
          </p>
        )}
      </div>

      {/* Legend */}
      <div className="fixed bottom-8 right-8 p-4 rounded-lg">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-4 h-4 bg-blue-800/30 border border-white/30 rounded bg-white"></span>
          <p>Cliente Ausente</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-4 h-4 text-orange-400 border border-orange-500/30 rounded bg-orange-500"></span>
          <p>Endereço não localizado</p>
        </div>
      </div>
    </div>
  );
}