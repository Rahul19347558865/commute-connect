import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { RideCard } from '../RideCard';

describe('RideCard Component', () => {
  const mockRide = {
    id: 'ride-id-101',
    driver_id: 'driver-id-202',
    pickup_location: 'IIT Gate 1',
    destination: 'CP Metro Gate 2',
    departure_time: '2026-07-08T09:00:00.000Z',
    available_seats: 3,
    contribution_type: 'paid' as const,
    contribution_amount: 50,
    status: 'active',
    driver: {
      full_name: 'Rahul Sharma',
      profile_photo: null,
      college_company: 'IIT Delhi',
      vehicle_information: {
        vehicle_type: 'car',
        company: 'Maruti Suzuki',
        model: 'Swift LXi',
        color: 'White',
      },
    },
  };

  test('displays driver name, destinations, available seats, and vehicle description details', () => {
    render(
      <MemoryRouter>
        <RideCard ride={mockRide} />
      </MemoryRouter>
    );

    expect(screen.getByText('Rahul Sharma')).toBeInTheDocument();
    expect(screen.getByText('IIT Delhi')).toBeInTheDocument();
    expect(screen.getByText('IIT Gate 1')).toBeInTheDocument();
    expect(screen.getByText('CP Metro Gate 2')).toBeInTheDocument();
    expect(screen.getByText('3 seats left')).toBeInTheDocument();
    expect(screen.getByText('Vehicle:')).toBeInTheDocument();
    expect(screen.getByText('White Maruti Suzuki Swift LXi')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('View Details')).toBeInTheDocument();
  });
});
