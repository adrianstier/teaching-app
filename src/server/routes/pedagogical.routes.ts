import { Router, Request, Response } from 'express';
import logger from '../../utils/logger';

// Import all pedagogical agents
import { SpacedRepetitionAgent } from '../../agents/spaced-repetition-agent';
import { FormativeAssessmentAgent } from '../../agents/formative-assessment-agent';
import { MetacognitiveAgent } from '../../agents/metacognitive-agent';
import { CollaborativeLearningAgent } from '../../agents/collaborative-learning-agent';
import { AdaptiveDifficultyAgent } from '../../agents/adaptive-difficulty-agent';
import { CaseBasedLearningAgent } from '../../agents/case-based-learning-agent';
import { MisconceptionAgent } from '../../agents/misconception-agent';
import { InclusiveDesignAgent } from '../../agents/inclusive-design-agent';
import { CognitiveLoadAgent } from '../../agents/cognitive-load-agent';
import { GrowthMindsetAgent } from '../../agents/growth-mindset-agent';
import { DesirableDifficultiesAgent } from '../../agents/desirable-difficulties-agent';
import { ElaborativeInterrogationAgent } from '../../agents/elaborative-interrogation-agent';
import { TransferAgent } from '../../agents/transfer-agent';
import { LearningScienceAgent } from '../../agents/learning-science-agent';
import { StudentPerspectiveAgent } from '../../agents/student-perspective-agent';

const router = Router();

// Initialize all agents
const spacedRepetitionAgent = new SpacedRepetitionAgent();
const formativeAssessmentAgent = new FormativeAssessmentAgent();
const metacognitiveAgent = new MetacognitiveAgent();
const collaborativeAgent = new CollaborativeLearningAgent();
const adaptiveAgent = new AdaptiveDifficultyAgent();
const caseBasedAgent = new CaseBasedLearningAgent();
const misconceptionAgent = new MisconceptionAgent();
const inclusiveAgent = new InclusiveDesignAgent();
const cognitiveLoadAgent = new CognitiveLoadAgent();
const growthMindsetAgent = new GrowthMindsetAgent();
const desirableDifficultiesAgent = new DesirableDifficultiesAgent();
const elaborativeAgent = new ElaborativeInterrogationAgent();
const transferAgent = new TransferAgent();
const learningScienceAgent = new LearningScienceAgent();
const studentPerspectiveAgent = new StudentPerspectiveAgent();

// ============================================================================
// SPACED REPETITION & RETRIEVAL PRACTICE
// ============================================================================

router.post('/spaced-repetition/schedule', async (req: Request, res: Response) => {
  try {
    const { courseId, concepts } = req.body;
    logger.info(`[API] Generating spaced repetition schedule for course: ${courseId}`);

    const schedule = await spacedRepetitionAgent.generateSchedule({ courseId, concepts });
    res.json(schedule);
  } catch (error) {
    logger.error('[API] Error generating schedule:', error);
    res.status(500).json({ error: 'Failed to generate spaced repetition schedule' });
  }
});

router.post('/spaced-repetition/retrieval-practice', async (req: Request, res: Response) => {
  try {
    const { topic, concepts, bloomLevel, includeInterleaving, priorTopics } = req.body;
    logger.info(`[API] Generating retrieval practice for: ${topic}`);

    const items = await spacedRepetitionAgent.generateRetrievalPractice({
      topic, concepts, bloomLevel, includeInterleaving, priorTopics
    });
    res.json(items);
  } catch (error) {
    logger.error('[API] Error generating retrieval practice:', error);
    res.status(500).json({ error: 'Failed to generate retrieval practice' });
  }
});

