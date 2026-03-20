
// // /lib/db/queries/questions.ts

import { sql } from '../index';
import { Question, CreateQuestionData, UpdateQuestionData } from '@/types/assessments';

/**
 * Get questions for an assessment
 */
export async function getAssessmentQuestions(assessmentId: string): Promise<Question[]> {
  try {
    const questions = await sql`
      SELECT * FROM questions 
      WHERE assessment_id = ${assessmentId}
      ORDER BY order_index ASC, created_at ASC
    `;
    
    return questions as Question[];
  } catch (error) {
    console.error('❌ Error fetching assessment questions:', error);
    return [];
  }
}

/**
 * Get question by ID
 */
export async function getQuestionById(questionId: string): Promise<Question | null> {
  try {
    const questions = await sql`
      SELECT * FROM questions WHERE id = ${questionId} LIMIT 1
    `;
    
    return questions[0] as Question || null;
  } catch (error) {
    console.error('❌ Error fetching question by ID:', error);
    return null;
  }
}

/**
 * Create a new question
 */
export async function createQuestion(questionData: CreateQuestionData): Promise<{ 
  success: boolean; 
  message: string; 
  question?: Question; 
  errors?: string[] 
}> {
  try {
    // Validate assessment exists
    const assessment = await sql`
      SELECT id FROM assessments WHERE id = ${questionData.assessment_id} LIMIT 1
    `;
    
    if (assessment.length === 0) {
      return {
        success: false,
        message: 'Assessment not found',
        errors: ['Assessment does not exist']
      };
    }
    
    // Process options for different question types
    let processedOptions = null;
    let processedCorrectAnswer = questionData.correct_answer || null;
    let processedPossibleAnswers = questionData.possible_answers || null;
    
    if (questionData.question_type === 'multiple_choice' && questionData.options) {
      // Clean up options - remove undefined values and empty explanations
      processedOptions = questionData.options.map(option => {
        const cleanedOption: any = {
          text: option.text,
          correct: option.correct
        };
        
        // Only include explanation if it exists and is not empty
        if (option.explanation && option.explanation.trim() !== '') {
          cleanedOption.explanation = option.explanation.trim();
        }
        
        return cleanedOption;
      });
      
      // For multiple choice, correct_answer should be the correct option text
      const correctOption = questionData.options.find(opt => opt.correct);
      if (correctOption) {
        processedCorrectAnswer = correctOption.text;
      }
    } else if (questionData.question_type === 'true_false') {
      processedOptions = [
        { text: 'True', correct: processedCorrectAnswer === 'True' },
        { text: 'False', correct: processedCorrectAnswer === 'False' }
      ];
    }
    
    // Process hints - ensure it's either null or a valid array
    let processedHints = null;
    if (questionData.hints && Array.isArray(questionData.hints) && questionData.hints.length > 0) {
      const filteredHints = questionData.hints.filter(hint => hint && hint.trim() !== '');
      if (filteredHints.length > 0) {
        processedHints = filteredHints;
      }
    }
    
    // Convert to JSON strings for PostgreSQL to avoid JSON parsing errors
    const optionsJson = processedOptions ? JSON.stringify(processedOptions) : null;
    const possibleAnswersJson = processedPossibleAnswers ? JSON.stringify(processedPossibleAnswers) : null;
    const hintsJson = processedHints ? JSON.stringify(processedHints) : null;
    
    const newQuestion = await sql`
      INSERT INTO questions (
        assessment_id,
        question_text,
        question_type,
        options,
        correct_answer,
        possible_answers,
        explanation,
        hints,
        points,
        image_url,
        video_url,
        order_index,
        difficulty
      ) VALUES (
        ${questionData.assessment_id},
        ${questionData.question_text},
        ${questionData.question_type},
        ${optionsJson},
        ${processedCorrectAnswer},
        ${possibleAnswersJson},
        ${questionData.explanation || null},
        ${hintsJson},
        ${questionData.points || 1},
        ${questionData.image_url || null},
        ${questionData.video_url || null},
        ${questionData.order_index || 0},
        ${questionData.difficulty || 'medium'}
      )
      RETURNING *
    `;
    
    // Update assessment total points
    await updateAssessmentTotalPoints(questionData.assessment_id);
    
    return {
      success: true,
      message: 'Question created successfully',
      question: newQuestion[0] as Question
    };
  } catch (error: any) {
    console.error('❌ Error creating question:', error);
    console.error('❌ Question data:', JSON.stringify(questionData, null, 2));
    return {
      success: false,
      message: 'Failed to create question',
      errors: [error.message || 'An unexpected error occurred']
    };
  }
}

/**
 * Update question
 */
