const mongoose = require("mongoose");
require("dotenv").config({ quiet: true });
const AITool = require("./models/AITool");

const ESSENTIAL_AI_TOOLS = [
  {
    toolId: 'lovable',
    name: 'Lovable',
    desc: 'Create apps and websites by chatting with AI.',
    category: 'ui-web',
    tag: 'AI Engineer',
    pricing: 'FREE TRIAL',
    isPartner: true,
    url: 'https://lovablelabs.pxf.io/4aoVMo',
    bannerType: 'lovable',
    bannerUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/673dc05e197d0263be45cb97_lovable-ai-thumb.webp'
  },
  {
    toolId: 'firefly',
    name: 'Adobe Firefly',
    desc: 'A suite of generative AI models and tools by Adobe.',
    category: 'art-images',
    tag: 'Graphic AI',
    pricing: 'FREE + PAID',
    isPartner: false,
    url: 'https://www.adobe.com/products/firefly.html',
    bannerType: 'firefly'
  },
  {
    toolId: 'bolt',
    name: 'Bolt',
    desc: 'Create stunning apps and websites by chatting with AI.',
    category: 'ui-web',
    tag: 'Fullstack AI',
    pricing: 'FREEMIUM',
    isPartner: false,
    url: 'https://bolt.new/?ref=toools',
    bannerType: 'bolt'
  },
  {
    toolId: 'webflow-ai',
    name: 'Webflow AI',
    desc: "Build websites even faster with Webflow's new AI tools.",
    category: 'ui-web',
    tag: 'Visual Dev',
    pricing: 'FREEMIUM',
    isPartner: true,
    url: 'https://try.webflow.com/via-toools',
    bannerType: 'webflow',
    bannerUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=600&auto=format&fit=crop'
  },
  {
    toolId: 'figma-ai',
    name: 'Figma AI',
    desc: "Figma's built-in AI features for faster design workflows.",
    category: 'ui-web',
    tag: 'UI Design',
    pricing: 'FREE + PAID',
    isPartner: false,
    url: 'https://www.figma.com/ai/?via=toools',
    bannerType: 'figma',
    bannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop'
  },
  {
    toolId: 'krea',
    name: 'Krea',
    desc: 'An easy way to generate images, video and sound with AI.',
    category: 'art-images',
    tag: 'Realtime AI',
    pricing: 'FREEMIUM',
    isPartner: false,
    url: 'https://www.krea.ai/?via=toools',
    bannerType: 'krea'
  },
  {
    toolId: 'claude',
    name: 'Claude',
    desc: 'The AI for problem solvers.',
    category: 'copy-llm',
    tag: 'LLM Model',
    pricing: 'FREEMIUM',
    isPartner: false,
    url: 'https://claude.ai/?via=toools',
    bannerType: 'claude'
  },
  {
    toolId: 'gemini',
    name: 'Gemini',
    desc: 'Unlock multimodal creativity for the next generation of visual apps.',
    category: 'copy-llm',
    tag: 'Multimodal AI',
    pricing: 'FREE + PAID',
    isPartner: false,
    url: 'https://gemini.google.com/?via=toools',
    bannerType: 'gemini'
  },
  {
    toolId: 'spline-ai',
    name: 'Spline AI',
    desc: 'Generate objects, animations, and textures using prompts.',
    category: '3d-motion',
    tag: '3D & Motion',
    pricing: 'FREEMIUM',
    isPartner: false,
    url: 'https://spline.design/ai?via=toools',
    bannerType: 'spline',
    bannerUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=600&auto=format&fit=crop'
  },
  {
    toolId: 'framer-ai',
    name: 'Framer AI',
    desc: 'Design websites faster with intelligent tools.',
    category: 'ui-web',
    tag: 'Site Builder',
    pricing: 'FREEMIUM',
    isPartner: true,
    url: 'https://framer.link/toools',
    bannerType: 'framer',
    bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop'
  },
  {
    toolId: 'chatgpt',
    name: 'ChatGPT',
    desc: 'Get answers, find inspiration and be more productive.',
    category: 'copy-llm',
    tag: 'AI Chatbot',
    pricing: 'FREEMIUM',
    isPartner: false,
    url: 'https://chat.openai.com/?via=toools',
    bannerType: 'chatgpt'
  },
  {
    toolId: 'v0',
    name: 'v0',
    desc: 'Generative UI system powered by AI from Vercel.',
    category: 'ui-web',
    tag: 'Frontend AI',
    pricing: 'FREEMIUM',
    isPartner: false,
    url: 'https://v0.dev/?via=toools',
    bannerType: 'v0'
  },
  {
    toolId: 'cursor',
    name: 'Cursor',
    desc: 'AI-powered code editor built for extraordinary productivity.',
    category: 'ui-web',
    tag: 'Code Editor',
    pricing: 'FREE TRIAL',
    isPartner: false,
    url: 'https://www.cursor.com/?via=toools',
    bannerType: 'cursor',
    bannerUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop'
  },
  {
    toolId: 'recraft',
    name: 'Recraft',
    desc: 'Generate consistent vectors, 3D graphics, and style palettes.',
    category: 'art-images',
    tag: 'Vector AI',
    pricing: 'FREEMIUM',
    isPartner: false,
    url: 'https://www.recraft.ai/?via=toools',
    bannerType: 'recraft'
  },
  {
    toolId: 'relume',
    name: 'Relume',
    desc: 'Generate websites, sitemaps, and wireframes with AI in seconds.',
    category: 'ui-web',
    tag: 'Wireframe AI',
    pricing: 'FREEMIUM',
    isPartner: false,
    url: 'https://www.relume.io/?via=toools',
    bannerType: 'relume'
  },
  {
    toolId: 'midjourney',
    name: 'Midjourney',
    desc: 'State of the art generative visual creation platform.',
    category: 'art-images',
    tag: 'Image AI',
    pricing: 'PAID',
    isPartner: false,
    url: 'https://www.midjourney.com/?via=toools',
    bannerType: 'midjourney',
    bannerUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=600&auto=format&fit=crop'
  }
];

const seedDB = async () => {
    try {
        const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/wallet";
        await mongoose.connect(uri, { dbName: "wallet" });
        console.log("Connected to MongoDB for seeding...");

        await AITool.deleteMany({});
        console.log("Cleared existing tools");

        await AITool.insertMany(ESSENTIAL_AI_TOOLS);
        console.log("Successfully inserted tools");

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
