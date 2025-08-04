export interface SampleText {
  id: string;
  title: string;
  text: string;
  expectedType: 'human' | 'ai';
  source: string;
  category: 'essay' | 'article' | 'creative' | 'technical';
}

export const sampleTexts: SampleText[] = [
  // Human-written student essays
  {
    id: 'human-essay-2', 
    title: 'Student Essay: Technology and Social Media',
    text: `I'll be honest - I'm addicted to my phone. Like, seriously addicted. I probably check Instagram about 50 times a day, and don't even get me started on TikTok. My screen time report is embarrassing. But here's the thing that bugs me: everyone acts like social media is this terrible thing that's ruining our generation, and yeah, there are problems, but it's not all bad.

Through Twitter, I learned about the Black Lives Matter protests in my area and actually went to participate. I've connected with other kids who share my interests in astronomy (shoutout to @spacekid2006), and when I was struggling with anxiety last year, finding support groups online literally saved me. My therapist says social media can be a tool, and like any tool, it depends how you use it.

Sure, seeing everyone's perfect vacation photos makes me feel like crap sometimes. And yes, I've fallen down rabbit holes of conspiracy theories that made me paranoid for weeks. But I've also discovered new music, learned about colleges I never would have considered, and stayed connected with my cousin in Japan. I guess what I'm trying to say is that technology isn't inherently good or bad - it's complicated, just like everything else in life.`,
    expectedType: 'human',
    source: 'College freshman essay',
    category: 'essay'
  },

  // AI-generated text from ChatGPT
  {
    id: 'ai-essay-1',
    title: 'AI-Generated: Climate Change Analysis',
    text: `Climate change represents one of the most significant challenges facing humanity in the 21st century. The scientific consensus is clear: human activities, particularly the emission of greenhouse gases from fossil fuel combustion, are driving unprecedented changes in Earth's climate system.

The impacts of climate change are multifaceted and far-reaching. Rising global temperatures have led to the melting of polar ice caps, resulting in sea-level rise that threatens coastal communities worldwide. Additionally, we observe increased frequency and intensity of extreme weather events, including hurricanes, droughts, and heatwaves, which have profound socioeconomic implications.

From an environmental perspective, climate change disrupts ecosystems and biodiversity. Many species face extinction as their habitats undergo rapid transformation. Ocean acidification, caused by increased CO2 absorption, threatens marine life and fisheries that millions depend upon for sustenance and livelihood.

Addressing climate change requires comprehensive, coordinated action across multiple sectors. Governments must implement robust policy frameworks, including carbon pricing mechanisms and renewable energy incentives. Simultaneously, technological innovation in clean energy, energy storage, and carbon capture technologies will be crucial for achieving emission reduction targets.

Individual actions, while important, must be complemented by systemic changes to achieve meaningful impact. The transition to a sustainable future demands unprecedented cooperation between nations, industries, and communities.`,
    expectedType: 'ai',
    source: 'ChatGPT-4',
    category: 'essay'
  },
  {
    id: 'ai-essay-2',
    title: 'AI-Generated: Technology in Education',
    text: `The integration of technology in educational environments has fundamentally transformed the landscape of learning and instruction. Digital tools and platforms have created unprecedented opportunities for personalized learning experiences, enabling educators to tailor content delivery to individual student needs and learning styles.

Modern educational technology encompasses a wide range of applications, from interactive whiteboards and learning management systems to artificial intelligence-powered tutoring platforms. These tools facilitate enhanced engagement through multimedia content, gamification elements, and real-time feedback mechanisms that support continuous learning improvement.

Research indicates that technology-enhanced learning environments can improve student outcomes across various metrics. Studies demonstrate increased retention rates, improved critical thinking skills, and enhanced collaboration capabilities among students who engage with digital learning platforms regularly.

However, the implementation of educational technology also presents certain challenges. Digital equity concerns arise when students lack access to necessary devices or reliable internet connectivity. Additionally, educators require comprehensive professional development to effectively integrate technological tools into their pedagogical practices.

The future of education will likely involve further integration of emerging technologies such as virtual reality, augmented reality, and machine learning algorithms. These innovations promise to create even more immersive and personalized learning experiences while addressing current limitations in educational delivery methods.`,
    expectedType: 'ai',
    source: 'ChatGPT-4',
    category: 'essay'
  },

  // Creative writing samples
  {
    id: 'human-creative-1',
    title: 'Human Creative: Short Story Excerpt',
    text: `The coffee shop smelled like burnt dreams and desperation. At least, that's what Jake told himself as he stared at his laptop screen for the third hour straight. The cursor blinked mockingly at him from the empty document titled "The Next Great American Novel - Draft 1."

"More coffee?" The barista - Emma, according to her name tag - had probably asked him this question five times already. Her smile was getting increasingly forced.

"Uh, sure. Thanks." Jake fumbled for his wallet, knocking over his pen cup in the process. Pens scattered across the sticky table like escaping prisoners. One rolled off the edge and landed near the feet of a woman reading what looked like actual literature. She glanced at him with the kind of look you give to someone's embarrassing relative at a wedding.

This was not how he'd imagined his writing career would go. In his head, he was supposed to be the mysterious guy in the corner, fingers flying across the keyboard, occasionally pausing to stare pensively out the window while brilliant ideas crystallized in his mind. Instead, he was the guy who couldn't write a grocery list without second-guessing every word.`,
    expectedType: 'human',
    source: 'Amateur writer',
    category: 'creative'
  },
  {
    id: 'ai-creative-1',
    title: 'AI-Generated: Short Story Excerpt',
    text: `The ancient library stood silent in the moonlight, its towering shelves casting long shadows across the marble floor. Elena approached the restricted section with careful steps, her heart racing with anticipation and fear.

As the keeper of forbidden knowledge, she understood the weight of her responsibility. Each tome contained secrets that could reshape reality itself, powers that had been sealed away for centuries to protect humanity from its own ambitions.

The leather-bound volume she sought rested on the highest shelf, protected by wards that shimmered like heat waves in the darkness. Elena raised her hand, feeling the familiar tingle of magic coursing through her fingertips. The protective barriers recognized her touch and dissolved like morning mist.

She opened the book carefully, its pages whispering secrets in languages long forgotten. The words seemed to dance before her eyes, revealing the location of the Crystal of Eternal Seasons - the artifact that could restore balance to the war-torn realm.

Time was running short. The shadow armies would reach the capital by dawn, and without the crystal's power, all hope would be lost. Elena tucked the ancient tome into her satchel and prepared for the journey that would determine the fate of all magical creatures.`,
    expectedType: 'ai',
    source: 'ChatGPT-4',
    category: 'creative'
  },

  // Technical/Academic samples
  {
    id: 'human-technical-1',
    title: 'Human Technical: Research Note',
    text: `So I've been trying to figure out why my neural network keeps overfitting, and I think I finally found the issue. It's embarrassing, but I was using way too high of a learning rate (0.01) for the Adam optimizer. When I dropped it to 0.001, the validation loss actually started following the training loss instead of diverging after epoch 15.

Also discovered that my data preprocessing was inconsistent - I was normalizing the training set but forgot to apply the same normalization parameters to the validation set. No wonder my model was confused! The input distributions were completely different.

The batch size thing is still bugging me though. In theory, larger batches should give more stable gradients, but I'm getting better convergence with batch_size=32 than with batch_size=128. Maybe it's because my dataset is relatively small (only 10k samples)? Need to read more papers about this.

Next steps: try dropout layers, maybe data augmentation, and definitely need to implement early stopping before I waste more GPU hours. Also should probably version control my experiments better instead of commenting out old hyperparameters like a barbarian.`,
    expectedType: 'human',
    source: 'Graduate student research notes',
    category: 'technical'
  },
  {
    id: 'ai-technical-1',
    title: 'AI-Generated: Machine Learning Overview',
    text: `Machine learning represents a subset of artificial intelligence that enables computer systems to automatically learn and improve from experience without explicit programming. The fundamental principle involves training algorithms on large datasets to identify patterns and make predictions or decisions.

There are three primary categories of machine learning: supervised learning, unsupervised learning, and reinforcement learning. Supervised learning utilizes labeled training data to predict outcomes for new inputs. Common applications include classification tasks such as image recognition and regression problems for predicting continuous values.

Unsupervised learning algorithms analyze unlabeled data to discover hidden patterns or structures. Clustering algorithms like K-means and hierarchical clustering are frequently employed for market segmentation and data exploration. Dimensionality reduction techniques such as Principal Component Analysis (PCA) help visualize high-dimensional datasets.

Reinforcement learning involves training agents to make sequential decisions in an environment to maximize cumulative rewards. This approach has proven particularly successful in game-playing AI systems and robotics applications.

The effectiveness of machine learning models depends on several factors including data quality, feature engineering, algorithm selection, and hyperparameter optimization. Cross-validation techniques help assess model performance and prevent overfitting to training data.`,
    expectedType: 'ai',
    source: 'ChatGPT-4',
    category: 'technical'
  }
];

export const getSamplesByCategory = (category: SampleText['category']) => {
  return sampleTexts.filter(sample => sample.category === category);
};

export const getSamplesByType = (type: SampleText['expectedType']) => {
  return sampleTexts.filter(sample => sample.expectedType === type);
};