import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../Card';

describe('Card Component (Compound Composition)', () => {
  test('renders Card and all of its subcomponents together cleanly', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title Text</CardTitle>
          <CardDescription>Card Description Text</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This is the main card body contents.</p>
        </CardContent>
        <CardFooter>
          <button>Card Button</button>
        </CardFooter>
      </Card>
    );

    expect(screen.getByText('Card Title Text')).toBeInTheDocument();
    expect(screen.getByText('Card Description Text')).toBeInTheDocument();
    expect(screen.getByText('This is the main card body contents.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Card Button' })).toBeInTheDocument();
  });
});
