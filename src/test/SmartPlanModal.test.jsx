import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SmartPlanModal from '../components/SmartPlanModal';

vi.mock('../utils/exportSmartPlanToDocx', () => ({
  exportSmartPlanToDocx: vi.fn(),
}));

import { exportSmartPlanToDocx } from '../utils/exportSmartPlanToDocx';

const noop = () => {};

afterEach(() => {
  vi.clearAllMocks();
});

describe('SmartPlanModal', () => {
  it('shows a loading indicator while generating', () => {
    render(<SmartPlanModal loading error={null} data={null} onClose={noop} />);
    expect(screen.getByText(/thinking through your day/i)).toBeInTheDocument();
  });

  it('shows the error message with a retry option', () => {
    const onRetry = vi.fn();
    render(
      <SmartPlanModal
        loading={false}
        error="Something went wrong"
        data={null}
        onClose={noop}
        onRetry={onRetry}
      />
    );
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    fireEvent.click(screen.getByText(/try again/i));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('renders the plan and tips on success', () => {
    const data = {
      plan: [{ time: '9:00 AM', task: 'Write report', note: 'Do it while fresh' }],
      tips: ['Take a 5-minute break every hour'],
    };
    render(
      <SmartPlanModal loading={false} error={null} data={data} date="2026-06-17" onClose={noop} />
    );
    expect(screen.getByText('Write report')).toBeInTheDocument();
    expect(screen.getByText('Take a 5-minute break every hour')).toBeInTheDocument();
  });

  it('exports to Word when "Save as Word" is clicked', () => {
    const data = { plan: [], tips: ['Tip'] };
    render(
      <SmartPlanModal loading={false} error={null} data={data} date="2026-06-17" onClose={noop} />
    );
    fireEvent.click(screen.getByText(/save as word/i));
    expect(exportSmartPlanToDocx).toHaveBeenCalledWith(data, '2026-06-17');
  });

  it('calls onClose when "Got it" is clicked', () => {
    const onClose = vi.fn();
    render(
      <SmartPlanModal loading={false} error={null} data={{ plan: [], tips: [] }} onClose={onClose} />
    );
    fireEvent.click(screen.getByText(/got it/i));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