router.post('/spaced-repetition/pre-class-activation', async (req: Request, res: Response) => {
  try {
    const { upcomingLecture, topic, prerequisites, priorKnowledge } = req.body;
    logger.info(`[API] Generating pre-class activation for: ${topic}`);

    const activation = await spacedRepetitionAgent.generatePreClassActivation({
      upcomingLecture, topic, prerequisites, priorKnowledge
    });
    res.json(activation);
  } catch (error) {
    logger.error('[API] Error generating pre-class activation:', error);
    res.status(500).json({ error: 'Failed to generate pre-class activation' });
  }
});

// ============================================================================
// FORMATIVE ASSESSMENT
// ============================================================================

router.post('/formative-assessment/live-poll', async (req: Request, res: Response) => {
  try {
    const { topic, concept, type, targetMisconception, bloomLevel } = req.body;
    logger.info(`[API] Generating ${type} poll for: ${concept}`);

    const poll = await formativeAssessmentAgent.generateLivePoll({
      topic, concept, type, targetMisconception, bloomLevel
    });
    res.json(poll);
  } catch (error) {
    logger.error('[API] Error generating poll:', error);
    res.status(500).json({ error: 'Failed to generate live poll' });
  }
});

router.post('/formative-assessment/exit-ticket', async (req: Request, res: Response) => {
  try {
    const { lectureId, topic, keyConceptsCovered, includeTypes } = req.body;
    logger.info(`[API] Generating exit ticket for: ${topic}`);

    const ticket = await formativeAssessmentAgent.generateExitTicket({
      lectureId, topic, keyConceptsCovered, includeTypes
    });
    res.json(ticket);
  } catch (error) {
    logger.error('[API] Error generating exit ticket:', error);
    res.status(500).json({ error: 'Failed to generate exit ticket' });
  }
});

router.post('/formative-assessment/misconception-tracker', async (req: Request, res: Response) => {
  try {
    const { topic, discipline, concepts } = req.body;
    logger.info(`[API] Generating misconception tracker for: ${topic}`);

    const tracker = await formativeAssessmentAgent.generateMisconceptionTracker({
      topic, discipline, concepts
    });
    res.json(tracker);
  } catch (error) {
    logger.error('[API] Error generating tracker:', error);
    res.status(500).json({ error: 'Failed to generate misconception tracker' });
  }
});

router.post('/formative-assessment/analyze-responses', async (req: Request, res: Response) => {
  try {
    const { exitTicket } = req.body;
    logger.info('[API] Analyzing exit ticket responses');

    const analysis = await formativeAssessmentAgent.analyzeResponses({ exitTicket });
    res.json(analysis);
  } catch (error) {
    logger.error('[API] Error analyzing responses:', error);
    res.status(500).json({ error: 'Failed to analyze responses' });
  }
});

// ============================================================================
// METACOGNITION
// ============================================================================

router.post('/metacognition/study-strategies', async (req: Request, res: Response) => {
  try {
    const { topic, bloomLevel, contentType, learningGoal, studentLevel } = req.body;
    logger.info(`[API] Recommending study strategies for: ${topic}`);

    const strategies = await metacognitiveAgent.recommendStudyStrategies({
      topic, bloomLevel, contentType, learningGoal, studentLevel
    });
    res.json(strategies);
  } catch (error) {
    logger.error('[API] Error recommending strategies:', error);
    res.status(500).json({ error: 'Failed to recommend study strategies' });
  }
});

router.post('/metacognition/self-explanation-prompts', async (req: Request, res: Response) => {
  try {
    const { content, contentId, targetConcept, scaffoldLevel } = req.body;
    logger.info(`[API] Generating self-explanation prompts for: ${targetConcept}`);

    const prompts = await metacognitiveAgent.generateSelfExplanationPrompts({
      content, contentId, targetConcept, scaffoldLevel
    });
    res.json(prompts);
  } catch (error) {
    logger.error('[API] Error generating prompts:', error);
    res.status(500).json({ error: 'Failed to generate self-explanation prompts' });
  }
});

