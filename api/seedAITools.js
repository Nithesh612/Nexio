/**
 * Comprehensive AI Tools Seeder for Nexio Hub
 * Safely upserts 25+ top modern AI tools into MongoDB Atlas (ai-tools collection)
 */

const mongoose = require("mongoose");
require("dotenv").config({ quiet: true });
const AITool = require("../models/AITool");

const AI_TOOLS_CATALOG = [
  {
    toolId: 'claude',
    name: 'Claude 3.7 Sonnet',
    desc: 'State-of-the-art hybrid reasoning and coding model by Anthropic.',
    category: 'copy-llm',
    tag: 'LLM & Code',
    pricing: 'FREEMIUM',
    isPartner: true,
    showInEssential: true,
    url: 'https://claude.ai',
    bannerType: 'claude',
    bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop'
  },
  {
    toolId: 'chatgpt',
    name: 'ChatGPT',
    desc: 'Leading conversational intelligence, web browsing, and multi-modal canvas by OpenAI.',
    category: 'copy-llm',
    tag: 'AI Assistant',
    pricing: 'FREEMIUM',
    isPartner: false,
    showInEssential: true,
    url: 'https://chat.openai.com',
    bannerType: 'chatgpt',
    bannerUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop'
  },
  {
    toolId: 'gemini',
    name: 'Google Gemini 2.5',
    desc: 'Google multimodal foundation model with 2M token context window and native video reasoning.',
    category: 'copy-llm',
    tag: 'Multimodal AI',
    pricing: 'FREE + PAID',
    isPartner: true,
    showInEssential: true,
    url: 'https://gemini.google.com',
    bannerType: 'gemini',
    bannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop'
  },
  {
    toolId: 'cursor',
    name: 'Cursor',
    desc: 'The AI-first code editor built on VS Code with seamless codebase indexing and tab completions.',
    category: 'ui-web',
    tag: 'AI Code Editor',
    pricing: 'FREE TRIAL',
    isPartner: false,
    showInEssential: true,
    url: 'https://www.cursor.com',
    bannerType: 'cursor',
    bannerUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop'
  },
  {
    toolId: 'v0',
    name: 'v0 by Vercel',
    desc: 'Generative UI system powered by AI that produces responsive React and Tailwind components.',
    category: 'ui-web',
    tag: 'Frontend AI',
    pricing: 'FREEMIUM',
    isPartner: true,
    showInEssential: true,
    url: 'https://v0.dev',
    bannerType: 'v0',
    bannerUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop'
  },
  {
    toolId: 'bolt',
    name: 'Bolt.new',
    desc: 'Prompt, build, and deploy full-stack web applications entirely in your browser with WebContainers.',
    category: 'ui-web',
    tag: 'Fullstack AI',
    pricing: 'FREEMIUM',
    isPartner: false,
    showInEssential: true,
    url: 'https://bolt.new',
    bannerType: 'bolt',
    bannerUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop'
  },
  {
    toolId: 'lovable',
    name: 'Lovable',
    desc: 'Autonomous AI software engineer that creates production-ready web apps from your ideas.',
    category: 'ui-web',
    tag: 'AI Engineer',
    pricing: 'FREE TRIAL',
    isPartner: true,
    showInEssential: true,
    url: 'https://lovable.dev',
    bannerType: 'lovable',
    bannerUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/673dc05e197d0263be45cb97_lovable-ai-thumb.webp'
  },
  {
    toolId: 'midjourney',
    name: 'Midjourney v7',
    desc: 'Industry standard for hyper-realistic and artistic generative image creation.',
    category: 'art-images',
    tag: 'Image Gen',
    pricing: 'PAID',
    isPartner: false,
    showInEssential: true,
    url: 'https://www.midjourney.com',
    bannerType: 'midjourney',
    bannerUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=800&auto=format&fit=crop'
  },
  {
    toolId: 'recraft',
    name: 'Recraft AI',
    desc: 'Generate consistent vector art, SVGs, 3D illustrations, and brand style systems.',
    category: 'art-images',
    tag: 'Vector & SVG',
    pricing: 'FREEMIUM',
    isPartner: false,
    showInEssential: true,
    url: 'https://www.recraft.ai',
    bannerType: 'recraft',
    bannerUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop'
  },
  {
    toolId: 'krea',
    name: 'Krea AI',
    desc: 'Real-time interactive canvas generation, video enhancement, and image upscaling.',
    category: 'art-images',
    tag: 'Realtime Gen',
    pricing: 'FREEMIUM',
    isPartner: false,
    showInEssential: false,
    url: 'https://www.krea.ai',
    bannerType: 'krea',
    bannerUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop'
  },
  {
    toolId: 'spline-ai',
    name: 'Spline AI',
    desc: 'Generate 3D objects, interactive scenes, physics animations, and textures with prompt prompts.',
    category: '3d-motion',
    tag: '3D & Motion',
    pricing: 'FREEMIUM',
    isPartner: false,
    showInEssential: true,
    url: 'https://spline.design/ai',
    bannerType: 'spline',
    bannerUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=800&auto=format&fit=crop'
  },
  {
    toolId: 'runway',
    name: 'Runway Gen-3 Alpha',
    desc: 'Breakthrough video generation model producing cinema-grade video clips from text and images.',
    category: '3d-motion',
    tag: 'Video AI',
    pricing: 'FREE TRIAL',
    isPartner: false,
    showInEssential: true,
    url: 'https://runwayml.com',
    bannerType: 'runway',
    bannerUrl: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=800&auto=format&fit=crop'
  },
  {
    toolId: 'elevenlabs',
    name: 'ElevenLabs',
    desc: 'Industry-leading voice cloning, emotional text-to-speech, and generative sound effects.',
    category: '3d-motion',
    tag: 'Voice & Audio',
    pricing: 'FREEMIUM',
    isPartner: true,
    showInEssential: true,
    url: 'https://elevenlabs.io',
    bannerType: 'elevenlabs',
    bannerUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop'
  },
  {
    toolId: 'figma-ai',
    name: 'Figma AI',
    desc: 'First draft wireframing, automated layer renaming, and visual search directly in Figma.',
    category: 'ui-web',
    tag: 'UI Design',
    pricing: 'FREE + PAID',
    isPartner: false,
    showInEssential: false,
    url: 'https://www.figma.com/ai',
    bannerType: 'figma',
    bannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop'
  },
  {
    toolId: 'framer-ai',
    name: 'Framer AI',
    desc: 'Generate, style, and publish responsive websites with visual breakout AI controls.',
    category: 'ui-web',
    tag: 'Web Publishing',
    pricing: 'FREEMIUM',
    isPartner: true,
    showInEssential: false,
    url: 'https://framer.com',
    bannerType: 'framer',
    bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop'
  },
  {
    toolId: 'perplexity',
    name: 'Perplexity AI',
    desc: 'AI-powered answer engine with live real-time citation index and deep research modes.',
    category: 'copy-llm',
    tag: 'Research AI',
    pricing: 'FREEMIUM',
    isPartner: false,
    showInEssential: true,
    url: 'https://www.perplexity.ai',
    bannerType: 'perplexity',
    bannerUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop'
  },
  {
    toolId: 'relume',
    name: 'Relume',
    desc: 'Generate full website architecture, wireframes, and copy in minutes for Figma and Webflow.',
    category: 'ui-web',
    tag: 'Sitemap AI',
    pricing: 'FREEMIUM',
    isPartner: false,
    showInEssential: false,
    url: 'https://www.relume.io',
    bannerType: 'relume',
    bannerUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop'
  },
  {
    toolId: 'firefly',
    name: 'Adobe Firefly',
    desc: 'Commercial-safe generative AI models for image expansion, vector recoloring, and generative fill.',
    category: 'art-images',
    tag: 'Adobe AI',
    pricing: 'FREE + PAID',
    isPartner: false,
    showInEssential: false,
    url: 'https://www.adobe.com/products/firefly.html',
    bannerType: 'firefly',
    bannerUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop'
  }
];

async function seedAITools() {
  console.log("🚀 Starting Safe AI Tools Seeder for Nexio Hub...");
  try {
    const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/wallet";
    await mongoose.connect(uri, { dbName: "wallet" });
    console.log("🟢 Connected to MongoDB Atlas (wallet database)");

    // Safe bulk upsert: updates existing tools or inserts new ones without destroying user changes
    const bulkOps = AI_TOOLS_CATALOG.map((tool) => ({
      updateOne: {
        filter: { toolId: tool.toolId },
        update: { $set: tool },
        upsert: true
      }
    }));

    const result = await AITool.bulkWrite(bulkOps, { ordered: false });
    console.log(`✅ AI Tools Seeding completed!`);
    console.log(`📊 Upserted: ${result.upsertedCount || 0} new tools`);
    console.log(`🔄 Updated/Verified: ${result.modifiedCount || 0} tools`);

    const total = await AITool.countDocuments();
    console.log(`🌟 Total AI Tools now in database: ${total}`);

    await mongoose.disconnect();
    console.log("🔌 Disconnected.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seedAITools();
