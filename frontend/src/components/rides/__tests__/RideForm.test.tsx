import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RideForm } from '../RideForm';

// Mock LocationAutocomplete to simplify coordinate selection testing
vi.mock('../LocationAutocomplete', () => {
  return {
    default: ({ label, onSelect, error }: any) => (
      <div>
        <label htmlFor={label}>{label}</label>
        <input
          id={label}
          onChange={(e) => onSelect({ address: e.target.value, lat: 28.5, lon: 77.2 })}
        />
        {error && <p>{error}</p>}
      </div>
    ),
    LocationAutocomplete: ({ label, onSelect, error }: any) => (
      <div>
        <label htmlFor={label}>{label}</label>
        <input
          id={label}
          onChange={(e) => onSelect({ address: e.target.value, lat: 28.5, lon: 77.2 })}
        />
        {error && <p>{error}</p>}
      </div>
    )
  };
});

describe('RideForm & Validations (Client Schema)', () => {
  test('renders form components with defaults and preview card', () => {
    render(<RideForm onSubmit={async () => {}} />);

    expect(screen.getByLabelText('Pickup Location')).toBeInTheDocument();
    expect(screen.getByLabelText('Destination Location')).toBeInTheDocument();
    expect(screen.getByLabelText('Departure Date')).toBeInTheDocument();
    expect(screen.getByLabelText('Departure Time')).toBeInTheDocument();
    expect(screen.getByLabelText('Available Seats')).toHaveValue(1);
    expect(screen.getByText('Live Offering Preview')).toBeInTheDocument();
  });

  test('validates coordinate selections and details constraints on submit', async () => {
    const handleSubmit = vi.fn();
    render(<RideForm onSubmit={handleSubmit} />);

    const submitBtn = screen.getByRole('button', { name: 'Publish Ride' });
    fireEvent.click(submitBtn);

    expect(await screen.findByText('Pickup address is required')).toBeInTheDocument();
    expect(await screen.findByText('Destination address is required')).toBeInTheDocument();
    expect(await screen.findByText('Departure date is required')).toBeInTheDocument();
    expect(await screen.findByText('Departure time is required')).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  test('refines validation if pickup and destination matches exactly', async () => {
    const handleSubmit = vi.fn();
    render(<RideForm onSubmit={handleSubmit} />);

    const pickupInput = screen.getByLabelText('Pickup Location');
    const destInput = screen.getByLabelText('Destination Location');

    // Autocomplete mock will trigger onSelect, setting both address and coordinates
    fireEvent.change(pickupInput, { target: { value: 'IIT Delhi Gate 1' } });
    fireEvent.change(destInput, { target: { value: 'IIT Delhi Gate 1' } });

    const submitBtn = screen.getByRole('button', { name: 'Publish Ride' });
    fireEvent.click(submitBtn);

    expect(await screen.findByText('Pickup and destination locations cannot be identical.')).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });
});