router.post('/metacognition/reflection-template', async (req: Request, res: Response) => {
  try {
    const { timing, focus, includeGoalTracking } = req.body;
    logger.info(`[API] Generating ${timing} reflection template`);

    const template = await metacognitiveAgent.generateReflectionTemplate({
      timing, focus, includeGoalTracking
    });
    res.json(template);
  } catch (error) {
    logger.error('[API] Error generating template:', error);
    res.status(500).json({ error: 'Failed to generate reflection template' });
  }
});

router.post('/metacognition/calibration-exercise', async (req: Request, res: Response) => {
  try {
    const { topic, assessmentType, concepts } = req.body;
    logger.info(`[API] Generating calibration exercise for: ${topic}`);

    const exercise = await metacognitiveAgent.generateCalibrationExercise({
      topic, assessmentType, concepts
    });
    res.json(exercise);
  } catch (error) {
    logger.error('[API] Error generating exercise:', error);
    res.status(500).json({ error: 'Failed to generate calibration exercise' });
  }
});

// ============================================================================
// COLLABORATIVE LEARNING
// ============================================================================

router.post('/collaboration/form-groups', async (req: Request, res: Response) => {
  try {
    const { classSize, strategy, groupSizePreference, studentData } = req.body;
    logger.info(`[API] Forming groups for ${classSize} students`);

    const groups = await collaborativeAgent.formGroups({
      classSize, strategy, groupSizePreference, studentData
    });
    res.json(groups);
  } catch (error) {
    logger.error('[API] Error forming groups:', error);
    res.status(500).json({ error: 'Failed to form groups' });
  }
});

router.post('/collaboration/generate-activity', async (req: Request, res: Response) => {
  try {
    const { type, topic, duration, groupSize, learningObjective, includeRoles } = req.body;
    logger.info(`[API] Generating ${type} activity for: ${topic}`);

    const activity = await collaborativeAgent.generateCollaborativeActivity({
      type, topic, duration, groupSize, learningObjective, includeRoles
    });
    res.json(activity);
  } catch (error) {
    logger.error('[API] Error generating activity:', error);
    res.status(500).json({ error: 'Failed to generate collaborative activity' });
  }
});

router.post('/collaboration/peer-feedback-framework', async (req: Request, res: Response) => {
  try {
    const { activityType, criteria, includeTraining } = req.body;
    logger.info(`[API] Generating peer feedback framework for: ${activityType}`);

    const framework = await collaborativeAgent.generatePeerFeedbackFramework({
      activityType, criteria, includeTraining
    });
    res.json(framework);
  } catch (error) {
    logger.error('[API] Error generating framework:', error);
    res.status(500).json({ error: 'Failed to generate peer feedback framework' });
  }
});

// ============================================================================
// ADAPTIVE DIFFICULTY
// ============================================================================

router.post('/adaptive/diagnostic', async (req: Request, res: Response) => {
  try {
    const { topic, concepts, targetSkills, studentLevel } = req.body;
    logger.info(`[API] Generating diagnostic for: ${topic}`);

    const diagnostic = await adaptiveAgent.generateDiagnostic({
      topic, concepts, targetSkills, studentLevel
    });
    res.json(diagnostic);
  } catch (error) {
    logger.error('[API] Error generating diagnostic:', error);
    res.status(500).json({ error: 'Failed to generate diagnostic' });
  }
});

router.post('/adaptive/pathway', async (req: Request, res: Response) => {
  try {
    const { topic, track, prerequisites, targetOutcomes, estimatedDuration } = req.body;
    logger.info(`[API] Generating ${track} pathway for: ${topic}`);

    const pathway = await adaptiveAgent.generatePathway({
      topic, track, prerequisites, targetOutcomes, estimatedDuration
    });
    res.json(pathway);
  } catch (error) {
    logger.error('[API] Error generating pathway:', error);
    res.status(500).json({ error: 'Failed to generate pathway' });
  }
});

