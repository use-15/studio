
import type { WellnessResource, Hospital, Doctor, Service } from '@/types';

export const curatedWellnessResources: WellnessResource[] = [
  {
    id: 'CWR001',
    title: 'Beginner\'s Guide to Meditation',
    description: 'Learn the basics of meditation and start your journey to inner peace.',
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Mindfulness',
    type: 'article',
    contentUrl: '#', // Could be a link to an external source if not fully embedded
    duration: '10 min read',
    'data-ai-hint': 'meditation peace',
    contentMarkdown: `
# A Beginner's Guide to Meditation

Meditation is a practice where an individual uses a technique – such as mindfulness, or focusing the mind on a particular object, thought, or activity – to train attention and awareness, and achieve a mentally clear and emotionally calm and stable state.

## Why Meditate?

*   Reduce stress
*   Control anxiety
*   Promote emotional health
*   Enhance self-awareness
*   Lengthen attention span

## Simple Meditation Exercise:

1.  **Find a quiet place.** Sit or lie down comfortably.
2.  **Close your eyes.**
3.  **Breathe naturally.** Focus on your breath and how your body moves with each inhalation and exhalation.
4.  **Notice your thoughts.** If your mind wanders, gently return your focus to your breath.
5.  **Start small.** Begin with just 5-10 minutes a day.
    `,
  },
  {
    id: 'CWR002',
    title: '10 Quick & Healthy Breakfast Ideas',
    description: 'Fuel your day with these easy and nutritious breakfast recipes.',
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Nutrition',
    type: 'article',
    contentUrl: '#',
    duration: '15 min read',
    'data-ai-hint': 'healthy food',
    contentMarkdown: `
# 10 Quick & Healthy Breakfast Ideas

Starting your day with a nutritious breakfast can set the tone for better choices throughout the day. Here are some quick and healthy ideas:

1.  **Overnight Oats:** Combine oats, milk (or yogurt), chia seeds, and your favorite fruits in a jar. Refrigerate overnight.
2.  **Avocado Toast:** Whole-grain toast topped with mashed avocado, a sprinkle of salt, pepper, and red pepper flakes.
3.  **Greek Yogurt with Berries:** High in protein and antioxidants. Add a drizzle of honey or a sprinkle of nuts.
4.  **Smoothie:** Blend fruits, vegetables (like spinach), protein powder, and a liquid base (water, milk, or yogurt).
5.  **Scrambled Eggs with Spinach:** A protein-packed classic.
6.  **Fruit Salad with Cottage Cheese:** A refreshing and light option.
7.  **Whole-Wheat Muffin with Peanut Butter:** Choose muffins low in sugar.
8.  **Quinoa Porridge:** A warm and hearty alternative to oatmeal.
9.  **Breakfast Burrito (mini):** Scrambled eggs, black beans, and salsa in a small whole-wheat tortilla.
10. **Hard-Boiled Eggs and an Apple:** Simple, portable, and balanced.
    `,
  },
  {
    id: 'CWR003',
    title: 'Morning Yoga Flow for Energy',
    description: 'A 15-minute yoga routine to energize your body and mind.',
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Fitness',
    type: 'video',
    contentUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Example original URL
    youtubeVideoId: 'dQw4w9WgXcQ', // Rick Astley for placeholder
    duration: '15 min video',
    'data-ai-hint': 'yoga park',
  },
  {
    id: 'CWR004',
    title: 'The Importance of Sleep for Wellbeing',
    description: 'Discover how quality sleep impacts your overall health and tips for better sleep.',
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Lifestyle',
    type: 'article',
    contentUrl: '#',
    duration: '12 min read',
    'data-ai-hint': 'sleep wellness',
    contentMarkdown: `
# The Importance of Sleep for Wellbeing

Sleep is a fundamental human need, like eating, drinking, and breathing. It is vital for good health and well-being throughout your lifetime.

## Why is Sleep Important?
Quality sleep can help protect your mental health, physical health, quality of life, and safety.

*   **Brain Function:** Sleep helps your brain work properly. While you're sleeping, your brain is preparing for the next day. It's forming new pathways to help you learn and remember information.
*   **Emotional Well-being:** Sleep can affect mood. Sleep deficiency may lead to problems with decision-making, problem-solving, controlling emotions and behavior, and coping with change.
*   **Physical Health:** Sleep plays an important role in your physical health. For example, sleep is involved in healing and repair of your heart and blood vessels. Ongoing sleep deficiency is linked to an increased risk of heart disease, kidney disease, high blood pressure, diabetes, and stroke.
*   **Daytime Performance and Safety:** Getting enough quality sleep at the right times helps you function well throughout the day. People who are sleep deficient are less productive at work and school.

## Tips for Better Sleep
*   Stick to a sleep schedule.
*   Create a restful environment.
*   Limit daytime naps.
*   Include physical activity in your daily routine.
*   Manage worries.
    `
  },
  {
    id: 'CWR005',
    title: 'Guided Deep Breathing Exercise',
    description: 'A short audio guide to practice deep breathing for stress relief.',
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Mindfulness',
    type: 'audio', // For now, audio will just be displayed as a resource, not playable in-app without more work
    contentUrl: '#', // Placeholder for audio file URL
    duration: '5 min audio',
    'data-ai-hint': 'breathing calm',
  },
  {
    id: 'CWR006',
    title: 'Understanding Hydration',
    description: 'Learn why water is crucial for your body and how to stay properly hydrated.',
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Nutrition',
    type: 'article',
    contentUrl: '#',
    duration: '8 min read',
    'data-ai-hint': 'water health',
    contentMarkdown: `
# Understanding Hydration: The Importance of Water

Water is essential for life. Every cell, tissue, and organ in your body needs water to work correctly. For example, your body uses water to maintain its temperature, remove waste, and lubricate joints. Water is needed for overall good health.

## Why is Hydration Important?

*   **Regulates Body Temperature:** Sweating helps cool your body, but you need to replenish the lost fluids.
*   **Transports Nutrients:** Water helps dissolve minerals and nutrients, making them more accessible to the body. It also helps carry nutrients and oxygen to cells.
*   **Flushes Waste Products:** Adequate water intake enables your body to excrete waste through perspiration, urination, and defecation.
*   **Lubricates Joints:** Cartilage, found in joints and the disks of the spine, contains around 80 percent water. Long-term dehydration can reduce the joints’ shock-absorbing ability, leading to joint pain.
*   **Supports Digestion:** Water helps break down the food you eat, allowing its nutrients to be absorbed by your body.

## How Much Water Do You Need?

The amount of water you need depends on various factors, including your health, activity level, and where you live. A common recommendation is to drink eight 8-ounce glasses of water a day, which equals about 2 liters, or half a gallon. This is the "8x8 rule" and is easy to remember.

## Signs of Dehydration:

*   Little or no urine, or urine that is darker than usual
*   Dry mouth
*   Sleepiness or fatigue
*   Extreme thirst
*   Headache
*   Confusion
*   Dizziness or lightheadedness

Stay hydrated!
    `
  },
];

