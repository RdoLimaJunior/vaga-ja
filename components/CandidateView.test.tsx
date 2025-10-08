import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import '@testing-library/jest-dom';
import CandidateView from './CandidateView';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';

const renderComponent = () => {
  render(
    <I18nextProvider i18n={i18n}>
      <CandidateView />
    </I18nextProvider>
  );
};

describe('CandidateView', () => {
  it('should render the initial form', () => {
    renderComponent();
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save & start assessments/i })).toBeInTheDocument();
  });
});