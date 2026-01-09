# Usability Testing Plan: Lecture Workflow Enhancement Validation

## Executive Summary

This document outlines a comprehensive usability testing protocol to validate the recently implemented UX improvements across all 5 phases of the Teaching Assistant platform's lecture builder workflow.

**Testing Period:** 2 weeks
**Participant Target:** 12-15 university instructors
**Method:** Moderated remote usability testing + unmoderated analytics

---

## 1. Testing Objectives

### Primary Goals
1. Validate effectiveness of new error handling and recovery mechanisms
2. Assess clarity and helpfulness of enhanced loading states with time estimates
3. Measure user understanding of stats cards and progress indicators
4. Evaluate intuitiveness of retry functionality across all phases
5. Identify any remaining friction points or confusion in the workflow

### Success Metrics
- **Task Completion Rate:** Target >85% (up from estimated 60% baseline)
- **Time to First Success:** Target <5 minutes (down from ~20 minutes)
- **Error Recovery Rate:** Target >90% of users successfully recover from errors
- **User Satisfaction (SUS Score):** Target >75 (industry standard for "good")
- **Cognitive Load (NASA-TLX):** Target <40 (low cognitive load)

---

## 2. Participant Recruitment

### Target Personas (12-15 participants)

**Profile Distribution:**
- 4 Early Career Faculty (1-3 years teaching)
- 4 Mid-Career Faculty (4-10 years teaching)
- 4 Senior Faculty (10+ years teaching)

**Discipline Mix:**
- 3 STEM (Science, Technology, Engineering, Math)
- 3 Humanities (History, Literature, Philosophy)
- 3 Social Sciences (Psychology, Sociology, Economics)
- 3 Professional Programs (Business, Education, Health Sciences)

**Technical Proficiency:**
- 5 Low (basic computer skills, limited ed-tech experience)
- 5 Medium (comfortable with standard tools)
- 5 High (early adopter, multiple ed-tech platforms)

### Recruitment Criteria
- Currently teaching at university level
- Plans to develop a new lecture in next 6 months
- Willing to provide honest feedback
- Available for 60-minute remote session
- Not previously exposed to the platform

### Recruitment Channels
- Education technology mailing lists
- University teaching centers
- Faculty development programs
- Professional education conferences
- Social media (Twitter/X, LinkedIn education groups)

**Incentive:** $75 Amazon gift card + 6-month premium platform access

---

## 3. Test Scenarios & Tasks

### Session Flow (60 minutes total)

#### Pre-Test (10 minutes)
1. **Welcome & Consent** (3 min)
   - Explain study purpose and consent process
   - Emphasize think-aloud protocol
   - Set comfortable, exploratory tone

2. **Background Interview** (7 min)
   - Teaching experience and disciplines
   - Current lecture preparation process
   - Pain points with existing tools
   - Technology comfort level

#### Core Testing (40 minutes)

**Scenario Setup:**
"You're preparing a new 50-minute undergraduate lecture on [topic relevant to their discipline]. You want to create a well-structured, engaging lecture that incorporates evidence-based teaching practices. Use the Teaching Assistant platform to develop this lecture."

**Task 1: First-Time Onboarding (5 min)**
- Observe first impressions and initial navigation
- Note reactions to onboarding modal
- Track completion or skip behavior
- *Measure: Time to start workflow, comprehension of two paths*

**Task 2: Complete Intake Form - Phase 1 (8 min)**
- Navigate to lecture builder
- Complete intake form with guidance
- Use form tooltips and examples
- Experience auto-save functionality
- *Measure: Form completion time, tooltip usage rate, error encounters*

**Task 3: Review Architecture - Phase 2 (7 min)**
- Wait through generation process
- Review learning objectives and structure
- Understand stats cards and metrics
- Make a revision request (if comfortable)
- *Measure: Comprehension of objectives, perceived wait time, confidence in output*

**Task 4: Explore Content Development - Phase 3 (7 min)**
- Navigate between segments and activities tabs
- Expand and review segment details
- Understand parallel agent execution
- *Measure: Tab navigation ease, content clarity, engagement with details*

**Task 5: Error Recovery Simulation (5 min)**
- **Simulated Error Injection:** Trigger a network error during generation
- Observe error message comprehension
- Use retry functionality
- *Measure: Error understanding, recovery success, emotional response*