router.post('/adaptive/challenge-problems', async (req: Request, res: Response) => {
  try {
    const { topic, baseConceptsMastered, bloomLevel, count } = req.body;
    logger.info(`[API] Generating ${count} challenge problems for: ${topic}`);

    const problems = await adaptiveAgent.generateChallengeProblems({
      topic, baseConceptsMastered, bloomLevel, count
    });
    res.json(problems);
  } catch (error) {
    logger.error('[API] Error generating challenges:', error);
    res.status(500).json({ error: 'Failed to generate challenge problems' });
  }
});

// ============================================================================
// CASE-BASED LEARNING
// ============================================================================

router.post('/case-based/generate-case', async (req: Request, res: Response) => {
  try {
    const { topic, domain, complexity, learningObjectives, studentLevel, includeEthicalDimensions, interdisciplinaryConnections } = req.body;
    logger.info(`[API] Generating ${complexity} case study for: ${topic}`);

    const caseStudy = await caseBasedAgent.generateCaseStudy({
      topic, domain, complexity, learningObjectives, studentLevel, includeEthicalDimensions, interdisciplinaryConnections
    });
    res.json(caseStudy);
  } catch (error) {
    logger.error('[API] Error generating case study:', error);
    res.status(500).json({ error: 'Failed to generate case study' });
  }
});

router.post('/case-based/analysis-framework', async (req: Request, res: Response) => {
  try {
    const { caseId, scaffoldingLevel, focusAreas } = req.body;
    logger.info(`[API] Generating analysis framework for case: ${caseId}`);

    const framework = await caseBasedAgent.generateAnalysisFramework({
      caseId, scaffoldingLevel, focusAreas
    });
    res.json(framework);
  } catch (error) {
    logger.error('[API] Error generating framework:', error);
    res.status(500).json({ error: 'Failed to generate analysis framework' });
  }
});

// ============================================================================
// MISCONCEPTIONS
// ============================================================================

router.post('/misconceptions/database', async (req: Request, res: Response) => {
  try {
    const { topic, discipline, concepts, studentLevel } = req.body;
    logger.info(`[API] Generating misconception database for: ${topic}`);

    const database = await misconceptionAgent.generateMisconceptionDatabase({
      topic, discipline, concepts, studentLevel
    });
    res.json(database);
  } catch (error) {
    logger.error('[API] Error generating database:', error);
    res.status(500).json({ error: 'Failed to generate misconception database' });
  }
});

router.post('/misconceptions/conceptual-change', async (req: Request, res: Response) => {
  try {
    const { misconception, availableTime, classSize } = req.body;
    logger.info(`[API] Generating conceptual change activity`);

    const activity = await misconceptionAgent.generateConceptualChangeActivity({
      misconception, availableTime, classSize
    });
    res.json(activity);
  } catch (error) {
    logger.error('[API] Error generating activity:', error);
    res.status(500).json({ error: 'Failed to generate conceptual change activity' });
  }
});

// ============================================================================
// INCLUSIVE DESIGN
// ============================================================================

router.post('/inclusive/check-content', async (req: Request, res: Response) => {
  try {
    const { content, contentId, contentType } = req.body;
    logger.info(`[API] Checking content inclusivity for: ${contentId}`);

    const check = await inclusiveAgent.checkContentInclusivity({
      content, contentId, contentType
    });
    res.json(check);
  } catch (error) {
    logger.error('[API] Error checking content:', error);
    res.status(500).json({ error: 'Failed to check content inclusivity' });
  }
});

router.post('/inclusive/diverse-examples', async (req: Request, res: Response) => {
  try {
    const { topic, currentExample, targetAudience, culturalContexts } = req.body;
    logger.info(`[API] Generating diverse examples for: ${topic}`);

    const examples = await inclusiveAgent.generateDiverseExamples({
      topic, currentExample, targetAudience, culturalContexts
    });
    res.json(examples);
  } catch (error) {
    logger.error('[API] Error generating examples:', error);
    res.status(500).json({ error: 'Failed to generate diverse examples' });
  }
});

