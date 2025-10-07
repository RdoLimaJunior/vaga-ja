import { GoogleGenAI, Type } from '@google/genai';
import { AnalysisResult, Criterion, JobAssessment, JobImprovementSuggestions, GeneratedJobDescription } from '../types';
import i18n from '../i18n';

const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey });

// --- Schema for Candidate Analysis ---

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

// --- Schema for Criteria Suggestion ---

const suggestedCriterionSchema = {
    type: Type.OBJECT,
    properties: {
        name: {
            type: Type.STRING,
            description: "The name of the evaluation criterion."
        },
        weight: {
            type: Type.NUMBER,
            description: "An integer weight from 1 (Low) to 5 (High) representing the criterion's importance."
        }
    },
    required: ['name', 'weight']
};

const criteriaSuggestionSchema = {
    type: Type.OBJECT,
    properties: {
        criteria: {
            type: Type.ARRAY,
            description: "A list of 5 to 7 suggested criteria.",
            items: suggestedCriterionSchema
        }
    },
    required: ['criteria']
};

// --- Schema for Job Assessment ---

const jobAssessmentSchema = {
    type: Type.OBJECT,
    properties: {
        cboCode: {
            type: Type.STRING,
            description: "The corresponding CBO (Classificação Brasileira de Ocupações) code for the job, if a match is found. Example: '2522-10'."
        },
        cboTitle: {
            type: Type.STRING,
            description: "The official title for the matched CBO code. Example: 'Analista de Negócios'."
        },
        roleSummary: {
            type: Type.STRING,
            description: "A concise, one-paragraph summary of the role."
        },
        keyResponsibilities: {
            type: Type.ARRAY,
            description: "A list of the 4-6 most important key responsibilities.",
            items: { type: Type.STRING }
        },
        hardSkills: {
            type: Type.ARRAY,
            description: "A list of key technical/hard skills required.",
            items: { type: Type.STRING }
        },
        softSkills: {
            type: Type.ARRAY,
            description: "A list of key soft skills or behavioral competencies desired.",
            items: { type: Type.STRING }
        }
    },
    required: ['roleSummary', 'keyResponsibilities', 'hardSkills', 'softSkills']
};

// --- Schema for Job Improvement Suggestions ---

const jobImprovementSchema = {
    type: Type.OBJECT,
    properties: {
        suggestedTitle: {
            type: Type.STRING,
            description: "A more impactful and concise title for the role."
        },
        claritySuggestions: {
            type: Type.ARRAY,
            description: "A list of suggestions to improve clarity.",
            items: { type: Type.STRING }
        },
        engagementSuggestions: {
            type: Type.ARRAY,
            description: "A list of suggestions to improve tone and engagement.",
            items: { type: Type.STRING }
        },
        inclusivitySuggestions: {
            type: Type.ARRAY,
            description: "A list of suggestions to improve inclusivity.",
            items: { type: Type.STRING }
        },
        revisedDescription: {
            type: Type.STRING,
            description: "The full, revised text of the job description incorporating all suggestions."
        }
    },
    required: ['suggestedTitle', 'claritySuggestions', 'engagementSuggestions', 'inclusivitySuggestions', 'revisedDescription']
};

// --- Schema for Job Description Generation ---

const jobDescriptionGenerationSchema = {
    type: Type.OBJECT,
    properties: {
        jobTitle: {
            type: Type.STRING,
            description: "A clear and concise title for the job role."
        },
        fullDescriptionText: {
            type: Type.STRING,
            description: "The complete, well-formatted job description text, including sections for summary, responsibilities, and qualifications."
        }
    },
    required: ['jobTitle', 'fullDescriptionText']
};


export const generateJobDescriptionFromBrief = async (
    jobBrief: string,
    language: string
): Promise<GeneratedJobDescription> => {
    const t = i18n.getFixedT(language);
    const prompt = t('gemini.generateJobDescriptionPrompt', {
        job_brief: jobBrief,
        interpolation: { escapeValue: false }
    });
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: jobDescriptionGenerationSchema,
            }
        });
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        return result as GeneratedJobDescription;
    } catch (error) {
        console.error('Error generating job description with Gemini:', error);
        throw new Error('Failed to generate job description.');
    }
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

export const suggestCriteria = async (
    jobDescription: string,
    language: string
): Promise<Omit<Criterion, 'id'>[]> => {
    const t = i18n.getFixedT(language);
    const prompt = t('gemini.suggestCriteriaPrompt', {
        job_description: jobDescription,
        interpolation: { escapeValue: false }
    });

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: criteriaSuggestionSchema,
            }
        });
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        
        // Validate and clamp weights to be within 1-5 range
        if (result.criteria && Array.isArray(result.criteria)) {
            return result.criteria.map((c: any) => ({
                name: c.name,
                weight: Math.max(1, Math.min(5, Math.round(c.weight || 3))),
            }));
        }
        return [];

    } catch (error) {
        console.error('Error suggesting criteria with Gemini:', error);
        throw new Error('Failed to suggest criteria.');
    }
};

export const assessJobDescription = async (
    jobDescription: string,
    language: string
): Promise<JobAssessment> => {
    const t = i18n.getFixedT(language);
    const prompt = t('gemini.assessJobPrompt', {
        job_description: jobDescription,
        interpolation: { escapeValue: false }
    });

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: jobAssessmentSchema,
            }
        });
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        return result as JobAssessment;
    } catch (error) {
        console.error('Error assessing job description with Gemini:', error);
        throw new Error('Failed to assess job description.');
    }
};

export const suggestJobImprovements = async (
    jobDescription: string,
    language: string
): Promise<JobImprovementSuggestions> => {
    const t = i18n.getFixedT(language);
    const prompt = t('gemini.suggestImprovementsPrompt', {
        job_description: jobDescription,
        interpolation: { escapeValue: false }
    });

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: jobImprovementSchema,
            }
        });
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        return result as JobImprovementSuggestions;
    } catch (error) {
        console.error('Error suggesting job improvements with Gemini:', error);
        throw new Error('Failed to suggest job improvements.');
    }
};