**Task 6: Review Remaining Phases (8 min)**
- Quick review of Visual Design phase (Phase 4)
- Complete Integration phase (Phase 5)
- Download final package
- *Measure: Overall flow comprehension, satisfaction with output*

#### Post-Test (10 minutes)

1. **Satisfaction Survey** (5 min)
   - System Usability Scale (SUS) - 10 questions
   - NASA Task Load Index (TLX) - 6 dimensions
   - Net Promoter Score (NPS) - 1 question

2. **Retrospective Interview** (5 min)
   - Most helpful features
   - Most confusing moments
   - Improvement suggestions
   - Likelihood to use in real teaching

---

## 4. Measurement Framework

### Quantitative Metrics

**Usability Metrics:**
- Task completion rate (% per task)
- Time on task (seconds per phase)
- Error frequency (count per session)
- Error recovery success rate (%)
- Click path efficiency (actual vs. optimal clicks)

**Satisfaction Metrics:**
- System Usability Scale (SUS) score (0-100)
- NASA-TLX cognitive load (0-100)
- Net Promoter Score (NPS) (-100 to +100)
- Feature-specific satisfaction (5-point Likert)

**Engagement Metrics:**
- Tooltip hover/click rate (%)
- Example usage rate (%)
- Auto-save trigger frequency
- Phase completion rate (%)
- Time spent reviewing generated content

### Qualitative Observations

**Think-Aloud Protocol:**
- Verbal reactions during tasks
- Confusion points and hesitations
- Positive surprise moments
- Unsolicited suggestions

**Behavioral Observations:**
- Mouse movement patterns
- Reading behavior (scanning vs. detailed)
- Navigation patterns
- Error recovery strategies

**Interview Insights:**
- Feature preferences
- Workflow comprehension
- Trust in AI-generated content
- Comparison to existing tools

---

## 5. Testing Protocol

### Pre-Session Setup

**Technical Requirements:**
- Zoom or similar video conferencing
- Screen sharing enabled
- Recording consent obtained
- Test environment prepared with stable demo data

**Moderator Preparation:**
- Review participant background
- Prepare scenario customization
- Test recording equipment
- Have contingency plans for technical issues

### During Session Guidelines

