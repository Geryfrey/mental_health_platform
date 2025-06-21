-- Seed initial data for SWAP platform

-- Insert admin user
INSERT INTO users (email, password, user_type, full_name, phone, location) VALUES
('admin@swap.rw', '$2b$10$rQZ9QmjKjKjKjKjKjKjKjOeX8X8X8X8X8X8X8X8X8X8X8X8X8X8X8', 'admin', 'SWAP Administrator', '+250788123456', 'Kigali, Rwanda');

-- Insert sample mental health professionals
INSERT INTO users (email, password, user_type, full_name, phone, location) VALUES
('dr.uwimana@gmail.com', '$2b$10$rQZ9QmjKjKjKjKjKjKjKjOeX8X8X8X8X8X8X8X8X8X8X8X8X8X8X8', 'professional', 'Dr. Marie Uwimana', '+250788234567', 'Kigali, Rwanda'),
('dr.mugisha@gmail.com', '$2b$10$rQZ9QmjKjKjKjKjKjKjKjOeX8X8X8X8X8X8X8X8X8X8X8X8X8X8X8', 'professional', 'Dr. Jean Mugisha', '+250788345678', 'Butare, Rwanda'),
('counselor.imena@gmail.com', '$2b$10$rQZ9QmjKjKjKjKjKjKjKjOeX8X8X8X8X8X8X8X8X8X8X8X8X8X8X8', 'professional', 'Imena Counseling Center', '+250788456789', 'Musanze, Rwanda');

-- Insert professional details
INSERT INTO professionals (user_id, clinic_name, specialization, license_number, address, district, province, availability_hours, is_verified) VALUES
((SELECT id FROM users WHERE email = 'dr.uwimana@gmail.com'), 'Kigali Mental Health Clinic', 'Clinical Psychology', 'PSY001RW', 'KG 15 Ave, Kigali', 'Gasabo', 'Kigali City', '{"monday": "08:00-17:00", "tuesday": "08:00-17:00", "wednesday": "08:00-17:00", "thursday": "08:00-17:00", "friday": "08:00-17:00"}', true),
((SELECT id FROM users WHERE email = 'dr.mugisha@gmail.com'), 'Butare Wellness Center', 'Psychiatry', 'PSY002RW', 'Butare Main Street', 'Huye', 'Southern Province', '{"monday": "09:00-16:00", "tuesday": "09:00-16:00", "wednesday": "09:00-16:00", "thursday": "09:00-16:00", "friday": "09:00-16:00"}', true),
((SELECT id FROM users WHERE email = 'counselor.imena@gmail.com'), 'Imena Counseling Center', 'Counseling Psychology', 'CNS001RW', 'Musanze Center', 'Musanze', 'Northern Province', '{"monday": "08:00-18:00", "tuesday": "08:00-18:00", "wednesday": "08:00-18:00", "thursday": "08:00-18:00", "friday": "08:00-18:00", "saturday": "09:00-13:00"}', true);

