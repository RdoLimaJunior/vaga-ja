import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';


// Fix: Initialize i18next with resources, which was missing.
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          app: {
            title: 'VagaJá',
            recruiterArea: "Recruiter Area",
            candidateArea: "Candidate Area",
            recruiterDescription: "Manage jobs, candidates, and AI analysis.",
            candidateDescription: "Take assessments and track your applications.",
            analyzeButton: 'Analyze & Rank Candidates',
            analysisResultTitle: 'Ranked Candidates',
            behavioralAssessmentsTitle: 'Behavioral Assessments',
            steps: {
              step1: "Define Job & Pipeline",
              step2: "Add Candidates & Criteria",
              step3: "View Results"
            },
            buttons: {
              next: "Next: Add Candidates",
              back: "Back to Job Setup",
              startOver: "Analyze Another Role",
              assessJob: "Assess Job Description",
              suggestImprovements: "Suggest Improvements with AI"
            }
          },
          step1: {
            jobDescription: "Job Description",
            jobDescriptionPlaceholder: "Paste the full job description here...",
          },
          step2: {
            candidates: "Candidate CVs",
            candidatesPlaceholder: "Paste one or more candidate CVs here, separated by '---'",
            criteria: "Evaluation Criteria"
          },
          criteria: {
            title: 'Evaluation Criteria',
            name: 'Criterion Name',
            namePlaceholder: 'e.g., React Experience',
            weight: 'Weight',
            weights: {
                low: 'Low',
                medium: 'Medium',
                high: 'High',
            },
            add: 'Add Criterion',
            remove: 'Remove Criterion',
            suggestWithAI: 'Suggest with AI',
          },
          loader: {
            analyzingText: 'Analyzing...',
            waitText: 'This might take a moment.',
            loadingTest: 'Loading Test...'
          },
          candidateCard: {
            overallScore: 'Overall Score',
            scoreBreakdown: 'Score Breakdown',
            justification: 'Justification',
            workExperience: 'Work Experience',
            education: 'Education',
            skills: 'Key Skills',
            showMore: 'Show CV Details',
            showLess: 'Hide CV Details',
          },
          candidateView: {
            welcomeTitle: "Candidate Profile",
            welcomeSubtitle: "Please fill in your details below to begin the assessment process.",
            form: {
              name: "Full Name",
              namePlaceholder: "e.g., Jane Doe",
              email: "Email Address",
              emailPlaceholder: "e.g., jane.doe@example.com",
              phone: "Phone (Optional)",
              phonePlaceholder: "e.g., +1 (555) 123-4567",
              role: "Desired Role",
              rolePlaceholder: "e.g., Senior Software Engineer",
              submitButton: "Save & Start Assessments",
              welcomeBack: "Welcome back, {{name}}!",
              editInfo: "Edit Information",
              assessmentsReady: "Your assessments are ready below."
            }
          },
          error: {
            analysisFailed: 'Analysis Failed',
            tryAgain: 'An error occurred while analyzing. Please check your inputs and try again.',
            loadTestError: 'Failed to load the test. Please try again later.',
            couldNotLoad: 'Could not load test data.'
          },
          jobAssessment: {
            title: "Job Description Analysis",
            summary: "Role Summary",
            responsibilities: "Key Responsibilities",
            hardSkills: "Technical Skills",
            softSkills: "Soft Skills"
          },
          jobImprovements: {
            title: "AI-Powered Suggestions",
            suggestedTitle: "Suggested Title",
            clarity: "Clarity",
            engagement: "Engagement",
            inclusivity: "Inclusivity",
            revisedDescription: "Revised Description"
          },
          tests: {
              startButton: 'Start Test',
              big_five: {
                title: "Big Five (OCEAN) Personality Test",
                description: "Assess core personality traits: Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism to understand a candidate's work style.",
              },
              disc: {
                  title: "DISC Behavioral Assessment",
                  description: "Measure four behavioral profiles: Dominance, Influence, Steadiness, and Conscientiousness to predict workplace behavior and team dynamics.",
              },
              sjt: {
                title: "Situational Judgment Test (SJT)",
                description: "Evaluate decision-making and problem-solving skills by presenting realistic work-related scenarios and asking for the best course of action.",
              }
          },
          test_shared: {
            question: "Question",
            of: "of",
            previous: "Previous",
            next: "Next",
            finish: "Finish & See Results",
            resultsTitle: "Test Results",
            resetButton: "Take Test Again",
            closeButton: "Close",
            errorTitle: "Error",
          },
          disc_test: {
              instruction: "For each group of four words, select one that is MOST like you and one that is LEAST like you.",
              most: "Most",
              least: "Least",
              resultsTitle: "DISC Assessment Results",
              D: "Dominance",
              I: "Influence",
              S: "Steadiness",
              C: "Conscientiousness",
          },
          sjt_test: {
              resultsTitle: "Situational Judgment Test Results",
              competencyScore: "Competency Score"
          },
          big_five_test: {
            results: {
              title: "Big Five (OCEAN) Results",
              score_of: "Score: {{score}} of {{max}}",
              interpretation: "Interpretation",
            },
            interpretations: {
              O: {
                high: "High scorers are imaginative, curious, and open to new experiences and unconventional ideas.",
                low: "Low scorers tend to be conventional, practical, and prefer routine over variety.",
                moderate: "You have a balanced approach between being practical and open to new ideas."
              },
              C: {
                high: "High scorers are organized, disciplined, and reliable. They are goal-oriented and detail-focused.",
                low: "Low scorers tend to be more spontaneous, flexible, and less organized.",
                moderate: "You are moderately organized and reliable, balancing structure with flexibility."
              },
              E: {
                high: "High scorers are sociable, energetic, and assertive. They thrive in social situations.",
                low: "Low scorers are more reserved, reflective, and prefer smaller groups or solitude.",
                moderate: "You enjoy social interactions but also value your alone time."
              },
              A: {
                high: "High scorers are compassionate, cooperative, and trusting. They prioritize harmony in relationships.",
                low: "Low scorers tend to be more competitive, skeptical, and can be seen as more direct or blunt.",
                moderate: "You are generally cooperative but can be assertive when necessary."
              },
              N: {
                high: "High scorers are prone to experiencing negative emotions like anxiety, stress, and moodiness.",
                low: "Low scorers are emotionally stable, resilient, and calm under pressure.",
                moderate: "You experience a normal range of emotions and are generally resilient to stress."
              }
            }
          },
          dimensions: {
            O: "Openness",
            C: "Conscientiousness",
            E: "Extraversion",
            A: "Agreeableness",
            N: "Neuroticism",
            teamwork: "Teamwork",
            problemSolving: "Problem Solving",
            communication: "Communication",
            integrity: "Integrity"
          },
          gemini: {
            prompt: `
              You are an expert technical recruiter. Your task is to analyze a candidate's CV against a job description and score them on a set of predefined criteria.
              
              Instructions:
              1.  Carefully read the Job Description to understand the role's requirements.
              2.  Thoroughly review the Candidate's CV to assess their skills and experience.
              3.  Extract the candidate's full name from the CV.
              4.  For each of the following criteria, provide a score from 0 (no match) to 100 (perfect match): {{criteria_list}}.
              5.  For each score, provide a brief, one-sentence justification explaining your reasoning based on the CV and job description.
              6.  Extract the candidate's work experience, education history, and a list of key skills.
              7.  The final output must be a JSON object matching the required schema.

              Job Description:
              ---
              {{job_description}}
              ---

              Candidate CV:
              ---
              {{candidate_cv}}
              ---
            `,
            suggestCriteriaPrompt: `
              You are an expert recruitment strategist. Analyze the following Job Description and identify the most critical skills, experiences, and qualifications.
              
              Instructions:
              1.  Read the Job Description thoroughly.
              2.  Identify a list of 5 to 7 essential criteria for evaluating a candidate for this role.
              3.  For each criterion, assign an importance weight from 1 (Low) to 5 (High).
              4.  The output must be a JSON object that strictly follows the required schema.

              Job Description:
              ---
              {{job_description}}
              ---
            `,
            assessJobPrompt: `
              You are an expert recruitment consultant. Your task is to analyze a job description and extract key information to help a recruiter understand the role better.

              Instructions:
              1.  Read the Job Description carefully.
              2.  Write a concise, one-paragraph summary of the role.
              3.  Extract a list of the 4-6 most important key responsibilities.
              4.  Identify and list the key technical/hard skills required.
              5.  Identify and list the key soft skills or behavioral competencies desired.
              6.  The final output must be a JSON object matching the required schema.

              Job Description:
              ---
              {{job_description}}
              ---
            `,
            suggestImprovementsPrompt: `
              You are an expert recruitment copywriter and Diversity & Inclusion specialist. Your task is to analyze the following job description and suggest improvements to make it clearer, more engaging for top candidates, and more inclusive.

              Instructions:
              1.  Read the Job Description carefully.
              2.  Suggest a more impactful and concise title for the role.
              3.  Provide 2-3 specific suggestions to improve the CLARITY of the responsibilities and requirements.
              4.  Provide 2-3 specific suggestions to improve the TONE and ENGAGEMENT to attract top talent.
              5.  Provide 2-3 specific suggestions to improve INCLUSIVITY by removing biased language or adding inclusive statements.
              6.  Finally, provide a complete, revised version of the job description incorporating your suggestions.
              7.  The final output must be a JSON object matching the required schema.

              Job Description:
              ---
              {{job_description}}
              ---
            `
          },
          pipeline: {
            title: "Dynamic Selection Pipeline",
            description: "Configure the selection process for this vacancy. Activate the desired stages and adjust their weight in the final score.",
            summaryTitle: "Pipeline Summary",
            totalWeight: "Total Weight",
            weightWarning: "The sum of weights should be 100% for a correct calculation.",
            scoreFormula: "Final Score Formula",
            mandatory: "Mandatory",
            estimatedTime: "Estimated time: {{duration}} minutes",
            stages: {
              cadastro: {
                name: "Initial Registration",
                description: "Candidate fills out basic data, resume and contact information.",
                example: "Example: Upload CV in PDF format."
              },
              triagem_inicial: {
                name: "Automatic Screening",
                description: "Screening questions for basic job requirements.",
                example: "Example: Do you have an advanced level of Excel? (Yes/No)"
              },
              teste_perfil: {
                name: "Behavioral Profile Test",
                description: "Assesses behavioral style and cultural compatibility.",
                example: "Example: Big Five (OCEAN) or DISC test."
              },
              teste_tecnico: {
                name: "Technical Test",
                description: "Validates technical skills required for the position.",
                example: "Example: Programming logic test or advanced Excel."
              },
              video_apresentacao: {
                name: "Video Introduction",
                description: "Candidate records a short video answering a key question.",
                example: "Example: Talk for up to 2 minutes about a challenge you overcame."
              },
              entrevista: {
                name: "Interview",
                description: "Interview with recruiter or manager, can be online or in-person.",
                example: "Example: Behavioral interview using the STAR format."
              },
              dinamica_grupo: {
                name: "Group Dynamics",
                description: "Observes social, communication and collaboration skills in a group.",
                example: "Example: Team-based case study resolution."
              },
              decisao_final: {
                name: "Final Decision",
                description: "Recruiters evaluate scores, affinity and feedback to make a decision.",
                example: "Example: Manager approves or rejects the candidate for an offer."
              }
            }
          }
        },
      },
      pt: {
        translation: {
          app: {
            title: 'VagaJá',
            recruiterArea: "Área do Recrutador",
            candidateArea: "Área do Candidato",
            recruiterDescription: "Gerencie vagas, candidatos e análises de IA.",
            candidateDescription: "Realize avaliações e acompanhe suas candidaturas.",
            analyzeButton: 'Analisar e Rankear Candidatos',
            analysisResultTitle: 'Candidatos Rankeados',
            behavioralAssessmentsTitle: 'Avaliações Comportamentais',
            steps: {
              step1: "Definir Vaga e Pipeline",
              step2: "Adicionar Candidatos e Critérios",
              step3: "Ver Resultados"
            },
            buttons: {
              next: "Próximo: Adicionar Candidatos",
              back: "Voltar para Vaga",
              startOver: "Analisar Nova Vaga",
              assessJob: "Avaliar Vaga",
              suggestImprovements: "Sugerir Melhorias com IA"
            }
          },
          step1: {
            jobDescription: "Descrição da Vaga",
            jobDescriptionPlaceholder: "Cole a descrição completa da vaga aqui...",
          },
          step2: {
            candidates: "CVs dos Candidatos",
            candidatesPlaceholder: "Cole um ou mais CVs de candidatos aqui, separados por '---'",
            criteria: "Critérios de Avaliação"
          },
          criteria: {
            title: 'Critérios de Avaliação',
            name: 'Nome do Critério',
            namePlaceholder: 'Ex: Experiência com React',
            weight: 'Peso',
            weights: {
                low: 'Baixo',
                medium: 'Médio',
                high: 'Alto',
            },
            add: 'Adicionar Critério',
            remove: 'Remover Critério',
            suggestWithAI: 'Sugerir com IA',
          },
          loader: {
            analyzingText: 'Analisando...',
            waitText: 'Isso pode levar um momento.',
            loadingTest: 'Carregando Teste...'
          },
          candidateCard: {
            overallScore: 'Pontuação Geral',
            scoreBreakdown: 'Detalhamento da Pontuação',
            justification: 'Justificativa',
            workExperience: 'Experiência Profissional',
            education: 'Formação Acadêmica',
            skills: 'Principais Habilidades',
            showMore: 'Mostrar Detalhes do CV',
            showLess: 'Ocultar Detalhes do CV',
          },
          candidateView: {
            welcomeTitle: "Perfil do Candidato",
            welcomeSubtitle: "Por favor, preencha seus dados abaixo para iniciar o processo de avaliação.",
            form: {
              name: "Nome Completo",
              namePlaceholder: "Ex: Maria da Silva",
              email: "Endereço de E-mail",
              emailPlaceholder: "Ex: maria.silva@exemplo.com",
              phone: "Telefone (Opcional)",
              phonePlaceholder: "Ex: +55 (11) 98765-4321",
              role: "Vaga Desejada",
              rolePlaceholder: "Ex: Engenheiro(a) de Software Sênior",
              submitButton: "Salvar e Iniciar Avaliações",
              welcomeBack: "Bem-vindo(a) de volta, {{name}}!",
              editInfo: "Editar Informações",
              assessmentsReady: "Suas avaliações estão prontas abaixo."
            }
          },
          error: {
            analysisFailed: 'Falha na Análise',
            tryAgain: 'Ocorreu um erro durante a análise. Por favor, verifique os dados e tente novamente.',
            loadTestError: 'Falha ao carregar o teste. Por favor, tente novamente mais tarde.',
            couldNotLoad: 'Não foi possível carregar os dados do teste.'
          },
          jobAssessment: {
            title: "Análise da Descrição da Vaga",
            summary: "Resumo da Posição",
            responsibilities: "Principais Responsabilidades",
            hardSkills: "Habilidades Técnicas (Hard Skills)",
            softSkills: "Habilidades Comportamentais (Soft Skills)"
          },
          jobImprovements: {
            title: "Sugestões da IA",
            suggestedTitle: "Título Sugerido",
            clarity: "Clareza",
            engagement: "Engajamento",
            inclusivity: "Inclusividade",
            revisedDescription: "Descrição Revisada"
          },
          tests: {
              startButton: 'Iniciar Teste',
              big_five: {
                title: "Teste de Personalidade Big Five (OCEAN)",
                description: "Avalie traços centrais de personalidade: Abertura, Conscienciosidade, Extroversão, Amabilidade e Neuroticismo para entender o estilo de trabalho de um candidato.",
              },
              disc: {
                  title: "Avaliação Comportamental DISC",
                  description: "Meça quatro perfis comportamentais: Dominância, Influência, Estabilidade e Conformidade para prever o comportamento no trabalho e a dinâmica da equipe.",
              },
              sjt: {
                title: "Teste de Julgamento Situacional (SJT)",
                description: "Avalie a tomada de decisão e a resolução de problemas apresentando cenários realistas de trabalho e pedindo a melhor linha de ação.",
              }
          },
          test_shared: {
            question: "Pergunta",
            of: "de",
            previous: "Anterior",
            next: "Próximo",
            finish: "Finalizar e Ver Resultados",
            resultsTitle: "Resultados do Teste",
            resetButton: "Fazer o Teste Novamente",
            closeButton: "Fechar",
            errorTitle: "Erro",
          },
          disc_test: {
              instruction: "Para cada grupo de quatro palavras, selecione uma que MAIS se parece com você e uma que MENOS se parece com você.",
              most: "Mais",
              least: "Menos",
              resultsTitle: "Resultados da Avaliação DISC",
              D: "Dominância",
              I: "Influência",
              S: "Estabilidade",
              C: "Conformidade",
          },
          sjt_test: {
              resultsTitle: "Resultados do Teste de Julgamento Situacional",
              competencyScore: "Pontuação da Competência"
          },
          big_five_test: {
            results: {
              title: "Resultados do Big Five (OCEAN)",
              score_of: "Pontuação: {{score}} de {{max}}",
              interpretation: "Interpretação",
            },
            interpretations: {
              O: {
                high: "Pessoas com pontuação alta são imaginativas, curiosas e abertas a novas experiências e ideias não convencionais.",
                low: "Pessoas com pontuação baixa tendem a ser convencionais, práticas e preferem a rotina à variedade.",
                moderate: "Você tem uma abordagem equilibrada entre ser prático e aberto a novas ideias."
              },
              C: {
                high: "Pessoas com pontuação alta são organizadas, disciplinadas e confiáveis. São orientadas para objetivos e focadas em detalhes.",
                low: "Pessoas com pontuação baixa tendem a ser mais espontâneas, flexíveis e menos organizadas.",
                moderate: "Você é moderadamente organizado e confiável, equilibrando estrutura com flexibilidade."
              },
              E: {
                high: "Pessoas com pontuação alta são sociáveis, enérgicas e assertivas. Elas prosperam em situações sociais.",
                low: "Pessoas com pontuação baixa são mais reservadas, reflexivas e preferem grupos menores ou a solidão.",
                moderate: "Você gosta de interações sociais, mas também valoriza seu tempo sozinho."
              },
              A: {
                high: "Pessoas com pontuação alta são compassivas, cooperativas e confiantes. Priorizam a harmonia nos relacionamentos.",
                low: "Pessoas com pontuação baixa tendem a ser mais competitivas, céticas e podem ser vistas como mais diretas ou francas.",
                moderate: "Você é geralmente cooperativo, mas pode ser assertivo quando necessário."
              },
              N: {
                high: "Pessoas com pontuação alta são propensas a experimentar emoções negativas como ansiedade, estresse e instabilidade de humor.",
                low: "Pessoas com pontuação baixa são emocionalmente estáveis, resilientes e calmas sob pressão.",
                moderate: "Você experimenta uma gama normal de emoções e é geralmente resiliente ao estresse."
              }
            }
          },
          dimensions: {
            O: "Abertura",
            C: "Conscienciosidade",
            E: "Extroversão",
            A: "Amabilidade",
            N: "Neuroticismo",
            teamwork: "Trabalho em Equipe",
            problemSolving: "Resolução de Problemas",
            communication: "Comunicação",
            integrity: "Integridade"
          },
          gemini: {
            prompt: `
              Você é um recrutador técnico especialista. Sua tarefa é analisar o CV de um candidato em comparação com uma descrição de vaga e pontuá-lo com base em um conjunto de critérios pré-definidos.

              Instruções:
              1. Leia atentamente a Descrição da Vaga para entender os requisitos do cargo.
              2. Revise completamente o CV do Candidato para avaliar suas habilidades e experiência.
              3. Extraia o nome completo do candidato do CV.
              4. Para cada um dos seguintes critérios, forneça uma pontuação de 0 (nenhuma correspondência) a 100 (correspondência perfeita): {{criteria_list}}.
              5. Para cada pontuação, forneça uma justificativa breve de uma frase explicando seu raciocínio com base no CV e na descrição da vaga.
              6. Extraia a experiência profissional do candidato, seu histórico educacional e uma lista de habilidades-chave.
              7. A saída final deve ser um objeto JSON que corresponda ao esquema exigido.

              Descrição da Vaga:
              ---
              {{job_description}}
              ---

              CV do Candidato:
              ---
              {{candidate_cv}}
              ---
            `,
            suggestCriteriaPrompt: `
              Você é um estrategista de recrutamento especialista. Analise a Descrição da Vaga a seguir e identifique as habilidades, experiências e qualificações mais críticas.

              Instruções:
              1. Leia atentamente a Descrição da Vaga.
              2. Identifique uma lista de 5 a 7 critérios essenciais para avaliar um candidato para esta função.
              3. Para cada critério, atribua um peso de importância de 1 (Baixo) a 5 (Alto).
              4. A saída deve ser um objeto JSON que siga estritamente o esquema exigido.

              Descrição da Vaga:
              ---
              {{job_description}}
              ---
            `,
            assessJobPrompt: `
              Você é um consultor de recrutamento especialista. Sua tarefa é analisar a descrição de uma vaga e extrair informações-chave para ajudar um recrutador a entender melhor a posição.

              Instruções:
              1. Leia atentamente a Descrição da Vaga.
              2. Escreva um resumo conciso de um parágrafo sobre a função.
              3. Extraia uma lista das 4 a 6 responsabilidades-chave mais importantes.
              4. Identifique e liste as principais habilidades técnicas (hard skills) necessárias.
              5. Identifique e liste as principais habilidades comportamentais (soft skills) desejadas.
              6. A saída final deve ser um objeto JSON que corresponda ao esquema exigido.

              Descrição da Vaga:
              ---
              {{job_description}}
              ---
            `,
            suggestImprovementsPrompt: `
              Você é um redator especialista em recrutamento e especialista em Diversidade e Inclusão. Sua tarefa é analisar a descrição de vaga a seguir e sugerir melhorias para torná-la mais clara, mais atraente para os melhores candidatos e mais inclusiva.

              Instruções:
              1.  Leia atentamente a Descrição da Vaga.
              2.  Sugira um título mais impactante e conciso para a função.
              3.  Forneça 2-3 sugestões específicas para melhorar a CLAREZA das responsabilidades e requisitos.
              4.  Forneça 2-3 sugestões específicas para melhorar o TOM e o ENGAJAMENTO para atrair os melhores talentos.
              5.  Forneça 2-3 sugestões específicas para melhorar a INCLUSIVIDADE, removendo linguagem tendenciosa ou adicionando declarações inclusivas.
              6.  Finalmente, forneça uma versão completa e revisada da descrição da vaga, incorporando suas sugestões.
              7.  A saída final deve ser um objeto JSON que corresponda ao esquema exigido.

              Descrição da Vaga:
              ---
              {{job_description}}
              ---
            `
          },
          pipeline: {
            title: "Pipeline de Seleção Dinâmico",
            description: "Configure o processo seletivo para esta vaga. Ative as etapas desejadas e ajuste o peso de cada uma na pontuação final.",
            summaryTitle: "Resumo do Pipeline",
            totalWeight: "Peso Total",
            weightWarning: "A soma dos pesos deve ser 100% para um cálculo correto.",
            scoreFormula: "Fórmula do Score Final",
            mandatory: "Obrigatório",
            estimatedTime: "Tempo estimado: {{duration}} minutos",
            stages: {
              cadastro: {
                name: "Cadastro Inicial",
                description: "Candidato preenche dados básicos, currículo e informações de contato.",
                example: "Exemplo: Upload de currículo em PDF."
              },
              triagem_inicial: {
                name: "Triagem Automática",
                description: "Perguntas eliminatórias para requisitos básicos da vaga.",
                example: "Exemplo: Você possui nível avançado em Excel? (Sim/Não)"
              },
              teste_perfil: {
                name: "Teste de Perfil Comportamental",
                description: "Avalia estilo comportamental e compatibilidade cultural.",
                example: "Exemplo: Teste Big Five (OCEAN) ou DISC."
              },
              teste_tecnico: {
                name: "Teste Técnico",
                description: "Valida competências técnicas exigidas para a vaga.",
                example: "Exemplo: Prova de lógica de programação ou Excel avançado."
              },
              video_apresentacao: {
                name: "Vídeo de Apresentação",
                description: "Candidato grava vídeo curto respondendo a uma pergunta-chave.",
                example: "Exemplo: Fale em até 2 minutos sobre um desafio que você superou."
              },
              entrevista: {
                name: "Entrevista",
                description: "Entrevista com recrutador ou gestor, podendo ser online ou presencial.",
                example: "Exemplo: Entrevista comportamental no formato STAR."
              },
              dinamica_grupo: {
                name: "Dinâmica de Grupo",
                description: "Observa competências sociais, comunicação e colaboração em grupo.",
                example: "Exemplo: Resolução de case em equipe."
              },
              decisao_final: {
                name: "Decisão Final",
                description: "Recrutadores avaliam notas, afinidade e feedbacks das etapas anteriores para tomar decisão.",
                example: "Exemplo: Gestor aprova ou reprova candidato para proposta."
              }
            }
          }
        }
      }
    },
    fallbackLng: 'pt',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;