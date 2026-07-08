import { describe, test, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../Tabs';

describe('Tabs Component (Compound State)', () => {
  test('renders tab headers and switches content panels on trigger clicks', () => {
    render(
      <Tabs defaultValue="driver">
        <TabsList>
          <TabsTrigger value="driver">Driver Options</TabsTrigger>
          <TabsTrigger value="passenger">Passenger Options</TabsTrigger>
        </TabsList>
        <TabsContent value="driver">
          <p data-testid="driver-content">Welcome Driver Panel</p>
        </TabsContent>
        <TabsContent value="passenger">
          <p data-testid="passenger-content">Welcome Passenger Panel</p>
        </TabsContent>
      </Tabs>
    );

    // Initial check: driver is default, passenger content is not in document
    expect(screen.getByTestId('driver-content')).toBeInTheDocument();
    expect(screen.queryByTestId('passenger-content')).not.toBeInTheDocument();

    const driverTrigger = screen.getByRole('tab', { name: 'Driver Options' });
    const passengerTrigger = screen.getByRole('tab', { name: 'Passenger Options' });

    expect(driverTrigger).toHaveAttribute('aria-selected', 'true');
    expect(passengerTrigger).toHaveAttribute('aria-selected', 'false');

    // Click passenger tab
    fireEvent.click(passengerTrigger);

    // Content should switch
    expect(screen.queryByTestId('driver-content')).not.toBeInTheDocument();
    expect(screen.getByTestId('passenger-content')).toBeInTheDocument();
    expect(driverTrigger).toHaveAttribute('aria-selected', 'false');
    expect(passengerTrigger).toHaveAttribute('aria-selected', 'true');
  });
});