router.post('/inclusive/multilingual-glossary', async (req: Request, res: Response) => {
  try {
    const { terms, targetLanguages } = req.body;
    logger.info(`[API] Generating multilingual glossary`);

    const glossary = await inclusiveAgent.generateMultilingualGlossary({
      terms, targetLanguages
    });
    res.json(glossary);
  } catch (error) {
    logger.error('[API] Error generating glossary:', error);
    res.status(500).json({ error: 'Failed to generate multilingual glossary' });
  }
});

router.post('/inclusive/accessibility-check', async (req: Request, res: Response) => {
  try {
    const { content, hasImages, hasVideo, hasMath } = req.body;
    logger.info('[API] Checking accessibility');

    const check = await inclusiveAgent.checkAccessibility({
      content, hasImages, hasVideo, hasMath
    });
    res.json(check);
  } catch (error) {
    logger.error('[API] Error checking accessibility:', error);
    res.status(500).json({ error: 'Failed to check accessibility' });
  }
});

router.post('/inclusive/udl-alternatives', async (req: Request, res: Response) => {
  try {
    const { content, topic } = req.body;
    logger.info(`[API] Generating UDL alternatives for: ${topic}`);

    const alternatives = await inclusiveAgent.generateUDLAlternatives(content, topic);
    res.json(alternatives);
  } catch (error) {
    logger.error('[API] Error generating alternatives:', error);
    res.status(500).json({ error: 'Failed to generate UDL alternatives' });
  }
});

// ============================================================================
// COGNITIVE LOAD
// ============================================================================

router.post('/cognitive-load/worked-example', async (req: Request, res: Response) => {
  try {
    const { topic, problemType, problem, solution, targetFadingLevel } = req.body;
    logger.info(`[API] Generating worked example for: ${topic}`);

    const example = await cognitiveLoadAgent.generateWorkedExample({
      topic, problemType, problem, solution, targetFadingLevel
    });
    res.json(example);
  } catch (error) {
    logger.error('[API] Error generating example:', error);
    res.status(500).json({ error: 'Failed to generate worked example' });
  }
});

router.post('/cognitive-load/slide-analysis', async (req: Request, res: Response) => {
  try {
    const { slideContent, slideNumber, hasImages, hasAnimations } = req.body;
    logger.info(`[API] Analyzing slide ${slideNumber}`);

    const analysis = await cognitiveLoadAgent.analyzeSlideComplexity({
      slideContent, slideNumber, hasImages, hasAnimations
    });
    res.json(analysis);
  } catch (error) {
    logger.error('[API] Error analyzing slide:', error);
    res.status(500).json({ error: 'Failed to analyze slide' });
  }
});

router.post('/cognitive-load/chunking', async (req: Request, res: Response) => {
  try {
    const { content, contentId, targetAudience } = req.body;
    logger.info(`[API] Generating chunking recommendations`);

    const recommendations = await cognitiveLoadAgent.generateChunkingRecommendations({
      content, contentId, targetAudience
    });
    res.json(recommendations);
  } catch (error) {
    logger.error('[API] Error generating recommendations:', error);
    res.status(500).json({ error: 'Failed to generate chunking recommendations' });
  }
});

// ============================================================================
// GROWTH MINDSET
// ============================================================================

router.post('/growth-mindset/struggle-messages', async (req: Request, res: Response) => {
  try {
    const { context, topic, bloomLevel } = req.body;
    logger.info(`[API] Generating struggle messages for context: ${context}`);

    const messages = await growthMindsetAgent.generateStruggleMessages({
      context, topic, bloomLevel
    });
    res.json(messages);
  } catch (error) {
    logger.error('[API] Error generating messages:', error);
    res.status(500).json({ error: 'Failed to generate struggle messages' });
  }
});

