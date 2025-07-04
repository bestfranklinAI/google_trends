import { render } from '@testing-library/react';
import React from 'react';
import { FilterPanel } from '../../src/frontend/components/FilterPanel';

test('renders filter panel', () => {
  const { getByLabelText } = render(
    <FilterPanel params={{ geo: 'HK', hl: 'en' }} onChange={() => {}} />
  );
  expect(getByLabelText('Location')).toBeInTheDocument();
});
