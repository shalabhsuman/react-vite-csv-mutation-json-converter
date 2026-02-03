import { useMemo, useState } from 'react';
import { csvToJson } from './utils/csvToJson';

export default function App() {
  const [rawCsv, setRawCsv] = useState('');
  const [fileName, setFileName] = useState('');
  const [sampleLoading, setSampleLoading] = useState(false);
  const [sampleError, setSampleError] = useState('');

  const { converted, error } = useMemo(() => {
    if (!rawCsv) return { converted: [], error: '' };
    try {
      return { converted: csvToJson(rawCsv), error: '' };
    } catch (err) {
      return { converted: [], error: err.message };
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

  const loadSampleFile = async () => {
    setSampleLoading(true);
    setSampleError('');

    try {
      const response = await fetch('/dummy_mutation_data.csv');
      if (!response.ok) {
        throw new Error('Could not load sample CSV.');
      }
      const text = await response.text();
      setFileName('dummy_mutation_data.csv');
      setRawCsv(text);
    } catch (err) {
      setSampleError(err.message);
    } finally {
      setSampleLoading(false);
    }
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

        <div className="actions">
          <button type="button" onClick={loadSampleFile} disabled={sampleLoading}>
            {sampleLoading ? 'Loading sample...' : 'Use sample data'}
          </button>
          <a href="/dummy_mutation_data.csv" download className="ghost-button">
            Download sample CSV
          </a>
        </div>

        {fileName && <p className="meta">Loaded: {fileName}</p>}
        {error && <p className="error">{error}</p>}
        {sampleError && <p className="error">{sampleError}</p>}
        {converted.length > 0 && (
          <p className="meta">
            Parsed {converted.length} rows and {Object.keys(converted[0]).length} columns.
          </p>
        )}

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
