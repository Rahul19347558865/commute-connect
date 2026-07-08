import React, { useState, useEffect, useRef } from 'react';
import { searchAddress, NominatimSearchResult } from '../../services/nominatim';
import { Input } from '../ui/Input';
import { Loader } from '../icons';

interface LocationAutocompleteProps {
  label: string;
  placeholder?: string;
  initialValue?: string;
  error?: string;
  disabled?: boolean;
  onSelect: (val: { address: string; lat: number; lon: number }) => void;
}

/**
 * LocationAutocomplete - Autocomplete address finder using OpenStreetMap Nominatim API.
 * Emits select actions with typed string descriptions and latitude/longitude coordinates.
 */
export const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  label,
  placeholder = 'Search for a location...',
  initialValue = '',
  error,
  disabled = false,
  onSelect,
}) => {
  const [query, setQuery] = useState(initialValue);
  const [results, setResults] = useState<NominatimSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync with initial value updates
  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  // Debounced geocoding search
  useEffect(() => {
    if (!query.trim() || query.length < 3 || !isOpen) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const searchResults = await searchAddress(query);
        setResults(searchResults);
      } catch (err) {
        console.error('Location search failed:', err);
      } finally {
        setIsLoading(false);
      }
    }, 450); // 450ms debounce

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  // Handle click outside to close list overlay
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleItemSelect = (item: NominatimSearchResult) => {
    const address = item.display_name;
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    
    setQuery(address);
    setIsOpen(false);
    onSelect({ address, lat, lon });
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <Input
        label={label}
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        error={error}
        disabled={disabled}
        aria-autocomplete="list"
        autoComplete="off"
      />

      {isOpen && (isLoading || results.length > 0) && (
        <ul
          className="absolute z-layer-dropdown w-full mt-1 max-h-56 overflow-y-auto rounded-radius-md bg-neutral-surface dark:bg-slate-900 border border-neutral-borderLine dark:border-slate-800 shadow-shadow-medium"
          role="listbox"
        >
          {isLoading ? (
            <li className="p-3 text-center text-small text-neutral-textSub flex items-center justify-center gap-2">
              <Loader className="w-4 h-4 animate-spin text-brand-primary" />
              Searching locations...
            </li>
          ) : (
            results.map((item, idx) => (
              <li
                key={idx}
                onClick={() => handleItemSelect(item)}
                className="p-3 text-small text-neutral-textMain dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer border-b last:border-0 border-neutral-borderLine dark:border-slate-800 transition-colors"
                role="option"
                aria-selected={false}
              >
                {item.display_name}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};
export default LocationAutocomplete;
