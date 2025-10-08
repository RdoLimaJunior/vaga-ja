import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import '@testing-library/jest-dom';
import WorkflowView from './WorkflowView';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';

const renderComponent = () => {
  render(
    <I18nextProvider i18n={i18n}>
      <WorkflowView />
    </I18nextProvider>
  );
};

describe('WorkflowView', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render the title', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve('Initial workflow content.'),
      })
    ) as any;

    renderComponent();
    expect(await screen.findByText('Application Workflow')).toBeInTheDocument();
  });

  it('should display an error message when fetch fails', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
      })
    ) as any;

    renderComponent();

    // Use the correct translation key from i18n.ts
    expect(await screen.findByText('Could not load the workflow document.')).toBeInTheDocument();
  });
});