router.post('/growth-mindset/praise-templates', async (req: Request, res: Response) => {
  try {
    const { situations } = req.body;
    logger.info('[API] Generating process praise templates');

    const templates = await growthMindsetAgent.generateProcessPraiseTemplates(situations);
    res.json(templates);
  } catch (error) {
    logger.error('[API] Error generating templates:', error);
    res.status(500).json({ error: 'Failed to generate praise templates' });
  }
});

router.post('/growth-mindset/productive-failure', async (req: Request, res: Response) => {
  try {
    const { topic, targetConcept, duration, priorKnowledge } = req.body;
    logger.info(`[API] Generating productive failure activity for: ${topic}`);

    const activity = await growthMindsetAgent.generateProductiveFailureActivity({
      topic, targetConcept, duration, priorKnowledge
    });
    res.json(activity);
  } catch (error) {
    logger.error('[API] Error generating activity:', error);
    res.status(500).json({ error: 'Failed to generate productive failure activity' });
  }
});

router.post('/growth-mindset/convert-feedback', async (req: Request, res: Response) => {
  try {
    const { originalFeedback, situation } = req.body;
    logger.info('[API] Converting feedback language');

    const converted = await growthMindsetAgent.convertFeedbackLanguage({
      originalFeedback, situation
    });
    res.json(converted);
  } catch (error) {
    logger.error('[API] Error converting feedback:', error);
    res.status(500).json({ error: 'Failed to convert feedback' });
  }
});

// ============================================================================
// DESIRABLE DIFFICULTIES
// ============================================================================

router.post('/desirable-difficulties/generation-exercise', async (req: Request, res: Response) => {
  try {
    const { topic, concept, type, scaffolding } = req.body;
    logger.info(`[API] Generating ${type} exercise for: ${concept}`);

    const exercise = await desirableDifficultiesAgent.generateGenerationExercise({
      topic, concept, type, scaffolding
    });
    res.json(exercise);
  } catch (error) {
    logger.error('[API] Error generating exercise:', error);
    res.status(500).json({ error: 'Failed to generate generation exercise' });
  }
});

router.post('/desirable-difficulties/interleaved-practice', async (req: Request, res: Response) => {
  try {
    const { topics, questionsPerTopic, includeContrastingCases } = req.body;
    logger.info(`[API] Generating interleaved practice for ${topics.length} topics`);

    const practiceSet = await desirableDifficultiesAgent.generateInterleavedPractice({
      topics, questionsPerTopic, includeContrastingCases
    });
    res.json(practiceSet);
  } catch (error) {
    logger.error('[API] Error generating practice set:', error);
    res.status(500).json({ error: 'Failed to generate interleaved practice' });
  }
});

router.post('/desirable-difficulties/pretesting', async (req: Request, res: Response) => {
  try {
    const { topic, concepts, difficultyLevel } = req.body;
    logger.info(`[API] Generating pretesting activity for: ${topic}`);

    const activity = await desirableDifficultiesAgent.generatePretestingActivity({
      topic, concepts, difficultyLevel
    });
    res.json(activity);
  } catch (error) {
    logger.error('[API] Error generating activity:', error);
    res.status(500).json({ error: 'Failed to generate pretesting activity' });
  }
});

// ============================================================================
// ELABORATIVE INTERROGATION
// ============================================================================

router.post('/elaboration/prompts', async (req: Request, res: Response) => {
  try {
    const { content, targetConcept, type, scaffoldLevel } = req.body;
    logger.info(`[API] Generating ${type} prompts for: ${targetConcept}`);

    const prompts = await elaborativeAgent.generateElaborativePrompts({
      content, targetConcept, type, scaffoldLevel
    });
    res.json(prompts);
  } catch (error) {
    logger.error('[API] Error generating prompts:', error);
    res.status(500).json({ error: 'Failed to generate elaborative prompts' });
  }
});

