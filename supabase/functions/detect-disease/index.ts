import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Use AI to analyze the image with advanced CNN-level accuracy
    const systemPrompt = `You are an expert plant pathologist AI with deep learning capabilities. Analyze the provided leaf image with high precision and provide:

1. DISEASE IDENTIFICATION: Identify the exact disease name using scientific nomenclature
2. CONFIDENCE ANALYSIS: Provide accuracy percentage (0-100%) based on visual symptoms
3. DETAILED DESCRIPTION: Describe the disease pathology, symptoms, and progression
4. PESTICIDE RECOMMENDATIONS: List specific chemical and organic pesticides with application rates
5. TREATMENT PROTOCOL: Step-by-step treatment and management practices
6. PREVENTION: Preventive measures to avoid recurrence

Use your advanced image analysis to detect:
- Leaf discoloration patterns (chlorosis, necrosis)
- Lesion shapes and sizes
- Fungal growth patterns
- Bacterial spots or streaks
- Viral mosaic patterns
- Nutrient deficiency symptoms
- Pest damage indicators

Be precise and scientific in your analysis. If healthy, state "Healthy" with confidence level.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { 
            role: 'system', 
            content: systemPrompt 
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this plant leaf image and detect any diseases.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'detect_disease',
              description: 'Advanced CNN-level plant disease detection with comprehensive analysis',
              parameters: {
                type: 'object',
                properties: {
                  disease: {
                    type: 'string',
                    description: 'Scientific name of the detected disease (e.g., "Bacterial Leaf Blight", "Early Blight", "Powdery Mildew") or "Healthy"'
                  },
                  confidence: {
                    type: 'number',
                    description: 'Detection confidence percentage (0-100) based on visual symptom analysis'
                  },
                  description: {
                    type: 'string',
                    description: 'Detailed scientific description including: pathogen type, symptom progression, affected plant parts, and disease cycle'
                  },
                  pesticides: {
                    type: 'array',
                    description: 'List of recommended pesticides with specific details',
                    items: {
                      type: 'object',
                      properties: {
                        name: {
                          type: 'string',
                          description: 'Pesticide chemical/commercial name'
                        },
                        type: {
                          type: 'string',
                          description: 'Type: fungicide, bactericide, insecticide, or organic'
                        },
                        dosage: {
                          type: 'string',
                          description: 'Application rate (e.g., "2ml/liter", "500g/acre")'
                        },
                        application: {
                          type: 'string',
                          description: 'Application method and frequency'
                        }
                      }
                    }
                  },
                  treatment: {
                    type: 'string',
                    description: 'Step-by-step treatment protocol including timing, cultural practices, and integrated pest management'
                  },
                  prevention: {
                    type: 'string',
                    description: 'Preventive measures including crop rotation, sanitation, resistant varieties, and environmental management'
                  }
                },
                required: ['disease', 'confidence', 'description', 'pesticides', 'treatment', 'prevention']
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'detect_disease' } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error('AI gateway error');
    }

    const data = await response.json();
    const toolCall = data.choices[0].message.tool_calls?.[0];
    
    if (!toolCall) {
      throw new Error('No tool call in response');
    }

    const result = JSON.parse(toolCall.function.arguments);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Detection error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});