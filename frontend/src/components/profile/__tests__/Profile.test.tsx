import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProfileForm } from '../ProfileForm';

describe('ProfileForm & Validations (Client Schema)', () => {
  const initialPassengerData = {
    full_name: 'Rahul Sharma',
    role: 'passenger',
    college_company: 'IIT Delhi',
    bio: 'Commutes daily',
    gender: 'male',
    contact_number: '9876543210',
    emergency_contact: '9876543211',
    preferred_pickup_area: 'Connaught Place',
    preferred_drop_area: 'IIT Gate',
    travel_preferences: 'Prefers silent rides',
  };

  test('renders form fields with initial passenger data and hides vehicle section', () => {
    render(
      <ProfileForm
        initialData={initialPassengerData}
        onSubmit={async () => {}}
      />
    );

    expect(screen.getByLabelText('Full Name')).toHaveValue('Rahul Sharma');
    expect(screen.getByLabelText('Commuter Role')).toHaveValue('passenger');
    expect(screen.getByLabelText('College / Company Name')).toHaveValue('IIT Delhi');
    expect(screen.queryByText('Vehicle Information (Drivers & Share Pools)')).not.toBeInTheDocument();
  });

  test('dynamically displays vehicle section when role is changed to driver', async () => {
    render(
      <ProfileForm
        initialData={initialPassengerData}
        onSubmit={async () => {}}
      />
    );

    const roleSelect = screen.getByLabelText('Commuter Role');
    fireEvent.change(roleSelect, { target: { value: 'driver' } });

    expect(await screen.findByText('Vehicle Information (Drivers & Share Pools)')).toBeInTheDocument();
    expect(screen.getByLabelText('Vehicle Type')).toBeInTheDocument();
  });

  test('validates minimum length constraints on form submission', async () => {
    const handleSubmit = vi.fn();
    render(
      <ProfileForm
        initialData={{ ...initialPassengerData, full_name: '' }}
        onSubmit={handleSubmit}
      />
    );

    const submitBtn = screen.getByRole('button', { name: 'Save Changes' });
    fireEvent.click(submitBtn);

    expect(await screen.findByText('Full name is required (min 2 characters)')).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });
});