export const audioBookSummaries: WellnessResource[] = [
  {
    id: 'ABS001',
    title: 'Atomic Habits by James Clear',
    description: 'An easy and proven way to build good habits and break bad ones. Key insights on making small changes for remarkable results.',
    imageUrl: 'https://placehold.co/600x400.png',
    'data-ai-hint': 'book habit',
    category: 'Self-Improvement',
    type: 'audio',
    contentUrl: '#',
    duration: '20 min audio',
  },
  {
    id: 'ABS002',
    title: 'Thinking, Fast and Slow by Daniel Kahneman',
    description: 'Explore the two systems that drive the way we think. Learn about cognitive biases and how to make better decisions.',
    imageUrl: 'https://placehold.co/600x400.png',
    'data-ai-hint': 'brain thought',
    category: 'Psychology',
    type: 'audio',
    contentUrl: '#',
    duration: '25 min audio',
  },
  {
    id: 'ABS003',
    title: 'Sapiens by Yuval Noah Harari',
    description: 'A brief history of humankind, from the Stone Age to the present day, exploring how Homo sapiens came to dominate the world.',
    imageUrl: 'https://placehold.co/600x400.png',
    'data-ai-hint': 'history humanity',
    category: 'History',
    type: 'audio',
    contentUrl: '#',
    duration: '30 min audio',
  },
   {
    id: 'ABS004',
    title: 'The Power of Now by Eckhart Tolle',
    description: 'A guide to spiritual enlightenment, focusing on living in the present moment to achieve peace and happiness.',
    imageUrl: 'https://placehold.co/600x400.png',
    'data-ai-hint': 'spiritual mindfulness',
    category: 'Spirituality',
    type: 'audio',
    contentUrl: '#',
    duration: '22 min audio',
  },
];

