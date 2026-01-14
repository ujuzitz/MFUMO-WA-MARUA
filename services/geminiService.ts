
import { GoogleGenAI } from "@google/genai";
import { FormData, Language, InstitutionType, Tone } from "../types";

/**
 * Generates a professional cover letter using Gemini AI.
 * Adheres to strict formatting rules for Government, NGO, and Private institutions.
 */
export const generateCoverLetter = async (data: FormData, language: Language): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Format the date based on language
  const today = new Date().toLocaleDateString(language === Language.EN ? 'en-GB' : 'sw-TZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const isEnglish = language === Language.EN;
  const subjectPrefix = isEnglish ? 'RE: APPLICATION FOR THE POSITION OF' : 'YAH: MAOMBI YA KAZI NAFASI YA';
  
  // Tone descriptors for the system instruction
  const toneGuide = {
    [Tone.FRIENDLY]: isEnglish 
      ? "polite, warm, and respectful" 
      : "ya adabu, yenye uchangamfu na heshima",
    [Tone.PROFESSIONAL]: isEnglish 
      ? "formal, official, and structured" 
      : "ya kiofisi, rasmi na yenye mpangilio",
    [Tone.BOLD]: isEnglish 
      ? "confident and assertive but professional" 
      : "ya ujasiri, ushawishi na yenye mamlaka ya kitaalamu",
  };

  const systemInstruction = `
    You are a professional cover letter writer with 20 years of experience specializing in applications for Government, NGO, and Private sector institutions in East Africa.
    
    TASK:
    Generate a COMPLETE, print-ready cover letter in ${isEnglish ? 'formal British English' : 'Kiswahili sanifu kinachotumika katika maombi rasmi ya kiserikali'}.
    
    GLOBAL RULES - ABSOLUTE COMPLIANCE REQUIRED:
    1. NO BULLET POINTS or lists of any kind. Use full paragraphs only.
    2. NO HEADINGS except for the subject line.
    3. DO NOT EXPLAIN what you are doing. No preamble like "Here is your letter".
    4. DO NOT MENTION AI, automation, or software.
    5. OUTPUT ONLY THE LETTER TEXT.
    6. NO MARKDOWN (no bolding, no italics, no # headings, no asterisks).
    7. NO EMOJIS, NO QUOTES, NO HTML.
    8. Use ${toneGuide[data.tone]} tone.
    9. For Kiswahili, use high-level "Kiswahili cha Ofisi" (e.g., "Mamlaka ya Teuzi", "Wako katika Ujenzi wa Taifa").
    
    LETTER STRUCTURE (STRICT ORDER):
    1. APPLICANT ADDRESS & DATE: Start with the applicant's address and today's date (${today}). In the final text, these should be at the top.
    2. EMPLOYER ADDRESS: Full address of the organization/ministry below.
    3. SALUTATION: Formal (e.g., Dear Sir/Madam or Ndugu Meneja/Mkurugenzi).
    4. SUBJECT LINE: Must be ALL CAPS. Format: "${subjectPrefix} ${data.jobTitle.toUpperCase()}".
    5. OPENING PARAGRAPH: Reference the job advertisement clearly.
    6. BODY PARAGRAPHS: Describe education, work experience, and skills relevant to the role. 
    7. COMMITMENT PARAGRAPH: Express commitment and how the applicant adds value to a ${data.institutionType} institution.
    8. CLOSING STATEMENT: Formal closing sentence.
    9. SIGNATURE: End with "${data.fullName}" as the signature.
    
    DATA USAGE:
    - Focus on the Job Description: ${data.jobDescription || 'Standard responsibilities for this role.'}
    - Tailor qualifications to match the needs of a ${data.institutionType} sector role.
  `;

  const prompt = `
    Generate a professional cover letter for ${data.fullName} applying for the position of ${data.jobTitle} at ${data.companyName} (${data.institutionType}).
    
    Job Description Details:
    ${data.jobDescription || 'Standard requirements for the role.'}
    
    Applicant Address: ${data.applicantAddress}
    Employer Address: ${data.employerAddress}
    Department: ${data.department || 'Human Resources'}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.6,
      },
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");

    return text.replace(/^(Here is|Sure|I've generated).*\n/i, '').replace(/```.*?\n/g, '').replace(/```/g, '').trim();
    
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw new Error(language === Language.EN 
      ? "Connection to AI service failed. Please try again." 
      : "Muunganisho na huduma ya AI umefeli. Tafadhali jaribu tena.");
  }
};
