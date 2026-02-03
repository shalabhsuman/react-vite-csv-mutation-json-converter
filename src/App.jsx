import { useMemo, useState } from 'react';

function parseCsvLine(line) {
  const result = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      const next = line[i + 1];
      if (insideQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

function csvToJson(csvText) {
  const lines = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length < 2) {
    throw new Error('CSV needs at least a header row and one data row.');
  }

  const headers = parseCsvLine(lines[0]);

  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    return headers.reduce((row, header, index) => {
      row[header] = values[index] ?? '';
      return row;
    }, {});
  });
}

export default function App() {
  const [rawCsv, setRawCsv] = useState('');
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');

  const converted = useMemo(() => {
    if (!rawCsv) return [];

    try {
      setError('');
      return csvToJson(rawCsv);
    } catch (err) {
      setError(err.message);
      return [];
    }
  }, [rawCsv]);

  const jsonText = useMemo(
    () => (converted.length > 0 ? JSON.stringify(converted, null, 2) : ''),
    [converted]
  );

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const text = await file.text();
    setRawCsv(text);
  };

  const downloadJson = () => {
    if (!jsonText) return;

    const blob = new Blob([jsonText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const baseName = fileName.replace(/\.[^.]+$/, '') || 'converted';

    link.href = url;
    link.download = `${baseName}.json`;
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <main className="app-shell">
      <section className="panel">
        <h1>CSV to JSON Converter</h1>
        <p>Upload a CSV file and instantly get JSON output.</p>

        <label className="input-wrap" htmlFor="csv-file">
          <span>Choose CSV file</span>
          <input id="csv-file" type="file" accept=".csv,text/csv" onChange={handleFileSelect} />
        </label>

        {fileName && <p className="meta">Loaded: {fileName}</p>}
        {error && <p className="error">{error}</p>}

        <button type="button" onClick={downloadJson} disabled={!jsonText}>
          Download JSON
        </button>
      </section>

      <section className="panel output">
        <h2>JSON Output</h2>
        <pre>{jsonText || 'Upload a CSV file to see converted JSON here.'}</pre>
      </section>
    </main>
  );
}
