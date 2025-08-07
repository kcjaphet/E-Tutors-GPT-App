import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Mail, Briefcase, GraduationCap, MessageSquare } from 'lucide-react';

interface TextTemplatesProps {
  onSelectTemplate: (template: string) => void;
}

const TextTemplates: React.FC<TextTemplatesProps> = ({ onSelectTemplate }) => {
  const templates = [
    {
      id: 'email-professional',
      title: 'Professional Email',
      description: 'Formal business email template',
      icon: <Mail className="w-4 h-4" />,
      category: 'Business',
      template: `Subject: [Your Subject Here]

Dear [Recipient Name],

I hope this email finds you well. I am writing to [purpose of email].

[Main content of your message]

Please let me know if you need any additional information or have any questions.

Thank you for your time and consideration.

Best regards,
[Your Name]
[Your Title]
[Company Name]`
    },
    {
      id: 'essay-academic',
      title: 'Academic Essay',
      description: 'Structure for academic writing',
      icon: <GraduationCap className="w-4 h-4" />,
      category: 'Academic',
      template: `[Essay Title]

Introduction:
[Hook statement to grab attention]
[Background information on the topic]
[Thesis statement clearly stating your main argument]

Body Paragraph 1:
[Topic sentence introducing first main point]
[Evidence supporting this point]
[Analysis explaining how evidence supports your thesis]

Body Paragraph 2:
[Topic sentence introducing second main point]
[Evidence supporting this point]
[Analysis explaining how evidence supports your thesis]

Body Paragraph 3:
[Topic sentence introducing third main point]
[Evidence supporting this point]
[Analysis explaining how evidence supports your thesis]

Conclusion:
[Restatement of thesis in new words]
[Summary of main points]
[Final thought or call to action]`
    },
    {
      id: 'report-business',
      title: 'Business Report',
      description: 'Professional business report format',
      icon: <Briefcase className="w-4 h-4" />,
      category: 'Business',
      template: `[Report Title]
Prepared by: [Your Name]
Date: [Current Date]
Department: [Your Department]

Executive Summary:
[Brief overview of the report's key findings and recommendations]

Introduction:
[Purpose and scope of the report]
[Background information]

Methodology:
[How data was collected and analyzed]

Findings:
[Detailed presentation of results]
[Supporting data and evidence]

Analysis:
[Interpretation of findings]
[Implications for the business]

Recommendations:
[Specific actionable recommendations]
[Implementation timeline]

Conclusion:
[Summary of key points]
[Next steps]

Appendices:
[Supporting documents and data]`
    },
    {
      id: 'blog-post',
      title: 'Blog Post',
      description: 'Engaging blog post structure',
      icon: <MessageSquare className="w-4 h-4" />,
      category: 'Content',
      template: `[Catchy Blog Post Title]

Introduction:
[Hook to grab reader's attention]
[Brief overview of what you'll cover]
[Why this topic matters to your audience]

Main Content:

Heading 1: [First Main Point]
[Detailed explanation with examples]
[Personal anecdotes or case studies]

Heading 2: [Second Main Point]
[Detailed explanation with examples]
[Statistics or research to support your point]

Heading 3: [Third Main Point]
[Detailed explanation with examples]
[Actionable tips for readers]

Key Takeaways:
• [Important point 1]
• [Important point 2]
• [Important point 3]

Conclusion:
[Summary of main points]
[Call to action for readers]
[Question to encourage engagement]

What are your thoughts on this topic? Share in the comments below!`
    },
    {
      id: 'cover-letter',
      title: 'Cover Letter',
      description: 'Professional job application cover letter',
      icon: <FileText className="w-4 h-4" />,
      category: 'Business',
      template: `[Your Name]
[Your Address]
[City, State ZIP Code]
[Your Email]
[Your Phone Number]

[Date]

[Hiring Manager's Name]
[Company Name]
[Company Address]
[City, State ZIP Code]

Dear [Hiring Manager's Name / Hiring Manager],

I am writing to express my strong interest in the [Position Title] position at [Company Name]. With my [relevant experience/skills], I am confident that I would be a valuable addition to your team.

In my previous role as [Previous Position] at [Previous Company], I [specific achievement or responsibility that relates to the job]. This experience has equipped me with [relevant skills] that directly align with the requirements of this position.

What particularly attracts me to [Company Name] is [specific reason related to company values, mission, or recent achievements]. I am excited about the opportunity to [how you would contribute to the company].

I have attached my resume for your review and would welcome the opportunity to discuss how my skills and enthusiasm can contribute to [Company Name]'s continued success.

Thank you for considering my application. I look forward to hearing from you.

Sincerely,
[Your Name]`
    }
  ];

  const categories = Array.from(new Set(templates.map(t => t.category)));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Text Templates
        </CardTitle>
        <CardDescription>
          Start with professionally crafted templates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {categories.map(category => (
          <div key={category} className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              {category}
            </h4>
            <div className="grid gap-3">
              {templates
                .filter(template => template.category === category)
                .map(template => (
                  <div
                    key={template.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {template.icon}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{template.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {template.description}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSelectTemplate(template.template)}
                    >
                      Use
                    </Button>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TextTemplates;