router.post('/elaboration/causal-scaffold', async (req: Request, res: Response) => {
  try {
    const { phenomenon, domain, priorKnowledge } = req.body;
    logger.info(`[API] Generating causal scaffold for: ${phenomenon}`);

    const scaffold = await elaborativeAgent.generateCausalScaffold({
      phenomenon, domain, priorKnowledge
    });
    res.json(scaffold);
  } catch (error) {
    logger.error('[API] Error generating scaffold:', error);
    res.status(500).json({ error: 'Failed to generate causal scaffold' });
  }
});

router.post('/elaboration/connection-exercise', async (req: Request, res: Response) => {
  try {
    const { newConcept, priorConcepts, domain } = req.body;
    logger.info(`[API] Generating connection exercise for: ${newConcept}`);

    const exercise = await elaborativeAgent.generateConnectionExercise({
      newConcept, priorConcepts, domain
    });
    res.json(exercise);
  } catch (error) {
    logger.error('[API] Error generating exercise:', error);
    res.status(500).json({ error: 'Failed to generate connection exercise' });
  }
});

router.post('/elaboration/question-training', async (req: Request, res: Response) => {
  try {
    const { topic, sampleContent, targetQuality } = req.body;
    logger.info(`[API] Generating question training for: ${topic}`);

    const training = await elaborativeAgent.generateQuestionTraining({
      topic, sampleContent, targetQuality
    });
    res.json(training);
  } catch (error) {
    logger.error('[API] Error generating training:', error);
    res.status(500).json({ error: 'Failed to generate question training' });
  }
});

// ============================================================================
// TRANSFER
// ============================================================================

router.post('/transfer/activity', async (req: Request, res: Response) => {
  try {
    const { sourceConcept, sourceContext, targetContext, transferDistance, scaffoldingLevel } = req.body;
    logger.info(`[API] Generating ${transferDistance} transfer activity`);

    const activity = await transferAgent.generateTransferActivity({
      sourceConcept, sourceContext, targetContext, transferDistance, scaffoldingLevel
    });
    res.json(activity);
  } catch (error) {
    logger.error('[API] Error generating activity:', error);
    res.status(500).json({ error: 'Failed to generate transfer activity' });
  }
});

router.post('/transfer/analogical-exercise', async (req: Request, res: Response) => {
  try {
    const { sourceCase, targetDomain } = req.body;
    logger.info(`[API] Generating analogical transfer exercise`);

    const exercise = await transferAgent.generateAnalogicalExercise({
      sourceCase, targetDomain
    });
    res.json(exercise);
  } catch (error) {
    logger.error('[API] Error generating exercise:', error);
    res.status(500).json({ error: 'Failed to generate analogical exercise' });
  }
});

router.post('/transfer/abstraction-ladder', async (req: Request, res: Response) => {
  try {
    const { concept, concreteExamples, targetAbstraction } = req.body;
    logger.info(`[API] Generating abstraction ladder for: ${concept}`);

    const ladder = await transferAgent.generateAbstractionLadder({
      concept, concreteExamples, targetAbstraction
    });
    res.json(ladder);
  } catch (error) {
    logger.error('[API] Error generating ladder:', error);
    res.status(500).json({ error: 'Failed to generate abstraction ladder' });
  }
});

// ============================================================================
// LEARNING SCIENCE RECOMMENDATIONS
// ============================================================================

router.post('/learning-science/analyze-course', async (req: Request, res: Response) => {
  try {
    const { courseId, currentPractices, contentTypes, classSize, modality } = req.body;
    logger.info(`[API] Analyzing course: ${courseId}`);

    const analysis = await learningScienceAgent.analyzeCourse({
      courseId, currentPractices, contentTypes, classSize, modality
    });
    res.json(analysis);
  } catch (error) {
    logger.error('[API] Error analyzing course:', error);
    res.status(500).json({ error: 'Failed to analyze course' });
  }
});

router.post('/learning-science/find-patterns', async (req: Request, res: Response) => {
  try {
    const { context, goals } = req.body;
    logger.info('[API] Finding matching pedagogical patterns');

    const patterns = await learningScienceAgent.findMatchingPatterns({ context, goals });
    res.json(patterns);
  } catch (error) {
    logger.error('[API] Error finding patterns:', error);
    res.status(500).json({ error: 'Failed to find patterns' });
  }
});