export async function updateQuestion(
  questionId: string, 
  questionData: UpdateQuestionData
): Promise<{ 
  success: boolean; 
  message: string; 
  question?: Question; 
  errors?: string[] 
}> {
  try {
    // Get current question to preserve assessment_id
    const currentQuestion = await getQuestionById(questionId);
    if (!currentQuestion) {
      return {
        success: false,
        message: 'Question not found',
        errors: ['Question not found']
      };
    }
    
    // Process options for different question types
    let processedOptions = questionData.options;
    let processedCorrectAnswer = questionData.correct_answer;
    let processedPossibleAnswers = questionData.possible_answers;
    
    if (questionData.question_type === 'multiple_choice' && questionData.options) {
      // Clean up options - remove undefined values and empty explanations
      processedOptions = questionData.options.map(option => {
        const cleanedOption: any = {
          text: option.text,
          correct: option.correct
        };
        
        // Only include explanation if it exists and is not empty
        if (option.explanation && option.explanation.trim() !== '') {
          cleanedOption.explanation = option.explanation.trim();
        }
        
        return cleanedOption;
      });
    } else if (questionData.question_type === 'true_false' || 
        (currentQuestion.question_type === 'true_false' && !questionData.question_type)) {
      processedOptions = [
        { text: 'True', correct: processedCorrectAnswer === 'True' },
        { text: 'False', correct: processedCorrectAnswer === 'False' }
      ];
    }
    
    // Process hints - handle undefined case properly
    let processedHints = null;
    if (questionData.hints !== undefined) {
      if (Array.isArray(questionData.hints)) {
        const filteredHints = questionData.hints.filter(hint => hint && hint.trim() !== '');
        processedHints = filteredHints.length > 0 ? filteredHints : null;
      }
      // If hints is not an array but has a value, keep it as is (could be null)
      else {
        processedHints = questionData.hints;
      }
    }
    
    // Convert to JSON strings for PostgreSQL
    const optionsJson = processedOptions ? JSON.stringify(processedOptions) : null;
    const possibleAnswersJson = processedPossibleAnswers ? JSON.stringify(processedPossibleAnswers) : null;
    const hintsJson = processedHints ? JSON.stringify(processedHints) : null;
    
    const updatedQuestion = await sql`
      UPDATE questions 
      SET 
        question_text = COALESCE(${questionData.question_text}, question_text),
        question_type = COALESCE(${questionData.question_type}, question_type),
        options = COALESCE(${optionsJson}, options),
        correct_answer = COALESCE(${processedCorrectAnswer}, correct_answer),
        possible_answers = COALESCE(${possibleAnswersJson}, possible_answers),
        explanation = COALESCE(${questionData.explanation}, explanation),
        hints = COALESCE(${hintsJson}, hints),
        points = COALESCE(${questionData.points}, points),
        image_url = COALESCE(${questionData.image_url}, image_url),
        video_url = COALESCE(${questionData.video_url}, video_url),
        order_index = COALESCE(${questionData.order_index}, order_index),
        difficulty = COALESCE(${questionData.difficulty}, difficulty),
        updated_at = NOW()
      WHERE id = ${questionId}
      RETURNING *
    `;
    
    if (updatedQuestion.length === 0) {
      return {
        success: false,
        message: 'Question not found',
        errors: ['Question not found']
      };
    }
    
    // Update assessment total points
    await updateAssessmentTotalPoints(currentQuestion.assessment_id);
    
    return {
      success: true,
      message: 'Question updated successfully',
      question: updatedQuestion[0] as Question
    };
  } catch (error: any) {
    console.error('❌ Error updating question:', error);
    console.error('❌ Question data:', JSON.stringify(questionData, null, 2));
    return {
      success: false,
      message: 'Failed to update question',
      errors: [error.message || 'An unexpected error occurred']
    };
  }
}

/**
 * Delete question
 */
export async function deleteQuestion(questionId: string): Promise<{ 
  success: boolean; 
  message: string; 
  errors?: string[] 
}> {
  try {
    // Get assessment_id before deletion for updating total points
    const question = await getQuestionById(questionId);
    if (!question) {
      return {
        success: false,
        message: 'Question not found',
        errors: ['Question not found']
      };
    }
    
    const result = await sql`
      DELETE FROM questions WHERE id = ${questionId}
      RETURNING id
    `;
    
    if (result.length === 0) {
      return {
        success: false,
        message: 'Question not found',
        errors: ['Question not found']
      };
    }
    
    // Update assessment total points
    await updateAssessmentTotalPoints(question.assessment_id);
    
    return {
      success: true,
      message: 'Question deleted successfully'
    };
  } catch (error: any) {
    console.error('❌ Error deleting question:', error);
    return {
      success: false,
      message: 'Failed to delete question',
      errors: [error.message || 'An unexpected error occurred']
    };
  }
}

/**
 * Update assessment total points (helper function)
 */
async function updateAssessmentTotalPoints(assessmentId: string): Promise<void> {
  try {
    const totalPoints = await sql`
      SELECT COALESCE(SUM(points), 0) as total FROM questions WHERE assessment_id = ${assessmentId}
    `;
    
    await sql`
      UPDATE assessments 
      SET total_points = ${totalPoints[0].total}, updated_at = NOW()
      WHERE id = ${assessmentId}
    `;
  } catch (error) {
    console.error('❌ Error updating assessment total points:', error);
  }
}

/**
 * Reorder questions
 */
export async function reorderQuestions(
  assessmentId: string, 
  questionIds: string[]
): Promise<{ 
  success: boolean; 
  message: string; 
  errors?: string[] 
}> {
  try {
    // Update order_index for each question
    for (let i = 0; i < questionIds.length; i++) {
      await sql`
        UPDATE questions 
        SET order_index = ${i}, updated_at = NOW()
        WHERE id = ${questionIds[i]} AND assessment_id = ${assessmentId}
      `;
    }
    
    return {
      success: true,
      message: 'Questions reordered successfully'
    };
  } catch (error: any) {
    console.error('❌ Error reordering questions:', error);
    return {
      success: false,
      message: 'Failed to reorder questions',
      errors: [error.message || 'An unexpected error occurred']
    };
  }
}



























