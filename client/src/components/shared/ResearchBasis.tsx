import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, BookOpenIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

interface Citation {
  authors: string;
  year: string;
  title: string;
  source: string;
  finding?: string;
}

interface ResearchBasisProps {
  title: string;
  summary: string;
  whatItMeans: string;
  citations: Citation[];
  color?: 'sage' | 'terracotta' | 'slate' | 'wine' | 'gold';
  defaultExpanded?: boolean;
}

const ResearchBasis: React.FC<ResearchBasisProps> = ({
  title,
  summary,
  whatItMeans,
  citations,
  color = 'gold',
  defaultExpanded = false
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const colorClasses = {
    sage: {
      bg: 'bg-scholarly-sage/5',
      border: 'border-scholarly-sage/30',
      accent: 'text-scholarly-sage',
      button: 'hover:bg-scholarly-sage/10',
    },
    terracotta: {
      bg: 'bg-scholarly-terracotta/5',
      border: 'border-scholarly-terracotta/30',
      accent: 'text-scholarly-terracotta',
      button: 'hover:bg-scholarly-terracotta/10',
    },
    slate: {
      bg: 'bg-scholarly-slate/5',
      border: 'border-scholarly-slate/30',
      accent: 'text-scholarly-slate',
      button: 'hover:bg-scholarly-slate/10',
    },
    wine: {
      bg: 'bg-scholarly-wine/5',
      border: 'border-scholarly-wine/30',
      accent: 'text-scholarly-wine',
      button: 'hover:bg-scholarly-wine/10',
    },
    gold: {
      bg: 'bg-brand-gold/5',
      border: 'border-brand-gold/30',
      accent: 'text-brand-gold',
      button: 'hover:bg-brand-gold/10',
    },
  };

  const classes = colorClasses[color];

  return (
    <div className={`rounded-lg border-l-3 ${classes.border} ${classes.bg} overflow-hidden`}>
      {/* Always Visible Header */}
      <div className="p-4">
        <div className="flex items-start space-x-3">
          <div className={`p-1.5 rounded-md ${classes.bg}`}>
            <BookOpenIcon className={`h-4 w-4 ${classes.accent}`} />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-brand-navy mb-1">
              Research Basis: {title}
            </h4>
            <p className="text-sm text-brand-text leading-relaxed">
              {summary}
            </p>
          </div>
        </div>

        {/* Expand Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`mt-3 flex items-center space-x-1.5 text-xs font-medium ${classes.accent} ${classes.button} px-2 py-1 rounded-md transition-colors`}
        >
          <span>{isExpanded ? 'Hide details' : 'Learn more about the research'}</span>
          <ChevronDownIcon
            className={`h-3.5 w-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-brand-border-subtle pt-4 space-y-4">
              {/* What This Means for You */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <AcademicCapIcon className={`h-4 w-4 ${classes.accent}`} />
                  <h5 className="text-xs font-semibold text-brand-navy uppercase tracking-wide">
                    What This Means for Your Teaching
                  </h5>
                </div>
                <p className="text-sm text-brand-text leading-relaxed pl-6">
                  {whatItMeans}
                </p>
              </div>

              {/* Key Citations */}
              <div>
                <h5 className="text-xs font-semibold text-brand-navy uppercase tracking-wide mb-3">
                  Key Research
                </h5>
                <div className="space-y-3">
                  {citations.map((citation, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-md p-3 border border-brand-border-subtle"
                    >
                      <p className="text-xs text-brand-text-light mb-1">
                        <span className="font-medium text-brand-navy">{citation.authors}</span>
                        {' '}({citation.year})
                      </p>
                      <p className="text-sm font-medium text-brand-navy mb-1">
                        {citation.title}
                      </p>
                      <p className="text-xs text-brand-text-light italic mb-2">
                        {citation.source}
                      </p>
                      {citation.finding && (
                        <p className="text-xs text-brand-text bg-brand-bg/50 rounded p-2 leading-relaxed">
                          <span className="font-medium">Key finding:</span> {citation.finding}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Research Note */}
              <p className="text-xs text-brand-text-light italic">
                This tool applies research-supported principles to help you design more effective learning experiences.
                Results may vary based on your specific context and student population.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResearchBasis;

// Pre-configured research data for each pedagogical concept
export const researchData = {
  spacedRepetition: {
    title: 'Spaced Repetition & the Forgetting Curve',
    summary: 'Memory fades predictably over time (the "forgetting curve"), but reviewing information at strategic intervals dramatically improves long-term retention. This effect has been replicated across hundreds of studies since the 1880s.',
    whatItMeans: 'Instead of cramming all review into one session, space it out. A concept reviewed today, then in 2 days, then in a week, then in a month will be remembered far better than one reviewed four times in a single day. Even brief reviews at the right time can strengthen memory significantly.',
    citations: [
      {
        authors: 'Ebbinghaus, H.',
        year: '1885',
        title: 'Memory: A Contribution to Experimental Psychology',
        source: 'Originally published in German; translated 1913',
        finding: 'First documented the forgetting curve showing memory decays exponentially, but strategic review resets this curve.'
      },
      {
        authors: 'Cepeda, N. J., Pashler, H., Vul, E., Wixted, J. T., & Rohrer, D.',
        year: '2006',
        title: 'Distributed practice in verbal recall tasks: A review and quantitative synthesis',
        source: 'Psychological Bulletin, 132(3), 354-380',
        finding: 'Meta-analysis of 254 studies confirmed spacing effects across different materials, populations, and time intervals.'
      },
      {
        authors: 'Wozniak, P. & Gorzelanczyk, E.',
        year: '1994',
        title: 'Optimization of repetition spacing in the practice of learning',
        source: 'Acta Neurobiologiae Experimentalis, 54, 59-62',
        finding: 'Developed the SM-2 algorithm that calculates optimal review intervals based on how easily material was recalled.'
      }
    ]
  },

  cognitiveLoad: {
    title: 'Cognitive Load Theory',
    summary: 'Working memory can only hold about 4-7 items at once. When we overwhelm it with too much new information, learning suffers. Effective instruction manages this limited capacity by reducing unnecessary mental effort.',
    whatItMeans: 'Break complex topics into smaller chunks. Remove extraneous details that do not directly support learning. Use diagrams and text together thoughtfully (not redundantly). Build on what students already know so they can "chunk" new information into existing mental frameworks.',
    citations: [
      {
        authors: 'Sweller, J.',
        year: '1988',
        title: 'Cognitive load during problem solving: Effects on learning',
        source: 'Cognitive Science, 12(2), 257-285',
        finding: 'Introduced cognitive load theory, showing that problem-solving during initial learning can overload working memory and impair learning.'
      },
      {
        authors: 'Sweller, J., van Merriënboer, J., & Paas, F.',
        year: '1998',
        title: 'Cognitive architecture and instructional design',
        source: 'Educational Psychology Review, 10, 251-296',
        finding: 'Distinguished three types of cognitive load: intrinsic (complexity of material), extraneous (poor design), and germane (effort toward learning).'
      },
      {
        authors: 'Mayer, R. E.',
        year: '2009',
        title: 'Multimedia Learning (2nd ed.)',
        source: 'Cambridge University Press',
        finding: 'Established principles like the "split-attention effect"—learning suffers when students must mentally integrate separated information sources.'
      }
    ]
  },

  retrievalPractice: {
    title: 'The Testing Effect & Retrieval Practice',
    summary: 'Taking a test is not just a way to measure learning—it actually strengthens memory more than restudying does. When you actively retrieve information from memory, you reinforce the neural pathways that make future retrieval easier.',
    whatItMeans: 'Include low-stakes quizzes and practice tests throughout your course, not just at the end. Even without feedback, the act of trying to remember strengthens learning. Students who quiz themselves retain far more than those who simply reread their notes.',
    citations: [
      {
        authors: 'Roediger, H. L., & Karpicke, J. D.',
        year: '2006',
        title: 'Test-enhanced learning: Taking memory tests improves long-term retention',
        source: 'Psychological Science, 17(3), 249-255',
        finding: 'Students who took practice tests remembered 50% more after one week than students who spent the same time rereading.'
      },
      {
        authors: 'Roediger, H. L., & Karpicke, J. D.',
        year: '2006',
        title: 'The power of testing memory: Basic research and implications for educational practice',
        source: 'Perspectives on Psychological Science, 1(3), 181-210',
        finding: 'Reviewed decades of research showing testing reduces forgetting dramatically—from 56% forgotten to just 13% in some studies.'
      },
      {
        authors: 'Adesope, O. O., Trevisan, D. A., & Sundararajan, N.',
        year: '2017',
        title: 'Rethinking the use of tests: A meta-analysis of practice testing',
        source: 'Review of Educational Research, 87(3), 659-701',
        finding: 'Meta-analysis of 272 studies confirmed robust testing effects across age groups, materials, and test formats.'
      }
    ]
  },

  formativeAssessment: {
    title: 'Formative Assessment',
    summary: 'When teachers regularly check student understanding and adjust instruction accordingly, learning improves dramatically. This is different from grading—it is about getting information to guide teaching in real time.',
    whatItMeans: 'Use quick checks during class (polls, exit tickets, thumbs up/down) to see if students understand before moving on. The goal is not to grade but to catch confusion early. Students who receive regular feedback on their thinking learn more than those who only get end-of-unit tests.',
    citations: [
      {
        authors: 'Black, P., & Wiliam, D.',
        year: '1998',
        title: 'Inside the Black Box: Raising standards through classroom assessment',
        source: 'Phi Delta Kappan, 80(2), 139-148',
        finding: 'Reviewed 250+ studies and found formative assessment produces effect sizes of 0.4-0.7, higher than most educational interventions.'
      },
      {
        authors: 'Hattie, J.',
        year: '2009',
        title: 'Visible Learning',
        source: 'Routledge',
        finding: 'Meta-analysis of 800+ studies ranked formative evaluation as one of the most powerful influences on student achievement.'
      },
      {
        authors: 'Wiliam, D.',
        year: '2011',
        title: 'Embedded Formative Assessment',
        source: 'Solution Tree Press',
        finding: 'Showed that formative assessment helps low-achieving students most, thereby narrowing achievement gaps.'
      }
    ]
  },

  metacognition: {
    title: 'Metacognition & Self-Regulated Learning',
    summary: 'Students who can accurately judge what they know and do not know—and adjust their study strategies accordingly—learn more effectively. This "thinking about thinking" can be taught.',
    whatItMeans: 'Help students develop the habit of asking themselves: "Do I really understand this, or does it just feel familiar?" Teach them that feeling confident is not the same as actually knowing. Strategies like self-testing, explaining concepts aloud, and predicting test questions build these skills.',
    citations: [
      {
        authors: 'Flavell, J. H.',
        year: '1979',
        title: 'Metacognition and cognitive monitoring: A new area of cognitive-developmental inquiry',
        source: 'American Psychologist, 34(10), 906-911',
        finding: 'Introduced the concept of metacognition, showing that awareness of one\'s own thinking processes is crucial for learning.'
      },
      {
        authors: 'Zimmerman, B. J.',
        year: '2002',
        title: 'Becoming a self-regulated learner: An overview',
        source: 'Theory into Practice, 41(2), 64-70',
        finding: 'Demonstrated that self-regulated learning involves forethought, performance monitoring, and self-reflection—all teachable skills.'
      },
      {
        authors: 'Dunlosky, J., & Rawson, K. A.',
        year: '2012',
        title: 'Overconfidence produces underachievement',
        source: 'Learning and Instruction, 22(4), 271-280',
        finding: 'Students often cannot accurately judge what they know; teaching calibration skills improves both judgment and performance.'
      }
    ]
  },

  activeLearning: {
    title: 'Active Learning',
    summary: 'Students learn more when they are doing something—discussing, solving problems, explaining—rather than passively listening to lectures. This is one of the most robust findings in education research.',
    whatItMeans: 'Break up lectures with activities where students process information: think-pair-share, problem solving, peer teaching. Even brief activities (2-3 minutes) significantly improve retention. The discomfort of active engagement is a sign that learning is happening.',
    citations: [
      {
        authors: 'Freeman, S., Eddy, S. L., McDonough, M., et al.',
        year: '2014',
        title: 'Active learning increases student performance in science, engineering, and mathematics',
        source: 'Proceedings of the National Academy of Sciences, 111(23), 8410-8415',
        finding: 'Meta-analysis of 225 studies: active learning raised exam scores by 6% and reduced failure rates by 55% compared to lecturing.'
      },
      {
        authors: 'Prince, M.',
        year: '2004',
        title: 'Does active learning work? A review of the research',
        source: 'Journal of Engineering Education, 93(3), 223-231',
        finding: 'Reviewed evidence for various active learning approaches; found consistent support across disciplines and contexts.'
      },
      {
        authors: 'Chi, M. T. H., & Wylie, R.',
        year: '2014',
        title: 'The ICAP framework: Linking cognitive engagement to active learning outcomes',
        source: 'Educational Psychologist, 49(4), 219-243',
        finding: 'Showed that interactive and constructive activities produce better learning than active tasks, which beat passive ones.'
      }
    ]
  },

  collaborativeLearning: {
    title: 'Collaborative & Cooperative Learning',
    summary: 'Students often learn better when working together than alone—but only when the collaboration is well-structured. Effective group work requires individual accountability and genuine interdependence.',
    whatItMeans: 'Structure group activities so that each person has a clear role and the group truly needs each member. Avoid "divide and conquer" approaches where students just split work. The learning happens in the discussion and negotiation of meaning, not just the final product.',
    citations: [
      {
        authors: 'Johnson, D. W., Johnson, R. T., & Smith, K. A.',
        year: '2014',
        title: 'Cooperative learning: Improving university instruction',
        source: 'Journal on Excellence in College Teaching, 25(3-4), 85-118',
        finding: 'Over 900 studies show cooperative learning improves achievement, relationships, and psychological health compared to competitive or individual approaches.'
      },
      {
        authors: 'Vygotsky, L. S.',
        year: '1978',
        title: 'Mind in Society: The development of higher psychological processes',
        source: 'Harvard University Press',
        finding: 'Introduced the "zone of proximal development"—what students can do with help today, they can do independently tomorrow.'
      },
      {
        authors: 'Springer, L., Stanne, M. E., & Donovan, S. S.',
        year: '1999',
        title: 'Effects of small-group learning on undergraduates in science, mathematics, engineering, and technology',
        source: 'Review of Educational Research, 69(1), 21-51',
        finding: 'Meta-analysis found small-group learning produced effect sizes of 0.51 for achievement and 0.46 for attitudes.'
      }
    ]
  },

  desirableDifficulties: {
    title: 'Desirable Difficulties',
    summary: 'Learning that feels easy often does not last. Introducing certain challenges—like mixing up practice or spacing it out—slows initial performance but dramatically improves long-term retention and transfer.',
    whatItMeans: 'Do not mistake smooth performance for durable learning. Interleave different types of problems rather than blocking by type. Have students generate answers before showing them. These approaches feel harder but produce better long-term results.',
    citations: [
      {
        authors: 'Bjork, R. A.',
        year: '1994',
        title: 'Memory and metamemory considerations in the training of human beings',
        source: 'In Metcalfe & Shimamura (Eds.), Metacognition: Knowing about knowing (pp. 185-205)',
        finding: 'Introduced "desirable difficulties"—challenges that slow learning but enhance retention and transfer.'
      },
      {
        authors: 'Rohrer, D., & Taylor, K.',
        year: '2007',
        title: 'The shuffling of mathematics problems improves learning',
        source: 'Instructional Science, 35(6), 481-498',
        finding: 'Students who practiced interleaved math problems scored 43% higher on delayed tests than those who practiced blocked problems.'
      },
      {
        authors: 'Kornell, N., & Bjork, R. A.',
        year: '2008',
        title: 'Learning concepts and categories: Is spacing the "enemy of induction"?',
        source: 'Psychological Science, 19(6), 585-592',
        finding: 'Spacing and interleaving improved category learning even though students incorrectly believed massing was more effective.'
      }
    ]
  },

  growthMindset: {
    title: 'Growth Mindset',
    summary: 'Students who believe intelligence can grow through effort (growth mindset) outperform those who believe it is fixed. How we talk about ability and struggle shapes these beliefs.',
    whatItMeans: 'Praise effort and strategy, not intelligence ("You worked hard on that" rather than "You are so smart"). Normalize struggle as part of learning, not a sign of inability. Frame challenges as opportunities to grow rather than tests of fixed ability.',
    citations: [
      {
        authors: 'Dweck, C. S.',
        year: '2006',
        title: 'Mindset: The New Psychology of Success',
        source: 'Random House',
        finding: 'Synthesized decades of research showing that beliefs about intelligence predict resilience, learning, and achievement.'
      },
      {
        authors: 'Mueller, C. M., & Dweck, C. S.',
        year: '1998',
        title: 'Praise for intelligence can undermine children\'s motivation and performance',
        source: 'Journal of Personality and Social Psychology, 75(1), 33-52',
        finding: 'Students praised for intelligence chose easier tasks, showed less persistence, and performed worse than those praised for effort.'
      },
      {
        authors: 'Yeager, D. S., & Dweck, C. S.',
        year: '2012',
        title: 'Mindsets that promote resilience',
        source: 'Educational Psychologist, 47(4), 302-314',
        finding: 'Brief mindset interventions (even 30 minutes) improved grades and persistence, especially for struggling students.'
      }
    ]
  },

  elaborativeInterrogation: {
    title: 'Elaborative Interrogation & Deep Processing',
    summary: 'Asking "Why?" and "How?" questions forces deeper processing than simply rereading or highlighting. Generating explanations connects new information to existing knowledge, creating stronger memories.',
    whatItMeans: 'Instead of just presenting facts, ask students to explain why those facts make sense. Have them generate their own explanations before providing yours. The effort of constructing explanations—even imperfect ones—builds understanding.',
    citations: [
      {
        authors: 'Pressley, M., McDaniel, M. A., Turnure, J. E., Wood, E., & Ahmad, M.',
        year: '1987',
        title: 'Generation and precision of elaboration: Effects on intentional and incidental learning',
        source: 'Journal of Experimental Psychology: Learning, Memory, and Cognition, 13, 291-300',
        finding: 'Students who generated explanations for "why" questions learned more than those given the explanations.'
      },
      {
        authors: 'Dunlosky, J., Rawson, K. A., Marsh, E. J., Nathan, M. J., & Willingham, D. T.',
        year: '2013',
        title: 'Improving students\' learning with effective learning techniques',
        source: 'Psychological Science in the Public Interest, 14(1), 4-58',
        finding: 'Comprehensive review rated elaborative interrogation as a moderately effective technique that works across many contexts.'
      },
      {
        authors: 'Chi, M. T. H.',
        year: '2009',
        title: 'Active-constructive-interactive: A conceptual framework for differentiating learning activities',
        source: 'Topics in Cognitive Science, 1(1), 73-105',
        finding: 'Constructive activities like self-explanation produce better learning than passive activities like reading or watching.'
      }
    ]
  },

  transferLearning: {
    title: 'Transfer of Learning',
    summary: 'Applying knowledge to new situations (transfer) is the ultimate goal of education but notoriously difficult to achieve. It requires deliberate practice with varied examples and explicit instruction in how to recognize when knowledge applies.',
    whatItMeans: 'Use diverse examples and problems, not just variations of the same scenario. Explicitly discuss how principles from one context apply to others. Have students practice identifying when and how to apply what they have learned. Do not assume transfer will happen automatically.',
    citations: [
      {
        authors: 'Perkins, D. N., & Salomon, G.',
        year: '1992',
        title: 'Transfer of learning',
        source: 'International Encyclopedia of Education (2nd ed.)',
        finding: 'Distinguished near transfer (similar contexts) from far transfer (different contexts); far transfer requires explicit instruction.'
      },
      {
        authors: 'Barnett, S. M., & Ceci, S. J.',
        year: '2002',
        title: 'When and where do we apply what we learn? A taxonomy for far transfer',
        source: 'Psychological Bulletin, 128(4), 612-637',
        finding: 'Transfer depends on surface similarity, time between learning and application, and how knowledge was encoded.'
      },
      {
        authors: 'Bransford, J. D., & Schwartz, D. L.',
        year: '1999',
        title: 'Rethinking transfer: A simple proposal with multiple implications',
        source: 'Review of Research in Education, 24, 61-100',
        finding: 'Transfer is better measured by "preparation for future learning" than immediate application to new problems.'
      }
    ]
  },

  inclusiveDesign: {
    title: 'Universal Design for Learning (UDL)',
    summary: 'Learners vary in how they perceive information, engage with material, and express understanding. Providing multiple means of each accommodates this variability and helps all students, not just those with disabilities.',
    whatItMeans: 'Offer information in multiple formats (text, audio, visual). Provide different ways for students to demonstrate understanding (written, oral, creative). Give choices in how students engage with material. What helps students with specific needs often helps everyone.',
    citations: [
      {
        authors: 'Rose, D. H., & Meyer, A.',
        year: '2002',
        title: 'Teaching Every Student in the Digital Age: Universal Design for Learning',
        source: 'ASCD',
        finding: 'Established three UDL principles based on brain networks: multiple means of representation, expression, and engagement.'
      },
      {
        authors: 'CAST',
        year: '2018',
        title: 'Universal Design for Learning Guidelines version 2.2',
        source: 'cast.org',
        finding: 'Provides detailed checkpoints for implementing UDL principles, grounded in learning science research.'
      },
      {
        authors: 'Al-Azawei, A., Serenelli, F., & Lundqvist, K.',
        year: '2016',
        title: 'Universal Design for Learning (UDL): A content analysis of peer-reviewed journal papers',
        source: 'Journal of the Scholarship of Teaching and Learning, 16(3), 39-56',
        finding: 'Review found UDL implementation consistently improves outcomes for students with and without disabilities.'
      }
    ]
  },

  caseBased: {
    title: 'Case-Based Learning',
    summary: 'Learning from real-world cases helps students develop problem-solving skills and see how abstract concepts apply in practice. Cases create memorable "anchors" that students can reference when facing similar situations.',
    whatItMeans: 'Use authentic scenarios that do not have obvious answers. Let students wrestle with complexity before providing guidance. Cases work best when they require students to apply multiple concepts together, as they would in real practice.',
    citations: [
      {
        authors: 'Thistlethwaite, J. E., et al.',
        year: '2012',
        title: 'The effectiveness of case-based learning in health professional education',
        source: 'Medical Teacher, 34(6), e421-e444',
        finding: 'Systematic review found case-based learning improves student satisfaction, self-confidence, and ability to apply knowledge.'
      },
      {
        authors: 'Williams, B.',
        year: '2005',
        title: 'Case based learning—a review of the literature',
        source: 'Journal of Emergency Primary Health Care, 3(1-2)',
        finding: 'Cases develop clinical reasoning by requiring students to integrate knowledge and make decisions under uncertainty.'
      },
      {
        authors: 'Kolodner, J. L.',
        year: '1992',
        title: 'An introduction to case-based reasoning',
        source: 'Artificial Intelligence Review, 6(1), 3-34',
        finding: 'Case-based reasoning mirrors how experts actually think—by adapting solutions from similar past experiences.'
      }
    ]
  },

  misconceptions: {
    title: 'Misconception Identification & Conceptual Change',
    summary: 'Students do not arrive as blank slates—they bring prior conceptions that may be incorrect. These misconceptions are often resistant to change and can block new learning if not addressed directly.',
    whatItMeans: 'Before teaching a concept, find out what students already believe. Address misconceptions directly by creating "cognitive conflict"—situations where their existing beliefs lead to predictions that turn out to be wrong. Simply providing correct information is rarely enough.',
    citations: [
      {
        authors: 'Vosniadou, S.',
        year: '2002',
        title: 'On the nature of naïve physics',
        source: 'In Limón & Mason (Eds.), Reconsidering conceptual change: Issues in theory and practice',
        finding: 'Showed that misconceptions are often part of coherent (if incorrect) mental models, making them resistant to simple correction.'
      },
      {
        authors: 'Chi, M. T. H.',
        year: '2008',
        title: 'Three types of conceptual change: Belief revision, mental model transformation, and categorical shift',
        source: 'In Vosniadou (Ed.), International handbook of research on conceptual change',
        finding: 'Distinguished different types of misconceptions requiring different instructional approaches.'
      },
      {
        authors: 'Posner, G. J., Strike, K. A., Hewson, P. W., & Gertzog, W. A.',
        year: '1982',
        title: 'Accommodation of a scientific conception: Toward a theory of conceptual change',
        source: 'Science Education, 66(2), 211-227',
        finding: 'Conceptual change requires dissatisfaction with current beliefs, plus an alternative that is intelligible, plausible, and fruitful.'
      }
    ]
  },

  adaptivePathways: {
    title: 'Adaptive Learning & Personalized Pathways',
    summary: 'Students learn at different rates and have different prerequisite knowledge. Adaptive learning systems that adjust difficulty and content based on individual performance can improve learning outcomes.',
    whatItMeans: 'Assess where students are before teaching new material. Provide different pathways for students at different levels. Allow students to move faster through material they already understand and spend more time on areas where they struggle.',
    citations: [
      {
        authors: 'VanLehn, K.',
        year: '2011',
        title: 'The relative effectiveness of human tutoring, intelligent tutoring systems, and other tutoring systems',
        source: 'Educational Psychologist, 46(4), 197-221',
        finding: 'Meta-analysis found intelligent tutoring systems produce learning gains nearly as large as human tutoring (effect size 0.76 vs 0.79).'
      },
      {
        authors: 'Pane, J. F., Steiner, E. D., Baird, M. D., & Hamilton, L. S.',
        year: '2017',
        title: 'Informing progress: Insights on personalized learning implementation and effects',
        source: 'RAND Corporation Research Report',
        finding: 'Schools implementing personalized learning showed modest but significant gains in math and reading achievement.'
      },
      {
        authors: 'Bloom, B. S.',
        year: '1984',
        title: 'The 2 sigma problem: The search for methods of group instruction as effective as one-to-one tutoring',
        source: 'Educational Researcher, 13(6), 4-16',
        finding: 'One-on-one tutoring produces 2 standard deviation improvements; adaptive instruction aims to approach this effect at scale.'
      }
    ]
  },

  learningScience: {
    title: 'Evidence-Based Learning Science',
    summary: 'Decades of cognitive science research have identified strategies that reliably improve learning. These principles apply across ages, subjects, and contexts, yet many popular study methods are ineffective.',
    whatItMeans: 'Rely on research-supported techniques like retrieval practice, spacing, and interleaving rather than intuition. What feels effective (highlighting, rereading) often is not. What feels harder (testing yourself, spacing practice) usually works better.',
    citations: [
      {
        authors: 'Dunlosky, J., Rawson, K. A., Marsh, E. J., Nathan, M. J., & Willingham, D. T.',
        year: '2013',
        title: 'Improving students\' learning with effective learning techniques',
        source: 'Psychological Science in the Public Interest, 14(1), 4-58',
        finding: 'Comprehensive review rated 10 common learning techniques; practice testing and distributed practice rated most effective.'
      },
      {
        authors: 'Pashler, H., Bain, P. M., Bottge, B. A., et al.',
        year: '2007',
        title: 'Organizing instruction and study to improve student learning',
        source: 'IES Practice Guide, NCER 2007-2004',
        finding: 'Identified seven research-based recommendations for organizing instruction to maximize learning.'
      },
      {
        authors: 'Roediger, H. L., & Pyc, M. A.',
        year: '2012',
        title: 'Inexpensive techniques to improve education: Applying cognitive psychology to enhance educational practice',
        source: 'Journal of Applied Research in Memory and Cognition, 1(4), 242-248',
        finding: 'Simple changes like adding practice tests and spacing study sessions improve learning with minimal cost.'
      }
    ]
  },

  courseAnalytics: {
    title: 'Learning Analytics',
    summary: 'Data about student behavior and performance can inform teaching decisions, but only when collected thoughtfully and analyzed with appropriate caution about what the data can and cannot reveal.',
    whatItMeans: 'Use data to identify students who may be struggling early. Look for patterns in what content students find difficult. Remember that engagement metrics (time on page, clicks) do not necessarily indicate learning.',
    citations: [
      {
        authors: 'Siemens, G., & Baker, R. S.',
        year: '2012',
        title: 'Learning analytics and educational data mining: Towards communication and collaboration',
        source: 'Proceedings of the 2nd International Conference on Learning Analytics and Knowledge',
        finding: 'Established the field of learning analytics as distinct from but related to educational data mining.'
      },
      {
        authors: 'Arnold, K. E., & Pistilli, M. D.',
        year: '2012',
        title: 'Course signals at Purdue: Using learning analytics to increase student success',
        source: 'Proceedings of the 2nd International Conference on Learning Analytics and Knowledge',
        finding: 'Early warning system using analytics improved retention and course grades for at-risk students.'
      },
      {
        authors: 'Wise, A. F., & Shaffer, D. W.',
        year: '2015',
        title: 'Why theory matters more than ever in the age of big data',
        source: 'Journal of Learning Analytics, 2(2), 5-13',
        finding: 'Cautions that learning analytics must be grounded in learning theory to be meaningful and actionable.'
      }
    ]
  },

  studentPerspective: {
    title: 'Student-Centered Design & Learner Experience',
    summary: 'Understanding how students experience learning—their cognitive load, motivation, and engagement—helps instructors design more effective courses. Taking the student perspective reveals barriers that may be invisible to experts.',
    whatItMeans: 'Regularly gather student feedback about what is confusing, overwhelming, or engaging. Consider the student\'s journey through your course, not just the content. What seems obvious to you may be a significant hurdle for learners encountering the material for the first time.',
    citations: [
      {
        authors: 'Ambrose, S. A., Bridges, M. W., DiPietro, M., Lovett, M. C., & Norman, M. K.',
        year: '2010',
        title: 'How Learning Works: Seven Research-Based Principles for Smart Teaching',
        source: 'Jossey-Bass',
        finding: 'Synthesized research into seven principles, emphasizing that how students perceive and organize knowledge affects their learning.'
      },
      {
        authors: 'Nathan, M. J., & Petrosino, A.',
        year: '2003',
        title: 'Expert blind spot among preservice teachers',
        source: 'American Educational Research Journal, 40(4), 905-928',
        finding: 'Experts often underestimate the difficulty of material because they cannot easily recall their own learning process.'
      },
      {
        authors: 'Felten, P., & Lambert, L. M.',
        year: '2020',
        title: 'Relationship-Rich Education: How Human Connections Drive Success in College',
        source: 'Johns Hopkins University Press',
        finding: 'Students\' sense of belonging and connection with instructors significantly impacts persistence and learning outcomes.'
      }
    ]
  }
};
