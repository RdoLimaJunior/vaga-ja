import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import BigFiveResults from './BigFiveResults';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import { vi } from 'vitest';

const mockTestData = {
  teste: {
    dimensoes: [
      { id: 'O', nome: 'Openness', descricao: 'Description for Openness' },
      { id: 'C', nome: 'Conscientiousness', descricao: 'Description for Conscientiousness' },
    ],
    perguntas: [
      { id: 1, dimensao: 'O', texto: 'Question O1' },
      { id: 2, dimensao: 'O', texto: 'Question O2' },
      { id: 3, dimensao: 'C', texto: 'Question C1' },
    ],
  },
};

const mockResults = {
  O: 8,
  C: 5,
};

const renderComponent = (results = mockResults, testData = mockTestData) => {
  render(
    <I18nextProvider i18n={i18n}>
      <BigFiveResults results={results} testData={testData} onReset={vi.fn()} />
    </I18nextProvider>
  );
};

describe('BigFiveResults', () => {
  it('should render the results title', () => {
    renderComponent();
    expect(screen.getByText('Big Five (OCEAN) Results')).toBeInTheDocument();
  });

  it('should calculate max score correctly for each dimension', () => {
    renderComponent();

    // Openness has 2 questions, max score is 10 (2 * 5)
    expect(screen.getByText('Score: 8 of 10')).toBeInTheDocument();

    // Conscientiousness has 1 question, max score should be 5 (1 * 5)
    // This will fail because the current component calculates it based on Openness's questions (10)
    expect(screen.getByText('Score: 5 of 5')).toBeInTheDocument();
  });
});