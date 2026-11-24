/**
 * Editing Tools Seeder for Nexio Hub
 * Seeds 16+ top video, photo, audio, and motion editing platforms into MongoDB Atlas (editing collection)
 */

const mongoose = require("mongoose");
require("dotenv").config({ quiet: true });
const Editing = require("./editing/page");

const EDITING_TOOLS_CATALOG = [
  {
    title: 'Runway Gen-3',
    url: 'https://runwayml.com',
    category: 'Video',
    collection: 'Editing',
    description: 'Next-generation AI video editing, camera motion control, and generative synthesis.',
    badge: 'AI Video',
    logoUrl: 'https://www.google.com/s2/favicons?domain=runwayml.com&sz=128',
    bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
    favorite: true,
    readLater: false
  },
  {
    title: 'Descript',
    url: 'https://www.descript.com',
    category: 'Video',
    collection: 'Editing',
    description: 'Edit audio and video as easily as editing a text document. Studio Sound and eye contact correction.',
    badge: 'Podcast & Video',
    logoUrl: 'https://www.google.com/s2/favicons?domain=descript.com&sz=128',
    bannerUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800&auto=format&fit=crop',
    favorite: false,
    readLater: false
  },
  {
    title: 'Adobe Premiere Pro',
    url: 'https://www.adobe.com/products/premiere.html',
    category: 'Video',
    collection: 'Editing',
    description: 'Industry-standard timeline video editing software for film, TV, and web creators.',
    badge: 'Industry Standard',
    logoUrl: 'https://www.google.com/s2/favicons?domain=adobe.com&sz=128',
    bannerUrl: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=800&auto=format&fit=crop',
    favorite: true,
    readLater: false
  },
  {
    title: 'ElevenLabs',
    url: 'https://elevenlabs.io',
    category: 'Audio',
    collection: 'Editing',
    description: 'Hyper-realistic AI voice generator, multilingual dubbing, and text-to-speech audio studio.',
    badge: 'AI Audio',
    logoUrl: 'https://www.google.com/s2/favicons?domain=elevenlabs.io&sz=128',
    bannerUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
    favorite: true,
    readLater: false
  },
  {
    title: 'Topaz Video AI',
    url: 'https://www.topazlabs.com/topaz-video-ai',
    category: 'Video',
    collection: 'Editing',
    description: 'Neural network video upscaling to 4K/8K, deinterlacing, motion interpolation, and frame rate boost.',
    badge: 'Enhancement',
    logoUrl: 'https://www.google.com/s2/favicons?domain=topazlabs.com&sz=128',
    bannerUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop',
    favorite: false,
    readLater: false
  },
  {
    title: 'CapCut Pro',
    url: 'https://www.capcut.com',
    category: 'Video',
    collection: 'Editing',
    description: 'All-in-one viral video editor with auto-captions, background removal, and speed curves.',
    badge: 'Social Media',
    logoUrl: 'https://www.google.com/s2/favicons?domain=capcut.com&sz=128',
    bannerUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=800&auto=format&fit=crop',
    favorite: false,
    readLater: false
  },
  {
    title: 'DaVinci Resolve',
    url: 'https://www.blackmagicdesign.com/products/davinciresolve',
    category: 'Color & Video',
    collection: 'Editing',
    description: 'Professional 8K editing, Hollywood color correction, visual effects, and Fairlight audio post.',
    badge: 'Pro Grading',
    logoUrl: 'https://www.google.com/s2/favicons?domain=blackmagicdesign.com&sz=128',
    bannerUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=800&auto=format&fit=crop',
    favorite: true,
    readLater: false
  },
  {
    title: 'Adobe After Effects',
    url: 'https://www.adobe.com/products/aftereffects.html',
    category: 'Motion',
    collection: 'Editing',
    description: 'Create cinematic movie titles, intros, and transitions. Remove an object or animate a character.',
    badge: 'VFX & Motion',
    logoUrl: 'https://www.google.com/s2/favicons?domain=adobe.com&sz=128',
    bannerUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop',
    favorite: false,
    readLater: false
  },
  {
    title: 'Photopea',
    url: 'https://www.photopea.com',
    category: 'Photo',
    collection: 'Editing',
    description: 'Advanced free online photo and raster graphics editor supporting PSD, XCF, Sketch, and RAW formats.',
    badge: 'Web Photoshop',
    logoUrl: 'https://www.google.com/s2/favicons?domain=photopea.com&sz=128',
    bannerUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop',
    favorite: false,
    readLater: false
  },
  {
    title: 'Canva',
    url: 'https://www.canva.com',
    category: 'Photo',
    collection: 'Editing',
    description: 'Empowering the world to design with drag-and-drop templates, Magic Studio, and brand kits.',
    badge: 'Graphic Suite',
    logoUrl: 'https://www.google.com/s2/favicons?domain=canva.com&sz=128',
    bannerUrl: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=800&auto=format&fit=crop',
    favorite: false,
    readLater: false
  },
  {
    title: 'Submagic',
    url: 'https://www.submagic.co',
    category: 'Video',
    collection: 'Editing',
    description: 'AI-powered short-form video editor with dynamic captions, B-rolls, transitions, and sound effects.',
    badge: 'Viral Reels',
    logoUrl: 'https://www.google.com/s2/favicons?domain=submagic.co&sz=128',
    bannerUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
    favorite: false,
    readLater: false
  },
  {
    title: 'Audacity',
    url: 'https://www.audacityteam.org',
    category: 'Audio',
    collection: 'Editing',
    description: 'Free, open source, cross-platform audio software for multi-track recording and precise wave editing.',
    badge: 'Audio Open Source',
    logoUrl: 'https://www.google.com/s2/favicons?domain=audacityteam.org&sz=128',
    bannerUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800&auto=format&fit=crop',
    favorite: false,
    readLater: false
  },
  {
    title: 'Blender 4.2',
    url: 'https://www.blender.org',
    category: '3D & Motion',
    collection: 'Editing',
    description: 'The free and open 3D creation suite supporting modeling, rigging, animation, simulation, and rendering.',
    badge: '3D Powerhouse',
    logoUrl: 'https://www.google.com/s2/favicons?domain=blender.org&sz=128',
    bannerUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=800&auto=format&fit=crop',
    favorite: true,
    readLater: false
  },
  {
    title: 'Spline 3D',
    url: 'https://spline.design',
    category: '3D & Motion',
    collection: 'Editing',
    description: 'Design and collaborate on 3D interactive web experiences right in your browser with real-time export.',
    badge: 'Interactive 3D',
    logoUrl: 'https://www.google.com/s2/favicons?domain=spline.design&sz=128',
    bannerUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=800&auto=format&fit=crop',
    favorite: false,
    readLater: false
  },
  {
    title: 'LottieFiles',
    url: 'https://lottiefiles.com',
    category: 'Motion',
    collection: 'Editing',
    description: 'Lightweight, scalable vector animations for web, iOS, and Android. Test, edit, and collaborate on Lottie JSON.',
    badge: 'Vector Motion',
    logoUrl: 'https://www.google.com/s2/favicons?domain=lottiefiles.com&sz=128',
    bannerUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop',
    favorite: false,
    readLater: false
  }
];

async function seedEditing() {
  console.log("🚀 Starting Editing Tools Seeder for Nexio Hub...");
  try {
    const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/wallet";
    await mongoose.connect(uri, { dbName: "wallet" });
    console.log("🟢 Connected to MongoDB Atlas (wallet database)");

    const bulkOps = EDITING_TOOLS_CATALOG.map((item) => ({
      updateOne: {
        filter: { url: item.url },
        update: { $set: item },
        upsert: true
      }
    }));

    const result = await Editing.bulkWrite(bulkOps, { ordered: false });
    console.log(`✅ Editing Tools Seeding completed!`);
    console.log(`📊 Upserted: ${result.upsertedCount || 0} new editing tools`);
    console.log(`🔄 Updated/Verified: ${result.modifiedCount || 0} tools`);

    const total = await Editing.countDocuments();
    console.log(`🌟 Total Editing Tools now in database: ${total}`);

    await mongoose.disconnect();
    console.log("🔌 Disconnected.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seedEditing();