**Moderator Behavior:**
- Remain neutral and non-leading
- Encourage think-aloud continuously
- Ask clarifying questions only when necessary
- Allow participants to struggle (don't rescue too quickly)
- Note exact timestamps for key moments

**Intervention Criteria:**
- Only intervene after 3 minutes of struggle
- Provide minimal hints, not solutions
- Document intervention as data point

### Post-Session Process

**Immediate (within 30 minutes):**
- Debrief and note initial impressions
- Tag critical incidents
- Identify urgent issues for tracking

**Within 24 hours:**
- Transcribe key quotes
- Complete observation notes
- Update issue tracker

---

## 6. Analysis Plan

### Data Synthesis Approach

**Phase 1: Individual Analysis (after each session)**
- Calculate quantitative metrics
- Identify critical incidents
- Note recurring patterns
- Tag severity of issues

**Phase 2: Cross-Session Analysis (after 6 sessions)**
- Aggregate quantitative data
- Identify consistent patterns
- Prioritize issues by frequency and impact
- Create preliminary recommendations

**Phase 3: Final Analysis (after all sessions)**
- Statistical significance testing
- Pattern validation across personas
- Priority matrix of findings
- Comprehensive recommendation report

### Issue Severity Classification

**Critical (P0):**
- Prevents task completion
- Causes data loss
- Observed in >50% of sessions
- High negative emotional impact

**High (P1):**
- Significant friction or confusion
- Observed in 25-50% of sessions
- Workarounds exist but costly
- Medium negative emotional impact

**Medium (P2):**
- Minor friction or confusion
- Observed in 10-25% of sessions
- Easy workarounds available
- Low negative emotional impact

**Low (P3):**
- Polish and optimization opportunities
- Observed in <10% of sessions
- No significant impact on success

---

## 7. Specific Testing Focus Areas

### A. Error Handling & Recovery

**Test Scenarios:**
1. Network interruption during generation
2. Invalid form input (missing required fields)
3. Session timeout during long generation
4. Browser refresh mid-workflow

**Validation Questions:**
- Do users understand what went wrong?
- Do they know how to recover?
- Does retry functionality work intuitively?
- How do users feel during error states?

### B. Loading States & Time Estimates

**Test Scenarios:**
1. Each phase generation process (all 5 phases)
2. Parallel agent execution visualization
3. Progress bar and percentage updates

**Validation Questions:**
- Are time estimates helpful and accurate?
- Do users feel informed during waits?
- Is anxiety reduced compared to spinner-only?
- Do users abandon less frequently?

### C. Stats Cards & Metrics

**Test Scenarios:**
1. First encounter with stats in Phase 2
2. Comparison across phases (Phase 3 & 4 have different metrics)
3. Understanding of what metrics mean

**Validation Questions:**
- Do users notice the stats cards?
- Do they understand what metrics represent?
- Are metrics useful for decision-making?
- What additional metrics would be helpful?

### D. Form Guidance & Examples

**Test Scenarios:**
1. Intake form with tooltips and examples
2. "Try an example" button usage
3. Form validation and error messages

**Validation Questions:**
- Do users discover tooltips naturally?
- Are tooltip contents helpful?
- Do users use example data?
- Does example data improve completion quality?

### E. Overall Workflow Comprehension

**Test Scenarios:**
1. First-time navigation through all 5 phases
2. Understanding of checkpoint/approval process
3. Relationship between phases

**Validation Questions:**
- Do users understand the overall process?
- Is the phase progression logical?
- Do checkpoints feel empowering or burdensome?
- What would improve workflow clarity?

---

## 8. Reporting Structure

### Immediate (During Testing - Weekly)

**Stakeholder Email Updates:**
- Number of sessions completed
- High-level themes emerging
- Critical issues identified
- Timeline status

### Mid-Point Report (After 6 sessions)

**Contents:**
- Preliminary quantitative results
- Key patterns and themes
- Urgent issues requiring immediate attention
- Recommended protocol adjustments

### Final Report (2 weeks after final session)

**Executive Summary** (2 pages)
- Key findings and metrics
- Priority recommendations
- Impact assessment

**Detailed Findings** (15-20 pages)
- Comprehensive quantitative analysis
- Qualitative insights with quotes
- Issue-by-issue breakdown with severity
- Pattern analysis across personas

**Recommendations** (5-10 pages)
- Prioritized action items
- Design iterations with mockups
- Implementation effort estimates
- Expected impact on metrics

**Appendices**
- Raw data and statistical analyses
- Session recordings and transcripts
- Participant demographics
- Detailed protocol and scripts

---

## 9. Success Criteria

### This Testing Round is Successful If:

1. **Validation Achieved:**
   - ≥80% of recent UX improvements validated as effective
   - Clear data on which improvements had highest impact
   - Confidence in user satisfaction metrics

2. **Issues Identified:**
   - Remaining friction points documented with severity
   - Clear prioritization for next iteration
   - No critical (P0) blockers discovered

3. **Insights Gained:**
   - Deep understanding of user mental models
   - Validated personas and use cases
   - New opportunities for enhancement identified

4. **Stakeholder Alignment:**
   - Development team has clear priorities
   - Product leadership confident in direction
   - Foundation for future testing established

---

## 10. Timeline

### Week 1: Preparation
- **Day 1-2:** Finalize test protocol and scripts
- **Day 3-4:** Recruit participants (rolling)
- **Day 5:** Conduct pilot test with internal user
- **Day 6-7:** Refine protocol based on pilot

### Week 2-3: Testing
- **Sessions:** 2-3 per day, staggered times
- **Analysis:** Daily synthesis, weekly stakeholder updates
- **Adjustments:** Protocol refinements as needed

### Week 4: Analysis & Reporting
- **Day 1-5:** Deep data analysis and synthesis
- **Day 6-8:** Report writing and visualization
- **Day 9:** Stakeholder presentation
- **Day 10:** Final report delivery

---

## 11. Risk Mitigation

### Potential Risks & Mitigations

**Risk: Low participant recruitment**
- *Mitigation:* Multiple recruitment channels, flexible scheduling, compelling incentive

**Risk: Technical failures during sessions**
- *Mitigation:* Backup recording methods, pre-session tech checks, demo environment monitoring

**Risk: Participant bias (overly positive/negative)**
- *Mitigation:* Diverse recruitment, neutral questioning, triangulate with behavioral data

**Risk: Insights not actionable**
- *Mitigation:* Clear issue severity framework, development team involvement in planning

**Risk: Timeline delays**
- *Mitigation:* Buffer in schedule, rolling recruitment, parallel analysis

---

## 12. Follow-Up Plan

### Post-Testing Actions

**Immediate (Within 1 week):**
- Fix any P0 critical issues discovered
- Share key insights with full team
- Plan iteration sprint

**Short-term (2-4 weeks):**
- Implement P1 high-priority improvements
- Design solutions for medium-priority issues
- Begin planning next testing round

**Long-term (1-3 months):**
- Launch improved version
- Monitor analytics for validation
- Conduct follow-up satisfaction survey
- Plan comprehensive feature testing

---

## Appendix A: Testing Scripts

### Pre-Test Script

"Hello [Name], thank you for joining today. My name is [Moderator], and I'll be guiding you through this session.

Today we're testing the Teaching Assistant platform, which helps university instructors design evidence-based lectures. We're particularly interested in understanding how real instructors like yourself experience the lecture creation workflow.

A few important things before we start:
- This session will take about 60 minutes
- We're testing the platform, not you—there are no wrong answers
- Please think aloud as you work—tell me what you're thinking, feeling, noticing
- If something is confusing or frustrating, that's valuable feedback
- I'll be recording the session for analysis, but your identity will remain confidential
- Do you have any questions before we begin?

Great! Let's get started with a few background questions..."

### Task Introduction Script

"Now I'd like you to use the platform for your own scenario. Imagine you're preparing a new 50-minute undergraduate lecture on [topic relevant to their discipline].

Your goal is to create a well-structured, engaging lecture using the Teaching Assistant platform. I'll observe as you work through the process, but I want you to use it as naturally as possible. Remember to think aloud—tell me what you're seeing, thinking, and feeling.

Do you have any questions? You can start whenever you're ready."

### Post-Error Observation Script

"I noticed you encountered an error just now. Can you tell me:
- What happened from your perspective?
- What did you think when you saw the error message?
- Did you understand what went wrong?
- How did you decide what to do next?
- How confident were you that your action would work?"

### Closing Script

"That completes the testing portion. Thank you so much for your thoughtful feedback and think-aloud comments. Before we finish, I have a few final questions...

[Post-test survey]

Thank you again for your time and insights. Your feedback will directly improve the platform for educators like yourself. You'll receive your gift card within 2 business days. If you have any follow-up thoughts, feel free to email us at [contact]. Have a great day!"

---

## Appendix B: Survey Instruments

### System Usability Scale (SUS)

Response scale: 1 (Strongly Disagree) to 5 (Strongly Agree)

1. I think that I would like to use this platform frequently
2. I found the platform unnecessarily complex
3. I thought the platform was easy to use
4. I think that I would need support to be able to use this platform
5. I found the various features were well integrated
6. I thought there was too much inconsistency in the platform
7. I would imagine that most instructors would learn to use this platform quickly
8. I found the platform very cumbersome to use
9. I felt very confident using the platform
10. I needed to learn a lot of things before I could get going with this platform

**Scoring:** ((Sum of odd items - 5) + (25 - sum of even items)) × 2.5

### NASA Task Load Index (TLX)

Rate each dimension: 0 (Very Low) to 100 (Very High)

1. **Mental Demand:** How mentally demanding was the task?
2. **Physical Demand:** How physically demanding was the task?
3. **Temporal Demand:** How hurried or rushed was the pace?
4. **Performance:** How successful were you in accomplishing the task?
5. **Effort:** How hard did you have to work?
6. **Frustration:** How insecure, discouraged, irritated, stressed, and annoyed were you?

**Scoring:** Average of all dimensions

### Net Promoter Score (NPS)

"How likely are you to recommend the Teaching Assistant platform to a colleague?"
- Scale: 0 (Not at all likely) to 10 (Extremely likely)
- **Scoring:** % Promoters (9-10) - % Detractors (0-6)

---

## Document Version

**Version:** 1.0
**Date:** January 9, 2026
**Author:** UX Research Team
**Approval:** Product Leadership
**Next Review:** Post-testing completion