const placeholderDoctors: Doctor[] = [
  { id: 'doc1', name: 'Dr. Emily Carter', specialty: 'Cardiology', avatarUrl: 'https://placehold.co/80x80.png', 'data-ai-hint': 'doctor avatar' },
  { id: 'doc2', name: 'Dr. Ben Adams', specialty: 'Orthopedics', avatarUrl: 'https://placehold.co/80x80.png', 'data-ai-hint': 'doctor avatar' },
  { id: 'doc3', name: 'Dr. Olivia Chen', specialty: 'Pediatrics', avatarUrl: 'https://placehold.co/80x80.png', 'data-ai-hint': 'doctor avatar' },
  { id: 'doc4', name: 'Dr. Marcus Green', specialty: 'Neurology', avatarUrl: 'https://placehold.co/80x80.png', 'data-ai-hint': 'doctor avatar' },
];

const placeholderServices: Service[] = [
  { id: 'serv1', name: 'Cardiology', description: 'Comprehensive heart care and treatment.' },
  { id: 'serv2', name: 'Orthopedics', description: 'Musculoskeletal system treatment and surgery.' },
  { id: 'serv3', name: 'Pediatrics', description: 'Medical care for infants, children, and adolescents.' },
  { id: 'serv4', name: 'Neurology', description: 'Diagnosis and treatment of nervous system disorders.' },
  { id: 'serv5', name: 'Emergency Care', description: '24/7 emergency medical services.' },
  { id: 'serv6', name: 'Oncology', description: 'Cancer diagnosis and treatment.' },
];

export const hospitalData: Hospital[] = [
  {
    id: 'hosp1',
    name: 'City General Hospital',
    address: '123 Main St, Anytown, USA',
    imageUrl: 'https://placehold.co/600x400.png',
    'data-ai-hint': 'hospital building',
    services: [placeholderServices[0], placeholderServices[1], placeholderServices[4]],
    doctors: [placeholderDoctors[0], placeholderDoctors[1]],
    phone: '555-1234',
    website: 'https://example.com/citygeneral'
  },
  {
    id: 'hosp2',
    name: 'Green Valley Community Clinic',
    address: '456 Oak Ave, Anytown, USA',
    imageUrl: 'https://placehold.co/600x400.png',
    'data-ai-hint': 'clinic exterior',
    services: [placeholderServices[2], placeholderServices[3]],
    doctors: [placeholderDoctors[2], placeholderDoctors[3]],
    phone: '555-5678',
    website: 'https://example.com/greenvalley'
  },
  {
    id: 'hosp3',
    name: 'St. Luke\'s Medical Center',
    address: '789 Pine Ln, Anytown, USA',
    imageUrl: 'https://placehold.co/600x400.png',
    'data-ai-hint': 'modern hospital',
    services: [placeholderServices[0], placeholderServices[3], placeholderServices[5]],
    doctors: [placeholderDoctors[0], placeholderDoctors[3]],
    phone: '555-9012',
    website: 'https://example.com/stluke'
  },
];
