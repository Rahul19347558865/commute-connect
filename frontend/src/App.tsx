import React, { useState, useEffect } from 'react';
import { Shield, Server, MapPin, Loader, CheckCircle, AlertTriangle } from 'lucide-react';
import { searchAddress } from './services/nominatim';

export default function App() {
  const [healthStatus, setHealthStatus] = useState<'loading' | 'healthy' | 'error'>('loading');
  const [healthData, setHealthData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => {
        if (!res.ok) throw new Error('API down');
        return res.json();
      })
      .then((data) => {
        setHealthStatus('healthy');
        setHealthData(data);
      })
      .catch(() => {
        setHealthStatus('error');
      });
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    try {
      const results = await searchAddress(searchQuery);
      setSearchResults(results);
    } catch (err) {
      console.error('Search failed', err);
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 xs:p-6 sm:p-8">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-small p-6 md:p-8 border border-slate-100">
        {/* Title */}
        <header className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Commute Connect</h1>
          <p className="text-sm text-slate-500 mt-1">Phase 0 - Core Integration Verification Screen</p>
        </header>

        {/* Status Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {/* Backend Status */}
          <div className="p-4 rounded-md border border-slate-200 bg-slate-50 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Express API Proxy</span>
              <Server className="w-4 h-4 text-slate-400" />
            </div>
            <div>
              {healthStatus === 'loading' && (
                <div className="flex items-center gap-2 text-slate-600 text-sm">
                  <Loader className="w-4 h-4 animate-spin text-brand-primary" />
                  Checking connection...
                </div>
              )}
              {healthStatus === 'healthy' && (
                <div className="flex items-center gap-2 text-brand-success text-sm font-medium">
                  <CheckCircle className="w-4 h-4" />
                  API is online & proxied
                </div>
              )}
              {healthStatus === 'error' && (
                <div className="flex items-center gap-2 text-brand-error text-sm font-medium">
                  <AlertTriangle className="w-4 h-4" />
                  API Connection Failed
                </div>
              )}
            </div>
            {healthData && (
              <span className="text-[11px] text-slate-400 mt-2 block font-mono">
                TS: {new Date(healthData.timestamp).toLocaleTimeString()}
              </span>
            )}
          </div>

          {/* Design System Reference */}
          <div className="p-4 rounded-md border border-slate-200 bg-slate-50 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Design Palette</span>
              <Shield className="w-4 h-4 text-slate-400" />
            </div>
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded-full bg-brand-primary border border-white" title="Primary Blue" />
              <div className="w-6 h-6 rounded-full bg-brand-success border border-white" title="Success Green" />
              <div className="w-6 h-6 rounded-full bg-brand-warning border border-white" title="Warning Yellow" />
              <div className="w-6 h-6 rounded-full bg-brand-error border border-white" title="Error Red" />
            </div>
            <span className="text-[11px] text-slate-400 mt-2 block">
              Inter Font & Mobile Breakpoints active
            </span>
          </div>
        </div>

        {/* Nominatim Search Integration Test */}
        <section className="border-t border-slate-100 pt-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand-primary" />
            OSM Nominatim Geocoding Verification
          </h2>
          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pickup or destination..."
              className="flex-1 px-3 py-2 border border-slate-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-brand-primary text-sm placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={searchLoading}
              className="bg-brand-primary hover:bg-brand-hover text-white px-4 py-2 rounded-sm text-sm font-medium transition-colors duration-150 flex items-center justify-center min-w-[80px]"
            >
              {searchLoading ? <Loader className="w-4 h-4 animate-spin" /> : 'Search'}
            </button>
          </form>

          {/* Results List */}
          {searchResults.length > 0 ? (
            <ul className="space-y-2 max-h-40 overflow-y-auto border border-slate-200 rounded-sm p-2 bg-slate-50">
              {searchResults.map((result, idx) => (
                <li key={idx} className="text-xs text-slate-700 py-1 border-b border-slate-100 last:border-0 truncate">
                  <span className="font-semibold text-brand-primary mr-1">
                    [{parseFloat(result.lat).toFixed(4)}, {parseFloat(result.lon).toFixed(4)}]
                  </span>
                  {result.display_name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400 italic text-center py-4 bg-slate-50 border border-slate-100 rounded-sm">
              Search a location to verify dynamic OSM Nominatim queries.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