-- Insert comprehensive mental health resources with full content
INSERT INTO resources (title, content, url, resource_type, conditions, author) VALUES
('Understanding Anxiety in Students', 'Anxiety is one of the most common mental health challenges faced by students today. It can manifest in various forms, from general worry about academic performance to specific phobias about social situations or test-taking.

**What is Student Anxiety?**
Student anxiety refers to feelings of worry, nervousness, or unease about academic, social, or personal aspects of student life. It''s normal to feel some anxiety, but when these feelings become overwhelming or interfere with daily activities, it may be time to seek support.

**Common Signs of Anxiety in Students:**
- Persistent worry about grades or performance
- Difficulty concentrating during lectures or while studying
- Physical symptoms like rapid heartbeat, sweating, or nausea
- Avoidance of social situations or class participation
- Sleep disturbances or changes in appetite
- Procrastination or perfectionism

**Coping Strategies:**
1. **Deep Breathing Exercises**: Practice the 4-7-8 technique - inhale for 4 counts, hold for 7, exhale for 8.
2. **Time Management**: Break large tasks into smaller, manageable steps.
3. **Regular Exercise**: Physical activity can significantly reduce anxiety symptoms.
4. **Mindfulness and Meditation**: Even 10 minutes daily can help calm racing thoughts.
5. **Healthy Sleep Habits**: Aim for 7-9 hours of quality sleep each night.
6. **Social Support**: Connect with friends, family, or counselors when feeling overwhelmed.

**When to Seek Professional Help:**
If anxiety is significantly impacting your academic performance, relationships, or daily functioning, consider reaching out to a mental health professional. Many universities offer counseling services specifically for students.

Remember, seeking help is a sign of strength, not weakness. You don''t have to face anxiety alone.', 'https://example.com/anxiety-guide', 'article', ARRAY['anxiety', 'stress', 'academic'], 'Dr. Sarah Johnson'),

('Coping with Depression: A Student Guide', 'Depression among students is more common than many realize. The transition to university life, academic pressures, and social challenges can all contribute to feelings of sadness, hopelessness, and disconnection.

**Understanding Student Depression:**
Depression is more than just feeling sad or having a bad day. It''s a persistent feeling of sadness, emptiness, or hopelessness that lasts for weeks or months and interferes with your ability to function normally.

**Common Symptoms in Students:**
- Persistent sadness or feeling empty
- Loss of interest in activities you once enjoyed
- Difficulty concentrating on studies
- Changes in appetite or weight
- Sleep problems (too much or too little)
- Fatigue or loss of energy
- Feelings of worthlessness or excessive guilt
- Thoughts of death or suicide

**Practical Coping Strategies:**
1. **Maintain a Routine**: Structure can provide stability during difficult times.
2. **Stay Connected**: Isolation can worsen depression. Reach out to friends, family, or support groups.
3. **Physical Activity**: Regular exercise can be as effective as medication for mild to moderate depression.
4. **Nutrition**: Eat regular, balanced meals to support your mental health.
5. **Limit Alcohol and Drugs**: These can worsen depression symptoms.
6. **Practice Self-Compassion**: Be kind to yourself and avoid self-criticism.
7. **Set Small Goals**: Accomplish small tasks to build momentum and confidence.

**Academic Accommodations:**
Many institutions offer accommodations for students dealing with depression, such as:
- Extended deadlines
- Reduced course loads
- Alternative testing arrangements
- Access to note-taking services

**Crisis Resources:**
If you''re having thoughts of suicide or self-harm, reach out immediately:
- National Suicide Prevention Lifeline: 988
- Crisis Text Line: Text HOME to 741741
- Your local emergency services: 911

**Building Long-term Resilience:**
- Develop healthy coping mechanisms
- Build a strong support network
- Learn stress management techniques
- Consider therapy or counseling
- Practice mindfulness and gratitude

Recovery from depression is possible. With the right support and treatment, you can feel better and succeed in your academic and personal goals.', 'https://example.com/depression-guide', 'article', ARRAY['depression', 'mood', 'academic'], 'Mental Health Rwanda'),

('Stress Management Techniques for Academic Success', 'Academic stress is an inevitable part of student life, but learning how to manage it effectively can make the difference between thriving and merely surviving your educational journey.

**Understanding Academic Stress:**
Academic stress occurs when students feel overwhelmed by their educational responsibilities. This can include pressure from exams, assignments, presentations, and the general demands of academic life.

**Common Sources of Academic Stress:**
- Heavy workload and tight deadlines
- Fear of failure or not meeting expectations
- Competition with peers
- Financial pressures related to education
- Uncertainty about future career prospects
- Balancing academic and personal responsibilities

**Evidence-Based Stress Management Techniques:**

**1. Time Management and Organization:**
- Use a planner or digital calendar to track assignments and deadlines
- Break large projects into smaller, manageable tasks
- Prioritize tasks using the Eisenhower Matrix (urgent vs. important)
- Set realistic goals and expectations

**2. Study Techniques:**
- Use active learning methods like summarizing and teaching others
- Practice spaced repetition for better retention
- Find your optimal study environment and time of day
- Take regular breaks using the Pomodoro Technique (25 minutes study, 5 minutes break)

**3. Physical Wellness:**
- Regular exercise (even 20 minutes of walking can help)
- Maintain a consistent sleep schedule
- Eat nutritious meals and stay hydrated
- Limit caffeine and avoid excessive alcohol

**4. Mental and Emotional Techniques:**
- Practice mindfulness meditation
- Use progressive muscle relaxation
- Challenge negative thought patterns
- Practice gratitude journaling

**5. Social Support:**
- Form study groups with classmates
- Maintain relationships with friends and family
- Seek help from professors during office hours
- Utilize campus counseling services

**Creating a Stress Management Plan:**
1. Identify your personal stress triggers
2. Choose 2-3 techniques that resonate with you
3. Practice these techniques regularly, not just during stressful times
4. Monitor your stress levels and adjust strategies as needed
5. Seek professional help if stress becomes overwhelming

**Quick Stress Relief Techniques:**
- Deep breathing exercises (4-7-8 technique)
- Progressive muscle relaxation
- Visualization of peaceful scenes
- Listening to calming music
- Taking a short walk outdoors

Remember, some stress can actually be beneficial, motivating you to perform your best. The goal is not to eliminate all stress but to manage it effectively so it doesn''t overwhelm you.', 'https://example.com/stress-management', 'guide', ARRAY['stress', 'anxiety', 'academic'], 'Dr. Paul Kagame'),

('Building Resilience in University Life', 'Resilience is the ability to bounce back from setbacks, adapt to change, and grow stronger through challenges. For university students, developing resilience is crucial for both academic success and personal well-being.

**What is Resilience?**
Resilience isn''t about avoiding difficulties or never feeling stressed. Instead, it''s about developing the skills and mindset to navigate challenges effectively and emerge stronger from difficult experiences.

**Key Components of Resilience:**

**1. Emotional Regulation:**
- Recognizing and understanding your emotions
- Developing healthy ways to express feelings
- Learning to calm yourself during stressful situations
- Practicing self-compassion during difficult times

**2. Cognitive Flexibility:**
- Challenging negative thought patterns
- Looking for alternative perspectives on problems
- Focusing on what you can control rather than what you can''t
- Reframing setbacks as learning opportunities

**3. Social Connection:**
- Building and maintaining supportive relationships
- Seeking help when needed
- Offering support to others
- Participating in community activities

**4. Purpose and Meaning:**
- Connecting your studies to your values and goals
- Finding meaning in challenges and setbacks
- Maintaining hope for the future
- Engaging in activities that give you a sense of purpose

**Practical Strategies for Building Resilience:**

**Academic Resilience:**
- Develop a growth mindset - view challenges as opportunities to learn
- Set realistic and achievable goals
- Celebrate small victories along the way
- Learn from failures rather than being defeated by them
- Seek feedback and use it constructively

**Personal Resilience:**
- Practice self-care regularly
- Develop healthy coping mechanisms
- Maintain perspective during difficult times
- Build a diverse support network
- Engage in activities you enjoy and find meaningful

**Daily Resilience Practices:**
1. **Morning Routine**: Start each day with intention and purpose
2. **Gratitude Practice**: Write down three things you''re grateful for each day
3. **Reflection Time**: Spend a few minutes each evening reflecting on the day
4. **Physical Activity**: Regular exercise builds both physical and mental resilience
5. **Mindfulness**: Practice being present in the moment

**Overcoming Common University Challenges:**

**Academic Setbacks:**
- Poor grades or failed exams
- Difficulty with specific subjects
- Imposter syndrome
- Academic probation

**Social Challenges:**
- Difficulty making friends
- Homesickness
- Relationship problems
- Social anxiety

**Personal Struggles:**
- Financial stress
- Family problems
- Health issues
- Identity and self-discovery challenges

**Building Your Resilience Toolkit:**
Create a personalized set of strategies that work for you:
- Identify your strengths and how to leverage them
- Develop a list of coping strategies for different situations
- Build a support network of friends, family, and professionals
- Practice stress management techniques regularly
- Maintain perspective on temporary setbacks

Remember, resilience is like a muscle - it gets stronger with practice. Every challenge you face and overcome builds your capacity to handle future difficulties with greater confidence and skill.', 'https://example.com/resilience', 'guide', ARRAY['resilience', 'stress', 'academic'], 'University Counseling Center'),

('Sleep and Mental Health: The Student Connection', 'Sleep plays a crucial role in mental health, academic performance, and overall well-being. For students, understanding the connection between sleep and mental health is essential for success.

**The Sleep-Mental Health Connection:**
Sleep and mental health have a bidirectional relationship - poor sleep can contribute to mental health problems, and mental health issues can disrupt sleep patterns. This creates a cycle that can be challenging to break without proper intervention.

**How Sleep Affects Mental Health:**
- **Mood Regulation**: Adequate sleep helps regulate emotions and mood
- **Stress Response**: Well-rested individuals cope better with stress
- **Cognitive Function**: Sleep is essential for concentration, memory, and decision-making
- **Immune Function**: Poor sleep weakens the immune system, affecting overall health

**Common Sleep Problems in Students:**
1. **Insomnia**: Difficulty falling asleep or staying asleep
2. **Sleep Deprivation**: Not getting enough sleep (less than 7-9 hours for adults)
3. **Irregular Sleep Schedule**: Going to bed and waking up at different times
4. **Poor Sleep Quality**: Frequent awakenings or non-restorative sleep

**Factors Affecting Student Sleep:**
- Academic stress and deadlines
- Social activities and late-night socializing
- Technology use before bedtime
- Caffeine and alcohol consumption
- Irregular class schedules
- Anxiety and worry about academic performance

**Sleep Hygiene Guidelines:**

**Creating the Ideal Sleep Environment:**
- Keep your bedroom cool, dark, and quiet
- Invest in comfortable bedding and pillows
- Remove electronic devices from the bedroom
- Use blackout curtains or an eye mask if needed

**Establishing a Sleep Routine:**
- Go to bed and wake up at the same time every day
- Create a relaxing bedtime routine (reading, gentle stretching, meditation)
- Avoid screens for at least 1 hour before bedtime
- Limit daytime naps to 20-30 minutes

**Lifestyle Factors:**
- Avoid caffeine 6 hours before bedtime
- Limit alcohol consumption, especially in the evening
- Get regular exercise, but not close to bedtime
- Expose yourself to natural light during the day

**Managing Sleep-Related Anxiety:**
- Practice relaxation techniques before bed
- Keep a worry journal to clear your mind
- Use progressive muscle relaxation
- Try guided sleep meditations

**When to Seek Help:**
Consider consulting a healthcare provider if you experience:
- Persistent difficulty falling asleep or staying asleep
- Excessive daytime sleepiness
- Loud snoring or breathing interruptions during sleep
- Restless leg syndrome or other sleep disorders
- Sleep problems that interfere with daily functioning

**Academic Strategies for Better Sleep:**
- Plan your study schedule to avoid all-nighters
- Use time management techniques to reduce last-minute cramming
- Create a study environment separate from your sleep space
- Take regular breaks during long study sessions

**The Benefits of Good Sleep:**
- Improved concentration and memory
- Better emotional regulation
- Enhanced immune function
- Increased creativity and problem-solving abilities
- Better academic performance
- Reduced risk of mental health problems

Remember, prioritizing sleep isn''t lazy or unproductive - it''s an essential investment in your mental health, academic success, and overall quality of life.', 'https://example.com/sleep-mental-health', 'article', ARRAY['sleep', 'anxiety', 'depression', 'stress'], 'Sleep Foundation Rwanda'),

('Mindfulness for Students: A Practical Guide', 'Mindfulness is the practice of being fully present and engaged in the current moment, without judgment. For students, mindfulness can be a powerful tool for managing stress, improving focus, and enhancing overall well-being.

**What is Mindfulness?**
Mindfulness involves paying attention to your thoughts, feelings, bodily sensations, and surrounding environment with openness and acceptance. It''s about observing your experience without trying to change it or judge it as good or bad.

**Benefits of Mindfulness for Students:**
- Reduced stress and anxiety
- Improved concentration and focus
- Better emotional regulation
- Enhanced self-awareness
- Improved sleep quality
- Greater resilience to academic pressures
- Better relationships with peers and professors

**Simple Mindfulness Practices for Students:**

**1. Mindful Breathing (5 minutes):**
- Sit comfortably and close your eyes
- Focus on your natural breath
- When your mind wanders, gently return attention to your breath
- Notice the sensation of breathing in and out

**2. Body Scan (10-15 minutes):**
- Lie down comfortably
- Starting from your toes, slowly focus on each part of your body
- Notice any sensations without trying to change them
- Move systematically up to the top of your head

**3. Mindful Walking:**
- Walk slowly and deliberately
- Focus on the sensation of your feet touching the ground
- Notice your surroundings without judgment
- Use this between classes or during study breaks

**4. Mindful Eating:**
- Eat slowly and pay attention to flavors, textures, and smells
- Notice hunger and fullness cues
- Avoid distractions like phones or TV while eating

**Integrating Mindfulness into Student Life:**

**Before Studying:**
- Take 5 minutes to center yourself
- Set an intention for your study session
- Notice any anxiety or resistance without judgment

**During Exams:**
- Use mindful breathing to calm test anxiety
- Stay present with each question rather than worrying about the outcome
- Take mindful breaks if allowed

**In Social Situations:**
- Practice mindful listening during conversations
- Notice social anxiety without being overwhelmed by it
- Stay present rather than worrying about how others perceive you

**Dealing with Difficult Emotions:**
- Acknowledge emotions without trying to push them away
- Use the RAIN technique: Recognize, Allow, Investigate, Non-attachment
- Remember that all emotions are temporary

**Creating a Mindfulness Practice:**

**Starting Small:**
- Begin with just 5 minutes daily
- Use guided meditations or apps if helpful
- Be consistent rather than perfect
- Choose a regular time each day

**Common Challenges and Solutions:**
- **"I don''t have time"**: Start with just 2-3 minutes
- **"My mind is too busy"**: This is normal - the goal isn''t to stop thoughts
- **"I keep forgetting"**: Set reminders or link practice to existing habits
- **"I don''t see benefits"**: Benefits often develop gradually over time

**Mindfulness Resources for Students:**
- Meditation apps (Headspace, Calm, Insight Timer)
- Campus mindfulness groups or classes
- Online guided meditations
- Mindfulness books and podcasts

**Mindful Study Techniques:**
- Single-tasking instead of multitasking
- Taking mindful breaks every 25-30 minutes
- Noticing when your attention wanders and gently redirecting it
- Being present with challenging material rather than avoiding it

**Building a Mindful Campus Community:**
- Join or start a mindfulness group
- Practice mindful communication with roommates and friends
- Encourage mindful study sessions
- Share mindfulness techniques with others

Remember, mindfulness is a practice, not a perfect state. Be patient and compassionate with yourself as you develop this valuable life skill. Even a few minutes of mindfulness practice each day can make a significant difference in your student experience.', 'https://example.com/mindfulness', 'guide', ARRAY['mindfulness', 'stress', 'anxiety', 'focus'], 'Mindfulness Rwanda');

-- Insert sample student for testing
INSERT INTO users (registration_number, password, user_type, full_name, phone, location) VALUES
('220014748', '$2b$10$rQZ9QmjKjKjKjKjKjKjKjOeX8X8X8X8X8X8X8X8X8X8X8X8X8X8X8', 'student', 'Test Student', '+250788567890', 'Kigali, Rwanda');
