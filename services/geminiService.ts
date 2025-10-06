import { GoogleGenAI, Type } from '@google/genai';
import { AnalysisResult, Criterion } from '../types';
import i18n from '../i18n';

const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey });

const scoreSchema = {
  type: Type.OBJECT,
  properties: {
    criterionName: { type: Type.STRING },
    score: {
      type: Type.NUMBER,
      description: "A score from 0 to 100 for the criterion.",
    },
    justification: {
      type: Type.STRING,
      description: "A brief justification for the score, based on the CV and job description.",
    },
  },
  required: ['criterionName', 'score', 'justification'],
};

const workExperienceSchema = {
  type: Type.OBJECT,
  properties: {
    jobTitle: { type: Type.STRING },
    company: { type: Type.STRING },
    dates: { type: Type.STRING, description: "e.g., 'Jan 2020 - Present' or '2018 - 2022'" },
    description: { type: Type.STRING, description: "A brief summary of responsibilities and achievements." },
  },
  required: ['jobTitle', 'company', 'dates', 'description'],
};

const educationSchema = {
  type: Type.OBJECT,
  properties: {
    degree: { type: Type.STRING },
    institution: { type: Type.STRING },
    dates: { type: Type.STRING, description: "e.g., 'Aug 2016 - May 2020'" },
  },
  required: ['degree', 'institution', 'dates'],
};

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    candidateName: {
      type: Type.STRING,
      description: "The full name of the candidate, extracted from the CV.",
    },
    scores: {
      type: Type.ARRAY,
      items: scoreSchema,
    },
    workExperience: {
      type: Type.ARRAY,
      description: "A list of the candidate's relevant work experiences.",
      items: workExperienceSchema,
    },
    education: {
      type: Type.ARRAY,
      description: "A list of the candidate's educational background.",
      items: educationSchema,
    },
    skills: {
      type: Type.ARRAY,
      description: "A list of key skills (technical and soft) identified in the CV.",
      items: { type: Type.STRING },
    },
  },
  required: ['candidateName', 'scores', 'workExperience', 'education', 'skills'],
};


export const analyzeCandidate = async (
  jobDescription: string,
  candidateCv: string,
  criteria: Criterion[],
  language: string
): Promise<AnalysisResult> => {

  const criteriaNames = criteria.map(c => c.name).join(', ');
  const t = i18n.getFixedT(language);

  const prompt = t('gemini.prompt', {
    criteria_list: criteriaNames,
    job_description: jobDescription,
    candidate_cv: candidateCv,
    interpolation: { escapeValue: false }
  });


  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: analysisSchema,
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    return result as AnalysisResult;
  } catch (error) {
    console.error('Error analyzing candidate with Gemini:', error);
    throw new Error('Failed to analyze candidate.');
  }
};