router.post('/learning-science/intervention', async (req: Request, res: Response) => {
  try {
    const { gap, currentState, constraints, priority } = req.body;
    logger.info(`[API] Generating intervention for gap: ${gap}`);

    const intervention = await learningScienceAgent.generateIntervention({
      gap, currentState, constraints, priority
    });
    res.json(intervention);
  } catch (error) {
    logger.error('[API] Error generating intervention:', error);
    res.status(500).json({ error: 'Failed to generate intervention' });
  }
});

router.post('/learning-science/professional-development', async (req: Request, res: Response) => {
  try {
    const { gaps, timeAvailable } = req.body;
    logger.info('[API] Getting professional development recommendations');

    const recommendations = await learningScienceAgent.getProfessionalDevelopment(gaps, timeAvailable);
    res.json(recommendations);
  } catch (error) {
    logger.error('[API] Error getting recommendations:', error);
    res.status(500).json({ error: 'Failed to get professional development recommendations' });
  }
});

// ============================================================================
// STUDENT PERSPECTIVE
// ============================================================================

router.post('/student-perspective/novice-model', async (req: Request, res: Response) => {
  try {
    const { concept, domain, priorKnowledge, commonBackgrounds } = req.body;
    logger.info(`[API] Generating novice mental model for: ${concept}`);

    const model = await studentPerspectiveAgent.generateNoviceMentalModel({
      concept, domain, priorKnowledge, commonBackgrounds
    });
    res.json(model);
  } catch (error) {
    logger.error('[API] Error generating model:', error);
    res.status(500).json({ error: 'Failed to generate novice model' });
  }
});

router.post('/student-perspective/prerequisite-gaps', async (req: Request, res: Response) => {
  try {
    const { targetConcept, intendedPrerequisites, studentPopulation } = req.body;
    logger.info(`[API] Detecting prerequisite gaps for: ${targetConcept}`);

    const gaps = await studentPerspectiveAgent.detectPrerequisiteGaps({
      targetConcept, intendedPrerequisites, studentPopulation
    });
    res.json(gaps);
  } catch (error) {
    logger.error('[API] Error detecting gaps:', error);
    res.status(500).json({ error: 'Failed to detect prerequisite gaps' });
  }
});

router.post('/student-perspective/predict-confusion', async (req: Request, res: Response) => {
  try {
    const { content, topic, studentLevel } = req.body;
    logger.info(`[API] Predicting confusion points for: ${topic}`);

    const predictions = await studentPerspectiveAgent.predictConfusionPoints({
      content, topic, studentLevel
    });
    res.json(predictions);
  } catch (error) {
    logger.error('[API] Error predicting confusion:', error);
    res.status(500).json({ error: 'Failed to predict confusion points' });
  }
});

router.post('/student-perspective/readability', async (req: Request, res: Response) => {
  try {
    const { content, targetAudience } = req.body;
    logger.info(`[API] Analyzing readability for: ${targetAudience}`);

    const analysis = await studentPerspectiveAgent.analyzeReadability(content, targetAudience);
    res.json(analysis);
  } catch (error) {
    logger.error('[API] Error analyzing readability:', error);
    res.status(500).json({ error: 'Failed to analyze readability' });
  }
});

router.post('/student-perspective/time-estimate', async (req: Request, res: Response) => {
  try {
    const { tasks, studentLevel } = req.body;
    logger.info(`[API] Estimating time for ${tasks.length} tasks`);

    const estimate = await studentPerspectiveAgent.estimateTimeOnTask({ tasks, studentLevel });
    res.json(estimate);
  } catch (error) {
    logger.error('[API] Error estimating time:', error);
    res.status(500).json({ error: 'Failed to estimate time on task' });
  }
});

export default router;
